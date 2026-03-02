'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [step, setStep] = React.useState(1);
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const router = useRouter();

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    console.log(`Sending reset code to ${email}... (Mock: 123456)`);
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === '123456') {
      setStep(3);
      setError('');
    } else {
      setError('Código inválido. Use 123456 para la prueba.');
    }
  };

  const handleStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    console.log(`Password reset for ${email}`);
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <section className="pt-44 pb-32 px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-slate-200 p-12 space-y-12 shadow-xl">
           <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-none mx-auto flex items-center justify-center text-slate-900 border border-slate-200">
                 <KeyRound size={24} />
              </div>
              <Typography variant="h2" className="text-3xl uppercase tracking-tighter">
                {step === 1 && 'RECUPERAR ACCESO'}
                {step === 2 && 'VERIFICAR CÓDIGO'}
                {step === 3 && 'NUEVA CONTRASEÑA'}
              </Typography>
              <Typography variant="body" className="text-slate-400 text-sm">
                {step === 1 && 'Ingrese el correo asociado a su cuenta para recibir un código de seguridad.'}
                {step === 2 && `Hemos enviado un código de 6 dígitos a ${email}.`}
                {step === 3 && 'Defina su nueva contraseña de acceso.'}
              </Typography>
           </div>

           {error && (
             <div className="bg-red-50 text-red-500 p-4 border border-red-100 text-xs font-bold uppercase tracking-wider text-center">
               {error}
             </div>
           )}

           {step === 1 && (
             <form className="space-y-8" onSubmit={handleStep1}>
                <div className="space-y-2">
                   <Typography variant="detail">Correo Electrónico</Typography>
                   <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@empresa.com" 
                      className="w-full bg-white border border-slate-200 px-4 py-4 outline-none focus:border-slate-900 transition-colors" 
                   />
                </div>
                <Button type="submit" label="Enviar Código" className="w-full py-5" />
             </form>
           )}

           {step === 2 && (
             <form className="space-y-8" onSubmit={handleStep2}>
                <div className="space-y-2">
                   <Typography variant="detail">Código de Verificación</Typography>
                   <input 
                      type="text" 
                      maxLength={6}
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="000000" 
                      className="w-full bg-white border border-slate-200 px-4 py-4 outline-none focus:border-slate-900 transition-colors text-center text-2xl tracking-widest font-black" 
                   />
                </div>
                <Button type="submit" label="Verificar Código" className="w-full py-5" />
                <button onClick={() => setStep(1)} className="w-full text-xs uppercase font-black tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Volver a ingresar correo</button>
             </form>
           )}

           {step === 3 && (
             <form className="space-y-8" onSubmit={handleStep3}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Typography variant="detail">Nueva Contraseña</Typography>
                    <input 
                        type="password" 
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-white border border-slate-200 px-4 py-4 outline-none focus:border-slate-900 transition-colors" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Typography variant="detail">Confirmar Contraseña</Typography>
                    <input 
                        type="password" 
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white border border-slate-200 px-4 py-4 outline-none focus:border-slate-900 transition-colors" 
                    />
                  </div>
                </div>
                <Button type="submit" label="Restablecer Contraseña" className="w-full py-5" />
             </form>
           )}

           <div className="text-center">
              <Typography variant="small" className="text-slate-400">¿Ya recordó su contraseña? <Link href="/login" className="text-slate-900 font-black underline underline-offset-4">Ingresar</Link></Typography>
           </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
