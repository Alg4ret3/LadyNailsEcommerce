import { Module } from "@medusajs/framework/utils"
import UsageModuleService from "./service"
import Usage from "./models/usage"

export const USAGE_MODULE = "usage"

export default Module(USAGE_MODULE, {
    service: UsageModuleService,
})

export const linkable = {
    usage: Usage,
}
