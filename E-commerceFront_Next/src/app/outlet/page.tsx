'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import Image from 'next/image';
import { ShoppingCart, AlertCircle } from 'lucide-react';

const OUTLET_STOCK = [
  { id: 'o1', name: 'Lote Trimmers Master Gold (5 uds)', price: 1250000, image: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?q=80&w=1000&auto=format&fit=crop', category: 'Liquidación', slug: 'lote-trimmers-master', rating: 5.0 },
  { id: 'o2', name: 'Estación Peluquería Vintage Red', price: 950000, image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1000&auto=format&fit=crop', category: 'Exhibición', slug: 'estacion-peluqueria-vintage', rating: 4.8 },
  { id: 'o3', name: 'Paleta Esmaltes 2025 (Set 24)', price: 420000, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop', category: 'Stock Sobrante', slug: 'set-esmaltes-2025', rating: 4.7 },
  { id: 'o4', name: 'Kit Mobiliario Recepción Pro', price: 3200000, image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=1000&auto=format&fit=crop', category: 'Colección Anterior', slug: 'kit-mobiliario-recepcion', rating: 5.0 },
];

export default function OutletPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />
      
      {/* Outlet Banner: Professional Liquidator */}
      <section className="relative pt-44 pb-32 bg-slate-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-800 skew-x-12 translate-x-1/2" />
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Typography variant="detail" className="text-white/40 flex items-center gap-2 italic">
               <AlertCircle size={14} /> Solo ventas por lote y distribución
            </Typography>
            <Typography variant="h1" className="text-white text-6xl md:text-9xl leading-none">
              CLEARANCE <br /> <span className="text-slate-500">STOCKS</span>
            </Typography>
            <Typography variant="body" className="text-white/60 max-w-xl text-lg">
              Liquidación estratégica de inventario para profesionales. Precios directos de fábrica por volumen de compra limitado. 
            </Typography>
          </motion.div>
        </div>
      </section>

      {/* Stock Grid */}
      <section className="py-32 px-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-24 border-b-2 border-slate-900 pb-12 gap-8">
           <Typography variant="h2" className="text-4xl">Existencias en Liquidación</Typography>
           <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 border border-slate-200">
             <ShoppingCart size={18} />
             <Typography variant="detail" className="text-slate-400">Mínimo de compra requerido para outlet</Typography>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-1 gap-y-16">
          {OUTLET_STOCK.map((item) => (
             <div key={item.id} className="group cursor-pointer">
                <div className="relative aspect-square mb-8 overflow-hidden bg-white border border-slate-100 flex items-center justify-center p-8">
                   <Image src={item.image} fill alt={item.name} className="object-contain p-4 group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute top-4 right-4 bg-slate-900 text-white text-[9px] font-black px-3 py-1 uppercase tracking-widest">Outlet</div>
                </div>
                <div className="space-y-3">
                   <Typography variant="detail" className="text-slate-400">{item.category}</Typography>
                   <Typography variant="h4" className="text-lg uppercase leading-tight line-clamp-2">{item.name}</Typography>
                   <div className="pt-4 flex items-center justify-between">
                      <Typography variant="h3" className="text-2xl">${item.price.toLocaleString()}</Typography>
                      <button className="text-[10px] font-black uppercase tracking-widest border-b-2 border-slate-900 hover:text-slate-500 hover:border-slate-500 transition-all">Ver Oferta</button>
                   </div>
                </div>
             </div>
          ))}
        </div>
      </section>

      {/* Bulk Info */}
      <section className="py-24 border-y border-slate-100 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 text-center space-y-8">
           <Typography variant="detail">Distribución a gran escala</Typography>
           <Typography variant="h3" className="text-4xl max-w-2xl mx-auto tracking-tighter">¿Necesitas un lote mayor a 50 unidades? <br /> Consulta precios personalizados.</Typography>
           <div className="pt-6">
              <Button label="Contactar Departamento de Ventas" href="/contact" className="px-12" />
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
