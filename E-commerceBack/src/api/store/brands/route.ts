import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve("query")

  const { data: brands } = await query.graph({
    entity: "brand",
    fields: ["*"],
  })

  res.json({ brands })
}
