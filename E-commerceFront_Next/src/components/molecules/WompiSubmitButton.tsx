'use client';

import React, { useEffect } from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

declare global {
  interface Window {
    WidgetCheckout: any;
  }
}

interface Props {
  paymentSessionData: any;
  onPaymentSuccess: () => void;
  disabled?: boolean;
}

export function WompiSubmitButton({ paymentSessionData, onPaymentSuccess, disabled }: Props) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { 
      if (document.body.contains(script)) {
        document.body.removeChild(script); 
      }
    };
  }, []);

  const handlePay = () => {
    if (!window.WidgetCheckout) {
      alert("El widget de Wompi está cargando...");
      return;
    }
    
    if (!paymentSessionData) {
      alert("No se pudo iniciar la sesión de pago segura. Refresque la página.");
      return;
    }
    
    const checkout = new window.WidgetCheckout({
      currency: paymentSessionData.currency,
      amountInCents: paymentSessionData.amount_in_cents,
      reference: paymentSessionData.reference,
      publicKey: paymentSessionData.public_key,
      signature: { integrity: paymentSessionData.signature }
    });

    checkout.open((result: any) => {
      const transaction = result.transaction;
      if (transaction.status === 'APPROVED') {
        onPaymentSuccess();
      } else {
        alert("El pago no fue aprobado. Estado: " + transaction.status);
      }
    });
  };

  const isLoadingData = !paymentSessionData && !disabled;
  const isActuallyDisabled = disabled || (!paymentSessionData && !isLoadingData);

  return (
    <button
      onClick={handlePay}
      disabled={isActuallyDisabled || isLoadingData}
      className="wompi-pay-btn group relative w-full overflow-hidden px-6 sm:px-10 py-4 sm:py-6 font-black uppercase tracking-[0.3em] text-[10px] sm:text-[11px] transition-all duration-500 ease-out disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer bg-slate-900 text-white"
    >
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Animated underline effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-white/30 group-hover:w-1/2 transition-all duration-700 ease-in-out" />

      <span className="relative z-10 flex items-center justify-center gap-4">
        {isLoadingData ? (
          <>
            <span className="w-3 h-3 border border-white/20 border-t-white rounded-full animate-spin"></span>
            <span className="opacity-50">Sincronizando Pasarela...</span>
          </>
        ) : (
          <>
            <Lock size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:-translate-y-0.5" />
            <span className="group-hover:tracking-[0.4em] transition-all duration-700">Pagar con Wompi</span>
            <ShieldCheck size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-y-0.5" />
          </>
        )}
      </span>

      <style dangerouslySetInnerHTML={{ __html: `
        .wompi-pay-btn:not(:disabled):hover {
          background-color: #000;
          letter-spacing: 0.4em;
        }
        .wompi-pay-btn:not(:disabled):active {
          transform: scale(0.98);
        }
      `}} />
    </button>
  );
}

