import { validateEmail, validatePassword, validatePhone, formatPhoneInput, formatNameInput } from '@/utils/validations';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should return true for valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should return true for valid 7-10 digit numbers', () => {
      expect(validatePhone('1234567')).toBe(true);
      expect(validatePhone('1234567890')).toBe(true);
    });

    it('should return false for short or long numbers', () => {
      expect(validatePhone('123456')).toBe(false);
      expect(validatePhone('12345678901')).toBe(false);
    });

    it('should return false for non-numeric characters', () => {
      expect(validatePhone('123-4567')).toBe(false);
      expect(validatePhone('123 4567')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return true for passwords meeting all criteria', () => {
      expect(validatePassword('Password123!')).toBe(true);
    });

    it('should return false if missing uppercase', () => {
      expect(validatePassword('password123!')).toBe(false);
    });

    it('should return false if missing number', () => {
      expect(validatePassword('Password!!!')).toBe(false);
    });

    it('should return false if missing special character', () => {
      expect(validatePassword('Password123')).toBe(false);
    });

    it('should return false if too short', () => {
      expect(validatePassword('Pass1!')).toBe(false);
    });
  });

  describe('formatPhoneInput', () => {
    it('should remove non-numeric characters and limit to 10 digits', () => {
      expect(formatPhoneInput('300-123-456789')).toBe('3001234567');
      expect(formatPhoneInput('(601) 123 4567')).toBe('6011234567');
    });
  });

  describe('formatNameInput', () => {
    it('should remove non-alphabetic characters except spaces and accents', () => {
      expect(formatNameInput('Juan 123!')).toBe('Juan ');
      expect(formatNameInput('María-José')).toBe('MaríaJosé'); // Note: - is removed by current regex
    });
  });
});
