import { AI_MODELS } from './types'

// ─── OpenRouter Client ───────────────────────────────────────────────────────
// Compatible with OpenAI SDK format, with model fallback

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OpenRouterStreamOptions {
  messages: ChatCompletionMessage[]
  onToken: (token: string) => void
  onDone: () => void
  onError: (error: string) => void
  signal?: AbortSignal
}

/**
 * Streams a chat completion from OpenRouter with automatic model fallback.
 */
export async function streamChatCompletion({
  messages,
  onToken,
  onDone,
  onError,
  signal,
}: OpenRouterStreamOptions): Promise<void> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    onError('OpenRouter API key not configured')
    return
  }

  // Try models in priority order
  for (const model of AI_MODELS) {
    try {
      await attemptStream({
        model: model.id,
        messages,
        apiKey,
        onToken,
        onDone,
        onError,
        signal,
      })
      return // Success — exit
    } catch (err: any) {
      console.warn(`[OpenRouter] Model ${model.name} failed:`, err.message)

      // If it's the last model, report the error
      if (model.priority === AI_MODELS.length) {
        onError(`Todos los modelos están ocupados. Intenta de nuevo en unos segundos.`)
        return
      }
      // Otherwise try next model
    }
  }
}

// ─── Internal Stream Implementation ──────────────────────────────────────────

async function attemptStream({
  model,
  messages,
  apiKey,
  onToken,
  onDone,
  onError,
  signal,
}: {
  model: string
  messages: ChatCompletionMessage[]
  apiKey: string
  onToken: (token: string) => void
  onDone: () => void
  onError: (error: string) => void
  signal?: AbortSignal
}): Promise<void> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_STORE_URL || 'http://localhost:3000',
      'X-Title': 'LadyNails Chat Assistant',
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.9,
    }),
    signal,
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`HTTP ${response.status}: ${errorBody}`)
  }

  if (!response.body) {
    throw new Error('No response body')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        onDone()
        break
      }

      buffer += decoder.decode(value, { stream: true })

      // Process SSE lines
      const lines = buffer.split('\n')
      buffer = lines.pop() || '' // Keep incomplete line in buffer

      for (const line of lines) {
        const trimmed = line.trim()

        if (!trimmed || trimmed === 'data: [DONE]') {
          if (trimmed === 'data: [DONE]') {
            onDone()
            return
          }
          continue
        }

        if (trimmed.startsWith('data: ')) {
          try {
            const json = JSON.parse(trimmed.slice(6))
            const content = json.choices?.[0]?.delta?.content

            if (content) {
              onToken(content)
            }
          } catch {
            // Skip malformed JSON chunks
          }
        }
      }
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return
    }
    throw err
  }
}
