'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon as X, Minus, Plus, ShoppingBag, Trash2, Store, ChevronRight } from '@/components/icons';
import { useCart, CartItem } from '@/context/CartContext';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const CartDrawer: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, totalAmount, isCartOpen, setIsCartOpen } = useCart();
  const router = useRouter();
  const [showMinWarning, setShowMinWarning] = useState(false);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-xs sm:max-w-sm md:max-w-md bg-background shadow-[0_12px_24px_-4px_rgba(42,37,32,0.12)] z-60 flex flex-col font-sans"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 md:p-8 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
                <ShoppingBag size={16} strokeWidth={1.5} className="text-accent shrink-0 sm:size-5 md:size-5" />
                <Typography variant="h4" className="text-xs sm:text-sm md:text-base font-bold text-foreground truncate">Tu Carrito</Typography>
                <span className="text-[8px] sm:text-[9px] bg-muted text-foreground/60 px-1.5 sm:px-2 py-0.5 rounded-full font-bold shrink-0">
                  {cartItems.length}
                </span>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="hover:text-accent transition-colors shrink-0">
                <X size={18} strokeWidth={1} className="sm:size-6 md:size-6" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 no-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 opacity-30">
                  <ShoppingBag size={40} strokeWidth={0.5} />
                  <Typography variant="body" className="text-[10px] tracking-[0.2em] uppercase font-medium">Vacío</Typography>
                  <button onClick={() => setIsCartOpen(false)} className="text-[10px] underline underline-offset-4 uppercase tracking-widest mt-2">Explorar tienda</button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 sm:gap-6 group relative border-b border-black/[0.05] pb-8 last:border-0">
                    <div className="relative w-16 sm:w-20 aspect-square bg-[#F9F9F9] rounded-sm overflow-hidden shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-foreground/10">
                          <ShoppingBag size={20} strokeWidth={1} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-4">
                          <Typography variant="h4" className="text-[9px] font-medium text-foreground leading-snug line-clamp-2 uppercase tracking-wide">{item.name}</Typography>
                          <button 
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-foreground/20 hover:text-red-500 transition-colors"
                          >
                            <X size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                        
                        <div className="flex gap-3 items-center">
                          {item.inventoryQuantity !== undefined && item.inventoryQuantity <= 5 && item.inventoryQuantity > 0 && (
                             <span className="text-[8px] text-orange-400/70 uppercase tracking-tighter font-medium">Últimas {item.inventoryQuantity}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                              className="text-foreground/40 hover:text-foreground transition-colors p-1"
                            >
                              <Minus size={12} strokeWidth={1.5} />
                            </button>
                            <span className="text-[11px] font-medium w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                              className="text-foreground/40 hover:text-foreground transition-colors p-1"
                            >
                              <Plus size={12} strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                        <Typography variant="body" className="text-[10px] sm:text-[11px] font-semibold text-foreground tracking-tight">
                          ${(item.price * item.quantity).toLocaleString()}
                        </Typography>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-8 space-y-6 bg-white">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-t border-black/5 pt-6">
                    <span className="text-[10px] text-foreground/40 uppercase tracking-[0.2em] font-medium">Total</span>
                    <span className="text-xl font-light tracking-tighter text-foreground">${totalAmount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-30">
                    <div className="h-[1px] flex-1 bg-black/10" />
                    <span className="text-[8px] uppercase tracking-[0.3em]">Envío calculado al finalizar</span>
                    <div className="h-[1px] flex-1 bg-black/10" />
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      if (totalAmount < 200000) {
                        setShowMinWarning(true);
                        setTimeout(() => setShowMinWarning(false), 3500);
                        return;
                      }
                      setIsCartOpen(false);
                      router.push('/checkout');
                    }}
                    className="w-full bg-black text-white py-4 text-[10px] uppercase tracking-[0.25em] hover:bg-black/90 transition-all font-medium"
                  >
                    Finalizar Compra
                  </button>

                  <button 
                     onClick={() => setIsCartOpen(false)}
                     className="w-full text-[9px] uppercase tracking-[0.2em] text-foreground/40 hover:text-foreground transition-colors py-2"
                  >
                    Seguir comprando
                  </button>
                </div>

                {/* Minimum purchase warning */}
                <AnimatePresence>
                  {showMinWarning && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-[9px] text-red-500 font-medium uppercase tracking-widest text-center"
                    >
                      Mínimo de compra: $200.000 COP
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
