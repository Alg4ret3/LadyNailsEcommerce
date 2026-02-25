'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import { Typography } from '@/components/atoms/Typography';
import Link from 'next/link';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-white flex flex-col pt-32 px-6 sm:px-12"
        >
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 sm:top-12 sm:right-12 p-3 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X size={32} strokeWidth={1.5} />
          </button>

          <div className="max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-4 mb-2 opacity-30">
              <span className="w-8 h-px bg-slate-900"></span>
              <Typography variant="detail" className="uppercase tracking-[0.3em] font-black text-[9px]">Buscador Global</Typography>
            </div>
            
            <div className="relative flex items-center border-b border-slate-200 pb-6 group focus-within:border-slate-950 transition-colors">
              <Search className="text-slate-300 group-focus-within:text-slate-950 transition-colors" size={24} />
              <input 
                autoFocus
                type="text"
                placeholder="Busca productos, marcas o categorías..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-xl sm:text-3xl font-bold tracking-tight placeholder:text-slate-200 px-6 text-slate-900"
              />
              {query && (
                <button onClick={() => setQuery('')} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-all">
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-6">
                <Typography variant="detail" className="opacity-30 uppercase tracking-widest font-black text-[9px]">Sugerencias Directas</Typography>
                <div className="flex flex-col gap-1">
                  {['Máquinas de Barbería', 'Geles de Construcción', 'Esmaltes Semi-permanentes', 'Mobiliario Premium'].map((item) => (
                    <button key={item} className="text-left py-3 px-4 -ml-4 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-between group">
                      <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{item}</span>
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                <Typography variant="detail" className="opacity-30 uppercase tracking-widest font-black text-[9px]">Explorar por Sección</Typography>
                <div className="flex flex-wrap gap-2">
                  {['Nails', 'Barber', 'Makeup', 'Outlet', 'New Arrivals'].map((cat) => (
                    <Link 
                      key={cat} 
                      href={`/shop/${cat.toLowerCase()}`} 
                      onClick={onClose} 
                      className="px-5 py-2.5 bg-slate-50 hover:bg-slate-900 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest rounded-lg border border-slate-100 hover:border-slate-900"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
