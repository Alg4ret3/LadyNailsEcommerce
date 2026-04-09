import React from 'react';
import { Typography } from '@/components/atoms/Typography';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { StepHeader } from './StepHeader';
import { WompiSubmitButton } from '@/components/molecules/WompiSubmitButton';
import { CheckoutStep } from '../hooks/useCheckoutFlow';

interface PaymentMethodSectionProps {
  checkoutStep: CheckoutStep;
  isRegisterPath: boolean;
  selectedPaymentProviderId: string | null;
  paymentCollection: any;
  handleWompiSuccess: () => void;
  isUpdatingCart: boolean;
}

export const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  checkoutStep,
  isRegisterPath,
  selectedPaymentProviderId,
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
                disabled={isUpdatingCart}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
