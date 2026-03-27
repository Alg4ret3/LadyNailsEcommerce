import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve("query")

  const { data: usages } = await query.graph({
    entity: "usage",
    fields: ["*"],
  })

  res.json({ usages })
}
