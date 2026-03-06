'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Truck, CreditCard, ShieldCheck, Plus, CheckCircle2, Eye, EyeOff, Mail, ClipboardCheck } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CountryCodeSelect } from '@/components/molecules/CountryCodeSelect';
import { PasswordStrength } from '@/components/molecules/PasswordStrength';
import { validatePassword, formatPhoneInput, formatNameInput, validateName, validatePhone } from '@/utils/validations';
import { useRouter } from 'next/navigation';
import { ColombiaLocationSelect } from '@/components/molecules/ColombiaLocationSelect';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totalItems, totalAmount } = useCart();
  const { user, sendOtp, verifyOtp, register, createAddress, isLoading, error: contextError, clearError } = useUser();

  const [checkoutStep, setCheckoutStep] = React.useState('SHIP_INFO'); // SHIP_INFO, PAYMENT
  const [selectedAddressId, setSelectedAddressId] = React.useState<string | null>(null);

  // Redirect if cart is empty
  React.useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router]);

  // Guest-to-User Flow State
  const [guestStep, setGuestStep] = React.useState(1); // 1: Email, 2: OTP, 3: Profile
  const [email, setEmail] = React.useState('');
  const [otpCode, setOtpCode] = React.useState('');
  const [countryCode, setCountryCode] = React.useState('+57');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [guestFormData, setGuestFormData] = React.useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    street: '',
    city: '',
    province: '',
    postalCode: ''
  });

  const [localError, setLocalError] = React.useState('');

  const isPasswordValid = React.useMemo(() => validatePassword(guestFormData.password), [guestFormData.password]);
  const passwordsMatch = guestFormData.password !== '' && guestFormData.password === guestFormData.confirmPassword;

  const isGuestFormValid = React.useMemo(() => {
    return (
      validateName(guestFormData.firstName) &&
      validateName(guestFormData.lastName) &&
      validatePhone(guestFormData.phone) &&
      guestFormData.street.length > 5 &&
      guestFormData.city.length > 2 &&
      isPasswordValid &&
      passwordsMatch
    );
  }, [guestFormData, isPasswordValid, passwordsMatch]);

  // Set default selected address when user is logged in
  React.useEffect(() => {
    if (user && user.addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [user, selectedAddressId]);

  const handleGuestStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      setLocalError('');
      clearError();
      await sendOtp(email);
      setGuestStep(2);
    } catch (err) {
      console.error('OTP send error:', err);
    }
  };

  const handleGuestStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLocalError('');
      clearError();
      const response = await verifyOtp(email, otpCode);
      if (response && response.verified) {
        setGuestStep(3);
      } else {
        setLocalError('Código inválido. Por favor, intente de nuevo.');
      }
    } catch (err) {
      console.error('OTP verify error:', err);
    }
  };

  const handleGuestStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGuestFormValid) {
      setLocalError('Por favor, verifique todos los campos.');
      return;
    }
    try {
      setLocalError('');
      clearError();
      // 1. Register User
      await register({
        email,
        password: guestFormData.password,
        firstName: guestFormData.firstName,
        lastName: guestFormData.lastName,
        phone: `${countryCode}${guestFormData.phone}`
      });

      // 2. Create Address for the now logged-in user
      await createAddress({
        addressName: 'Principal',
        firstName: guestFormData.firstName,
        lastName: guestFormData.lastName,
        street: guestFormData.street,
        city: guestFormData.city,
        country: 'CO',
        phone: `${countryCode}${guestFormData.phone}`,
        province: guestFormData.province,
        postalCode: guestFormData.postalCode
      });

      // The context update will trigger the useEffect and set the selectedAddressId
      setCheckoutStep('PAYMENT');
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const handleLoggedContinue = () => {
    if (selectedAddressId) {
      setCheckoutStep('PAYMENT');
    } else {
      setLocalError('Por favor seleccione una dirección de entrega.');
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <section className="pt-44 pb-24 px-6 max-w-[1400px] mx-auto">
        <Typography variant="h1" className="text-5xl mb-16 border-b-4 border-slate-900 pb-8 inline-block uppercase font-black">Finalizar Compra</Typography>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Step 1: Logistic Information */}
            <div className={`bg-white border ${checkoutStep === 'SHIP_INFO' ? 'border-slate-900' : 'border-slate-200'} p-8 sm:p-12 space-y-12 shadow-sm transition-all`}>
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${checkoutStep === 'SHIP_INFO' ? 'bg-slate-900' : 'bg-slate-200'} text-white flex items-center justify-center font-black`}>1</div>
                  <Typography variant="h3" className="text-2xl uppercase font-black tracking-tighter">Información de Despacho</Typography>
                </div>
                {checkoutStep === 'PAYMENT' && (
                  <button onClick={() => setCheckoutStep('SHIP_INFO')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors underline underline-offset-4">Editar</button>
                )}
              </div>

              {(contextError || localError) && (
                <div className="bg-red-50 text-red-500 p-4 border border-red-100 text-[10px] font-black uppercase tracking-widest text-center">
                  {contextError || localError}
                </div>
              )}

              {checkoutStep === 'SHIP_INFO' && (
                <AnimatePresence mode="wait">
                  {user ? (
                    /* LOGGED IN FLOW */
                    <motion.div key="logged-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.addresses.map((addr) => (
                          <button
                            key={addr.id}
                            onClick={() => { setSelectedAddressId(addr.id); setLocalError(''); }}
                            className={`p-6 border-2 text-left transition-all space-y-2 group ${selectedAddressId === addr.id ? 'border-slate-900 bg-slate-50' : 'border-slate-100 hover:border-slate-300'}`}
                          >
                            <div className="flex justify-between items-start">
                              <Typography variant="h4" className="text-[10px] uppercase font-black tracking-widest">{addr.label}</Typography>
                              {selectedAddressId === addr.id && <CheckCircle2 size={16} className="text-slate-900" />}
                            </div>
                            <Typography variant="body" className="text-xs text-slate-500 line-clamp-1">{addr.street}</Typography>
                            <Typography variant="body" className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{addr.city}, {addr.province}</Typography>
                          </button>
                        ))}
                        <button
                          onClick={() => router.push('/account?tab=direcciones')}
                          className="p-6 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all"
                        >
                          <Plus size={20} />
                          <Typography variant="h4" className="text-[10px] uppercase font-black tracking-widest">Gestionar Direcciones</Typography>
                        </button>
                      </div>
                      <Button label="Continuar al Pago" onClick={handleLoggedContinue} className="w-full py-5" />
                    </motion.div>
                  ) : (
                    /* GUEST FLOW (Step-by-step Fast Signup) */
                    <motion.div key="guest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
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
                          <Button type="submit" label={isLoading ? "Iniciando..." : "Verificar Correo y Continuar"} className="w-full py-5" disabled={isLoading} />
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
                            <Button type="submit" label={isLoading ? "Verificando..." : "Validar Código"} className="w-full py-5" disabled={isLoading} />
                            <button type="button" onClick={() => setGuestStep(1)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Volver al correo</button>
                          </div>
                        </form>
                      )}

                      {guestStep === 3 && (
                        <form onSubmit={handleGuestStep3} className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Personal Details */}
                            <div className="space-y-2">
                              <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Nombres</Typography>
                              <input type="text" className="pro-input" required value={guestFormData.firstName} onChange={(e) => setGuestFormData({ ...guestFormData, firstName: formatNameInput(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                              <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Apellidos</Typography>
                              <input type="text" className="pro-input" required value={guestFormData.lastName} onChange={(e) => setGuestFormData({ ...guestFormData, lastName: formatNameInput(e.target.value) })} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Teléfono Móvil</Typography>
                              <div className="flex flex-col md:flex-row gap-0">
                                <div className="w-full md:w-32"><CountryCodeSelect value={countryCode} onChange={setCountryCode} /></div>
                                <input type="text" className="pro-input flex-1" required value={guestFormData.phone} onChange={(e) => setGuestFormData({ ...guestFormData, phone: formatPhoneInput(e.target.value) })} placeholder="300 000 0000" />
                              </div>
                            </div>

                            {/* Address Details */}
                            <div className="space-y-2 md:col-span-2">
                              <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Dirección de Entrega Principal</Typography>
                              <input type="text" className="pro-input" required value={guestFormData.street} onChange={(e) => setGuestFormData({ ...guestFormData, street: e.target.value })} placeholder="Calle 123 #45-67" />
                            </div>
                            <ColombiaLocationSelect
                              departamento={guestFormData.province}
                              ciudad={guestFormData.city}
                              onDepartamentoChange={(val) => setGuestFormData(prev => ({ ...prev, province: val }))}
                              onCiudadChange={(val) => setGuestFormData(prev => ({ ...prev, city: val }))}
                            />
                            <div className="space-y-2 md:col-span-2">
                              <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Código Postal (opcional)</Typography>
                              <input type="text" className="pro-input" value={guestFormData.postalCode} onChange={(e) => setGuestFormData(prev => ({ ...prev, postalCode: e.target.value }))} placeholder="(Opcional)" />
                            </div>

                            {/* Password Creation */}
                            <div className="space-y-2 md:col-span-2 border-t border-slate-100 pt-8 mt-4">
                              <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Cree una Contraseña para sus futuros pedidos</Typography>
                              <div className="relative group">
                                <input type={showPassword ? "text" : "password"} className="pro-input pr-12 group-focus-within:border-slate-900" required value={guestFormData.password} onChange={(e) => setGuestFormData({ ...guestFormData, password: e.target.value })} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors z-10 p-1">
                                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                              </div>
                              <PasswordStrength password={guestFormData.password} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Confirmar Contraseña</Typography>
                              <div className="relative group">
                                <input type={showConfirmPassword ? "text" : "password"} className="pro-input pr-12 group-focus-within:border-slate-900" required value={guestFormData.confirmPassword} onChange={(e) => setGuestFormData({ ...guestFormData, confirmPassword: e.target.value })} />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors z-10 p-1">
                                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-center gap-6">
                            <Button type="submit" label={isLoading ? "Creando Cuenta..." : "Registrar y Continuar al Pago"} className="w-full py-5" disabled={isLoading || !isGuestFormValid} />
                          </div>
                        </form>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>

            {/* Step 2: Payment Method */}
            <div className={`bg-white border ${checkoutStep === 'PAYMENT' ? 'border-slate-900' : 'border-slate-200'} p-8 sm:p-12 space-y-12 shadow-sm transition-all ${checkoutStep === 'SHIP_INFO' ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <div className={`w-10 h-10 ${checkoutStep === 'PAYMENT' ? 'bg-slate-900' : 'bg-slate-200'} text-white flex items-center justify-center font-black`}>2</div>
                <Typography variant="h3" className="text-2xl uppercase font-black tracking-tighter">Método de Pago</Typography>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-8 border-2 border-slate-900 bg-slate-50 flex items-center gap-4 cursor-pointer group hover:bg-white transition-all">
                  <CreditCard size={24} className="group-hover:scale-110 transition-transform" />
                  <div className="space-y-1">
                    <Typography variant="h4" className="text-[10px] font-black uppercase tracking-widest">Tarjeta Crédito / Débito</Typography>
                    <Typography variant="detail" className="text-[8px] text-slate-400">Pago Immediato Procesado por Wompi</Typography>
                  </div>
                </div>
                <div className="p-8 border border-slate-100 bg-slate-50 flex items-center gap-4 hover:border-slate-900 transition-all cursor-pointer group">
                  <Truck size={24} className="group-hover:translate-x-1 transition-transform" />
                  <div className="space-y-1">
                    <Typography variant="h4" className="text-[10px] font-black uppercase tracking-widest">Transferencia Bancaria</Typography>
                    <Typography variant="detail" className="text-[8px] text-slate-400">Verificamos su consignación en 24h</Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-slate-900 text-white p-8 space-y-8 sticky top-44 border-b-4 border-emerald-500">
              <div className="flex items-end justify-between border-b border-white/10 pb-4">
                <Typography variant="h3" className="text-2xl font-black uppercase tracking-tighter">Resumen Central</Typography>
                <Typography variant="detail" className="text-[10px] text-white/40">{totalItems} {totalItems === 1 ? 'Artículo' : 'Artículos'}</Typography>
              </div>

              <div className="space-y-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between items-start border-b border-white/5 pb-6">
                    <div className="space-y-1">
                      <Typography variant="h4" className="text-[11px] font-bold uppercase tracking-widest">{item.name}</Typography>
                      <Typography variant="detail" className="text-white/40 text-[9px]">
                        Cantidad: {item.quantity}
                        {item.size && ` • Talla: ${item.size}`}
                        {item.color && ` • Color: ${item.color}`}
                      </Typography>
                    </div>
                    <Typography variant="h4" className="font-black text-xs">${(item.price * item.quantity).toLocaleString()}</Typography>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex justify-between">
                  <Typography variant="detail" className="text-[10px] font-black text-white/40 uppercase tracking-widest">Subtotal Neto</Typography>
                  <Typography variant="h4" className="font-bold">${totalAmount.toLocaleString()}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="detail" className="text-[10px] font-black text-white/40 uppercase tracking-widest">Logística & Despacho</Typography>
                  <Typography variant="h4" className="font-bold text-emerald-400 italic">Gratis</Typography>
                </div>
                <div className="pt-8 border-t border-white/20 flex justify-between items-end">
                  <Typography variant="h4" className="text-sm font-black uppercase tracking-widest">Total a Pagar</Typography>
                  <Typography variant="h1" className="text-5xl font-black tracking-tighter">${totalAmount.toLocaleString()}</Typography>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  label={checkoutStep === 'PAYMENT' ? "Confirmar Pago Seguro" : "Complete el Paso 1"}
                  disabled={checkoutStep === 'SHIP_INFO'}
                  href="/checkout/confirmation"
                  className={`w-full py-5 text-[11px] font-black uppercase tracking-[0.2rem] transition-all ${checkoutStep === 'PAYMENT' ? 'bg-white text-slate-900 hover:bg-emerald-400' : 'bg-white/5 text-white/20 border-white/10'}`}
                />

                <div className="flex items-center justify-center gap-3 bg-white/5 py-4 rounded-sm">
                  <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-emerald-400">
                    <ShieldCheck size={12} /> Cifrado AES-256
                  </div>
                  <div className="w-px h-3 bg-white/10"></div>
                  <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-white/40">
                    <CheckCircle2 size={12} /> Garantía GA
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

