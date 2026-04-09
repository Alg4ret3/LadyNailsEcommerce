import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { id } = req.params
    const { rating, content } = req.body as { 
      rating?: number, 
      content?: string
    }

    const reviewModuleService = req.scope.resolve("review")

    // Update only allowed fields
    const review = await reviewModuleService.updateReviews({
      id,
      rating,
      content,
      status: "pending" // Reset to pending after edit? Usually good practice
    })

    res.json({ review })
  } catch (error: any) {
    console.error("Error updating review:", error.message)
    res.status(500).json({ error: error.message })
  }
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { id } = req.params
    const reviewModuleService = req.scope.resolve("review")

    await reviewModuleService.deleteReviews(id)

    res.json({ 
      id,
      object: "review",
      deleted: true 
    })
  } catch (error: any) {
    console.error("Error deleting review:", error.message)
    res.status(500).json({ error: error.message })
  }
}
