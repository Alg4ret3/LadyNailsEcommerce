import fs from 'fs'
import path from 'path'

export interface ChatLogEntry {
  timestamp: string
  ip: string
  question: string
  response: string
  modelId: string
  modelName: string
  productsFetched: { id: string; title: string; handle: string; price?: number }[]
  durationMs: number
  status: 'success' | 'error'
  errorMessage?: string
}

/**
 * Writes a structured log of the chat interaction to the local file system.
 * Creates a machine-readable JSONL file and a highly readable Markdown/Text-style log file.
 */
export async function writeChatLog(entry: ChatLogEntry) {
  try {
    // Determine the logs directory at the project root
    const logsDir = path.join(process.cwd(), 'logs')

    // Ensure the directory exists
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true })
    }

    // 1. Structured JSONL Log (ideal for future analysis, dashboard parsing, or search)
    const jsonlPath = path.join(logsDir, 'chat-ai.jsonl')
    const jsonLine = JSON.stringify(entry) + '\n'
    fs.appendFileSync(jsonlPath, jsonLine, 'utf8')

    // 2. Human-Readable beautiful text log
    const textPath = path.join(logsDir, 'chat-ai.log')
    const border = '='.repeat(80)
    const separator = '-'.repeat(80)
    
    // Parse the date to a nice readable local format
    const localDate = new Date(entry.timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    const productList = entry.productsFetched.length > 0
      ? entry.productsFetched
          .map(
            (p) =>
              `  - ${p.title} (Handle: ${p.handle}${
                p.price ? `, Precio: $${p.price}` : ''
              })`
          )
          .join('\n')
      : '  Ninguno (No se requirió contexto de producto o no se encontraron coincidencias)'

    const textLog = `${border}
FECHA Y HORA: ${localDate}
DIRECCIÓN IP: ${entry.ip}
MODELO IA UTILIZADO: ${entry.modelName} (${entry.modelId})
ESTADO DE LA OPERACIÓN: ${entry.status.toUpperCase()}${
      entry.errorMessage ? ` (Error: ${entry.errorMessage})` : ''
    }
DURACIÓN DE LA RESPUESTA: ${(entry.durationMs / 1000).toFixed(2)}s
CONTEXTO DE PRODUCTOS BUSCADOS:
${productList}
${separator}
PREGUNTA DEL USUARIO:
${entry.question}
${separator}
RESPUESTA GENERADA POR LA IA:
${entry.response}
${border}\n\n`

    fs.appendFileSync(textPath, textLog, 'utf8')
  } catch (error) {
    console.error('[Chat Logger] Error writing to chat logs:', error)
  }
}
