'use client';

import React from 'react';
import Link from 'next/link';
import { X, Home, LayoutGrid, Package, Heart, HelpCircle, Truck, RefreshCcw, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Typography } from '@/components/atoms/Typography';
import { Overlay } from '@/components/atoms/Overlay';
import { NavItem } from '@/components/molecules/NavItem';
import { useUser } from '@/context/UserContext';
import { LogOut } from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  NAV_LINKS: { name: string; href: string; subcategories?: { name: string; href: string }[] }[];
  expandedSections: string[];
  onToggleSection: (section: string) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ 
  isOpen, 
  onClose, 
  NAV_LINKS, 
  expandedSections, 
  onToggleSection 
}) => {
  const { user, logout } = useUser();
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Overlay isOpen={isOpen} onClose={onClose} />
          <motion.div 
             initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
             transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.8 }}
             className="fixed left-0 top-0 bottom-0 w-full sm:w-[400px] bg-white z-100 flex flex-col shadow-[20px_0_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-50">
              <Link href="/" onClick={onClose} className="flex items-center group">
                 <div className="relative w-16 h-16 flex items-center justify-center">
                    <Image 
                      src="/assets/LogoProvicional.svg" 
                      alt="Ladynail Shop Logo" 
                      fill
                      className="object-contain"
                    />
                 </div>
              </Link>
              <button 
                onClick={onClose} 
                className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-slate-950 transition-colors"
                aria-label="Cerrar menú"
              >
                 <X size={20} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-12 custom-scrollbar">
              
              {/* Hierarchical Navigation List */}
              <div className="space-y-1">
                <NavItem name="Inicio" href="/" type="mobile" icon={<Home size={20} />} />

                {/* Categories Accordion */}
                <div className="space-y-1">
                  <button 
                    onClick={() => onToggleSection('categories_root')}
                    className="w-full flex items-center justify-between py-4 px-4 hover:bg-slate-50 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${expandedSections.includes('categories_root') ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-900'}`}>
                        <LayoutGrid size={20} />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest text-slate-900">Categorías</span>
                    </div>
                    <ChevronDown size={16} className={`transition-transform duration-300 text-slate-300 ${expandedSections.includes('categories_root') ? 'rotate-180 text-slate-900' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {expandedSections.includes('categories_root') && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden pl-14 pr-4 space-y-6 pb-4"
                      >
                         <div className="space-y-3">
                           <Typography variant="detail" className="text-[9px] text-slate-400 uppercase font-bold tracking-[0.2em]">Todas las Categorías</Typography>
                           <div className="grid grid-cols-1 gap-1">
                              {NAV_LINKS[1]?.subcategories?.map((cat) => (
                                <Link 
                                  key={cat.name} 
                                  href={cat.href} 
                                  onClick={onClose}
                                  className="py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-colors flex items-center gap-3"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                  {cat.name}
                                </Link>
                              ))}
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <NavItem name="Mis Pedidos" href={user?.isLoggedIn ? "/account" : "/auth/login"} type="mobile" icon={<Package size={20} />} />
                <NavItem name="Favoritos" href="/favorites" type="mobile" icon={<Heart size={20} />} />
                <NavItem name="Ayuda" href="/faq" type="mobile" icon={<HelpCircle size={20} />} />
                <NavItem name="Envíos" href="/shipping" type="mobile" icon={<Truck size={20} />} />
                <NavItem name="Devoluciones" href="/returns" type="mobile" icon={<RefreshCcw size={20} />} />
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-8 bg-slate-50 border-t border-slate-100 mt-auto">
              <div className="flex flex-col gap-4">
                 {user?.isLoggedIn ? (
                   <div className="space-y-4">
                     <Link 
                       href="/account" 
                       onClick={onClose}
                       className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 text-white rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all border border-slate-900"
                     >
                       <User size={18} /> Mi Perfil
                     </Link>
                     <button 
                       onClick={() => { logout(); onClose(); }}
                       className="w-full flex items-center justify-center gap-3 py-5 bg-white text-red-500 rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-red-50 transition-all border border-red-100"
                     >
                       <LogOut size={18} /> Cerrar Sesión
                     </button>
                   </div>
                 ) : (
                   <Link 
                     href="/auth/login" 
                     onClick={onClose}
                     className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 text-white rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all border border-slate-900"
                   >
                     <User size={18} /> Iniciar Sesión
                   </Link>
                 )}
              </div>

              <div className="mt-8 flex justify-between items-center text-slate-400">
                <span className="text-[9px] font-bold uppercase tracking-widest">Ladynail © 2026</span>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-slate-950 transition-colors text-[9px] font-bold uppercase tracking-widest">IG</a>
                  <a href="#" className="hover:text-slate-950 transition-colors text-[9px] font-bold uppercase tracking-widest">FB</a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
