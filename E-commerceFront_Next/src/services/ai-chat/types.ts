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
  { id: 'google/gemini-2.0-flash-lite-preview-02-05:free', name: 'Gemini 2.0 Flash Lite', priority: 1 },
  { id: 'google/gemini-2.0-pro-exp-02-05:free', name: 'Gemini 2.0 Pro', priority: 2 },
  { id: 'deepseek/deepseek-chat:free', name: 'DeepSeek Chat', priority: 3 },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B', priority: 4 },
  { id: 'qwen/qwen-2.5-72b-instruct:free', name: 'Qwen 2.5 72B', priority: 5 },
]
