import { 
  createWorkflow, 
  WorkflowResponse 
} from "@medusajs/framework/workflows-sdk"
import { restoreDbDumpStep } from "./restore-steps"

interface RestoreWorkflowInput {
  databaseUrl: string
  fileContent?: string // base64
  url?: string
  filename: string
}

export const restoreWorkflow = createWorkflow(
  "restore-database",
  (input: RestoreWorkflowInput) => {
    restoreDbDumpStep(input)

    return new WorkflowResponse({
      success: true
    })
  }
)
