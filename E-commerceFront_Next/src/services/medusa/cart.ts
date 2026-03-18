import { medusaFetch } from "./client";

export interface CreateCartResponse {
  cart: {
    id: string;
    region_id: string;
    sales_channel_id: string;
    customer_id?: string;
    email?: string;
    items: any[];
    [key: string]: any;
  };
}

/**
 * Crea un carrito en la tienda de Medusa.
 * 
 * 1. Siempre usa un body fijo con `region_id` y `sales_channel_id`.
 * 2. `medusaFetch` ya maneja dinámicamente la detección del token en localStorage:
 *    - Si el usuario está autenticado, `medusaFetch` detecta el token y envía el header `Authorization: Bearer <token>`.
 *    - Si no está autenticado, NO envía el header de Authorization.
 */
export async function createCart(): Promise<CreateCartResponse> {
  try {
    const body = {
      region_id: "reg_01KHMA1TDSX5N1PNXX04K3ZJGC",
      sales_channel_id: "sc_01KK9QJ37HY07F3A59DNZJXR6F",
    };

    const response = await medusaFetch<CreateCartResponse>("/store/carts", {
      method: "POST",
      body: JSON.stringify(body),
    });
    console.log("Carrito creado:", response.cart);
    return response;
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    throw error;
  }
}

/**
 * Asocia un carrito existente al cliente autenticado.
 * 
 * Este método resuelve el escenario donde el usuario crea el carrito
 * estando no autenticado y posteriormente inicia sesión. Al enviar una petición
 * de actualización al carrito con el token Auth, Medusa lo asocia automáticamente.
 * 
 * @param cartId El ID del carrito a asociar
 */
export async function associateCartToCustomer(cartId: string): Promise<CreateCartResponse> {
  try {
    // Al hacer una petición de actualización (POST /store/carts/:id) enviando
    // el token en los headers (manejado por medusaFetch), Medusa asocia el carrito
    // al cliente dueño del token.
    const response = await medusaFetch<CreateCartResponse>(`/store/carts/${cartId}/customer`, {
      method: "POST",
    });

    return response;
  } catch (error) {
    console.error("Error al asociar el carrito al cliente:", error);
    throw error;
  }
}
