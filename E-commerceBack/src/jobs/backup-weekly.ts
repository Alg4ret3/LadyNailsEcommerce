import { MedusaContainer } from "@medusajs/framework/types"
import { backupWorkflow } from "../workflows/backup"

export default async function backupWeeklyJob(
  container: MedusaContainer
) {
  const logger = container.resolve("logger")
  const config = container.resolve("configModule")

  logger.info("Starting weekly database backup...")

  try {
    const { result } = await backupWorkflow(container).run({
      input: {
        databaseUrl: config.projectConfig.databaseUrl as string
      }
    })

    logger.info(`Weekly backup completed successfully: ${result.filename}`)
  } catch (error) {
    logger.error(`Weekly backup failed: ${error.message}`)
  }
}

export const config = {
  name: "backup-weekly-job",
  // Every Sunday at 00:00
  schedule: "0 0 * * 0",
}
