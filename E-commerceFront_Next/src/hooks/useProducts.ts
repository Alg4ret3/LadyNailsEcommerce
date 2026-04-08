import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import {
  getAllProducts,
  getProductsPaginated,
  getProductsByCategoryHandle,
  getProductById,
  getFeaturedProducts,
  type MedusaProduct,
} from '@/services/medusa/products'

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  allProducts: () => [...productKeys.lists(), 'all'] as const,
  byCategory: (handle: string) => [...productKeys.lists(), 'category', handle] as const,
  featured: () => [...productKeys.lists(), 'featured'] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Todos los productos de la tienda.
 */
export function useAllProducts() {
  return useQuery<MedusaProduct[]>({
    queryKey: productKeys.allProducts(),
    queryFn: getAllProducts,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Hook para scroll infinito.
 */
export function useInfiniteProducts(options: { 
  limit?: number; 
  categoryId?: string; 
  collectionId?: string; 
  tags?: string[];
} = {}) {
  const { limit = 12, categoryId, collectionId, tags } = options;
  return useInfiniteQuery({
    queryKey: [...productKeys.lists(), 'infinite', { limit, categoryId, collectionId, tags }],
    queryFn: ({ pageParam }) => getProductsPaginated({ pageParam, limit, categoryId, collectionId, tags }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Productos filtrados por handle de categoría.
 * Solo hace fetch cuando `handle` es un string no vacío.
 */
export function useProductsByCategory(handle: string) {
  return useQuery<MedusaProduct[]>({
    queryKey: productKeys.byCategory(handle),
    queryFn: () => getProductsByCategoryHandle(handle),
    enabled: Boolean(handle),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Un producto por su ID.
 */
export function useProductById(id: string) {
  return useQuery<MedusaProduct | null>({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Productos destacados (con tag "Popular").
 */
export function useFeaturedProducts() {
  return useQuery<MedusaProduct[]>({
    queryKey: productKeys.featured(),
    queryFn: getFeaturedProducts,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
