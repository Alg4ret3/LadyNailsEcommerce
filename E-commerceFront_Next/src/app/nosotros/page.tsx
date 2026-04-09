'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { motion, type Variants } from 'framer-motion';

export default function NosotrosPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <main className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white overflow-x-hidden">
      <Navbar />
      
      {/* Hero / Header */}
      <section aria-label="Introducción" className="pt-40 pb-20 px-6 max-w-[1000px] mx-auto text-center">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
          <motion.div variants={itemVariants}>
            <Typography variant="h1" className="text-5xl md:text-7xl font-light tracking-tighter uppercase">
              Nuestra <span className="font-bold">Esencia</span>
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Typography variant="body" className="text-xl text-slate-500 font-light max-w-2xl mx-auto">
              Más que un proveedor, somos el socio estratégico de los profesionales de la belleza.
            </Typography>
          </motion.div>
        </motion.div>
      </section>

      {/* 1. Historia de la marca */}
      <section aria-label="Historia de la empresa" className="py-20 px-6 max-w-[1000px] mx-auto border-t border-slate-100">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={containerVariants} className="flex flex-col text-center space-y-8">
          <motion.div variants={itemVariants} className="space-y-6">
            <Typography variant="detail" className="tracking-widest uppercase text-slate-400 font-bold text-xs">01. Nuestra Historia</Typography>
            <Typography variant="h2" className="text-3xl md:text-5xl font-light tracking-tight">El origen de nuestra visión</Typography>
            <Typography variant="body" className="text-slate-600 leading-relaxed text-lg max-w-3xl mx-auto">
              Nacimos con una visión clara: transformar la experiencia del profesional de la belleza en Colombia. Desde el año 2000, identificamos que el talento local necesitaba herramientas de talla mundial para competir.
            </Typography>
            <Typography variant="body" className="text-slate-600 leading-relaxed text-lg max-w-3xl mx-auto">
              Lo que comenzó como un pequeño punto de distribución es hoy el e-commerce y centro logístico líder, conectando productos de primera línea con artistas que exigen perfection, innovación y eficiencia en su día a día. Hacia el futuro, nos proyectamos como el eje de abastecimiento más rápido de Latinoamérica.
            </Typography>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Misión y valores */}
      <section aria-label="Propósito, Misión y Valores" className="py-24 px-6 bg-black text-white">
        <div className="max-w-[1400px] mx-auto space-y-16">
          <div className="space-y-4">
            <Typography variant="detail" className="tracking-widest uppercase text-white/50 font-bold text-xs">02. Nuestro Propósito</Typography>
            <Typography variant="h2" className="text-3xl md:text-5xl font-light tracking-tight">Misión y Valores</Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 border-t border-white/10 pt-16">
            <div className="space-y-4">
              <Typography variant="h3" className="text-2xl font-bold">Innovación Constante</Typography>
              <Typography variant="body" className="text-white/70 leading-relaxed">Mantenemos nuestro catálogo actualizado con las últimas tendencias e investigaciones globales, asegurando ventajas competitivas en cada compra.</Typography>
            </div>
            <div className="space-y-4">
              <Typography variant="h3" className="text-2xl font-bold">Calidad Intransigente</Typography>
              <Typography variant="body" className="text-white/70 leading-relaxed">Solo distribuimos marcas y formulaciones que aprueban los más rigurosos estándares de durabilidad y desempeño profesional en salón.</Typography>
            </div>
            <div className="space-y-4">
              <Typography variant="h3" className="text-2xl font-bold">Crecimiento Mutuo</Typography>
              <Typography variant="body" className="text-white/70 leading-relaxed">Tu éxito es el nuestro. Proveemos herramientas, asesoramiento y un servicio al cliente humano diseñado integralmente para elevar tus estándares.</Typography>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Compromiso con el cliente & 4. Impacto Social */}
      <section aria-label="Compromiso e Impacto Social" className="py-24 px-6 max-w-[1400px] mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Compromiso */}
          <motion.div variants={itemVariants} className="bg-slate-50 border border-slate-100 p-10 sm:p-16 space-y-8">
            <Typography variant="detail" className="tracking-widest uppercase text-slate-400 font-bold text-xs">03. Estándar de Excelencia</Typography>
            <Typography variant="h3" className="text-3xl font-light">Compromiso con el profesional</Typography>
            <ul className="space-y-6 text-slate-600 mt-8">
              <li className="flex items-start gap-4">
                <span className="font-bold text-slate-900 mt-1">✓</span>
                <span className="text-lg"><strong className="text-slate-900 font-medium">Rapidez Logística:</strong> Despachamos en tiempo récord para que tu negocio nunca interrumpa operaciones por falta de insumos o herramientas.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="font-bold text-slate-900 mt-1">✓</span>
                <span className="text-lg"><strong className="text-slate-900 font-medium">Garantía Directa:</strong> Respaldo total en el 100% de nuestras marcas y cobertura ágil en equipos tecnológicos.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="font-bold text-slate-900 mt-1">✓</span>
                <span className="text-lg"><strong className="text-slate-900 font-medium">Soporte Dedicado:</strong> Atención personalizada y experta para resolver tus dudas técnicas y acompañarte en el proceso logístico.</span>
              </li>
            </ul>
          </motion.div>
          
          {/* Impacto */}
          <motion.div variants={itemVariants} className="bg-slate-50 border border-slate-100 p-10 sm:p-16 space-y-6 flex flex-col justify-center">
            <Typography variant="detail" className="tracking-widest uppercase text-slate-400 font-bold text-xs">04. Responsabilidad</Typography>
            <Typography variant="h3" className="text-3xl font-light">Impacto y Comunidad</Typography>
            <Typography variant="body" className="text-slate-600 leading-relaxed text-lg">
              Creemos firmemente en el desarrollo sostenible y la educación. Apoyamos el emprendimiento, logrando capacitar y guiar a las nuevas generaciones de profesionales a través de espacios formativos.
            </Typography>
            <Typography variant="body" className="text-slate-600 leading-relaxed text-lg">
              De igual modo, estamos comprometidos con el medio ambiente, optimizando rutas para reducir nuestra huella de carbono y proyectando una transición responsable hacia la sostenibilidad operativa.
            </Typography>
          </motion.div>
        </motion.div>
      </section>

      {/* 5. Datos de Confianza */}
      <section aria-label="Datos de confianza y trayectoria" className="py-24 border-y border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            <motion.div variants={itemVariants} className="space-y-3">
              <Typography variant="h2" className="text-5xl md:text-7xl font-light tracking-tighter text-slate-950">+24</Typography>
              <Typography variant="detail" className="text-slate-400 uppercase tracking-widest font-bold text-[10px]">Años de Experiencia</Typography>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-3">
              <Typography variant="h2" className="text-5xl md:text-7xl font-light tracking-tighter text-slate-950">+15k</Typography>
              <Typography variant="detail" className="text-slate-400 uppercase tracking-widest font-bold text-[10px]">Clientes Satisfechos</Typography>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-3">
              <Typography variant="h2" className="text-5xl md:text-7xl font-light tracking-tighter text-slate-950">100%</Typography>
              <Typography variant="detail" className="text-slate-400 uppercase tracking-widest font-bold text-[10px]">Calidad Certificada</Typography>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-3">
              <Typography variant="h2" className="text-5xl md:text-7xl font-light tracking-tighter text-slate-950">+300</Typography>
              <Typography variant="detail" className="text-slate-400 uppercase tracking-widest font-bold text-[10px]">Envíos Diarios</Typography>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 6. Llamado a la acción */}
      <section aria-label="Explorar productos" className="py-32 px-6 max-w-[800px] mx-auto text-center space-y-10">
        <Typography variant="h2" className="text-4xl md:text-5xl font-light tracking-tight">Eleva tu arte hoy mismo</Typography>
        <Typography variant="body" className="text-slate-500 text-xl font-light">
          Descubre nuestro enorme catálogo de suministros profesionales y únete a la comunidad de élite.
        </Typography>
        <div className="flex justify-center pt-6">
          <Link href="/shop" className="w-full sm:w-auto">
             <Button label="Ver Catálogo" className="w-full px-12 py-5 text-sm uppercase tracking-widest" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
