import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCurrentCustomer, type CustomerData } from '@/services/medusa/auth'
import { createCustomerAddress, updateCustomerAddress, deleteCustomerAddress } from '@/services/medusa/customers'

export const CURRENT_USER_QUERY_KEY = ['currentUser'] as const

/**
 * Hook para obtener el cliente autenticado actual.
 */
export function useCurrentUser() {
  return useQuery<CustomerData | null>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentCustomer,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

/**
 * Hooks para gestionar las direcciones del cliente.
 */
export function useCustomerAddresses() {
  const queryClient = useQueryClient();

  const createAddressMutation = useMutation({
    mutationFn: createCustomerAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    }
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => updateCustomerAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    }
  });

  const deleteAddressMutation = useMutation({
    mutationFn: deleteCustomerAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    }
  });

  return {
    createAddress: createAddressMutation.mutateAsync,
    updateAddress: updateAddressMutation.mutateAsync,
    deleteAddress: deleteAddressMutation.mutateAsync,
    isPending: createAddressMutation.isPending || updateAddressMutation.isPending || deleteAddressMutation.isPending
  };
}

