'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { MailCheck, KeyRound, RotateCcw } from 'lucide-react';
import Link from 'next/link';

import { useUser } from '@/context/UserContext';

const RESEND_COOLDOWN = 45;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ countdown, setCountDown ] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const { requestPasswordReset, isLoading, error, clearError } = useUser();

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountDown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      clearError();
      await requestPasswordReset(email);
      setIsSubmitted(true);
      setCountDown(RESEND_COOLDOWN);
    } catch (err) {
      // El error se maneja en el contexto y se muestra abajo
    }
  };

  const progress = countdown > 0 ? ((RESEND_COOLDOWN - countdown) / RESEND_COOLDOWN) * 100 : 100;
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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
                <Typography variant="h3" className="text-2xl uppercase tracking-tighter">
                  {resendCount > 0 ? '¡Correo Reenviado!' : '¡Correo Enviado!'}
                </Typography>
                <Typography variant="body" className="text-slate-600 text-sm leading-relaxed">
                  Si el correo <b>{email}</b> está registrado, recibirá instrucciones para restablecer su contraseña en unos instantes.
                </Typography>
              </div>

              {/* Resend section */}
              <div className="pt-2 space-y-4">
                <Typography variant="small" className="text-slate-400 text-xs">
                  ¿No recibió el correo?
                </Typography>

                <div className="flex items-center justify-center gap-4">
                  {/* Circular countdown indicator */}
                  {countdown > 0 && (
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                        {/* Background circle */}
                        <circle
                          cx="24"
                          cy="24"
                          r={radius}
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="3"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="24"
                          cy="24"
                          r={radius}
                          fill="none"
                          stroke="#94a3b8"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          style={{ transition: 'stroke-dashoffset 0.9s linear' }}
                        />
                      </svg>
                      <span className="absolute text-[10px] font-black text-slate-500 tabular-nums">
                        {countdown}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={countdown > 0 || isLoading}
                    className={`
                      flex items-center gap-2 px-5 py-3 border text-[10px] font-black uppercase tracking-[0.15em] transition-all
                      ${countdown > 0 || isLoading
                        ? 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50'
                        : 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white cursor-pointer'
                      }
                    `}
                  >
                    <RotateCcw size={12} className={isLoading ? 'animate-spin' : ''} />
                    {isLoading ? 'Enviando...' : countdown > 0 ? `Reenviar en ${countdown}s` : 'Reenviar correo'}
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-500 p-3 border border-red-100 text-xs font-bold uppercase tracking-wider text-center">
                    {error}
                  </div>
                )}
              </div>

              <div className="pt-2">
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
