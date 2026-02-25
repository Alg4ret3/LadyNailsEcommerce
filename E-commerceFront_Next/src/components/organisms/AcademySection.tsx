'use client';

import React from 'react';
import Image from 'next/image';
import { GraduationCap, PlayCircle, Heart } from 'lucide-react';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';

export const AcademySection: React.FC = () => {
  return (
    <section className="py-32 bg-slate-950 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
        <Image src="https://images.unsplash.com/photo-1604654894610-df4906687103?q=80&w=1000" fill className="object-cover grayscale" alt="Nails Academy" />
      </div>
      
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-6 sm:space-y-10">
              <div className="space-y-4">
                <Typography variant="detail" className="text-slate-500 text-[10px] sm:text-xs tracking-[0.2em]">Academia Ladynail</Typography>
                <Typography variant="h2" className="text-4xl sm:text-6xl lg:text-7xl leading-[0.95] sm:leading-[0.9] tracking-tighter">¿QUIERES APRENDER <br /> A HACER UÑAS?</Typography>
                <Typography variant="body" className="text-white/50 text-lg sm:text-xl max-w-lg font-light leading-relaxed">
                  Domina las técnicas más avanzadas con nuestros expertos. Desde nivel inicial hasta perfeccionamiento profesional.
                </Typography>
              </div>

            <div className="flex flex-col gap-6">
              {[
                { icon: <GraduationCap size={20} className="text-slate-500" />, text: "Certificación Profesional Avalada" },
                { icon: <PlayCircle size={20} className="text-slate-500" />, text: "Acceso a Clases Prácticas de por vida" },
                { icon: <Heart size={20} className="text-slate-500" />, text: "Comunidad de más de 5,000 Técnicas" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-default">
                  <div className="w-10 h-10 border border-white/10 flex items-center justify-center rounded-full group-hover:border-white transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest text-white/70">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 flex flex-wrap gap-4">
              <Button label="Inscríbete Ahora" className="bg-white text-slate-950 px-10" />
              <Button label="Ver Programas" variant="ghost" className="text-white border-white/20 hover:border-white" />
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-4 h-[600px]">
             <div className="mt-20 border border-white/10 p-2 overflow-hidden bg-white/5 hover:bg-white/10 transition-colors">
                <div className="relative h-full w-full">
                  <Image src="https://images.unsplash.com/photo-1632345033839-22442ce9f187?q=80&w=1000" alt="Student 1" fill className="object-cover" />
                </div>
             </div>
             <div className="border border-white/10 p-2 overflow-hidden bg-white/5 hover:bg-white/10 transition-colors">
                <div className="relative h-full w-full">
                  <Image src="https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=1000" alt="Student 2" fill className="object-cover" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
