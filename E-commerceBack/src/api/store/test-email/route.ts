import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const notificationModuleService = req.scope.resolve("notification")
  const query = req.scope.resolve("query")

  // 1. Busca un ID de una orden real que ya tengas en tu base de datos
  // Puedes verlos en tu panel de admin o haciendo un 'select * from order'
  const orderId = "order_01KNR84FYGB0YN38PJJPJ3RS94" 

  try {
    const { data: [order] } = await query.graph({
      entity: "order",
      fields: [
         "id",
        "display_id",
        "email",
        "currency_code",
        "total",
        "subtotal",
        "tax_total",
        "order_total",
        "shipping_total",
        "discount_total",
        "item_total",
        "item_subtotal",
        "shipping_subtotal",
        "summary.*",
        "shipping_address.*",
        "items.*",
        "fulfillments.id",
        "fulfillments.labels.*"
      ],
      filters: { id: orderId }
    })

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada para la prueba" })
    }

    // Aplanamos igual que en el subscriber
    const flattenedOrder = JSON.parse(JSON.stringify(order))

    // 2. Disparamos la notificación manualmente
    await notificationModuleService.createNotifications({
      to: "maicolcoralbravo@gmail.com", // Cambia esto por tu correo para ver el resultado
      channel: "email",
      template: "order-fulfillment",
      data: {
        order: flattenedOrder,
        fulfillment: flattenedOrder.fulfillments?.[0] || { labels: [] }
      },
    })

    res.json({ 
      message: "Correo de prueba enviado correctamente",
      debug_order: flattenedOrder
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
