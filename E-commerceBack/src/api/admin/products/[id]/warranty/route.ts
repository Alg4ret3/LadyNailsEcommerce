import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const { id } = req.params
    const query = req.scope.resolve("query")

    const { data } = await query.graph({
        entity: "product",
        fields: ["id", "warranty.*"],
        filters: { id },
    }) as { data: any[] }

    res.json({
        warranty: data?.[0]?.warranty ?? null,
    })
}

export async function POST(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const { id } = req.params
    const { warranty_id } = req.body as { warranty_id: string }
    const query = req.scope.resolve("query")
    const link = req.scope.resolve("link")

    const { data } = await query.graph({
        entity: "product",
        fields: ["id", "warranty.id"],
        filters: { id },
    }) as { data: any[] }

    const product = data?.[0]

    if (product?.warranty) {
        const warranties = Array.isArray(product.warranty)
            ? product.warranty
            : [product.warranty]

        const yaExiste = warranties.some((w) => w.id === warranty_id)
        if (yaExiste) {
            return res.json({ success: true, message: "Ya tiene esa garantía asignada" })
        }

        await link.dismiss(
            warranties.map((w) => ({
                product: { product_id: id },
                warranty: { warranty_id: w.id },
            }))
        )
    }

    await link.create([
        {
            product: { product_id: id },
            warranty: { warranty_id },
        },
    ])

    res.json({ success: true })
}
