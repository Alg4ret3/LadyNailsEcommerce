import { medusaFetch } from "./client";
import { CustomerData } from "./auth";

/* ============================= */
/* TYPES */
/* ============================= */

export interface CreateAddressInput {
    address_name: string;
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    country_code: string;
    province?: string;
    postal_code?: string;
    phone?: string;
    company?: string;
    metadata?: Record<string, any>;
}

export interface CustomerAddress {
    id: string;
    address_name?: string;
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    country_code: string;
    province?: string;
    postal_code?: string;
    phone?: string;
    company?: string;
    metadata?: Record<string, any>;
}

export interface CustomerResponse {
    customer: CustomerData;
}

/* ============================= */
/* CREATE ADDRESS */
/* ============================= */

export async function createCustomerAddress(data: CreateAddressInput) {
    return medusaFetch<CustomerResponse>("/store/customers/me/addresses", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

/* ============================= */
/* LIST ADDRESSES */
/* ============================= */

export async function listCustomerAddresses() {
    return medusaFetch<CustomerResponse>("/store/customers/me", {
        method: "GET",
    });
}

/* ============================= */
/* DELETE ADDRESS */
/* ============================= */

export async function deleteCustomerAddress(addressId: string) {
    return medusaFetch(`/store/customers/me/addresses/${addressId}`, {
        method: "DELETE",
    });
}

/* ============================= */
/* UPDATE ADDRESS */
/* ============================= */

export async function updateCustomerAddress(
  addressId: string,
  data: {
    address_name?: string;
    first_name?: string;
    last_name?: string;
    address_1?: string;
    city?: string;
    country_code?: string;
    province?: string;
    postal_code?: string;
    phone?: string;
    company?: string;
  }
) {
  return medusaFetch(
    `/store/customers/me/addresses/${addressId}`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}
