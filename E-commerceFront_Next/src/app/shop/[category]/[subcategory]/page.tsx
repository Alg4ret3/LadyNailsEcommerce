'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';

export default function SubcategoryPage() {
  const params = useParams();
  const { category, subcategory } = params;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="pt-44 pb-20 px-6 max-w-[1400px] mx-auto">
        <div className="mb-16">
          <Typography variant="detail" className="text-slate-400 uppercase tracking-widest">
            {category} / {subcategory}
          </Typography>
          <Typography variant="h2" className="text-5xl font-black mt-4 uppercase">
            {String(subcategory).replace(/-/g, ' ')}
          </Typography>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <Typography variant="body" className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 text-slate-300">
            Navegando en el inventario de {subcategory}...
          </Typography>
        </div>
      </section>
      <Footer />
    </main>
  );
}
