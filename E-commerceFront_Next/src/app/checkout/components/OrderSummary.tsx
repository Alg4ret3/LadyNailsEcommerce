import React from 'react';
import { Typography } from '@/components/atoms/Typography';
import { ShieldCheck } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
  totalItems: number;
  totalAmount: number;
  selectedShippingOptionId: string | null;
  selectedShippingAmount: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  totalItems,
  totalAmount,
  selectedShippingOptionId,
  selectedShippingAmount,
}) => {
  return (
    <div className="sticky top-44 bg-slate-900 p-8 space-y-0 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <Typography variant="h4" className="text-[11px] font-black uppercase tracking-[0.25em] text-white">Resumen</Typography>
        <div className="px-2 py-1 bg-white/5 rounded-full">
          <Typography variant="detail" className="text-[9px] text-white/40 font-bold uppercase tracking-widest">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </Typography>
        </div>
      </div>

      {/* Items */}
      <div className="py-8 space-y-6 border-b border-white/10 max-h-[400px] overflow-y-auto custom-scrollbar">
        {cartItems.map((item) => (
          <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between items-start gap-6">
            <div className="flex-1 min-w-0 space-y-1">
              <Typography variant="h4" className="text-[12px] font-bold text-white tracking-tight leading-tight truncate">
                {item.name}
              </Typography>
              <div className="flex items-center gap-2">
                <Typography variant="detail" className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                  {item.quantity} × ${item.price.toLocaleString()}
                </Typography>
                {item.size && (
                  <>
                    <div className="w-1 h-1 rounded-full bg-white/10"></div>
                    <Typography variant="detail" className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                      {item.size}
                    </Typography>
                  </>
                )}
              </div>
            </div>
            <Typography variant="detail" className="text-[12px] font-black text-white shrink-0 mt-0.5">
              ${(item.price * item.quantity).toLocaleString()}
            </Typography>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="py-8 space-y-4 border-b border-white/5">
        <div className="flex justify-between items-center">
          <Typography variant="detail" className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Subtotal Bruto</Typography>
          <Typography variant="detail" className="text-[13px] font-bold text-white/80 tracking-tight">${totalAmount.toLocaleString()}</Typography>
        </div>

        <div className="flex justify-between">
          <Typography variant="detail" className="text-[10px] font-black text-white/40 uppercase tracking-widest">Logística & Despacho</Typography>
          <Typography variant="h4" className="font-bold text-emerald-400 italic">
            {selectedShippingOptionId
              ? `$${selectedShippingAmount.toLocaleString()}`
              : 'Calculando...'}
          </Typography>
        </div>
      </div>

      {/* Total */}
      <div className="pt-6 flex justify-between items-center">
        <Typography variant="h4" className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30">Total</Typography>
        <div className="flex flex-col items-end">
          <Typography variant="h1" className="text-4xl font-black tracking-tighter text-white">
            ${(totalAmount + selectedShippingAmount).toLocaleString()}
          </Typography>
          <Typography variant="detail" className="text-[9px] text-white/20 font-medium uppercase tracking-widest mt-1">IVA Incluido</Typography>
        </div>
      </div>

      {/* Security footnote */}
      <div className="pt-10 flex items-center justify-center gap-4 border-t border-white/5 mt-8">
        <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity duration-300">
          <ShieldCheck size={14} className="text-white" />
          <Typography variant="detail" className="text-[9px] font-bold text-white uppercase tracking-widest">Pago Seguro</Typography>
        </div>
        <div className="w-1 h-1 rounded-full bg-white/10"></div>
        <div className="opacity-40 hover:opacity-100 transition-opacity duration-300">
          <Typography variant="detail" className="text-[9px] font-bold text-white uppercase tracking-widest">AES-256 bits</Typography>
        </div>
      </div>
    </div>
  );
};
