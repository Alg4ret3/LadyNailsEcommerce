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
  { id: 'inclusionai/ring-2.6-1t:free', name: 'InclusionAI Ring', priority: 1 },
  { id: 'deepseek/deepseek-chat-v3-0324:free', name: 'DeepSeek V3', priority: 2 },
  { id: 'qwen/qwen3-32b:free', name: 'Qwen3 32B', priority: 3 },
  { id: 'meta-llama/llama-4-maverick:free', name: 'Llama 4 Maverick', priority: 4 },
]
