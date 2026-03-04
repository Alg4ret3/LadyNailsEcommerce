'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBasket, Search, Menu, Truck, Phone, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';
import Image from 'next/image';
import { NavItem } from '@/components/molecules/NavItem';
import { MobileDrawer } from './MobileDrawer';
import { SearchOverlay } from './SearchOverlay';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useUser } from '@/context/UserContext';
import { LogOut, Package, User as UserIcon } from 'lucide-react';

export const NAV_LINKS = [
  { name: 'Inicio', href: '/' },
  { 
    name: 'Catálogo', 
    href: '/shop',
    subcategories: [
      { name: 'Lámparas UV y Eléctricos', href: '/shop/uv-lamps' },
      { name: 'Puliadores y Driles', href: '/shop/drills' },
      { name: 'Esmaltes Semipermanentes', href: '/shop/semi-permanent' },
      { name: 'Brillos y Preparadores', href: '/shop/prep-finish' },
      { name: 'Tips y Press-On', href: '/shop/tips-presson' },
      { name: 'Herramientas Pro', href: '/shop/tools' },
      { name: 'Decoración y Stickers', href: '/shop/decorations' },
      { name: 'Removedores y Limpiadores', href: '/shop/removers' },
      { name: 'Esmalte Tradicional', href: '/shop/traditional' },
      { name: 'Geles y Polygel', href: '/shop/gels' },
      { name: 'Pestañas y Cejas', href: '/shop/lashes' },
      { name: 'Línea Spa y Cuidado', href: '/shop/spa' },
      { name: 'Peluquería y Barbería', href: '/shop/barber-hair' },
      { name: 'Cuidado de la Piel', href: '/shop/skincare' },
      { name: 'Maquillaje Profesional', href: '/shop/makeup' },
      { name: 'Pinceles y Brochas', href: '/shop/brushes' },
      { name: 'Sistemas de Acrílico', href: '/shop/acrylics' },
      { name: 'Perfumería', href: '/shop/perfumes' },
      { name: 'Limas y Pulidores', href: '/shop/files' },
    ]
  },
  { name: 'Contáctanos', href: '/contact' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [expandedMobileSections, setExpandedMobileSections] = useState<string[]>(['categories_root']);
  const { totalItems } = useCart();
  const { totalFavorites } = useWishlist();
  const { user, logout } = useUser();

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
        NAV_LINKS={NAV_LINKS}
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
        <Link href="/" className="flex items-center group py-2">
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center">
            <Image 
              src="/assets/LogoProvicional.svg" 
              alt="Ladynail Shop Logo" 
              fill
              className="object-contain group-hover:scale-105 transition-transform"
              priority
            />
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <div 
              key={link.name} 
              onMouseEnter={() => link.subcategories && setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
              className="relative"
            >
              <NavItem 
                name={link.name}
                href={link.href}
                hasSubcategories={!!link.subcategories}
                active={activeDropdown === link.name}
              />

              <AnimatePresence>
                {link.subcategories && activeDropdown === link.name && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-[500px] bg-white border border-slate-100 shadow-2xl py-6 z-50 overflow-hidden"
                  >
                    <div className="flex flex-col">
                      <Typography variant="detail" className="px-8 mb-4 block text-[9px] text-slate-400">Categorías Principales</Typography>
                      <div className="grid grid-cols-2 gap-y-1">
                      {link.subcategories.map((sub) => (
                        <Link 
                          key={sub.name} 
                          href={sub.href}
                          className="px-8 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-900/60 hover:text-slate-900 hover:bg-slate-50 transition-all border-l-2 border-transparent hover:border-slate-900"
                        >
                          {sub.name}
                        </Link>
                      ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
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

          {user?.isLoggedIn ? (
            <div className="relative">
              <button 
                onMouseEnter={() => setIsProfileOpen(true)}
                className="p-2.5 hover:bg-slate-50 rounded-full transition-colors hidden sm:block relative group"
              >
                <UserIcon size={18} strokeWidth={2.5} className={isProfileOpen ? 'text-slate-900' : 'text-slate-400'} />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseEnter={() => setIsProfileOpen(true)}
                    onMouseLeave={() => setIsProfileOpen(false)}
                    className="absolute top-full right-0 w-64 bg-white border border-slate-100 shadow-2xl py-4 z-50 mt-2 rounded-2xl"
                  >
                    <div className="px-6 py-4 border-b border-slate-50 mb-2">
                      <Typography variant="detail" className="text-[8px] text-slate-400">Usuario Activo</Typography>
                      <Typography variant="h4" className="text-xs truncate">{user.name}</Typography>
                    </div>
                    <div className="flex flex-col">
                      <Link 
                        href="/account" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-all text-slate-600 group"
                      >
                        <UserIcon size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-slate-900 transition-colors">Mi Perfil</span>
                      </Link>
                      <Link 
                        href="/account" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-all text-slate-600 group"
                      >
                        <Package size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-slate-900 transition-colors">Mis Pedidos</span>
                      </Link>
                      <button 
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center gap-4 px-6 py-3 hover:bg-red-50 text-red-400 mt-2 transition-all group"
                      >
                        <LogOut size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-red-600 transition-colors">Cerrar Sesión</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/auth/login" className="p-2.5 hover:bg-slate-50 rounded-full transition-colors hidden sm:block">
              <UserIcon size={18} strokeWidth={2.5} />
            </Link>
          )}

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
