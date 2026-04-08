'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants';
import { MessageSquarePlus } from 'lucide-react';
import { Typography } from '@/components/atoms/Typography';

export const ReviewBanner: React.FC = () => {
  return (
    <section aria-label="Reseñas Rápidas" className="bg-slate-950 border-y border-white/5 py-4 relative overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent)] pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 relative z-10">
        <Typography variant="h4" className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-white italic text-center sm:text-left flex items-center gap-3">
          <MessageSquarePlus size={16} className="text-accent" />
          ¿Nos quieres ayudar a mejorar?
        </Typography>

        <Link 
          href={ROUTES.reviews}
          className="px-8 py-2.5 bg-white text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-accent hover:text-white transition-all active:scale-95 shadow-md flex items-center gap-2"
        >
          Dejar una reseña
        </Link>
      </div>
    </section>
  );
};
