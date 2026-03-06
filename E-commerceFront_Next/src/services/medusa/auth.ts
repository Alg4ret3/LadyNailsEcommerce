import { medusaFetch } from "./client";

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface CustomerData {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    has_account: boolean;
    addresses: Array<{
        id: string;
        first_name: string | null;
        last_name: string | null;
        address_1: string | null;
        address_2: string | null;
        city: string | null;
        country_code: string | null;
        province: string | null;
        postal_code: string | null;
        phone: string | null;
        metadata: Record<string, unknown> | null;
    }>;
    created_at: string;
    updated_at: string;
}

export interface AuthError extends Error {
    code?: string;
    statusCode?: number;
}

/**
 * Login customer usando el endpoint correcto de Medusa
 */
export async function loginCustomer(
    data: LoginData
): Promise<{ customer: CustomerData; token: string }> {

    const authResponse = await medusaFetch<{ token: string }>(
        "/auth/customer/emailpass",
        {
            method: "POST",
            body: JSON.stringify(data),
        }
    );

    const token = authResponse.token;

    const profileResponse = await medusaFetch<{ customer: CustomerData }>(
        "/store/customers/me",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return {
        customer: profileResponse.customer,
        token,
    };
}

/**
 * Get current authenticated customer
 */
export async function getCurrentCustomer(): Promise<CustomerData | null> {
    try {
        const response = await medusaFetch<{ customer: CustomerData }>(
            "/store/customers/me",
        );
        return response.customer;
    } catch (error: any) {
        // Si el error es 401, significa que no está autenticado
        if (
            error.message?.includes("401") ||
            error.message?.includes("Unauthorized") ||
            error.message?.includes("permiso") ||
            error.message?.includes("Inicia sesión")
        ) {
            return null;
        }
        console.error("Get current customer error:", error);
        return null;
    }
}

/**
 * Logout customer
 */
export async function logoutCustomer(): Promise<void> {
    try {
        await medusaFetch("/auth/customer/emailpass", {
            method: "DELETE",
        });
    } catch (error) {
        console.error("Logout error:", error);
        // No lanzar error en logout, solo registrar
    }
}

/**
 * Register a new customer - Flujo estándar de Medusa
 */
export async function registerCustomer(
    data: RegisterData,
): Promise<CustomerData> {
    try {
        // Paso 1: Registrar credenciales con el auth provider
        const authResponse = await medusaFetch<{ token: string }>(
            "/auth/customer/emailpass/register",
            {
                method: "POST",
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            },
        );

        const token = authResponse.token;

        if (!token) {
            throw new Error("No se pudo obtener el token de registro");
        }

        // Paso 2: Crear el perfil del cliente usando el token
        const customerResponse = await medusaFetch<{ customer: CustomerData }>(
            "/store/customers",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: data.email,
                    first_name: data.firstName,
                    last_name: data.lastName,
                    phone: data.phone,
                }),
            },
        );

        return customerResponse.customer;
    } catch (error: any) {
        console.error("Registration error:", error);

        let errorMessage =
            "Error al registrar usuario. Por favor intente nuevamente.";

        if (
            error.message?.includes("already exists") ||
            error.message?.includes("duplicate") ||
            error.message?.includes("409")
        ) {
            errorMessage = "Este email ya está registrado. Por favor inicie sesión.";
        } else if (error.message?.includes("servidor")) {
            errorMessage = error.message;
        } else if (error.message && !error.message.includes("HTTP Error")) {
            errorMessage = error.message;
        }

        const authError: AuthError = new Error(errorMessage);
        authError.code = error.code;
        throw authError;
    }
}

/**
 * Update customer profile
 */
export async function updateCustomer(
    data: Partial<{
        first_name: string;
        last_name: string;
        phone: string;
    }>,
): Promise<CustomerData> {
    try {
        const response = await medusaFetch<{ customer: CustomerData }>(
            "/store/customers/me",
            {
                method: "POST",
                body: JSON.stringify(data),
            },
        );
        return response.customer;
    } catch (error: any) {
        console.error("Update customer error:", error);
        throw new Error(
            "Error al actualizar perfil. Por favor intente nuevamente.",
        );
    }
}

