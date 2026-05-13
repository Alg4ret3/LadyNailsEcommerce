import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { password } = req.body as { password?: string }
  
  if (!password) {
    return res.status(400).json({ message: "La contraseña es requerida" })
  }

  // Get current user ID from auth context
  const authUserId = req.auth_context?.actor_id
  
  if (!authUserId) {
    return res.status(401).json({ message: "No autenticado" })
  }

  try {
    const userModuleService = req.scope.resolve(Modules.USER)
    const user = await userModuleService.retrieveUser(authUserId)
    
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    const authModuleService = req.scope.resolve(Modules.AUTH)
    
    // We try to authenticate with the same email and provided password
    // to verify it's correct.
    try {
      const result = await authModuleService.authenticate("emailpass", {
        body: {
          email: user.email,
          password: password
        }
      } as any)

      if (result.success) {
        return res.json({ success: true })
      } else {
        return res.status(401).json({ message: "Contraseña incorrecta" })
      }
    } catch (authError) {
      // If authentication fails, it usually throws or returns success: false
      return res.status(401).json({ message: "Contraseña incorrecta o error de validación" })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
