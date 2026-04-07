import { useQuery } from '@tanstack/react-query'
import { getCurrentCustomer, type CustomerData } from '@/services/medusa/auth'

export const CURRENT_USER_QUERY_KEY = ['currentUser'] as const

/**
 * Hook para obtener el cliente autenticado actual.
 * Reemplaza el useEffect de checkSession en UserContext.
 * Retorna null si no hay sesión activa (sin lanzar error).
 */
export function useCurrentUser() {
  return useQuery<CustomerData | null>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentCustomer,
    staleTime: 5 * 60 * 1000,  // 5 min — sessionde sesión no cambia frecuentemente
    gcTime: 10 * 60 * 1000,
    retry: false,               // 401 no debe reintentar
    refetchOnWindowFocus: false,
  })
}
