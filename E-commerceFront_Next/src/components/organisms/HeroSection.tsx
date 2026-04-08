'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { HERO_CONTENT, ROUTES } from '@/constants';

export const HeroSection: React.FC = () => {
  return (
    <section aria-label="Sección Principal" className="relative min-h-screen lg:min-h-[90vh] flex items-center pt-32 sm:pt-40 pb-20 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <Image 
          src={HERO_CONTENT.backgroundImage} 
          alt="Elite Professional Barber & Beauty Tools" fill className="object-cover" 
          priority
        />
      </div>
      
      {/* Decorative gradient overlay - refined for ultra-clear visibility */}
      <div className="absolute inset-0 bg-radial-at-c from-slate-950/40 via-slate-950/80 to-slate-950 z-1" />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-10 relative z-10 w-full flex justify-center text-center">
        <div className="max-w-5xl space-y-8 sm:space-y-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Typography variant="detail" className="text-slate-400 mb-6 sm:mb-8 bg-white/5 inline-block px-5 py-2 border border-white/10 text-[10px] sm:text-[12px] tracking-[0.4em] uppercase font-bold">
              {HERO_CONTENT.surtitle}
            </Typography>
            <Typography variant="h1" className="text-white leading-[0.8] tracking-tighter text-5xl sm:text-7xl md:text-8xl lg:text-[8rem] font-black uppercase">
              {HERO_CONTENT.titlePart1} <br /> 
              <span className="text-white/95 font-light italic">{HERO_CONTENT.titlePart2}</span>
            </Typography>
            <Typography variant="h2" className="text-white/50 mt-4 text-sm sm:text-lg md:text-xl tracking-[0.6em] uppercase font-light">
              {HERO_CONTENT.subtitle}
            </Typography>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.4 }} 
            className="mx-auto space-y-8 sm:space-y-12"
          >
             <Typography variant="body" className="text-slate-200 text-lg sm:text-xl font-light leading-relaxed max-w-3xl mx-auto italic drop-shadow-md">
                {HERO_CONTENT.description}
             </Typography>
             <div className="flex justify-center pt-8">
                <Button 
                  label={HERO_CONTENT.buttonLabel}
                  href={ROUTES.shop}
                  className="w-full sm:w-auto !bg-white !text-slate-950 border-white hover:!bg-white px-12 py-5 sm:py-6 text-xs sm:text-sm font-semibold tracking-widest transition-all hover:scale-95 rounded-none" 
                />
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
