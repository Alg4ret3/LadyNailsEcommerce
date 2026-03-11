import ProductModule from "@medusajs/medusa/product"
import WarrantyModule from "../modules/warranty"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  },
  WarrantyModule.linkable.warranty
)
