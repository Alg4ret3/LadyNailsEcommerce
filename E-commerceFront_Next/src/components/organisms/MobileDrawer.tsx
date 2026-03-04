'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Home, LayoutGrid, Package, Heart, HelpCircle, Truck, RefreshCcw, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Overlay } from '@/components/atoms/Overlay';
import { NavItem } from '@/components/molecules/NavItem';
import { useUser } from '@/context/UserContext';
import { LogOut } from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;

  categories: any[];
  expandedSections: string[];
  onToggleSection: (section: string) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ 
  isOpen, 
  onClose, 
  categories, 
  expandedSections, 
  onToggleSection 
}) => {
  const { user, logout } = useUser();
  const CategoryMobileItem = ({ category, level = 0 }: { category: any; level?: number }) => {
    const hasChildren = category.category_children && category.category_children.length > 0;
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <Link
            href={`/shop/${category.handle}`}
            onClick={onClose}
            style={{ paddingLeft: `${level * 16}px` }}
            className={`py-3 flex-1 flex items-center gap-3 ${level === 0 ? 'text-[11px] font-black' : 'text-[10px] font-bold text-slate-500'} uppercase tracking-widest hover:text-slate-950 transition-colors`}
          >
            {level === 0 && <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
            {level > 0 && <span className="text-slate-200">−</span>}
            {category.name}
          </Link>
          {hasChildren && (
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-slate-900' : ''}`} />
            </button>
          )}
        </div>
        
        <AnimatePresence>
          {isOpen && hasChildren && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-l border-slate-100 ml-2.5 mt-1 space-y-1">
                {category.category_children.map((sub: any) => (
                  <CategoryMobileItem key={sub.id} category={sub} level={level + 1} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Overlay isOpen={isOpen} onClose={onClose} />
          <motion.div 
             initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
             transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.8 }}
             className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-white z-100 flex flex-col shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden"
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
                        className="overflow-hidden pl-14 pr-4 space-y-4 pb-4"
                      >
                        
                        <Link 
                          href="/shop" 
                          onClick={onClose}
                          className="py-3 mt-2 text-[11px] font-black uppercase tracking-[0.2em] text-accent hover:text-slate-950 transition-colors flex items-center gap-2 border-b border-slate-50 border-dotted"
                        >
                          Ver Todo El Catálogo <ChevronDown size={14} className="-rotate-90" />
                        </Link>

                        <div className="flex flex-col">
                           {categories.map((category) => (
                             <CategoryMobileItem key={category.id} category={category} />
                           ))}
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
