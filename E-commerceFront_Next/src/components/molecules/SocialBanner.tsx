'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram } from 'lucide-react';
import { COMPANY_INFO } from '@/constants';

const SOCIAL_PLATFORMS = [
  { name: 'Instagram', icon: <Instagram size={20} />, handle: COMPANY_INFO.social.instagram.handle, url: COMPANY_INFO.social.instagram.url },
  { name: 'Facebook', icon: <Facebook size={20} />, handle: COMPANY_INFO.social.facebook.handle, url: COMPANY_INFO.social.facebook.url },
  { 
    name: 'TikTok', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ), 
    handle: COMPANY_INFO.social.tiktok.handle,
    url: COMPANY_INFO.social.tiktok.url
  },
];

export const SocialBanner: React.FC = () => {
  return (
    <div className="bg-black py-4 overflow-hidden select-none border-y border-white/5">
      <div className="relative flex">
        <motion.div 
          className="flex whitespace-nowrap gap-20 items-center"
          animate={{ x: [0, -2000] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(20)].map((_, i) => (
            <React.Fragment key={i}>
              {SOCIAL_PLATFORMS.map((platform, j) => (
                <div key={`${i}-${j}`} className="flex items-center gap-20">
                  <a 
                    href={platform.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="text-white/40 group-hover:text-white transition-all duration-700 [&_svg]:w-4 [&_svg]:h-4 [&_svg]:stroke-2">
                      {platform.icon}
                    </div>
                    <span className="text-white/40 group-hover:text-white tracking-[0.2em] transition-all duration-700 text-[10px] uppercase font-bold">
                      {platform.handle}
                    </span>
                  </a>
                </div>
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
