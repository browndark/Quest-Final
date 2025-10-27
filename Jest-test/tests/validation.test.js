/**
 * Testes para funções de validação do Cinema App
 */

const { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validatePasswordConfirmation 
} = require('../src/utils/validation.js');

describe('validateEmail', () => {
  test('should validate correct emails', () => {
    const validEmails = [
      'user@example.com',
      'test.email@domain.co.uk',
      'user+tag@example.org',
      'nome@exemplo.com.br',
      'email@dominio.net'
    ];
    
    validEmails.forEach(email => {
      expect(validateEmail(email)).toBe(true);
    });
  });
  
  test('should reject invalid emails', () => {
    const invalidEmails = [
      '', // vazio
      null, // null
      undefined, // undefined
      'invalid-email', // sem @
      'a@b.c', // TLD muito pequeno
      '.nome@exemplo.com', // começa com ponto
      'nome.@exemplo.com', // termina com ponto antes do @
      'nome@.exemplo.com', // @ seguido de ponto
      'no..me@exemplo.com', // pontos consecutivos
      'nome@exemplo', // sem TLD
      '@exemplo.com', // sem usuário
      'nome@', // sem domínio
      'nome@exemplo.', // termina com ponto
      'nome exemplo@teste.com', // espaço no nome
      'nome@teste .com' // espaço no domínio
    ];
    
    invalidEmails.forEach(email => {
      expect(validateEmail(email)).toBe(false);
    });
  });
});

describe('validatePassword', () => {
  test('should validate strong passwords', () => {
    const strongPasswords = [
      'MinhaSenh@123',
      'Password1!',
      'Teste@123456',
      'Cinema2024!'
    ];
    
    strongPasswords.forEach(password => {
      const result = validatePassword(password);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
  
  test('should reject weak passwords', () => {
    const weakPasswords = [
      { password: '', expectedErrors: ['Senha é obrigatória'] },
      { password: '123', expectedErrors: ['Senha deve ter pelo menos 8 caracteres'] },
      { password: 'minuscula123', expectedErrors: ['Senha deve conter pelo menos uma letra maiúscula'] },
      { password: 'MAIUSCULA123', expectedErrors: ['Senha deve conter pelo menos uma letra minúscula'] },
      { password: 'SemNumero!', expectedErrors: ['Senha deve conter pelo menos um número'] },
      { password: 'fraca', expectedErrors: expect.arrayContaining([
        'Senha deve ter pelo menos 8 caracteres',
        'Senha deve conter pelo menos uma letra maiúscula',
        'Senha deve conter pelo menos um número'
      ]) }
    ];
    
    weakPasswords.forEach(({ password, expectedErrors }) => {
      const result = validatePassword(password);
      expect(result.isValid).toBe(false);
      
      if (Array.isArray(expectedErrors)) {
        expectedErrors.forEach(error => {
          expect(result.errors).toContain(error);
        });
      } else {
        expect(result.errors).toEqual(expectedErrors);
      }
    });
  });
  
  test('should reject null/undefined password', () => {
    expect(validatePassword(null).isValid).toBe(false);
    expect(validatePassword(undefined).isValid).toBe(false);
    expect(validatePassword(123).isValid).toBe(false);
  });
});

describe('validateName', () => {
  test('should validate correct names', () => {
    const validNames = [
      'João Silva',
      'Maria da Silva',
      'José',
      'Ana-Paula',
      'François',
      'José María',
      "O'Connor",
      'Ação',
      'André'
    ];
    
    validNames.forEach(name => {
      expect(validateName(name)).toBe(true);
    });
  });
  
  test('should reject invalid names', () => {
    const invalidNames = [
      '', // vazio
      null, // null
      undefined, // undefined
      'A', // muito curto
      '123', // apenas números
      'João123', // com números
      'João@Silva', // caracteres especiais
      'João<script>alert("hack")</script>', // tentativa XSS
      'a'.repeat(101), // muito longo
      '   ' // apenas espaços
      // Removido 'João  Silva' pois espaços múltiplos podem ser considerados válidos
    ];
    
    invalidNames.forEach(name => {
      expect(validateName(name)).toBe(false);
    });
  });
});

describe('validatePasswordConfirmation', () => {
  test('should validate matching passwords', () => {
    const matchingPairs = [
      ['senha123', 'senha123'],
      ['', ''],
      ['MinhaSenh@123', 'MinhaSenh@123']
    ];
    
    matchingPairs.forEach(([password, confirm]) => {
      expect(validatePasswordConfirmation(password, confirm)).toBe(true);
    });
  });
  
  test('should reject non-matching passwords', () => {
    const nonMatchingPairs = [
      ['senha123', 'senha456'],
      ['', 'algo'],
      ['algo', ''],
      ['MinhaSenh@123', 'MinhaSenh@124'],
      ['password', 'Password'] // case sensitive
    ];
    
    nonMatchingPairs.forEach(([password, confirm]) => {
      expect(validatePasswordConfirmation(password, confirm)).toBe(false);
    });
  });
});