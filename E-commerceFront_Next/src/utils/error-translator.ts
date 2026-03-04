/**
 * Utility to translate common Medusa backend errors and system errors to Spanish.
 */
export const translateError = (message: string): string => {
  if (!message) return "Ocurrió un error inesperado. Intente de nuevo.";

  const lowMessage = message.toLowerCase();

  // Authentication Errors
  if (lowMessage.includes("invalid email or password")) {
    return "El correo electrónico o la contraseña son incorrectos.";
  }
  if (lowMessage.includes("unauthorized") || lowMessage.includes("401")) {
    return "No tienes permiso para realizar esta acción. Inicia sesión.";
  }
  if (lowMessage.includes("already exists") || lowMessage.includes("409")) {
    return "Esta cuenta ya está registrada.";
  }

  // Registration & Profile Errors
  if (lowMessage.includes("invalid email")) {
    return "El formato del correo electrónico no es válido.";
  }
  if (lowMessage.includes("password is too short")) {
    return "La contraseña es muy corta. Debe tener al menos 8 caracteres.";
  }

  // OTP Errors
  if (lowMessage.includes("invalid code") || lowMessage.includes("expired")) {
    return "El código de verificación es inválido o ha expirado.";
  }

  // Password Reset Errors
  if (lowMessage.includes("token invalid") || lowMessage.includes("token expired")) {
    return "El enlace de recuperación es inválido o ha expirado.";
  }

  // System / Connection Errors
  if (lowMessage.includes("failed to fetch") || lowMessage.includes("no se pudo conectar")) {
    return "Error de conexión. Verifique su internet o intente más tarde.";
  }
  if (lowMessage.includes("server error") || lowMessage.includes("500")) {
    return "Error interno del servidor. Por favor, inténtelo de nuevo más tarde.";
  }

  // Custom Frontend validation errors (if any passed through)
  if (lowMessage.includes("required")) {
    return "Este campo es obligatorio.";
  }

  // Fallback for unknown errors (return the original if it's already in Spanish or short)
  if (message.length < 50 && /[áéíóúñ]/i.test(message)) {
    return message;
  }

  return "Ocurrió un error al procesar su solicitud. Por favor intente de nuevo.";
};
