import { medusaFetch } from "./client";

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactRequest(payload: ContactPayload) {
  return await medusaFetch<{ success: boolean; message: string }>(
    "store/contact",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}
