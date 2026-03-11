import ProductModule from "@medusajs/medusa/product"
import WarrantyModule from "../modules/warranty"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
    ProductModule.linkable.product,
    WarrantyModule.linkable.warranty
)
