import { model } from "@medusajs/framework/utils"

const Review = model.define("review", {
  id: model.id().primaryKey(),
  rating: model.number(),
  content: model.text(),
  customer_name: model.text(),
  customer_id: model.text().nullable(),
  status: model.enum(["pending", "approved", "rejected"]).default("pending"),
})

export default Review
