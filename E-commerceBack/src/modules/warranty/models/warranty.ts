import { model } from "@medusajs/framework/utils"

const Warranty = model.define("warranty", {
    id: model.id().primaryKey(),
    name: model.text(),
})

export default Warranty
