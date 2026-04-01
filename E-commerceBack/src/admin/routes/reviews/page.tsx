import { 
  Container, 
  Heading, 
  Button, 
  Table, 
  StatusBadge,
  Select,
  Text
} from "@medusajs/ui"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Star } from "@medusajs/icons"
import { useEffect, useState } from "react"

type Review = {
  id: string
  rating: number
  content: string
  customer_name: string
  status: "pending" | "approved" | "rejected"
  created_at?: string
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  const loadReviews = async () => {
    setLoading(true)
    try {
      const res = await fetch("/admin/reviews")
      if (!res.ok) throw new Error("Error fetching reviews")
      const data = await res.json()
      setReviews(data.reviews || [])
    } catch (error) {
      console.error("Error loading reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [])

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/admin/reviews/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error("Error updating status")
      loadReviews()
    } catch (error) {
      console.error("Error updating review status:", error)
    }
  }

  const deleteReview = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta reseña?")) return
    try {
      const res = await fetch(`/admin/reviews/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Error deleting review")
      loadReviews()
    } catch (error) {
      console.error("Error deleting review:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "green"
      case "rejected":
        return "red"
      default:
        return "orange"
    }
  }

  return (
    <Container className="divide-y p-0 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h1">Reseñas de la Página</Heading>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Cliente</Table.HeaderCell>
            <Table.HeaderCell>Calificación</Table.HeaderCell>
            <Table.HeaderCell>Comentario</Table.HeaderCell>
            <Table.HeaderCell>Estado</Table.HeaderCell>
            <Table.HeaderCell>Fecha</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell className="text-center py-10">
                <Text>Cargando reseñas...</Text>
              </Table.Cell>
              <Table.Cell /><Table.Cell /><Table.Cell /><Table.Cell /><Table.Cell />
            </Table.Row>
          ) : reviews.length === 0 ? (
            <Table.Row>
              <Table.Cell className="text-center py-10">
                <Text>No hay reseñas registradas.</Text>
              </Table.Cell>
              <Table.Cell /><Table.Cell /><Table.Cell /><Table.Cell /><Table.Cell />
            </Table.Row>
          ) : (
            reviews.map((review) => (
              <Table.Row key={review.id}>
                <Table.Cell className="font-medium text-ui-fg-base">
                  {review.customer_name}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-1">
                    <Text>{review.rating}</Text>
                    <Star className="text-yellow-400" />
                  </div>
                </Table.Cell>
                <Table.Cell className="max-w-[300px]">
                  <Text className="truncate">{review.content}</Text>
                </Table.Cell>
                <Table.Cell>
                  <StatusBadge color={getStatusColor(review.status)}>
                    {review.status === "pending" ? "Pendiente" : 
                     review.status === "approved" ? "Aprobado" : "Rechazado"}
                  </StatusBadge>
                </Table.Cell>
                <Table.Cell>
                  <Text>
                    {review.created_at ? new Date(review.created_at).toLocaleDateString() : "-"}
                  </Text>
                </Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-x-2">
                    <Select 
                      size="small"
                      onValueChange={(value) => updateStatus(review.id, value)}
                      value={review.status}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder="Cambiar Estado" />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="pending">Pendiente</Select.Item>
                        <Select.Item value="approved">Aprobar</Select.Item>
                        <Select.Item value="rejected">Rechazar</Select.Item>
                      </Select.Content>
                    </Select>
                    <Button 
                      variant="secondary" 
                      onClick={() => deleteReview(review.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Reseñas",
  icon: Star,
})

