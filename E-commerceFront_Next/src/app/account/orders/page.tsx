'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { ChevronRight, Package, Truck, Clock } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const ORDERS = [
    { id: 'GA-2026-X991', date: '24 Feb, 2026', total: 450000, status: 'En Bodega', icon: <Package className="text-slate-400" /> },
    { id: 'GA-2026-X884', date: '12 Feb, 2026', total: 1250000, status: 'Entregado', icon: <Truck className="text-emerald-500" /> },
    { id: 'GA-2026-X772', date: '05 Feb, 2026', total: 320000, status: 'Cancelado', icon: <Clock className="text-red-400" /> },
  ];

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <section className="pt-44 pb-32 px-6 max-w-[1400px] mx-auto">
        <div className="mb-16">
          <Link href="/account" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 flex items-center gap-2 mb-4">
             Volver al Perfil
          </Link>
          <Typography variant="h1" className="text-5xl border-b-4 border-slate-900 pb-8 inline-block uppercase">HISTORIAL DE LOGÍSTICA</Typography>
        </div>

        <div className="space-y-4">
           {ORDERS.map((order, i) => (
             <div key={i} className="bg-white border border-slate-200 p-8 flex flex-col sm:flex-row items-center gap-8 hover:border-slate-400 transition-all shadow-sm">
                <div className="w-16 h-16 bg-slate-50 flex items-center justify-center shrink-0">
                   {order.icon}
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-8">
                   <div className="space-y-1">
                      <Typography variant="detail">ID Orden</Typography>
                      <Typography variant="h4">{order.id}</Typography>
                   </div>
                   <div className="space-y-1">
                      <Typography variant="detail">Fecha de Proceso</Typography>
                      <Typography variant="h4">{order.date}</Typography>
                   </div>
                   <div className="space-y-1">
                      <Typography variant="detail">Total Neto</Typography>
                      <Typography variant="h4">${order.total.toLocaleString()}</Typography>
                   </div>
                   <div className="space-y-1">
                      <Typography variant="detail">Estado de Despacho</Typography>
                      <Typography variant="h4" className="uppercase">{order.status}</Typography>
                   </div>
                </div>
                <button className="p-4 hover:bg-slate-50 transition-all border border-slate-100">
                   <ChevronRight size={20} />
                </button>
             </div>
           ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
