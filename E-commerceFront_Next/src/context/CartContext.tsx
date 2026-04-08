'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useUser } from '@/context/UserContext';
import { getCartIdKey, getCartItemsKey, migrateLegacyCartKeys } from '@/utils/cartKeys';
import { useCartQuery } from '@/hooks/useCart';

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
  medusaCartId: string | null;
  ensureCart: () => Promise<string>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Merge guest items into user items.
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

/**
 * Maps Medusa LineItem to frontend CartItem
 */
function mapMedusaLineItemToCartItem(li: any): CartItem {
  return {
    id: li.variant_id,
    name: li.title,
    price: li.unit_price,
    image: li.thumbnail,
    quantity: li.quantity,
    size: li.variant?.options?.find((o: any) => o.option?.title === 'Size' || o.option_id?.includes('size'))?.value,
    color: li.variant?.options?.find((o: any) => o.option?.title === 'Color' || o.option_id?.includes('color'))?.value,
    slug: li.variant?.product?.handle || '',
    tags: li.variant?.product?.tags?.map((t: any) => t.value) || [],
    vendor: li.variant?.product?.vendor,
    category: li.variant?.product?.categories?.[0]?.name,
  };
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const userId = user?.id ?? null;

  // ── Hook de TanStack Query ──
  const { 
    cart, 
    addItem, 
    updateQuantity: updateQtyMutation, 
    removeItem: removeMutation,
    cartId: medusaCartId,
    setCartId: setMedusaCartId 
  } = useCartQuery();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Track previous userId to detect login/logout transitions
  const prevUserIdRef = useRef<string | null | undefined>(undefined);
  const isInitializedRef = useRef(false);

  // Sync cartItems with TanStack Query data
  useEffect(() => {
    if (cart) {
      const mapped = cart.items.map(mapMedusaLineItemToCartItem);
      setCartItems(mapped);
    }
  }, [cart]);

  // ── Helpers ──
  const readSlot = useCallback((slotUserId: string | null): { items: CartItem[], cartId: string | null } => {
    if (typeof window === 'undefined') return { items: [], cartId: null };
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

  const writeSlot = useCallback((slotUserId: string | null, items: CartItem[], cartId: string | null) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(getCartItemsKey(slotUserId), JSON.stringify(items));
    if (cartId) {
      localStorage.setItem(getCartIdKey(slotUserId), cartId);
    } else {
      localStorage.removeItem(getCartIdKey(slotUserId));
    }
  }, []);

  const clearSlot = useCallback((slotUserId: string | null) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(getCartItemsKey(slotUserId));
    localStorage.removeItem(getCartIdKey(slotUserId));
  }, []);

  // ── Transition Handler ──
  useEffect(() => {
    if (!isInitializedRef.current) {
      migrateLegacyCartKeys();
      isInitializedRef.current = true;
    }

    const prevUserId = prevUserIdRef.current;
    if (prevUserId === undefined) {
      const { items, cartId } = readSlot(userId);
      // Solo cargamos localItems si NO hay carrito en medusa (o para consistencia inicial)
      if (items.length > 0 && !cart) setCartItems(items);
      if (cartId && !medusaCartId) setMedusaCartId(cartId);
      prevUserIdRef.current = userId;
      return;
    }

    if (prevUserId === userId) return;

    // LOGIN: guest -> user
    if (prevUserId === null && userId !== null) {
      const guestSlot = readSlot(null);
      const userSlot = readSlot(userId);

      let finalItems: CartItem[];
      let finalCartId: string | null;

      if (guestSlot.items.length > 0 && userSlot.items.length > 0) {
        finalItems = mergeCartItems(userSlot.items, guestSlot.items);
        finalCartId = userSlot.cartId;
      } else if (guestSlot.items.length > 0) {
        finalItems = guestSlot.items;
        finalCartId = null; 
      } else {
        finalItems = userSlot.items;
        finalCartId = userSlot.cartId;
      }

      setCartItems(finalItems);
      setMedusaCartId(finalCartId);
      writeSlot(userId, finalItems, finalCartId);
      clearSlot(null);
    }

    // LOGOUT: user -> guest
    if (prevUserId !== null && userId === null) {
      const guestSlot = readSlot(null);
      setCartItems(guestSlot.items);
      setMedusaCartId(guestSlot.cartId);
    }

    prevUserIdRef.current = userId;
  }, [userId, readSlot, writeSlot, clearSlot, medusaCartId, setMedusaCartId, cart]);

  // Persist local copies
  useEffect(() => {
    if (prevUserIdRef.current === undefined) return;
    writeSlot(userId, cartItems, medusaCartId);
  }, [cartItems, medusaCartId, userId, writeSlot]);

  // ── Operaciones ──

  const addToCart = async (item: CartItem) => {
    try {
      await addItem({ variantId: item.id, quantity: item.quantity });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (id: string, size?: string) => {
    try {
      const item = cartItems.find(i => i.id === id && i.size === size);
      if (!item) return;

      // Buscamos el lineItemId en el cart de Medusa
      const lineItem = cart?.items.find((li: any) => li.variant_id === id);
      if (lineItem) {
        await removeMutation(lineItem.id);
      } else {
        // Fallback local
        setCartItems(prev => prev.filter(i => !(i.id === id && i.size === size)));
      }
    } catch (error) {
      console.error('Error removing from Medusa cart:', error);
      setCartItems(prev => prev.filter(i => !(i.id === id && i.size === size)));
    }
  };

  const updateQuantity = async (id: string, quantity: number, size?: string) => {
    const newQuantity = Math.max(1, quantity);
    try {
      const lineItem = cart?.items.find((li: any) => li.variant_id === id);
      if (lineItem) {
        await updateQtyMutation({ lineItemId: lineItem.id, quantity: newQuantity });
      } else {
         setCartItems(prev => prev.map(i => (i.id === id && i.size === size) ? { ...i, quantity: newQuantity } : i));
      }
    } catch (error) {
      console.error('Error updating Medusa cart quantity:', error);
      setCartItems(prev => prev.map(i => (i.id === id && i.size === size) ? { ...i, quantity: newQuantity } : i));
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setMedusaCartId(null);
    clearSlot(userId);
  };

  const totalItems = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);
  const totalAmount = useMemo(() => cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cartItems]);

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
      medusaCartId,
      ensureCart: async () => medusaCartId || '', // Simplified since hook handles creation
    }}>
      {children}
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
