import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const query = req.scope.resolve("query")

    // Retrieve all reviews including status
    const { data } = await query.graph({
      entity: "review",
      fields: ["*"],
    }) as { data: any[] }

    res.json({ reviews: data })
  } catch (error: any) {
    console.error("Error fetching admin reviews:", error.message)
    res.status(500).json({ error: error.message })
  }
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { rating, content, customer_name, customer_id, status } = req.body as any
    const reviewModuleService = req.scope.resolve("review")

    const review = await reviewModuleService.createReviews({
      rating,
      content,
      customer_name,
      customer_id,
      status: status || "approved"
    })

    res.json({ review })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
