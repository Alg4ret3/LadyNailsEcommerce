'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/atoms/Button';

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
    // Inyectar script de Widget Wompi en el DOM
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

  return (
    <Button
      label="Pagar Seguro con Wompi"
      disabled={disabled || !paymentSessionData}
      onClick={handlePay}
      className={`w-full py-5 text-[11px] font-black uppercase tracking-[0.2rem] transition-all bg-white text-slate-900 hover:bg-emerald-400 shadow-[0_10px_30px_rgba(52,211,153,0.3)]`}
    />
  );
}
