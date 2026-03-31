'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { TERMS_CONTENT } from '@/constants';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="pt-32 sm:pt-44 pb-16 sm:pb-32 px-4 sm:px-6 max-w-[1400px] mx-auto">
        <div className="bg-white border border-slate-200 p-6 sm:p-12 md:p-20 shadow-sm max-w-4xl mx-auto space-y-10 sm:space-y-16">
           <div className="space-y-4 border-b border-slate-900 pb-6 sm:pb-8">
              <Typography variant="detail" className="text-slate-400">{TERMS_CONTENT.header.surtitle}</Typography>
              <Typography variant="h1" className="text-3xl sm:text-4xl md:text-5xl uppercase">{TERMS_CONTENT.header.title}</Typography>
              <Typography variant="body" className="text-xs uppercase font-bold tracking-widest text-slate-400">{TERMS_CONTENT.header.subtitle}</Typography>
           </div>

           <div className="space-y-12 text-slate-600">
             {TERMS_CONTENT.sections.map((section, idx) => (
                <div key={idx} className="space-y-4">
                   <Typography variant="h4" className="text-slate-900 border-l-2 border-slate-900 pl-4 tracking-normal">{section.title}</Typography>
                   <Typography variant="body">
                      {section.content}
                      {section.boldContent && <span className="font-bold underline">{section.boldContent}</span>}
                      {section.postBoldContent}
                   </Typography>
                </div>
             ))}
           </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
