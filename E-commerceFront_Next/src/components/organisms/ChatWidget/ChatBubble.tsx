'use client'

import { motion } from 'framer-motion'
import type { ChatMessage, ProductCard } from '@/hooks/useChat'
import { User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ASSISTANT_IMAGES } from '@/constants/images'

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
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-200 text-slate-400">
          <User className="w-4 h-4" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-200">
          <img 
            src={ASSISTANT_IMAGES.nailyLogo} 
            alt="Naily" 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className={`${message.products?.length ? 'max-w-[90%]' : 'max-w-[85%]'} flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <div
          className={`
            rounded-2xl px-4 py-3 text-[13px] leading-relaxed relative min-w-[40px] min-h-[40px] flex items-center
            ${
              isUser
                ? 'bg-slate-900 text-white rounded-tr-sm shadow-sm'
                : 'bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-sm shadow-sm'
            }
          `}
        >
          <div className="w-full">
            <FormattedContent content={message.content} isUser={isUser} />

            {/* Streaming dots */}
            {message.isStreaming && (
              <span className="inline-flex gap-1 ml-2 align-middle">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1 h-1 rounded-full bg-slate-400"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1.1, 0.8]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </span>
            )}
          </div>
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
          `<a href="$2" target="_blank" rel="noopener" class="${isUser ? 'underline' : 'text-emerald-600 dark:text-emerald-400 font-semibold underline hover:no-underline'}">$1</a>`
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
    <div className="flex flex-col gap-3 py-2 w-full">
      {products.slice(0, 4).map((product) => (
        <Link
          key={product.id}
          href={`/product/${product.handle}`}
          className="w-full group"
        >
          <motion.div
            whileHover={{ y: -4 }}
            className="
              rounded-2xl border border-slate-100
              bg-white
              overflow-hidden transition-all duration-300
              group-hover:shadow-xl group-hover:border-slate-200
            "
          >
            {/* Image */}
            <div className="w-full h-[180px] bg-white relative p-3">
              {product.thumbnail ? (
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  className="object-contain p-2"
                  sizes="180px"
                  priority={false}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                  <span className="text-3xl">💅</span>
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
            <div className="p-3 border-t border-slate-50">
              <p className="text-[12px] font-bold text-slate-800 line-clamp-2 leading-snug h-[32px]">
                {product.title}
              </p>
              <div className="flex items-center justify-between mt-2">
                {product.price && (
                  <p className="text-[14px] font-extrabold text-slate-900">
                    ${product.price.toLocaleString('es-CO')}
                  </p>
                )}
                {product.category && (
                  <p className="text-[10px] text-slate-400 font-medium">
                    {product.category}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  )
}
