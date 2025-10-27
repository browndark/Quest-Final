/**
 * Testes para utilitários de API do Cinema App
 */

const { 
  createAuthHeaders, 
  formatApiError, 
  isValidApiResponse, 
  createRegisterPayload, 
  createLoginPayload, 
  extractUserData, 
  isValidToken,
  mockApiCall 
} = require('../src/utils/api.js');

describe('createAuthHeaders', () => {
  test('should create headers with token', () => {
    const token = 'abc123token';
    const headers = createAuthHeaders(token);
    
    expect(headers).toEqual({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer abc123token'
    });
  });
  
  test('should create headers without token', () => {
    const headers = createAuthHeaders();
    
    expect(headers).toEqual({
      'Content-Type': 'application/json'
    });
    
    expect(headers.Authorization).toBeUndefined();
  });
  
  test('should handle null/undefined token', () => {
    expect(createAuthHeaders(null)).toEqual({
      'Content-Type': 'application/json'
    });
    
    expect(createAuthHeaders(undefined)).toEqual({
      'Content-Type': 'application/json'
    });
  });
});

describe('formatApiError', () => {
  test('should format 400 errors', () => {
    const error = {
      response: {
        status: 400,
        data: { message: 'Dados inválidos fornecidos' }
      }
    };
    
    expect(formatApiError(error)).toBe('Dados inválidos fornecidos');
  });
  
  test('should format 401 errors', () => {
    const error = {
      response: { status: 401 }
    };
    
    expect(formatApiError(error)).toBe('Não autorizado. Faça login novamente.');
  });
  
  test('should format 404 errors', () => {
    const error = {
      response: { status: 404 }
    };
    
    expect(formatApiError(error)).toBe('Recurso não encontrado');
  });
  
  test('should format 409 conflicts', () => {
    const error = {
      response: {
        status: 409,
        data: { message: 'E-mail já cadastrado' }
      }
    };
    
    expect(formatApiError(error)).toBe('E-mail já cadastrado');
  });
  
  test('should format 500 errors', () => {
    const error = {
      response: { status: 500 }
    };
    
    expect(formatApiError(error)).toBe('Erro interno do servidor');
  });
  
  test('should handle network errors', () => {
    const networkError = {
      code: 'ECONNREFUSED',
      message: 'Connection refused'
    };
    
    expect(formatApiError(networkError)).toBe('Servidor indisponível. Tente novamente.');
  });
  
  test('should handle generic errors', () => {
    const genericError = {
      message: 'Algo deu errado'
    };
    
    expect(formatApiError(genericError)).toBe('Algo deu errado');
  });
  
  test('should handle null/undefined errors', () => {
    expect(formatApiError(null)).toBe('Erro desconhecido');
    expect(formatApiError(undefined)).toBe('Erro desconhecido');
  });
});

describe('isValidApiResponse', () => {
  test('should validate correct API responses', () => {
    const validResponses = [
      { success: true, data: {} },
      { success: false, error: 'Erro' },
      { success: true, data: { user: 'João' } }
    ];
    
    validResponses.forEach(response => {
      expect(isValidApiResponse(response)).toBe(true);
    });
  });
  
  test('should reject invalid API responses', () => {
    const invalidResponses = [
      null,
      undefined,
      {},
      { data: {} }, // sem success
      { success: 'true' }, // success não é boolean
      'invalid',
      123
    ];
    
    invalidResponses.forEach(response => {
      expect(isValidApiResponse(response)).toBe(false);
    });
  });
});

describe('createRegisterPayload', () => {
  test('should create register payload correctly', () => {
    const userData = {
      name: '  João Silva  ',
      email: '  JOAO@EXEMPLO.COM  ',
      password: 'minhasenha123'
    };
    
    const payload = createRegisterPayload(userData);
    
    expect(payload).toEqual({
      name: 'João Silva',
      email: 'joao@exemplo.com',
      password: 'minhasenha123'
    });
  });
  
  test('should handle missing fields', () => {
    const userData = {
      email: 'test@example.com'
    };
    
    const payload = createRegisterPayload(userData);
    
    expect(payload.name).toBeUndefined();
    expect(payload.email).toBe('test@example.com');
    expect(payload.password).toBeUndefined();
  });
  
  test('should handle empty userData', () => {
    const payload = createRegisterPayload({});
    
    expect(payload).toEqual({
      name: undefined,
      email: undefined,
      password: undefined
    });
  });
});

