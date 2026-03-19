'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  slug: string;
  tags: string[];
  vendor?: string;
  selectedSize?: string;
  selectedColor?: string;
  category?: string;
}

import { Toast } from '@/components/atoms/Toast';
import { createCart } from '@/services/medusa';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  toast: { message: string, isOpen: boolean };
  hideToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', isOpen: false });

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    const hydrate = () => {
      const savedCart = localStorage.getItem('ladynail-cart');
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed)) setCartItems(parsed);
        } catch (e) {
          console.error('Failed to parse cart', e);
        }
      }
    };
    hydrate();
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('ladynail-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (message: string) => {
    setToast({ message, isOpen: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isOpen: false }));
  };

  const addToCart = async (item: CartItem) => {
    try {
      // Create Medusa cart if not exists
      let cartId = localStorage.getItem('medusa_cart_id');
      if (!cartId) {
        const data = await createCart();
        cartId = data.cart.id;
        localStorage.setItem('medusa_cart_id', cartId);
      }

      setCartItems(prev => {
        const existing = prev.find(i => i.id === item.id && i.size === item.size && i.color === item.color);
        if (existing) {
          return prev.map(i => i === existing ? { ...i, quantity: i.quantity + item.quantity } : i);
        }
        return [...prev, item];
      });
      showToast(`${item.name} añadido al carrito.`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('Error al añadir producto al carrito en Medusa.');
    }
  };

  const removeFromCart = (id: string, size?: string) => {
    const item = cartItems.find(i => i.id === id && i.size === size);
    setCartItems(prev => prev.filter(i => !(i.id === id && i.size === size)));
    if (item) showToast(`${item.name} eliminado del carrito.`);
  };

  const updateQuantity = (id: string, quantity: number, size?: string) => {
    setCartItems(prev => prev.map(i => (i.id === id && i.size === size) ? { ...i, quantity: Math.max(1, quantity) } : i));
  };

  const clearCart = () => {
    setCartItems([]);
    showToast('Carrito vaciado.');
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalAmount,
      isCartOpen,
      setIsCartOpen,
      toast,
      hideToast
    }}>
      {children}
      <Toast 
        message={toast.message} 
        isOpen={toast.isOpen} 
        onClose={hideToast} 
      />
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
