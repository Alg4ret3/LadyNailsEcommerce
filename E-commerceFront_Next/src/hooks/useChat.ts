'use client'

import { useState, useCallback, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  products?: ProductCard[]
  isStreaming?: boolean
}

export interface ProductCard {
  id: string
  title: string
  handle: string
  description?: string
  thumbnail?: string | null
  price?: number
  currency?: string
  category?: string
  inStock?: boolean
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'ladynails_chat_history'
const MAX_HISTORY = 50

function loadHistory(): ChatMessage[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const messages = JSON.parse(stored) as ChatMessage[]
    return messages.slice(-MAX_HISTORY)
  } catch {
    return []
  }
}

function saveHistory(messages: ChatMessage[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(messages.slice(-MAX_HISTORY))
    )
  } catch {
    // Storage full — silently fail
  }
}

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadHistory())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    setError(null)

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    saveHistory(updatedMessages)

    // Create placeholder assistant message
    const assistantId = generateId()
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsLoading(true)

    // Abort previous request if any
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      // Build conversation history for context (last 10 messages)
      const historyForApi = updatedMessages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyForApi }),
        signal: controller.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Error ${response.status}`)
      }

      if (!response.body) {
        throw new Error('No response body')
      }

      // Read SSE stream
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullContent = ''
      let products: ProductCard[] = []

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data: ')) continue

          try {
            const data = JSON.parse(trimmed.slice(6))

            if (data.type === 'text' && data.content) {
              fullContent += data.content
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: fullContent, isStreaming: true }
                    : m
                )
              )
            }

            if (data.type === 'products' && data.products) {
              products = data.products
            }

            if (data.type === 'error') {
              throw new Error(data.error)
            }

            if (data.type === 'done') {
              setMessages((prev) => {
                const final = prev.map((m) =>
                  m.id === assistantId
                    ? {
                        ...m,
                        content: fullContent,
                        products: products.length > 0 ? products : undefined,
                        isStreaming: false,
                      }
                    : m
                )
                saveHistory(final)
                return final
              })
            }
          } catch (parseErr: any) {
            if (parseErr.message && !parseErr.message.includes('JSON')) {
              throw parseErr
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return

      const errorMessage = err.message || 'Error de conexión'
      setError(errorMessage)

      // Update assistant message with error
      setMessages((prev) => {
        const updated = prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  m.content ||
                  'Lo siento, hubo un error al procesar tu mensaje. Intenta de nuevo. 😔',
                isStreaming: false,
              }
            : m
        )
        saveHistory(updated)
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading])

  const clearHistory = useCallback(() => {
    setMessages([])
    setError(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort()
    setIsLoading(false)
    setMessages((prev) =>
      prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
    )
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearHistory,
    stopStreaming,
  }
}
