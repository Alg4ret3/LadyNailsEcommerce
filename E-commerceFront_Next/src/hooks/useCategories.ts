import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/services/medusa/categories'

export interface Category {
  id: string
  name: string
  handle: string
  parent_category_id: string | null
  category_children?: Category[]
}

async function fetchCategories(): Promise<Category[]> {
  const { product_categories } = await getCategories()

  // Solo devolvemos las raíces — ya traen sus hijos en category_children
  return product_categories.filter(
    (c: Category) => c.parent_category_id === null
  )
}

export function useCategories() {
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 min — las categorías rara vez cambian
    gcTime: 30 * 60 * 1000,    // 30 min en caché
  })

  const getCategoryByHandle = (handle: string): Category | undefined =>
    categories.find((c) => c.handle === handle)

  const getRootCategories = (): Category[] => categories

  return {
    categories,
    isLoading,
    error,
    getCategoryByHandle,
    getRootCategories,
  }
}
