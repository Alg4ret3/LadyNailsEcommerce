import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const { rating, content } = req.body as { rating: number, content: string }

  const reviewModuleService = req.scope.resolve("review")
  const link = req.scope.resolve("link")

  // 1. Crear la reseña en el módulo de reviews
  const review = await reviewModuleService.createReviews({
    rating,
    content
  })

  // 2. Vincular la reseña con el producto
  await link.create({
    product: {
      product_id: id
    },
    review: {
      review_id: review.id
    }
  })

  res.json({ review })
}
