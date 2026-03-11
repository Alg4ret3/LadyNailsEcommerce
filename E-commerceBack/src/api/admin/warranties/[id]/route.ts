import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import WarrantyModuleService from "../../../../modules/warranty/service"
import { WARRANTY_MODULE } from "../../../../modules/warranty"

export async function DELETE(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const warrantyService = req.scope.resolve(
        WARRANTY_MODULE
    ) as WarrantyModuleService

    await warrantyService.deleteWarranties(req.params.id)

    res.json({ success: true })
}
