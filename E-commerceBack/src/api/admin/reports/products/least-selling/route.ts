import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

// GET /admin/reports/products/least-selling
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { limit = 5, startDate, endDate } = req.query;

  try {
    const query = req.scope.resolve("query");

    // Build date filter
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        created_at: {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string)
        }
      };
    }

    // Get orders with items
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "status",
        "items.*",
        "items.variant.product.title",
        "items.variant.product.thumbnail"
      ],
      filters: {
        status: {
          $in: ["pending", "completed", "archived"]
        },
        ...dateFilter
      }
    }) as { data: any[] };

    // Aggregate sales by product
    const productSales = new Map();

    for (const order of orders) {
      for (const item of (order.items || [])) {
        const productId = item.product_id;
        if (!productId) continue;

        const quantity = Number(item.quantity || 0);
        const title = item.variant?.product?.title || item.title || 'Unknown Product';
        const thumbnail = item.variant?.product?.thumbnail;

        if (!productSales.has(productId)) {
          productSales.set(productId, {
            product_id: productId,
            title: title,
            thumbnail: thumbnail,
            total_quantity: 0
          });
        }

        const product = productSales.get(productId);
        product.total_quantity += quantity;
      }
    }

    // Sort by least selling and limit results
    const sortedProducts = Array.from(productSales.values())
      .sort((a, b) => a.total_quantity - b.total_quantity)
      .slice(0, parseInt(limit as string));

    res.json({
      products: sortedProducts,
      limit: parseInt(limit as string)
    });
  } catch (error: any) {
    console.error("Error fetching least selling products:", error.message);
    res.status(500).json({ error: error.message });
  }
}