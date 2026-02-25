'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon as X, Minus, Plus, ShoppingBag, Trash2, Store, ChevronRight } from '@/components/icons';
import { useCart, CartItem } from '@/context/CartContext';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import Image from 'next/image';
import Link from 'next/link';

export const CartDrawer: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, totalAmount, isCartOpen, setIsCartOpen } = useCart();

  // Group items by vendor
  const groupedItems = cartItems.reduce((acc, item) => {
    const vendor = item.vendor || 'Varios';
    if (!acc[vendor]) acc[vendor] = [];
    acc[vendor].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  const vendors = Object.keys(groupedItems);

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

            {/* Items List - Grouped by Vendor */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8 sm:space-y-10 md:space-y-12 no-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 sm:gap-6 opacity-40">
                  <ShoppingBag size={36} strokeWidth={0.5} className="sm:size-12 md:size-12" />
                  <Typography variant="body" className="text-[10px] sm:text-xs md:text-sm tracking-widest uppercase font-bold">Tu bolsa está vacía</Typography>
                  <Button label="Empezar a comprar" onClick={() => setIsCartOpen(false)} variant="outline" className="px-4 sm:px-6 py-2 sm:py-3 rounded-full text-[9px] sm:text-xs" />
                </div>
              ) : (
                vendors.map((vendor) => (
                  <div key={vendor} className="space-y-4 sm:space-y-5 md:space-y-6">
                    <div className="flex items-center gap-1.5 sm:gap-2 border-b border-border pb-2">
                       <Store size={12} className="text-accent shrink-0 sm:size-3.5 md:size-3.5" />
                       <Typography variant="small" className="text-[7px] sm:text-[8px] md:text-[10px] font-extrabold uppercase tracking-widest text-foreground">{vendor}</Typography>
                    </div>
                    <div className="space-y-6 sm:space-y-7 md:space-y-8">
                      {groupedItems[vendor].map((item) => (
                        <div key={`${item.id}-${item.size}`} className="flex gap-3 sm:gap-4 md:gap-6 group">
                          <div className="relative w-14 sm:w-16 md:w-20 aspect-3/4 bg-muted rounded-lg sm:rounded-xl overflow-hidden border border-border shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                            <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                            <div className="flex justify-between items-start gap-1">
                              <div className="min-w-0">
                                <Typography variant="h4" className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-foreground mb-0.5 sm:mb-1 leading-tight line-clamp-2">{item.name}</Typography>
                                <div className="flex gap-1 sm:gap-1.5 items-center flex-wrap">
                                   <Typography variant="small" className="text-[7px] sm:text-[8px] md:text-[9px] text-foreground/40 bg-muted px-1 sm:px-1.5 rounded">Talla: {item.size || 'Unica'}</Typography>
                                </div>
                              </div>
                              <button 
                                onClick={() => removeFromCart(item.id, item.size)}
                                className="text-foreground/30 hover:text-accent transition-colors shrink-0"
                              >
                                <Trash2 size={12} strokeWidth={1.5} className="sm:size-3.5 md:size-3.5" />
                              </button>
                            </div>
                            
                            <div className="flex justify-between items-end gap-2">
                              <div className="flex items-center border border-border rounded-lg overflow-hidden bg-muted/50">
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                                  className="px-1.5 sm:px-2 py-1 hover:bg-background transition-colors"
                                >
                                  <Minus size={8} className="sm:size-2.5 md:size-2.5" />
                                </button>
                                <span className="w-5 sm:w-6 text-center text-[8px] sm:text-[9px] font-extrabold">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                                  className="px-1.5 sm:px-2 py-1 hover:bg-background transition-colors"
                                >
                                  <Plus size={8} className="sm:size-2.5 md:size-2.5" />
                                </button>
                              </div>
                              <Typography variant="body" className="text-[8px] sm:text-xs md:text-xs font-bold text-foreground shrink-0">
                                ${(item.price * item.quantity).toLocaleString()}
                              </Typography>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-4 sm:p-6 md:p-8 border-t border-border bg-muted/50 space-y-4 sm:space-y-5 md:space-y-6">
                <div className="flex justify-between items-end">
                  <Typography variant="small" className="text-foreground/40 font-bold uppercase tracking-widest text-[8px] sm:text-[9px]">Subtotal</Typography>
                  <Typography variant="h3" className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">${totalAmount.toLocaleString()}</Typography>
                </div>
                <Typography variant="body" className="text-[8px] sm:text-[9px] md:text-[10px] text-foreground/40 uppercase tracking-widest leading-relaxed font-medium">
                  Compra segura. Envío por cada tienda.
                </Typography>
                <Link href="/checkout" onClick={() => setIsCartOpen(false)} className="block">
                  <button className="w-full bg-foreground text-background py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-2">
                    Tramitar Pedido <ChevronRight size={12} className="sm:size-3.5 md:size-3.5" />
                  </button>
                </Link>
                <button 
                   onClick={() => setIsCartOpen(false)}
                   className="w-full text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors"
                >
                  Seguir Comprando
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
