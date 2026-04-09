'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import { useCartQuery } from '@/hooks/useCart';
import { useCustomerAddresses } from '@/hooks/useCurrentUser';
import { getShippingOptions, ShippingOption, PaymentCollection } from '@/services/medusa';
import { validatePassword, validateName, validatePhone } from '@/utils/validations';

export type CheckoutStep = 'AUTH_CHOICE' | 'EMAIL_VERIFY' | 'SHIP_INFO' | 'SHIPPING' | 'PAYMENT';
export type AuthMode = 'choice' | 'login' | 'register';

export function useCheckoutFlow() {
  const router = useRouter();
  const { cartItems, totalItems, totalAmount, clearCart } = useCart();
  const { user, login, logout, sendOtp, verifyOtp, register, isLoading: isUserLoading, error: contextError, clearError } = useUser();

  const {
    updateAddress: updateCartAddressMutation,
    addShippingMethod: addShippingMethodMutation,
    createPaymentCollection: createPaymentCollectionMutation,
    createPaymentSession: createPaymentSessionMutation,
    completeCart: completeCartMutation,
    ensureCart
  } = useCartQuery();

  const { createAddress: createCustomerAddressMutation } = useCustomerAddresses();

  const [checkoutStep, setCheckoutStep] = React.useState<CheckoutStep>('AUTH_CHOICE');
  const [selectedAddressId, setSelectedAddressId] = React.useState<string | null>(null);
  const [shippingOptions, setShippingOptions] = React.useState<ShippingOption[]>([]);
  const [selectedShippingOptionId, setSelectedShippingOptionId] = React.useState<string | null>(null);
  const [paymentCollection, setPaymentCollection] = React.useState<PaymentCollection | null>(null);
  const [selectedPaymentProviderId, setSelectedPaymentProviderId] = React.useState<string | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = React.useState(false);
  const [isUpdatingCart, setIsUpdatingCart] = React.useState(false);
  const [isAddingAddress, setIsAddingAddress] = React.useState(false);
  const [hasSkippedAuth, setHasSkippedAuth] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<AuthMode>('choice');
  const [checkoutAuthPath, setCheckoutAuthPath] = React.useState<'login' | 'register' | null>(null);
  const [loginEmail, setLoginEmail] = React.useState('');
  const [loginPassword, setLoginPassword] = React.useState('');
  const [showLoginPassword, setShowLoginPassword] = React.useState(false);
  const [localError, setLocalError] = React.useState('');

  const [guestStep, setGuestStep] = React.useState(1);
  const [email, setEmail] = React.useState('');
  const [otpCode, setOtpCode] = React.useState('');
  const [countryCode, setCountryCode] = React.useState('+57');
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

  const selectedShippingAmount = React.useMemo(() => {
    const option = shippingOptions.find(o => o.id === selectedShippingOptionId);
    return option ? option.amount : 0;
  }, [shippingOptions, selectedShippingOptionId]);

  const isPasswordValid = React.useMemo(() => validatePassword(guestFormData.password), [guestFormData.password]);
  const passwordsMatch = guestFormData.password !== '' && guestFormData.password === guestFormData.confirmPassword;

  const isGuestFormValid = React.useMemo(() => {
    return (
      validateName(guestFormData.firstName) &&
      validateName(guestFormData.lastName) &&
      validatePhone(guestFormData.phone) &&
      guestFormData.street.length >= 10 &&
      guestFormData.city.length > 2 &&
      isPasswordValid &&
      passwordsMatch
    );
  }, [guestFormData, isPasswordValid, passwordsMatch]);

  const isNewAddressValid = React.useMemo(() => {
    return (
      newAddressFormData.label.trim().length > 1 &&
      newAddressFormData.firstName.trim().length >= 2 &&
      newAddressFormData.lastName.trim().length >= 2 &&
      validatePhone(newAddressFormData.phone) &&
      newAddressFormData.street.trim().length >= 10 &&
      newAddressFormData.city.length > 2 &&
      newAddressFormData.province.length > 2
    );
  }, [newAddressFormData]);

  // Sync initial new address form when user loads
  React.useEffect(() => {
    if (user && !newAddressFormData.firstName) {
      setNewAddressFormData(prev => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone?.replace('+57', '') || ''
      }));
    }
  }, [user]);

  // Redirect if cart is empty
  React.useEffect(() => {
    if (cartItems.length === 0 && !isProcessingOrder) {
      router.push('/cart');
    }
  }, [cartItems.length, isProcessingOrder, router]);

  // Skip auth step if user is already logged in
  React.useEffect(() => {
    if (user && checkoutStep === 'AUTH_CHOICE' && !hasSkippedAuth) {
      setCheckoutStep('SHIP_INFO');
      setHasSkippedAuth(true);
    }
  }, [user, checkoutStep, hasSkippedAuth]);

  // Auto-select new address when added
  const [prevAddressesCount, setPrevAddressesCount] = React.useState(user?.addresses.length || 0);
  React.useEffect(() => {
    if (user && user.addresses.length > prevAddressesCount) {
      const newAddr = user.addresses[user.addresses.length - 1];
      if (newAddr) setSelectedAddressId(newAddr.id);
    }
    if (user) setPrevAddressesCount(user.addresses.length);
  }, [user?.addresses]);

  // Set default address
  React.useEffect(() => {
    if (user && user.addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [user, selectedAddressId]);

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
        setCheckoutStep('SHIP_INFO');
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

      await register({
        email,
        password: guestFormData.password,
        firstName: guestFormData.firstName,
        lastName: guestFormData.lastName,
        phone: `${countryCode}${guestFormData.phone}`
      });

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

        const { shipping_options } = await getShippingOptions(cartId);
        setShippingOptions(shipping_options);
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

          const { shipping_options } = await getShippingOptions(cartId);
          setShippingOptions(shipping_options);
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

        const wompiSession = new_collection?.payment_sessions?.find((s: any) => s.provider_id.includes('wompi'));
        const wompiProviderId = wompiSession?.provider_id || 'pp_wompi_wompi';

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
        clearCart();
        const orderId = response?.order?.id || (response?.type === 'order' ? response.order.id : null);
        router.push(`/checkout/confirmation${orderId ? `?order_id=${orderId}` : ''}`);
      } else {
        router.push('/checkout/confirmation');
      }
    } catch (err) {
      setLocalError('El pago en Wompi fue EXITOSO, pero hubo un error generando la orden final.');
      setIsProcessingOrder(false);
    }
  };

  return {
    // State
    checkoutStep, setCheckoutStep,
    authMode, setAuthMode,
    checkoutAuthPath, setCheckoutAuthPath,
    selectedAddressId, setSelectedAddressId,
    shippingOptions,
    selectedShippingOptionId, setSelectedShippingOptionId,
    paymentCollection,
    selectedPaymentProviderId,
    isProcessingOrder,
    isUpdatingCart,
    isAddingAddress, setIsAddingAddress,
    loginEmail, setLoginEmail,
    loginPassword, setLoginPassword,
    showLoginPassword, setShowLoginPassword,
    localError, setLocalError,
    guestStep, setGuestStep,
    email, setEmail,
    otpCode, setOtpCode,
    countryCode, setCountryCode,
    guestFormData, setGuestFormData,
    newAddressFormData, setNewAddressFormData,
    selectedShippingAmount,
    isGuestFormValid,
    isNewAddressValid,
    contextError,
    clearError,
    user,
    logout,
    isUserLoading,
    cartItems,
    totalItems,
    totalAmount,

    // Handlers
    handleLogin,
    handleGuestStep1,
    handleGuestStep2,
    handleGuestStep3,
    handleSaveNewAddress,
    handleLoggedContinue,
    handleShippingContinue,
    handlePaymentSelect,
    handleWompiSuccess
  };
}
