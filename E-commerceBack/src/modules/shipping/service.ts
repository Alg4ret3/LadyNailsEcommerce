import { MedusaService } from "@medusajs/framework/utils"
import Shipping from "./models/shipping"

class ShippingModuleService extends MedusaService({
    Shipping,
}) { }

export default ShippingModuleService
