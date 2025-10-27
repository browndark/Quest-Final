describe('Movies - Details', () => {
  const baseUrl = Cypress.env('baseUrl') || 'http://localhost:3002';
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:5000/api/v1';

  it('should display movie information', () => {
    const mockMovie = {
      id: '123',
      title: 'Test Movie',
      genre: 'Action',
      duration: 120,
      rating: 'PG-13',
      synopsis: 'A test movie synopsis'
    };

    cy.intercept('GET', `${apiUrl}/movies/123`, {
      statusCode: 200,
      body: { success: true, data: mockMovie }
    }).as('getMovie');

    cy.visit(`${baseUrl}/movies/123`);
    cy.wait('@getMovie');

    cy.get('[data-testid="movie-title"]').should('contain', 'Test Movie');
    cy.get('[data-testid="movie-genre"]').should('contain', 'Action');
    cy.get('[data-testid="movie-duration"]').should('contain', '120');
  });

  it('should list available sessions with times', () => {
    const mockSessions = [
      { id: 1, time: '14:00', date: '2024-01-20', availableSeats: 50 },
      { id: 2, time: '19:00', date: '2024-01-20', availableSeats: 30 }
    ];

    cy.intercept('GET', `${apiUrl}/sessions?movieId=123`, {
      statusCode: 200,
      body: { success: true, data: mockSessions }
    }).as('getSessions');

    cy.visit(`${baseUrl}/movies/123`);
    cy.wait('@getSessions');

    cy.get('[data-testid="session-card"]').should('have.length', 2);
    cy.get('[data-testid="session-time"]').first().should('contain', '14:00');
  });
});
