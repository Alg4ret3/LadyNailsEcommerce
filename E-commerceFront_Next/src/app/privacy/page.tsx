'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <section className="pt-44 pb-32 px-6 max-w-[1400px] mx-auto">
        <div className="bg-white border border-slate-200 p-8 sm:p-20 shadow-sm max-w-4xl mx-auto space-y-16">
           <div className="space-y-4 border-b border-slate-900 pb-8">
              <Typography variant="detail" className="text-slate-400">Documentación Legal v2.1</Typography>
              <Typography variant="h1" className="text-5xl uppercase">Política de Privacidad</Typography>
              <Typography variant="body" className="text-xs uppercase font-bold tracking-widest text-slate-400">Última actualización: 24 de febrero de 2026</Typography>
           </div>

           <div className="space-y-12 text-slate-600">
              <div className="space-y-4">
                 <Typography variant="h4" className="text-slate-900 border-l-2 border-slate-900 pl-4 tracking-normal">1. TRATAMIENTO DE DATOS</Typography>
                 <Typography variant="body">
                    LADYNAIL SHOP BEAUTY DIST. en cumplimiento de la Ley 1581 de 2012, informa a sus clientes profesionales que los datos recolectados serán utilizados estrictamente para fines logísticos, de facturación y para el envío de actualizaciones sobre stock y servicios técnicos.
                 </Typography>
              </div>

              <div className="space-y-4">
                 <Typography variant="h4" className="text-slate-900 border-l-2 border-slate-900 pl-4 tracking-normal">2. SEGURIDAD DE LA INFORMACIÓN</Typography>
                 <Typography variant="body">
                    Implementamos protocolos de encriptación de grado industrial para asegurar que la base de datos de nuestros aliados comerciales permanezca protegida contra accesos no autorizados.
                 </Typography>
              </div>

              <div className="space-y-4">
                 <Typography variant="h4" className="text-slate-900 border-l-2 border-slate-900 pl-4 tracking-normal">3. DERECHOS DEL TITULAR</Typography>
                 <Typography variant="body">
                    Como profesional registrado, usted tiene derecho a conocer, actualizar y rectificar sus datos personales en cualquier momento a través de su portal profesional o enviando un correo a legal@ladynailshop.com.
                 </Typography>
              </div>
           </div>

           <div className="pt-12 border-t border-slate-100 italic">
              <Typography variant="small" className="text-slate-400">Este documento es vinculante para todas las transacciones realizadas dentro de la plataforma GA Distribuciones.</Typography>
           </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
