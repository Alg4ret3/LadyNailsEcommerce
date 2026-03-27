import ProductModule from "@medusajs/medusa/product"
import BrandModule from "../modules/brand"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  },
  BrandModule.linkable.brand
)