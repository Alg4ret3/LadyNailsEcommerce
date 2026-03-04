export const VALIDATION_RULES = {
  name: {
    regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/,
    message: 'Solo letras, mínimo 2 caracteres'
  },
  phone: {
    regex: /^\d{7,10}$/,
    message: 'Solo números, entre 7 y 10 dígitos'
  },
  email: {
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: 'Correo electrónico inválido'
  },
  password: {
    minChar: /.{8,}/,
    uppercase: /[A-Z]/,
    number: /[0-9]/,
    special: /[@$!%*?&#]/,
    message: 'La contraseña no cumple con los requisitos'
  }
};

export const validateName = (name: string) => VALIDATION_RULES.name.regex.test(name);
export const validatePhone = (phone: string) => VALIDATION_RULES.phone.regex.test(phone);
export const validateEmail = (email: string) => VALIDATION_RULES.email.regex.test(email);
export const validatePassword = (password: string) => {
  return (
    VALIDATION_RULES.password.minChar.test(password) &&
    VALIDATION_RULES.password.uppercase.test(password) &&
    VALIDATION_RULES.password.number.test(password) &&
    VALIDATION_RULES.password.special.test(password)
  );
};

export const formatPhoneInput = (value: string) => {
  return value.replace(/\D/g, '').slice(0, 10);
};

export const formatNameInput = (value: string) => {
  return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
};
