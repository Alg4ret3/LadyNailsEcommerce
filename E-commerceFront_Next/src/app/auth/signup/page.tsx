'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { ClipboardCheck, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { PasswordStrength } from '@/components/molecules/PasswordStrength';
import { CountryCodeSelect } from '@/components/molecules/CountryCodeSelect';
import { validatePassword, formatPhoneInput, formatNameInput, validateName, validatePhone } from '@/utils/validations';
import { motion, AnimatePresence } from 'framer-motion';

import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [step, setStep] = React.useState(1);
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [verificationToken, setVerificationToken] = React.useState<string | undefined>(undefined);
  const [countryCode, setCountryCode] = React.useState('+57');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
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

  const isPasswordValid = React.useMemo(() => {
    return validatePassword(formData.password);
  }, [formData.password]);

  const passwordsMatch = formData.password !== '' && formData.password === formData.confirmPassword;

  const isFormValid = React.useMemo(() => {
    return (
      validateName(formData.firstName) &&
      validateName(formData.lastName) &&
      validatePhone(formData.phone) &&
      isPasswordValid &&
      passwordsMatch
    );
  }, [formData, isPasswordValid, passwordsMatch]);

  React.useEffect(() => {
    clearError();
    setError('');
  }, [clearError]);

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
        if (response.token) {
          setVerificationToken(response.token);
        }
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
    if (!isFormValid) {
      setError('Por favor, verifique todos los campos.');
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
        phone: `${countryCode}${formData.phone}`
      }, verificationToken);
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
                  <div className="flex justify-between items-end">
                    <Typography variant="detail">Nombres</Typography>
                    {formData.firstName && !validateName(formData.firstName) && (
                      <span className="text-[8px] text-red-500 font-bold uppercase tracking-widest">Inválido</span>
                    )}
                  </div>
                  <input
                    type="text"
                    className="pro-input"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: formatNameInput(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <Typography variant="detail">Apellidos</Typography>
                    {formData.lastName && !validateName(formData.lastName) && (
                      <span className="text-[8px] text-red-500 font-bold uppercase tracking-widest">Inválido</span>
                    )}
                  </div>
                  <input
                    type="text"
                    className="pro-input"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: formatNameInput(e.target.value) })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <div className="flex justify-between items-end">
                    <Typography variant="detail">Teléfono de Contacto</Typography>
                    {formData.phone && !validatePhone(formData.phone) && (
                      <span className="text-[8px] text-red-500 font-bold uppercase tracking-widest">Formato: 10 dígitos</span>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row gap-0">
                    <div className="w-full md:w-32">
                      <CountryCodeSelect value={countryCode} onChange={setCountryCode} />
                    </div>
                    <input
                      type="text"
                      className="pro-input flex-1"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: formatPhoneInput(e.target.value) })}
                      placeholder="300 000 0000"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Typography variant="detail">Contraseña de Acceso</Typography>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="pro-input pr-12 group-focus-within:border-slate-900"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors z-10 p-1"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <PasswordStrength password={formData.password} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <div className="flex justify-between items-end">
                    <Typography variant="detail">Confirmar Contraseña</Typography>
                    <AnimatePresence>
                      {formData.confirmPassword && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className={`flex items-center gap-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 ${passwordsMatch ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'}`}
                        >
                          {passwordsMatch ? (
                            <>Coinciden <CheckCircle2 size={10} /></>
                          ) : (
                            <>No coinciden <XCircle size={10} /></>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="relative group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="pro-input pr-12 group-focus-within:border-slate-900"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors z-10 p-1"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <Button
                  type="submit"
                  label={isLoading ? "Finalizando..." : "Finalizar Registro"}
                  className="w-full py-5"
                  disabled={isLoading || !isFormValid}
                />
              </div>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
