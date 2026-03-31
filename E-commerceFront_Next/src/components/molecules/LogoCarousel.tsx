'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Typography } from '@/components/atoms/Typography';
import { HOME_PARTNERS } from '@/constants';

export const LogoCarousel: React.FC = () => {
  return (
    <div className="py-20 bg-white overflow-hidden border-y border-slate-100">
      <div className="max-w-[1400px] mx-auto px-6 mb-12 flex flex-col items-center">
        <Typography variant="detail" className="text-slate-400 mb-2">Nuestros Partners</Typography>
        <Typography variant="h3" className="text-2xl sm:text-3xl">Marcas que Confían en Nosotros</Typography>
      </div>
      
      <div className="relative flex overflow-hidden w-full">
        <motion.div 
          className="flex whitespace-nowrap items-center w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          {/* Duplicamos la lista de partners varias veces para asegurar que haya suficiente contenido para el scroll infinito, especialmente en pantallas grandes */}
          {[...HOME_PARTNERS, ...HOME_PARTNERS, ...HOME_PARTNERS, ...HOME_PARTNERS].map((partner, i) => (
            <div key={i} className="flex-shrink-0 mx-6 sm:mx-12">
              <div className="w-32 h-16 sm:w-48 sm:h-24 relative opacity-100 transition-all duration-500">
                <Image 
                  src={partner.logo} 
                  alt={partner.name} 
                  fill 
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
