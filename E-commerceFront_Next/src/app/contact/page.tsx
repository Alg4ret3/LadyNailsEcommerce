'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { validateEmail } from '@/utils/validations';

export default function ContactPage() {
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const isEmailValid = validateEmail(email);
  const showEmailError = emailTouched && email.length > 0 && !isEmailValid;

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <section className="pt-32 sm:pt-44 pb-16 sm:pb-32 px-4 sm:px-6 max-w-[1400px] mx-auto">
        <div className="mb-12 sm:mb-20">
           <Typography variant="h1" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl border-b-4 border-slate-900 pb-4 sm:pb-8 inline-block uppercase">CONTACTO PROFESIONAL</Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
           {/* Form */}
           <div className="lg:col-span-7 bg-white border border-slate-200 p-8 sm:p-16 space-y-12">
              <Typography variant="h3" className="text-2xl">SOLICITUD DE INFORMACIÓN</Typography>
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <Typography variant="detail">Nombre / Empresa</Typography>
                       <input type="text" className="w-full border-b-2 border-slate-100 py-3 outline-none focus:border-slate-900 transition-colors" />
                    </div>
                    <div className="space-y-2">
                       <Typography variant="detail">Correo Electrónico</Typography>
                       <input
                         type="email"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         onBlur={() => setEmailTouched(true)}
                         placeholder="ejemplo@correo.com"
                         className={`w-full border-b-2 py-3 outline-none transition-colors placeholder:text-slate-300 ${
                           showEmailError
                             ? 'border-red-400 text-red-600'
                             : emailTouched && isEmailValid
                             ? 'border-green-500 text-slate-900'
                             : 'border-slate-100 focus:border-slate-900'
                         }`}
                       />
                       {showEmailError && (
                         <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                           Correo electrónico inválido
                         </p>
                       )}
                       {emailTouched && isEmailValid && (
                         <p className="text-green-600 text-[10px] font-bold uppercase tracking-widest mt-1">
                           ✓ Correo válido
                         </p>
                       )}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Typography variant="detail">Asunto de Consulta</Typography>
                    <select className="w-full border-b-2 border-slate-100 py-3 outline-none focus:border-slate-900 transition-colors bg-white">
                       <option>Ventas Mayoristas</option>
                       <option>Soporte Técnico</option>
                       <option>Logística y Envíos</option>
                       <option>Otro</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <Typography variant="detail">Mensaje Detallado</Typography>
                    <textarea rows={4} className="w-full border-b-2 border-slate-100 py-3 outline-none focus:border-slate-900 transition-colors resize-none"></textarea>
                 </div>
                 <Button type="submit" label="Enviar Solicitud" className="w-full py-5" />
              </form>
           </div>

           {/* Info */}
           <div className="lg:col-span-5 space-y-12">
              <div className="space-y-8">
                 <Typography variant="h3" className="text-2xl uppercase tracking-widest">Canales Directos</Typography>
                 <div className="space-y-8">
                    <div className="flex items-start gap-6">
                       <div className="p-4 bg-slate-900 text-white shrink-0"><Phone size={20} /></div>
                       <div>
                          <Typography variant="h4" className="mb-1">Línea Nacional</Typography>
                          <Typography variant="body" className="text-slate-500">01-800-BEAUTY-DIST <br /> +57 (602) 000 0000</Typography>
                       </div>
                    </div>
                    <div className="flex items-start gap-6">
                       <div className="p-4 bg-slate-900 text-white shrink-0"><Mail size={20} /></div>
                       <div>
                          <Typography variant="h4" className="mb-1">Correo Corporativo</Typography>
                          <Typography variant="body" className="text-slate-500">hola@ladynailshop.com <br /> mayoristas@ladynailshop.com</Typography>
                       </div>
                    </div>
                    <div className="flex items-start gap-6">
                       <div className="p-4 bg-slate-900 text-white shrink-0"><MapPin size={20} /></div>
                       <div>
                          <Typography variant="h4" className="mb-1">Hub Logístico</Typography>
                          <Typography variant="body" className="text-slate-500">Parque Industrial Sur, Bloque C-12, Pasto, Nariño</Typography>
                       </div>
                    </div>
                    <div className="flex items-start gap-6">
                       <div className="p-4 bg-slate-900 text-white shrink-0"><Clock size={20} /></div>
                       <div>
                          <Typography variant="h4" className="mb-1">Horario Operativo</Typography>
                          <Typography variant="body" className="text-slate-500">Lunes a Viernes: 08:00 - 18:00 <br /> Sábados: 09:00 - 13:00</Typography>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
