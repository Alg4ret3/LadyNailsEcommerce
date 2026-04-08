'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getCart, 
  addItemToCart, 
  updateLineItem, 
  deleteLineItem, 
  createCart,
  updateCartAddress,
  addShippingMethodToCart,
  completeCart,
  createPaymentCollection,
  createPaymentSession,
  type CreateCartResponse,
  type MedusaAddress
} from '@/services/medusa';
import { useCallback, useEffect, useState } from 'react';
import { getCartIdKey } from '@/utils/cartKeys';
import { useUser } from '@/context/UserContext';

export const CART_QUERY_KEY = ['cart'];

export function useCartQuery() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const userId = user?.id ?? null;

  // We manage the cartId in local state + localStorage
  const [cartId, setCartId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(getCartIdKey(userId));
    }
    return null;
  });

  // Sync cartId when user changes
  useEffect(() => {
    const savedId = localStorage.getItem(getCartIdKey(userId));
    setCartId(savedId);
  }, [userId]);

  // Query: Fetch cart data
  const { data: cartData, isLoading, error } = useQuery({
    queryKey: [...CART_QUERY_KEY, cartId],
    queryFn: () => (cartId ? getCart(cartId) : null),
    enabled: !!cartId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const cart = cartData?.cart || null;

  // Mutation Helper: Ensure cart exists
  const ensureCart = useCallback(async (): Promise<string> => {
    if (cartId) return cartId;
    
    // Fallback to localStorage if state is not yet updated
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem(getCartIdKey(userId));
      if (savedId) {
        setCartId(savedId);
        return savedId;
      }
    }

    const response = await createCart();
    const newCartId = response.cart.id;
    
    localStorage.setItem(getCartIdKey(userId), newCartId);
    setCartId(newCartId);
    
    // Seed the cache with the new empty cart to avoid extra fetch
    queryClient.setQueryData([...CART_QUERY_KEY, newCartId], response);
    
    return newCartId;
  }, [cartId, userId, queryClient]);

  // Mutation: Add Item
  const addItemMutation = useMutation({
    mutationFn: async ({ variantId, quantity }: { variantId: string, quantity: number }) => {
      const activeCartId = await ensureCart();
      return addItemToCart(activeCartId, variantId, quantity);
    },
    onMutate: async ({ variantId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: [...CART_QUERY_KEY, cartId] });
      const previousCart = queryClient.getQueryData<CreateCartResponse>([...CART_QUERY_KEY, cartId]);

      // Optimistically update the cart (if we have it)
      if (previousCart) {
        // ... (as before)
      }

      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData([...CART_QUERY_KEY, cartId], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...CART_QUERY_KEY, cartId] });
    },
  });

  // Mutation: Update Quantity
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ lineItemId, quantity }: { lineItemId: string, quantity: number }) => {
      const activeCartId = await ensureCart();
      return updateLineItem(activeCartId, lineItemId, quantity);
    },
    onMutate: async ({ lineItemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: [...CART_QUERY_KEY, cartId] });
      const previousCart = queryClient.getQueryData<CreateCartResponse>([...CART_QUERY_KEY, cartId]);

      if (previousCart) {
        const updatedItems = previousCart.cart.items.map((item: any) => 
          item.id === lineItemId ? { ...item, quantity } : item
        );
        queryClient.setQueryData([...CART_QUERY_KEY, cartId], {
          ...previousCart,
          cart: { ...previousCart.cart, items: updatedItems }
        });
      }

      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData([...CART_QUERY_KEY, cartId], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...CART_QUERY_KEY, cartId] });
    },
  });

  // Mutation: Remove Item
  const removeItemMutation = useMutation({
    mutationFn: async (lineItemId: string) => {
      const activeCartId = await ensureCart();
      return deleteLineItem(activeCartId, lineItemId);
    },
    onMutate: async (lineItemId) => {
      await queryClient.cancelQueries({ queryKey: [...CART_QUERY_KEY, cartId] });
      const previousCart = queryClient.getQueryData<CreateCartResponse>([...CART_QUERY_KEY, cartId]);

      if (previousCart) {
        const updatedItems = previousCart.cart.items.filter((item: any) => item.id !== lineItemId);
        queryClient.setQueryData([...CART_QUERY_KEY, cartId], {
          ...previousCart,
          cart: { ...previousCart.cart, items: updatedItems }
        });
      }

      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData([...CART_QUERY_KEY, cartId], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...CART_QUERY_KEY, cartId] });
    },
  });

  // ── MUTATIONS DE CHECKOUT ──

  const updateAddressMutation = useMutation({
    mutationFn: async (address: MedusaAddress) => {
      const activeCartId = await ensureCart();
      return updateCartAddress(activeCartId, address);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...CART_QUERY_KEY, cartId] });
    }
  });

  const addShippingMethodMutation = useMutation({
    mutationFn: async (optionId: string) => {
      const activeCartId = await ensureCart();
      return addShippingMethodToCart(activeCartId, optionId);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...CART_QUERY_KEY, cartId] });
    }
  });

  const completeCartMutation = useMutation({
    mutationFn: async () => {
      const activeCartId = await ensureCart();
      return completeCart(activeCartId);
    },
    onSuccess: () => {
      // Limpiamos el caché del carrito al completar la orden
      queryClient.setQueryData([...CART_QUERY_KEY, cartId], null);
      queryClient.invalidateQueries({ queryKey: [...CART_QUERY_KEY] });
    }
  });

  const createPaymentCollectionMutation = useMutation({
    mutationFn: async () => {
      const activeCartId = await ensureCart();
      return createPaymentCollection(activeCartId);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...CART_QUERY_KEY, cartId] });
    }
  });

  const createPaymentSessionMutation = useMutation({
    mutationFn: async ({ collectionId, providerId }: { collectionId: string, providerId: string }) => {
      return createPaymentSession(collectionId, providerId);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...CART_QUERY_KEY, cartId] });
    }
  });

  return {
    cart,
    isLoading,
    error,
    addItem: addItemMutation.mutateAsync,
    updateQuantity: updateQuantityMutation.mutateAsync,
    removeItem: removeItemMutation.mutateAsync,
    updateAddress: updateAddressMutation.mutateAsync,
    addShippingMethod: addShippingMethodMutation.mutateAsync,
    completeCart: completeCartMutation.mutateAsync,
    createPaymentCollection: createPaymentCollectionMutation.mutateAsync,
    createPaymentSession: createPaymentSessionMutation.mutateAsync,
    isUpdating: 
      updateAddressMutation.isPending || 
      addShippingMethodMutation.isPending || 
      completeCartMutation.isPending ||
      createPaymentCollectionMutation.isPending ||
      createPaymentSessionMutation.isPending,
    cartId,
    setCartId,
    ensureCart
  };
}

