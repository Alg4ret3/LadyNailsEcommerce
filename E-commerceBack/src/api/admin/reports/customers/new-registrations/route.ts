import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

// GET /admin/reports/customers/new-registrations
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

    // Get customers with creation dates
    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id", "email", "created_at"],
      filters: dateFilter
    }) as { data: any[] };

    // Aggregate new registrations by period
    const registrationsByPeriod = new Map();

    for (const customer of customers) {
      const date = new Date(customer.created_at);
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

      if (!registrationsByPeriod.has(periodKey)) {
        registrationsByPeriod.set(periodKey, 0);
      }

      registrationsByPeriod.set(periodKey, registrationsByPeriod.get(periodKey) + 1);
    }

    // Convert to array and sort by period
    const sortedRegistrations = Array.from(registrationsByPeriod.entries())
      .map(([period, count]) => ({ period, count }))
      .sort((a, b) => a.period.localeCompare(b.period));

    // Get total new customers
    const totalNewCustomers = customers.length;

    res.json({
      registrationsByPeriod: sortedRegistrations,
      totalNewCustomers,
      period: period as string
    });
  } catch (error: any) {
    console.error("Error fetching customer registrations:", error.message);
    res.status(500).json({ error: error.message });
  }
}