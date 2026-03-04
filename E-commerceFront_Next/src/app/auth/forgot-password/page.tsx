'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { MailCheck, KeyRound } from 'lucide-react';
import Link from 'next/link';

import { useUser } from '@/context/UserContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const { requestPasswordReset, isLoading, error, clearError } = useUser();

  React.useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      clearError();
      await requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (err) {
      // El error se maneja en el contexto y se muestra abajo
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <section className="pt-44 pb-32 px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-slate-200 p-8 sm:p-12 space-y-12 shadow-xl">
          {!isSubmitted ? (
            <>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 mx-auto flex items-center justify-center text-slate-900 border border-slate-200">
                  <KeyRound size={24} />
                </div>
                <Typography variant="h2" className="text-3xl uppercase tracking-tighter sm:text-4xl">
                  Recuperar Acceso
                </Typography>
                <Typography variant="body" className="text-slate-400 text-sm">
                  Ingrese el correo asociado a su cuenta. Le enviaremos un enlace para restablecer su contraseña.
                </Typography>
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 p-4 border border-red-100 text-xs font-bold uppercase tracking-wider text-center">
                  {error}
                </div>
              )}

              <form className="space-y-8" onSubmit={handleSubmit}>
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
                <Button
                  type="submit"
                  label={isLoading ? "Enviando..." : "Enviar Enlace"}
                  className="w-full py-5"
                  disabled={isLoading}
                />
              </form>
            </>
          ) : (
            <div className="text-center space-y-8 py-4">
              <div className="w-20 h-20 bg-green-50 text-green-600 mx-auto flex items-center justify-center rounded-full border border-green-100">
                <MailCheck size={32} />
              </div>
              <div className="space-y-4">
                <Typography variant="h3" className="text-2xl uppercase tracking-tighter">¡Correo Enviado!</Typography>
                <Typography variant="body" className="text-slate-600 text-sm leading-relaxed">
                  Si el correo <b>{email}</b> está registrado, recibirá instrucciones para restablecer su contraseña en unos instantes.
                </Typography>
              </div>
              <div className="pt-4">
                <Link href="/auth/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">
                  Volver al login
                </Link>
              </div>
            </div>
          )}

          {!isSubmitted && (
            <div className="text-center">
              <Typography variant="small" className="text-slate-400">
                ¿Ya recordó su contraseña? <Link href="/auth/login" className="text-slate-900 font-black underline underline-offset-4">Ingresar</Link>
              </Typography>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
