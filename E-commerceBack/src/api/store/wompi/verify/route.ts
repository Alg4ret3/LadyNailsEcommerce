import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * GET /store/wompi/verify?id=xxx or ?reference=xxx
 *
 * Verifies the status of a Wompi transaction by its transaction ID or reference.
 * Used after redirect-based payments (PSE, Nequi, Bancolombia) where Wompi
 * redirects the user back to the checkout page with '?id={transaction_id}'.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const id = req.query?.id as string | undefined;
    const reference = req.query?.reference as string | undefined;

    if (!id && !reference) {
      return res.status(400).json({ message: "El parámetro 'id' o 'reference' es requerido." });
    }

    const privateKey = process.env.WOMPI_PRIVATE_KEY;
    const environment = process.env.WOMPI_ENVIRONMENT || "test";

    if (!privateKey) {
      console.error("WOMPI_PRIVATE_KEY no está configurada.");
      return res.status(500).json({ message: "Configuración de pasarela incompleta." });
    }

    const baseUrl =
      environment === "production"
        ? "https://production.wompi.co/v1"
        : "https://sandbox.wompi.co/v1";

    let tx: any = null;

    if (id) {
      const response = await fetch(`${baseUrl}/transactions/${encodeURIComponent(id)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${privateKey}`,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Wompi API error:", response.status, errorBody);
        return res.status(502).json({ message: "Error consultando la pasarela de pago por ID." });
      }

      const json = await response.json();
      tx = json.data;
    } else if (reference) {
      const response = await fetch(`${baseUrl}/transactions?reference=${encodeURIComponent(reference)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${privateKey}`,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Wompi API error:", response.status, errorBody);
        return res.status(502).json({ message: "Error consultando la pasarela de pago por referencia." });
      }

      const json = await response.json();
      const transactions: any[] = json.data || [];
      if (transactions.length > 0) {
        tx = transactions[0];
      }
    }

    if (!tx) {
      return res.status(200).json({ status: "NOT_FOUND", transaction: null });
    }

    return res.status(200).json({
      status: tx.status as "APPROVED" | "DECLINED" | "VOIDED" | "ERROR" | "PENDING",
      transaction: {
        id: tx.id,
        reference: tx.reference,
        amount_in_cents: tx.amount_in_cents,
        currency: tx.currency,
        payment_method_type: tx.payment_method_type,
        status: tx.status,
        created_at: tx.created_at,
      },
    });
  } catch (err: any) {
    console.error("Error en /store/wompi/verify:", err);
    return res.status(500).json({ message: "Error interno verificando el pago." });
  }
}
