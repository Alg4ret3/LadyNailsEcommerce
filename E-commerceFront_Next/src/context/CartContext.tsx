'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';

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
import { useUser } from '@/context/UserContext';
import { getCartIdKey, getCartItemsKey, migrateLegacyCartKeys } from '@/utils/cartKeys';

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
  medusaCartId: string | null;
  ensureCart: () => Promise<string>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Merge guest items into user items.
 * If the same product+size+color exists, sum quantities.
 * Otherwise, append the guest item.
 */
function mergeCartItems(userItems: CartItem[], guestItems: CartItem[]): CartItem[] {
  const merged = [...userItems];

  for (const guestItem of guestItems) {
    const existing = merged.find(
      i => i.id === guestItem.id && i.size === guestItem.size && i.color === guestItem.color
    );
    if (existing) {
      existing.quantity += guestItem.quantity;
    } else {
      merged.push({ ...guestItem });
    }
  }

  return merged;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const userId = user?.id ?? null;

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [medusaCartId, setMedusaCartId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', isOpen: false });

  // Track previous userId to detect login/logout transitions
  const prevUserIdRef = useRef<string | null | undefined>(undefined);
  const isInitializedRef = useRef(false);

  // ── Helper: read cart data from localStorage for a given userId slot ──
  const readSlot = useCallback((slotUserId: string | null): { items: CartItem[], cartId: string | null } => {
    const itemsRaw = localStorage.getItem(getCartItemsKey(slotUserId));
    const cartId = localStorage.getItem(getCartIdKey(slotUserId));
    let items: CartItem[] = [];
    if (itemsRaw) {
      try {
        const parsed = JSON.parse(itemsRaw);
        if (Array.isArray(parsed)) items = parsed;
      } catch { /* ignore */ }
    }
    return { items, cartId };
  }, []);

  // ── Helper: write cart data to localStorage for a given userId slot ──
  const writeSlot = useCallback((slotUserId: string | null, items: CartItem[], cartId: string | null) => {
    localStorage.setItem(getCartItemsKey(slotUserId), JSON.stringify(items));
    if (cartId) {
      localStorage.setItem(getCartIdKey(slotUserId), cartId);
    } else {
      localStorage.removeItem(getCartIdKey(slotUserId));
    }
  }, []);

  // ── Helper: clear a slot entirely ──
  const clearSlot = useCallback((slotUserId: string | null) => {
    localStorage.removeItem(getCartItemsKey(slotUserId));
    localStorage.removeItem(getCartIdKey(slotUserId));
  }, []);

  // ──────────────────────────────────────────────
  // INITIAL HYDRATION + USER TRANSITION HANDLER
  // ──────────────────────────────────────────────
  useEffect(() => {
    // Migrate legacy keys on first run
    if (!isInitializedRef.current) {
      migrateLegacyCartKeys();
      isInitializedRef.current = true;
    }

    const prevUserId = prevUserIdRef.current;

    // ─── First mount (prevUserId === undefined) ───
    if (prevUserId === undefined) {
      const { items, cartId } = readSlot(userId);
      setCartItems(items);
      setMedusaCartId(cartId);
      prevUserIdRef.current = userId;
      return;
    }

    // ─── No change in userId ───
    if (prevUserId === userId) return;

    // ─── LOGIN: null → userId (guest → authenticated) ───
    if (prevUserId === null && userId !== null) {
      // 1. Save current state (guest) to guest slot
      // (already saved by the persist effect, but ensure it's up to date)
      const guestSlot = readSlot(null);
      const userSlot = readSlot(userId);

      let finalItems: CartItem[];
      let finalCartId: string | null;

      if (guestSlot.items.length > 0 && userSlot.items.length > 0) {
        // Merge: guest items into existing user items
        finalItems = mergeCartItems(userSlot.items, guestSlot.items);
        finalCartId = userSlot.cartId; // Keep user's Medusa cart
      } else if (guestSlot.items.length > 0) {
        // No previous user cart → adopt guest items, but need a new cart for this user
        finalItems = guestSlot.items;
        finalCartId = null; // Will create a new authenticated cart on next addToCart / checkout
      } else {
        // No guest items → just load user's existing cart
        finalItems = userSlot.items;
        finalCartId = userSlot.cartId;
      }

      // Apply merged state
      setCartItems(finalItems);
      setMedusaCartId(finalCartId);
      writeSlot(userId, finalItems, finalCartId);

      // Clean guest slot
      clearSlot(null);
    }

    // ─── LOGOUT: userId → null (authenticated → guest) ───
    if (prevUserId !== null && userId === null) {
      // The persist effect will have already saved to the old userId slot.
      // Now switch to guest slot
      const guestSlot = readSlot(null);
      setCartItems(guestSlot.items);
      setMedusaCartId(guestSlot.cartId);
    }

    // ─── USER SWITCH: userId A → userId B ───
    if (prevUserId !== null && userId !== null && prevUserId !== userId) {
      // Save current to old user (persist effect handles this)
      // Load new user's cart
      const newUserSlot = readSlot(userId);
      setCartItems(newUserSlot.items);
      setMedusaCartId(newUserSlot.cartId);
    }

    prevUserIdRef.current = userId;
  }, [userId, readSlot, writeSlot, clearSlot]);

  // ──────────────────────────────────────────────
  // PERSIST: Save cart items + cartId to current user's slot
  // ──────────────────────────────────────────────
  useEffect(() => {
    // Don't persist during initial hydration (prevUserIdRef not set yet)
    if (prevUserIdRef.current === undefined) return;

    writeSlot(userId, cartItems, medusaCartId);
  }, [cartItems, medusaCartId, userId, writeSlot]);

  // ──────────────────────────────────────────────
  // CART OPERATIONS
  // ──────────────────────────────────────────────
  const showToast = (message: string) => {
    setToast({ message, isOpen: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isOpen: false }));
  };

  const ensureCart = async (): Promise<string> => {
    if (medusaCartId) return medusaCartId;
    
    try {
      const data = await createCart();
      const newCartId = data.cart.id;
      setMedusaCartId(newCartId);
      // Persist immediately to the current user's slot
      writeSlot(userId, cartItems, newCartId);
      return newCartId;
    } catch (error) {
      console.error('Failed to ensure cart exists in Medusa:', error);
      throw error;
    }
  };

  const addToCart = async (item: CartItem) => {
    try {
      await ensureCart();

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
    setMedusaCartId(null);
    clearSlot(userId); // Also clear the slot's files physically
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
      hideToast,
      medusaCartId,
      ensureCart
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
