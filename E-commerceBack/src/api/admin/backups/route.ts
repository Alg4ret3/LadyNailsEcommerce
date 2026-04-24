import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { backupWorkflow } from "../../../workflows/backup"
import { v2 as cloudinary } from "cloudinary"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const config = req.scope.resolve("configModule")
  
  // Configure cloudinary manually to list files
  // We can also get options from the file module provider but it's easier to just use envs here since they are available
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'backups/',
      resource_type: 'raw',
      max_results: 50
    })

    const backups = result.resources.map((r: any) => ({
      name: r.public_id.replace('backups/', ''),
      url: r.secure_url,
      created_at: r.created_at,
      size: r.bytes
    }))

    res.json({ backups })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const config = req.scope.resolve("configModule")

  try {
    const { result } = await backupWorkflow(req.scope).run({
      input: {
        databaseUrl: config.projectConfig.databaseUrl as string
      }
    })

    res.json({ backup: result })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