describe('createLoginPayload', () => {
  test('should create login payload correctly', () => {
    const credentials = {
      email: '  USUARIO@TESTE.COM  ',
      password: 'senha123'
    };
    
    const payload = createLoginPayload(credentials);
    
    expect(payload).toEqual({
      email: 'usuario@teste.com',
      password: 'senha123'
    });
  });
  
  test('should handle missing credentials', () => {
    const payload = createLoginPayload({});
    
    expect(payload).toEqual({
      email: undefined,
      password: undefined
    });
  });
});

describe('extractUserData', () => {
  test('should extract user data from valid response', () => {
    const response = {
      success: true,
      data: {
        user: { id: 1, name: 'João', email: 'joao@test.com' },
        token: 'abc123token'
      }
    };
    
    const userData = extractUserData(response);
    
    expect(userData).toEqual({
      user: { id: 1, name: 'João', email: 'joao@test.com' },
      token: 'abc123token'
    });
  });
  
  test('should return null for invalid responses', () => {
    const invalidResponses = [
      { success: false },
      { success: true, data: {} },
      { success: true, data: { user: {} } }, // sem token
      { success: true, data: { token: 'abc' } }, // sem user
      null,
      undefined
    ];
    
    invalidResponses.forEach(response => {
      expect(extractUserData(response)).toBeNull();
    });
  });
});

describe('isValidToken', () => {
  test('should validate non-expired tokens', () => {
    // Cria um token que expira em 1 hora
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    const payload = { exp: futureExp, userId: 123 };
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    
    expect(isValidToken(token)).toBe(true);
  });
  
  test('should reject expired tokens', () => {
    // Cria um token que expirou há 1 hora
    const pastExp = Math.floor(Date.now() / 1000) - 3600;
    const payload = { exp: pastExp, userId: 123 };
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    
    expect(isValidToken(token)).toBe(false);
  });
  
  test('should reject invalid token formats', () => {
    const invalidTokens = [
      '',
      null,
      undefined,
      'invalid-token',
      'header.invalid-base64.signature',
      'header..signature', // payload vazio
      'onlyonepart', // sem pontos
      'header.signature', // só 2 partes
      123 // não é string
    ];
    
    invalidTokens.forEach(token => {
      expect(isValidToken(token)).toBe(false);
    });
  });
  
  test('should reject tokens without expiration', () => {
    const payload = { userId: 123 }; // sem exp
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    
    expect(isValidToken(token)).toBe(false);
  });
  
  test('should handle malformed JSON in token', () => {
    const token = `header.${btoa('invalid-json')}.signature`;
    
    expect(isValidToken(token)).toBe(false);
  });
});

describe('mockApiCall', () => {
  test('should simulate successful login', async () => {
    const response = await mockApiCall('/auth/login', {
      credentials: { email: 'user@test.com', password: 'password123' }
    });
    
    expect(response.success).toBe(true);
    expect(response.data.user.email).toBe('user@test.com');
    expect(response.data.token).toBe('mock-jwt-token');
  });
  
  test('should simulate failed login', async () => {
    try {
      await mockApiCall('/auth/login', {
        credentials: { email: 'wrong@email.com', password: 'wrongpass' }
      });
      fail('Should have thrown an error');
    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data.message).toBe('Credenciais inválidas');
    }
  });
  
  test('should simulate movies endpoint', async () => {
    const response = await mockApiCall('/movies');
    
    expect(response.success).toBe(true);
    expect(response.data).toHaveLength(2);
    expect(response.data[0].title).toBe('Filme 1');
    expect(response.data[1].genre).toBe('Drama');
  });
  
  test('should simulate 404 for unknown endpoint', async () => {
    try {
      await mockApiCall('/unknown');
      fail('Should have thrown an error');
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toBe('Endpoint não encontrado');
    }
  });
  
  test('should simulate network delay', async () => {
    const startTime = Date.now();
    await mockApiCall('/movies');
    const endTime = Date.now();
    
    // Deve ter pelo menos 100ms de delay
    expect(endTime - startTime).toBeGreaterThanOrEqual(100);
  });
});