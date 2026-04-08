'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';
import { ShoppingBag } from '@/components/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { AddToCartModal } from '@/components/organisms/AddToCartModal';
import Link from 'next/link';
import Image from 'next/image';

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useWishlist();
  const [selectedProductForCart, setSelectedProductForCart] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCartClick = (product: any) => {
    setSelectedProductForCart(product);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-white selection:bg-black selection:text-white">
      <Navbar />

      <section className="pt-32 sm:pt-44 pb-32 px-4 sm:px-6 max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="mb-16 sm:mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-black pb-12">
            <div className="space-y-4">
              <Typography variant="detail" className="text-black/40 font-black uppercase tracking-[0.4em] text-[10px]">Guardado por Ti</Typography>
              <Typography variant="h1" className="text-5xl sm:text-6xl md:text-7xl tracking-tighter leading-[0.9] font-black uppercase italic">
                MIS <br /> <span className="opacity-20 font-light not-italic">FAVORITOS</span>
              </Typography>
            </div>
            <div className="flex items-center gap-4 px-8 py-3.5 bg-black">
              <Heart size={16} className="text-white fill-white" />
              <Typography variant="detail" className="font-black tracking-[0.2em] text-xs text-white">{favorites.length} PIEZAS</Typography>
            </div>
          </div>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 gap-px bg-slate-100 border border-slate-100">
            <AnimatePresence mode="popLayout">
              {favorites.map((product) => {
                const specTags = (product.tags ?? []).filter(t => t.includes(':'));
                const category = product.categories?.[0]?.name ?? product.category;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    layout
                    className="bg-white group flex flex-col md:flex-row transition-all duration-500"
                  >
                    {/* Image */}
                    <Link href={`/product/${product.id}`} className="relative shrink-0 w-full md:w-80 aspect-square overflow-hidden bg-slate-50">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-all duration-700 hover:scale-110"
                      />
                    </Link>

                    {/* Content */}
                    <div className="flex flex-col sm:flex-row flex-1 p-8 sm:p-12 gap-10">
                      {/* Left: Info */}
                      <div className="flex-1 space-y-8">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            {category && (
                              <span className="text-[9px] font-black text-black uppercase tracking-[0.3em] border border-black/10 px-3 py-1">
                                {category}
                              </span>
                            )}
                            {product.vendor && (
                              <Typography variant="detail" className="text-black/30 text-[9px] font-bold uppercase tracking-widest">{product.vendor}</Typography>
                            )}
                          </div>
                          
                          <Link href={`/product/${product.id}`}>
                            <Typography variant="h3" className="text-2xl sm:text-4xl font-black uppercase tracking-tighter leading-none hover:opacity-60 transition-opacity">
                              {product.name}
                            </Typography>
                          </Link>
                        </div>

                        {product.description && (
                          <Typography variant="body" className="text-xs text-black/50 leading-[1.8] max-w-xl font-medium">
                            {product.description}
                          </Typography>
                        )}

                        <div className="flex items-end gap-1">
                          <span className="text-xs font-bold text-black/40 mb-1.5">$</span>
                          <Typography variant="h3" className="text-3xl font-black tracking-tighter">
                            {product.price.toLocaleString()}
                          </Typography>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 pt-4">
                          <Button
                            label="COMPRAR"
                            onClick={() => handleAddToCartClick(product)}
                            className="bg-black text-white hover:bg-neutral-800 transition-colors px-10 py-5"
                          />
                          <button
                            onClick={() => toggleFavorite(product)}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-black/20 hover:text-black transition-colors"
                          >
                            <Trash2 size={13} /> ELIMINAR
                          </button>
                        </div>
                      </div>

                      {/* Right: Technical Details (Minimal) */}
                      <div className="w-full sm:w-48 md:w-56 shrink-0 pt-2">
                        <Typography variant="detail" className="text-black font-black uppercase tracking-[0.4em] text-[9px] block mb-6 pb-2 border-b border-black">
                          DETALLES
                        </Typography>
                        <div className="space-y-4">
                          {(() => {
                            const specs = [
                              { label: 'Marca', key: 'marca', value: product.brand?.name },
                              { label: 'Uso', key: 'uso', value: product.usage?.name },
                              { label: 'Garantía', key: 'garantia', value: product.warranty?.name },
                              { label: 'Envío', key: 'envio', value: product.shipping?.name },
                            ];

                            const renderedHardcoded = specs.map((spec, idx) => {
                              let displayValue = spec.value;
                              if (!displayValue) {
                                const tagMatch = specTags.find(t => t.toLowerCase().startsWith(`${spec.key}:`));
                                if (tagMatch) displayValue = tagMatch.split(':')[1].trim();
                              }

                              if (!displayValue) return null;

                              return (
                                <div key={idx} className="flex flex-col gap-1">
                                  <span className="text-[8px] text-black/30 font-black uppercase tracking-[0.25em]">{spec.label}</span>
                                  <span className="text-[10px] text-black font-bold uppercase truncate">{displayValue}</span>
                                </div>
                              );
                            });

                            const otherSpecs = specTags.filter(t => {
                              const tagStr = typeof t === 'string' ? t : (t as any).value || '';
                              const colonIdx = tagStr.indexOf(':');
                              if (colonIdx === -1) return false;
                              const key = tagStr.slice(0, colonIdx).trim().toLowerCase();
                              return !['marca', 'garantia', 'uso', 'envio'].includes(key);
                            }).map((tag, idx) => {
                              const tagStr = typeof tag === 'string' ? tag : (tag as any).value || '';
                              const colonIdx = tagStr.indexOf(':');
                              const key = tagStr.slice(0, colonIdx).trim();
                              const val = tagStr.slice(colonIdx + 1).trim();
                              return (
                                <div key={`other-${idx}`} className="flex flex-col gap-1">
                                  <span className="text-[8px] text-black/30 font-black uppercase tracking-[0.25em]">{key}</span>
                                  <span className="text-[10px] text-black font-bold uppercase truncate">{val}</span>
                                </div>
                              );
                            });

                            return [...renderedHardcoded, ...otherSpecs];
                          })()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-40 flex flex-col items-center text-center space-y-12">
            <div className="relative">
              <Heart size={80} className="text-black/5" strokeWidth={0.5} />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-1 h-1 bg-black rounded-full animate-ping" />
              </div>
            </div>
            
            <div className="space-y-6 max-w-sm">
              <Typography variant="h2" className="text-3xl font-black uppercase tracking-[0.2em]">EL VACÍO</Typography>
              <Typography variant="body" className="text-black/40 text-sm font-medium leading-relaxed">
                Tus piezas favoritas aparecerán aquí una vez que las selecciones en nuestro catálogo.
              </Typography>
            </div>

            <Button 
              label="EXPLORAR COLECCIONES" 
              href="/shop" 
              className="bg-black text-white hover:bg-neutral-800 transition-colors px-12 py-6"
            />
          </div>
        )}
      </section>

      {/* Add to Cart Modal */}
      {selectedProductForCart && (
        <AddToCartModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={{
            id: selectedProductForCart.id,
            name: selectedProductForCart.name,
            price: selectedProductForCart.price,
            image: selectedProductForCart.image || "/placeholder.jpg",
            slug: selectedProductForCart.slug || selectedProductForCart.id,
            tags: selectedProductForCart.tags?.map((t: any) => t.value || t) || [],
            vendor: selectedProductForCart.vendor,
            color: selectedProductForCart.color,
            colors: selectedProductForCart.colors,
            sizes: selectedProductForCart.sizes,
          }}
        />
      )}

      <Footer />
    </main>
  );
}
