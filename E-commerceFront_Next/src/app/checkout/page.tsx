'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Plus } from 'lucide-react';

// Hooks
import { useCheckoutFlow } from './hooks/useCheckoutFlow';

// Components
import { IdentificationSection } from './components/IdentificationSection';
import { EmailVerificationSection } from './components/EmailVerificationSection';
import { DeliveryAddressSection } from './components/DeliveryAddressSection';
import { ShippingMethodSection } from './components/ShippingMethodSection';
import { PaymentMethodSection } from './components/PaymentMethodSection';
import { OrderSummary } from './components/OrderSummary';
import { ProcessingOverlay } from './components/ProcessingOverlay';

export default function CheckoutPage() {
  const flow = useCheckoutFlow();
  const isRegisterPath = flow.checkoutAuthPath === 'register';

  return (
    <main className="min-h-screen bg-white relative">
      <Navbar />

      {flow.isProcessingOrder && <ProcessingOverlay />}

      <section className="pt-44 pb-24 px-6 max-w-[1400px] mx-auto">
        <Typography variant="h1" className="text-5xl mb-16 border-b-4 border-slate-900 pb-8 inline-block uppercase font-black">
          Finalizar Compra
        </Typography>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Flow Column */}
          <div className="lg:col-span-8 space-y-12">
            {(flow.contextError || flow.localError) && (
              <div className="bg-red-50 text-red-600 p-6 border-l-4 border-red-500 rounded-lg animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-500 text-white p-1 rounded-full">
                    <Plus className="rotate-45" size={12} />
                  </div>
                  <Typography variant="h4" className="text-xs font-black uppercase tracking-widest">
                    {flow.contextError || flow.localError}
                  </Typography>
                </div>
              </div>
            )}

            <IdentificationSection
              user={flow.user}
              checkoutStep={flow.checkoutStep}
              authMode={flow.authMode}
              setAuthMode={flow.setAuthMode}
              setCheckoutAuthPath={flow.setCheckoutAuthPath}
              setCheckoutStep={flow.setCheckoutStep}
              loginEmail={flow.loginEmail}
              setLoginEmail={flow.setLoginEmail}
              loginPassword={flow.loginPassword}
              setLoginPassword={flow.setLoginPassword}
              showLoginPassword={flow.showLoginPassword}
              setShowLoginPassword={flow.setShowLoginPassword}
              isUserLoading={flow.isUserLoading}
              handleLogin={flow.handleLogin}
              logout={flow.logout}
              email={flow.email}
            />

            {isRegisterPath && !flow.user && (
              <EmailVerificationSection
                checkoutStep={flow.checkoutStep}
                guestStep={flow.guestStep}
                email={flow.email}
                setEmail={flow.setEmail}
                otpCode={flow.otpCode}
                setOtpCode={flow.setOtpCode}
                isUserLoading={flow.isUserLoading}
                handleGuestStep1={flow.handleGuestStep1}
                handleGuestStep2={flow.handleGuestStep2}
                setCheckoutStep={flow.setCheckoutStep}
                setGuestStep={flow.setGuestStep}
              />
            )}

            <DeliveryAddressSection
              user={flow.user}
              checkoutStep={flow.checkoutStep}
              setCheckoutStep={flow.setCheckoutStep}
              selectedAddressId={flow.selectedAddressId}
              setSelectedAddressId={flow.setSelectedAddressId}
              isAddingAddress={flow.isAddingAddress}
              setIsAddingAddress={flow.setIsAddingAddress}
              newAddressFormData={flow.newAddressFormData}
              setNewAddressFormData={flow.setNewAddressFormData}
              guestFormData={flow.guestFormData}
              setGuestFormData={flow.setGuestFormData}
              countryCode={flow.countryCode}
              setCountryCode={flow.setCountryCode}
              isUpdatingCart={flow.isUpdatingCart}
              isUserLoading={flow.isUserLoading}
              isNewAddressValid={flow.isNewAddressValid}
              isGuestFormValid={flow.isGuestFormValid}
              handleSaveNewAddress={flow.handleSaveNewAddress}
              handleLoggedContinue={flow.handleLoggedContinue}
              handleGuestStep3={flow.handleGuestStep3}
              localError={flow.localError}
              setLocalError={flow.setLocalError}
            />

            <ShippingMethodSection
              checkoutStep={flow.checkoutStep}
              setCheckoutStep={flow.setCheckoutStep}
              shippingOptions={flow.shippingOptions}
              selectedShippingOptionId={flow.selectedShippingOptionId}
              setSelectedShippingOptionId={flow.setSelectedShippingOptionId}
              isUpdatingCart={flow.isUpdatingCart}
              handleShippingContinue={flow.handleShippingContinue}
              isRegisterPath={isRegisterPath}
            />

            <PaymentMethodSection
              checkoutStep={flow.checkoutStep}
              isRegisterPath={isRegisterPath}
              selectedPaymentProviderId={flow.selectedPaymentProviderId}
              paymentCollection={flow.paymentCollection}
              handleWompiSuccess={flow.handleWompiSuccess}
              isUpdatingCart={flow.isUpdatingCart}
            />
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4">
            <OrderSummary
              cartItems={flow.cartItems}
              totalItems={flow.totalItems}
              totalAmount={flow.totalAmount}
              selectedShippingOptionId={flow.selectedShippingOptionId}
              selectedShippingAmount={flow.selectedShippingAmount}
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
