import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function orderCreatedHandler({
  event,
  container,
}: SubscriberArgs<any>) {
  const query = container.resolve("query")
  const notificationModuleService = container.resolve("notification")

  const orderId = event.data.id

  console.log(`[orderCreatedHandler] Orden creada: ${orderId}`)

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
        "items.thumbnail"
      ],
      filters: {
        id: orderId
      }
    })

    if (!order) {
      console.warn(`[orderCreatedHandler] No se encontró la orden ${orderId}`)
      return
    }

    if (!order.email) {
      console.warn(`[orderCreatedHandler] La orden ${order.display_id} no tiene correo`)
      return
    }

    console.log(`[orderCreatedHandler] Enviando correo de confirmación de pago para orden ${order.display_id}`)

    const flattenedOrder = JSON.parse(JSON.stringify(order))

    await notificationModuleService.createNotifications({
      to: order.email,
      channel: "email",
      template: "payment-pending",
      data: {
        order: flattenedOrder,
      },
    })

    console.log(`[orderCreatedHandler] Correo de pago pendiente enviado para orden ${order.display_id}`)
  } catch (error) {
    console.error(`[orderCreatedHandler] Error:`, error)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}