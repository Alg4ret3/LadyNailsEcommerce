'use client';

import React from 'react';
import { useCompare } from '@/context/CompareContext';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ArrowLeft, ShoppingBag, Star } from 'lucide-react';

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-2">
            <Link href="/shop" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-xs font-bold uppercase tracking-widest mb-4">
              <ArrowLeft size={14} /> Volver a la tienda
            </Link>
            <Typography variant="h2" className="text-5xl sm:text-6xl tracking-tighter">COMPARAR <br /> PRODUCTOS</Typography>
          </div>
          
          {compareItems.length > 0 && (
            <button 
              onClick={clearCompare}
              className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <Trash2 size={16} /> Limpiar Comparación
            </button>
          )}
        </div>

        {compareItems.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl space-y-8">
            <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full text-slate-300">
               <ShoppingBag size={32} />
            </div>
            <Typography variant="body" className="text-slate-400 text-xl font-light">No has seleccionado productos para comparar.</Typography>
            <Button label="Ir al Catálogo" href="/shop" className="bg-slate-900 text-white px-12" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 bg-slate-100 border border-slate-100">
            {compareItems.map((item) => (
              <div key={item.id} className="bg-white p-6 flex flex-col group relative border border-slate-100/50">
                {/* Action Header */}
                <div className="flex justify-end mb-4">
                  <button 
                    onClick={() => removeFromCompare(item.id)}
                    className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Eliminar de la comparación"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="relative aspect-square mb-8 overflow-hidden bg-slate-50 rounded-2xl border border-slate-100">
                   <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>

                <div className="flex-1 space-y-6">
                  <div className="space-y-3">
                    <Typography variant="detail" className="text-accent">{item.vendor}</Typography>
                    <Link href={`/product/${item.slug}`}>
                      <Typography variant="h4" className="text-lg leading-tight hover:text-accent transition-colors">{item.name}</Typography>
                    </Link>
                    <div className="flex items-center gap-1 text-slate-400">
                       <Star size={14} fill="currentColor" className="text-accent border-none" />
                       <span className="text-sm font-bold text-slate-900">{item.rating || 4.8}</span>
                    </div>
                    {item.description && (
                      <Typography variant="body" className="text-xs text-slate-500 line-clamp-3 leading-relaxed mt-2">
                        {item.description}
                      </Typography>
                    )}
                  </div>

                  <div className="py-6 border-t border-slate-100 flex-1 flex flex-col justify-end">
                     <Typography variant="h3" className="text-2xl font-black tracking-tighter">${item.price.toLocaleString()}</Typography>
                  </div>

                  {/* Tags / Ficha Técnica */}
                  <div className="space-y-4 pt-6 border-t border-slate-100">
                    <Typography variant="detail" className="text-slate-300 block mb-2">Especificaciones</Typography>
                    <div className="space-y-0 divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                      {/* Categoría */}
                      <div className="flex items-center justify-between px-3 py-2 text-xs">
                        <span className="text-slate-400 font-bold uppercase tracking-widest">Categoría</span>
                        <span className="text-slate-900 font-semibold text-right">
                          {item.categories?.[0]?.name ?? item.category}
                        </span>
                      </div>
                      {/* Tags as key:value rows */}
                      {item.tags && item.tags.map(tag => {
                        const colonIdx = tag.value.indexOf(':');
                        if (colonIdx === -1) return null;
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

                  <div className="pt-8">
                     <Button 
                       label="Añadir al Carrito" 
                       className="w-full bg-slate-900 text-white hover:bg-slate-800 transition-all border-none" 
                     />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
