import React from 'react';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepHeader } from './StepHeader';
import { AuthMode, CheckoutStep } from '../hooks/useCheckoutFlow';

interface IdentificationSectionProps {
  user: any;
  checkoutStep: CheckoutStep;
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  setCheckoutAuthPath: (path: 'login' | 'register' | null) => void;
  setCheckoutStep: (step: CheckoutStep) => void;
  loginEmail: string;
  setLoginEmail: (val: string) => void;
  loginPassword: string;
  setLoginPassword: (val: string) => void;
  showLoginPassword: boolean;
  setShowLoginPassword: (val: boolean) => void;
  isUserLoading: boolean;
  handleLogin: (e: React.FormEvent) => void;
  logout: () => void;
  email?: string;
}

export const IdentificationSection: React.FC<IdentificationSectionProps> = ({
  user,
  checkoutStep,
  authMode,
  setAuthMode,
  setCheckoutAuthPath,
  setCheckoutStep,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  showLoginPassword,
  setShowLoginPassword,
  isUserLoading,
  handleLogin,
  logout,
  email
}) => {
  const isActive = checkoutStep === 'AUTH_CHOICE';
  const isCompleted = checkoutStep !== 'AUTH_CHOICE';

  return (
    <div className={`bg-white border ${isActive ? 'border-slate-900' : 'border-slate-200'} p-8 sm:p-12 shadow-sm transition-all`}>
      <StepHeader
        number="1"
        title="Identificación"
        isActive={isActive}
        isCompleted={isCompleted}
        subtitle={user ? `${user.firstName} ${user.lastName}` : email ? email : 'Completado'}
      />

      {isActive && (
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div key="auth-forms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {authMode === 'choice' && (
                <motion.div key="choice" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }} className="space-y-6">
                  <Typography variant="body" className="text-sm text-slate-500 font-medium">¿Cómo desea continuar con su compra?</Typography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => { setAuthMode('login'); setCheckoutAuthPath('login'); }}
                      className="group relative flex flex-col items-center gap-4 p-8 border-2 border-slate-200 hover:border-slate-900 bg-white transition-all duration-200"
                    >
                      <div className="w-14 h-14 bg-slate-100 group-hover:bg-slate-900 rounded-full flex items-center justify-center transition-colors duration-200">
                        <LogIn size={24} className="text-slate-600 group-hover:text-white transition-colors duration-200" />
                      </div>
                      <div className="text-center space-y-1">
                        <Typography variant="h4" className="text-sm font-black uppercase tracking-widest">Iniciar Sesión</Typography>
                        <Typography variant="detail" className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Ya tengo cuenta</Typography>
                      </div>
                    </button>
                    <button
                      onClick={() => { setAuthMode('register'); setCheckoutAuthPath('register'); }}
                      className="group relative flex flex-col items-center gap-4 p-8 border-2 border-slate-900 bg-slate-900 hover:bg-slate-800 transition-all duration-200"
                    >
                      <div className="w-14 h-14 bg-white/10 group-hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200">
                        <UserPlus size={24} className="text-white" />
                      </div>
                      <div className="text-center space-y-1">
                        <Typography variant="h4" className="text-sm font-black uppercase tracking-widest text-white">Crear Cuenta</Typography>
                        <Typography variant="detail" className="text-[10px] text-white/50 uppercase font-bold tracking-wide">Registrarme ahora</Typography>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}

              {authMode === 'login' && (
                <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }} className="space-y-8 max-w-md">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Typography variant="detail" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Correo Electrónico</Typography>
                      <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          className="pro-input pl-12"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="ejemplo@correo.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Typography variant="detail" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contraseña</Typography>
                      <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          className="pro-input pl-12 pr-12"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors z-10 p-1"
                        >
                          {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" label={isUserLoading ? 'Ingresando...' : 'Iniciar Sesión y Continuar'} className="w-full py-5" disabled={isUserLoading} />
                  </form>
                  <button onClick={() => { setAuthMode('choice'); setCheckoutAuthPath(null); }} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
                    ← Volver a las opciones
                  </button>
                </motion.div>
              )}

              {authMode === 'register' && (
                <motion.div key="register-intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }} className="space-y-6">
                  <Typography variant="body" className="text-sm text-slate-500 font-medium">Complete el siguiente paso para crear su cuenta y continuar con el pedido.</Typography>
                  <Button
                    label="Continuar con el Registro"
                    onClick={() => { setAuthMode('choice'); setCheckoutStep('EMAIL_VERIFY'); }}
                    className="w-full py-5"
                  />
                  <button onClick={() => { setAuthMode('choice'); setCheckoutAuthPath(null); }} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all block">
                    ← Volver a las opciones
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div key="logged-in-info" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }} className="space-y-8">
              <div className="bg-white p-8 border border-slate-200 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-xl">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <Typography variant="h4" className="text-sm font-black uppercase tracking-widest">{user.firstName} {user.lastName}</Typography>
                    <Typography variant="body" className="text-xs text-slate-500">{user.email}</Typography>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <Typography variant="detail" className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Teléfono: {user.phone || 'No registrado'}</Typography>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Button
                  label="Continuar a Envío"
                  onClick={() => setCheckoutStep('SHIP_INFO')}
                  className="w-full py-5"
                />
                <button onClick={() => logout()} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-all">
                  Cerrar Sesión e Identificarme de nuevo
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
