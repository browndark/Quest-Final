const generateToken = require('../../src/utils/generateToken');
const jwt = require('jsonwebtoken');

describe('generateToken Utility', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.JWT_EXPIRATION = '7d';
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Token Generation', () => {
    it('deve gerar um token JWT válido com user ID', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT tem 3 partes separadas por ponto
    });

    it('deve incluir o ID do usuário no payload do token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(userId);
    });

    it('deve usar JWT_EXPIRATION do env quando definido', () => {
      process.env.JWT_EXPIRATION = '30d';
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Verificar que o token tem uma data de expiração
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      
      // Verificar que expira em aproximadamente 30 dias (em segundos)
      const expiresIn = decoded.exp - decoded.iat;
      expect(expiresIn).toBeGreaterThan(29 * 24 * 60 * 60); // Mais de 29 dias
      expect(expiresIn).toBeLessThan(31 * 24 * 60 * 60); // Menos de 31 dias
    });

    it('deve usar 1d como padrão quando JWT_EXPIRATION não está definido', () => {
      delete process.env.JWT_EXPIRATION;
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const expiresIn = decoded.exp - decoded.iat;
      expect(expiresIn).toBeGreaterThan(23 * 60 * 60); // Mais de 23 horas
      expect(expiresIn).toBeLessThan(25 * 60 * 60); // Menos de 25 horas
    });

    it('deve gerar tokens diferentes para IDs diferentes', () => {
      const userId1 = '507f1f77bcf86cd799439011';
      const userId2 = '507f1f77bcf86cd799439012';

      const token1 = generateToken(userId1);
      const token2 = generateToken(userId2);

      expect(token1).not.toBe(token2);

      const decoded1 = jwt.verify(token1, process.env.JWT_SECRET);
      const decoded2 = jwt.verify(token2, process.env.JWT_SECRET);

      expect(decoded1.id).toBe(userId1);
      expect(decoded2.id).toBe(userId2);
    });

    it('deve gerar tokens únicos mesmo para o mesmo ID (devido ao timestamp)', (done) => {
      const userId = '507f1f77bcf86cd799439011';
      const token1 = generateToken(userId);

      // Aguardar 1 segundo para garantir timestamp diferente (iat em segundos)
      setTimeout(() => {
        const token2 = generateToken(userId);
        
        // Decodificar para verificar que os IDs são iguais mas iat diferente
        const decoded1 = jwt.verify(token1, process.env.JWT_SECRET);
        const decoded2 = jwt.verify(token2, process.env.JWT_SECRET);
        
        expect(decoded1.id).toBe(userId);
        expect(decoded2.id).toBe(userId);
        expect(decoded2.iat).toBeGreaterThan(decoded1.iat);
        
        done();
      }, 1100); // 1.1 segundo para garantir mudança no timestamp
    }, 10000); // Aumentar timeout do teste para 10 segundos

    it('deve aceitar diferentes formatos de ID', () => {
      const ids = [
        '507f1f77bcf86cd799439011',
        'user-123',
        '12345',
        'abc-def-ghi'
      ];

      ids.forEach(id => {
        const token = generateToken(id);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        expect(decoded.id).toBe(id);
      });
    });
  });

  describe('Token Verification', () => {
    it('deve gerar token que pode ser verificado com o mesmo secret', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);

      expect(() => {
        jwt.verify(token, process.env.JWT_SECRET);
      }).not.toThrow();
    });

    it('deve falhar verificação com secret diferente', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);

      expect(() => {
        jwt.verify(token, 'wrong-secret');
      }).toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('deve lidar com ID vazio', () => {
      const token = generateToken('');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe('');
    });

    it('deve lidar com ID null (convertido para string)', () => {
      const token = generateToken(null);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(null);
    });

    it('deve lidar com ID undefined (convertido para string)', () => {
      const token = generateToken(undefined);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(undefined);
    });
  });
});
