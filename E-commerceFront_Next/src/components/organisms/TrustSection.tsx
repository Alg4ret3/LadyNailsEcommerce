'use client';

import React from 'react';
import { Box, Zap } from 'lucide-react';
import { Typography } from '@/components/atoms/Typography';
import { StatCard } from '@/components/molecules/StatCard';

export const TrustSection: React.FC = () => {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
           <div className="lg:col-span-7 space-y-10 sm:space-y-12">
              <div className="space-y-4">
                <Typography variant="detail" className="text-slate-400 text-[10px] sm:text-xs tracking-[0.2em]">Distribuidor Oficial de Confianza</Typography>
                <Typography variant="h2" className="text-3xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.95] sm:leading-none uppercase">SOPORTE TÉCNICO <br /> Y LOGÍSTICA DE ÉLITE</Typography>
              </div>
              <Typography variant="body" className="text-lg sm:text-xl text-slate-400 font-light leading-relaxed max-w-2xl">
                No somos solo una tienda, somos tu aliado operativo. Almacenaje inteligente, picking automatizado y trazabilidad total en cada despacho para que tú solo te preocupes por crear.
              </Typography>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-8">
                <div className="space-y-4">
                   <div className="w-12 h-12 bg-slate-100 flex items-center justify-center">
                      <Box className="text-slate-900" size={24} />
                   </div>
                   <Typography variant="h4" className="uppercase tracking-widest text-xs font-bold">Garantía Directa</Typography>
                   <p className="text-sm text-slate-500 leading-relaxed">Todos nuestros equipos cuentan con respaldo técnico oficial y repuestos originales en stock.</p>
                </div>
                <div className="space-y-4">
                   <div className="w-12 h-12 bg-slate-100 flex items-center justify-center">
                      <Zap className="text-slate-900" size={24} />
                   </div>
                   <Typography variant="h4" className="uppercase tracking-widest text-xs font-bold">Despacho Inmediato</Typography>
                   <p className="text-sm text-slate-500 leading-relaxed">Logística flash optimizada. Si el producto está en web, está en bodega listo para salir.</p>
                </div>
             </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center">
             <div className="space-y-1 gap-1 flex flex-col">
                <StatCard value="99.8%" label="Efectividad en entregas nacionales" />
                <StatCard value="24H" label="Tiempo promedio de despacho" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
