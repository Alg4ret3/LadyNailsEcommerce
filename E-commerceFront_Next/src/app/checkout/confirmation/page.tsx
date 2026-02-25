'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { CheckCircle2, Package, Truck, Calendar } from 'lucide-react';

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="pt-44 pb-32 px-6 max-w-[1400px] mx-auto text-center">
        <div className="max-w-2xl mx-auto space-y-12">
           <div className="flex flex-col items-center space-y-6">
              <CheckCircle2 size={80} className="text-slate-900" />
              <Typography variant="h2" className="text-5xl">PROCESADO CON ÉXITO</Typography>
              <Typography variant="body" className="text-slate-500">
                Su orden ha sido registrada en nuestro centro logístico y está pendiente de verificación para despacho.
              </Typography>
           </div>

           <div className="bg-[#f8fafc] border border-slate-200 p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="space-y-2">
                 <Typography variant="detail">Orden de Referencia</Typography>
                 <Typography variant="h4" className="text-lg">#GA-2026-X991</Typography>
              </div>
              <div className="space-y-2">
                 <Typography variant="detail">Estado Logístico</Typography>
                 <Typography variant="h4" className="text-lg text-slate-500 uppercase">En Bodega / Picking</Typography>
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="space-y-3">
                 <Package size={24} className="mx-auto text-slate-300" />
                 <Typography variant="small" className="block">Empaque Industrial</Typography>
              </div>
              <div className="space-y-3">
                 <Truck size={24} className="mx-auto text-slate-300" />
                 <Typography variant="small" className="block">Despacho Nacional</Typography>
              </div>
              <div className="space-y-3">
                 <Calendar size={24} className="mx-auto text-slate-300" />
                 <Typography variant="small" className="block">Entrega 24/48h</Typography>
              </div>
           </div>

           <div className="pt-12 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-center">
              <Button label="Seguir mis Pedidos" href="/account/orders" variant="primary" className="px-12" />
              <Button label="Volver al Catálogo" href="/shop" variant="outline" className="px-12" />
           </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
