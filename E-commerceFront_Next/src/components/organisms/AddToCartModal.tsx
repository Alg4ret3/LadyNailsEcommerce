'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon as X, Plus, Minus } from '@/components/icons';
import { Typography } from '@/components/atoms/Typography';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
    tags: string[];
    vendor: string;
    description?: string;
    variants?: any[];
  };
}

export const AddToCartModal: React.FC<AddToCartModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // If the product has multiple variants, we want a quantity per variant
  // Initial state: a map of variantId to quantity
  const initialQuantities = product.variants && product.variants.length > 0
    ? Object.fromEntries(product.variants.map(v => [v.id, 0]))
    : { [product.id]: 1 };
    
  const [quantities, setQuantities] = useState<Record<string, number>>(initialQuantities);

  // Sync state if product changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      const initial = product.variants && product.variants.length > 0
        ? Object.fromEntries(product.variants.map(v => [v.id, 0]))
        : { [product.id]: 1 };
      setQuantities(initial);
    }
  }, [isOpen, product]);

  const updateVariantQuantity = (variantId: string, newQuantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [variantId]: Math.max(0, newQuantity)
    }));
  };

  const handleAddToCart = async () => {
    const totalItemsToAdd = Object.entries(quantities).filter(([_, qty]) => qty > 0);
    
    if (totalItemsToAdd.length === 0) {
      return;
    }

    setIsAdding(true);
    try {
      const addPromises = totalItemsToAdd.map(([variantId, qty]) => {
        const variant = product.variants?.find(v => v.id === variantId);
        
        return addToCart({
          id: variantId, 
          name: variant ? `${product.name} - ${variant.title}` : product.name,
          price: (variant?.prices?.[0]?.amount ?? product.price),
          image: product.image,
          quantity: qty,
          slug: product.slug,
          tags: product.tags,
          vendor: product.vendor,
          selectedSize: variant?.title,
          size: variant?.title,
          category: product.tags?.[0] || 'General' // Using first tag as category for now, or use a real field if exists
        });
      });

      await Promise.all(addPromises);
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
        setShowSuccess(false);
      }, 1500);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const hasVariants = product.variants && product.variants.length > 0;
  const totalQty = Object.values(quantities).reduce((acc, q) => acc + q, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-8 sm:p-10 w-full max-w-md max-h-[90vh] overflow-y-auto z-[101] border border-zinc-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] scrollbar-hide"
          >
            {/* Success Overlay */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[105] bg-white flex flex-col items-center justify-center p-8 text-center"
                >
                  <Typography variant="h3" className="text-[11px] font-black uppercase tracking-[0.4em] text-black">
                    AGREGADO CON ÉXITO
                  </Typography>
                  <div className="w-12 h-[1px] bg-black/10 mt-4" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-0.5">
                <Typography variant="detail" className="text-zinc-400 tracking-[0.2em] font-medium leading-none mb-1">CARRITO</Typography>
                <Typography variant="h2" className="text-xl sm:text-2xl font-black text-black tracking-tighter leading-none">
                  Añadir al Carrito
                </Typography>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center hover:bg-zinc-50 rounded-full transition-all duration-300"
              >
                <X size={16} className="text-black" />
              </button>
            </div>

            {/* Product Info */}
            <div className="mb-8 flex gap-5 items-center">
              <div className="relative w-20 h-20 bg-zinc-50 rounded-2xl overflow-hidden flex-shrink-0 border border-zinc-100">
                <Image src={product.image} alt={product.name} fill className="object-contain p-2" />
              </div>
              <div className="flex flex-col gap-0.5">
                <Typography variant="detail" className="text-zinc-400 tracking-wider overflow-visible">{product.vendor}</Typography>
                <Typography variant="body" className="text-[13px] font-bold text-black leading-tight">
                  {product.name}
                </Typography>
                <Typography variant="body" className="text-base font-black text-black tracking-tighter">
                  ${product.price.toLocaleString()}
                </Typography>
              </div>
            </div>

            {/* List of Variants or Single Quantity */}
            <div className="mb-10">
              <Typography variant="small" className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-6 block">
                {hasVariants ? 'Selecciona Variantes' : 'Cantidad'}
              </Typography>

              {hasVariants ? (
                <div className="space-y-4">
                  {product.variants!.map((variant) => {
                    const stockQuantity = variant?.inventory_items?.[0]?.inventory?.location_levels?.[0]?.available_quantity ?? 0;
                    const isOutOfStock = stockQuantity <= 0;
                    const quantity = quantities[variant.id] || 0;

                    return (
                      <div key={variant.id} className={`flex items-center justify-between py-4 border-b border-zinc-50 transition-all duration-300 ${quantity > 0 ? 'bg-zinc-50/50 -mx-4 px-4 rounded-2xl border-transparent' : ''}`}>
                        <div className="flex flex-col">
                          <span className={`text-xs font-black tracking-widest uppercase transition-colors ${quantity > 0 ? 'text-black' : 'text-zinc-500'}`}>{variant.title}</span>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5 tracking-widest">${(variant.prices?.[0]?.amount || product.price).toLocaleString()}</span>
                          {isOutOfStock ? (
                            <span className="text-[9px] text-red-400 font-bold uppercase mt-1 tracking-widest">Agotado</span>
                          ) : (
                            <span className="text-[9px] text-zinc-300 font-bold uppercase mt-1 tracking-widest">Stock: {stockQuantity}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 bg-white border border-zinc-100 p-1 shadow-sm">
                          <button
                            onClick={() => updateVariantQuantity(variant.id, quantity - 1)}
                            disabled={isOutOfStock || quantity <= 0}
                            className={`w-8 h-8 flex items-center justify-center hover:bg-zinc-50 transition-colors ${quantity <= 0 || isOutOfStock ? 'opacity-10 pointer-events-none' : ''}`}
                          >
                            <Minus size={12} className="text-black" />
                          </button>
                          <span className={`text-[11px] font-black min-w-[30px] text-center ${quantity > 0 ? 'text-black' : 'text-zinc-300'}`}>
                            {isOutOfStock ? 0 : quantity}
                          </span>
                          <button
                            onClick={() => updateVariantQuantity(variant.id, Math.min(stockQuantity, quantity + 1))}
                            disabled={isOutOfStock || quantity >= stockQuantity}
                            className={`w-8 h-8 flex items-center justify-center hover:bg-zinc-50 transition-colors ${isOutOfStock || quantity >= stockQuantity ? 'opacity-10 pointer-events-none' : ''}`}
                          >
                            <Plus size={12} className="text-black" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (() => {
                const stockQuantity = product.variants?.[0]?.inventory_items?.[0]?.inventory?.location_levels?.[0]?.available_quantity ?? 0;
                const isOutOfStock = stockQuantity <= 0;
                const quantity = quantities[product.id] || 1;

                return (
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-white border border-zinc-100 p-1.5 shadow-sm">
                      <button
                        onClick={() => updateVariantQuantity(product.id, quantity - 1)}
                        className={`w-10 h-10 flex items-center justify-center hover:bg-zinc-50 transition-colors ${quantity <= 1 || isOutOfStock ? 'opacity-10 pointer-events-none' : ''}`}
                        disabled={quantity <= 1 || isOutOfStock}
                      >
                        <Minus size={14} className="text-black" />
                      </button>
                      <span className={`text-lg font-black min-w-[40px] text-center ${isOutOfStock ? 'text-zinc-200' : 'text-black'}`}>
                        {isOutOfStock ? 0 : quantity}
                      </span>
                      <button
                        onClick={() => updateVariantQuantity(product.id, Math.min(stockQuantity, quantity + 1))}
                        className={`w-10 h-10 flex items-center justify-center hover:bg-zinc-50 transition-colors ${isOutOfStock || quantity >= stockQuantity ? 'opacity-10 pointer-events-none' : ''}`}
                        disabled={isOutOfStock || quantity >= stockQuantity}
                      >
                        <Plus size={14} className="text-black" />
                      </button>
                    </div>
                    {isOutOfStock ? (
                      <span className="text-[10px] text-red-400 font-bold uppercase tracking-[0.2em]">Agotado</span>
                    ) : (
                      <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-[0.2em]">Stock: {stockQuantity}</span>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Footer Summary */}
            <div className="mb-10 space-y-4 pt-6 border-t border-zinc-100">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-300 tracking-[0.2em] block leading-none">TOTAL UNIDADES</span>
                  <span className="text-xl font-black text-black leading-none">{totalQty} {totalQty === 1 ? 'PRODUCTO' : 'PRODUCTOS'}</span>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-300 tracking-[0.2em] block leading-none">SUBTOTAL</span>
                  <div className="text-2xl font-black text-black leading-none tracking-tighter">
                    ${Object.entries(quantities).reduce((acc, [vid, qty]) => {
                      const variant = product.variants?.find(v => v.id === vid);
                      const price = variant?.prices?.[0]?.amount ?? product.price;
                      return acc + (price * qty);
                    }, 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3.5 rounded-none text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-50 transition-all text-zinc-400 hover:text-black border border-transparent"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddToCart}
                disabled={isAdding || totalQty === 0}
                className="flex-[1.5] px-6 py-3.5 bg-black text-white rounded-none text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-900 transition-all font-black disabled:opacity-30 disabled:grayscale flex justify-center items-center gap-2 shadow-lg"
              >
                {isAdding ? 'PROCESANDO' : 'CONFIRMAR'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
