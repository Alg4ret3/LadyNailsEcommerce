import ProductModule from "@medusajs/medusa/product"
import UsageModule from "../modules/usage"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
    ProductModule.linkable.product,
    UsageModule.linkable.usage
)
