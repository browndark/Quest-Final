describe('Authentication - Register', () => {
  const baseUrl = Cypress.env('baseUrl') || 'http://localhost:3002';
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:5000/api/v1';

  beforeEach(() => {
    cy.visit(`${baseUrl}/register`);
  });

  it('should register successfully with valid data', () => {
    cy.intercept('POST', `${apiUrl}/auth/register`).as('registerRequest');

    const timestamp = Date.now();
    cy.get('[data-testid="name-input"]').type('Test User');
    cy.get('[data-testid="email-input"]').type(`testuser${timestamp}@example.com`);
    cy.get('[data-testid="password-input"]').type('Test@1234');
    cy.get('[data-testid="confirm-password-input"]').type('Test@1234');
    cy.get('[data-testid="register-button"]').click();

    cy.wait('@registerRequest').its('response.statusCode').should('eq', 201);
    cy.url().should('include', '/login');
  });

  it('should show error with duplicate email', () => {
    cy.intercept('POST', `${apiUrl}/auth/register`, {
      statusCode: 409,
      body: { success: false, message: 'E-mail já cadastrado' }
    }).as('registerConflict');

    cy.get('[data-testid="name-input"]').type('Test User');
    cy.get('[data-testid="email-input"]').type('admin@admin.com');
    cy.get('[data-testid="password-input"]').type('Test@1234');
    cy.get('[data-testid="confirm-password-input"]').type('Test@1234');
    cy.get('[data-testid="register-button"]').click();

    cy.wait('@registerConflict');
    cy.contains(/e-mail já cadastrado|email already exists/i).should('be.visible');
  });

  it('should show error with weak password', () => {
    cy.get('[data-testid="name-input"]').type('Test User');
    cy.get('[data-testid="email-input"]').type('newuser@example.com');
    cy.get('[data-testid="password-input"]').type('123');
    cy.get('[data-testid="confirm-password-input"]').type('123');
    cy.get('[data-testid="register-button"]').click();

    cy.contains(/senha muito curta|password too short|mínimo 8/i).should('be.visible');
  });

  it('should show error when passwords do not match', () => {
    cy.get('[data-testid="name-input"]').type('Test User');
    cy.get('[data-testid="email-input"]').type('newuser@example.com');
    cy.get('[data-testid="password-input"]').type('Test@1234');
    cy.get('[data-testid="confirm-password-input"]').type('Different@1234');
    cy.get('[data-testid="register-button"]').click();

    cy.contains(/senhas não coincidem|passwords do not match/i).should('be.visible');
  });

  it('should validate required fields', () => {
    cy.get('[data-testid="register-button"]').click();
    
    cy.get('[data-testid="name-input"]:invalid').should('exist');
    cy.get('[data-testid="email-input"]:invalid').should('exist');
    cy.get('[data-testid="password-input"]:invalid').should('exist');
  });
});
