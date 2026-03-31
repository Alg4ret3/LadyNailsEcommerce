'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { COOKIES_CONTENT } from '@/constants';

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="pt-44 pb-32 px-6 max-w-[1400px] mx-auto">
        <div className="bg-white border border-slate-200 p-8 sm:p-20 shadow-sm max-w-4xl mx-auto space-y-16">
           <div className="space-y-4 border-b border-slate-900 pb-8">
                <Typography variant="detail" className="text-slate-400">{COOKIES_CONTENT.header.surtitle}</Typography>
              <Typography variant="h1" className="text-5xl uppercase">{COOKIES_CONTENT.header.title}</Typography>
              <Typography variant="body" className="text-xs uppercase font-bold tracking-widest text-slate-400">{COOKIES_CONTENT.header.subtitle}</Typography>
           </div>

           <div className="space-y-12 text-slate-600">
             {COOKIES_CONTENT.sections.map((section, idx) => (
                <div key={idx} className="space-y-4">
                   <Typography variant="h4" className="text-slate-900 border-l-2 border-slate-900 pl-4 tracking-normal">{section.title}</Typography>
                   {section.content && <Typography variant="body">{section.content}</Typography>}
                   {section.list && (
                     <ul className="list-disc pl-8 space-y-2">
                        {section.list.map((item, i) => (
                           <li key={i}><Typography variant="body"><strong>{item.label}</strong>{item.content}</Typography></li>
                        ))}
                     </ul>
                   )}
                </div>
             ))}
           </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
