import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

// GET /admin/reports/products/least-selling
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { limit = 5 } = req.query;

  try {
    const query = req.scope.resolve("query");

    // Get order items with product information
    const { data: orderItems } = await query.graph({
      entity: "order_item",
      fields: [
        "quantity",
        "product_id",
        "product.title",
        "product.thumbnail",
        "order.status"
      ]
    }) as { data: any[] };

    // Filter completed or pending orders
    const completedOrderItems = orderItems.filter(item =>
      ['pending', 'completed', 'archived'].includes(item.order?.status)
    );

    // Aggregate sales by product
    const productSales = new Map();

    for (const item of completedOrderItems) {
      const productId = item.product_id;
      const quantity = item.quantity || 1;

      if (!productSales.has(productId)) {
        productSales.set(productId, {
          product_id: productId,
          title: item.product?.title || 'Unknown Product',
          thumbnail: item.product?.thumbnail,
          total_quantity: 0
        });
      }

      const product = productSales.get(productId);
      product.total_quantity += quantity;
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