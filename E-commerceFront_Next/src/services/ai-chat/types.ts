// ─── AI Chat Types ────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  products?: ProductContext[]
}

export interface ProductContext {
  id: string
  title: string
  handle: string
  description?: string
  thumbnail?: string | null
  price?: number
  currency?: string
  category?: string
  collection?: string
  inStock?: boolean
  variants?: {
    title: string
    price: number
    inStock: boolean
  }[]
}

export interface ChatRequest {
  messages: { role: 'user' | 'assistant'; content: string }[]
  sessionId?: string
}

export interface ChatStreamChunk {
  type: 'text' | 'products' | 'done' | 'error'
  content?: string
  products?: ProductContext[]
  error?: string
}

export interface OpenRouterModel {
  id: string
  name: string
  priority: number
}

// Models to use — ordered by priority (free tier)
export const AI_MODELS: OpenRouterModel[] = [
  { id: 'openrouter/free', name: 'Auto-Ruteador de Modelos Gratuitos', priority: 1 },
  { id: 'qwen/qwen-2.5-7b-instruct:free', name: 'Qwen 2.5 7B Instruct', priority: 2 },
  { id: 'meta-llama/llama-3.2-3b-instruct:free', name: 'Llama 3.2 3B Instruct', priority: 3 },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B Instruct', priority: 4 },
]
