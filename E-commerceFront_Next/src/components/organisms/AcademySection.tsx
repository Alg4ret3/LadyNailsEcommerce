'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { motion, AnimatePresence } from 'framer-motion';

export interface LocationInfo {
  id: string;
  name: string;
  title: string;
  description: string;
  features: string[];
  mainImage: string;
  detailImages: string[];
  whatsappNumber: string;
}

interface AcademySectionProps {
  locations?: LocationInfo[];
}

const DEFAULT_LOCATIONS: LocationInfo[] = [];

export const AcademySection: React.FC<AcademySectionProps> = ({ locations = DEFAULT_LOCATIONS }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!locations || locations.length === 0) return null;
  
  const location = locations[currentIndex];
  const whatsappUrl = `https://wa.me/${location.whatsappNumber}?text=Hola!%20Estoy%20interesado%20en%20inscribirme%20en%20${location.name}`;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % locations.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + locations.length) % locations.length);
  };

  return (
    <section className="py-32 bg-slate-950 text-white overflow-hidden relative" id="academy">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full opacity-30 lg:opacity-20 pointer-events-none">
            <Image 
              src={location.mainImage} 
              fill 
              className="object-cover" 
              alt={location.name} 
              priority
            />
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
               key={`content-${location.id}`}
               initial={{ x: -20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ duration: 0.5, delay: 0.2 }}
               className="space-y-6 sm:space-y-10"
            >
              <div className="space-y-4">
                <Typography variant="detail" className="text-slate-500 text-[10px] sm:text-xs tracking-[0.2em]">{location.name}</Typography>
                <Typography variant="h2" className="text-4xl sm:text-6xl lg:text-7xl leading-[0.95] sm:leading-[0.9] tracking-tighter">
                  {location.title.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < location.title.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  )) || location.title}
                </Typography>
                <Typography variant="body" className="text-white/50 text-lg sm:text-xl max-w-lg font-light leading-relaxed">
                  {location.description}
                </Typography>
              </div>

            <div className="flex flex-col gap-6">
              {location.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-default">
                  <div className="w-10 h-10 border border-white/10 flex items-center justify-center rounded-full group-hover:border-white transition-colors">
                    <CheckCircle2 size={18} className="text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest text-white/70">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 flex flex-wrap items-center gap-8">
              <Button 
                label="INSCRÍBETE AQUÍ" 
                className="bg-white !text-black px-12 py-5 font-black tracking-[0.3em] hover:scale-105 transition-all text-xs" 
                href={whatsappUrl}
                variant="primary"
              />
              
              {locations.length > 1 && (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={prevSlide}
                    className="w-12 h-12 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all group"
                  >
                    <ChevronLeft size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="w-12 h-12 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all group"
                  >
                    <ChevronRight size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              )}
            </div>
            
            {locations.length > 1 && (
              <div className="flex items-center gap-2 pt-4">
                {locations.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-1 transition-all duration-300 ${currentIndex === i ? 'w-8 bg-white' : 'w-4 bg-white/20'}`}
                  />
                ))}
              </div>
            )}
          </motion.div>

          <motion.div 
             key={`images-${location.id}`}
             initial={{ x: 20, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ duration: 0.5, delay: 0.4 }}
             className="hidden lg:grid grid-cols-2 gap-4 h-[600px]"
          >
             {location.detailImages.map((img, i) => (
               <div key={i} className={`border border-white/10 p-2 overflow-hidden bg-white/5 hover:bg-white/10 transition-colors ${i === 0 ? 'mt-20' : ''}`}>
                  <div className="relative h-full w-full">
                    <Image src={img} alt={`Location detail ${i + 1}`} fill className="object-cover transition-all duration-700" />
                  </div>
               </div>
             ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
