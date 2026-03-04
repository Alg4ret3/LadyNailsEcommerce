'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  { q: '¿Cómo puedo comprar en Ladynail Shop?', a: 'El registro en nuestro sitio es abierto para todo el público. Sin embargo, dado que manejamos precios mayoristas, la condición para procesar cualquier pedido es que el valor total de la compra sea igual o superior a $200.000 COP.' },
  { q: '¿Los precios incluyen IVA?', a: 'Nuestros precios son de distribución mayorista. La factura generada cumplirá con toda la normativa legal vigente.' },
  { q: '¿Realizan envíos a todo el país?', a: 'Sí, contamos con una red logística propia y aliados estratégicos que nos permiten llegar a todos los municipios de Colombia con tiempos de entrega de 24 a 72 horas hábiles.' },
  { q: '¿Qué garantía tienen los equipos de mobiliario?', a: 'Todos nuestros equipos de mobiliario profesional cuentan con una garantía estructural de 12 meses y 6 meses en componentes electrónicos bajo uso normal en salón.' },
  { q: '¿Tienen punto de venta físico?', a: 'Nuestra operación central es en el Parque Industrial Sur en Pasto, donde contamos con un showroom técnico para demostración de productos y equipos.' },
  { q: '¿Cómo se maneja el costo del envío?', a: 'No manejamos envíos contraentrega. Para envíos nacionales, el cliente paga el flete directamente a la transportadora. Para pedidos en Pasto y corregimientos aledaños (Catambuco, Gualmatán, Jongovito), se cobra un valor fijo de $7.000 COP incluido en la factura.' },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="pt-32 sm:pt-44 pb-16 sm:pb-32 px-4 sm:px-6 max-w-[1400px] mx-auto">
        <div className="text-center mb-12 sm:mb-24 space-y-4">
           <Typography variant="detail" className="text-slate-400">Centro de Soporte</Typography>
           <Typography variant="h1" className="text-3xl sm:text-5xl md:text-7xl">PREGUNTAS FRECUENTES</Typography>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
           {FAQS.map((faq, i) => (
             <div key={i} className="border border-slate-100 bg-slate-50 overflow-hidden">
                <button 
                   onClick={() => setOpen(open === i ? null : i)}
                   className="w-full flex items-center justify-between p-4 sm:p-8 text-left hover:bg-white transition-all bg-white gap-4"
                >
                   <Typography variant="h4" className="text-base sm:text-lg tracking-tight normal-case">{faq.q}</Typography>
                   {open === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {open === i && (
                  <div className="p-8 pt-0 bg-white">
                     <Typography variant="body" className="text-slate-500 leading-relaxed border-t border-slate-50 pt-8">{faq.a}</Typography>
                  </div>
                )}
             </div>
           ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
