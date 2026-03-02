'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { ClipboardCheck } from 'lucide-react';
import Link from 'next/link';

import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [step, setStep] = React.useState(1);
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = React.useState('');

  const { sendOtp, verifyOtp, register, isLoading, error: contextError, clearError } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (contextError) {
      setError(contextError);
    }
  }, [contextError]);

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      setError('');
      clearError();
      await sendOtp(email);
      setStep(2);
    } catch (err) {
      // Error handled by context and useEffect
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      clearError();
      const response = await verifyOtp(email, code);
      if (response && response.verified) {
        setStep(3);
      } else {
        setError('Código inválido. Por favor, intente de nuevo.');
      }
    } catch (err: any) {
      // Error is propagated through context
    }
  };

  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    try {
      setError('');
      clearError();
      await register({
        email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      });
      router.push('/account');
    } catch (err) {
      // Error is propagated through context
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <section className="pt-44 pb-32 px-6 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white border border-slate-200 p-8 sm:p-16 space-y-12 shadow-xl">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-900 mx-auto flex items-center justify-center border border-slate-200">
              <ClipboardCheck size={24} />
            </div>
            <Typography variant="h2" className="text-3xl uppercase tracking-tighter sm:text-4xl">
              {step === 1 && 'Crear Cuenta'}
              {step === 2 && 'Verificación de Correo'}
              {step === 3 && 'Completar Perfil'}
            </Typography>
            <Typography variant="body" className="text-slate-400 max-w-md mx-auto">
              {step === 1 && 'Inicie su registro ingresando su correo electrónico.'}
              {step === 2 && `Hemos enviado un código a ${email}. Ingréselo para continuar.`}
              {step === 3 && 'Defina sus datos de acceso y contacto.'}
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
                <Typography variant="detail">Correo Corporativo</Typography>
                <input
                  type="email"
                  className="pro-input"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@empresa.com"
                />
              </div>
              <Button type="submit" label={isLoading ? "Enviando..." : "Recibir Código"} className="w-full py-5" disabled={isLoading} />
              <div className="text-center">
                <Typography variant="small">¿Ya tiene una cuenta? <Link href="/auth/login" className="text-slate-900 font-black underline underline-offset-4">Ingresar aquí</Link></Typography>
              </div>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-8" onSubmit={handleStep2}>
              <div className="space-y-2 text-center">
                <Typography variant="detail">Código de Verificación (6 dígitos)</Typography>
                <input
                  type="text"
                  className="pro-input text-center text-3xl tracking-[1rem] font-black"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                />
              </div>
              <Button type="submit" label={isLoading ? "Verificando..." : "Verificar Código"} className="w-full py-5" disabled={isLoading} />
              <button type="button" onClick={() => { setStep(1); clearError(); setError(''); }} className="w-full text-xs uppercase font-black tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Volver al paso anterior</button>
            </form>
          )}

          {step === 3 && (
            <form className="space-y-12" onSubmit={handleStep3}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Typography variant="detail">Nombres</Typography>
                  <input
                    type="text"
                    className="pro-input"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Typography variant="detail">Apellidos</Typography>
                  <input
                    type="text"
                    className="pro-input"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Typography variant="detail">Teléfono de Contacto</Typography>
                  <input
                    type="text"
                    className="pro-input"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Typography variant="detail">Contraseña de Acceso</Typography>
                  <input
                    type="password"
                    className="pro-input"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Typography variant="detail">Confirmar Contraseña</Typography>
                  <input
                    type="password"
                    className="pro-input"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <Button type="submit" label={isLoading ? "Finalizando..." : "Finalizar Registro"} className="w-full py-5" disabled={isLoading} />
              </div>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
