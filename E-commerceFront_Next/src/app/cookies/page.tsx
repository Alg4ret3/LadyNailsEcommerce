'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <section className="pt-44 pb-32 px-6 max-w-[1400px] mx-auto">
        <div className="bg-white border border-slate-200 p-8 sm:p-20 shadow-sm max-w-4xl mx-auto space-y-16">
           <div className="space-y-4 border-b border-slate-900 pb-8">
                <Typography variant="detail" className="text-slate-400">Cumplimiento Digital</Typography>
              <Typography variant="h1" className="text-5xl uppercase">Aviso de Cookies</Typography>
              <Typography variant="body" className="text-xs uppercase font-bold tracking-widest text-slate-400">Transparencia en la Navegación</Typography>
           </div>

           <div className="space-y-12 text-slate-600">
              <div className="space-y-4">
                 <Typography variant="h4" className="text-slate-900 border-l-2 border-slate-900 pl-4 tracking-normal">¿Qué son las cookies?</Typography>
                 <Typography variant="body">
                    Utilizamos cookies para optimizar su experiencia profesional en nuestro sitio. Son pequeños archivos de datos que nos permiten recordar sus preferencias de inventario y mantener su sesión segura.
                 </Typography>
              </div>

              <div className="space-y-4">
                 <Typography variant="h4" className="text-slate-900 border-l-2 border-slate-900 pl-4 tracking-normal">Tipos de Cookies Utilizadas</Typography>
                 <ul className="list-disc pl-8 space-y-2">
                    <li><Typography variant="body"><strong>Técnicas:</strong> Esenciales para el funcionamiento del carrito de compras y sistema de pagos.</Typography></li>
                    <li><Typography variant="body"><strong>Analíticas:</strong> Nos ayudan a entender qué líneas de productos son de mayor interés para los profesionales.</Typography></li>
                    <li><Typography variant="body"><strong>Preferencias:</strong> Guardan su configuración de visualización de catálogo.</Typography></li>
                 </ul>
              </div>

              <div className="space-y-4">
                 <Typography variant="h4" className="text-slate-900 border-l-2 border-slate-900 pl-4 tracking-normal">Control de Usuario</Typography>
                 <Typography variant="body">
                    Usted puede configurar su navegador para rechazar o eliminar las cookies en cualquier momento, aunque esto podría afectar la funcionalidad del carrito de compras logística.
                 </Typography>
              </div>
           </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
