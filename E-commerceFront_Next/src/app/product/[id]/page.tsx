'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Truck, ShieldCheck, Box, RefreshCcw } from 'lucide-react';
import Image from 'next/image';

import { useParams } from 'next/navigation';
import { AddToCartModal } from '@/components/organisms/AddToCartModal';

const PRODUCTS = [
  { id: '1', name: 'Máquina Master Fade Pro', price: 450000, image: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?q=80&w=1000&auto=format&fit=crop', category: 'Barbería', slug: 'maquina-master-fade-pro', sku: 'BK-MFP-001' },
  { id: '2', name: 'Lámpara LED UV Industrial', price: 185000, image: 'https://images.unsplash.com/photo-1634712282287-14ee57b9ea59?q=80&w=1000&auto=format&fit=crop', category: 'Uñas', slug: 'lampara-led-uv-industrial', sku: 'NA-UVL-002' },
  { id: '3', name: 'Silla Barbería Elite Heavy-Duty', price: 2100000, image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1000&auto=format&fit=crop', category: 'Mobiliario', slug: 'silla-barberia-elite', sku: 'FN-SBE-003' },
  { id: '4', name: 'Kit Aerógrafo Maquillaje Pro', price: 320000, image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1000&auto=format&fit=crop', category: 'Maquillaje', slug: 'kit-aerografo-pro', sku: 'MU-KAP-004' },
];

export default function ProductPage() {
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const product = PRODUCTS.find(p => p.slug === params.id) || PRODUCTS[0];

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <section className="pt-44 pb-24 px-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 bg-white border border-slate-200 p-8 sm:p-16">
          {/* Images */}
          <div className="space-y-4">
             <div className="relative aspect-square bg-[#f1f5f9] border border-slate-100 flex items-center justify-center p-12">
                <Image 
                   src={product.image} 
                   alt={product.name} fill className="object-contain p-8" 
                />
             </div>
             <div className="grid grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="aspect-square bg-slate-50 border border-slate-100 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"></div>
                ))}
             </div>
          </div>

          {/* Info */}
          <div className="space-y-8">
             <div className="space-y-4">
                <Typography variant="detail" className="text-slate-400">SKU: {product.sku}</Typography>
                <Typography variant="h1" className="text-4xl sm:text-6xl uppercase tracking-tighter">{product.name}</Typography>
                <div className="flex items-center gap-4 py-2 border-y border-slate-100">
                   <Typography variant="h3" className="text-3xl font-black">${product.price.toLocaleString()}</Typography>
                   <span className="text-xs bg-slate-900 text-white px-3 py-1 font-bold">STOCK DISPONIBLE</span>
                </div>
             </div>

             <Typography variant="body" className="text-lg font-light leading-relaxed">
               Herramienta de alto rendimiento diseñada específicamente para el uso intensivo en estaciones de trabajo profesionales. Fabricada con materiales de grado industrial bajo certificación GA.
             </Typography>

             <div className="space-y-4 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-4">
                   <Button 
                      label="Añadir al Carrito" 
                      className="flex-1 py-5" 
                      onClick={() => setIsModalOpen(true)}
                   />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-6 pt-12">
                <div className="flex items-center gap-3">
                   <Truck size={18} className="text-slate-400" />
                   <Typography variant="small">Envío Nacional</Typography>
                </div>
                <div className="flex items-center gap-3">
                   <ShieldCheck size={18} className="text-slate-400" />
                   <Typography variant="small">Garantía Industrial</Typography>
                </div>
                <div className="flex items-center gap-3">
                   <Box size={18} className="text-slate-400" />
                   <Typography variant="small">Stock en Bodega</Typography>
                </div>
                <div className="flex items-center gap-3">
                   <RefreshCcw size={18} className="text-slate-400" />
                   <Typography variant="small">Devolución 30 Días</Typography>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Add To Cart Modal */}
      <AddToCartModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{
          ...product,
          vendor: 'Ladynail Shop'
        }}
      />

      <Footer />
    </main>
  );
}
