'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <section className="pt-44 pb-32 px-6 max-w-[1400px] mx-auto">
        <div className="bg-white border border-slate-200 p-8 sm:p-20 shadow-sm max-w-4xl mx-auto space-y-16">
           <div className="space-y-4 border-b border-slate-900 pb-8">
              <Typography variant="detail" className="text-slate-400">Protocolo de Post-Venta</Typography>
              <Typography variant="h1" className="text-5xl uppercase">Política de Devoluciones</Typography>
              <Typography variant="body" className="text-xs uppercase font-bold tracking-widest text-slate-400">Vigente para el mercado nacional</Typography>
           </div>

           <div className="space-y-12 text-slate-600">
              <div className="space-y-4">
                 <Typography variant="h4" className="text-slate-900 border-l-2 border-slate-900 pl-4 tracking-normal">PLAZOS DE RECLAMACIÓN</Typography>
                 <Typography variant="body">
                    El cliente profesional dispone de un plazo de 5 días hábiles desde la recepción del despacho para notificar cualquier discrepancia en el inventario o daños visibles en el empaque industrial.
                 </Typography>
              </div>

              <div className="space-y-4">
                 <Typography variant="h4" className="text-slate-900 border-l-2 border-slate-900 pl-4 tracking-normal">CONDICIONES DEL PRODUCTO</Typography>
                 <Typography variant="body">
                    Para ser elegible para devolución, el producto debe conservar sus sellos originales, empaque de fábrica sin alteraciones y no haber sido utilizado. Los consumibles (esmaltes, polvos, químicos) no tienen devolución una vez abierto el sello de seguridad.
                 </Typography>
              </div>

              <div className="space-y-4">
                 <Typography variant="h4" className="text-slate-900 border-l-2 border-slate-900 pl-4 tracking-normal">PROCESO LOGÍSTICO</Typography>
                 <Typography variant="body">
                    LADYNAIL SHOP asumirá los costos de transporte únicamente en casos comprobados de error en el despacho o fallas de fabricación. En otros casos, el transporte corre por cuenta del usuario.
                 </Typography>
              </div>
           </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
