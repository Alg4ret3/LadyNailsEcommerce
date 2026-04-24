import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { restoreWorkflow } from "../../../../workflows/backup/restore"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { file, url, filename } = req.body as { file?: string, url?: string, filename?: string }
  const config = req.scope.resolve("configModule")

  if (!file && !url) {
    return res.status(400).json({ message: "No file content or URL provided" })
  }

  try {
    await restoreWorkflow(req.scope).run({
      input: {
        databaseUrl: config.projectConfig.databaseUrl as string,
        fileContent: file,
        url: url,
        filename: filename || "restore.sql"
      }
    })

    res.json({ success: true, message: "Base de datos restaurada correctamente" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
