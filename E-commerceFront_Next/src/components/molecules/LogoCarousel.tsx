'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Typography } from '@/components/atoms/Typography';
import { HOME_PARTNERS } from '@/constants';

export const LogoCarousel: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState(0);

  // Agrupamos los logos de 2 en 2 para móvil
  const groups = [];
  for (let i = 0; i < HOME_PARTNERS.length; i += 2) {
    groups.push(HOME_PARTNERS.slice(i, i + 2));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGroup((prev) => (prev + 1) % groups.length);
    }, 4000); // Crossfade cada 4 segundos
    return () => clearInterval(interval);
  }, [groups.length]);

  return (
    <div className="pt-20 pb-6 bg-white border-y border-slate-50">
      <div className="max-w-[1400px] mx-auto px-6 mb-8 flex flex-col items-center">
        <Typography variant="detail" className="text-slate-400 mb-3 tracking-[0.2em] font-bold uppercase text-[10px] sm:text-xs text-center">NUESTROS PARTNERS</Typography>
        <Typography variant="h3" className="text-2xl sm:text-4xl uppercase tracking-widest font-black text-slate-900 text-center">
          Marcas que Confían
        </Typography>
      </div>
      
      <div className="max-w-[1000px] mx-auto px-6">
        {/* Mobile View: 2 Logos Fading */}
        <div className="md:hidden relative h-20 flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGroup}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 flex justify-center items-center gap-12"
            >
              {groups[activeGroup]?.map((partner, i) => (
                <div key={i} className="relative w-28 h-12">
                  <Image 
                    src={partner.logo} 
                    alt={partner.name} 
                    fill 
                    className="object-contain filter grayscale opacity-40 transition-all"
                  />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop View: Static Display of All Logos */}
        <div className="hidden md:flex justify-between items-center gap-8">
          {HOME_PARTNERS.map((partner, i) => (
            <div key={i} className="relative w-40 h-20">
              <Image 
                src={partner.logo} 
                alt={partner.name} 
                fill 
                className="object-contain filter grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
