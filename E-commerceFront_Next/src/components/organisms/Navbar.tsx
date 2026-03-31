'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { ShoppingBasket, Menu, Truck, Phone, Heart, ChevronRight, LogOut, Package, UserIcon, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';
import Image from 'next/image';
import { NavItem } from '@/components/molecules/NavItem';
import { MobileDrawer } from './MobileDrawer';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCategories, Category } from '@/context/CategoriesContext';
import { useUser } from '@/context/UserContext';
import { COMPANY_INFO, NAVBAR_CONTENT, ROUTES, WHATSAPP_CONFIG } from '@/constants';


export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeHoverCategory, setActiveHoverCategory] = useState<Category | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [expandedMobileSections, setExpandedMobileSections] = useState<string[]>(['categories_root']);
  const { totalItems } = useCart();
  const { totalFavorites } = useWishlist();

  const { user, logout } = useUser();

  const { getRootCategories } = useCategories();
  const rootCategories = getRootCategories();

  const toggleMobileSection = (section: string) => {
    setExpandedMobileSections((prev: string[]) => 
      prev.includes(section) ? prev.filter((s: string) => s !== section) : [...prev, section]
    );
  };

  const CategoryMenuItem = ({ category }: { category: Category }) => {
    const hasChildren = category.category_children && category.category_children.length > 0;

    return (
      <div
        className="relative"
        onMouseEnter={() => setActiveHoverCategory(category)}
      >
        <Link
          href={`/shop/${category.handle}`}
          className={`flex items-center justify-between px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all ${
            activeHoverCategory?.id === category.id 
              ? 'text-slate-900 bg-slate-50' 
              : 'text-slate-900/60 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          {category.name}
          {hasChildren && <ChevronRight size={10} strokeWidth={2.5} />}
        </Link>
      </div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-900/10">

      <MobileDrawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        categories={rootCategories}
        expandedSections={expandedMobileSections}
        onToggleSection={toggleMobileSection}
      />

      {/* Utility Bar */}
      <div className="bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] px-4 lg:px-6 py-2.5 flex justify-between items-center border-b border-slate-100 overflow-hidden whitespace-nowrap">
        <div className="flex gap-4 lg:gap-6 shrink-0">
          <a 
            href={`${WHATSAPP_CONFIG.baseUrl}/${WHATSAPP_CONFIG.defaultNumber}?text=${encodeURIComponent(WHATSAPP_CONFIG.shippingMessage)}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 font-medium hover:text-slate-950 transition-colors"
          >
            <Truck size={10} strokeWidth={2} /> 
            {NAVBAR_CONTENT.shippingMessage}
          </a>
        </div>
        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
          <a 
            href={`${WHATSAPP_CONFIG.baseUrl}/${WHATSAPP_CONFIG.defaultNumber}?text=${encodeURIComponent(WHATSAPP_CONFIG.supportMessage)}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 hover:text-slate-950 transition-colors font-medium"
          >
            <Phone size={10} strokeWidth={2} /> 
            <span className="hidden lg:inline">{NAVBAR_CONTENT.supportMessage}</span>
            <span className="lg:hidden">{NAVBAR_CONTENT.supportMessageMobile}</span>
          </a>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 h-16 lg:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href={ROUTES.home} className="flex items-center group py-2">
          <div className="relative w-20 h-20 lg:w-28 lg:h-28 flex items-center justify-center">
            <Image 
              src={COMPANY_INFO.logo.src} 
              alt={COMPANY_INFO.logo.alt} 
              fill
              className="object-contain group-hover:scale-105 transition-transform"
              priority
            />
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          <NavItem name="Inicio" href={ROUTES.home} />

          {/* Catálogo dinámico */}
          <div
            onMouseEnter={() => setActiveDropdown("catalogo")}
            onMouseLeave={() => {
              setActiveDropdown(null);
              setActiveHoverCategory(null);
            }}
            className="relative"
          >
            <NavItem
              name="Catálogo"
              href={ROUTES.shop}
              hasSubcategories
              active={activeDropdown === "catalogo"}
            />

            <AnimatePresence>
              {activeDropdown === "catalogo" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 flex bg-white border border-slate-100 shadow-2xl z-50 rounded-b-xl overflow-hidden"
                  onMouseLeave={() => setActiveHoverCategory(null)}
                >
                  {/* Left Column: Categories List (Scrollable) */}
                  <div className="w-[280px] py-4 max-h-[65vh] overflow-y-auto overflow-x-hidden custom-scrollbar border-r border-slate-100 bg-white">
                    <Typography
                      variant="detail"
                      className="px-6 mb-3 block text-[9px] text-slate-400 uppercase tracking-widest"
                    >
                      Categorías
                    </Typography>

                    {rootCategories.map((category) => (
                      <CategoryMenuItem key={category.id} category={category} />
                    ))}
                  </div>

                  {/* Right Column: Actived Subcategories List (Scrollable) */}
                  {activeHoverCategory && activeHoverCategory.category_children && activeHoverCategory.category_children.length > 0 && (
                    <div className="w-[280px] py-4 max-h-[65vh] overflow-y-auto overflow-x-hidden custom-scrollbar bg-slate-50">
                      <Typography
                        variant="detail"
                        className="px-6 mb-3 block text-[9px] text-slate-400 uppercase tracking-widest truncate"
                      >
                        {activeHoverCategory.name}
                      </Typography>
                      {activeHoverCategory.category_children.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/shop/${sub.handle}`}
                          className="block px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-sm transition-all rounded-lg mx-3 mb-1"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <NavItem name="Contacto" href={ROUTES.contact} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 lg:gap-6">

          
          <Link href={ROUTES.favorites} className="p-2.5 hover:bg-slate-50 rounded-full transition-colors relative group">
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
                className="p-2.5 hover:bg-slate-50 rounded-full transition-colors hidden lg:block relative group"
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
                        href={ROUTES.profile} 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-all text-slate-600 group"
                      >
                        <UserIcon size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-slate-900 transition-colors">Mi Perfil</span>
                      </Link>
                      <Link 
                        href={ROUTES.orders} 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-all text-slate-600 group"
                      >
                        <Package size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-slate-900 transition-colors">Mis Pedidos</span>
                      </Link>
                      <Link 
                        href={ROUTES.addresses} 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-all text-slate-600 group"
                      >
                        <MapPin size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-slate-900 transition-colors">Mis Direcciones</span>
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
            <Link href={ROUTES.login} className="p-2.5 hover:bg-slate-50 rounded-full transition-colors hidden lg:block">
              <UserIcon size={18} strokeWidth={2.5} />
            </Link>
          )}

          <Link href={ROUTES.cart} className="flex items-center gap-2 px-3 lg:px-6 py-2.5 bg-slate-900 text-white hover:bg-slate-800 transition-all rounded-full group shadow-lg shadow-slate-900/10">
            <div className="flex items-center gap-2 lg:gap-3">
              <ShoppingBasket size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
              <div className="hidden lg:flex flex-col items-start leading-none">
                <span className="text-[7px] font-bold uppercase tracking-widest opacity-60">MI CARRITO</span>
                <span className="text-[11px] font-black mt-0.5">{totalItems} ARTÍCULOS</span>
              </div>
              <span className="lg:hidden text-[10px] font-black">{totalItems}</span>
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
