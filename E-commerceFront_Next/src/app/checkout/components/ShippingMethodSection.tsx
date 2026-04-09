import React from 'react';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Truck } from 'lucide-react';
import { StepHeader } from './StepHeader';
import { CheckoutStep } from '../hooks/useCheckoutFlow';

interface ShippingOption {
  id: string;
  name: string;
  amount: number;
  price_type: string;
}

interface ShippingMethodSectionProps {
  checkoutStep: CheckoutStep;
  setCheckoutStep: (step: CheckoutStep) => void;
  shippingOptions: ShippingOption[];
  selectedShippingOptionId: string | null;
  setSelectedShippingOptionId: (id: string | null) => void;
  isUpdatingCart: boolean;
  handleShippingContinue: () => void;
  isRegisterPath: boolean;
}

export const ShippingMethodSection: React.FC<ShippingMethodSectionProps> = ({
  checkoutStep,
  setCheckoutStep,
  shippingOptions,
  selectedShippingOptionId,
  setSelectedShippingOptionId,
  isUpdatingCart,
  handleShippingContinue,
  isRegisterPath
}) => {
  const isActive = checkoutStep === 'SHIPPING';
  const isCompleted = checkoutStep === 'PAYMENT';
  const isLocked = ['AUTH_CHOICE', 'EMAIL_VERIFY', 'SHIP_INFO'].includes(checkoutStep);

  return (
    <div className={`bg-white border ${isActive ? 'border-slate-900 shadow-lg' : 'border-slate-200'} p-8 sm:p-12 space-y-12 shadow-sm transition-all ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}>
      <StepHeader
        number={isRegisterPath ? '4' : '3'}
        title="Método de Envío"
        isActive={isActive}
        isCompleted={isCompleted}
        onEdit={() => setCheckoutStep('SHIPPING')}
      />

      {isActive && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="grid grid-cols-1 gap-4">
            {shippingOptions.length > 0 ? (
              shippingOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedShippingOptionId(option.id)}
                  className={`p-6 border-2 text-left transition-all space-y-2 group outline-none ${selectedShippingOptionId === option.id ? 'border-slate-900 bg-white ring-1 ring-slate-900/5' : 'border-slate-100 hover:border-slate-300'}`}
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
  );
};
