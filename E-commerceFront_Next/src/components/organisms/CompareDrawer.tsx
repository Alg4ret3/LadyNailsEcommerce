'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { XIcon as X, ArrowLeftRight, ChevronRight } from '@/components/icons';
import { useCompare } from '@/context/CompareContext';
import { Typography } from '@/components/atoms/Typography';
import Image from 'next/image';
import Link from 'next/link';

export const CompareDrawer: React.FC = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-2 sm:p-6 pointer-events-none">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="max-w-3xl mx-auto bg-white border border-zinc-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] rounded-[24px] sm:rounded-full p-2 flex items-center gap-3 sm:gap-6 pointer-events-auto"
      >
        <div className="items-center gap-3 border-r border-zinc-100 pr-4 sm:pr-6 ml-1 sm:ml-2 hidden sm:flex">
          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shrink-0">
             <ArrowLeftRight size={14} />
          </div>
          <Typography variant="detail" className="text-[10px] font-black text-black tracking-widest uppercase hidden md:block">Comparar</Typography>
        </div>

        <div className="flex-1 flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1 min-w-0 px-2 sm:px-0">
          {compareItems.map(item => (
            <div key={item.id} className="relative w-10 h-10 sm:w-14 sm:h-14 shrink-0 bg-zinc-50 rounded-lg sm:rounded-2xl border border-zinc-100 group transition-all duration-300">
               <Image src={item.image} alt={item.name} fill className="object-contain p-1.5 rounded-lg sm:rounded-2xl" />
               <button
                 onClick={() => removeFromCompare(item.id)}
                 className="absolute -top-1 -right-1 bg-white text-black shadow-lg border border-zinc-100 rounded-full p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:scale-110"
               >
                 <X size={8} />
               </button>
            </div>
          ))}
          {[...Array(Math.max(0, 4 - compareItems.length))].map((_, i) => (
            <div key={i} className="w-10 h-10 sm:w-14 sm:h-14 border border-dashed border-zinc-100 rounded-lg sm:rounded-2xl flex items-center justify-center text-zinc-200 shrink-0">
               <span className="text-base sm:text-xl font-light">+</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 pl-2 sm:pl-4 border-l border-zinc-100 ml-auto mr-1 sm:mr-2">
          <button 
            onClick={clearCompare}
            className="hidden sm:block text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300 hover:text-black transition-colors whitespace-nowrap"
          >
            Limpiar
          </button>
          <Link href="/compare">
            <button className="bg-black text-white px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-none text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-neutral-900 transition-all shrink-0">
               COMPARAR <ChevronRight size={10} />
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
