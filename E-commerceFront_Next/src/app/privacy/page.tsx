'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { PRIVACY_CONTENT } from '@/constants';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <section className="pt-44 pb-32 px-6 max-w-[1400px] mx-auto">
        <div className="bg-white border border-slate-200 p-8 sm:p-20 shadow-sm max-w-4xl mx-auto space-y-16">
           <div className="space-y-4 border-b border-slate-900 pb-8">
              <Typography variant="detail" className="text-slate-400">{PRIVACY_CONTENT.header.surtitle}</Typography>
              <Typography variant="h1" className="text-5xl uppercase">{PRIVACY_CONTENT.header.title}</Typography>
              <Typography variant="body" className="text-xs uppercase font-bold tracking-widest text-slate-400">{PRIVACY_CONTENT.header.subtitle}</Typography>
           </div>

           <div className="space-y-12 text-slate-600">
              {PRIVACY_CONTENT.sections.map((section, idx) => (
                <div key={idx} className="space-y-4">
                   <Typography variant="h4" className="text-slate-900 border-l-2 border-slate-900 pl-4 tracking-normal">{section.title}</Typography>
                   <Typography variant="body">{section.content}</Typography>
                </div>
              ))}
           </div>

           <div className="pt-12 border-t border-slate-100 italic">
              <Typography variant="small" className="text-slate-400">{PRIVACY_CONTENT.footer}</Typography>
           </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
