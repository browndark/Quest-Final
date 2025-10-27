describe('Authentication - Login', () => {
  const baseUrl = Cypress.env('baseUrl') || 'http://localhost:3002';
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:5000/api/v1';

  beforeEach(() => {
    cy.visit(`${baseUrl}/login`);
  });

  it('should login successfully with valid credentials', () => {
    cy.intercept('POST', `${apiUrl}/auth/login`).as('loginRequest');

    cy.get('[data-testid="email-input"]').type('admin@admin.com');
    cy.get('[data-testid="password-input"]').type('admin');
    cy.get('[data-testid="login-button"]').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/dashboard');
    cy.window().its('localStorage.token').should('exist');
  });

  it('should show error with invalid email', () => {
    cy.get('[data-testid="email-input"]').type('invalid-email');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    cy.contains(/e-mail inválido|invalid email/i).should('be.visible');
  });

  it('should show error with incorrect password', () => {
    cy.intercept('POST', `${apiUrl}/auth/login`, {
      statusCode: 401,
      body: { success: false, message: 'Credenciais inválidas' }
    }).as('loginFail');

    cy.get('[data-testid="email-input"]').type('admin@admin.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();

    cy.wait('@loginFail');
    cy.contains(/credenciais inválidas|invalid credentials/i).should('be.visible');
  });

  it('should validate required fields', () => {
    cy.get('[data-testid="login-button"]').click();
    
    cy.get('[data-testid="email-input"]:invalid').should('exist');
    cy.get('[data-testid="password-input"]:invalid').should('exist');
  });

  it('should persist token after successful login', () => {
    cy.intercept('POST', `${apiUrl}/auth/login`, {
      statusCode: 200,
      body: { 
        success: true, 
        token: 'fake-jwt-token-12345',
        user: { id: 1, name: 'Admin User', email: 'admin@admin.com' }
      }
    }).as('loginSuccess');

    cy.get('[data-testid="email-input"]').type('admin@admin.com');
    cy.get('[data-testid="password-input"]').type('admin');
    cy.get('[data-testid="login-button"]').click();

    cy.wait('@loginSuccess');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.equal('fake-jwt-token-12345');
    });
  });
});
