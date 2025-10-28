/**
 * E2E Error Scenarios (Negative Tests)
 * Testa cenários de erro e validações
 */

describe('E2E - Error Scenarios (Negative Tests)', () => {
  const baseUrl = Cypress.env('baseUrl') || 'http://localhost:3002';
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:5000/api/v1';

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('❌ Autenticação - Erros', () => {
    it('deve bloquear acesso a rotas protegidas sem autenticação', () => {
      cy.visit(`${baseUrl}/dashboard`);
      cy.url().should('include', '/login');

      cy.visit(`${baseUrl}/my-reservations`);
      cy.url().should('include', '/login');
    });

    it('deve mostrar erro com credenciais inválidas', () => {
      cy.intercept('POST', `${apiUrl}/auth/login`, {
        statusCode: 401,
        body: { 
          success: false, 
          message: 'Email ou senha incorretos'
        }
      }).as('loginFail');

      cy.visit(`${baseUrl}/login`);
      cy.get('[data-testid="email-input"]').type('wrong@example.com');
      cy.get('[data-testid="password-input"]').type('wrongpassword');
      cy.get('[data-testid="login-button"]').click();

      cy.wait('@loginFail');
      cy.contains(/email ou senha incorretos|invalid credentials/i).should('be.visible');
      cy.url().should('include', '/login');
    });

    it('deve mostrar erro 409 ao registrar email duplicado', () => {
      cy.intercept('POST', `${apiUrl}/auth/register`, {
        statusCode: 409,
        body: { 
          success: false, 
          message: 'E-mail já cadastrado'
        }
      }).as('registerConflict');

      cy.visit(`${baseUrl}/register`);
      cy.get('[data-testid="name-input"]').type('Test User');
      cy.get('[data-testid="email-input"]').type('existing@example.com');
      cy.get('[data-testid="password-input"]').type('Password123');
      cy.get('[data-testid="confirm-password-input"]').type('Password123');
      cy.get('[data-testid="register-button"]').click();

      cy.wait('@registerConflict');
      cy.contains(/e-mail já cadastrado|email already exists/i).should('be.visible');
    });

    it('deve validar token expirado', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'expired-token');
      });

      cy.intercept('GET', `${apiUrl}/reservations/my-reservations`, {
        statusCode: 401,
        body: { 
          success: false, 
          message: 'Token inválido ou expirado'
        }
      }).as('expiredToken');

      cy.visit(`${baseUrl}/my-reservations`);
      cy.wait('@expiredToken');

      cy.url().should('include', '/login');
      cy.contains(/sessão expirada|session expired|faça login novamente/i).should('be.visible');
    });
  });

  describe('❌ Reservas - Erros', () => {
    beforeEach(() => {
      // Mock de autenticação
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'fake-jwt-token');
      });
    });

    it('deve mostrar erro 409 ao tentar reservar assento ocupado', () => {
      cy.intercept('POST', `${apiUrl}/reservations`, {
        statusCode: 409,
        body: { 
          success: false, 
          message: 'Um ou mais assentos já estão reservados'
        }
      }).as('seatConflict');

      cy.visit(`${baseUrl}/sessions/123/book`);
      cy.get('[data-testid="seat-A1"]').click();
      cy.get('[data-testid="confirm-booking"]').click();

      cy.wait('@seatConflict');
      cy.contains(/assentos já estão reservados|seats already reserved/i).should('be.visible');
    });

    it('deve bloquear reserva sem selecionar assentos', () => {
      cy.visit(`${baseUrl}/sessions/123/book`);
      cy.get('[data-testid="confirm-booking"]').should('be.disabled');
    });

    it('deve mostrar erro 404 ao acessar sessão inexistente', () => {
      cy.intercept('GET', `${apiUrl}/sessions/999`, {
        statusCode: 404,
        body: { 
          success: false, 
          message: 'Sessão não encontrada'
        }
      }).as('sessionNotFound');

      cy.visit(`${baseUrl}/sessions/999/book`);
      cy.wait('@sessionNotFound');

      cy.contains(/sessão não encontrada|session not found/i).should('be.visible');
    });

    it('deve bloquear cancelamento de reserva de outro usuário (403)', () => {
      cy.intercept('DELETE', `${apiUrl}/reservations/other-user-reservation`, {
        statusCode: 403,
        body: { 
          success: false, 
          message: 'Você não tem permissão para cancelar esta reserva'
        }
      }).as('forbidden');

      cy.visit(`${baseUrl}/reservations/other-user-reservation`);
      cy.get('[data-testid="cancel-reservation"]').click();
      cy.get('[data-testid="confirm-cancel"]').click();

      cy.wait('@forbidden');
      cy.contains(/não tem permissão|forbidden|access denied/i).should('be.visible');
    });
  });

  describe('❌ Filmes - Erros', () => {
    it('deve mostrar mensagem quando não há filmes disponíveis', () => {
      cy.intercept('GET', `${apiUrl}/movies*`, {
        statusCode: 200,
        body: { 
          success: true, 
          items: [],
          total: 0
        }
      }).as('emptyMovies');

      cy.visit(`${baseUrl}/movies`);
      cy.wait('@emptyMovies');

      cy.contains(/nenhum filme encontrado|no movies found/i).should('be.visible');
    });

    it('deve mostrar erro 404 ao acessar filme inexistente', () => {
      cy.intercept('GET', `${apiUrl}/movies/999`, {
        statusCode: 404,
        body: { 
          success: false, 
          message: 'Filme não encontrado'
        }
      }).as('movieNotFound');

      cy.visit(`${baseUrl}/movies/999`);
      cy.wait('@movieNotFound');

      cy.contains(/filme não encontrado|movie not found/i).should('be.visible');
    });

    it('deve mostrar mensagem quando filme não tem sessões disponíveis', () => {
      const mockMovie = {
        id: 'movie123',
        title: 'Filme sem sessões',
        genre: 'Drama'
      };

      cy.intercept('GET', `${apiUrl}/movies/movie123`, {
        statusCode: 200,
        body: { success: true, data: mockMovie }
      }).as('getMovie');

      cy.intercept('GET', `${apiUrl}/sessions?movieId=movie123*`, {
        statusCode: 200,
        body: { success: true, data: [] }
      }).as('emptySessions');

      cy.visit(`${baseUrl}/movies/movie123`);
      cy.wait('@getMovie');
      cy.wait('@emptySessions');

      cy.contains(/nenhuma sessão disponível|no sessions available/i).should('be.visible');
    });
  });

  describe('❌ Validações de Formulário', () => {
    it('deve validar email inválido no login', () => {
      cy.visit(`${baseUrl}/login`);
      cy.get('[data-testid="email-input"]').type('invalid-email');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="login-button"]').click();

      cy.get('[data-testid="email-input"]:invalid').should('exist');
    });

    it('deve validar senha muito curta no registro', () => {
      cy.visit(`${baseUrl}/register`);
      cy.get('[data-testid="name-input"]').type('Test User');
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('123');
      cy.get('[data-testid="confirm-password-input"]').type('123');
      cy.get('[data-testid="register-button"]').click();

      cy.contains(/senha muito curta|password too short|mínimo/i).should('be.visible');
    });

    it('deve validar senhas diferentes no registro', () => {
      cy.visit(`${baseUrl}/register`);
      cy.get('[data-testid="name-input"]').type('Test User');
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('Password123');
      cy.get('[data-testid="confirm-password-input"]').type('DifferentPassword123');
      cy.get('[data-testid="register-button"]').click();

      cy.contains(/senhas não coincidem|passwords do not match/i).should('be.visible');
    });

    it('deve validar campos obrigatórios', () => {
      cy.visit(`${baseUrl}/register`);
      cy.get('[data-testid="register-button"]').click();

      cy.get('[data-testid="name-input"]:invalid').should('exist');
      cy.get('[data-testid="email-input"]:invalid').should('exist');
      cy.get('[data-testid="password-input"]:invalid').should('exist');
    });
  });

  describe('❌ Erros de Servidor', () => {
    it('deve mostrar erro 500 do servidor', () => {
      cy.intercept('GET', `${apiUrl}/movies*`, {
        statusCode: 500,
        body: { 
          success: false, 
          message: 'Erro interno do servidor'
        }
      }).as('serverError');

      cy.visit(`${baseUrl}/movies`);
      cy.wait('@serverError');

      cy.contains(/erro no servidor|server error|tente novamente/i).should('be.visible');
    });

    it('deve mostrar erro de timeout/conexão', () => {
      cy.intercept('GET', `${apiUrl}/movies*`, { forceNetworkError: true }).as('networkError');

      cy.visit(`${baseUrl}/movies`);
      cy.wait('@networkError');

      cy.contains(/erro de conexão|network error|sem conexão/i).should('be.visible');
    });
  });

  describe('❌ Limites e Restrições', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'fake-jwt-token');
      });
    });

    it('deve limitar número máximo de assentos por reserva', () => {
      cy.visit(`${baseUrl}/sessions/123/book`);

      // Tentar selecionar mais de 10 assentos (limite hipotético)
      for (let i = 1; i <= 11; i++) {
        cy.get(`[data-testid="seat-A${i}"]`).click();
      }

      cy.contains(/limite máximo|maximum limit|no máximo 10/i).should('be.visible');
      cy.get('[data-testid="seat-count"]').should('not.contain', '11');
    });

    it('deve validar horário de reserva (não permitir sessões passadas)', () => {
      cy.intercept('GET', `${apiUrl}/sessions/past-session`, {
        statusCode: 400,
        body: { 
          success: false, 
          message: 'Não é possível reservar sessões passadas'
        }
      }).as('pastSession');

      cy.visit(`${baseUrl}/sessions/past-session/book`);
      cy.wait('@pastSession');

      cy.contains(/sessão já passou|past session|não é possível reservar/i).should('be.visible');
    });
  });
});
