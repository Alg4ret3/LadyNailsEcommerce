'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
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
  /** Base URL of the current site, used to build the Wompi redirectUrl */
  siteUrl?: string;
}

export function WompiSubmitButton({ paymentSessionData, onPaymentSuccess, disabled, siteUrl }: Props) {
  const pathname = usePathname();
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
    console.log("WompiSubmitButton: handlePay triggered");
    console.log("paymentSessionData:", paymentSessionData);

    if (!window.WidgetCheckout) {
      alert("El widget de Wompi está cargando...");
      return;
    }
    
    if (!paymentSessionData) {
      alert("No se pudo iniciar la sesión de pago segura. Refresque la página.");
      return;
    }
    
    // Build the redirect URL so PSE/Nequi/Bancolombia come back here
    const baseUrl = siteUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    const redirectUrl = `${baseUrl}${pathname}`;
    console.log("Wompi redirectUrl configured as:", redirectUrl);

    const checkoutOptions: any = {
      currency: paymentSessionData.currency,
      amountInCents: paymentSessionData.amount_in_cents,
      reference: paymentSessionData.reference,
      publicKey: paymentSessionData.public_key,
      signature: { integrity: paymentSessionData.signature },
    };

    // Only include redirectUrl dynamically if we are not on localhost.
    // Wompi returns a 403 Forbidden if the dynamic redirectUrl domain doesn't match
    // the whitelisted domain in the Wompi Merchant Console.
    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    if (!isLocalhost) {
      checkoutOptions.redirectUrl = redirectUrl;
      console.log("Adding dynamic redirectUrl to options:", redirectUrl);
    } else {
      console.log("Localhost detected: omitting dynamic redirectUrl to prevent Wompi 403 whitelist errors.");
      console.log("To test redirects locally, configure 'http://localhost:3000/checkout' as the redirection URL directly in the Wompi Sandbox Console.");
    }

    const checkout = new window.WidgetCheckout(checkoutOptions);

    checkout.open((result: any) => {
      const transaction = result.transaction;
      // #region agent log
      fetch('http://127.0.0.1:7391/ingest/f342cf71-3ac6-446c-ab83-55df48bac7de',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'95c955'},body:JSON.stringify({sessionId:'95c955',location:'WompiSubmitButton.tsx:widgetCallback',message:'Widget checkout callback',data:{status:transaction?.status,redirectUrl:checkoutOptions.redirectUrl||null},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      if (transaction.status === 'APPROVED') {
        // Widget modal payment (credit/debit card) succeeded immediately
        onPaymentSuccess();
      } else if (transaction.status === 'PENDING') {
        // Redirect-based payment (PSE, Nequi) — the page will reload via redirectUrl
        // Nothing to do here; useCheckoutFlow will handle it on mount
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

