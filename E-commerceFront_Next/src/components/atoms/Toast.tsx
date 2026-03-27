'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { Typography } from '@/components/atoms/Typography';

interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  type?: 'success' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, isOpen, onClose, type = 'success' }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100, scale: 0.98 }}
          className="fixed top-24 right-4 sm:right-10 z-[1000] flex items-center gap-4 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-xl shadow-2xl min-w-[320px] max-w-md border border-white/5 overflow-hidden"
        >
          {/* Subtle Progress Indicator */}
          <motion.div 
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 3, ease: 'linear' }}
            className={`absolute bottom-0 left-0 right-0 h-[1.5px] origin-left opacity-30 ${type === 'success' ? 'bg-white' : 'bg-red-400'}`}
          />
          
          <div className="flex-1 flex items-center gap-3">
            <div className={`p-1 rounded-lg ${type === 'success' ? 'text-slate-400' : 'text-red-400'}`}>
              <CheckCircle size={18} strokeWidth={2} />
            </div>
            <Typography variant="body" className="text-white text-[12px] font-medium tracking-tight">
              {message}
            </Typography>
          </div>
          
          <button onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-all">
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
