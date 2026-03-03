import { medusaFetch } from "./client"
import { getCategories } from "./categories"

interface MedusaPrice {
  amount: number
  currency_code: string
}

interface MedusaVariant {
  id: string
  prices: MedusaPrice[]
}

interface MedusaCollection {
  id: string
  title: string
}

export interface MedusaProduct {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  variants: MedusaVariant[]
  collection?: MedusaCollection
  metadata?: Record<string, any>
  categories?: {
    id: string
    name: string
  }[]
}

interface MedusaProductsResponse {
  products: MedusaProduct[]
  count: number
}

interface MedusaProductResponse {
  product: any
}

export async function getAllProducts() {
  const data = await medusaFetch<MedusaProductsResponse>(
    "/store/products",
    {
      method: "GET",
    },
    {
      limit: "100",
      fields: "*variants,*variants.prices,*categories"
    }
  )

  return data.products
}

export async function getProductsByCategoryHandle(handle: string) {
  const categoryRes = await medusaFetch<any>(
    "/store/product-categories",
    { method: "GET" },
    { handle }
  )

  const category = categoryRes.product_categories?.[0]

  if (!category) return [] // ✅ importante

  const productsRes = await medusaFetch<any>(
    "/store/products",
    { method: "GET" },
    {
      "category_id[]": category.id,
      fields: "*variants,*variants.prices,*categories"
    }
  )

  return productsRes.products ?? []
}

export async function getProductById(id: string) {
  const data = await medusaFetch<MedusaProductResponse>(
    `/store/products/${id}?region_id=reg_01KHMA1TDSX5N1PNXX04K3ZJGC&fields=+metadata,+variants,+variants.prices,+collection`
  )

  return data.product
}
