import { medusaFetch } from "./client"

export interface ProductCategory {
  id: string
  name: string
  handle: string
  parent_category_id: string | null
  rank: number
  created_at: string
  updated_at: string
}

export interface ProductCategoriesResponse {
  product_categories: ProductCategory[]
  count: number
  offset: number
  limit: number
}

export async function getCategories(
  query?: Record<string, string | string[]>
): Promise<ProductCategoriesResponse> {
  return medusaFetch<ProductCategoriesResponse>(
    "/store/product-categories",
    {
      method: "GET",
    },
    query
  )
}