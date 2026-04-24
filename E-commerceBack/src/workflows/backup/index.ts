import { 
  createWorkflow, 
  WorkflowResponse 
} from "@medusajs/framework/workflows-sdk"
import { 
  generateDbDumpStep, 
  uploadBackupStep
} from "./steps"

interface BackupWorkflowInput {
  databaseUrl: string
}

export const backupWorkflow = createWorkflow(
  "backup-database",
  (input: BackupWorkflowInput) => {
    const dump = generateDbDumpStep({ databaseUrl: input.databaseUrl })
    
    const upload = uploadBackupStep({ 
      tempPath: dump.tempPath, 
      filename: dump.filename 
    })

    return new WorkflowResponse({
      url: upload.url,
      filename: dump.filename
    })
  }
)
