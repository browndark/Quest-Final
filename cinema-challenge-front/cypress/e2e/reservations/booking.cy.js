describe('Reservations - Booking Flow', () => {
  const baseUrl = Cypress.env('baseUrl') || 'http://localhost:3002';
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:5000/api/v1';

  beforeEach(() => {
    // Mock authentication
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-jwt-token');
    });
  });

  it('should complete full booking flow (happy path)', () => {
    cy.intercept('POST', `${apiUrl}/reservations`, {
      statusCode: 201,
      body: { 
        success: true, 
        data: { 
          id: 'res123', 
          seats: ['A1', 'A2'], 
          total: 50 
        } 
      }
    }).as('createReservation');

    cy.visit(`${baseUrl}/sessions/123/book`);

    // Select seats
    cy.get('[data-testid="seat-A1"]').click();
    cy.get('[data-testid="seat-A2"]').click();

    // Verify selected seats
    cy.get('[data-testid="selected-seats"]').should('contain', 'A1, A2');

    // Verify total calculation
    cy.get('[data-testid="total-price"]').should('contain', 'R$ 50');

    // Confirm booking
    cy.get('[data-testid="confirm-booking"]').click();

    cy.wait('@createReservation');
    cy.url().should('include', '/reservations/success');
  });

  it('should select multiple seats', () => {
    cy.visit(`${baseUrl}/sessions/123/book`);

    cy.get('[data-testid="seat-A1"]').click();
    cy.get('[data-testid="seat-A2"]').click();
    cy.get('[data-testid="seat-B5"]').click();

    cy.get('[data-testid="selected-seats"]').should('contain', 'A1');
    cy.get('[data-testid="selected-seats"]').should('contain', 'A2');
    cy.get('[data-testid="selected-seats"]').should('contain', 'B5');
    cy.get('[data-testid="seat-count"]').should('contain', '3');
  });

  it('should calculate correct total price', () => {
    cy.visit(`${baseUrl}/sessions/123/book`);

    // Price per seat: R$ 25
    cy.get('[data-testid="seat-A1"]').click();
    cy.get('[data-testid="total-price"]').should('contain', 'R$ 25');

    cy.get('[data-testid="seat-A2"]').click();
    cy.get('[data-testid="total-price"]').should('contain', 'R$ 50');

    cy.get('[data-testid="seat-A3"]').click();
    cy.get('[data-testid="total-price"]').should('contain', 'R$ 75');
  });

  it('should block already reserved seats', () => {
    const mockSeats = [
      { id: 'A1', status: 'available' },
      { id: 'A2', status: 'reserved' },
      { id: 'A3', status: 'available' }
    ];

    cy.intercept('GET', `${apiUrl}/sessions/123/seats`, {
      statusCode: 200,
      body: { success: true, data: mockSeats }
    }).as('getSeats');

    cy.visit(`${baseUrl}/sessions/123/book`);
    cy.wait('@getSeats');

    cy.get('[data-testid="seat-A2"]').should('have.class', 'reserved');
    cy.get('[data-testid="seat-A2"]').should('be.disabled');
  });

  it('should allow reservation cancellation', () => {
    cy.intercept('DELETE', `${apiUrl}/reservations/res123`, {
      statusCode: 200,
      body: { success: true, message: 'Reserva cancelada' }
    }).as('cancelReservation');

    cy.visit(`${baseUrl}/reservations/res123`);
    cy.get('[data-testid="cancel-reservation"]').click();
    cy.get('[data-testid="confirm-cancel"]').click();

    cy.wait('@cancelReservation');
    cy.contains(/cancelada com sucesso|cancelled successfully/i).should('be.visible');
  });
});
