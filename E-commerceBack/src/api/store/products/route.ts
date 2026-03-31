import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve("query")
  const { category_id, id } = req.query as { category_id?: string, id?: string }

  const filters: any = {}
  if (category_id) {
    filters.categories = { id: category_id }
  }
  if (id) {
    filters.id = id
  }

  const { data: products } = await query.graph({
    entity: "product",
    fields: [
      "*",
      "variants.*",
      "variants.prices.*",
      "variants.inventory_items.*",
      "variants.inventory_items.inventory.*",
      "variants.inventory_items.inventory.location_levels.*",
      "categories.*",
      "tags.*",
      "images.*",
      "brand.*",
      "usage.*",
      "warranty.*",
      "shipping.*",
      "reviews.*"
    ],
    filters,
  })

  res.json({ products })
}
