'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBasket, User, Search, Menu, Truck, Phone, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';
import { NavItem } from '@/components/molecules/NavItem';
import { MobileDrawer } from './MobileDrawer';
import { SearchOverlay } from './SearchOverlay';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCategories } from '@/context/CategoriesContext';

export const Navbar: React.FC = () => {
  const STATIC_LINKS = [
    { name: "Inicio", href: "/" },
    { name: "Contáctanos", href: "/contact" },
  ]
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileSections, setExpandedMobileSections] = useState<string[]>(['categories_root']);
  const { totalItems } = useCart();
  const { totalFavorites } = useWishlist();
  const { categories } = useCategories();

  const toggleMobileSection = (section: string) => {
    setExpandedMobileSections((prev: string[]) => 
      prev.includes(section) ? prev.filter((s: string) => s !== section) : [...prev, section]
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-900/10">
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MobileDrawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        categories={categories}
        expandedSections={expandedMobileSections}
        onToggleSection={toggleMobileSection}
      />

      {/* Utility Bar */}
      <div className="bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] px-6 py-2.5 flex justify-between items-center border-b border-slate-100">
        <div className="flex gap-6">
          <span className="flex items-center gap-2 font-medium"><Truck size={10} strokeWidth={2} /> Envíos a toda Colombia</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="tel:+570000000" className="flex items-center gap-2 hover:text-slate-950 transition-colors font-medium"><Phone size={10} strokeWidth={2} /> Atención al Cliente</a>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 text-white flex items-center justify-center font-black text-lg sm:text-xl group-hover:bg-slate-800 transition-colors">LN</div>
          <div className="flex flex-col">
            <Typography variant="h4" className="text-slate-900 leading-none text-sm sm:text-base tracking-tight">Ladynail Shop</Typography>
            <Typography variant="detail" className="text-[7px] sm:text-[8px] mt-0.5 sm:mt-1 font-medium opacity-60 uppercase">Tu Tienda Profesional</Typography>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          <NavItem name="Inicio" href="/" />

          {/* Catálogo dinámico */}
          <div
            onMouseEnter={() => setActiveDropdown("catalogo")}
            onMouseLeave={() => setActiveDropdown(null)}
            className="relative"
          >
            <NavItem
              name="Catálogo"
              href="/shop"
              hasSubcategories
              active={activeDropdown === "catalogo"}
            />

            <AnimatePresence>
              {activeDropdown === "catalogo" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 w-[500px] bg-white border border-slate-100 shadow-2xl py-6 z-50 overflow-hidden"
                >
                  <div className="flex flex-col">
                    <Typography
                      variant="detail"
                      className="px-8 mb-4 block text-[9px] text-slate-400"
                    >
                      Categorías
                    </Typography>

                    <div className="grid grid-cols-2 gap-y-1">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/shop/${category.handle}`}
                          className="px-8 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-900/60 hover:text-slate-900 hover:bg-slate-50 transition-all border-l-2 border-transparent hover:border-slate-900"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <NavItem name="Contacto" href="/contact" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-6">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 hover:bg-slate-50 rounded-full transition-colors hidden lg:block"
            aria-label="Buscar"
          >
            <Search size={22} strokeWidth={2} />
          </button>
          
          <Link href="/favorites" className="p-2.5 hover:bg-slate-50 rounded-full transition-colors relative group">
            <Heart size={18} strokeWidth={2.5} className="group-hover:text-red-500 transition-colors" />
            {totalFavorites > 0 && (
              <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-[7px] font-black rounded-full flex items-center justify-center">
                {totalFavorites}
              </span>
            )}
          </Link>

          <Link href="/auth/login" className="p-2.5 hover:bg-slate-50 rounded-full transition-colors hidden sm:block">
            <User size={18} strokeWidth={2.5} />
          </Link>

          <Link href="/cart" className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white hover:bg-slate-800 transition-all rounded-full group shadow-lg shadow-slate-900/10">
            <div className="flex items-center gap-3">
              <ShoppingBasket size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-[7px] font-bold uppercase tracking-widest opacity-60">MI CARRITO</span>
                <span className="text-[11px] font-black mt-0.5">{totalItems} ARTÍCULOS</span>
              </div>
              <span className="sm:hidden text-[11px] font-black">{totalItems}</span>
            </div>
          </Link>
          
          <button 
            className="lg:hidden p-2.5 text-slate-900" 
            onClick={() => setIsOpen(true)}
            aria-label="Menú"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};
