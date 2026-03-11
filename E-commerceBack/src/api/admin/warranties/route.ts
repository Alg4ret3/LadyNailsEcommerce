import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import WarrantyModuleService from "../../../modules/warranty/service"
import { WARRANTY_MODULE } from "../../../modules/warranty"

type CreateWarrantyBody = {
    name: string
}

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const warrantyService = req.scope.resolve(
        WARRANTY_MODULE
    ) as WarrantyModuleService

    const warranties = await warrantyService.listWarranties()

    res.json({ warranties })
}

export async function POST(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const warrantyService = req.scope.resolve(
        WARRANTY_MODULE
    ) as WarrantyModuleService

    const warranty = await warrantyService.createWarranties(req.body as CreateWarrantyBody)

    res.json({ warranty })
}
