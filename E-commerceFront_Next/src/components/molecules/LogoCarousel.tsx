'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Typography } from '@/components/atoms/Typography';

const PARTNERS = [
  { name: 'OPI', logo: 'https://styles.redditmedia.com/t5_2skov/styles/communityIcon_v07on4n5wka21.png' },
  { name: 'Wahl', logo: 'https://logos-world.net/wp-content/uploads/2020/11/Wahl-Logo.png' },
  { name: 'Andis', logo: 'https://logos-world.net/wp-content/uploads/2020/12/Andis-Logo.png' },
  { name: 'Mía Secret', logo: 'https://miasecret.com/skin/frontend/miasecret/default/images/logo.png' },
  { name: 'Loreal', logo: 'https://logos-world.net/wp-content/uploads/2020/04/LOreal-Logo.png' },
  { name: 'Babyliss', logo: 'https://logos-world.net/wp-content/uploads/2020/11/BaByliss-Logo.png' },
];

export const LogoCarousel: React.FC = () => {
  return (
    <div className="py-20 bg-white overflow-hidden border-y border-slate-100">
      <div className="max-w-[1400px] mx-auto px-6 mb-12 flex flex-col items-center">
        <Typography variant="detail" className="text-slate-400 mb-2">Nuestros Partners</Typography>
        <Typography variant="h3" className="text-2xl sm:text-3xl">Marcas que Confían en Nosotros</Typography>
      </div>
      
      <div className="relative flex">
        <motion.div 
          className="flex whitespace-nowrap gap-12 sm:gap-24 items-center"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, i) => (
            <div key={i} className="flex-shrink-0 w-32 h-16 sm:w-48 sm:h-24 relative grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <Image 
                src={partner.logo} 
                alt={partner.name} 
                fill 
                className="object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
