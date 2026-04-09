import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { customer_id } = req.query as { customer_id: string }

    if (!customer_id) {
      return res.status(400).json({ message: "customer_id is required" })
    }

    const query = req.scope.resolve("query")

    const { data: reviews } = await query.graph({
      entity: "review",
      fields: ["*"],
      filters: { customer_id },
    })

    res.json({ reviews })
  } catch (error: any) {
    console.error("Error fetching my reviews:", error.message)
    res.status(500).json({ error: error.message })
  }
}
