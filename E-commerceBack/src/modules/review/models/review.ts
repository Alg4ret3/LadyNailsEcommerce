import { model } from "@medusajs/framework/utils"

const Review = model.define("review", {
  id: model.id().primaryKey(),
  rating: model.number(),
  content: model.text(),
})

export default Review
