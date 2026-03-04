'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import Image from 'next/image';

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="pt-32 sm:pt-44 pb-16 sm:pb-32 px-4 sm:px-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
           <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              <Typography variant="detail" className="text-slate-400">Excelencia en Belleza</Typography>
              <div className="relative w-64 h-32 sm:w-96 sm:h-48 mx-auto lg:mx-0">
                <Image 
                  src="/assets/LogoProvicional.svg" 
                  alt="Ladynail Shop Logo" 
                  fill
                  className="object-contain invert-0"
                  priority
                />
              </div>
              <Typography variant="body" className="text-lg sm:text-xl font-light text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Nacimos con la visión de transformar la experiencia del profesional de la belleza. Ladynail Shop es hoy el referente en suministro estético, trayendo las tendencias globales al mercado local con eficiencia industrial.
              </Typography>
              <div className="grid grid-cols-2 gap-8 pt-8">
                 <div className="space-y-2">
                    <Typography variant="h3" className="text-4xl text-slate-900">25+</Typography>
                    <Typography variant="small">Años de Trayectoria</Typography>
                 </div>
                 <div className="space-y-2">
                    <Typography variant="h3" className="text-4xl text-slate-900">10k+</Typography>
                    <Typography variant="small">Clientes Profesionales</Typography>
                 </div>
              </div>
           </div>
           <div className="relative aspect-4/5 bg-slate-100 border border-slate-200">
              <Image 
                 src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop" 
                 alt="Our Facility" fill className="object-cover grayscale" 
              />
           </div>
        </div>
      </section>

      <section className="py-24 bg-slate-900 text-white px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
           <div className="space-y-4">
              <Typography variant="h4" className="text-slate-500">Misión</Typography>
              <Typography variant="body" className="text-white/60">Equipar a cada artista de la belleza con tecnología y suministros que eleven su arte al siguiente nivel profesional.</Typography>
           </div>
           <div className="space-y-4">
              <Typography variant="h4" className="text-slate-500">Visión</Typography>
              <Typography variant="body" className="text-white/60">Ser el eje central de la distribución estética en Latinoamérica para el año 2030, basándonos en excelencia logística.</Typography>
           </div>
           <div className="space-y-4">
              <Typography variant="h4" className="text-slate-500">Valores</Typography>
              <Typography variant="body" className="text-white/60">Integridad comercial, precisión operativa y compromiso absoluto con el crecimiento de nuestros clientes.</Typography>
           </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
