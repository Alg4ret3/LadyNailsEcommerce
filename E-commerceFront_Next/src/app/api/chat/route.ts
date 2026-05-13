import { NextRequest } from 'next/server'
import { streamChatCompletion } from '@/services/ai-chat/openrouter'
import { fetchRelevantProducts } from '@/services/ai-chat/medusa-context'
import { buildSystemPrompt, buildContextPrompt } from '@/services/ai-chat/prompts'
import { checkRateLimit } from '@/services/ai-chat/rate-limiter'
import { ChatRequest, ProductContext } from '@/services/ai-chat/types'

// ─── POST /api/chat ──────────────────────────────────────────────────────────
// Streams AI responses using Server-Sent Events

export async function POST(request: NextRequest) {
  try {
    // ── Rate Limiting ──────────────────────────────────────────────────────
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown'

    const rateLimit = checkRateLimit(ip)

    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Has enviado muchos mensajes. Espera un momento antes de continuar.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetAt.toString(),
          },
        }
      )
    }

    // ── Parse & Validate Request ───────────────────────────────────────────
    const body: ChatRequest = await request.json()

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Mensajes requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Sanitize messages (max 20 messages, max 500 chars each)
    const sanitizedMessages = body.messages
      .slice(-20)
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content.substring(0, 500).trim(),
      }))
      .filter((m) => m.content.length > 0)

    const lastUserMessage = sanitizedMessages
      .filter((m) => m.role === 'user')
      .pop()?.content || ''

    // ── Fetch Product Context ──────────────────────────────────────────────
    let products: ProductContext[] = []
    try {
      products = await fetchRelevantProducts(lastUserMessage)
    } catch (err) {
      console.warn('[Chat API] Product fetch failed:', err)
    }

    // ── Build Messages for AI ──────────────────────────────────────────────
    const systemPrompt = buildSystemPrompt()
    const contextPrompt = buildContextPrompt(products)

    const aiMessages = [
      { role: 'system' as const, content: systemPrompt + contextPrompt },
      ...sanitizedMessages,
    ]

    // ── Stream Response ────────────────────────────────────────────────────
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      start(controller) {
        // First, send products if any
        if (products.length > 0) {
          const productsEvent = `data: ${JSON.stringify({
            type: 'products',
            products,
          })}\n\n`
          controller.enqueue(encoder.encode(productsEvent))
        }

        streamChatCompletion({
          messages: aiMessages,
          onToken(token) {
            const event = `data: ${JSON.stringify({
              type: 'text',
              content: token,
            })}\n\n`
            controller.enqueue(encoder.encode(event))
          },
          onDone() {
            const event = `data: ${JSON.stringify({ type: 'done' })}\n\n`
            controller.enqueue(encoder.encode(event))
            controller.close()
          },
          onError(error) {
            const event = `data: ${JSON.stringify({
              type: 'error',
              error,
            })}\n\n`
            controller.enqueue(encoder.encode(event))
            controller.close()
          },
        })
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      },
    })
  } catch (error: any) {
    console.error('[Chat API] Error:', error)
    return new Response(
      JSON.stringify({
        error: 'Error interno del servidor. Intenta de nuevo.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
