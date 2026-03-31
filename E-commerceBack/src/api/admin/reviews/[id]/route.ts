import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { id } = req.params
    const query = req.scope.resolve("query")

    const { data } = await query.graph({
      entity: "review",
      fields: ["*"],
      filters: { id },
    }) as { data: any[] }

    res.json({ review: data[0] || null })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export async function PATCH(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { id } = req.params
    const updateData = req.body as any
    const reviewModuleService = req.scope.resolve("review")

    const review = await reviewModuleService.updateReviews({
      id,
      ...updateData
    })

    res.json({ review })
  } catch (error: any) {
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

    await reviewModuleService.deleteReviews([id])

    res.json({ id, deleted: true })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
