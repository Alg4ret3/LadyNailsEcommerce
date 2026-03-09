import { medusaFetch } from "./client"
import { getCategories, type ProductCategoriesResponse } from "./categories"

interface MedusaPrice {
  amount: number
  currency_code: string
}

interface MedusaVariant {
  id: string
  calculated_price: {
    original_amount: number
    calculated_amount: number
  }
  prices: MedusaPrice[]
}

interface MedusaCollection {
  id: string
  title: string
}

export interface MedusaImage {
  id: string
  url: string
}

export interface MedusaTag {
  id: string
  value: string
}

export interface MedusaProduct {
  id: string
  title: string
  handle: string
  description?: string
  thumbnail: string | null
  images?: MedusaImage[]
  variants: MedusaVariant[]
  collection?: MedusaCollection
  metadata?: Record<string, any>
  tags?: MedusaTag[]
  categories?: {
    id: string
    name: string
    handle: string
  }[]
}

interface MedusaProductsResponse {
  products: MedusaProduct[]
  count: number
}

interface MedusaProductResponse {
  product: MedusaProduct
}

export async function getAllProducts() {
  const data = await medusaFetch<MedusaProductsResponse>(
    "/store/products",
    {
      method: "GET",
    },
    {
      limit: "100",
      fields: "*variants,*variants.prices,*categories,*tags"
    }
  )

  const products = data.products || []

  // Ordenar: productos con tags primero
  const sortedProducts = products.sort((a, b) => {
    const aHasTags = (a.tags?.length ?? 0) > 0
    const bHasTags = (b.tags?.length ?? 0) > 0

    if (aHasTags && !bHasTags) return -1
    if (!aHasTags && bHasTags) return 1

    return 0
  })

  return sortedProducts
}

export async function getProductsByCategoryHandle(handle: string) {
  const categoryRes = await medusaFetch<ProductCategoriesResponse>(
    "/store/product-categories",
    { method: "GET" },
    { handle }
  )

  const category = categoryRes.product_categories?.[0]

  if (!category) return [] // ✅ importante

  const productsRes = await medusaFetch<MedusaProductsResponse>(
    "/store/products",
    { method: "GET" },
    {
      "category_id": category.id,
      fields: "*variants,*variants.prices,*categories,*tags"
    }
  )

  const products = productsRes.products || []

  // Ordenar: productos con tags primero
  const sortedProducts = products.sort((a, b) => {
    const aHasTags = (a.tags?.length ?? 0) > 0
    const bHasTags = (b.tags?.length ?? 0) > 0

    if (aHasTags && !bHasTags) return -1
    if (!aHasTags && bHasTags) return 1

    return 0
  })

  return sortedProducts
}

export async function getProductById(id: string) {
  const data = await medusaFetch<MedusaProductResponse>(
    `/store/products/${id}?region_id=reg_01KHMA1TDSX5N1PNXX04K3ZJGC&fields=+metadata,*variants,*variants.prices,+collection,*tags,*categories`
  )

  return data.product
}

export async function getFeaturedProducts() {
  
  const products = await getAllProducts()

  const featuredProducts = products
    .filter((p: any) =>
      p.tags?.some((t: any) => t.value === "Destacados-home")
    )
    .slice(0, 4)

  return featuredProducts
}
