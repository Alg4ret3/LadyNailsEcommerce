import ProductModule from "@medusajs/medusa/product"
import BrandModule from "../modules/brand"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  ProductModule.linkable.product,
  BrandModule.linkable.brand
)