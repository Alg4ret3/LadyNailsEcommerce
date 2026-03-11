import { Module } from "@medusajs/framework/utils"
import ShippingModuleService from "./service"
import Shipping from "./models/shipping"

export const SHIPPING_MODULE = "shipping"

export default Module(SHIPPING_MODULE, {
    service: ShippingModuleService,
})

export const linkable = {
    shipping: Shipping,
}
