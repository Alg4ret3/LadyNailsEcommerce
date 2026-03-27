import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import UsageModuleService from "../../../modules/usage/service"
import { USAGE_MODULE } from "../../../modules/usage"

type CreateUsageBody = {
    name: string
}

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const usageService = req.scope.resolve(
        USAGE_MODULE
    ) as UsageModuleService

    const usages = await usageService.listUsages()

    res.json({ usages })
}

export async function POST(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const usageService = req.scope.resolve(
        USAGE_MODULE
    ) as UsageModuleService

    const usage = await usageService.createUsages(req.body as CreateUsageBody)

    res.json({ usage })
}
