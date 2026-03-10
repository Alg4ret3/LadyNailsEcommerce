import { Module } from "@medusajs/framework/utils"
import BrandModuleService from "./service"
import Brand from "./models/brand"

export const BRAND_MODULE = "brand"

export default Module(BRAND_MODULE, {
  service: BrandModuleService,
})

export const linkable = {
  brand: Brand,
}