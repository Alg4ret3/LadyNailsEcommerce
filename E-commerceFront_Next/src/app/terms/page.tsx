'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <section className="pt-44 pb-32 px-6 max-w-[1400px] mx-auto">
        <div className="bg-white border border-slate-200 p-8 sm:p-20 shadow-sm max-w-4xl mx-auto space-y-16">
           <div className="space-y-4 border-b border-slate-900 pb-8">
              <Typography variant="detail" className="text-slate-400">Acuerdo Comercial B2B</Typography>
              <Typography variant="h1" className="text-5xl uppercase">Términos y Condiciones</Typography>
              <Typography variant="body" className="text-xs uppercase font-bold tracking-widest text-slate-400">Marco Legal de Operación</Typography>
           </div>

           <div className="space-y-12 text-slate-600">
              <div className="space-y-4">
                 <Typography variant="h4" className="text-slate-900 border-l-2 border-slate-900 pl-4 tracking-normal">Aceptación de Términos</Typography>
                 <Typography variant="body">
                    Toda orden de compra procesada a través de este portal implica la aceptación total de los términos de distribución de LADYNAIL SHOP. Estos términos prevalecen sobre cualquier otro acuerdo a menos que exista un contrato escrito firmado por ambas partes.
                 </Typography>
              </div>

              <div className="space-y-4">
                 <Typography variant="h4" className="text-slate-900 border-l-2 border-slate-900 pl-4 tracking-normal">Precios, Pagos y Logística</Typography>
                 <Typography variant="body">
                    Los precios exhibidos son de distribución mayorista y están sujetos a cambios sin previo aviso. <span className="font-bold underline">El valor mínimo de compra para procesar cualquier pedido es de $200.000 COP.</span> No se aceptan pagos contraentrega. El costo del envío nacional es responsabilidad del comprador y se paga a la transportadora, a excepción de las entregas en la ciudad de Pasto y corregimientos específicos donde se aplicará un recargo de $7.000 COP en la factura comercial.
                 </Typography>
              </div>

              <div className="space-y-4">
                 <Typography variant="h4" className="text-slate-900 border-l-2 border-slate-900 pl-4 tracking-normal">Límites de Responsabilidad</Typography>
                 <Typography variant="body">
                    LADYNAIL SHOP actúa como distribuidor mayorista. No nos hacemos responsables por el mal uso de las herramientas profesionales suministradas. La capacitación técnica es responsabilidad del cliente profesional.
                 </Typography>
              </div>
           </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
