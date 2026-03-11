import { medusaFetch } from "./client";

export interface ReviewData {
    id: string;
    rating: number;
    content: string;
}

export async function createReview(productId: string, data: { rating: number, content: string }) {
    return medusaFetch<{ review: ReviewData }>(`/store/products/${productId}/reviews`, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

