'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { ProductCard } from '@/components/molecules/ProductCard';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites } = useWishlist();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 sm:pt-44 pb-32 px-4 sm:px-6 max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="mb-16 sm:mb-20 space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <div className="space-y-4">
              <Typography variant="detail" className="text-slate-400">Tus Productos Guardados</Typography>
              <Typography variant="h1" className="text-5xl sm:text-6xl md:text-7xl tracking-tighter leading-[0.9] font-medium">MIS <br /> <span className="text-red-500 font-light">FAVORITOS</span></Typography>
            </div>
            
            <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 border border-slate-100 rounded-full">
              <Heart size={16} className="text-red-500 fill-red-500" />
              <Typography variant="detail" className="text-slate-900 font-black">{favorites.length} PRODUCTOS</Typography>
            </div>
          </div>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {favorites.map((product) => (
                <motion.div 
                  key={product.id} 
                  className="h-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                >
                  <ProductCard {...product} slug={product.slug || ''} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center text-center space-y-8 border border-dashed border-slate-200 rounded-[40px] bg-slate-50/50">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl relative">
              <Heart size={40} className="text-slate-200" strokeWidth={1} />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full"
              />
            </div>
            <div className="max-w-md space-y-4">
              <Typography variant="h2" className="text-3xl tracking-tighter uppercase font-black">Aún no tienes favoritos</Typography>
              <Typography variant="body" className="text-slate-400 font-light text-lg">
                Guarda los productos que más te gustan para tenerlos siempre a mano y no perderles la pista.
              </Typography>
            </div>
            <Link href="/shop" className="group inline-flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-all">
              Ir a la tienda <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