/**
 * Custom Auth: Send OTP
 */
export async function sendOtp(email: string): Promise<void> {
    try {
        await medusaFetch("/store/custom-auth/send-otp", {
            method: "POST",
            body: JSON.stringify({ email }),
        });
    } catch (error: any) {
        console.error("Send OTP error:", error);

        let errorMessage =
            "Error al enviar código de verificación. Por favor intente nuevamente.";

        if (
            error.message?.includes("already exists") ||
            error.message?.includes("409")
        ) {
            errorMessage = "Este email ya está registrado. Por favor inicie sesión.";
        } else if (error.message?.includes("servidor")) {
            errorMessage = error.message;
        } else if (error.message && !error.message.includes("HTTP Error")) {
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
}

/**
 * Custom Auth: Verify OTP
 */
export async function verifyOtp(
    email: string,
    code: string,
): Promise<{ verified: boolean }> {
    try {
        return await medusaFetch<{ verified: boolean }>(
            "/store/custom-auth/verify-otp",
            {
                method: "POST",
                body: JSON.stringify({ email, code }),
            },
        );
    } catch (error: any) {
        console.error("Verify OTP error:", error);

        let errorMessage = "Error al verificar código.";

        if (
            error.message?.includes("invalid") ||
            error.message?.includes("expired") ||
            error.message?.includes("401")
        ) {
            errorMessage = "Código inválido o expirado.";
        }

        throw new Error(errorMessage);
    }
}

/**
 * Custom Auth: Complete Registration
 */
export async function registerCustom(
    data: RegisterData & { token: string },
): Promise<CustomerData> {
    try {
        const response = await medusaFetch<{ customer: CustomerData }>(
            "/store/custom-auth/register",
            {
                method: "POST",
                body: JSON.stringify({
                    token: data.token,
                    password: data.password,
                    first_name: data.firstName,
                    last_name: data.lastName,
                }),
            },
        );

        if (!response.customer) {
            throw new Error("No se recibió información del cliente");
        }

        return response.customer;
    } catch (error: any) {
        console.error("Custom registration error:", error);

        let errorMessage =
            "Error al completar registro. Por favor intente nuevamente.";

        if (
            error.message?.includes("token") ||
            error.message?.includes("401") ||
            error.message?.includes("invalid")
        ) {
            errorMessage =
                "Token de verificación inválido. Por favor inicie el proceso nuevamente.";
        } else if (error.message?.includes("servidor")) {
            errorMessage = error.message;
        } else if (error.message && !error.message.includes("HTTP Error")) {
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
}

/**
 * Verify if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const customer = await getCurrentCustomer();
    return customer !== null;
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<void> {
    try {
        await medusaFetch(
            "/auth/customer/emailpass/reset-password",
            {
                method: "POST",
                body: JSON.stringify({
                    identifier: email,
                }),
            }
        );

        // ⚠️ Nunca revelamos si el email existe o no
    } catch (error: any) {
        console.error("Password reset request error:", error);

        throw new Error(
            "No se pudo procesar la solicitud. Intente nuevamente."
        );
    }
}

/**
 * Update password using reset token
 */
export async function updatePasswordWithToken(data: {
    email: string;
    token: string;
    password: string;
}): Promise<void> {
    try {
        await medusaFetch(
            "/auth/customer/emailpass/update",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${data.token}`, // 🔥 token correcto aquí
                },
                body: JSON.stringify({
                    identifier: data.email,
                    password: data.password,
                }),
            }
        );
    } catch (error: any) {
        console.error("Update password error:", error);

        let errorMessage = "Token inválido o expirado.";

        if (
            error.message?.includes("expired") ||
            error.message?.includes("invalid") ||
            error.message?.includes("401")
        ) {
            errorMessage = "El enlace de recuperación es inválido o ha expirado.";
        }

        throw new Error(errorMessage);
    }
}