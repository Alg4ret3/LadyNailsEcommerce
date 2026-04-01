'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { ABOUT_US_CONTENT, COMPANY_INFO } from '@/constants';

export default function NosotrosPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <main className="min-h-screen bg-white selection:bg-black selection:text-white overflow-x-hidden">
      <Navbar />
      
      {/* Corporate Hero: Focus on Statement */}
      <section className="relative pt-44 pb-20 px-6 max-w-[1400px] mx-auto overflow-hidden">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-16"
        >
          {/* Top Label & Logo Placement */}
          <motion.div variants={itemVariants} className="flex justify-between items-end border-b border-black/10 pb-8">
             <div className="space-y-4">
                <Typography variant="detail" className="tracking-[0.6em] text-black/40">EST. 2000 — CORPORATE IDENTITY</Typography>
                <Typography variant="h1" className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.1] sm:leading-none uppercase">
                   Nuestra <span className="font-bold">Estructura</span>
                </Typography>
             </div>
             <div className="hidden lg:block relative w-32 h-16 opacity-10">
                <Image src={COMPANY_INFO.logo.src} alt="Brand Watermark" fill className="object-contain" />
             </div>
          </motion.div>

          {/* Core Vision Statement */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <motion.div variants={itemVariants} className="lg:col-span-8">
               <Typography variant="h2" className="text-4xl md:text-5xl font-light leading-tight tracking-tight text-black/80 max-w-4xl">
                  {ABOUT_US_CONTENT.hero.description}
               </Typography>
            </motion.div>
            <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col justify-end">
               <div className="space-y-8 pl-0 lg:pl-12 border-l-none lg:border-l border-black/10">
                  {ABOUT_US_CONTENT.stats.map((stat, i) => (
                    <div key={i} className="space-y-0.5">
                       <Typography variant="h3" className="text-5xl font-bold tracking-tighter">{stat.value}</Typography>
                       <Typography variant="small" className="text-black/40 tracking-[0.2em]">{stat.label}</Typography>
                    </div>
                  ))}
               </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Strategic Pillars - Structured Card Grid */}
      <section className="py-24 px-6 bg-neutral-50 border-y border-black/5">
        <div className="max-w-[1400px] mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-0 border-x border-t border-black/10"
          >
            {[
              { ...ABOUT_US_CONTENT.mission, id: "01" },
              { ...ABOUT_US_CONTENT.vision, id: "02" },
              { ...ABOUT_US_CONTENT.values, id: "03" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className="p-8 md:p-12 space-y-10 border-b md:border-r border-black/10 last:border-r-none bg-white hover:bg-neutral-50 transition-colors duration-500"
              >
                <div className="flex justify-between items-start">
                   <Typography variant="detail" className="text-black/20 text-xs">{item.id}</Typography>
                   <div className="w-1.5 h-1.5 rounded-full bg-black/40" />
                </div>
                <div className="space-y-6">
                   <Typography variant="h3" className="text-2xl font-bold uppercase tracking-wide">{item.title}</Typography>
                   <Typography variant="body" className="text-base text-black/50 leading-relaxed font-light">
                      {item.description}
                   </Typography>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Industrial Heritage Section */}
      <section className="py-40 px-6 max-w-[1400px] mx-auto text-center">
         <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="space-y-12"
         >
            <div className="inline-block px-8 py-3 border border-black/10 text-[10px] font-black uppercase tracking-[0.4em]">
               Compromiso de Excelencia
            </div>
            <Typography variant="h2" className="text-3xl sm:text-5xl md:text-6xl font-extralight tracking-tighter leading-[1.2] sm:leading-[1.1] max-w-5xl mx-auto">
               Lideramos la distribución técnica en Nariño con <span className="font-bold">visión de expansión nacional.</span>
            </Typography>
            <div className="flex justify-center items-center gap-4 text-black/20 pt-8">
               <div className="w-20 h-px bg-current" />
               <div className="w-2 h-2 rotate-45 border border-current" />
               <div className="w-20 h-px bg-current" />
            </div>
         </motion.div>
      </section>

      <Footer />
    </main>
  );
}
