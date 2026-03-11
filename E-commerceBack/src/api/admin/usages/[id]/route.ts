import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import UsageModuleService from "../../../../modules/usage/service"
import { USAGE_MODULE } from "../../../../modules/usage"

export async function DELETE(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const usageService = req.scope.resolve(
        USAGE_MODULE
    ) as UsageModuleService

    await usageService.deleteUsages(req.params.id)

    res.json({ success: true })
}
