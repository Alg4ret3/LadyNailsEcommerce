import { model } from "@medusajs/framework/utils"

const Usage = model.define("usage", {
    id: model.id().primaryKey(),
    name: model.text(),
})

export default Usage
