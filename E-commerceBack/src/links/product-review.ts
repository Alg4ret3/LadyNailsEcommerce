import ProductModule from "@medusajs/medusa/product"
import ReviewModule from "../modules/review"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  ProductModule.linkable.product,
  {
    linkable: ReviewModule.linkable.review,
    isList: true,
  }
)
