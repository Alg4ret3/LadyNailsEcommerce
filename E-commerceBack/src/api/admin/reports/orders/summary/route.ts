import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

// GET /admin/reports/orders/summary
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { period = 'month', startDate, endDate } = req.query;

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

    // Get orders with summary
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "status",
        "created_at",
        "total",
        "summary.*"
      ],
      filters: {
        status: {
          $in: ["pending", "completed", "archived"]
        },
        ...dateFilter
      }
    }) as { data: any[] };

    // Aggregate orders by period and calculate revenue
    const ordersByPeriod = new Map();
    let totalRevenue = 0;

    for (const order of orders) {
      const date = new Date(order.created_at);
      let periodKey;

      switch (period) {
        case 'day':
          periodKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
          break;
        case 'month':
          periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
          break;
        case 'year':
          periodKey = date.getFullYear().toString(); // YYYY
          break;
        default:
          periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      if (!ordersByPeriod.has(periodKey)) {
        ordersByPeriod.set(periodKey, 0);
      }

      ordersByPeriod.set(periodKey, ordersByPeriod.get(periodKey) + 1);

      // Calculate total revenue from paid_total in summary
      totalRevenue += Number(order.summary?.paid_total || 0);
    }

    // Convert to array and sort by period
    const sortedOrdersByPeriod = Array.from(ordersByPeriod.entries())
      .map(([period, count]) => ({ period, count }))
      .sort((a, b) => a.period.localeCompare(b.period));

    res.json({
      ordersByPeriod: sortedOrdersByPeriod,
      totalRevenue,
      totalOrders: orders.length,
      period: period as string
    });
  } catch (error: any) {
    console.error('Error fetching order summary:', error.message);
    res.status(500).json({ error: error.message });
  }
}
