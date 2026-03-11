import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const { id } = req.params
    const query = req.scope.resolve("query")

    const { data } = await query.graph({
        entity: "product",
        fields: ["id", "shipping.*"],
        filters: { id },
    }) as { data: any[] }

    res.json({
        shipping: data?.[0]?.shipping ?? null,
    })
}

export async function POST(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const { id } = req.params
    const { shipping_id } = req.body as { shipping_id: string }
    const query = req.scope.resolve("query")
    const link = req.scope.resolve("link")

    const { data } = await query.graph({
        entity: "product",
        fields: ["id", "shipping.id"],
        filters: { id },
    }) as { data: any[] }

    const product = data?.[0]

    if (product?.shipping) {
        const shippings = Array.isArray(product.shipping)
            ? product.shipping
            : [product.shipping]

        const yaExiste = shippings.some((s) => s.id === shipping_id)
        if (yaExiste) {
            return res.json({ success: true, message: "Ya tiene ese tipo de envío asignado" })
        }

        await link.dismiss(
            shippings.map((s) => ({
                product: { product_id: id },
                shipping: { shipping_id: s.id },
            }))
        )
    }

    await link.create([
        {
            product: { product_id: id },
            shipping: { shipping_id },
        },
    ])

    res.json({ success: true })
}
