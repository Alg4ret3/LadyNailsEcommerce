'use client'

import { motion } from 'framer-motion'

interface TypingIndicatorProps {
  name?: string
}

export function TypingIndicator({ name = 'Naily' }: TypingIndicatorProps) {
  return (
    <div className="flex items-start gap-2.5 px-4 py-1">
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-sm">
        <span className="text-white text-xs font-bold">N</span>
      </div>

      {/* Bubble */}
      <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mr-1">{name}</span>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500"
              animate={{
                y: [0, -4, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
