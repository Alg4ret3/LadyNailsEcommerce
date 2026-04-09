export const CONTACT_VALIDATION_RULES = {
  name: {
    validate: (value: string) => value.trim().length >= 3,
    message: 'El nombre debe tener al menos 3 caracteres'
  },
  email: {
    validate: (value: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
    message: 'Correo electrónico inválido'
  },
  subject: {
    validate: (value: string) => value.length > 0,
    message: 'Por favor selecciona un asunto'
  },
  message: {
    validate: (value: string) => value.trim().length >= 10,
    message: 'El mensaje debe tener al menos 10 caracteres'
  }
};

export type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

export const validateContactForm = (data: ContactFormData): ContactFormErrors => {
  const errors: ContactFormErrors = {};

  if (!CONTACT_VALIDATION_RULES.name.validate(data.name)) {
    errors.name = CONTACT_VALIDATION_RULES.name.message;
  }

  if (!CONTACT_VALIDATION_RULES.email.validate(data.email)) {
    errors.email = CONTACT_VALIDATION_RULES.email.message;
  }

  if (!CONTACT_VALIDATION_RULES.subject.validate(data.subject)) {
    errors.subject = CONTACT_VALIDATION_RULES.subject.message;
  }

  if (!CONTACT_VALIDATION_RULES.message.validate(data.message)) {
    errors.message = CONTACT_VALIDATION_RULES.message.message;
  }

  return errors;
};
