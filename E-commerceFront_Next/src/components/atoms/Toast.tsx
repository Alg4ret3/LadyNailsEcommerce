'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';

interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  type?: 'success' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, isOpen, onClose }) => {
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="hidden sm:flex fixed top-28 right-10 z-[2000] items-center bg-black text-white px-8 py-2.5 rounded-none border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden min-w-[240px]"
        >
          {/* Progress bar subtle */}
          <motion.div 
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 3, ease: 'linear' }}
            className="absolute bottom-0 left-0 right-0 h-px bg-white/30 origin-left"
          />
          
          <div className="mx-auto flex justify-center scale-[0.4] sm:scale-100 origin-center min-w-0">
            <Typography variant="body" className="text-white text-[10px] font-medium uppercase tracking-[0.4em] leading-tight whitespace-nowrap opacity-90 italic">
              {message}
            </Typography>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
