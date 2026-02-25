'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Truck, CreditCard, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <section className="pt-44 pb-24 px-6 max-w-[1400px] mx-auto">
        <Typography variant="h1" className="text-5xl mb-16 border-b-4 border-slate-900 pb-8 inline-block">CHECKOUT LOGÍSTICO</Typography>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* Forms */}
           <div className="lg:col-span-8 space-y-12">
              <div className="bg-white border border-slate-200 p-8 sm:p-12 space-y-12 shadow-sm">
                 <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                    <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-black">1</div>
                    <Typography variant="h3" className="text-2xl">INFORMACIÓN DE DESPACHO</Typography>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <Typography variant="detail">Nombre / Razón Social</Typography>
                       <input type="text" className="pro-input" />
                    </div>
                    <div className="space-y-2">
                       <Typography variant="detail">Identificación Fiscal (NIT/CC)</Typography>
                       <input type="text" className="pro-input" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <Typography variant="detail">Dirección de Entrega</Typography>
                       <input type="text" className="pro-input" />
                    </div>
                    <div className="space-y-2">
                       <Typography variant="detail">Ciudad / Municipio</Typography>
                       <input type="text" className="pro-input" />
                    </div>
                    <div className="space-y-2">
                       <Typography variant="detail">Teléfono de Contacto Logístico</Typography>
                       <input type="text" className="pro-input" />
                    </div>
                 </div>
              </div>

              <div className="bg-white border border-slate-200 p-8 sm:p-12 space-y-12 shadow-sm">
                 <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                    <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-black">2</div>
                    <Typography variant="h3" className="text-2xl">MÉTODO DE PAGO</Typography>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 border-2 border-slate-900 bg-slate-50 flex items-center gap-4 cursor-pointer">
                       <CreditCard size={24} />
                       <Typography variant="h4" className="text-xs">Tarjeta Credito / Debito</Typography>
                    </div>
                    <div className="p-6 border border-slate-100 flex items-center gap-4 hover:bg-slate-50 cursor-pointer">
                       <Truck size={24} />
                       <Typography variant="h4" className="text-xs">Transferencia Bancaria</Typography>
                    </div>
                 </div>
              </div>
           </div>

           {/* Summary Sidebar */}
           <div className="lg:col-span-4">
              <div className="bg-slate-900 text-white p-8 space-y-8 sticky top-44">
                 <Typography variant="h3" className="text-2xl border-b border-white/10 pb-4">ORDEN CENTRAL</Typography>
                 <div className="space-y-6">
                    <div className="flex justify-between items-start border-b border-white/5 pb-4">
                       <div className="space-y-1">
                          <Typography variant="h4" className="text-[10px]">Suministro Serie X (x1)</Typography>
                          <Typography variant="detail" className="text-white/40">SKU: GA-9981</Typography>
                       </div>
                       <Typography variant="h4">$125,000</Typography>
                    </div>
                 </div>
                 <div className="space-y-4 pt-4">
                    <div className="flex justify-between">
                       <Typography variant="small" className="text-white/40">Subtotal Neto</Typography>
                       <Typography variant="h4">$125,000</Typography>
                    </div>
                    <div className="flex justify-between">
                       <Typography variant="small" className="text-white/40">Flete Logístico</Typography>
                       <Typography variant="h4">Incluido</Typography>
                    </div>
                    <div className="pt-8 border-t border-white/20 flex justify-between items-end">
                       <Typography variant="h4" className="text-xl">TOTAL FINAL</Typography>
                       <Typography variant="h1" className="text-4xl">$125,000</Typography>
                    </div>
                 </div>
                 <Button label="Confirmar Pedido Industrial" href="/checkout/confirmation" className="w-full bg-white text-slate-900 hover:bg-slate-200 border-white py-5" />
                 <div className="flex items-center justify-center gap-2 text-[8px] font-black uppercase text-white/40">
                    <ShieldCheck size={12} /> Transacción Protegida por GA-Secure
                 </div>
              </div>
           </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
