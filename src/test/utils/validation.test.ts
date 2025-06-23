import { describe, it, expect } from 'vitest';

// Funções de validação que poderiam ser extraídas dos componentes
export const validateEmail = (email: string): boolean => {
  return /\S+@\S+\.\S+/.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return /^\+351\s\d{2}\s\d{3}\s\d{4}$/.test(phone);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('deve validar emails corretos', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('deve rejeitar emails inválidos', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('deve validar telefones portugueses corretos', () => {
      expect(validatePhone('+351 21 123 4567')).toBe(true);
      expect(validatePhone('+351 91 987 6543')).toBe(true);
    });

    it('deve rejeitar telefones inválidos', () => {
      expect(validatePhone('123456789')).toBe(false);
      expect(validatePhone('+351 123')).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('deve validar campos obrigatórios', () => {
      expect(validateRequired('texto válido')).toBe(true);
      expect(validateRequired('a')).toBe(true);
    });

    it('deve rejeitar campos vazios', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
    });
  });
});