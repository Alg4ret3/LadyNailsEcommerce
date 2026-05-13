'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, ChevronDown, Sparkles } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import { TypingIndicator } from './TypingIndicator'

// ─── Chat Widget (controlled externally by FloatingSpeedDial) ─────────────────

interface ChatWidgetProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const [showScrollDown, setShowScrollDown] = useState(false)
  const { messages, isLoading, error, sendMessage, clearHistory, stopStreaming, checkConnection } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      checkConnection()
    }
  }, [isOpen, checkConnection])

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isLoading])

  const handleScroll = () => {
    const el = scrollContainerRef.current
    if (!el) return
    setShowScrollDown(el.scrollHeight - el.scrollTop - el.clientHeight > 80)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="
            fixed bottom-24 right-6 z-[9999]
            w-[360px] max-w-[calc(100vw-2rem)]
            h-[520px] max-h-[calc(100vh-8rem)]
            bg-white
            rounded-2xl
            shadow-[0_8px_40px_-8px_rgba(0,0,0,0.18)]
            border border-slate-100
            flex flex-col overflow-hidden
          "
        >
          {/* ── Header ──────────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                  <img 
                    src="https://images.pexels.com/photos/3373737/pexels-photo-3373737.jpeg?auto=compress&cs=tinysrgb&w=100" 
                    alt="Naily Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 leading-tight">Naily</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    isLoading ? 'bg-amber-400 animate-pulse' : 
                    error ? 'bg-red-500' : 'bg-emerald-500'
                  }`} />
                  <p className="text-[10px] text-slate-400 font-medium">
                    {isLoading ? 'Pensando...' : error ? 'Desconectada' : 'En línea'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-0.5">
              {error && (
                <button
                  onClick={clearHistory}
                  className="px-2 py-1 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100 mr-1"
                >
                  REINTENTAR
                </button>
              )}
              {messages.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                  title="Limpiar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── Messages ────────────────────────────────────────────── */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto py-2 space-y-0.5 custom-scrollbar"
          >
            {messages.length === 0 && <WelcomeScreen onSend={sendMessage} />}

            {messages.map((msg, i) => (
              <ChatBubble key={msg.id} message={msg} isLast={i === messages.length - 1} />
            ))}

            {isLoading && !messages.some((m) => m.isStreaming) && <TypingIndicator />}

            {error && (
              <p className="mx-4 text-xs text-red-400 py-1">⚠️ {error}</p>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Scroll down pill */}
          <AnimatePresence>
            {showScrollDown && (
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="
                  absolute bottom-[72px] left-1/2 -translate-x-1/2
                  flex items-center gap-1 px-3 py-1 rounded-full
                  bg-white border border-slate-200 shadow-sm
                  text-[11px] text-slate-500 hover:text-slate-800
                  transition-colors cursor-pointer
                "
              >
                <ChevronDown className="w-3 h-3" />
                Ir abajo
              </motion.button>
            )}
          </AnimatePresence>

          {/* ── Input ───────────────────────────────────────────────── */}
          <ChatInput onSend={sendMessage} onStop={stopStreaming} isLoading={isLoading} isError={!!error} />
        </motion.div>
      )}
    </AnimatePresence>
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
      className="flex flex-col items-center px-5 pt-10 pb-4 text-center"
    >
      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-slate-100 mb-4 bg-white">
        <img 
          src="https://images.pexels.com/photos/3373737/pexels-photo-3373737.jpeg?auto=compress&cs=tinysrgb&w=200" 
          alt="Naily" 
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-base font-bold text-slate-800">¡Hola! Soy Naily</p>
      <p className="text-xs text-slate-500 mt-2 max-w-[240px] leading-relaxed font-medium">
        Tu asesora experta en belleza de Ladynail Shop. ¿En qué puedo ayudarte hoy?
      </p>

      <div className="mt-5 w-full space-y-1.5">
        {suggestions.map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.06 }}
            onClick={() => onSend(s)}
            className="
              w-full text-left px-3.5 py-2 rounded-xl
              border border-slate-100 bg-slate-50
              text-[12px] text-slate-600
              hover:bg-slate-100 hover:border-slate-200
              transition-colors duration-150 cursor-pointer
              flex items-center gap-2
            "
          >
            <Sparkles className="w-3 h-3 text-slate-300 flex-shrink-0" />
            {s}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
