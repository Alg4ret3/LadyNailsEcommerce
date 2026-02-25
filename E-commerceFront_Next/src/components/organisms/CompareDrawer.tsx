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
    <div className="fixed bottom-0 left-0 right-0 z-90 p-2 sm:p-4 md:p-6 pointer-events-none font-sans">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl mx-auto bg-background border border-border shadow-[0_12px_24px_-4px_rgba(42,37,32,0.12)] rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-6 pointer-events-auto"
      >
        <div className="items-center gap-2 sm:gap-3 border-r border-border pr-2 sm:pr-3 md:pr-6 mr-0 sm:mr-2 hidden sm:flex">
          <div className="w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center shrink-0">
             <ArrowLeftRight size={16} className="sm:size-4 md:size-5" />
          </div>
          <div className="hidden md:block">
            <Typography variant="h4" className="text-[10px] md:text-[11px] font-bold text-foreground">Comparar</Typography>
            <Typography variant="small" className="text-[8px] md:text-[9px] text-foreground/40">{compareItems.length} items</Typography>
          </div>
          <div className="md:hidden">
            <Typography variant="small" className="text-[8px] text-foreground/40">{compareItems.length}</Typography>
          </div>
        </div>

        <div className="flex-1 flex gap-1.5 sm:gap-2 md:gap-3 overflow-x-auto no-scrollbar py-0.5 sm:py-1 min-w-0">
          {compareItems.map(item => (
            <div key={item.id} className="relative w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 shrink-0 bg-muted rounded-lg border border-border group">
               <Image src={item.image} alt={item.name} fill className="object-cover rounded-lg" />
               <button
                 onClick={() => removeFromCompare(item.id)}
                 className="absolute -top-1 sm:-top-1.5 md:-top-2 -right-1 sm:-right-1.5 md:-right-2 bg-background text-foreground/40 hover:text-accent shadow-sm border border-border rounded-full p-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
               >
                 <X size={10} className="sm:size-2.5 md:size-3" />
               </button>
            </div>
          ))}
          {[...Array(4 - compareItems.length)].map((_, i) => (
            <div key={i} className="w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-foreground/20 shrink-0">
               <span className="text-base sm:text-lg md:text-xl">+</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 pl-2 sm:pl-3 md:pl-4 border-l border-border ml-auto">
          <button 
            onClick={clearCompare}
            className="text-[7px] sm:text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-foreground/40 hover:text-accent whitespace-nowrap"
          >
            Limpiar
          </button>
          <Link href="/compare">
            <button className="bg-foreground text-background px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-full text-[7px] sm:text-[8px] md:text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:opacity-90 transition-all shrink-0">
               Comparar <ChevronRight size={10} className="sm:size-2.5 md:size-3.5" />
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
