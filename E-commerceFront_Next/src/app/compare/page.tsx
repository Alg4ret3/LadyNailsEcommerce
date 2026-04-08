'use client';

import React, { useState } from 'react';
import { useCompare } from '@/context/CompareContext';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ArrowLeft, Star } from 'lucide-react';
import { ShoppingBag } from '@/components/icons';
import { AddToCartModal } from '@/components/organisms/AddToCartModal';

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const [selectedProductForCart, setSelectedProductForCart] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCartClick = (product: any) => {
    setSelectedProductForCart(product);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-white selection:bg-black selection:text-white">
      <Navbar />
      
      <div className="pt-32 sm:pt-48 pb-32 px-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-10 border-b border-black pb-12">
          <div className="space-y-4">
            <Link href="/shop" className="flex items-center gap-2 text-black/40 hover:text-black transition-colors text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              <ArrowLeft size={14} /> VOLVER AL CATÁLOGO
            </Link>
            <Typography variant="h2" className="text-6xl sm:text-8xl tracking-tighter font-black uppercase italic leading-[0.85]">
              COMPARAR <br /> <span className="opacity-20 font-light not-italic">PIEZAS</span>
            </Typography>
          </div>
          
          {compareItems.length > 0 && (
            <button 
              onClick={clearCompare}
              className="px-8 py-3.5 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all border border-black"
            >
              LIMPIAR SELECCIÓN
            </button>
          )}
        </div>

        {compareItems.length === 0 ? (
          <div className="py-40 flex flex-col items-center justify-center space-y-12">
            <div className="relative">
              <ShoppingBag size={80} className="text-black/5" strokeWidth={0.5} />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-1 h-1 bg-black rounded-full animate-ping" />
              </div>
            </div>
            <div className="text-center space-y-4">
              <Typography variant="h2" className="text-3xl font-black uppercase tracking-[0.2em]">SIN SELECCIÓN</Typography>
              <Typography variant="body" className="text-black/40 text-sm font-medium">No has seleccionado piezas para contraste técnico.</Typography>
            </div>
            <Button label="Ir al Catálogo" href="/shop" className="bg-black text-white px-12 py-6" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-100 border border-neutral-100">
            {compareItems.map((item) => (
              <div key={item.id} className="bg-white p-8 flex flex-col group relative transition-all duration-500">
                {/* Action Header */}
                <div className="absolute top-4 right-4 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => removeFromCompare(item.id)}
                    className="p-3 bg-black text-white hover:bg-neutral-800 transition-all"
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <Link href={`/product/${item.id}`} className="block relative aspect-square mb-10 overflow-hidden bg-white">
                   <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-cover transition-all duration-700 hover:scale-110" 
                  />
                </Link>

                <div className="flex-1 flex flex-col space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                       <Typography variant="detail" className="text-black/30 font-black text-[9px] uppercase tracking-widest">{item.vendor}</Typography>
                       <div className="w-1 h-1 bg-black/10 rounded-full" />
                       <div className="flex items-center gap-1">
                          <Star size={10} fill="black" className="text-black" />
                          <span className="text-[10px] font-black">{item.rating || 4.8}</span>
                       </div>
                    </div>
                    
                    <Link href={`/product/${item.id}`}>
                      <Typography variant="h4" className="text-xl sm:text-2xl font-black uppercase tracking-tighter leading-tight hover:opacity-60 transition-opacity">
                        {item.name}
                      </Typography>
                    </Link>

                    {item.description && (
                      <Typography variant="body" className="text-xs text-black/50 line-clamp-3 leading-relaxed font-medium">
                        {item.description}
                      </Typography>
                    )}
                  </div>

                  <div className="pt-6 border-t border-black/5 mt-auto">
                     <span className="text-[10px] font-medium text-black/30">$</span>
                     <Typography variant="h3" className="text-3xl font-black tracking-tighter inline-block ml-1">
                      {item.price.toLocaleString()}
                     </Typography>
                  </div>

                  {/* Ficha Técnica Minimal */}
                  <div className="space-y-6 pt-8 border-t border-black">
                    <Typography variant="detail" className="text-black font-black uppercase tracking-[0.4em] text-[9px] block">
                      ESPECIFICACIONES
                    </Typography>
                    <div className="space-y-5">
                      {/* Categoría */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] text-black/30 font-black uppercase tracking-[0.25em]">Categoría</span>
                        <span className="text-[10px] text-black font-bold uppercase">
                          {item.categories?.[0]?.name ?? item.category}
                        </span>
                      </div>
                      
                      {(() => {
                        const specConfigs = [
                          { label: 'Marca', key: 'marca', value: item.brand?.name },
                          { label: 'Uso', key: 'uso', value: item.usage?.name },
                          { label: 'Garantía', key: 'garantia', value: item.warranty?.name },
                          { label: 'Envío', key: 'envio', value: item.shipping?.name },
                        ];

                        const renderedHardcoded = specConfigs.map((spec, idx) => {
                          let displayValue = spec.value;
                          if (!displayValue && item.tags) {
                            const tagMatch = item.tags.find(t => t.toLowerCase().startsWith(`${spec.key}:`));
                            if (tagMatch) displayValue = tagMatch.split(':')[1].trim();
                          }

                          if (!displayValue) return null;

                          return (
                            <div key={idx} className="flex flex-col gap-1">
                              <span className="text-[8px] text-black/30 font-black uppercase tracking-[0.25em]">{spec.label}</span>
                              <span className="text-[10px] text-black font-bold uppercase">{displayValue}</span>
                            </div>
                          );
                        });

                        const otherSpecs = (item.tags || []).filter(t => {
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
                              <span className="text-[10px] text-black font-bold uppercase">{val}</span>
                            </div>
                          );
                        });

                        return [...renderedHardcoded, ...otherSpecs];
                      })()}
                    </div>
                  </div>

                  <div className="pt-10">
                    <Button
                      label="AÑADIR AL CARRO"
                      onClick={() => handleAddToCartClick(item)}
                      className="w-full bg-black text-white hover:bg-neutral-800 transition-colors py-5"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
