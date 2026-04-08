'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Truck, CreditCard, ShieldCheck, Plus, CheckCircle2, Eye, EyeOff, Mail, ClipboardCheck, LogIn, UserPlus, Lock } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import { useCartQuery } from '@/hooks/useCart';
import { useCustomerAddresses } from '@/hooks/useCurrentUser';
import { motion, AnimatePresence } from 'framer-motion';
import { CountryCodeSelect } from '@/components/molecules/CountryCodeSelect';
import { PasswordStrength } from '@/components/molecules/PasswordStrength';
import { validatePassword, formatPhoneInput, formatNameInput, validateName, validatePhone } from '@/utils/validations';
import { useRouter } from 'next/navigation';
import { ColombiaLocationSelect } from '@/components/molecules/ColombiaLocationSelect';
import { getShippingOptions, ShippingOption, PaymentCollection } from '@/services/medusa';
import { WompiSubmitButton } from '@/components/molecules/WompiSubmitButton';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totalItems, totalAmount, clearCart, medusaCartId } = useCart();
  const { user, login, logout, sendOtp, verifyOtp, register, isLoading: isUserLoading, error: contextError, clearError } = useUser();

  const {
    updateAddress: updateCartAddressMutation,
    addShippingMethod: addShippingMethodMutation,
    createPaymentCollection: createPaymentCollectionMutation,
    createPaymentSession: createPaymentSessionMutation,
    completeCart: completeCartMutation,
    isUpdating: isCartUpdating,
    cartId: medusaCartIdQuery,
    ensureCart
  } = useCartQuery();

  const { createAddress: createCustomerAddressMutation } = useCustomerAddresses();

  // AUTH_CHOICE → SHIP_INFO → SHIPPING → PAYMENT
  const [checkoutStep, setCheckoutStep] = React.useState(() => {
    // Start at AUTH_CHOICE if not logged in (will be overridden by user effect)
    return 'AUTH_CHOICE';
  });
  const [selectedAddressId, setSelectedAddressId] = React.useState<string | null>(null);
  const [shippingOptions, setShippingOptions] = React.useState<ShippingOption[]>([]);
  const [selectedShippingOptionId, setSelectedShippingOptionId] = React.useState<string | null>(null);
  const [paymentCollection, setPaymentCollection] = React.useState<PaymentCollection | null>(null);
  const [selectedPaymentProviderId, setSelectedPaymentProviderId] = React.useState<string | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = React.useState(false);

  const selectedShippingAmount = React.useMemo(() => {
    const option = shippingOptions.find(o => o.id === selectedShippingOptionId);
    return option ? option.amount : 0;
  }, [shippingOptions, selectedShippingOptionId]);
  const [isUpdatingCart, setIsUpdatingCart] = React.useState(false);
  const [isAddingAddress, setIsAddingAddress] = React.useState(false);
  const [hasSkippedAuth, setHasSkippedAuth] = React.useState(false);
  const [newAddressFormData, setNewAddressFormData] = React.useState({
    label: 'Casa',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone?.replace('+57', '') || '',
    street: '',
    city: '',
    province: '',
    postalCode: ''
  });

  // Redirect if cart is empty and not processing
  React.useEffect(() => {
    if (cartItems.length === 0 && !isProcessingOrder) {
      router.push('/cart');
    }
  }, [cartItems, isProcessingOrder, router]);

  // Auth step state
  const [authMode, setAuthMode] = React.useState<'choice' | 'login' | 'register'>('choice');
  const [loginEmail, setLoginEmail] = React.useState('');
  const [loginPassword, setLoginPassword] = React.useState('');
  const [showLoginPassword, setShowLoginPassword] = React.useState(false);

  // Skip auth step if user is already logged in
  React.useEffect(() => {
    if (user && checkoutStep === 'AUTH_CHOICE' && !hasSkippedAuth) {
      setCheckoutStep('SHIP_INFO');
      setHasSkippedAuth(true);
    }
  }, [user, checkoutStep, hasSkippedAuth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    try {
      setLocalError('');
      clearError();
      await login({ email: loginEmail, password: loginPassword });
      setCheckoutStep('SHIP_INFO');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

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

  const isNewAddressValid = React.useMemo(() => {
    // Loosen name check to be less restrictive than the global utility if needed, 
    // but here we'll just ensure it has content since Medusa is flexible.
    return (
      newAddressFormData.label.trim().length > 1 &&
      newAddressFormData.firstName.trim().length >= 2 &&
      newAddressFormData.lastName.trim().length >= 2 &&
      validatePhone(newAddressFormData.phone) &&
      newAddressFormData.street.trim().length > 5 &&
      newAddressFormData.city.length > 2 &&
      newAddressFormData.province.length > 2
    );
  }, [newAddressFormData]);

  // Track address count to auto-select new address
  const [prevAddressesCount, setPrevAddressesCount] = React.useState(0);
  React.useEffect(() => {
    if (user && user.addresses.length > prevAddressesCount) {
      // New address added, select it
      const newAddr = user.addresses[user.addresses.length - 1];
      if (newAddr) {
        setSelectedAddressId(newAddr.id);
      }
    }
    if (user) {
      setPrevAddressesCount(user.addresses.length);
    }
  }, [user, prevAddressesCount]);

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

    setIsUpdatingCart(true);
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
      await createCustomerAddressMutation({
        address_name: 'Principal',
        first_name: guestFormData.firstName,
        last_name: guestFormData.lastName,
        address_1: guestFormData.street,
        city: guestFormData.city,
        country_code: 'co',
        phone: `${countryCode}${guestFormData.phone}`,
        province: guestFormData.province,
        postal_code: guestFormData.postalCode
      });

      // 3. Sync address with Medusa Cart
      const cartId = await ensureCart();
      if (cartId) {
        await updateCartAddressMutation({
          first_name: guestFormData.firstName,
          last_name: guestFormData.lastName,
          address_1: guestFormData.street,
          city: guestFormData.city,
          country_code: 'co',
          province: guestFormData.province,
          postal_code: guestFormData.postalCode,
          phone: `${countryCode}${guestFormData.phone}`
        });

        // Fetch Shipping Options
        const { shipping_options } = await getShippingOptions(cartId);
        setShippingOptions(shipping_options);

        // Default to first option
        if (shipping_options.length > 0) {
          setSelectedShippingOptionId(shipping_options[0].id);
        }
      }

      setCheckoutStep('SHIPPING');
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setIsUpdatingCart(false);
    }
  };

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNewAddressValid) return;

    setIsUpdatingCart(true);
    try {
      setLocalError('');
      clearError();

      await createCustomerAddressMutation({
        address_name: newAddressFormData.label,
        first_name: newAddressFormData.firstName,
        last_name: newAddressFormData.lastName,
        address_1: newAddressFormData.street,
        city: newAddressFormData.city,
        country_code: 'co',
        phone: `${countryCode}${newAddressFormData.phone}`,
        province: newAddressFormData.province,
        postal_code: newAddressFormData.postalCode
      });

      // Reset form and close
      setIsAddingAddress(false);
      setNewAddressFormData(prev => ({
        ...prev,
        street: '',
        city: '',
        province: '',
        postalCode: ''
      }));
    } catch (err: any) {
      console.error('Address creation error:', err);
      setLocalError(err.message || 'Error al crear la dirección.');
    } finally {
      setIsUpdatingCart(false);
    }
  };

  const handleLoggedContinue = async () => {
    if (selectedAddressId && user) {
      const addr = user.addresses.find(a => a.id === selectedAddressId);
      if (!addr) return;

      setIsUpdatingCart(true);
      try {
        const cartId = await ensureCart();
        if (cartId) {
          await updateCartAddressMutation({
            first_name: addr.firstName || user.firstName || "",
            last_name: addr.lastName || user.lastName || "",
            address_1: addr.street,
            city: addr.city,
            country_code: (addr.country || 'CO').toLowerCase(),
            province: addr.province,
            postal_code: addr.postalCode,
            phone: addr.phone,
          });

          // Fetch Shipping Options
          const { shipping_options } = await getShippingOptions(cartId);
          setShippingOptions(shipping_options);

          // Default to first option
          if (shipping_options.length > 0) {
            setSelectedShippingOptionId(shipping_options[0].id);
          }
        }
        setCheckoutStep('SHIPPING');
      } catch (err) {
        setLocalError('Error al sincronizar la dirección con el carrito.');
      } finally {
        setIsUpdatingCart(false);
      }
    } else {
      setLocalError('Por favor seleccione una dirección de entrega.');
    }
  };

  const handleShippingContinue = async () => {
    if (!selectedShippingOptionId) {
      setLocalError('Por favor seleccione un método de envío.');
      return;
    }

    setIsUpdatingCart(true);
    try {
      const cartId = await ensureCart();
      if (cartId) {
        await addShippingMethodMutation(selectedShippingOptionId);

        const { payment_collection: new_collection } = await createPaymentCollectionMutation();
        setPaymentCollection(new_collection);

        // Auto-select Wompi if available or initialize it
        const wompiSession = new_collection?.payment_sessions?.find((s: any) => s.provider_id.includes('wompi'));
        const wompiProviderId = wompiSession?.provider_id || 'pp_wompi_wompi';

        // Attempt to select and initialize Wompi session (throw during flow)
        await handlePaymentSelect(wompiProviderId, new_collection, true);

        setCheckoutStep('PAYMENT');
      }
    } catch (err) {
      console.error('Checkout flow error:', err);
      setLocalError('Hubo un problema al configurar su envío y método de pago.');
    } finally {
      setIsUpdatingCart(false);
    }
  };

  const handlePaymentSelect = async (providerId: string, collectionOverride?: PaymentCollection, shouldThrow: boolean = false) => {
    const currentCollection = collectionOverride || paymentCollection;
    if (!currentCollection) return;

    setIsUpdatingCart(true);
    try {
      setSelectedPaymentProviderId(providerId);
      const { payment_collection } = await createPaymentSessionMutation({ collectionId: currentCollection.id, providerId });
      setPaymentCollection(payment_collection);
    } catch (err) {
      console.error('Payment selection error:', err);
      setLocalError('Error al preparar la conexión segura de pago.');
      if (shouldThrow) throw err;
    } finally {
      setIsUpdatingCart(false);
    }
  };

  const handleWompiSuccess = async () => {
    setIsProcessingOrder(true);
    try {
      const cartId = await ensureCart();
      if (cartId) {
        const response = await completeCartMutation();

        // Wipe all trace of the cart (clearCart handles localStorage cleanup)
        clearCart();

        const orderId = response?.order?.id || (response?.type === 'order' ? response.order.id : null);
        router.push(`/checkout/confirmation${orderId ? `?order_id=${orderId}` : ''}`);
      } else {
        router.push('/checkout/confirmation');
      }
    } catch (err) {
      setLocalError('El pago en Wompi fue EXITOSO, pero hubo un error generando la orden final. Se completará por verificación 24h o contacte soporte con su referencia.');
      setIsProcessingOrder(false);
    }
  };



  return (
    <main className="min-h-screen bg-white relative">
      <Navbar />

      {/* Processing Order Overlay */}
      {isProcessingOrder && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md animate-in fade-in">
          <div className="text-center space-y-4 flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-[#00C896] rounded-full animate-spin"></div>
            <h3 className="text-xl font-bold tracking-tight text-slate-800">Cifrando y Generando su Orden...</h3>
            <p className="text-sm font-medium text-slate-500">Por favor espere un momento, no cierre la ventana.</p>
          </div>
        </div>
      )}

      <section className="pt-44 pb-24 px-6 max-w-[1400px] mx-auto">
        <Typography variant="h1" className="text-5xl mb-16 border-b-4 border-slate-900 pb-8 inline-block uppercase font-black">Finalizar Compra</Typography>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-12">
            {(contextError || localError) && (
              <div className="bg-red-50 text-red-600 p-6 border-l-4 border-red-500 rounded-lg animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-500 text-white p-1 rounded-full"><Plus className="rotate-45" size={12} /></div>
                  <Typography variant="h4" className="text-xs font-black uppercase tracking-widest">{contextError || localError}</Typography>
                </div>
              </div>
            )}

            {/* Step 0: Authentication Gate */}
            {checkoutStep === 'AUTH_CHOICE' && (
              <div className="bg-white border border-slate-900 p-8 sm:p-12 shadow-sm">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-10">
                  <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-black">1</div>
                  <Typography variant="h3" className="text-2xl uppercase font-black tracking-tighter">Identificación</Typography>
                </div>

                <AnimatePresence mode="wait">
                  {!user ? (
                    <motion.div key="auth-forms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {authMode === 'choice' && (
                        <motion.div key="choice" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }} className="space-y-6">
                          <Typography variant="body" className="text-sm text-slate-500 font-medium">¿Cómo desea continuar con su compra?</Typography>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                              onClick={() => { setAuthMode('login'); setLocalError(''); clearError(); }}
                              className="group relative flex flex-col items-center gap-4 p-8 border-2 border-slate-200 hover:border-slate-900 bg-white hover:bg-slate-50 transition-all duration-200"
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
                              onClick={() => { setAuthMode('register'); setLocalError(''); clearError(); }}
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
                          <button onClick={() => { setAuthMode('choice'); setLocalError(''); clearError(); }} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
                            ← Volver a las opciones
                          </button>
                        </motion.div>
                      )}

                      {authMode === 'register' && (
                        <motion.div key="register-intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }} className="space-y-6">
                          <Typography variant="body" className="text-sm text-slate-500 font-medium">Complete el siguiente paso para crear su cuenta y continuar con el pedido.</Typography>
                          <Button
                            label="Continuar con el Registro"
                            onClick={() => { setAuthMode('choice'); setCheckoutStep('SHIP_INFO'); }}
                            className="w-full py-5"
                          />
                          <button onClick={() => { setAuthMode('choice'); setLocalError(''); clearError(); }} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all block">
                            ← Volver a las opciones
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div key="logged-in-info" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }} className="space-y-8">
                      <div className="bg-slate-50 p-8 border border-slate-200 space-y-4">
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
              </div>
            )}

            {/* Step 1: Logistic Information */}
            <div className={`bg-white border ${checkoutStep === 'SHIP_INFO' ? 'border-slate-900' : 'border-slate-200'} p-8 sm:p-12 space-y-12 shadow-sm transition-all ${checkoutStep === 'AUTH_CHOICE' ? 'opacity-40 pointer-events-none' : ''}`}>
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${checkoutStep === 'SHIP_INFO' ? 'bg-slate-900' : 'bg-slate-200'} text-white flex items-center justify-center font-black`}>2</div>
                  <Typography variant="h3" className="text-2xl uppercase font-black tracking-tighter">Dirección de Entrega</Typography>
                </div>
                {checkoutStep === 'SHIP_INFO' && (
                  <button onClick={() => setCheckoutStep('AUTH_CHOICE')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors underline underline-offset-4">
                    ← Volver a las opciones
                  </button>
                )}
                {(checkoutStep === 'SHIPPING' || checkoutStep === 'PAYMENT') && (
                  <button onClick={() => setCheckoutStep('SHIP_INFO')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors underline underline-offset-4">Editar</button>
                )}
              </div>

              {(checkoutStep === 'SHIP_INFO' || (checkoutStep !== 'AUTH_CHOICE' && checkoutStep !== 'SHIP_INFO' && false)) && (
                <AnimatePresence mode="wait">
                  {user ? (
                    /* LOGGED IN FLOW */
                    <motion.div key="logged-in" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
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

                        {user.addresses.length < 3 ? (
                          <button
                            onClick={() => {
                              setIsAddingAddress(true);
                              setNewAddressFormData(prev => ({
                                ...prev,
                                firstName: user?.firstName || '',
                                lastName: user?.lastName || '',
                                phone: user?.phone?.replace('+57', '') || ''
                              }));
                            }}
                            className="p-6 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all"
                          >
                            <Plus size={20} />
                            <Typography variant="h4" className="text-[10px] uppercase font-black tracking-widest">Agregar Nueva Dirección</Typography>
                          </button>
                        ) : (
                          <div className="p-6 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-2 text-slate-300 cursor-not-allowed">
                            <Lock size={20} className="opacity-50" />
                            <Typography variant="h4" className="text-[10px] uppercase font-black tracking-widest text-center">Límite de 3 direcciones alcanzado</Typography>
                          </div>
                        )}
                      </div>

                      <AnimatePresence>
                        {isAddingAddress && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-slate-50 p-8 border border-slate-900 space-y-8"
                          >
                            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                              <Typography variant="h4" className="text-sm font-black uppercase tracking-widest">Nueva Dirección de Entrega</Typography>
                              <button onClick={() => setIsAddingAddress(false)} className="text-slate-400 hover:text-slate-900">
                                <Plus className="rotate-45" size={20} />
                              </button>
                            </div>

                            {localError && (
                              <div className="bg-red-50 text-red-600 p-4 border-l-4 border-red-500 rounded text-[10px] font-bold uppercase tracking-widest">
                                {localError}
                              </div>
                            )}

                            <form onSubmit={handleSaveNewAddress} className="space-y-8">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                  <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Etiqueta (Ej: Casa, Oficina) *</Typography>
                                  <input type="text" className="pro-input" required value={newAddressFormData.label} onChange={(e) => setNewAddressFormData({ ...newAddressFormData, label: e.target.value })} placeholder="Casa" />
                                </div>
                                <div className="space-y-2">
                                  <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Nombres *</Typography>
                                  <input type="text" className="pro-input" required value={newAddressFormData.firstName} onChange={(e) => setNewAddressFormData({ ...newAddressFormData, firstName: formatNameInput(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                  <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Apellidos *</Typography>
                                  <input type="text" className="pro-input" required value={newAddressFormData.lastName} onChange={(e) => setNewAddressFormData({ ...newAddressFormData, lastName: formatNameInput(e.target.value) })} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                  <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Teléfono Móvil *</Typography>
                                  <div className="flex flex-col md:flex-row gap-0">
                                    <div className="w-full md:w-32"><CountryCodeSelect value={countryCode} onChange={setCountryCode} /></div>
                                    <input type="text" className="pro-input flex-1" required value={newAddressFormData.phone} onChange={(e) => setNewAddressFormData({ ...newAddressFormData, phone: formatPhoneInput(e.target.value) })} placeholder="300 000 0000" />
                                  </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                  <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Dirección de Entrega *</Typography>
                                  <input type="text" className="pro-input" required value={newAddressFormData.street} onChange={(e) => setNewAddressFormData({ ...newAddressFormData, street: e.target.value })} placeholder="Calle 123 #45-67" />
                                </div>
                                <ColombiaLocationSelect
                                  departamento={newAddressFormData.province}
                                  ciudad={newAddressFormData.city}
                                  onDepartamentoChange={(val) => setNewAddressFormData(prev => ({ ...prev, province: val }))}
                                  onCiudadChange={(val) => setNewAddressFormData(prev => ({ ...prev, city: val }))}
                                />
                                <div className="space-y-2 md:col-span-2">
                                  <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Código Postal (opcional)</Typography>
                                  <input type="text" className="pro-input" value={newAddressFormData.postalCode} onChange={(e) => setNewAddressFormData(prev => ({ ...prev, postalCode: e.target.value }))} placeholder="(Opcional)" />
                                </div>
                              </div>

                              <div className="flex flex-col md:flex-row gap-4 pt-4">
                                <Button type="submit" label={isUpdatingCart ? "Guardando..." : "Guardar Dirección"} className="flex-1 py-5" disabled={isUpdatingCart || !isNewAddressValid} />
                                <button type="button" onClick={() => setIsAddingAddress(false)} className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 border border-slate-200 hover:border-slate-900 transition-all">Cancelar</button>
                              </div>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {!isAddingAddress && (
                        <Button
                          label={isUpdatingCart ? "Sincronizando..." : "Continuar al Pago"}
                          onClick={handleLoggedContinue}
                          className="w-full py-5"
                          disabled={isUpdatingCart}
                        />
                      )}
                    </motion.div>
                  ) : (
                    /* GUEST FLOW (Step-by-step Fast Signup) */
                    <motion.div key="guest" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
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
                          <Button type="submit" label={isUserLoading ? "Iniciando..." : "Verificar Correo y Continuar"} className="w-full py-5" disabled={isUserLoading} />
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
                            <Button type="submit" label={isUserLoading ? "Verificando..." : "Validar Código"} className="w-full py-5" disabled={isUserLoading} />
                            <button type="button" onClick={() => setGuestStep(1)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Volver al correo</button>
                          </div>
                        </form>
                      )}

                      {guestStep === 3 && (
                        <form onSubmit={handleGuestStep3} className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
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
                            <Button type="submit" label={isUpdatingCart ? "Creando Cuenta..." : "Registrar y Continuar al Pago"} className="w-full py-5" disabled={isUserLoading || isUpdatingCart || !isGuestFormValid} />
                          </div>
                        </form>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>

            {/* Step 2: Shipping Method */}
            <div className={`bg-white border ${checkoutStep === 'SHIPPING' ? 'border-slate-900' : 'border-slate-200'} p-8 sm:p-12 space-y-12 shadow-sm transition-all ${(checkoutStep === 'SHIP_INFO' || checkoutStep === 'AUTH_CHOICE') ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${checkoutStep === 'SHIPPING' ? 'bg-slate-900' : 'bg-slate-200'} text-white flex items-center justify-center font-black`}>3</div>
                  <Typography variant="h3" className="text-2xl uppercase font-black tracking-tighter">Método de Envío</Typography>
                </div>
                {checkoutStep === 'PAYMENT' && (
                  <button onClick={() => setCheckoutStep('SHIPPING')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors underline underline-offset-4">Editar</button>
                )}
              </div>

              {checkoutStep === 'SHIPPING' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                  <div className="grid grid-cols-1 gap-4">
                    {shippingOptions.length > 0 ? (
                      shippingOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedShippingOptionId(option.id)}
                          className={`p-6 border-2 text-left transition-all space-y-2 group ${selectedShippingOptionId === option.id ? 'border-slate-900 bg-slate-50' : 'border-slate-100 hover:border-slate-300'}`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <Truck size={20} className={selectedShippingOptionId === option.id ? 'text-slate-900' : 'text-slate-400'} />
                              <Typography variant="h4" className="text-[12px] uppercase font-black tracking-widest">{option.name}</Typography>
                            </div>
                            <Typography variant="h4" className="text-sm font-black">${option.amount.toLocaleString()}</Typography>
                          </div>
                          <Typography variant="body" className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                            {option.price_type === 'flat_rate' ? 'Tarifa Plana' : 'Cálculo Variable'}
                          </Typography>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Typography variant="body" className="text-slate-400 italic">No hay opciones de envío disponibles para esta ubicación.</Typography>
                      </div>
                    )}
                  </div>

                  <Button
                    label={isUpdatingCart ? "Procesando..." : "Continuar al Pago"}
                    onClick={handleShippingContinue}
                    className="w-full py-5"
                    disabled={isUpdatingCart || !selectedShippingOptionId}
                  />
                </div>
              )}
            </div>

            {/* Step 3: Payment Method */}
            <div className={`bg-white border ${checkoutStep === 'PAYMENT' ? 'border-slate-900' : 'border-slate-200'} p-8 sm:p-12 space-y-12 shadow-sm transition-all ${checkoutStep !== 'PAYMENT' ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <div className={`w-10 h-10 ${checkoutStep === 'PAYMENT' ? 'bg-slate-900' : 'bg-slate-200'} text-white flex items-center justify-center font-black`}>4</div>
                <Typography variant="h3" className="text-2xl uppercase font-black tracking-tighter">Método de Pago</Typography>
              </div>

              {checkoutStep === 'PAYMENT' && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-2xl">
                  <div className={`p-10 border-2 transition-all flex flex-col gap-8 text-left bg-slate-50/50 rounded-xl ${selectedPaymentProviderId && selectedPaymentProviderId.includes('wompi') ? 'border-slate-900 ring-4 ring-slate-900/5' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                        <CreditCard size={32} />
                      </div>
                      <div className="space-y-2">
                        <Typography variant="h4" className="text-sm font-black uppercase tracking-widest text-slate-800">Checkout Seguro con Wompi</Typography>
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={14} className="text-emerald-500" />
                          <Typography variant="detail" className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Transacciones Encriptadas y Protegidas</Typography>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-200 w-full">
                      <WompiSubmitButton
                        paymentSessionData={
                          paymentCollection?.payment_sessions?.find((s: any) => s.provider_id.includes('wompi'))?.data ||
                          paymentCollection?.payment_sessions?.[0]?.data
                        }
                        onPaymentSuccess={handleWompiSuccess}
                        disabled={checkoutStep !== 'PAYMENT' || isUpdatingCart}
                      />
                    </div>
                  </div>
                </div>
              )}
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
                  <Typography variant="h4" className="font-bold text-emerald-400 italic">
                    {selectedShippingOptionId
                      ? `$${selectedShippingAmount.toLocaleString()}`
                      : 'Calculando...'}
                  </Typography>
                </div>
                <div className="pt-8 border-t border-white/20 flex justify-between items-end">
                  <Typography variant="h4" className="text-sm font-black uppercase tracking-widest">Total a Pagar</Typography>
                  <Typography variant="h1" className="text-5xl font-black tracking-tighter">
                    ${(totalAmount + selectedShippingAmount).toLocaleString()}
                  </Typography>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 bg-white/5 py-6 px-4 rounded-sm border border-white/10 group hover:border-emerald-500/50 transition-colors">
                  <div className="flex flex-col items-center gap-2">
                    <ShieldCheck size={24} className="text-emerald-400" />
                    <Typography variant="detail" className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Pago 100% Seguro</Typography>
                  </div>
                  <div className="w-px h-10 bg-white/10 mx-2"></div>
                  <div className="text-[8px] text-white/40 uppercase font-bold leading-relaxed">
                    Utilice el botón de pago a la izquierda para completar su pedido a través de Wompi.
                  </div>
                </div>

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

