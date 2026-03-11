import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BrandModuleService from "../../../../modules/brand/service"
import { BRAND_MODULE } from "../../../../modules/brand"

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const brandService = req.scope.resolve(
    BRAND_MODULE
  ) as BrandModuleService

  await brandService.deleteBrands(req.params.id)

  res.json({ success: true })
}