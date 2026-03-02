import { medusaFetch } from "./client"

const BOLETERIA_COLLECTION_ID = "pcol_01KJ8R2WRZH06BM8AS1YG6GXAK"
const STANDS_COLLECTION_ID = "pcol_01KJ8R3DMQGPARHWVTKV18N0M0"

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
}

interface MedusaProductResponse {
  product: any
}

export async function getProductById(id: string) {
  const data = await medusaFetch<MedusaProductResponse>(
    `/store/products/${id}?region_id=reg_01KHMA1TDSX5N1PNXX04K3ZJGC&fields=+metadata,+variants,+variants.prices,+collection`
  )

  return data.product
}

export async function getProductsByCollection(collectionId: string) {
  const data = await medusaFetch<MedusaProductsResponse>(
    `/store/products?collection_id[]=${collectionId}&fields=*variants,*variants.prices,*collection,*categories`
  )

  return data.products
}

export async function getBoleteriaProducts() {
  return getProductsByCollection(BOLETERIA_COLLECTION_ID!)
}

export async function getStandProducts() {
  return getProductsByCollection(STANDS_COLLECTION_ID!)
}