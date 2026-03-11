import { Module } from "@medusajs/framework/utils"
import WarrantyModuleService from "./service"
import Warranty from "./models/warranty"

export const WARRANTY_MODULE = "warranty"

export default Module(WARRANTY_MODULE, {
    service: WarrantyModuleService,
})

export const linkable = {
    warranty: Warranty,
}
