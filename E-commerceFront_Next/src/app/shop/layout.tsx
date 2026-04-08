'use client';

import React, { Suspense } from 'react';
import { MainLayout } from '@/components/templates/MainLayout';
import { ShopSidebar } from '@/components/organisms/ShopSidebar';
import { Typography } from '@/components/atoms/Typography';
import { SlidersHorizontal, X } from 'lucide-react';
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
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex items-center gap-2.5 px-7 py-3.5 bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
          >
            <SlidersHorizontal size={14} className="text-slate-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Filtros</span>
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
                  className="fixed inset-0 top-[96px] bg-black/5 backdrop-blur-sm z-[55]"
                />
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="fixed left-0 top-[96px] bottom-0 w-[85%] max-w-sm bg-white shadow-[20px_0_40px_-10px_rgba(0,0,0,0.08)] z-[56] flex flex-col border-r border-slate-100"
                >
                  {/* Fixed Header */}
                  <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 shrink-0">
                    <Typography variant="h4" className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-950">Filtros</Typography>
                    <button onClick={() => setIsMobileDrawerOpen(false)} className="text-slate-400 hover:text-slate-950 p-2 -mr-2 transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                  
                  {/* Scrollable Content */}
                  <div className="overflow-y-auto p-6 custom-scrollbar pb-10">
                    <Suspense fallback={<div className="animate-pulse bg-slate-50 h-full rounded-2xl" />}>
                      <ShopSidebar />
                    </Suspense>
                  </div>
                </motion.div>
             </div>
          )}
        </AnimatePresence>
      </MainLayout>
    </ShopProvider>
  );
}
