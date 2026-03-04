'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram } from 'lucide-react';
import { Typography } from '@/components/atoms/Typography';

const SOCIAL_PLATFORMS = [
  { name: 'Instagram', icon: <Instagram size={20} />, handle: '@LadyNailsShop' },
  { name: 'Facebook', icon: <Facebook size={20} />, handle: 'LadyNails Shop' },
  { 
    name: 'TikTok', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ), 
    handle: '@LadyNailsShop' 
  },
];

export const SocialBanner: React.FC = () => {
  return (
    <div className="bg-slate-950 border-y border-white/5 py-4 overflow-hidden">
      <div className="relative flex">
        <motion.div 
          className="flex whitespace-nowrap gap-16 items-center"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(10)].map((_, i) => (
            <React.Fragment key={i}>
              {SOCIAL_PLATFORMS.map((platform, j) => (
                <div key={`${i}-${j}`} className="flex items-center gap-3 group cursor-pointer">
                  <div className="p-2 bg-white/5 rounded-full text-slate-400 group-hover:text-white group-hover:bg-white/10 transition-all">
                    {platform.icon}
                  </div>
                  <Typography variant="detail" className="text-slate-500 group-hover:text-slate-300 tracking-widest uppercase font-bold text-[10px]">
                    {platform.handle}
                  </Typography>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10 mx-4" />
                </div>
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
