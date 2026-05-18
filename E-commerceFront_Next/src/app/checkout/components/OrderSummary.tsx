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
    <div className="bg-black p-8 lg:p-10 shadow-sm overflow-hidden group border border-white/5 sticky top-32">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-8 border-b border-white/10">
        <Typography variant="h3" className="text-xs font-black uppercase tracking-[0.2em] text-white">
          Resumen de Compra
        </Typography>
        <Typography variant="detail" className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </Typography>
      </div>

      {/* Product Items Summary Scrollable */}
      <div className="space-y-4 mb-8 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
        {cartItems.map((item) => (
          <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between items-start gap-4">
             <div className="flex-1 min-w-0">
               <Typography variant="h4" className="text-[10px] font-bold text-white tracking-tight leading-tight truncate">
                 {item.name}
               </Typography>
               <Typography variant="detail" className="text-[9px] text-gray-400 font-medium uppercase tracking-widest block mt-0.5">
                  {item.quantity} × ${item.price.toLocaleString()}
               </Typography>
             </div>
             <Typography variant="detail" className="text-[10px] font-black text-white shrink-0">
               ${(item.price * item.quantity).toLocaleString()}
             </Typography>
          </div>
        ))}
      </div>

      <div className="space-y-4 relative z-10 border-t border-white/10 pt-6">
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-gray-300 uppercase tracking-widest text-[9px] font-black">Subtotal</span>
          <span className="font-black text-white">${totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm font-medium">
           <span className="text-gray-300 uppercase tracking-widest text-[9px] font-black">Logística y Despacho</span>
           <span className={`text-[9px] font-black uppercase tracking-widest ${selectedShippingOptionId ? 'text-white' : 'text-gray-500'}`}>
              {selectedShippingOptionId ? `$${selectedShippingAmount.toLocaleString()}` : 'Calculado en destino'}
           </span>
        </div>
        <div className="flex justify-between items-center text-[9px] font-medium text-gray-300">
           <span className="uppercase tracking-widest font-black">Impuestos (IVA 19%)</span>
           <span className="font-bold text-gray-300">Incluido en Precio</span>
        </div>
        
        {/* Total a Pagar */}
        <div className="pt-6 mt-4 border-t border-white/10">
          <div className="flex flex-col items-end gap-1.5 mb-2">
            <Typography variant="detail" className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.2em] block">Total a Pagar</Typography>
            <Typography variant="h3" className="text-4xl lg:text-5xl font-black leading-none text-white">
               ${(totalAmount + selectedShippingAmount).toLocaleString()}
            </Typography>
          </div>
        </div>
      </div>

      {/* Distribution Perks */}
      <div className="pt-8 mt-6 border-t border-white/10 grid grid-cols-2 gap-6 relative z-10">
        <div className="space-y-1.5">
           <Typography variant="detail" className="text-gray-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
             <ShieldCheck size={10} />
             Seguridad
           </Typography>
           <Typography variant="body" className="text-[9px] text-white/50 leading-relaxed font-medium tracking-wide">Transacciones garantizadas con SSL 256-bit.</Typography>
        </div>
        <div className="space-y-1.5">
           <Typography variant="detail" className="text-gray-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
             <ShieldCheck size={10} />
             Garantía
           </Typography>
           <Typography variant="body" className="text-[9px] text-white/50 leading-relaxed font-medium tracking-wide">Distribuidores oficiales autorizados.</Typography>
        </div>
      </div>
    </div>
  );
};
