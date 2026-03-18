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
          size: variant?.title // For CartContext matching
        });
      });

      await Promise.all(addPromises);
      onClose();
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 w-full max-w-lg max-h-[90vh] overflow-y-auto z-[101] border border-border shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <Typography variant="h2" className="text-lg sm:text-x font-black text-foreground tracking-tighter">
                Añadir al Carrito
              </Typography>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X size={20} className="text-foreground/60" />
              </button>
            </div>

            {/* Product Info */}
            <div className="mb-6 pb-6 border-b border-border flex gap-4">
              <div className="relative w-20 h-20 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <Typography variant="h3" className="text-sm sm:text-base font-bold text-foreground">
                  {product.name}
                </Typography>
                <Typography variant="body" className="text-base font-black text-foreground">
                  Desde ${product.price.toLocaleString()}
                </Typography>
              </div>
            </div>

            {/* List of Variants or Single Quantity */}
            <div className="mb-8">
              <Typography variant="small" className="text-[10px] sm:text-[11px] font-bold text-foreground uppercase tracking-wider mb-4 block">
                {hasVariants ? 'Selecciona Cantidades por Variante' : 'Cantidad'}
              </Typography>

              {hasVariants ? (
                <div className="space-y-3">
                  {product.variants!.map((variant) => (
                    <div key={variant.id} className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground uppercase tracking-tight">{variant.title}</span>
                        <span className="text-[10px] text-foreground/50 tracking-wide">${(variant.prices?.[0]?.amount || product.price).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center border border-border rounded-lg bg-background">
                        <button
                          onClick={() => updateVariantQuantity(variant.id, quantities[variant.id] - 1)}
                          className={`px-2 py-1.5 hover:bg-muted transition-colors ${quantities[variant.id] === 0 ? 'opacity-20 pointer-events-none' : ''}`}
                        >
                          <Minus size={14} className="text-foreground" />
                        </button>
                        <span className="px-3 py-1.5 text-xs font-bold text-foreground min-w-[32px] text-center">
                          {quantities[variant.id]}
                        </span>
                        <button
                          onClick={() => updateVariantQuantity(variant.id, quantities[variant.id] + 1)}
                          className="px-2 py-1.5 hover:bg-muted transition-colors"
                        >
                          <Plus size={14} className="text-foreground" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center border border-border rounded-lg w-fit">
                  <button
                    onClick={() => updateVariantQuantity(product.id, quantities[product.id] - 1)}
                    className="px-3 py-2 sm:py-3 hover:bg-muted transition-colors"
                    disabled={quantities[product.id] <= 1}
                  >
                    <Minus size={16} className="text-foreground" />
                  </button>
                  <span className="px-4 py-2 sm:py-3 text-base font-bold text-foreground">
                    {quantities[product.id]}
                  </span>
                  <button
                    onClick={() => updateVariantQuantity(product.id, quantities[product.id] + 1)}
                    className="px-3 py-2 sm:py-3 hover:bg-muted transition-colors"
                  >
                    <Plus size={16} className="text-foreground" />
                  </button>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            <div className="mb-8 p-4 bg-muted/30 rounded-2xl flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-foreground/40 tracking-[0.2em]">Total Carrito</span>
                <span className="text-lg font-black text-foreground">{totalQty} {totalQty === 1 ? 'Producto' : 'Productos'}</span>
              </div>
              <div className="text-right">
                 <span className="text-[10px] uppercase font-bold text-foreground/40 tracking-[0.2em]">Subtotal</span>
                 <div className="text-lg font-black text-foreground">
                   ${Object.entries(quantities).reduce((acc, [vid, qty]) => {
                     const variant = product.variants?.find(v => v.id === vid);
                     const price = variant?.prices?.[0]?.amount ?? product.price;
                     return acc + (price * qty);
                   }, 0).toLocaleString()}
                 </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-4 border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddToCart}
                disabled={isAdding || totalQty === 0}
                className="flex-[2] px-4 py-4 bg-foreground text-background rounded-xl text-[10px] uppercase tracking-[0.2em] hover:opacity-90 transition-all font-black disabled:opacity-30 disabled:grayscale flex justify-center items-center gap-2"
              >
                {isAdding ? 'Añadiendo...' : 'Añadir al Carrito'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
