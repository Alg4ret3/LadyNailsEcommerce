import ProductModule from "@medusajs/medusa/product"
import UsageModule from "../modules/usage"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  },
  UsageModule.linkable.usage
)
