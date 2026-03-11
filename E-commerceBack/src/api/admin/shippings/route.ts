import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import ShippingModuleService from "../../../modules/shipping/service"
import { SHIPPING_MODULE } from "../../../modules/shipping"

type CreateShippingBody = {
    name: string
}

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const shippingService = req.scope.resolve(
        SHIPPING_MODULE
    ) as ShippingModuleService

    const shippings = await shippingService.listShippings()

    res.json({ shippings })
}

export async function POST(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const shippingService = req.scope.resolve(
        SHIPPING_MODULE
    ) as ShippingModuleService

    const shipping = await shippingService.createShippings(req.body as CreateShippingBody)

    res.json({ shipping })
}
