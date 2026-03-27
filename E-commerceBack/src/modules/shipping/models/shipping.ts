import { model } from "@medusajs/framework/utils"

const Shipping = model.define("shipping", {
    id: model.id().primaryKey(),
    name: model.text(),
})

export default Shipping
