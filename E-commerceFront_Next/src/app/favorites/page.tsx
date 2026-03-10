'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useWishlist();

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
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {favorites.map((product) => {
                const specTags = (product.tags ?? []).filter(t => t.value?.includes(':'));
                const category = product.categories?.[0]?.name ?? product.category;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                    className="bg-white border border-slate-100 rounded-2xl overflow-hidden flex flex-col sm:flex-row hover:shadow-lg transition-all duration-300"
                  >
                    {/* Image */}
                    <Link href={`/product/${product.id}`} className="relative shrink-0 w-full sm:w-48 md:w-60 aspect-square sm:aspect-auto bg-slate-50">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </Link>

                    {/* Content */}
                    <div className="flex flex-col sm:flex-row flex-1 p-6 gap-6">
                      {/* Left: Info */}
                      <div className="flex-1 space-y-4">
                        <div className="space-y-1">
                          {category && (
                            <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-muted px-2 py-0.5 rounded">
                              {category}
                            </span>
                          )}
                          <Link href={`/product/${product.id}`}>
                            <Typography variant="h3" className="text-lg font-bold leading-tight hover:text-accent transition-colors mt-1">
                              {product.name}
                            </Typography>
                          </Link>
                          {product.vendor && (
                            <Typography variant="detail" className="text-slate-400 text-xs">{product.vendor}</Typography>
                          )}
                        </div>

                        {product.description && (
                          <Typography variant="body" className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                            {product.description}
                          </Typography>
                        )}

                        <Typography variant="h3" className="text-xl font-black tracking-tighter">
                          ${product.price.toLocaleString()}
                        </Typography>

                        <div className="flex gap-3 pt-2">
                          <Button
                            label="Ver Producto"
                            href={`/product/${product.id}`}
                            className="bg-slate-900 text-white text-xs px-6 py-2.5"
                          />
                          <button
                            onClick={() => toggleFavorite(product)}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={14} /> Eliminar
                          </button>
                        </div>
                      </div>

                      {/* Right: Tech Specs */}
                      {specTags.length > 0 && (
                        <div className="w-full sm:w-56 md:w-64 shrink-0">
                          <Typography variant="detail" className="text-slate-300 uppercase tracking-widest text-[9px] block mb-2">
                            Ficha Técnica
                          </Typography>
                          <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                            {specTags.map(tag => {
                              const colonIdx = tag.value?.indexOf(':') ?? -1;
                              const key = tag.value.slice(0, colonIdx).trim();
                              const val = tag.value.slice(colonIdx + 1).trim();
                              return (
                                <div key={tag.id} className="flex items-center justify-between px-3 py-2 text-xs">
                                  <span className="text-slate-400 font-bold uppercase tracking-widest">{key}</span>
                                  <span className="text-slate-900 font-semibold text-right">{val}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
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
