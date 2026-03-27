import { MedusaService } from "@medusajs/framework/utils"
import Warranty from "./models/warranty"

class WarrantyModuleService extends MedusaService({
    Warranty,
}) { }

export default WarrantyModuleService
