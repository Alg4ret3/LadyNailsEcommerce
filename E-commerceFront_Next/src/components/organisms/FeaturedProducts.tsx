'use client';

import React from 'react';
import Link from 'next/link';
import { Typography } from '@/components/atoms/Typography';
import { ProductCard } from '@/components/molecules/ProductCard';
import { ArrowRight } from 'lucide-react';

const LATEST_EQUIPMENT = [
  { 
    id: '1', 
    name: 'Máquina Master Fade Pro', 
    price: 450000, 
    image: '/products/clipper-1.png', 
    images: ['/products/clipper-1.png', '/products/clipper-2.png'],
    category: 'Barbería', 
    slug: 'maquina-master-fade-pro', 
    rating: 5.0 
  },
  { 
    id: '2', 
    name: 'Lámpara LED UV Industrial', 
    price: 185000, 
    image: '/products/uv-lamp-industrial.png', 
    images: ['/products/uv-lamp-industrial.png', '/products/uv-lamp-2.png'],
    category: 'Uñas', 
    slug: 'lampara-led-uv-industrial', 
    rating: 4.9 
  },
  { 
    id: '3', 
    name: 'Silla Barbería Elite Heavy-Duty', 
    price: 2100000, 
    image: '/products/chair-1.png', 
    images: ['/products/chair-1.png', '/products/chair-2.png'],
    category: 'Mobiliario', 
    slug: 'silla-barberia-elite', 
    rating: 5.0 
  },
  { 
    id: '4', 
    name: 'Kit Aerógrafo Maquillaje Pro', 
    price: 320000, 
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1000', 
    images: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1000',
      'https://images.unsplash.com/photo-1596462502278-27bfac4023c6?q=80&w=1000'
    ],
    category: 'Maquillaje', 
    slug: 'kit-aerografo-pro', 
    rating: 4.8 
  },
];

export const FeaturedProducts: React.FC = () => {
  return (
    <section className="py-32 sm:py-48 bg-white border-t border-slate-100">
      <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 sm:mb-20 gap-8">
            <div className="space-y-4">
               <Typography variant="detail" className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs">PRODUCTOS MÁS VENDIDOS</Typography>
               <Typography variant="h2" className="text-4xl sm:text-6xl lg:text-7xl tracking-tighter leading-[0.9] sm:leading-[0.85]">EQUIPAMIENTO <br /> NUEVO</Typography>
            </div>
            <Link href="/shop" className="group flex items-center gap-4 py-2 border-b-2 border-slate-100 hover:border-slate-950 transition-all duration-500">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-slate-950 transition-colors duration-500">VER CATÁLOGO</span>
              <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-950 group-hover:translate-x-3 transition-all duration-500 ease-out" />
            </Link>
          </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 bg-slate-100 border border-slate-100">
          {LATEST_EQUIPMENT.map((item) => (
            <div key={item.id} className="bg-white">
              <ProductCard {...item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
