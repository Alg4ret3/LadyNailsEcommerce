'use client';

import React from 'react';
import { Typography } from '@/components/atoms/Typography';
import { CategoryCard } from '@/components/molecules/CategoryCard';
import { HOME_CATEGORIES } from '@/constants';

export const CategoryGrid: React.FC = () => {
  return (
    <section aria-label="Categorías de Productos" className="py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-12 sm:mb-20 flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-200 pb-8 sm:pb-12 gap-6">
          <div>
            <Typography variant="h2" className="mt-2 text-3xl sm:text-4xl uppercase font-black tracking-tighter">NUESTRAS LÍNEAS PROFESIONALES</Typography>
          </div>
          <Typography variant="body" className="max-w-xs text-left sm:text-right text-[10px] sm:text-xs text-slate-400">
            Manejamos más de 5,000 referencias activas en bodega listas para despacho inmediato a nivel nacional.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200 bg-white">
          {HOME_CATEGORIES.map((cat, i) => (
            <CategoryCard key={i} {...cat} />
          ))}
        </div>
      </div>
    </section>
  );
};
