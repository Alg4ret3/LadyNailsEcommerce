'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { ShoppingCart, Menu, X, Truck, Phone, Heart, ChevronRight, LogOut, Package, UserIcon, MapPin } from 'lucide-react';
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
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
    <>
    <nav className="fixed top-0 left-0 right-0 z-[60] bg-white border-b border-slate-900/10">

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

      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 h-16 lg:h-20 flex items-center justify-between relative">
        <button 
          className="lg:hidden p-2.5 text-slate-900 -ml-2.5 relative flex items-center justify-center w-10 h-10 z-[70]" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <div className="flex flex-col justify-center items-center gap-[5px] w-6 h-6">
            <motion.span
              animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
              className="w-full h-[1.5px] bg-slate-900 rounded-full"
            />
            <motion.span
              animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
              className="w-full h-[1.5px] bg-slate-900 rounded-full"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
              className="w-full h-[1.5px] bg-slate-900 rounded-full"
            />
          </div>
        </button>

        {/* Logo */}
        <Link href={ROUTES.home} className="flex items-center group py-2 lg:static absolute left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0">
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

          
          <Link href={ROUTES.favorites} className="p-2.5 hover:bg-slate-50 rounded-full transition-colors relative group text-slate-900">
            <Heart size={22} strokeWidth={2} className="group-hover:text-red-500 transition-colors" />
            {totalFavorites > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
                {totalFavorites}
              </span>
            )}
          </Link>

          {user?.isLoggedIn ? (
            <div className="relative">
              <button 
                onMouseEnter={() => setIsProfileOpen(true)}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-2.5 hover:bg-slate-50 rounded-full transition-colors relative group text-slate-900"
              >
                <UserIcon size={22} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
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
                          setShowLogoutConfirm(true);
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
            <Link href={ROUTES.login} className="p-2.5 hover:bg-slate-50 rounded-full transition-colors relative group text-slate-900">
              <UserIcon size={22} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
            </Link>
          )}

          <Link 
            href={ROUTES.cart} 
            className="p-2.5 hover:bg-slate-50 rounded-full transition-colors relative group text-slate-900"
          >
            <ShoppingCart size={22} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
            
            {/* Count badge */}
            {totalItems > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-slate-900 text-white text-[8px] font-black rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
    <MobileDrawer 
      isOpen={isOpen} 
      onClose={() => setIsOpen(false)} 
      categories={rootCategories}
      expandedSections={expandedMobileSections}
      onToggleSection={toggleMobileSection}
    />
    
    {/* Custom Logout Confirmation Modal */}
    <AnimatePresence>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white p-8 max-w-[320px] w-full shadow-2xl flex flex-col items-center text-center border border-slate-100/50"
          >
            <Typography variant="h4" className="text-sm font-black uppercase tracking-widest mb-3 text-slate-900">CERRAR SESIÓN</Typography>
            <p className="text-xs text-slate-400 mb-8">¿Deseas salir de tu cuenta?</p>
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  logout();
                  setShowLogoutConfirm(false);
                }}
                className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-900 border border-slate-200 hover:bg-slate-900 hover:text-white transition-all"
              >
                Salir
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
};
