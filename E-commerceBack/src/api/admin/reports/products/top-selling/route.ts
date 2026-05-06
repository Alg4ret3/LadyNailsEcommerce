import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

// GET /admin/reports/products/top-selling
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { limit = 5, type = 'top', startDate, endDate } = req.query;
  
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

    console.log(`[ProductsReport] Found ${orders.length} orders`);
    if (orders.length > 0 && orders[0].items?.length > 0) {
      console.log(`[ProductsReport] Sample item:`, JSON.stringify(orders[0].items[0], null, 2));
    }

    // Aggregate sales by product
    const productSales = new Map();

    for (const order of orders) {
      for (const item of (order.items || [])) {
        const productId = item.product_id;
        if (!productId) continue;

        // Medusa v2 quantity might be in item.quantity
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

    // Sort and limit results
    const sortedProducts = Array.from(productSales.values())
      .sort((a, b) => type === 'top'
        ? b.total_quantity - a.total_quantity
        : a.total_quantity - b.total_quantity
      )
      .slice(0, parseInt(limit as string));

    res.json({
      products: sortedProducts,
      type: type as string,
      limit: parseInt(limit as string)
    });
  } catch (error: any) {
    console.error("Error fetching product sales:", error.message);
    res.status(500).json({ error: error.message });
  }
}