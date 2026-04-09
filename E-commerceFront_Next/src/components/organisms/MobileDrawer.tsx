'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES, COMPANY_INFO } from '@/constants';
import { Instagram, Facebook, TikTok } from '@/components/icons';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
  expandedSections: string[];
  onToggleSection: (section: string) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const menuItems = [
    { name: 'Inicio', href: ROUTES.home },
    { name: 'Catálogo', href: ROUTES.shop },
    { name: 'Favoritos', href: ROUTES.favorites },
    { name: 'Pedidos', href: ROUTES.login },
    { name: 'Contacto', href: ROUTES.contact },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-[96px] bg-black/5 backdrop-blur-sm z-30 lg:hidden" 
            onClick={onClose}
          />
          
          <motion.div 
             initial={{ y: -20, opacity: 0 }} 
             animate={{ y: 0, opacity: 1 }} 
             exit={{ y: -20, opacity: 0 }}
             transition={{ duration: 0.3, ease: "easeOut" }}
             className="fixed left-0 right-0 top-[96px] bg-white z-40 lg:hidden border-b border-slate-100 flex flex-col shadow-xl"
          >
            {/* Links */}
            <nav className="flex flex-col pt-6 pb-4">
              {menuItems.map((item, idx) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * idx }}
                >
                  <Link 
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center px-10 py-4 group transition-colors"
                  >
                    <span className="text-[12px] font-bold uppercase tracking-[0.25em] text-slate-400 group-hover:text-slate-950 transition-colors">
                      {item.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Subtle Footer with same networks as Main Footer */}
            <div className="mx-10 mb-8 pt-8 border-t border-slate-50 flex justify-between items-center">
              <div className="flex gap-6">
                <Link href={COMPANY_INFO.social.instagram.url} target="_blank" className="text-slate-400 hover:text-slate-950 transition-colors">
                  <Instagram size={18} />
                </Link>
                <Link href={COMPANY_INFO.social.facebook.url} target="_blank" className="text-slate-400 hover:text-slate-950 transition-colors">
                  <Facebook size={18} />
                </Link>
                <Link href={COMPANY_INFO.social.tiktok.url} target="_blank" className="text-slate-400 hover:text-slate-950 transition-colors">
                  <TikTok size={18} />
                </Link>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300">
                {COMPANY_INFO.name}
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
