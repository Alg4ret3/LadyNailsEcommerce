import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const query = req.scope.resolve("query")

    // Fetch only approved reviews for the home page / wall of love
    const { data } = await query.graph({
      entity: "review",
      fields: ["*"],
      filters: { status: "approved" },
    }) as { data: any[] }

    let average_rating = 0
    if (data.length > 0) {
      const sum = data.reduce((acc: number, r: any) => acc + Number(r.rating || 0), 0)
      average_rating = sum / data.length
    }

    const sortedReviews = [...data].sort((a: any, b: any) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });

    res.json({
      reviews: sortedReviews,
      average_rating: Number(average_rating.toFixed(1))
    })
  } catch (error: any) {
    console.error("Error in GET page reviews:", error.message)
    res.status(500).json({ error: error.message, stack: error.stack })
  }
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { rating, content, customer_name, customer_id } = req.body as { 
      rating: number, 
      content: string, 
      customer_name: string,
      customer_id?: string
    }

    const reviewModuleService = req.scope.resolve("review")
    const query = req.scope.resolve("query")

    if (customer_id) {
      const [, count] = await reviewModuleService.listAndCountReviews({
        customer_id: customer_id
      })

      if (count >= 3) {
        return res.status(403).json({ 
          message: "Has alcanzado el límite máximo de 3 reseñas por usuario." 
        })
      }
    }

    const review = await reviewModuleService.createReviews({
      rating,
      content,
      customer_name,
      customer_id,
      status: "pending"
    })

    res.json({ review })
  } catch (error: any) {
    console.error("Error handling review upsert:", error.message)
    res.status(500).json({ error: error.message })
  }
}

