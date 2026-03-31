import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function orderFulfillmentHandler({
  event,
  container,
}: SubscriberArgs<any>) {
  const query = container.resolve("query")
  const notificationModuleService = container.resolve("notification")

  const fulfillmentId = event.data.id || event.data.fulfillment_id
  let orderId = event.data.order_id

  console.log(`[orderFulfillmentHandler] Iniciando evento de envío. Event data:`, event.data);

  try {
    if (!orderId && fulfillmentId) {
      // En Medusa v2, Order y Fulfillment son servicios separados. No podemos filtrar
      // un Order directamente usando la tabla SQL "fulfillments". 
      // Por eso, recuperamos el Fulfillment usando query.graph y solicitamos su "order" vinculado.
      const { data: fulfillments } = await query.graph({
        entity: "fulfillment",
        fields: ["id", "order.*"],
        filters: { id: fulfillmentId }
      })

      if (fulfillments && fulfillments.length > 0) {
        const fullNode: any = fulfillments[0];
        orderId = fullNode.order_id || fullNode.order?.id
        console.log(`[orderFulfillmentHandler] Encontrada la orden ${orderId} para el fulfillment ${fulfillmentId}`);
      } else {
        console.warn(`[orderFulfillmentHandler] ADVERTENCIA: No se encontró orden para el fulfillment ${fulfillmentId}`);
      }
    }

    if (!orderId) {
      console.warn(`[orderFulfillmentHandler] ABORTO: No hay orderId para buscar los detalles.`);
      return
    }

    // Fetch the order and its fulfillments
    const { data: [order] } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "email",
        "display_id",
        "currency_code",
        "total",
        "shipping_address.first_name",
        "shipping_address.last_name",
        "shipping_address.address_1",
        "shipping_address.city",
        "items.product_title",
        "items.variant_title",
        "items.quantity",
        "items.unit_price",
        "fulfillments.id",
        "fulfillments.labels.tracking_url",
        "fulfillments.labels.tracking_number",
        "fulfillments.labels.label_url"
      ],
      filters: {
        id: orderId
      }
    })

    if (!order) {
      console.warn(`[orderFulfillmentHandler] ABORTO: No se recuperó ninguna orden de la base de datos con id ${orderId}.`);
      return
    }

    if (!order.email) {
      console.warn(`[orderFulfillmentHandler] ABORTO: La orden ${order.display_id} no tiene correo (email) establecido.`);
      return
    }

    let fulfillment: any = null
    if (fulfillmentId) {
      fulfillment = order.fulfillments?.find((f: any) => f.id === fulfillmentId)
    } else if (order.fulfillments && order.fulfillments.length > 0) {
      // Fallback to the latest fulfillment if ID is not in event payload
      fulfillment = order.fulfillments[order.fulfillments.length - 1]
    }

    if (!fulfillment) {
      console.warn(`[orderFulfillmentHandler] ABORTO: No se encontró la información de fulfillment en la orden (id buscado: ${fulfillmentId}).`);
      return // No se encontró información de envío
    }

    console.log(`[orderFulfillmentHandler] Preparando notificación para la orden ${order.display_id} al correo ${order.email}...`);

    await notificationModuleService.createNotifications({
      to: order.email,
      channel: "email",
      template: "order-fulfillment",
      data: {
        order,
        fulfillment,
      },
    })

    console.log(`[orderFulfillmentHandler] ÉXITO: Correo de notificación enviado para la orden ${order.display_id}.`);
  } catch (error) {
    console.error(`[orderFulfillmentHandler] ERROR EXCEPCIÓN atrapada durante el envío:`, error);
  }
}

export const config: SubscriberConfig = {
  event: "shipment.created",
}
