import { medusaFetch } from "./client";

export interface AttributeData {
    id: string;
    name: string;
}

export async function getBrands(): Promise<AttributeData[]> {
    const response = await medusaFetch<{ brands: AttributeData[] }>(
        "/store/brands",
    );
    return response.brands;
}

export async function getWarranties(): Promise<AttributeData[]> {
    const response = await medusaFetch<{ warranties: AttributeData[] }>(
        "/store/warranties",
    );
    return response.warranties;
}

export async function getUsages(): Promise<AttributeData[]> {
    const response = await medusaFetch<{ usages: AttributeData[] }>(
        "/store/usages",
    );
    return response.usages;
}

export async function getShippings(): Promise<AttributeData[]> {
    const response = await medusaFetch<{ shippings: AttributeData[] }>(
        "/store/shippings",
    );
    return response.shippings;
}
