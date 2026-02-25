'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe } from 'lucide-react';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[100vh] lg:min-h-[90vh] flex items-center pt-32 sm:pt-40 pb-20 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 opacity-20 grayscale">
        <Image 
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000" 
          alt="Centro de Distribución" fill className="object-cover" 
          priority
        />
      </div>
      
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b lg:bg-linear-to-r from-slate-950 via-slate-950/90 to-transparent z-[1]" />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-10 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-0 items-center">
        <div className="lg:col-span-8 space-y-8 sm:space-y-12 text-center lg:text-left lg:pr-12 xl:pr-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Typography variant="detail" className="text-slate-500 mb-6 sm:mb-8 bg-white/5 inline-block px-4 py-1.5 border border-white/10 text-[10px] sm:text-[11px] tracking-[0.3em] uppercase">
              Ecosistema Profesional de Belleza
            </Typography>
            <Typography variant="h1" className="text-white leading-[0.9] sm:leading-[0.85] tracking-tighter text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[9rem] 2xl:text-[11rem] font-medium">
              SUMINISTRO <br /> 
              <span className="text-slate-600 font-light italic">INDISPENSABLE</span>
            </Typography>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.3 }} 
            className="max-w-xl mx-auto lg:mx-0 space-y-8 sm:space-y-12"
          >
             <Typography variant="body" className="text-slate-400 text-lg sm:text-xl font-light leading-relaxed">
               Expertos en la cadena de suministro para los profesionales más exigentes. 
               Tecnología, logística y volumen directo a su negocio con respaldo industrial.
             </Typography>
             <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-2">
                <Button 
                  label="EXPLORAR CATÁLOGO" 
                  href="/shop" 
                  className="w-full sm:w-auto bg-white text-slate-950 border-white hover:bg-slate-100 px-12 py-5 sm:py-6 text-xs sm:text-sm font-black tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)]" 
                />
             </div>
          </motion.div>
        </div>
        
        <div className="lg:col-span-4 hidden lg:block">
           <div className="h-full border-l border-white/5 pl-16 flex flex-col justify-center space-y-16">
              {[
                { icon: <ShieldCheck className="text-slate-600" />, title: 'Certificación Pro', desc: 'Herramientas con garantía y respaldo industrial' },
                { icon: <Zap className="text-slate-600" />, title: 'Logística Flash', desc: 'Despachos prioritarios en menos de 24 horas' },
                { icon: <Globe className="text-slate-600" />, title: 'Stock Global', desc: 'Importación directa de las marcas líderes' },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="space-y-4 group cursor-default"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 border border-white/5 rounded-full group-hover:border-white/20 transition-colors">
                      {item.icon}
                    </div>
                    <Typography variant="h4" className="text-white text-lg tracking-tight font-medium uppercase">{item.title}</Typography>
                  </div>
                  <Typography variant="body" className="text-slate-500 text-sm leading-relaxed pl-14">{item.desc}</Typography>
                </motion.div>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
};
