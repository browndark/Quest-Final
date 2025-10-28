/**
 * E2E Complete Booking Flow
 * Testa o fluxo completo de ponta a ponta: Login -> Buscar filme -> Selecionar sessão -> Reservar
 */

describe('E2E - Complete Booking Flow (Happy Path)', () => {
  const baseUrl = Cypress.env('baseUrl') || 'http://localhost:3002';
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:5000/api/v1';

  const mockUser = {
    id: 'user123',
    name: 'Test User',
    email: 'testuser@example.com',
    role: 'user'
  };

  const mockMovie = {
    id: 'movie123',
    title: 'Vingadores: Ultimato',
    genre: 'Ação',
    duration: 181,
    rating: '12',
    synopsis: 'Os heróis mais poderosos da Terra enfrentam Thanos'
  };

  const mockSessions = [
    { 
      id: 'session123', 
      movieId: 'movie123',
      time: '14:00', 
      date: '2025-11-01', 
      theaterId: 'theater1',
      theaterName: 'Sala 1',
      availableSeats: 48,
      price: 25
    },
    { 
      id: 'session456', 
      movieId: 'movie123',
      time: '19:00', 
      date: '2025-11-01', 
      theaterId: 'theater2',
      theaterName: 'Sala 2',
      availableSeats: 35,
      price: 30
    }
  ];

  const mockSeats = [
    { id: 'A1', row: 'A', number: 1, status: 'available' },
    { id: 'A2', row: 'A', number: 2, status: 'available' },
    { id: 'A3', row: 'A', number: 3, status: 'reserved' },
    { id: 'B1', row: 'B', number: 1, status: 'available' },
    { id: 'B2', row: 'B', number: 2, status: 'available' }
  ];

  beforeEach(() => {
    // Clear storage
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('🎯 CAMINHO FELIZ COMPLETO: Login -> Buscar filme -> Reservar -> Confirmar', () => {
    // ==========================================
    // STEP 1: LOGIN
    // ==========================================
    cy.intercept('POST', `${apiUrl}/auth/login`, {
      statusCode: 200,
      body: { 
        success: true, 
        token: 'fake-jwt-token-e2e',
        user: mockUser
      }
    }).as('login');

    cy.visit(`${baseUrl}/login`);
    cy.get('[data-testid="email-input"]').type(mockUser.email);
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    cy.wait('@login');
    cy.window().its('localStorage.token').should('equal', 'fake-jwt-token-e2e');
    cy.url().should('include', '/dashboard');

    // ==========================================
    // STEP 2: NAVEGAR PARA LISTA DE FILMES
    // ==========================================
    cy.intercept('GET', `${apiUrl}/movies*`, {
      statusCode: 200,
      body: { 
        success: true, 
        items: [mockMovie],
        total: 1,
        page: 1,
        limit: 20
      }
    }).as('getMovies');

    cy.get('[data-testid="nav-movies"]').click();
    cy.wait('@getMovies');
    cy.url().should('include', '/movies');

    // ==========================================
    // STEP 3: SELECIONAR FILME
    // ==========================================
    cy.intercept('GET', `${apiUrl}/movies/${mockMovie.id}`, {
      statusCode: 200,
      body: { success: true, data: mockMovie }
    }).as('getMovie');

    cy.intercept('GET', `${apiUrl}/sessions?movieId=${mockMovie.id}*`, {
      statusCode: 200,
      body: { success: true, data: mockSessions }
    }).as('getSessions');

    cy.get('[data-testid="movie-card"]').first().click();
    cy.wait('@getMovie');
    cy.wait('@getSessions');

    cy.get('[data-testid="movie-title"]').should('contain', mockMovie.title);
    cy.get('[data-testid="session-card"]').should('have.length', 2);

    // ==========================================
    // STEP 4: SELECIONAR SESSÃO
    // ==========================================
    cy.intercept('GET', `${apiUrl}/sessions/${mockSessions[0].id}/seats`, {
      statusCode: 200,
      body: { success: true, data: mockSeats }
    }).as('getSeats');

    cy.get('[data-testid="session-card"]').first().click();
    cy.wait('@getSeats');
    cy.url().should('include', `/sessions/${mockSessions[0].id}/book`);

    // ==========================================
    // STEP 5: SELECIONAR ASSENTOS
    // ==========================================
    cy.get('[data-testid="seat-A1"]').click();
    cy.get('[data-testid="seat-A2"]').click();

    cy.get('[data-testid="selected-seats"]').should('contain', 'A1');
    cy.get('[data-testid="selected-seats"]').should('contain', 'A2');
    cy.get('[data-testid="seat-count"]').should('contain', '2');
    cy.get('[data-testid="total-price"]').should('contain', '50'); // 2 * 25

    // Verificar que assento reservado não pode ser selecionado
    cy.get('[data-testid="seat-A3"]').should('have.class', 'reserved');
    cy.get('[data-testid="seat-A3"]').should('be.disabled');

    // ==========================================
    // STEP 6: CONFIRMAR RESERVA
    // ==========================================
    cy.intercept('POST', `${apiUrl}/reservations`, {
      statusCode: 201,
      body: { 
        success: true, 
        data: { 
          id: 'reservation789',
          sessionId: mockSessions[0].id,
          userId: mockUser.id,
          seats: ['A1', 'A2'],
          total: 50,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        } 
      }
    }).as('createReservation');

    cy.get('[data-testid="confirm-booking"]').click();
    cy.wait('@createReservation');

    // ==========================================
    // STEP 7: CONFIRMAÇÃO DE SUCESSO
    // ==========================================
    cy.url().should('include', '/reservations/success');
    cy.contains(/reserva confirmada|booking confirmed/i).should('be.visible');
    cy.get('[data-testid="reservation-id"]').should('contain', 'reservation789');
    cy.get('[data-testid="reservation-seats"]').should('contain', 'A1, A2');
    cy.get('[data-testid="reservation-total"]').should('contain', '50');

    // ==========================================
    // STEP 8: VER MINHAS RESERVAS
    // ==========================================
    cy.intercept('GET', `${apiUrl}/reservations/my-reservations`, {
      statusCode: 200,
      body: { 
        success: true, 
        data: [{
          id: 'reservation789',
          sessionId: mockSessions[0].id,
          movieTitle: mockMovie.title,
          seats: ['A1', 'A2'],
          total: 50,
          status: 'confirmed',
          sessionTime: mockSessions[0].time,
          sessionDate: mockSessions[0].date
        }]
      }
    }).as('getMyReservations');

    cy.get('[data-testid="nav-my-reservations"]').click();
    cy.wait('@getMyReservations');

    cy.url().should('include', '/my-reservations');
    cy.get('[data-testid="reservation-card"]').should('have.length', 1);
    cy.get('[data-testid="reservation-movie"]').should('contain', mockMovie.title);
  });

  it('🎯 FLUXO COM LOGOUT', () => {
    // Login
    cy.intercept('POST', `${apiUrl}/auth/login`, {
      statusCode: 200,
      body: { 
        success: true, 
        token: 'fake-jwt-token',
        user: mockUser
      }
    }).as('login');

    cy.visit(`${baseUrl}/login`);
    cy.get('[data-testid="email-input"]').type(mockUser.email);
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    cy.wait('@login');
    cy.url().should('include', '/dashboard');

    // Logout
    cy.get('[data-testid="user-menu"]').click();
    cy.get('[data-testid="logout-button"]').click();

    // Verificar que foi redirecionado e token removido
    cy.url().should('include', '/login');
    cy.window().its('localStorage.token').should('not.exist');
  });
});
