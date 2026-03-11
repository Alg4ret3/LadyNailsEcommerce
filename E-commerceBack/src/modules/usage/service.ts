import { MedusaService } from "@medusajs/framework/utils"
import Usage from "./models/usage"

class UsageModuleService extends MedusaService({
    Usage,
}) { }

export default UsageModuleService
