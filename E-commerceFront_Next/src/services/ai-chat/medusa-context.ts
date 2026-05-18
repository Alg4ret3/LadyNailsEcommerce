import { ProductContext } from './types'

// ─── Medusa Context Service ──────────────────────────────────────────────────
// Fetches relevant products from MedusaJS based on user message

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

interface MedusaStoreProduct {
  id: string
  title: string
  handle: string
  description?: string
  thumbnail?: string | null
  collection?: { id: string; title: string }
  categories?: { id: string; name: string; handle: string }[]
  variants?: {
    id: string
    title: string
    inventory_items?: {
      inventory?: {
        location_levels?: {
          available_quantity: number
          stocked_quantity: number
        }[]
      }
    }[]
    prices?: {
      amount: number
      currency_code: string
    }[]
  }[]
  tags?: { id: string; value: string }[]
}

/**
 * Searches Medusa products relevant to the user's message.
 * Uses keyword extraction to build a smart query.
 */
export async function fetchRelevantProducts(userMessage: string): Promise<ProductContext[]> {
  try {
    const keywords = extractKeywords(userMessage)

    if (!keywords.length) {
      // If no product-related keywords, return empty
      return []
    }

    // Fetch products from Medusa Store API (fetch a pool of 12 for high-quality ranking)
    const products = await searchProducts(keywords)

    // Programmatic ranking to boost products with matching titles/handles
    const rankedProducts = rankProducts(products, keywords)

    return rankedProducts.map(mapToProductContext)
  } catch (error) {
    console.error('[AI Chat] Error fetching Medusa products:', error)
    return []
  }
}

/**
 * Fetches all categories from Medusa for context.
 */
export async function fetchCategories(): Promise<string[]> {
  try {
    const res = await fetch(`${MEDUSA_URL}/store/product-categories?limit=50`, {
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
    })

    if (!res.ok) return []

    const data = await res.json()
    return data.product_categories?.map((c: any) => c.name) || []
  } catch {
    return []
  }
}

// ─── Internal Helpers ─────────────────────────────────────────────────────────

/**
 * Extracts relevant keywords from user message for product search.
 */
function extractKeywords(message: string): string[] {
  const normalized = message.toLowerCase().trim()

  // Skip if it's clearly NOT a product query
  const nonProductPatterns = [
    /^(hola|hey|buenos?\s+d[ií]as?|buenas?\s+(tardes?|noches?)|gracias|adi[oó]s|chao)/i,
    /^(qui[eé]n eres|c[oó]mo te llamas|qu[eé] eres)/i,
    /^(cu[aá]les? son (tus|sus) horarios)/i,
  ]

  if (nonProductPatterns.some((p) => p.test(normalized))) {
    return []
  }

  // Product-related keyword patterns
  const beautyKeywords = [
    'esmalte', 'esmaltes', 'gel', 'acrílico', 'acrilico', 'polygel',
    'lima', 'limas', 'cortauñas', 'cortaúñas', 'pinza', 'pinzas',
    'lámpara', 'lampara', 'uv', 'led', 'secador',
    'base', 'top coat', 'primer', 'deshidratador',
    'brillo', 'mate', 'glitter', 'decoración', 'decoracion',
    'sticker', 'foil', 'piedra', 'piedras', 'cristal', 'cristales',
    'brocha', 'brochas', 'pincel', 'pinceles',
    'removedor', 'acetona', 'limpiador',
    'crema', 'aceite', 'cutícula', 'cuticula',
    'tip', 'tips', 'molde', 'moldes', 'forma', 'formas',
    'polvo', 'polvos', 'monómero', 'monomero',
    'barbería', 'barberia', 'navaja', 'tijera', 'tijeras',
    'maquina', 'máquina', 'cortadora', 'clipper',
    'cera', 'shampoo', 'champú', 'champu', 'loción', 'locion',
    'maquillaje', 'labial', 'rímel', 'rimel', 'sombra',
    'uña', 'uñas', 'nail', 'nails',
    'kit', 'set', 'combo', 'producto', 'productos',
    'color', 'rojo', 'rosa', 'azul', 'negro', 'blanco', 'dorado', 'plateado',
    'francés', 'frances', 'french',
    'drill', 'torno', 'fresas',
    'camilla', 'silla', 'mesa', 'mueble',
  ]

  // Extract words that match beauty keywords or look like product terms
  const words = normalized
    .replace(/[¿?!¡.,;:()]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2)

  const matched = words.filter((w) =>
    beautyKeywords.some((kw) => w.includes(kw) || kw.includes(w))
  )

  // If direct keywords found, use them; otherwise use all meaningful words
  if (matched.length > 0) {
    return matched.slice(0, 3) // Max 3 keywords for search
  }

  // Check if the user seems to be asking about products
  const productIntent = /(?:tienen|tienes|hay|busco|quiero|necesito|venden|ofrecen|cuánto|cuanto|precio|cuesta|catálogo|catalogo|recomiend|popular|nuevo)/i
  if (productIntent.test(normalized)) {
    // Return the most meaningful words (non-stopwords)
    const stopwords = ['que', 'los', 'las', 'del', 'una', 'uno', 'por', 'para', 'con', 'sin', 'más', 'mas', 'como', 'esto', 'esta', 'estos', 'estas', 'tienen', 'tienes', 'hay', 'busco', 'quiero', 'necesito', 'venden', 'ofrecen', 'precio', 'cuesta', 'cuanto', 'cuánto', 'algún', 'alguna', 'son', 'ser']
    return words.filter((w) => !stopwords.includes(w)).slice(0, 3)
  }

  return []
}

