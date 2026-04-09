import { medusaFetch } from "./client"
import { getCategories, type ProductCategoriesResponse } from "./categories"
import { AttributeData } from "./atributes"
import { ReviewData } from "./review"

interface MedusaPrice {
  amount: number
  currency_code: string
}

interface MedusaOptionValue {
  id: string
  value: string
  option_id: string
}

interface MedusaVariant {
  id: string
  title: string
  sku?: string
  inventory_quantity?: number
  manage_inventory?: boolean
  allow_backorder?: boolean
  options?: MedusaOptionValue[]
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

export interface MedusaOption {
  id: string
  title: string
  values: MedusaOptionValue[]
}

export interface MedusaProduct {
  id: string
  title: string
  handle: string
  description?: string
  subtitle?: string
  thumbnail: string | null
  images?: MedusaImage[]
  options?: MedusaOption[]
  variants: MedusaVariant[]
  collection?: MedusaCollection
  metadata?: Record<string, any>
  tags?: MedusaTag[]
  categories?: {
    id: string
    name: string
    handle: string
  }[]
  brand?: AttributeData
  usage?: AttributeData
  warranty?: AttributeData
  shipping?: AttributeData
  vendor?: string
  reviews?: ReviewData[]
}

interface MedusaProductsResponse {
  products: MedusaProduct[]
  count: number
}

interface MedusaProductResponse {
  products: MedusaProduct
}

export function sortProductsBySuggested(products: MedusaProduct[]) {
  return [...products].sort((a, b) => {
    const aTags = a.tags?.map(t => t.value) || [];
    const bTags = b.tags?.map(t => t.value) || [];

    const aHasDestacado = aTags.includes("Destacados");
    const bHasDestacado = bTags.includes("Destacados");
    if (aHasDestacado && !bHasDestacado) return -1;
    if (!aHasDestacado && bHasDestacado) return 1;

    const aHasPopular = aTags.includes("Popular");
    const bHasPopular = bTags.includes("Popular");
    if (aHasPopular && !bHasPopular) return -1;
    if (!aHasPopular && bHasPopular) return 1;

    const aHasAnyTags = aTags.length > 0;
    const bHasAnyTags = bTags.length > 0;
    if (aHasAnyTags && !bHasAnyTags) return -1;
    if (!aHasAnyTags && bHasAnyTags) return 1;

    return 0;
  });
}

export async function getAllProducts() {
  const data = await medusaFetch<MedusaProductsResponse>(
    "/store/products",
    {
      method: "GET",
    },
    {
      limit: "100",
    }
  )

  const products = data.products || []
  return sortProductsBySuggested(products)
}

export async function getProductsPaginated({ 
  pageParam = 0, 
  limit = 12,
  categoryId,
  collectionId,
  tags
}: { 
  pageParam?: number; 
  limit?: number;
  categoryId?: string;
  collectionId?: string;
  tags?: string[];
}) {
  const query: Record<string, string | string[]> = {
    limit: limit.toString(),
    offset: pageParam.toString(),
  }

  if (categoryId) query["category_id"] = categoryId;
  if (collectionId) query["collection_id"] = collectionId;
  if (tags) query["tags"] = tags;

  const data = await medusaFetch<MedusaProductsResponse>(
    "/store/products",
    {
      method: "GET",
    },
    query
  )

  return {
    products: sortProductsBySuggested(data.products || []),
    nextCursor: (data.products?.length || 0) === limit ? pageParam + limit : undefined,
    count: data.count
  }
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
    }
  )

  const products = productsRes.products || []
  return sortProductsBySuggested(products)
}

export async function getProductById(id: string) {
  const data = await medusaFetch<MedusaProductsResponse>(
    `/store/products?id=${id}`,
    { method: "GET" }
  )

  return data.products?.[0] || null
}

export async function getFeaturedProducts() {
  
  const products = await getAllProducts()

  const featuredProducts = products
    .filter((p: any) =>
      p.tags?.some((t: any) => t.value === "Popular")
    )

  return featuredProducts
}
