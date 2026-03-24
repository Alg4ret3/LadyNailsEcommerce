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
    return response;
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    throw error;
  }
}

/**
 * Obtiene el detalle de un carrito.
 */
export async function getCart(cartId: string): Promise<CreateCartResponse> {
  try {
    const response = await medusaFetch<CreateCartResponse>(`/store/carts/${cartId}`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    throw error;
  }
}

/**
 * Asocia un carrito existente al cliente autenticado.
 */
export async function associateCartToCustomer(cartId: string): Promise<CreateCartResponse> {
  try {
    const response = await medusaFetch<CreateCartResponse>(`/store/carts/${cartId}/customer`, {
      method: "POST",
    });
    return response;
  } catch (error) {
    console.error("Error al asociar el carrito al cliente:", error);
    throw error;
  }
}

/**
 * Añade un item al carrito.
 */
export async function addItemToCart(cartId: string, variantId: string, quantity: number): Promise<CreateCartResponse> {
  try {
    const body = {
      variant_id: variantId,
      quantity,
    };

    const response = await medusaFetch<CreateCartResponse>(`/store/carts/${cartId}/line-items`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    return response;
  } catch (error) {
    console.error(`Error al añadir variante ${variantId} al carrito:`, error);
    throw error;
  }
}

export interface MedusaAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  country_code: string;
  province?: string;
  postal_code?: string;
  phone?: string;
}

/**
 * Actualiza la dirección del carrito.
 */
export async function updateCartAddress(cartId: string, address: MedusaAddress): Promise<CreateCartResponse> {
  try {
    const body = {
      shipping_address: address,
      billing_address: address,
    };

    const response = await medusaFetch<CreateCartResponse>(`/store/carts/${cartId}`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    return response;
  } catch (error) {
    console.error("Error al actualizar la dirección en el carrito:", error);
    throw error;
  }
}

export interface ShippingOption {
  id: string;
  name: string;
  price_type: string;
  amount: number;
  [key: string]: any;
}

/**
 * Obtiene las opciones de envío disponibles para el carrito.
 */
export async function getShippingOptions(cartId: string): Promise<{ shipping_options: ShippingOption[] }> {
  try {
    const response = await medusaFetch<{ shipping_options: ShippingOption[] }>(`/store/shipping-options`, {
      method: "GET"
    }, { cart_id: cartId });
    return response;
  } catch (error) {
    console.error("Error al obtener opciones de envío:", error);
    throw error;
  }
}

/**
 * Añade un método de envío al carrito.
 */
export async function addShippingMethodToCart(cartId: string, optionId: string): Promise<CreateCartResponse> {
  try {
    const body = {
      option_id: optionId,
    };

    const response = await medusaFetch<CreateCartResponse>(`/store/carts/${cartId}/shipping-methods`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    return response;
  } catch (error) {
    console.error("Error al añadir el método de envío al carrito:", error);
    throw error;
  }
}

export interface PaymentCollection {
  id: string;
  amount: number;
  payment_sessions?: any[];
  [key: string]: any;
}

/**
 * Inicializa la colección de pagos para el carrito.
 */
export async function createPaymentCollection(cartId: string): Promise<{ payment_collection: PaymentCollection }> {
  try {
    const response = await medusaFetch<{ payment_collection: PaymentCollection }>(`/store/payment-collections`, {
      method: "POST",
      body: JSON.stringify({ cart_id: cartId }),
    });
    return response;
  } catch (error) {
    console.error("Error al crear colección de pagos:", error);
    throw error;
  }
}

/**
 * Crea una sesión de pago.
 */
export async function createPaymentSession(collectionId: string, providerId: string): Promise<{ payment_collection: PaymentCollection }> {
  try {
    const response = await medusaFetch<{ payment_collection: PaymentCollection }>(`/store/payment-collections/${collectionId}/payment-sessions`, {
      method: "POST",
      body: JSON.stringify({ provider_id: providerId }),
    });
    return response;
  } catch (error) {
    console.error("Error al crear sesión de pago:", error);
    throw error;
  }
}

/**
 * Elimina un item del carrito.
 */
export async function deleteLineItem(cartId: string, lineId: string): Promise<CreateCartResponse> {
  try {
    const response = await medusaFetch<CreateCartResponse>(`/store/carts/${cartId}/line-items/${lineId}`, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.error(`Error al eliminar line item ${lineId}:`, error);
    throw error;
  }
}

/**
 * Actualiza la cantidad de un item en el carrito.
 */
export async function updateLineItem(cartId: string, lineId: string, quantity: number): Promise<CreateCartResponse> {
  try {
    const response = await medusaFetch<CreateCartResponse>(`/store/carts/${cartId}/line-items/${lineId}`, {
      method: "POST",
      body: JSON.stringify({ quantity }),
    });
    return response;
  } catch (error) {
    console.error(`Error al actualizar line item ${lineId}:`, error);
    throw error;
  }
}

/**
 * Completa el carrito y crea la orden final.
 */
export async function completeCart(cartId: string): Promise<any> {
  try {
    const response = await medusaFetch<any>(`/store/carts/${cartId}/complete`, {
      method: "POST",
    });
    return response;
  } catch (error) {
    console.error("Error al completar el carrito:", error);
    throw error;
  }
}
