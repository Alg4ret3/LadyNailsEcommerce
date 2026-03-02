const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export async function medusaFetch<T>(
  path: string,
  options: RequestInit = {},
  query?: Record<string, string | string[]>,
): Promise<T> {
  const url = new URL(path, MEDUSA_BACKEND_URL)

  if(query){
    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v))
      } else {
        url.searchParams.append(key, value)
      }
    })
  }

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("auth_token")
      : null;

  const headers = new Headers(options.headers);

  // Set Content-Type if body exists
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Add auth token if exists
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Always send publishable key
  headers.set("x-publishable-api-key", MEDUSA_PUBLISHABLE_KEY);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
      cache: "no-store",
    });

    const text = await res.text();

    if (!res.ok) {
      try {
        const json = text ? JSON.parse(text) : null;
        throw new Error(json?.message || `HTTP Error ${res.status}`);
      } catch {
        throw new Error(text || `HTTP Error ${res.status}`);
      }
    }

    try {
      return text ? JSON.parse(text) : ({} as T);
    } catch {
      return {} as T;
    }

  } catch (error: any) {
    if (error.name === "TypeError" && error.message === "Failed to fetch") {
      throw new Error(
        `No se pudo conectar con el servidor en ${MEDUSA_BACKEND_URL}. ¿Está el backend corriendo?`
      );
    }
    throw error;
  }
}
