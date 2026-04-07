import { QueryClient } from '@tanstack/react-query'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cuánto tiempo los datos se consideran "frescos" antes de un refetch
        staleTime: 5 * 60 * 1000, // 5 minutos por defecto
        // Cuánto tiempo el caché persiste en memoria después de que no hay suscriptores
        gcTime: 10 * 60 * 1000, // 10 minutos
        // No reintentar en errores de autenticación (401/403)
        retry: (failureCount, error: any) => {
          if (error?.status === 401 || error?.status === 403) return false
          return failureCount < 2
        },
        refetchOnWindowFocus: false,
      },
    },
  })
}

// Singleton para el lado del cliente
let browserQueryClient: QueryClient | undefined

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: siempre crea un QueryClient nuevo para cada request
    return makeQueryClient()
  }

  // Browser: reusar o crear el singleton
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }

  return browserQueryClient
}
