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
      filters: {
        id: orderId
      }
    })

    if (!order) {
      console.warn(`[orderFulfillmentHandler] ABORTO: No se recuperó ninguna orden de la base de datos con id ${orderId}.`);
      return
    }

    console.log(`[orderFulfillmentHandler] ORDEN RECUPERADA:`, JSON.stringify(order, null, 2));

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

    // Aplanamos el objeto para que BigNumbers se conviertan en números/strings
    const flattenedOrder = JSON.parse(JSON.stringify(order));

    await notificationModuleService.createNotifications({
      to: order.email,
      channel: "email",
      template: "order-fulfillment",
      data: {
        order: flattenedOrder,
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
