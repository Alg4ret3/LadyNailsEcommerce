'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { validateEmail } from '@/utils/validations';
import { sendContactRequest } from '@/services/medusa';


export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Ventas Mayoristas');
  const [message, setMessage] = useState('');
  
  const [emailTouched, setEmailTouched] = useState(false);
  const isEmailValid = validateEmail(email);
  const showEmailError = emailTouched && email.length > 0 && !isEmailValid;

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isFormValid = name.trim().length >= 2 && isEmailValid && subject && message.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      await sendContactRequest({
        name: name.trim(),
        email: email.trim(),
        subject,
        message: message.trim()
      });

      setStatus('success');
      // Limpiar formulario
      setName('');
      setEmail('');
      setSubject('Ventas Mayoristas');
      setMessage('');
      setEmailTouched(false);
      
      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
      setErrorMessage('Hubo un problema al enviar tu mensaje. Por favor intenta de nuevo.');
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <section className="pt-32 sm:pt-44 pb-16 sm:pb-32 px-4 sm:px-6 max-w-[1400px] mx-auto">
        <div className="mb-12 sm:mb-20">
           <Typography variant="h1" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl border-b-4 border-slate-900 pb-4 sm:pb-8 inline-block uppercase">CONTACTO PROFESIONAL</Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
           {/* Form */}
           <div className="lg:col-span-7 bg-white border border-slate-200 p-8 sm:p-16 space-y-12 relative overflow-hidden">
              <Typography variant="h3" className="text-2xl">SOLICITUD DE INFORMACIÓN</Typography>
              <form className="space-y-8" onSubmit={handleSubmit}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <Typography variant="detail">Nombre / Empresa</Typography>
                       <input 
                         type="text" 
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                         className="w-full border-b-2 border-slate-100 py-3 outline-none focus:border-slate-900 transition-colors" 
                         required
                       />
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
                         required
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
                    <select 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full border-b-2 border-slate-100 py-3 outline-none focus:border-slate-900 transition-colors bg-white"
                      required
                    >
                       <option>Ventas Mayoristas</option>
                       <option>Soporte Técnico</option>
                       <option>Logística y Envíos</option>
                       <option>Otro</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <Typography variant="detail">Mensaje Detallado</Typography>
                    <textarea 
                      rows={4} 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full border-b-2 border-slate-100 py-3 outline-none focus:border-slate-900 transition-colors resize-none"
                      required
                      placeholder="Cuéntanos cómo podemos ayudarte (mínimo 10 caracteres)"
                    ></textarea>
                 </div>
                 
                 {status === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                       {errorMessage}
                    </div>
                 )}
                 
                 {status === 'success' && (
                    <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm font-medium flex items-center gap-2">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                       Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.
                    </div>
                 )}
                 
                 <Button 
                   type="submit" 
                   label={status === 'loading' ? 'Enviando...' : 'Enviar Solicitud'} 
                   className={`w-full py-5 ${(!isFormValid || status === 'loading') ? 'opacity-50 cursor-not-allowed' : ''}`} 
                   disabled={!isFormValid || status === 'loading'}
                 />
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
