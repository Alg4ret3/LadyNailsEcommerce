import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const query = req.scope.resolve("query")

  const { data } = await query.graph({
    entity: "product",
    fields: ["id", "brand.*"],
    filters: { id },
  })

  res.json({
    brand: data?.[0]?.brand ?? null,
  })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const { brand_id } = req.body as { brand_id: string }
  const query = req.scope.resolve("query")
  const link = req.scope.resolve("link")

  const { data } = await query.graph({
    entity: "product",
    fields: ["id", "brand.id"],
    filters: { id },
  })

  const product = data?.[0]

  if (product?.brand) {
    const brands = Array.isArray(product.brand)
      ? product.brand
      : [product.brand]

    // Solo dismiss si la marca es diferente
    const yaExiste = brands.some((b) => b.id === brand_id)
    if (yaExiste) {
      return res.json({ success: true, message: "Ya tiene esa marca asignada" })
    }

    // Dismiss los links activos
    await link.dismiss(
      brands.map((b) => ({
        product: { product_id: id },
        brand: { brand_id: b.id },
      }))
    )
  }

  // Crear solo si no existía ya
  await link.create([
    {
      product: { product_id: id },
      brand: { brand_id },
    },
  ])

  res.json({ success: true })
}