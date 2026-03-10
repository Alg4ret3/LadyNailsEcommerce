import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BrandModuleService from "../../../modules/brand/service"
import { BRAND_MODULE } from "../../../modules/brand"

type CreateBrandBody = {
  name: string
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const brandService = req.scope.resolve(
    BRAND_MODULE
  ) as BrandModuleService

  const brands = await brandService.listBrands()

  res.json({ brands })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const brandService = req.scope.resolve(
    BRAND_MODULE
  ) as BrandModuleService

  const brand = await brandService.createBrands(req.body as CreateBrandBody)

  res.json({ brand })
}