'use client';

import { useQuery } from '@tanstack/react-query';
import { listCustomerOrders, getOrder } from '@/services/medusa';
import { useUser } from '@/context/UserContext';

export interface Order {
  id: string;
  display_id: number;
  status: string;
  payment_status: string;
  fulfillment_status: string;
  created_at: string;
  total: number;
  subtotal?: number;
  tax_total?: number;
  shipping_total?: number;
  customer_id?: string;
  shipping_address?: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    province: string;
    postal_code: string;
    country_code: string;
    phone?: string;
  };
  items: Array<{
    id: string;
    thumbnail?: string;
    title: string;
    description?: string;
    quantity: number;
    unit_price: number;
    total: number;
    variant?: {
      title: string;
    };
  }>;
  fulfillments?: Array<{
    id: string;
    tracking_numbers?: string[];
    tracking_links?: Array<{ url?: string; tracking_url?: string }>;
    labels?: any;
    label_url?: string;
    shipped_at?: string | null;
    delivered_at?: string | null;
    canceled_at?: string | null;
    created_at?: string;
  }>;
}

export const ORDERS_QUERY_KEY = ['orders'] as const;

/**
 * Hook to retrieve the list of orders for the authenticated customer.
 */
export function useCustomerOrders() {
  const { user } = useUser();

  const query = useQuery({
    queryKey: [...ORDERS_QUERY_KEY, user?.id],
    queryFn: async () => {
      const response = await listCustomerOrders();
      // Sort orders by most recent by default
      const orders = (response.orders || []) as Order[];
      return orders.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    refetchOnWindowFocus: true, // Auto-update when coming back to the tab
  });

  return {
    orders: (query.data || []) as Order[],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}

/**
 * Hook to retrieve details for a specific order.
 * Helpful for prefetching detail screens.
 */
export function useOrderDetails(orderId: string) {
  const query = useQuery({
    queryKey: [...ORDERS_QUERY_KEY, 'detail', orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 60 * 10, // Orders usually don't change frequently (status)
  });

  return {
    order: (query.data?.order || null) as Order | null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
