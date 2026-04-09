import React from 'react';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Mail, ClipboardCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepHeader } from './StepHeader';
import { CheckoutStep } from '../hooks/useCheckoutFlow';

interface EmailVerificationSectionProps {
  checkoutStep: CheckoutStep;
  guestStep: number;
  email: string;
  setEmail: (val: string) => void;
  otpCode: string;
  setOtpCode: (val: string) => void;
  isUserLoading: boolean;
  handleGuestStep1: (e: React.FormEvent) => void;
  handleGuestStep2: (e: React.FormEvent) => void;
  setCheckoutStep: (step: CheckoutStep) => void;
  setGuestStep: (step: number) => void;
}

export const EmailVerificationSection: React.FC<EmailVerificationSectionProps> = ({
  checkoutStep,
  guestStep,
  email,
  setEmail,
  otpCode,
  setOtpCode,
  isUserLoading,
  handleGuestStep1,
  handleGuestStep2,
  setCheckoutStep,
  setGuestStep
}) => {
  const isActive = checkoutStep === 'EMAIL_VERIFY';
  const isCompleted = ['SHIP_INFO', 'SHIPPING', 'PAYMENT'].includes(checkoutStep);
  const isLocked = checkoutStep === 'AUTH_CHOICE';

  return (
    <div className={`bg-white border ${
      isActive ? 'border-slate-900 shadow-lg' :
      isLocked ? 'border-slate-200 opacity-40 pointer-events-none' :
      'border-slate-200'
    } p-8 sm:p-12 shadow-sm transition-all`}>
      <StepHeader
        number="2"
        title="Verificación de Correo"
        isActive={isActive}
        isCompleted={isCompleted}
        subtitle={email}
      />

      {isActive && (
        <AnimatePresence mode="wait">
          <motion.div key="email-verify" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
            {guestStep === 1 && (
              <form onSubmit={handleGuestStep1} className="space-y-6">
                <div className="space-y-2">
                  <Typography variant="detail" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Correo Electrónico para Facturación</Typography>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      className="pro-input pl-12"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@correo.com"
                    />
                  </div>
                </div>
                <Button type="submit" label={isUserLoading ? 'Enviando...' : 'Verificar Correo y Continuar'} className="w-full py-5" disabled={isUserLoading} />
                <button type="button" onClick={() => setCheckoutStep('AUTH_CHOICE')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all block">
                  ← Volver a las opciones
                </button>
              </form>
            )}

            {guestStep === 2 && (
              <form onSubmit={handleGuestStep2} className="space-y-8">
                <div className="space-y-4 text-center">
                  <Typography variant="detail" className="font-black uppercase tracking-widest text-slate-400">Hemos enviado un código a su correo</Typography>
                  <div className="relative flex justify-center">
                    <ClipboardCheck size={20} className="absolute left-1/4 top-1/2 -translate-y-1/2 text-slate-300 hidden md:block" />
                    <input
                      type="text"
                      className="pro-input text-center text-4xl tracking-[1rem] font-black max-w-[300px]"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="000000"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <Button type="submit" label={isUserLoading ? 'Verificando...' : 'Validar Código'} className="w-full py-5" disabled={isUserLoading} />
                  <button type="button" onClick={() => setGuestStep(1)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Volver al correo</button>
                </div>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
