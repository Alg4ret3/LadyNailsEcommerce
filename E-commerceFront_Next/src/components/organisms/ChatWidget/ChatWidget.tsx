'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Trash2, Sparkles, ChevronDown } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import { TypingIndicator } from './TypingIndicator'

// ─── Chat Widget ──────────────────────────────────────────────────────────────

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [showScrollDown, setShowScrollDown] = useState(false)
  const { messages, isLoading, error, sendMessage, clearHistory, stopStreaming } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isLoading])

  // Track if user has scrolled up
  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return
    const { scrollTop, scrollHeight, clientHeight } = container
    setShowScrollDown(scrollHeight - scrollTop - clientHeight > 100)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Show pulse on first load if no interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted) setHasInteracted(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [hasInteracted])

  return (
    <>
      {/* ── Floating Button ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => {
              setIsOpen(true)
              setHasInteracted(true)
            }}
            className="
              fixed bottom-6 right-6 z-[9998]
              w-14 h-14 rounded-full
              bg-gradient-to-r from-rose-500 to-pink-600
              text-white shadow-lg shadow-pink-500/30
              flex items-center justify-center
              hover:shadow-xl hover:shadow-pink-500/40
              hover:scale-105
              active:scale-95
              transition-all duration-200
              cursor-pointer
              group
            "
            aria-label="Abrir chat con Naily"
          >
            {/* Pulse ring */}
            {!hasInteracted && (
              <span className="absolute inset-0 rounded-full bg-pink-500 animate-ping opacity-30" />
            )}
            <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />

            {/* Notification badge */}
            {messages.length === 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-3 h-3 text-white" />
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Window ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="
              fixed bottom-4 right-4 z-[9999]
              w-[380px] max-w-[calc(100vw-2rem)]
              h-[600px] max-h-[calc(100vh-2rem)]
              bg-white dark:bg-slate-900
              rounded-2xl shadow-2xl shadow-slate-900/20 dark:shadow-black/40
              border border-slate-200 dark:border-slate-700/50
              flex flex-col overflow-hidden
              backdrop-blur-xl
            "
          >
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="
              flex items-center justify-between px-4 py-3
              bg-gradient-to-r from-rose-500 to-pink-600
              text-white
            ">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-lg">💅</span>
                  </div>
                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-rose-500" />
                </div>

                <div>
                  <h3 className="font-semibold text-sm leading-tight">Naily</h3>
                  <p className="text-[10px] text-white/70">
                    Asistente IA de LadyNails · En línea
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    title="Limpiar conversación"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  title="Cerrar chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Messages Area ──────────────────────────────────────────── */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto py-3 space-y-1 custom-scrollbar"
            >
              {/* Welcome Message */}
              {messages.length === 0 && (
                <WelcomeScreen onSend={sendMessage} />
              )}

              {/* Messages */}
              {messages.map((msg, i) => (
                <ChatBubble
                  key={msg.id}
                  message={msg}
                  isLast={i === messages.length - 1}
                />
              ))}

              {/* Typing indicator */}
              {isLoading && !messages.some((m) => m.isStreaming) && (
                <TypingIndicator />
              )}

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mx-4 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400"
                >
                  ⚠️ {error}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Scroll down button */}
            <AnimatePresence>
              {showScrollDown && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={scrollToBottom}
                  className="
                    absolute bottom-[100px] left-1/2 -translate-x-1/2
                    w-8 h-8 rounded-full
                    bg-white dark:bg-slate-800
                    border border-slate-200 dark:border-slate-700
                    shadow-lg flex items-center justify-center
                    hover:bg-slate-50 dark:hover:bg-slate-700
                    transition-colors cursor-pointer
                  "
                >
                  <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* ── Input Area ─────────────────────────────────────────────── */}
            <ChatInput
              onSend={sendMessage}
              onStop={stopStreaming}
              isLoading={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Welcome Screen ───────────────────────────────────────────────────────────

function WelcomeScreen({ onSend }: { onSend: (msg: string) => void }) {
  const suggestions = [
    '¿Qué productos tienen?',
    '¿Tienen esmaltes en gel?',
    '¿Cuáles son los más populares?',
    '¿Hacen envíos a todo Colombia?',
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="flex flex-col items-center justify-center px-6 py-8 text-center"
    >
      {/* Logo / Emoji */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 flex items-center justify-center mb-4"
      >
        <span className="text-3xl">💅</span>
      </motion.div>

      <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        ¡Hola! Soy Naily ✨
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[240px]">
        Tu asistente virtual de LadyNails Shop. Pregúntame sobre nuestros productos de belleza.
      </p>

      {/* Quick Suggestions */}
      <div className="mt-5 w-full space-y-2">
        {suggestions.map((suggestion, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            onClick={() => onSend(suggestion)}
            className="
              w-full text-left px-3.5 py-2.5 rounded-xl
              border border-slate-200 dark:border-slate-700
              bg-slate-50 dark:bg-slate-800/50
              text-[12px] text-slate-600 dark:text-slate-400
              hover:border-pink-300 dark:hover:border-pink-600
              hover:bg-pink-50 dark:hover:bg-pink-900/10
              hover:text-pink-600 dark:hover:text-pink-400
              transition-all duration-200 cursor-pointer
              flex items-center gap-2
            "
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
            {suggestion}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
