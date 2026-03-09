'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import Image from 'next/image';
import { ABOUT_US_CONTENT, COMPANY_INFO } from '@/constants';

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="pt-32 sm:pt-44 pb-16 sm:pb-32 px-4 sm:px-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
           <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              <Typography variant="detail" className="text-slate-400">{ABOUT_US_CONTENT.hero.surtitle}</Typography>
              <div className="relative w-64 h-32 sm:w-96 sm:h-48 mx-auto lg:mx-0">
                <Image 
                  src={COMPANY_INFO.logo.src} 
                  alt={COMPANY_INFO.logo.alt} 
                  fill
                  className="object-contain invert-0"
                  priority
                />
              </div>
              <Typography variant="body" className="text-lg sm:text-xl font-light text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {ABOUT_US_CONTENT.hero.description}
              </Typography>
              <div className="grid grid-cols-2 gap-8 pt-8">
                 {ABOUT_US_CONTENT.stats.map((stat, i) => (
                   <div key={i} className="space-y-2">
                      <Typography variant="h3" className="text-4xl text-slate-900">{stat.value}</Typography>
                      <Typography variant="small">{stat.label}</Typography>
                   </div>
                 ))}
              </div>
           </div>
           <div className="relative aspect-4/5 bg-slate-100 border border-slate-200">
              <Image 
                 src={ABOUT_US_CONTENT.hero.image} 
                 alt="Our Facility" fill className="object-cover grayscale" 
              />
           </div>
        </div>
      </section>

      <section className="py-24 bg-slate-900 text-white px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
           <div className="space-y-4">
              <Typography variant="h4" className="text-slate-500">{ABOUT_US_CONTENT.mission.title}</Typography>
              <Typography variant="body" className="text-white/60">{ABOUT_US_CONTENT.mission.description}</Typography>
           </div>
           <div className="space-y-4">
              <Typography variant="h4" className="text-slate-500">{ABOUT_US_CONTENT.vision.title}</Typography>
              <Typography variant="body" className="text-white/60">{ABOUT_US_CONTENT.vision.description}</Typography>
           </div>
           <div className="space-y-4">
              <Typography variant="h4" className="text-slate-500">{ABOUT_US_CONTENT.values.title}</Typography>
              <Typography variant="body" className="text-white/60">{ABOUT_US_CONTENT.values.description}</Typography>
           </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
