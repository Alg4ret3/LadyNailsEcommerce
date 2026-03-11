import { medusaFetch } from "./client";

export interface ReviewData {
    id: string;
    rating: number;
    content: string;
    customer_name: string;
    created_at: string;
}

export async function createReview(productId: string, data: { rating: number, content: string, customer_name: string }) {
    return medusaFetch<{ review: ReviewData }>(`/store/products/${productId}/reviews`, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export async function getReviews(productId: string) {
    const response = await medusaFetch<{ reviews: ReviewData[] }>(`/store/products/${productId}/reviews`, {
        method: "GET"
    });
    return response.reviews;
}

