'use client';

import React from 'react';
import Link from 'next/link';
import { Box } from 'lucide-react';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { ProductCard } from '@/components/molecules/ProductCard';

const LATEST_EQUIPMENT = [
  { id: '1', name: 'Máquina Master Fade Pro', price: 450000, image: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?q=80&w=1000', category: 'Barbería', slug: 'maquina-master-fade-pro', rating: 5.0 },
  { id: '2', name: 'Lámpara LED UV Industrial', price: 185000, image: 'https://images.unsplash.com/photo-1634712282287-14ee57b9ea59?q=80&w=1000', category: 'Uñas', slug: 'lampara-led-uv-industrial', rating: 4.9 },
  { id: '3', name: 'Silla Barbería Elite Heavy-Duty', price: 2100000, image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1000', category: 'Mobiliario', slug: 'silla-barberia-elite', rating: 5.0 },
  { id: '4', name: 'Kit Aerógrafo Maquillaje Pro', price: 320000, image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1000', category: 'Maquillaje', slug: 'kit-aerografo-pro', rating: 4.8 },
];

export const FeaturedProducts: React.FC = () => {
  return (
    <section className="py-32 sm:py-48 bg-white border-t border-slate-100">
      <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 sm:mb-20 gap-8">
            <div className="space-y-4">
               <Typography variant="detail" className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs">Productos más vendidos</Typography>
               <Typography variant="h2" className="text-4xl sm:text-6xl lg:text-7xl tracking-tighter leading-[0.9] sm:leading-[0.85]">EQUIPAMIENTO <br /> NUEVO</Typography>
            </div>
            <Button label="Ver Inventario" variant="ghost" className="hover:pl-4 transition-all p-0 font-bold text-xs" />
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
