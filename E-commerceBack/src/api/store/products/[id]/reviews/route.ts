import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const { rating, content, customer_name, customer_id } = req.body as { 
    rating: number, 
    content: string, 
    customer_name: string,
    customer_id?: string
  }

  const reviewModuleService = req.scope.resolve("review")
  const link = req.scope.resolve("link")
  const query = req.scope.resolve("query")

  let existingReviewId = null
  if (customer_id) {
    const { data } = await query.graph({
      entity: "product",
      fields: ["id", "reviews.*"],
      filters: { id },
    }) as { data: any[] }

    const productReviews = data?.[0]?.reviews || []
    const userReview = productReviews.find((r: any) => r.customer_id === customer_id)
    if (userReview) {
      existingReviewId = userReview.id
    }
  }

  let review;

  if (existingReviewId) {
    review = await reviewModuleService.updateReviews({
      id: existingReviewId,
      rating,
      content,
      customer_name
    })
  } else {
    review = await reviewModuleService.createReviews({
      rating,
      content,
      customer_name,
      customer_id
    })

    await link.create({
      product: {
        product_id: id
      },
      review: {
        review_id: review.id
      }
    })
  }

  res.json({ review })
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { id } = req.params
    const query = req.scope.resolve("query")

    const { data } = await query.graph({
      entity: "product",
      fields: ["id", "reviews.*"],
      filters: { id },
    }) as { data: any[] }

    const reviews = data?.[0]?.reviews || []

    let average_rating = 0
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc: number, r: any) => acc + Number(r.rating || 0), 0)
      average_rating = sum / reviews.length
    }

    const sortedReviews = [...reviews].sort((a: any, b: any) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });

    const recentReviews = sortedReviews.slice(0, 5);

    res.json({
      reviews: recentReviews,
      average_rating: Number(average_rating.toFixed(1))
    })
  } catch (error: any) {
    console.error("Error in GET reviews:", error.message)
    res.status(500).json({ error: error.message, stack: error.stack })
  }
}
