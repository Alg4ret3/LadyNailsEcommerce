'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <section className="pt-32 sm:pt-44 pb-16 sm:pb-32 px-4 sm:px-6 max-w-[1400px] mx-auto">
        <div className="bg-white border border-slate-200 p-6 sm:p-12 md:p-20 shadow-sm max-w-4xl mx-auto space-y-10 sm:space-y-16">
           <div className="space-y-4 border-b border-slate-900 pb-6 sm:pb-8">
              <Typography variant="detail" className="text-slate-400">Guía de Distribución</Typography>
              <Typography variant="h1" className="text-3xl sm:text-4xl md:text-5xl uppercase">Política de Envíos</Typography>
              <Typography variant="body" className="text-xs uppercase font-bold tracking-widest text-slate-400">Cobertura Nacional y Logística</Typography>
           </div>

           <div className="space-y-12 text-slate-600">
              <div className="space-y-4">
                 <Typography variant="h4" className="text-slate-900 border-l-2 border-slate-900 pl-4 tracking-normal">TIEMPOS DE DESPACHO</Typography>
                 <Typography variant="body">
                    Toda orden confirmada antes de las 14:00 horas será procesada y entregada a la empresa transportadora el mismo día hábil. Órdenes posteriores se despachan en las siguientes 24 horas.
                 </Typography>
              </div>

              <div className="space-y-4">
                 <Typography variant="h4" className="text-slate-900 border-l-2 border-slate-900 pl-4 tracking-normal">POLÍTICA DE PAGOS Y ENVÍOS</Typography>
                 <Typography variant="body">
                    No manejamos la modalidad de envíos contraentrega. El valor del envío debe ser cancelado directamente por el cliente a la empresa transportadora al momento de recibir su pedido, por lo cual la factura solo reflejará el costo de los productos.
                 </Typography>
                 <Typography variant="body" className="bg-slate-50 p-4 border-l-4 border-slate-900">
                    <span className="font-bold">EXCEPCIÓN LOCAL PASTO:</span> Para pedidos realizados dentro del casco urbano de Pasto y los corregimientos de Catambuco, Gualmatán y Jongovito, se cobrará una tarifa única de <span className="font-bold">$7.000</span> la cual será incluida automáticamente en la misma factura.
                 </Typography>
              </div>

              <div className="space-y-4">
                 <Typography variant="h4" className="text-slate-900 border-l-2 border-slate-900 pl-4 tracking-normal">TRAZABILIDAD</Typography>
                 <Typography variant="body">
                    Una vez la mercancía sale de nuestro Hub Logístico, el cliente recibirá un código de seguimiento para monitorear el progreso de su entrega en tiempo real a través del portal de la transportadora asignada.
                 </Typography>
              </div>
           </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
