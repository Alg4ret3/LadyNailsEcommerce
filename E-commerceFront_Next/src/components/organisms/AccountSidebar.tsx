'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, Package, MapPin, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';
import { useUser } from '@/context/UserContext';

import { ROUTES } from '@/constants/routes';

const MENU_ITEMS = [
  { id: 'profile', href: ROUTES.profile, icon: <User size={20} />, label: 'Mi Perfil' },
  { id: 'orders', href: ROUTES.orders, icon: <Package size={20} />, label: 'Mis Pedidos' },
  { id: 'addresses', href: ROUTES.addresses, icon: <MapPin size={20} />, label: 'Direcciones' },
];

export const AccountSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useUser();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <div className="w-full lg:w-72 space-y-8">
      {/* User Hello Card */}
      <div className="bg-white border border-neutral-200 p-8 shadow-sm">
        <div className="space-y-1">
          <Typography variant="detail" className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">
            Bienvenido/a,
          </Typography>
          <Typography variant="h3" className="text-xl font-black uppercase tracking-tight truncate">
            {user?.firstName || 'Usuario'}
          </Typography>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-white border border-neutral-200 p-2 shadow-sm space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`group flex items-center gap-4 px-6 py-5 transition-all duration-300 relative overflow-hidden ${
                isActive 
                  ? 'bg-black text-white shadow-lg' 
                  : 'text-black hover:bg-black hover:text-white hover:shadow-md'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-bg"
                  className="absolute inset-0 bg-black border-l-4 border-neutral-400"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className={`relative z-10 shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'}`}>
                {item.icon}
              </div>
              
              <Typography 
                variant="h4" 
                className={`relative z-10 text-[10px] font-black tracking-[0.2em] uppercase text-left flex-1 transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-black group-hover:text-white'
                }`}
              >
                {item.label}
              </Typography>

              <ChevronRight 
                size={16} 
                className={`relative z-10 transition-all duration-500 ${
                  isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'
                }`} 
              />
            </Link>
          );
        })}

        {/* Divider */}
        <div className="mx-6 my-4 border-b border-neutral-100" />

        <button
          onClick={handleLogout}
          className="w-full group flex items-center gap-4 px-6 py-5 text-red-500/60 hover:text-red-500 hover:bg-red-50/30 transition-all"
        >
          <div className="shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
            <LogOut size={20} />
          </div>
          <Typography variant="h4" className="text-[10px] font-black tracking-[0.2em] uppercase text-left flex-1">
            Cerrar Sesión
          </Typography>
        </button>
      </nav>

      {/* Support Info */}
      <div className="bg-neutral-50 border border-neutral-100 p-6 space-y-4">
        <Typography variant="detail" className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest block">
          ¿Necesitas ayuda?
        </Typography>
        <Typography variant="body" className="text-[11px] leading-relaxed text-neutral-500">
          Si tienes problemas con tu cuenta o un pedido, contáctanos a soporte@ladynails.com
        </Typography>
      </div>
    </div>
  );
};
