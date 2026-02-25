'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon as X, Plus, Minus } from '@/components/icons';
import { Typography } from '@/components/atoms/Typography';
import { useCart } from '@/context/CartContext';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
    category: string;
    vendor: string;
    sizes?: string[];
    color?: string;
    colors?: string[];
  };
}

export const AddToCartModal: React.FC<AddToCartModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'Único');
  const [selectedColor, setSelectedColor] = useState(product.color || product.colors?.[0] || 'Estándar');

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      slug: product.slug,
      category: product.category,
      vendor: product.vendor,
      size: selectedSize,
      color: selectedColor
    });
    onClose();
  };

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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 w-full max-w-md max-h-[90vh] overflow-y-auto z-[101] border border-border shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <Typography variant="h2" className="text-lg sm:text-xl md:text-2xl font-black text-foreground tracking-tighter">
                Opciones
              </Typography>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X size={20} className="text-foreground/60" />
              </button>
            </div>

            {/* Product Info */}
            <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-border">
              <Typography variant="h3" className="text-sm sm:text-base font-bold text-foreground mb-2">
                {product.name}
              </Typography>
              <Typography variant="body" className="text-lg sm:text-xl font-black text-foreground">
                ${product.price.toLocaleString()}
              </Typography>
            </div>

            {/* Talla */}
            {product.sizes && product.sizes.length > 1 && (
              <div className="mb-6 sm:mb-8">
                <Typography variant="small" className="text-[10px] sm:text-[11px] font-bold text-foreground uppercase tracking-wider mb-3">
                  Talla
                </Typography>
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 sm:py-3 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all ${
                        selectedSize === size
                          ? 'bg-accent text-background'
                          : 'bg-muted text-foreground/60 hover:bg-muted/80 border border-border'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color */}
            {(product.colors || product.color) && (
              <div className="mb-6 sm:mb-8">
                <Typography variant="small" className="text-[10px] sm:text-[11px] font-bold text-foreground uppercase tracking-wider mb-3">
                  Color
                </Typography>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {(product.colors || [product.color || 'Estándar']).map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all ${
                        selectedColor === color
                          ? 'bg-accent text-background'
                          : 'bg-muted text-foreground/60 hover:bg-muted/80 border border-border'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cantidad */}
            <div className="mb-8 sm:mb-10">
              <Typography variant="small" className="text-[10px] sm:text-[11px] font-bold text-foreground uppercase tracking-wider mb-3">
                Cantidad
              </Typography>
              <div className="flex items-center border border-border rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-muted transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} className="text-foreground" />
                </button>
                <span className="px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-bold text-foreground">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-muted transition-colors"
                >
                  <Plus size={16} className="text-foreground" />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 sm:py-4 border border-border rounded-lg text-[10px] sm:text-[11px] font-bold uppercase tracking-wider hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 px-4 py-3 sm:py-4 bg-foreground text-background rounded-lg text-[10px] sm:text-[11px] uppercase tracking-wider hover:opacity-90 transition-all font-black"
              >
                Mi Carrito
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
