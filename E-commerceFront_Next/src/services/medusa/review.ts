import { medusaFetch } from "./client";

export interface ReviewData {
    id: string;
    rating: number;
    content: string;
    customer_name: string;
    customer_id?: string;
    created_at: string;
}

export async function createReview(productId: string, data: { rating: number, content: string, customer_name: string, customer_id?: string }) {
    return medusaFetch<{ review: ReviewData }>(`/store/products/${productId}/reviews`, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export async function getReviews(productId: string) {
    const response = await medusaFetch<{ reviews: ReviewData[], average_rating?: number }>(`/store/products/${productId}/reviews`, {
        method: "GET"
    });
    return response;
}

export async function getPlatformReviews() {
    const response = await medusaFetch<{ reviews: ReviewData[], average_rating?: number }>(`/store/reviews`, {
        method: "GET"
    });
    return response;
}

export async function createPlatformReview(data: { rating: number, content: string, customer_name: string, customer_id?: string }) {
    return medusaFetch<{ review: ReviewData }>(`/store/reviews`, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export async function updatePlatformReview(reviewId: string, data: { rating: number, content: string, customer_name: string, customer_id?: string }) {
    return medusaFetch<{ review: ReviewData }>(`/store/reviews/${reviewId}`, {
        method: "PUT",
        body: JSON.stringify(data)
    });
}

export async function deletePlatformReview(reviewId: string) {
    return medusaFetch<{ success: boolean }>(`/store/reviews/${reviewId}`, {
        method: "DELETE"
    });
}

export async function getCustomerReviews(customerId: string) {
    return medusaFetch<{ reviews: ReviewData[] }>(`/store/my-reviews?customer_id=${customerId}`, {
        method: "GET"
    });
}
