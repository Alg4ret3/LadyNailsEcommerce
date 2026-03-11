import ProductModule from "@medusajs/medusa/product"
import ShippingModule from "../modules/shipping"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
    ProductModule.linkable.product,
    ShippingModule.linkable.shipping
)
