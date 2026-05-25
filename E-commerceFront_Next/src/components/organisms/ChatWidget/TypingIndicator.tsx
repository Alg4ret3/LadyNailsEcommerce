'use client'

import { motion } from 'framer-motion'
import { ASSISTANT_IMAGES } from '@/constants/images'

interface TypingIndicatorProps {
  name?: string
}

export function TypingIndicator({ name = 'Naily' }: TypingIndicatorProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2.5 px-4 py-2"
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-200">
        <img 
          src={ASSISTANT_IMAGES.nailyLogo} 
          alt="Naily" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bubble */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-slate-300"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
