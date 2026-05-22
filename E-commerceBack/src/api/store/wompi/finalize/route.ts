import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { completeCartWorkflow } from "@medusajs/medusa/core-flows"
import { MedusaError } from "@medusajs/framework/utils"

type WompiTx = {
  id: string
  reference: string
  status: string
  amount_in_cents: number
  currency: string
}

async function fetchWompiTransaction(
  id: string | undefined,
  reference: string | undefined
): Promise<WompiTx | null> {
  const privateKey = process.env.WOMPI_PRIVATE_KEY
  const environment = process.env.WOMPI_ENVIRONMENT || "test"

  if (!privateKey) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Configuración de pasarela incompleta."
    )
  }

  const baseUrl =
    environment === "production"
      ? "https://production.wompi.co/v1"
      : "https://sandbox.wompi.co/v1"

  if (id) {
    const response = await fetch(`${baseUrl}/transactions/${encodeURIComponent(id)}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${privateKey}` },
    })
    if (!response.ok) return null
    const json = await response.json()
    return json.data as WompiTx
  }

  if (reference) {
    const response = await fetch(
      `${baseUrl}/transactions?reference=${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${privateKey}` },
      }
    )
    if (!response.ok) return null
    const json = await response.json()
    const transactions: WompiTx[] = json.data || []
    return transactions.length > 0 ? transactions[0] : null
  }

  return null
}

/**
 * POST /store/wompi/finalize
 * Body: { cart_id: string, id?: string, reference?: string }
 *
 * Verifies Wompi payment, validates cart + payment session reference, then runs
 * Medusa completeCartWorkflow (authorize + create order with items and payments).
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const body = (req.body || {}) as {
      cart_id?: string
      id?: string
      reference?: string
    }

    const cartId = body.cart_id
    const wompiId = body.id
    const wompiReference = body.reference

    if (!cartId) {
      return res.status(400).json({ message: "cart_id es requerido." })
    }
    if (!wompiId && !wompiReference) {
      return res.status(400).json({ message: "id o reference de Wompi es requerido." })
    }

    const tx = await fetchWompiTransaction(wompiId, wompiReference)
    if (!tx) {
      return res.status(404).json({ message: "Transacción de Wompi no encontrada." })
    }

    if (tx.status !== "APPROVED") {
      return res.status(400).json({
        message: `El pago no está aprobado. Estado actual: ${tx.status}`,
        status: tx.status,
      })
    }

    const query = req.scope.resolve("query")
    const { data: carts } = await query.graph({
      entity: "cart",
      fields: [
        "id",
        "completed_at",
        "items.id",
        "items.quantity",
        "payment_collection.id",
        "payment_collection.payment_sessions.id",
        "payment_collection.payment_sessions.provider_id",
        "payment_collection.payment_sessions.data",
        "payment_collection.payment_sessions.status",
      ],
      filters: { id: cartId },
    })

    const cart = carts?.[0] as Record<string, unknown> | undefined
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado." })
    }

    if (cart.completed_at) {
      const { result } = await completeCartWorkflow(req.scope).run({
        input: { id: cartId },
        throwOnError: false,
      })
      return res.status(200).json({
        type: "order",
        order: result?.id ? { id: result.id } : null,
        already_completed: true,
      })
    }

    const items = (cart.items as unknown[]) || []
    if (items.length === 0) {
      return res.status(400).json({
        message: "El carrito no tiene productos. No se puede crear la orden.",
      })
    }

    const collection = cart.payment_collection as {
      payment_sessions?: Array<{
        id: string
        provider_id: string
        data?: Record<string, unknown>
        status?: string
      }>
    } | null

    const wompiSession = collection?.payment_sessions?.find((s) =>
      s.provider_id?.includes("wompi")
    )

    if (!wompiSession) {
      return res.status(400).json({
        message: "No hay sesión de pago Wompi activa en este carrito.",
      })
    }

    const sessionReference = wompiSession.data?.reference as string | undefined
    if (sessionReference && sessionReference !== tx.reference) {
      return res.status(400).json({
        message: "La referencia de pago no coincide con el carrito de la compra.",
      })
    }

    const { result, errors } = await completeCartWorkflow(req.scope).run({
      input: { id: cartId },
      throwOnError: false,
    })

    if (errors?.length) {
      const message =
        errors[0]?.error?.message || "No se pudo completar el carrito."
      console.error("[wompi/finalize] completeCartWorkflow errors:", errors)
      return res.status(409).json({ message })
    }

    const orderId = result?.id
    if (!orderId) {
      return res.status(500).json({ message: "La orden no se generó correctamente." })
    }

    return res.status(200).json({
      type: "order",
      order: { id: orderId },
      transaction: {
        id: tx.id,
        reference: tx.reference,
        status: tx.status,
      },
    })
  } catch (err: unknown) {
    console.error("Error en /store/wompi/finalize:", err)
    const message =
      err instanceof Error ? err.message : "Error interno finalizando el pedido."
    return res.status(500).json({ message })
  }
}
