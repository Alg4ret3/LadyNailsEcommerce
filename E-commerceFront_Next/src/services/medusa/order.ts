import { medusaFetch } from "./client";

export async function getOrder(orderId: string): Promise<any> {
  try {
    const response = await medusaFetch<any>(`/store/orders/${orderId}`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error(`Error al obtener la orden ${orderId}:`, error);
    throw error;
  }
}
