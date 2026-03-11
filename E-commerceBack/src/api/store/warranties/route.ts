import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve("query")

  const { data: warranties } = await query.graph({
    entity: "warranty",
    fields: ["*"],
  })

  res.json({ warranties })
}
