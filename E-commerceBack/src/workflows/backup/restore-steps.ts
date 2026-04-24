import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import fs from "fs"
import os from "os"
import https from "https"

const execAsync = promisify(exec)

export const restoreDbDumpStep = createStep(
  "restore-db-dump",
  async (input: { databaseUrl: string, fileContent?: string, url?: string, filename: string }) => {
    const { databaseUrl, fileContent, url } = input
    const tempPath = path.join(os.tmpdir(), `restore-${Date.now()}.sql`)
    
    if (fileContent) {
      fs.writeFileSync(tempPath, Buffer.from(fileContent, "base64"))
    } else if (url) {
      // Download from URL
      await new Promise((resolve, reject) => {
        const file = fs.createWriteStream(tempPath)
        https.get(url, (response) => {
          response.pipe(file)
          file.on('finish', () => {
            file.close()
            resolve(true)
          })
        }).on('error', (err) => {
          fs.unlink(tempPath, () => {})
          reject(err)
        })
      })
    } else {
      throw new Error("No file content or URL provided for restore")
    }

    // Try to find psql
    let psqlPath = "psql"
    const commonPaths = [
      "C:\\Program Files\\PostgreSQL\\17\\bin\\psql.exe",
      "C:\\Program Files\\PostgreSQL\\16\\bin\\psql.exe",
      "C:\\Program Files\\PostgreSQL\\15\\bin\\psql.exe",
      "C:\\Program Files\\PostgreSQL\\14\\bin\\psql.exe"
    ]

    for (const p of commonPaths) {
      if (fs.existsSync(p)) {
        psqlPath = `"${p}"`
        break
      }
    }

    try {
      const urlConn = new URL(databaseUrl)
      const password = urlConn.password
      const env = { ...process.env, PGPASSWORD: password }

      console.log(`Executing restore from ${tempPath}...`)
      
      await execAsync(`${psqlPath} --dbname="${databaseUrl}" --file="${tempPath}"`, {
        env
      })

      return new StepResponse({ success: true }, { tempPath })
    } catch (error) {
      console.error("Failed to restore DB dump:", error)
      throw error
    }
  },
  async (data) => {
    if (data?.tempPath && fs.existsSync(data.tempPath)) {
      fs.unlinkSync(data.tempPath)
    }
  }
)
