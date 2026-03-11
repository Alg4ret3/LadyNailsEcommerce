import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const { id } = req.params
    const query = req.scope.resolve("query")

    const { data } = await query.graph({
        entity: "product",
        fields: ["id", "usage.*"],
        filters: { id },
    }) as { data: any[] }

    res.json({
        usage: data?.[0]?.usage ?? null,
    })
}

export async function POST(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const { id } = req.params
    const { usage_id } = req.body as { usage_id: string }
    const query = req.scope.resolve("query")
    const link = req.scope.resolve("link")

    const { data } = await query.graph({
        entity: "product",
        fields: ["id", "usage.id"],
        filters: { id },
    }) as { data: any[] }

    const product = data?.[0]

    if (product?.usage) {
        const usages = Array.isArray(product.usage)
            ? product.usage
            : [product.usage]

        const yaExiste = usages.some((u) => u.id === usage_id)
        if (yaExiste) {
            return res.json({ success: true, message: "Ya tiene ese modo de uso asignado" })
        }

        await link.dismiss(
            usages.map((u) => ({
                product: { product_id: id },
                usage: { usage_id: u.id },
            }))
        )
    }

    await link.create([
        {
            product: { product_id: id },
            usage: { usage_id },
        },
    ])

    res.json({ success: true })
}