/**
 * Search products in Medusa by keyword.
 */
async function searchProducts(keywords: string[]): Promise<MedusaStoreProduct[]> {
  // Use the search query parameter — Medusa supports `q` for text search
  const query = keywords.join(' ')

  const url = new URL('/store/products', MEDUSA_URL)
  url.searchParams.set('q', query)
  url.searchParams.set('limit', '12') // Fetch a pool of 12 potential products
  // We need to expand variants, prices and inventory items to match Modal logic
  url.searchParams.set('fields', '*variants,*variants.prices,*variants.inventory_items,*variants.inventory_items.inventory,*variants.inventory_items.inventory.location_levels')

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'x-publishable-api-key': PUBLISHABLE_KEY,
    },
  })

  if (!res.ok) {
    console.error('[AI Chat] Medusa search failed:', res.status)
    return []
  }

  const data = await res.json()
  return data.products || []
}

/**
 * Maps a Medusa product to our simplified ProductContext.
 */
function mapToProductContext(product: MedusaStoreProduct): ProductContext {
  const firstVariant = product.variants?.[0]
  
  // Get price using Modal's logic
  const price = firstVariant?.prices?.[0]?.amount || 0

  // Get inventory using Modal's logic
  const getInStock = (v: any) => {
    const stockQuantity = v?.inventory_items?.[0]?.inventory?.location_levels?.[0]?.available_quantity ?? 0;
    return stockQuantity > 0;
  }

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description?.substring(0, 100),
    thumbnail: product.thumbnail,
    price: price || undefined,
    currency: 'COP',
    category: product.categories?.[0]?.name,
    collection: product.collection?.title,
    inStock: firstVariant ? getInStock(firstVariant) : true,
    variants: product.variants?.map((v) => ({
      title: v.title,
      price: v.prices?.[0]?.amount || price || 0,
      inStock: getInStock(v),
    })),
  }
}

/**
 * Programmatically ranks and sorts products by title, handle, and description keyword matches.
 * Gives major weight boost to title matches to bypass Medusa full-text search relevance issues.
 */
function rankProducts(products: MedusaStoreProduct[], keywords: string[]): MedusaStoreProduct[] {
  if (!keywords.length) return products

  return products
    .map((product) => {
      let score = 0
      const titleLower = product.title.toLowerCase()
      const descLower = (product.description || '').toLowerCase()
      const handleLower = product.handle.toLowerCase()

      for (const keyword of keywords) {
        const kw = keyword.toLowerCase()
        
        // 1. Title matches (highest priority)
        if (titleLower.includes(kw)) {
          score += 15
          if (titleLower.startsWith(kw)) {
            score += 10 // Extra points if it starts with the keyword
          }
        }

        // 2. Handle matches (high priority for clean searches)
        if (handleLower.includes(kw)) {
          score += 10
        }

        // 3. Description matches (low priority fallback)
        if (descLower.includes(kw)) {
          score += 2
        }
      }

      return { product, score }
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product)
}
