import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import ShippingModuleService from "../../../../modules/shipping/service"
import { SHIPPING_MODULE } from "../../../../modules/shipping"

export async function DELETE(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const shippingService = req.scope.resolve(
        SHIPPING_MODULE
    ) as ShippingModuleService

    await shippingService.deleteShippings(req.params.id)

    res.json({ success: true })
}
