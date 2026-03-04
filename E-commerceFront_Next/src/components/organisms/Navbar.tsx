'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBasket, User, Search, Menu, Truck, Phone, Heart, ChevronRight, LogOut, Package, UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';
import Image from 'next/image';
import { NavItem } from '@/components/molecules/NavItem';
import { MobileDrawer } from './MobileDrawer';
import { SearchOverlay } from './SearchOverlay';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCategories, Category } from '@/context/CategoriesContext';
import { useUser } from '@/context/UserContext';


export const Navbar: React.FC = () => {
  const STATIC_LINKS = [
    { name: "Inicio", href: "/" },
    { name: "Contáctanos", href: "/contact" },
  ]
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [expandedMobileSections, setExpandedMobileSections] = useState<string[]>(['categories_root']);
  const { totalItems } = useCart();
  const { totalFavorites } = useWishlist();

  const { user, logout } = useUser();

  const { getRootCategories } = useCategories();
  const rootCategories = getRootCategories();

  console.log(rootCategories);

  const toggleMobileSection = (section: string) => {
    setExpandedMobileSections((prev: string[]) => 
      prev.includes(section) ? prev.filter((s: string) => s !== section) : [...prev, section]
    );
  };

  const CategoryMenuItem = ({ category }: { category: Category }) => {
    const [hovered, setHovered] = useState(false);
    const hasChildren = category.category_children && category.category_children.length > 0;

    return (
      <div
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link
          href={`/shop/${category.handle}`}
          className="flex items-center justify-between px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest text-slate-900/60 hover:text-slate-900 hover:bg-slate-50 transition-all"
        >
          {category.name}
          {hasChildren && <ChevronRight size={10} strokeWidth={2.5} />}
        </Link>

        <AnimatePresence>
          {hovered && hasChildren && (
            <motion.div
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-full top-0 min-w-[200px] bg-white border border-slate-100 shadow-xl py-2 z-50"
            >
              {category.category_children!.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/shop/${sub.handle}`}
                  className="block px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-900/60 hover:text-slate-900 hover:bg-slate-50 transition-all"
                >
                  {sub.name}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-900/10">
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MobileDrawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        categories={rootCategories}
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
                  className="absolute top-full left-0 min-w-[220px] bg-white border border-slate-100 shadow-2xl py-4 z-50"
                >
                  <Typography
                    variant="detail"
                    className="px-6 mb-3 block text-[9px] text-slate-400 uppercase tracking-widest"
                  >
                    Categorías
                  </Typography>

                  {rootCategories.map((category) => (
                    <CategoryMenuItem key={category.id} category={category} />
                  ))}
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
