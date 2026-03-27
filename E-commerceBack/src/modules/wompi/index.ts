import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { WompiPaymentProvider } from "./service"

export default ModuleProvider(Modules.PAYMENT, {
  services: [WompiPaymentProvider],
})
