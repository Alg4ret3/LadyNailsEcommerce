import {
  Container,
  Heading,
  Text,
  Select,
  Button,
  Badge
} from "@medusajs/ui"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { 
  Users, 
  BarsThree, 
  ShoppingCart, 
  CurrencyDollar 
} from "@medusajs/icons"
import { useEffect, useState } from "react"
// Helper hook to detect theme in Medusa Admin
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark')
      setTheme(isDark ? 'dark' : 'light')
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  return { theme }
}
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts"

type OrderSummary = {
  ordersByPeriod: Array<{ period: string; count: number }>
  totalRevenue: number
  totalOrders: number
  period: string
}

type ProductSales = {
  products: Array<{
    product_id: string
    title: string
    thumbnail?: string
    total_quantity: number
  }>
  type: string
  limit: number
}

type CustomerRegistrations = {
  registrationsByPeriod: Array<{ period: string; count: number }>
  totalNewCustomers: number
  period: string
}

export default function ReportsPage() {
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null)
  const [topSelling, setTopSelling] = useState<ProductSales | null>(null)
  const [leastSelling, setLeastSelling] = useState<ProductSales | null>(null)
  const [customerRegistrations, setCustomerRegistrations] = useState<CustomerRegistrations | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('month')
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const CHART_COLORS = {
    primary: isDark ? '#8884d8' : '#8884d8',
    secondary: isDark ? '#82ca9d' : '#82ca9d',
    text: isDark ? '#ffffff' : '#374151',
    background: isDark ? '#1f2937' : '#ffffff',
    border: isDark ? '#374151' : '#d1d5db',
    card: isDark ? '#111827' : '#ffffff',
    muted: isDark ? '#9ca3af' : '#6b7280',
    accent1: isDark ? '#00c49f' : '#0088fe',
    accent2: isDark ? '#ffc658' : '#ff8042',
  }

  const CUSTOM_TOOLTIP_STYLE = {
    backgroundColor: CHART_COLORS.background,
    border: `1px solid ${CHART_COLORS.border}`,
  }

  const loadReports = async () => {
    setLoading(true)
    try {
      const [
        orderRes,
        topSellingRes,
        leastSellingRes,
        customerRes
      ] = await Promise.all([
        fetch(`/admin/reports/orders/summary?period=${period}`),
        fetch('/admin/reports/products/top-selling'),
        fetch('/admin/reports/products/least-selling'),
        fetch(`/admin/reports/customers/new-registrations?period=${period}`)
      ])

      if (orderRes.ok) {
        const orderData = await orderRes.json()
        setOrderSummary(orderData)
      }

      if (topSellingRes.ok) {
        const topData = await topSellingRes.json()
        setTopSelling(topData)
      }

      if (leastSellingRes.ok) {
        const leastData = await leastSellingRes.json()
        setLeastSelling(leastData)
      }

      if (customerRes.ok) {
        const customerData = await customerRes.json()
        setCustomerRegistrations(customerData)
      }
    } catch (error) {
      console.error('Error loading reports:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [period])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount)
  }

  return (
    <Container className={`divide-y p-0 overflow-hidden ${isDark ? 'bg-gray-900 text-white' : ''}`}>
      <div className="flex flex-col gap-y-4 md:flex-row md:items-center md:justify-between px-6 py-4">
        <Heading level="h1">Reportes de la Tienda</Heading>
        <div className="flex items-center gap-2">
          <Text className="text-sm text-ui-fg-subtle">Período:</Text>
          <Select value={period} onValueChange={setPeriod}>
            <Select.Trigger className="w-[120px]">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="day">Diario</Select.Item>
              <Select.Item value="month">Mensual</Select.Item>
              <Select.Item value="year">Anual</Select.Item>
            </Select.Content>
          </Select>
          <Button variant="secondary" onClick={loadReports}>
            Actualizar
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Text>Cargando reportes...</Text>
        </div>
      ) : (
        <div className="px-6 py-4 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Orders */}
            <div className={`border rounded-lg p-4 shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-ui-fg-subtle'}`}>Órdenes Totales</Text>
                  <Text className="text-2xl font-bold">{orderSummary?.totalOrders || 0}</Text>
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className={`border rounded-lg p-4 shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CurrencyDollar className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-ui-fg-subtle'}`}>Ingresos Totales</Text>
                  <Text className="text-2xl font-bold text-green-400">{formatCurrency(orderSummary?.totalRevenue || 0)}</Text>
                </div>
              </div>
            </div>

            {/* New Customers */}
            <div className={`border rounded-lg p-4 shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-ui-fg-subtle'}`}>Nuevos Clientes</Text>
                  <Text className="text-2xl font-bold text-purple-400">{customerRegistrations?.totalNewCustomers || 0}</Text>
                </div>
              </div>
            </div>

            {/* Products Sold */}
            <div className={`border rounded-lg p-4 shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <BarsThree className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-ui-fg-subtle'}`}>Productos Vendidos</Text>
                  <Text className="text-2xl font-bold text-orange-400">
                    {(topSelling?.products || []).reduce((sum, p) => sum + p.total_quantity, 0)}
                  </Text>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders Over Time */}
            <div className={`border rounded-lg p-6 shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="mb-4">
                <Heading level="h3">Órdenes por {period === 'day' ? 'Día' : period === 'month' ? 'Mes' : 'Año'}</Heading>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={orderSummary?.ordersByPeriod || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
                    <XAxis 
                      dataKey="period" 
                      stroke={CHART_COLORS.text}
                      tick={{ fill: CHART_COLORS.text }} 
                    />
                    <YAxis 
                      stroke={CHART_COLORS.text}
                      tick={{ fill: CHART_COLORS.text }}
                    />
                    <Tooltip 
                      contentStyle={CUSTOM_TOOLTIP_STYLE}
                      labelStyle={{ color: CHART_COLORS.text }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke={CHART_COLORS.primary}
                      strokeWidth={2}
                      dot={{ fill: CHART_COLORS.primary }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Customer Registrations */}
            <div className={`border rounded-lg p-6 shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="mb-4">
                <Heading level="h3">Nuevos Clientes por {period === 'day' ? 'Día' : period === 'month' ? 'Mes' : 'Año'}</Heading>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={customerRegistrations?.registrationsByPeriod || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
                    <XAxis 
                      dataKey="period" 
                      stroke={CHART_COLORS.text}
                      tick={{ fill: CHART_COLORS.text }} 
                    />
                    <YAxis 
                      stroke={CHART_COLORS.text}
                      tick={{ fill: CHART_COLORS.text }}
                    />
                    <Tooltip 
                      contentStyle={CUSTOM_TOOLTIP_STYLE}
                      labelStyle={{ color: CHART_COLORS.text }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke={CHART_COLORS.secondary}
                      strokeWidth={2}
                      dot={{ fill: CHART_COLORS.secondary }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Products Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Selling Products */}
            <div className={`border rounded-lg p-6 shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="mb-4">
                <Heading level="h3">Productos Más Vendidos</Heading>
              </div>
              <div className="space-y-3">
                {topSelling?.products.map((product, index) => (
                  <div key={product.product_id} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <Badge color="grey" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </Badge>
                      <div>
                        <Text className={`font-medium ${isDark ? 'text-white' : ''}`}>{product.title}</Text>
                        <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-ui-fg-subtle'}`}>{product.total_quantity} unidades</Text>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Least Selling Products */}
            <div className={`border rounded-lg p-6 shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="mb-4">
                <Heading level="h3">Productos Menos Vendidos</Heading>
              </div>
              <div className="space-y-3">
                {leastSelling?.products.map((product, index) => (
                  <div key={product.product_id} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <Badge color="grey" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </Badge>
                      <div>
                        <Text className={`font-medium ${isDark ? 'text-white' : ''}`}>{product.title}</Text>
                        <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-ui-fg-subtle'}`}>{product.total_quantity} unidades</Text>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Reportes",
})