import ProductModule from "@medusajs/medusa/product"
import ShippingModule from "../modules/shipping"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  },
  ShippingModule.linkable.shipping
)
