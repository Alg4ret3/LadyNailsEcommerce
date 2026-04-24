import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import fs from "fs"
import os from "os"

const execAsync = promisify(exec)

export const generateDbDumpStep = createStep(
  "generate-db-dump",
  async (input: { databaseUrl: string }) => {
    const { databaseUrl } = input
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `backup-${timestamp}.sql`
    const tempPath = path.join(os.tmpdir(), filename)

    // Try to find pg_dump
    let pgDumpPath = "pg_dump"
    
    // Common windows paths as fallback
    const commonPaths = [
      "C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe",
      "C:\\Program Files\\PostgreSQL\\16\\bin\\pg_dump.exe",
      "C:\\Program Files\\PostgreSQL\\15\\bin\\pg_dump.exe",
      "C:\\Program Files\\PostgreSQL\\14\\bin\\pg_dump.exe"
    ]

    for (const p of commonPaths) {
      if (fs.existsSync(p)) {
        pgDumpPath = `"${p}"`
        break
      }
    }

    try {
      // Use pg_dump. We need to set PGPASSWORD env var to avoid prompt
      const url = new URL(databaseUrl)
      const password = url.password
      
      // Remove password from URL for the command line to be safer, 
      // although we use env var for password anyway
      const cmdUrl = databaseUrl.replace(`:${password}@`, "@")

      console.log(`Executing backup to ${tempPath}...`)
      
      // On Windows, we need to handle the password via env var
      const env = { ...process.env, PGPASSWORD: password }
      
      // Wrap paths in quotes to handle spaces in Windows paths
      const command = `${pgDumpPath} --dbname="${databaseUrl}" --file="${tempPath}" --no-owner --no-privileges`
      
      await execAsync(command, { env })

      return new StepResponse({ tempPath, filename }, { tempPath })
    } catch (error) {
      console.error("Failed to generate DB dump:", error)
      throw error
    }
  },
  async (data, { container }) => {
    if (data?.tempPath && fs.existsSync(data.tempPath)) {
      fs.unlinkSync(data.tempPath)
    }
  }
)

export const uploadBackupStep = createStep(
  "upload-backup",
  async (input: { tempPath: string, filename: string }, { container }) => {
    const fileModuleService = container.resolve("file")
    
    const fileContent = fs.readFileSync(input.tempPath)
    
    const files = await fileModuleService.createFiles({
      filename: `backups/${input.filename}`,
      mimeType: "application/sql",
      content: fileContent.toString("base64")
    })
    
    const uploaded = files[0]

    return new StepResponse(uploaded)
  }
)

