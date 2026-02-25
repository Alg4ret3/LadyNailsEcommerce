'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />
      <section className="flex flex-col items-center justify-center min-h-screen px-6 pt-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-4xl w-full py-32 border border-slate-900/5 bg-slate-50"
        >
          <Typography variant="h1" className="text-[15rem] md:text-[25rem] font-black text-slate-900/5 tracking-tighter leading-none select-none absolute inset-0 flex items-center justify-center">
            404
          </Typography>
          
          <div className="relative z-10 space-y-8">
            <Typography variant="detail" className="text-slate-400">Error en el sistema de búsqueda</Typography>
            <Typography variant="h2" className="text-4xl md:text-6xl font-black">RECURSO NO DISPONIBLE</Typography>
            <Typography variant="body" className="max-w-md mx-auto text-slate-500">
              El código de producto o la sección que intenta localizar ha sido removido de nuestro inventario activo o no existe en nuestra base de datos logística.
            </Typography>
            
            <div className="pt-8">
              <Button 
                label="Regresar al Hub Principal" 
                href="/" 
                variant="primary" 
                className="px-16" 
              />
            </div>
          </div>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}
