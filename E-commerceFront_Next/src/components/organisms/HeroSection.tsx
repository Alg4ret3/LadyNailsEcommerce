'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen lg:min-h-[90vh] flex items-center pt-32 sm:pt-40 pb-20 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 opacity-40 lg:grayscale pointer-events-none">
        <Image 
          src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2000" 
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
              SUMINISTRO PROFESIONAL COMPLETO
            </Typography>
            <Typography variant="h1" className="text-white leading-[0.8] tracking-tighter text-5xl sm:text-7xl md:text-8xl lg:text-[8rem] font-black uppercase">
              POTENCIA <br /> 
              <span className="text-white/95 font-light italic">TU ARTE</span>
            </Typography>
            <Typography variant="h2" className="text-white/50 mt-4 text-sm sm:text-lg md:text-xl tracking-[0.6em] uppercase font-light">
              BELLEZA Y BARBERÍA SIN LÍMITES
            </Typography>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.4 }} 
            className="mx-auto space-y-8 sm:space-y-12"
          >
             <Typography variant="body" className="text-slate-200 text-lg sm:text-xl font-light leading-relaxed max-w-3xl mx-auto italic drop-shadow-md">
                El suministro industrial definitivo para artistas del estilo. Herramientas y geles de grado profesional para salones y barberías que no aceptan menos que la perfección.
             </Typography>
             <div className="flex justify-center pt-8">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    boxShadow: ["0 0 0 0px rgba(255,255,255,0)", "0 0 0 10px rgba(255,255,255,0.1)", "0 0 0 0px rgba(255,255,255,0)"]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <Button 
                    label="VER CATÁLOGO COMPLETO" 
                    href="/shop" 
                    className="w-full sm:w-auto !bg-white !text-slate-950 border-white hover:!bg-slate-100 px-12 py-5 sm:py-6 text-xs sm:text-sm font-semibold tracking-widest transition-all hover:scale-105 rounded-none ring-offset-4 ring-offset-slate-950 hover:ring-1 hover:ring-white" 
                  />
                </motion.div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
