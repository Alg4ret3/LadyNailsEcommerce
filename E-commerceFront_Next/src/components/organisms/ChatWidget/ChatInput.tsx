'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Send, Square } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  onStop?: () => void
  isLoading: boolean
  isError?: boolean
}

export function ChatInput({ onSend, onStop, isLoading, isError }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const disabled = isLoading || isError

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
    <div className="border-t border-slate-100 bg-white px-3 py-2.5">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isError ? "Asistente desconectada" : "Escribe tu mensaje..."}
          disabled={disabled}
          rows={1}
          className={`
            flex-1 resize-none rounded-xl border border-slate-100
            ${isError ? 'bg-red-50/50' : 'bg-slate-50'} px-3 py-2
            text-sm ${isError ? 'text-red-400 italic' : 'text-slate-800'}
            placeholder:${isError ? 'text-red-300' : 'text-slate-400'}
            focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300
            transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed
            max-h-[100px]
          `}
          style={{ minHeight: '38px' }}
        />

        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Detener"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-700 text-white flex items-center justify-center transition-colors disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
            title="Enviar"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
