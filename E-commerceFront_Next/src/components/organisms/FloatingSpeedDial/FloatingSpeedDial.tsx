'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import { WHATSAPP_CONFIG } from '@/constants'
import { ChatWidget } from '@/components/organisms/ChatWidget'

export function FloatingSpeedDial() {
  const [open, setOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  const whatsappUrl = `${WHATSAPP_CONFIG.baseUrl}/${WHATSAPP_CONFIG.defaultNumber}?text=${encodeURIComponent(WHATSAPP_CONFIG.defaultMessage)}`

  const handleChat = () => {
    setOpen(false)
    setChatOpen(true)
  }

  return (
    <>
      <ChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {open && (
        <div className="fixed inset-0 z-[198]" onClick={() => setOpen(false)} aria-hidden />
      )}

      <div className="fixed bottom-6 right-6 z-[199] flex flex-col items-center gap-2.5">

        {/* Hijos */}
        <AnimatePresence>
          {open && (
            <>
              {/* WhatsApp */}
              <motion.a
                key="wa"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                initial={{ opacity: 0, y: 8, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28, delay: 0.04 }}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-[#25D366] shadow-md flex items-center justify-center"
              >
                <WhatsAppIcon />
              </motion.a>

              {/* IA */}
              <motion.button
                key="ai"
                onClick={handleChat}
                aria-label="Chat IA"
                initial={{ opacity: 0, y: 8, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-slate-800 shadow-md flex items-center justify-center"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        {/* Padre */}
        <motion.button
          onClick={() => setOpen((p) => !p)}
          aria-label={open ? 'Cerrar' : 'Contacto'}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="w-12 h-12 rounded-full bg-slate-900 shadow-lg flex items-center justify-center relative"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span key="x" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.12 }}>
                <X className="w-5 h-5 text-white" />
              </motion.span>
            ) : (
              <motion.span key="msg" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.12 }}>
                <ChatIcon />
              </motion.span>
            )}
          </AnimatePresence>

          {/* Online dot */}
          {!open && (
            <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
          )}
        </motion.button>
      </div>
    </>
  )
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}
