import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve("query")

  const { data: shippings } = await query.graph({
    entity: "shipping",
    fields: ["*"],
  })

  res.json({ shippings })
}
