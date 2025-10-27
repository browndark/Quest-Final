/**
 * Testes para funções de formatação do Cinema App
 */

const { 
  formatPrice, 
  calculateTotal, 
  formatDate, 
  formatTime, 
  formatSeats, 
  sanitizeText 
} = require('../src/utils/formatting.js');

describe('formatPrice', () => {
  test('should format prices correctly with symbol', () => {
    expect(formatPrice(25.5)).toBe('R$ 25,50');
    expect(formatPrice(100)).toBe('R$ 100,00');
    expect(formatPrice(0)).toBe('R$ 0,00');
    expect(formatPrice(999.99)).toBe('R$ 999,99');
  });
  
  test('should format prices correctly without symbol', () => {
    expect(formatPrice(25.5, false)).toBe('25,50');
    expect(formatPrice(100, false)).toBe('100,00');
    expect(formatPrice(0, false)).toBe('0,00');
  });
  
  test('should handle invalid inputs', () => {
    expect(formatPrice(NaN)).toBe('R$ 0,00');
    expect(formatPrice('invalid')).toBe('R$ 0,00');
    expect(formatPrice(null)).toBe('R$ 0,00');
    expect(formatPrice(undefined)).toBe('R$ 0,00');
  });
});

describe('calculateTotal', () => {
  test('should calculate correct totals', () => {
    const seats = [
      { row: 'A', number: 1 },
      { row: 'A', number: 2 },
      { row: 'B', number: 1 }
    ];
    
    expect(calculateTotal(seats, 25)).toBe(75);
    expect(calculateTotal(seats, 30.50)).toBe(91.5);
    expect(calculateTotal([], 25)).toBe(0);
    expect(calculateTotal(seats, 0)).toBe(0);
  });
  
  test('should handle invalid inputs', () => {
    expect(calculateTotal(null, 25)).toBe(0);
    expect(calculateTotal([], 'invalid')).toBe(0);
    expect(calculateTotal('invalid', 25)).toBe(0);
    expect(calculateTotal(undefined, undefined)).toBe(0);
  });
});

describe('formatDate', () => {
  test('should format valid dates correctly', () => {
    const testDate = '2024-03-15T14:30:00.000Z';
    const result = formatDate(testDate);
    
    // Verifica se o formato está correto (aceita qualquer formato válido de data)
    expect(result).toContain('março');
    expect(result).toContain('2024');
    expect(result).not.toBe('Data inválida');
  });
  
  test('should handle Date objects', () => {
    const date = new Date('2024-12-25');
    const result = formatDate(date);
    
    expect(result).toMatch(/\d{1,2} de \w+ de \d{4}/);
  });
  
  test('should handle invalid dates', () => {
    expect(formatDate('')).toBe('Data inválida');
    expect(formatDate(null)).toBe('Data inválida');
    expect(formatDate(undefined)).toBe('Data inválida');
    expect(formatDate('invalid-date')).toBe('Data inválida');
    expect(formatDate('2024-13-32')).toBe('Data inválida');
  });
});

describe('formatTime', () => {
  test('should format valid times correctly', () => {
    const testDateTime = '2024-03-15T14:30:00.000Z';
    const result = formatTime(testDateTime);
    
    // Deve estar no formato HH:MM
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
  
  test('should handle Date objects', () => {
    const date = new Date('2024-03-15T14:30:00');
    const result = formatTime(date);
    
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
  
  test('should handle invalid times', () => {
    expect(formatTime('')).toBe('Horário inválido');
    expect(formatTime(null)).toBe('Horário inválido');
    expect(formatTime(undefined)).toBe('Horário inválido');
    expect(formatTime('invalid-time')).toBe('Horário inválido');
  });
});

describe('formatSeats', () => {
  test('should format seats correctly', () => {
    const seats = [
      { row: 'A', number: 1 },
      { row: 'A', number: 2 },
      { row: 'B', number: 5 }
    ];
    
    expect(formatSeats(seats)).toBe('A1, A2, B5');
  });
  
  test('should handle seats without row/number properties', () => {
    const seats = ['A1', 'B2', 'C3'];
    expect(formatSeats(seats)).toBe('A1, B2, C3');
  });
  
  test('should handle empty or invalid inputs', () => {
    expect(formatSeats([])).toBe('Nenhum assento');
    expect(formatSeats(null)).toBe('Nenhum assento');
    expect(formatSeats(undefined)).toBe('Nenhum assento');
    expect(formatSeats('invalid')).toBe('Nenhum assento');
  });
  
  test('should handle mixed seat formats', () => {
    const seats = [
      { row: 'A', number: 1 },
      'B2',
      { row: 'C', number: 3 }
    ];
    
    expect(formatSeats(seats)).toBe('A1, B2, C3');
  });
});

describe('sanitizeText', () => {
  test('should sanitize dangerous characters', () => {
    expect(sanitizeText('<script>alert("xss")</script>')).toBe('scriptalert(xss)/script');
    expect(sanitizeText('Nome & Sobrenome')).toBe('Nome  Sobrenome');
    expect(sanitizeText('João "Silva"')).toBe('João Silva');
    expect(sanitizeText("Maria 'Santos'")).toBe('Maria Santos');
  });
  
  test('should trim whitespace', () => {
    expect(sanitizeText('  texto com espaços  ')).toBe('texto com espaços');
    expect(sanitizeText('\n\tTexto\n\t')).toBe('Texto');
  });
  
  test('should respect max length', () => {
    const longText = 'a'.repeat(300);
    expect(sanitizeText(longText, 100)).toHaveLength(100);
    expect(sanitizeText('texto', 3)).toBe('tex');
  });
  
  test('should handle invalid inputs', () => {
    expect(sanitizeText(null)).toBe('');
    expect(sanitizeText(undefined)).toBe('');
    expect(sanitizeText(123)).toBe('');
    expect(sanitizeText('')).toBe('');
  });
  
  test('should use default max length', () => {
    const longText = 'a'.repeat(300);
    const result = sanitizeText(longText);
    expect(result).toHaveLength(255);
  });
});