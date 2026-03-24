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
      className="wompi-pay-btn group relative w-full overflow-hidden rounded-xl px-8 py-5 font-black uppercase tracking-[0.15em] text-[12px] transition-all duration-300 ease-out disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer"
      style={{
        background: (isActuallyDisabled || isLoadingData)
          ? '#94a3b8'
          : 'linear-gradient(135deg, #059669 0%, #10b981 40%, #34d399 100%)',
        color: '#fff',
        boxShadow: (isActuallyDisabled || isLoadingData)
          ? 'none'
          : '0 8px 32px rgba(16, 185, 129, 0.35), 0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      {/* Shimmer effect */}
      {!isActuallyDisabled && !isLoadingData && (
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
            animation: 'wompi-shimmer 2.5s ease-in-out infinite',
          }}
        />
      )}

      <span className="relative z-10 flex items-center justify-center gap-3">
        {isLoadingData ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>Preparando Pago Seguro...</span>
          </>
        ) : (
          <>
            <Lock size={16} className="transition-transform duration-300 group-hover:scale-110" />
            <span>Pagar Seguro con Wompi</span>
            <ShieldCheck size={16} className="transition-transform duration-300 group-hover:scale-110" />
          </>
        )}
      </span>

      {/* Inline keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        .wompi-pay-btn:not(:disabled):hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 12px 40px rgba(16, 185, 129, 0.45), 0 4px 12px rgba(0,0,0,0.1);
        }
        .wompi-pay-btn:not(:disabled):active {
          transform: translateY(0) scale(0.99);
        }
        @keyframes wompi-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </button>
  );
}

