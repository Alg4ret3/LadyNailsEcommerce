'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ_CONTENT } from '@/constants';

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="pt-32 sm:pt-44 pb-16 sm:pb-32 px-4 sm:px-6 max-w-[1400px] mx-auto">
        <div className="text-center mb-12 sm:mb-24 space-y-4">
           <Typography variant="detail" className="text-slate-400">{FAQ_CONTENT.header.surtitle}</Typography>
           <Typography variant="h1" className="text-3xl sm:text-5xl md:text-7xl">{FAQ_CONTENT.header.title}</Typography>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
           {FAQ_CONTENT.faqs.map((faq, i) => (
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
