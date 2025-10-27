describe('Movies - List and Filter', () => {
  const baseUrl = Cypress.env('baseUrl') || 'http://localhost:3002';
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:5000/api/v1';

  beforeEach(() => {
    cy.visit(`${baseUrl}/movies`);
  });

  it('should load list of available movies', () => {
    cy.intercept('GET', `${apiUrl}/movies*`).as('getMovies');

    cy.wait('@getMovies').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body.items).to.be.an('array');
    });

    cy.get('[data-testid="movie-card"]').should('have.length.at.least', 1);
  });

  it('should implement functional pagination', () => {
    cy.intercept('GET', `${apiUrl}/movies?limit=20`).as('getFirstPage');
    
    cy.wait('@getFirstPage');
    cy.get('[data-testid="movie-card"]').should('have.length.at.most', 20);

    cy.get('[data-testid="next-page"]').click();
    cy.url().should('include', 'page=2');
  });

  it('should filter movies by genre', () => {
    cy.intercept('GET', `${apiUrl}/movies?genre=*`).as('filterByGenre');

    cy.get('[data-testid="genre-filter"]').select('Ação');
    cy.wait('@filterByGenre');

    cy.get('[data-testid="movie-card"]').each(($card) => {
      cy.wrap($card).find('[data-testid="movie-genre"]').should('contain', 'Ação');
    });
  });
});
