'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Send, Square } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  onStop?: () => void
  isLoading?: boolean
  disabled?: boolean
}

export function ChatInput({ onSend, onStop, isLoading, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }, [value])

  const handleSend = () => {
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue('')
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (isLoading && onStop) {
        onStop()
      } else {
        handleSend()
      }
    }
  }

  return (
    <div className="border-t border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje..."
          disabled={disabled}
          rows={1}
          className="
            flex-1 resize-none rounded-xl border border-slate-200 dark:border-slate-700
            bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5
            text-sm text-slate-900 dark:text-slate-100
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-400
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            max-h-[120px]
          "
          style={{ minHeight: '40px' }}
        />

        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            className="
              flex-shrink-0 w-10 h-10 rounded-xl
              bg-red-500 hover:bg-red-600
              text-white flex items-center justify-center
              transition-all duration-200
              active:scale-95 cursor-pointer
            "
            title="Detener respuesta"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className="
              flex-shrink-0 w-10 h-10 rounded-xl
              bg-gradient-to-r from-rose-500 to-pink-600
              hover:from-rose-600 hover:to-pink-700
              text-white flex items-center justify-center
              transition-all duration-200
              disabled:opacity-30 disabled:cursor-not-allowed
              active:scale-95 cursor-pointer
              shadow-md shadow-pink-500/20
            "
            title="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-1.5 select-none">
        Naily puede cometer errores · Verifica información importante
      </p>
    </div>
  )
}
