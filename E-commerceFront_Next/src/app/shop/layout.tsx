'use client';

import React, { Suspense } from 'react';
import { MainLayout } from '@/components/templates/MainLayout';
import { ShopSidebar } from '@/components/organisms/ShopSidebar';
import { Typography } from '@/components/atoms/Typography';
import { SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopProvider } from '@/context/ShopContext';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = React.useState(false);

  return (
    <ShopProvider>
      <MainLayout>
        <section className="pt-32 sm:pt-44 pb-32 px-4 sm:px-6 max-w-[1400px] mx-auto min-h-screen">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Main Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-32 max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar pr-4 -mr-4">
              <Suspense fallback={<div className="animate-pulse bg-slate-50 h-96 rounded-2xl" />}>
                <ShopSidebar />
              </Suspense>
            </div>
          </aside>

            {/* Product Feed / Sub-pages */}
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        </section>

        {/* Floating Mobile Filter Button */}
        <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-full shadow-2xl shadow-slate-400/50"
          >
            <SlidersHorizontal size={16} className="text-white/60" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Filtros</span>
          </motion.button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileDrawerOpen && (
             <div className="fixed inset-0 z-50 lg:hidden">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl p-6 overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-8">
                    <Typography variant="h4" className="text-xs tracking-widest font-black uppercase">Filtrar</Typography>
                    <button onClick={() => setIsMobileDrawerOpen(false)} className="text-slate-400">✕</button>
                  </div>
                  <Suspense fallback={<div>Cargando filtros...</div>}>
                    <ShopSidebar />
                  </Suspense>
                </motion.div>
             </div>
          )}
        </AnimatePresence>
      </MainLayout>
    </ShopProvider>
  );
}
