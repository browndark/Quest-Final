/**
 * Utilitários para API do Cinema App
 */

/**
 * Cria headers padrão para requisições autenticadas
 * @param {string} token - Token de autenticação
 * @returns {object} - Headers formatados
 */
function createAuthHeaders(token) {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Formata erro de API para exibição
 * @param {object} error - Erro da API
 * @returns {string} - Mensagem de erro formatada
 */
function formatApiError(error) {
  if (!error) return 'Erro desconhecido';
  
  // Se tem response da API
  if (error.response) {
    const { status, data } = error.response;
    
    // Mensagens específicas por status
    switch (status) {
      case 400:
        return data?.message || 'Dados inválidos';
      case 401:
        return 'Não autorizado. Faça login novamente.';
      case 403:
        return 'Acesso negado';
      case 404:
        return 'Recurso não encontrado';
      case 409:
        return data?.message || 'Conflito de dados';
      case 422:
        return data?.message || 'Dados inválidos';
      case 500:
        return 'Erro interno do servidor';
      case 503:
        return 'Servidor indisponível';
      default:
        return data?.message || `Erro ${status}`;
    }
  }
  
  // Se não conseguiu conectar
  if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
    return 'Servidor indisponível. Tente novamente.';
  }
  
  // Erro genérico
  return error.message || 'Erro desconhecido';
}

/**
 * Verifica se uma resposta da API é válida
 * @param {object} response - Resposta da API
 * @returns {boolean} - True se válida
 */
function isValidApiResponse(response) {
  if (!response || typeof response !== 'object') {
    return false;
  }
  
  return typeof response.success === 'boolean';
}

/**
 * Cria payload para registro de usuário
 * @param {object} userData - Dados do usuário
 * @returns {object} - Payload formatado
 */
function createRegisterPayload(userData) {
  const { name, email, password } = userData;
  
  return {
    name: name?.trim(),
    email: email?.trim().toLowerCase(),
    password
  };
}

/**
 * Cria payload para login
 * @param {object} credentials - Credenciais do usuário
 * @returns {object} - Payload formatado
 */
function createLoginPayload(credentials) {
  const { email, password } = credentials;
  
  return {
    email: email?.trim().toLowerCase(),
    password
  };
}

/**
 * Extrai dados do usuário de uma resposta de login
 * @param {object} response - Resposta da API
 * @returns {object|null} - Dados do usuário ou null
 */
function extractUserData(response) {
  if (!isValidApiResponse(response) || !response.success) {
    return null;
  }
  
  const { data } = response;
  if (!data || !data.user || !data.token) {
    return null;
  }
  
  return {
    user: data.user,
    token: data.token
  };
}

/**
 * Verifica se um token JWT ainda é válido (não expirado)
 * @param {string} token - Token JWT
 * @returns {boolean} - True se válido
 */
function isValidToken(token) {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  try {
    // Verifica se tem 3 partes (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }
    
    // Decodifica o payload do JWT sem verificar assinatura
    const payload = JSON.parse(atob(parts[1]));
    
    // Verifica se tem campo exp
    if (!payload.exp) {
      return false;
    }
    
    const now = Math.floor(Date.now() / 1000);
    
    // Verifica se não expirou
    return payload.exp > now;
  } catch (error) {
    return false;
  }
}

/**
 * Simula uma chamada de API para testes
 * @param {string} endpoint - Endpoint da API
 * @param {object} options - Opções da requisição
 * @returns {Promise<object>} - Resposta simulada
 */
function mockApiCall(endpoint, options = {}) {
  return new Promise((resolve, reject) => {
    // Simula delay de rede
    setTimeout(() => {
      if (endpoint === '/auth/login' && options.credentials) {
        const { email, password } = options.credentials;
        
        if (email === 'user@test.com' && password === 'password123') {
          resolve({
            success: true,
            data: {
              user: { id: 1, name: 'Test User', email: 'user@test.com' },
              token: 'mock-jwt-token'
            }
          });
        } else {
          reject({
            response: {
              status: 401,
              data: { message: 'Credenciais inválidas' }
            }
          });
        }
      } else if (endpoint === '/movies') {
        resolve({
          success: true,
          data: [
            { id: 1, title: 'Filme 1', genre: 'Ação' },
            { id: 2, title: 'Filme 2', genre: 'Drama' }
          ]
        });
      } else {
        reject({
          response: {
            status: 404,
            data: { message: 'Endpoint não encontrado' }
          }
        });
      }
    }, 100);
  });
}

module.exports = {
  createAuthHeaders,
  formatApiError,
  isValidApiResponse,
  createRegisterPayload,
  createLoginPayload,
  extractUserData,
  isValidToken,
  mockApiCall
};