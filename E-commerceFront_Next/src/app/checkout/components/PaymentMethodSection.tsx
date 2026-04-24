import React from 'react';
import { Typography } from '@/components/atoms/Typography';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { StepHeader } from './StepHeader';
import { WompiSubmitButton } from '@/components/molecules/WompiSubmitButton';
import { CheckoutStep } from '../hooks/useCheckoutFlow';

interface PaymentMethodSectionProps {
  checkoutStep: CheckoutStep;
  isRegisterPath: boolean;
  paymentCollection: any;
  handleWompiSuccess: () => void;
  isUpdatingCart: boolean;
}

export const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  checkoutStep,
  isRegisterPath,
  paymentCollection,
  handleWompiSuccess,
  isUpdatingCart
}) => {
  const isActive = checkoutStep === 'PAYMENT';
  const isLocked = checkoutStep !== 'PAYMENT';

  return (
    <div className={`bg-white border ${isActive ? 'border-slate-900 shadow-lg' : 'border-slate-200'} p-8 sm:p-12 space-y-12 shadow-sm transition-all ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}>
      <StepHeader
        number={isRegisterPath ? '5' : '4'}
        title="Método de Pago"
        isActive={isActive}
        isCompleted={false}
      />

      {isActive && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 w-full max-w-3xl">
          <div className="group relative overflow-hidden">
            <div className={`p-6 sm:p-12 transition-all flex flex-col gap-8 sm:gap-10 text-left bg-white`}>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 flex items-center justify-center text-white">
                      <CreditCard size={16} strokeWidth={1.5} />
                    </div>
                    <Typography variant="h4" className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">
                      Pasarela de Pago
                    </Typography>
                  </div>
                  
                  <div className="space-y-1">
                    <Typography variant="h3" className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-slate-900">
                      Checkout Seguro <span className="text-slate-300">Wompi</span>
                    </Typography>
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={12} className="text-slate-400" />
                      <Typography variant="detail" className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em]">
                        Transacciones Encriptadas y Protegidas por SSL
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* Decorative element or trust badge */}
                <div className="hidden sm:block opacity-10">
                  <ShieldCheck size={80} strokeWidth={0.5} />
                </div>
              </div>

              <div className="pt-10 border-t border-slate-100 w-full">
                <WompiSubmitButton
                  paymentSessionData={
                    paymentCollection?.payment_sessions?.find((s: any) => s.provider_id.includes('wompi'))?.data ||
                    paymentCollection?.payment_sessions?.[0]?.data
                  }
                  onPaymentSuccess={handleWompiSuccess}
                  disabled={isUpdatingCart}
                />
                
                <div className="mt-8 flex items-center justify-center gap-2 sm:gap-6 opacity-30 grayscale contrast-125 flex-nowrap whitespace-nowrap overflow-x-auto no-scrollbar px-4">
                   <span className="text-[7px] sm:text-[9px] font-black tracking-widest sm:tracking-[0.2em] uppercase text-slate-900 shrink-0">Nequi</span>
                   <div className="w-1 h-1 bg-slate-900 rounded-full shrink-0" />
                   <span className="text-[7px] sm:text-[9px] font-black tracking-widest sm:tracking-[0.2em] uppercase text-slate-900 shrink-0">Daviplata</span>
                   <div className="w-1 h-1 bg-slate-900 rounded-full shrink-0" />
                   <span className="text-[7px] sm:text-[9px] font-black tracking-widest sm:tracking-[0.2em] uppercase text-slate-900 shrink-0">PSE</span>
                   <div className="w-1 h-1 bg-slate-900 rounded-full shrink-0" />
                   <span className="text-[7px] sm:text-[9px] font-black tracking-widest sm:tracking-[0.2em] uppercase text-slate-900 shrink-0">Bancolombia</span>
                </div>
              </div>
            </div>
            
            {/* Minimalist corner accent */}
            <div className="absolute top-0 right-0 w-2 h-2 bg-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
      )}
    </div>
  );
};
