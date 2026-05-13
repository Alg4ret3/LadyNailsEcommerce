'use client'

import { motion } from 'framer-motion'
import type { ChatMessage, ProductCard } from '@/hooks/useChat'
import Image from 'next/image'
import Link from 'next/link'

interface ChatBubbleProps {
  message: ChatMessage
  isLast?: boolean
}

export function ChatBubble({ message, isLast }: ChatBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex items-start gap-2.5 px-4 py-1 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      {isUser ? (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-500 dark:to-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white text-xs font-bold">T</span>
        </div>
      ) : (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white text-xs font-bold">N</span>
        </div>
      )}

      {/* Content */}
      <div className={`max-w-[80%] flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <div
          className={`
            rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed
            ${
              isUser
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-tr-sm shadow-md shadow-pink-500/10'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm'
            }
          `}
        >
          <FormattedContent content={message.content} isUser={isUser} />

          {/* Streaming cursor */}
          {message.isStreaming && (
            <motion.span
              className="inline-block w-0.5 h-4 bg-current ml-0.5 align-middle"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          )}
        </div>

        {/* Product Cards */}
        {message.products && message.products.length > 0 && (
          <ProductCards products={message.products} />
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-slate-400 dark:text-slate-500 px-1 select-none">
          {new Date(message.timestamp).toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </motion.div>
  )
}

// ─── Formatted Content ────────────────────────────────────────────────────────

function FormattedContent({ content, isUser }: { content: string; isUser: boolean }) {
  if (!content) return null

  // Simple markdown-like formatting
  const lines = content.split('\n')

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        // Bold text
        const formatted = line.replace(
          /\*\*(.*?)\*\*/g,
          '<strong>$1</strong>'
        )

        // Links
        const withLinks = formatted.replace(
          /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
          `<a href="$2" target="_blank" rel="noopener" class="${isUser ? 'underline' : 'text-pink-600 dark:text-pink-400 underline hover:no-underline'}">$1</a>`
        )

        // List items
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return (
            <div key={i} className="flex gap-1.5 items-start">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0 opacity-40" />
              <span dangerouslySetInnerHTML={{ __html: withLinks.slice(2) }} />
            </div>
          )
        }

        if (line.trim() === '') {
          return <div key={i} className="h-1" />
        }

        return (
          <p key={i} dangerouslySetInnerHTML={{ __html: withLinks }} />
        )
      })}
    </div>
  )
}

// ─── Product Cards ────────────────────────────────────────────────────────────

function ProductCards({ products }: { products: ProductCard[] }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 max-w-full">
      {products.slice(0, 4).map((product) => (
        <Link
          key={product.id}
          href={`/product/${product.handle}`}
          className="flex-shrink-0 w-[140px] group"
        >
          <motion.div
            whileHover={{ y: -2 }}
            className="
              rounded-xl border border-slate-200 dark:border-slate-700
              bg-white dark:bg-slate-800
              overflow-hidden transition-shadow
              group-hover:shadow-md group-hover:border-pink-300 dark:group-hover:border-pink-600
            "
          >
            {/* Image */}
            <div className="w-full h-[90px] bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
              {product.thumbnail ? (
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="140px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <span className="text-2xl">💅</span>
                </div>
              )}

              {/* Stock badge */}
              {product.inStock === false && (
                <div className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium">
                  Agotado
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-2">
              <p className="text-[11px] font-medium text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight">
                {product.title}
              </p>
              {product.price && (
                <p className="text-[12px] font-bold text-pink-600 dark:text-pink-400 mt-1">
                  ${product.price.toLocaleString('es-CO')}
                </p>
              )}
              {product.category && (
                <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {product.category}
                </p>
              )}
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  )
}
