'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  blur?: boolean;
}

export const Overlay: React.FC<OverlayProps> = ({ isOpen, onClose, className = '', blur = true }) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      onClick={onClose}
      className={`fixed inset-0 z-[90] bg-slate-950/40 ${blur ? 'backdrop-blur-sm' : ''} ${className}`} 
    />
  );
};
