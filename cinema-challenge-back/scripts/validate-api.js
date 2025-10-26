/**
 * API Validation Script
 * 
 * Este script testa os principais endpoints da API para garantir que estão funcionando corretamente.
 * Executa uma série de testes nas rotas mais críticas e reporta erros ou sucesso.
 */

const axios = require('axios');

// Códigos ANSI para cores no terminal (funciona na maioria dos terminais modernos)
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Configurações
const API_URL = 'http://localhost:3000/api/v1'; // URL base da API
let authToken = '';
let userId = '';
let movieId = '';
let theaterId = '';
let sessionId = '';

// Usuário de teste
const testUser = {
  name: 'Usuário de Teste',
  email: `test${Date.now()}@example.com`,
  password: 'password123'
};

// Usuário admin predefinido (assumindo que existe no banco após o seed)
const adminUser = {
  email: 'admin@example.com',
  password: 'Admin123' // Ajustado para usar a senha correta (pode variar conforme o ambiente)
};

// Funções utilitárias
const log = {
  info: (msg) => console.log(`${colors.cyan}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg, error) => {
    console.log(`${colors.red}✗ ${msg}${colors.reset}`);
    if (error) {
      console.log(`${colors.red}  ${error.message || error}${colors.reset}`);
      if (error.response) {
        console.log(`${colors.red}  Status: ${error.response.status}${colors.reset}`);
        console.log(`${colors.red}  Data: ${JSON.stringify(error.response.data, null, 2)}${colors.reset}`);
      }
    }
  },
  heading: (msg) => console.log(`${colors.yellow}\n=== ${msg.toUpperCase()} ===${colors.reset}`)
};

// Configuração do Axios com tratamento de erros
const api = axios.create({ baseURL: API_URL });

// Interceptor para adicionar o token de autenticação quando disponível
api.interceptors.request.use(config => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Contadores de testes
const testStats = {
  success: 0,
  failure: 0,
  skipped: 0,
  total: 0
};

/**
 * Registra o resultado de um teste para estatísticas
 * @param {boolean} success - Se o teste foi bem-sucedido
 * @param {boolean} skipped - Se o teste foi ignorado
 */
function recordTestResult(success, skipped = false) {
  testStats.total++;
  if (skipped) {
    testStats.skipped++;
  } else if (success) {
    testStats.success++;
  } else {
    testStats.failure++;
  }
}

// Função principal
async function runTests() {
  try {
    log.info('Iniciando validação da API do Cinema App...\n');
      // Verificar se o servidor está online (usando a rota movies que sabemos que existe)
    try {
      await api.get('/movies');
      log.success('Servidor da API está online');
      testStats.success++;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        log.error('A rota de API não foi encontrada. Verifique se o caminho base está configurado corretamente.', err);
      } else {
        log.error('Servidor da API não está respondendo. Verifique se o servidor está em execução.', err);
      }
      log.info(`${colors.yellow}Execute 'npm run dev' para iniciar o servidor antes de executar este teste.${colors.reset}`);
      testStats.failure++;
      // Se não conseguir conectar ao servidor, não faz sentido continuar
      throw new Error('Não foi possível conectar ao servidor da API');
    }
    testStats.total++;

    // 1. Teste de Autenticação
    await testAuthentication();

    // 2. Teste das rotas de perfil
    await testProfile();
    
    // 3. Teste de rotas públicas
    await testPublicRoutes();
    
    // 4. Teste de rotas protegidas
    await testProtectedRoutes();
    
    // 5. Teste de rotas de admin
    await testAdminRoutes();    log.heading('Resultado');
    
    // Separador visual
    console.log("\n" + "=".repeat(50) + "\n");
    
    // Exibir estatísticas
    console.log(`${colors.bright}RESUMO DA VALIDAÇÃO DA API${colors.reset}\n`);
    console.log(`${colors.bright}Total de testes: ${testStats.total}${colors.reset}`);
    console.log(`${colors.green}✓ Testes bem-sucedidos: ${testStats.success}${colors.reset}`);
    console.log(`${colors.red}✗ Testes falhos: ${testStats.failure}${colors.reset}`);
    console.log(`${colors.yellow}⚠ Testes ignorados: ${testStats.skipped}${colors.reset}`);
    
    const successRate = Math.round((testStats.success / (testStats.total - testStats.skipped)) * 100) || 0;
    
    // Barra de progresso visual
    const progressBarWidth = 30;
    const successBlocks = Math.round((successRate / 100) * progressBarWidth);
    const failureBlocks = progressBarWidth - successBlocks;
    
    const progressBar = `${"█".repeat(successBlocks)}${"-".repeat(failureBlocks)}`;
    
    console.log(`\n${colors.bright}Taxa de sucesso:${colors.reset} ${successRate}% `);
    console.log(`${colors.green}${progressBar}${colors.reset}\n`);
    
    // Avaliação final
    if (testStats.failure === 0) {
      console.log(`${colors.green}✓ TODOS OS TESTES PASSARAM!${colors.reset}`);
      console.log(`${colors.green}Validação da API concluída com sucesso!${colors.reset}`);
    } else if (testStats.failure <= 2) {
      console.log(`${colors.yellow}⚠ QUASE LÁ!${colors.reset}`);
      console.log(`${colors.yellow}Validação concluída com apenas ${testStats.failure} falhas. Verifique os logs acima.${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ ATENÇÃO: PROBLEMAS DETECTADOS${colors.reset}`);
      console.log(`${colors.red}Validação concluída com ${testStats.failure} falhas. Consulte os logs para detalhes.${colors.reset}`);
    }
    
    console.log("\n" + "=".repeat(50));
    
  } catch (err) {
    log.heading('Falha na validação');
    log.error('O processo de validação falhou', err);
  }
}

// Testes de Autenticação
async function testAuthentication() {
  log.heading('Testes de Autenticação');
  
  // Teste de registro
  try {
    log.info(`Tentando registrar novo usuário: ${testUser.email}`);
    const registerResponse = await api.post('/auth/register', testUser);
    
    if (registerResponse.data.success && registerResponse.data.data) {
      authToken = registerResponse.data.data.token;
      userId = registerResponse.data.data._id;
      log.success(`Usuário registrado com sucesso! ID: ${userId}`);
      recordTestResult(true);
      
      // Teste de logout (removendo o token)
      try {
        log.info('Testando funcionalidade de logout (removendo token)');
        const originalToken = authToken;
        authToken = '';
        
        // Tentar acessar um endpoint protegido sem token
        try {
          await api.get('/auth/me');
          log.error('Erro no teste de logout: endpoint protegido acessível sem token');
          recordTestResult(false);
        } catch (protectedErr) {
          if (protectedErr.response && protectedErr.response.status === 401) {
            log.success('Logout funcionou: endpoint protegido retornou 401 Unauthorized');
            recordTestResult(true);
          } else {
            throw protectedErr;
          }
        }
        
        // Restaurar token para continuar os testes
        authToken = originalToken;
      } catch (logoutErr) {
        log.error('Erro no teste de logout', logoutErr);
        recordTestResult(false);
      }
    } else {
      throw new Error('Formato de resposta inválido no registro');
    }
  } catch (err) {
    log.error('Falha no registro do usuário', err);
    log.info('Tentando realizar login como alternativa...');
    
    // Tenta fazer login caso o registro falhe (por exemplo, se o email já estiver em uso)
    try {
      const loginResponse = await api.post('/auth/login', {
        email: testUser.email,
        password: testUser.password
      });
      
      if (loginResponse.data.success && loginResponse.data.data) {
        authToken = loginResponse.data.data.token;
        userId = loginResponse.data.data._id;
        log.success(`Login realizado com sucesso! ID: ${userId}`);
        recordTestResult(true);
        
        // Teste de login com credenciais inválidas
        try {
          log.info('Testando login com credenciais inválidas');
          await api.post('/auth/login', {
            email: testUser.email,
            password: 'senha_incorreta'
          });
          log.error('Erro: login com credenciais inválidas não falhou como esperado');
          recordTestResult(false);
        } catch (invalidLoginErr) {
          if (invalidLoginErr.response && invalidLoginErr.response.status === 401) {
            log.success('Login com credenciais inválidas falhou corretamente');
            recordTestResult(true);
          } else {
            log.error('Erro inesperado no teste de login inválido', invalidLoginErr);
            recordTestResult(false);
          }
        }
      } else {
        throw new Error('Formato de resposta inválido no login');
      }
    } catch (loginErr) {
      log.error('Falha no login', loginErr);
      recordTestResult(false);
      throw new Error('Não foi possível autenticar o usuário de teste');
    }
  }
}

// Testes de Perfil
async function testProfile() {
  log.heading('Testes de Perfil');
  
  // Teste para buscar o perfil
  try {
    log.info('Buscando perfil do usuário logado');
    const profileResponse = await api.get('/auth/me');
    
    if (profileResponse.data.success && profileResponse.data.data) {
      log.success(`Perfil recuperado: ${profileResponse.data.data.name} (${profileResponse.data.data.email})`);
      recordTestResult(true);
    } else {
      throw new Error('Formato de resposta inválido para perfil');
    }
  } catch (err) {
    log.error('Falha ao buscar perfil', err);
    recordTestResult(false);
  }
  
  // Teste para atualizar o perfil
  try {
    const newName = `${testUser.name} Updated ${Date.now()}`;
    log.info(`Atualizando nome do usuário para: ${newName}`);
    
    const updateResponse = await api.put('/auth/profile', { name: newName });
    
    if (updateResponse.data.success && updateResponse.data.data.name === newName) {
      log.success(`Nome atualizado com sucesso para: ${updateResponse.data.data.name}`);
      recordTestResult(true);
      
      // Verificar se a alteração persistiu
      try {
        log.info('Verificando se a alteração do perfil persistiu');
        const checkProfileResponse = await api.get('/auth/me');
        
        if (checkProfileResponse.data.success && 
            checkProfileResponse.data.data && 
            checkProfileResponse.data.data.name === newName) {
          log.success('Alteração do perfil persistiu corretamente');
          recordTestResult(true);
        } else {
          throw new Error('Alteração do perfil não persistiu');
        }
      } catch (checkErr) {
        log.error('Falha ao verificar persistência da alteração do perfil', checkErr);
        recordTestResult(false);
      }
    } else {
      throw new Error('Formato de resposta inválido ou nome não foi atualizado corretamente');
    }
  } catch (err) {
    log.error('Falha ao atualizar perfil', err);
    recordTestResult(false);
  }
  
  // Teste para tentar atualizar senha (se a API suportar)
  try {
    log.info('Tentando atualizar senha do usuário');
    
    const passwordUpdateData = {
      currentPassword: testUser.password,
      newPassword: `${testUser.password}New`
    };
    
    try {
      const updatePasswordResponse = await api.put('/auth/password', passwordUpdateData);
      
      if (updatePasswordResponse.data.success) {
        log.success('Senha atualizada com sucesso!');
        recordTestResult(true);
        
        // Voltar para a senha original para não afetar outros testes
        try {
          const revertPasswordData = {
            currentPassword: `${testUser.password}New`,
            newPassword: testUser.password
          };
          
          await api.put('/auth/password', revertPasswordData);
          log.info('Senha revertida ao valor original');
        } catch (revertErr) {
          log.info(`${colors.yellow}Não foi possível reverter a senha. Isso pode afetar outros testes.${colors.reset}`);
        }
      } else {
        throw new Error('Formato de resposta inválido para atualização de senha');
      }
    } catch (updateErr) {
      // Se o endpoint não existir, isso é esperado
      if (updateErr.response && updateErr.response.status === 404) {
        log.info(`${colors.yellow}Endpoint de atualização de senha não implementado (404). Pulando teste.${colors.reset}`);
        recordTestResult(true, true); // Marcar como ignorado
      } else {
        log.error('Falha ao tentar atualizar senha', updateErr);
        recordTestResult(false);
      }
    }
  } catch (err) {
    log.error('Erro ao tentar atualizar senha', err);
    recordTestResult(false);
  }
}

// Testes de rotas públicas
async function testPublicRoutes() {
  log.heading('Testes de Rotas Públicas');
  
  // Teste para listar filmes
  try {
    log.info('Buscando lista de filmes');
    const moviesResponse = await api.get('/movies');
    
    if (moviesResponse.data.success && Array.isArray(moviesResponse.data.data)) {
      const movieCount = moviesResponse.data.data.length;
      log.success(`${movieCount} filmes encontrados`);
      recordTestResult(true);
      
      if (movieCount > 0) {
        movieId = moviesResponse.data.data[0]._id;
        log.info(`Filme para testes: ${moviesResponse.data.data[0].title} (ID: ${movieId})`);
      }
    } else {
      throw new Error('Formato de resposta inválido para lista de filmes');
    }
  } catch (err) {
    log.error('Falha ao buscar filmes', err);
    recordTestResult(false);
  }
  
  // Se temos um ID de filme, busca os detalhes
  if (movieId) {
    try {
      log.info(`Buscando detalhes do filme ID: ${movieId}`);
      const movieResponse = await api.get(`/movies/${movieId}`);
      
      if (movieResponse.data.success && movieResponse.data.data) {
        log.success(`Detalhes do filme recuperados: ${movieResponse.data.data.title}`);
        recordTestResult(true);
          // Adicionar teste de busca por título
        try {
          const searchTitle = movieResponse.data.data.title.split(' ')[0]; // Pega a primeira palavra do título
          log.info(`Testando busca de filmes com termo: "${searchTitle}"`);
          
          try {
            const searchResponse = await api.get(`/movies/search?query=${encodeURIComponent(searchTitle)}`);
            
            if (searchResponse.data.success && Array.isArray(searchResponse.data.data)) {
              log.success(`Busca retornou ${searchResponse.data.data.length} resultados para "${searchTitle}"`);
              recordTestResult(true);
            } else {
              throw new Error('Formato de resposta inválido para busca de filmes');
            }
          } catch (searchErr) {
            if (searchErr.response && searchErr.response.status === 404) {
              log.info(`${colors.yellow}Endpoint de busca não implementado (404). Pulando teste.${colors.reset}`);
              recordTestResult(true, true); // Marcar como ignorado
            } else {
              log.error('Falha ao testar busca de filmes', searchErr);
              recordTestResult(false);
            }
          }
        } catch (err) {
          log.error('Erro ao preparar teste de busca', err);
          recordTestResult(false);
        }
      } else {
        throw new Error('Formato de resposta inválido para detalhes do filme');
      }
    } catch (err) {
      log.error('Falha ao buscar detalhes do filme', err);
      recordTestResult(false);
    }
  }
  
  // Teste para listar teatros/cinemas
  try {
    log.info('Buscando lista de teatros/cinemas');
    const theatersResponse = await api.get('/theaters');
    
    if (theatersResponse.data.success && Array.isArray(theatersResponse.data.data)) {
      const theaterCount = theatersResponse.data.data.length;
      log.success(`${theaterCount} teatros/cinemas encontrados`);
      recordTestResult(true);
      
      if (theaterCount > 0) {
        theaterId = theatersResponse.data.data[0]._id;
        log.info(`Teatro para testes: ${theatersResponse.data.data[0].name} (ID: ${theaterId})`);
        
        // Testar detalhes do teatro
        try {
          log.info(`Buscando detalhes do teatro ID: ${theaterId}`);
          const theaterResponse = await api.get(`/theaters/${theaterId}`);
          
          if (theaterResponse.data.success && theaterResponse.data.data) {
            log.success(`Detalhes do teatro recuperados: ${theaterResponse.data.data.name}`);
            recordTestResult(true);
          } else {
            throw new Error('Formato de resposta inválido para detalhes do teatro');
          }
        } catch (theaterErr) {
          log.error('Falha ao buscar detalhes do teatro', theaterErr);
          recordTestResult(false);
        }
      }
    } else {
      throw new Error('Formato de resposta inválido para lista de teatros');
    }
  } catch (err) {
    log.error('Falha ao buscar teatros', err);
    recordTestResult(false);
  }
  
  // Teste para listar sessões
  try {
    log.info('Buscando lista de sessões');
    const sessionsResponse = await api.get('/sessions');
    
    if (sessionsResponse.data.success && Array.isArray(sessionsResponse.data.data)) {
      const sessionCount = sessionsResponse.data.data.length;
      log.success(`${sessionCount} sessões encontradas`);
      recordTestResult(true);
      
      if (sessionCount > 0) {
        sessionId = sessionsResponse.data.data[0]._id;
        log.info(`Sessão para testes: ${sessionId} (${new Date(sessionsResponse.data.data[0].datetime).toLocaleString()})`);
      }
    } else {
      throw new Error('Formato de resposta inválido para lista de sessões');
    }
  } catch (err) {
    log.error('Falha ao buscar sessões', err);
    recordTestResult(false);
  }
  
  // Se temos um ID de sessão, busca os detalhes
  if (sessionId) {
    try {
      log.info(`Buscando detalhes da sessão ID: ${sessionId}`);
      const sessionResponse = await api.get(`/sessions/${sessionId}`);
      
      if (sessionResponse.data.success && sessionResponse.data.data) {
        log.success(`Detalhes da sessão recuperados para o filme: ${sessionResponse.data.data.movie.title}`);
        recordTestResult(true);
        
        // Teste de filtragem de sessões por filme
        if (movieId) {
          try {
            log.info(`Filtrando sessões pelo filme ID: ${movieId}`);
            const filterResponse = await api.get(`/sessions?movie=${movieId}`);
            
            if (filterResponse.data.success && Array.isArray(filterResponse.data.data)) {
              log.success(`Filtro retornou ${filterResponse.data.data.length} sessões para o filme específico`);
              recordTestResult(true);
            } else {
              throw new Error('Formato de resposta inválido para filtragem de sessões');
            }
          } catch (filterErr) {
            log.error('Falha ao filtrar sessões por filme', filterErr);
            recordTestResult(false);
          }
        }
      } else {
        throw new Error('Formato de resposta inválido para detalhes da sessão');
      }
    } catch (err) {
      log.error('Falha ao buscar detalhes da sessão', err);
      recordTestResult(false);
    }
  }
}

// Testes de rotas protegidas
async function testProtectedRoutes() {
  log.heading('Testes de Rotas Protegidas');
    // Teste de criar uma reserva
  if (sessionId) {
    try {
      log.info(`Criando reserva para a sessão ID: ${sessionId}`);
      
      // Primeiro vamos buscar os assentos disponíveis para evitar erros
      log.info('Buscando assentos disponíveis na sessão');
      const sessionDetailsResponse = await api.get(`/sessions/${sessionId}`);
      
      if (sessionDetailsResponse.data.success && sessionDetailsResponse.data.data) {
        const availableSeats = sessionDetailsResponse.data.data.seats.filter(seat => seat.status === 'available');
        
        if (availableSeats.length >= 2) {
          const seat1 = availableSeats[0];
          const seat2 = availableSeats[1];
          
          // Dados da reserva com assentos que sabemos estar disponíveis
          const reservationData = {
            session: sessionId,
            seats: [
              { row: seat1.row, number: seat1.number },
              { row: seat2.row, number: seat2.number }
            ],
            paymentType: 'card'
          };
          
          log.info(`Tentando reservar assentos: ${seat1.row}${seat1.number}, ${seat2.row}${seat2.number}`);
          
          try {
            const reserveResponse = await api.post('/reservations', reservationData);
            
            if (reserveResponse.data.success && reserveResponse.data.data) {
              const reservationId = reserveResponse.data.data._id;
              log.success(`Reserva criada com sucesso! ID: ${reservationId}`);
              recordTestResult(true);
              
              // Verifica as reservas do usuário
              log.info('Verificando lista de reservas do usuário');
              const userReservationsResponse = await api.get('/reservations/my');
              
              if (userReservationsResponse.data.success && Array.isArray(userReservationsResponse.data.data)) {
                log.success(`${userReservationsResponse.data.data.length} reservas encontradas para o usuário`);
                recordTestResult(true);
                
                // Verifica detalhes de uma reserva específica
                try {
                  log.info(`Buscando detalhes da reserva ID: ${reservationId}`);
                  const reservationDetailResponse = await api.get(`/reservations/${reservationId}`);
                  
                  if (reservationDetailResponse.data.success && reservationDetailResponse.data.data) {
                    log.success('Detalhes da reserva recuperados com sucesso');
                    recordTestResult(true);
                    
                    // Teste de cancelamento de reserva
                    try {
                      log.info(`Cancelando reserva ID: ${reservationId}`);
                      const cancelResponse = await api.delete(`/reservations/${reservationId}`);
                      
                      if (cancelResponse.data.success) {
                        log.success('Reserva cancelada com sucesso');
                        recordTestResult(true);
                      } else {
                        throw new Error('Formato de resposta inválido para cancelamento de reserva');
                      }
                    } catch (cancelErr) {
                      log.error('Falha ao cancelar reserva', cancelErr);
                      recordTestResult(false);
                    }
                  } else {
                    throw new Error('Formato de resposta inválido para detalhes da reserva');
                  }
                } catch (detailErr) {
                  log.error('Falha ao buscar detalhes da reserva', detailErr);
                  recordTestResult(false);
                }
              } else {
                throw new Error('Formato de resposta inválido para lista de reservas do usuário');
              }
            } else {
              throw new Error('Formato de resposta inválido para criação de reserva');
            }
          } catch (reserveErr) {
            log.error('Falha ao criar reserva', reserveErr);
            recordTestResult(false);
          }
        } else {
          log.info(`${colors.yellow}Não há assentos disponíveis suficientes para teste de reserva. Pulando...${colors.reset}`);
          recordTestResult(true, true); // Marcar como ignorado
        }
      } else {
        log.error('Falha ao buscar detalhes da sessão para encontrar assentos disponíveis');
        recordTestResult(false);
      }
    } catch (err) {
      log.error('Falha no teste de reservas', err);
      recordTestResult(false);
    }
  }
}

// Testes de rotas admin
async function testAdminRoutes() {
  log.heading('Testes de Permissões Admin');
    // Reset do token
  const previousToken = authToken;
    try {
    log.info(`Tentando login como admin: ${adminUser.email}`);
    log.info(`${colors.yellow}Nota: Se o login admin falhar, verifique se as credenciais admin estão corretas no script${colors.reset}`);
    const adminLoginResponse = await api.post('/auth/login', adminUser);
    
    if (adminLoginResponse.data.success && adminLoginResponse.data.data) {
      authToken = adminLoginResponse.data.data.token;
      log.success('Login admin realizado com sucesso!');
      recordTestResult(true);
      
      // Teste de funcionalidade admin - resetar assentos de uma sessão
      if (sessionId) {
        try {
          log.info(`Tentando resetar assentos da sessão ID: ${sessionId}`);
          const resetResponse = await api.put(`/sessions/${sessionId}/reset-seats`);
          
          if (resetResponse.data.success) {
            log.success('Assentos da sessão resetados com sucesso!');
            recordTestResult(true);
          } else {
            throw new Error('Formato de resposta inválido para reset de assentos');
          }
        } catch (err) {
          log.error('Falha ao resetar assentos (requer permissão de admin)', err);
          recordTestResult(false);
        }
      }
      
      // Teste de criar um novo filme (admin)
      try {
        const newMovie = {
          title: `Filme Teste ${Date.now()}`,
          description: 'Este é um filme criado pelo script de validação da API',
          genre: ['Teste'],
          duration: 120,
          releaseDate: new Date().toISOString(),
          poster: 'https://example.com/poster.jpg'
        };
        
        log.info(`Tentando criar novo filme: ${newMovie.title}`);
        const createMovieResponse = await api.post('/movies', newMovie);
        
        if (createMovieResponse.data.success && createMovieResponse.data.data) {
          const createdMovieId = createMovieResponse.data.data._id;
          log.success(`Filme criado com sucesso! ID: ${createdMovieId}`);
          recordTestResult(true);
          
          // Teste de atualização do filme criado
          try {
            const updatedTitle = `${newMovie.title} (Atualizado)`;
            log.info(`Tentando atualizar filme ID: ${createdMovieId}`);
            
            const updateMovieResponse = await api.put(`/movies/${createdMovieId}`, {
              title: updatedTitle
            });
            
            if (updateMovieResponse.data.success && updateMovieResponse.data.data.title === updatedTitle) {
              log.success(`Filme atualizado com sucesso para: ${updatedTitle}`);
              recordTestResult(true);
            } else {
              throw new Error('Formato de resposta inválido para atualização de filme');
            }
          } catch (updateErr) {
            log.error('Falha ao atualizar filme', updateErr);
            recordTestResult(false);
          }
          
          // Teste de exclusão do filme criado (limpeza)
          try {
            log.info(`Excluindo filme de teste ID: ${createdMovieId}`);
            const deleteResponse = await api.delete(`/movies/${createdMovieId}`);
            
            if (deleteResponse.data.success) {
              log.success('Filme excluído com sucesso!');
              recordTestResult(true);
            } else {
              throw new Error('Formato de resposta inválido para exclusão de filme');
            }
          } catch (deleteErr) {
            log.error('Falha ao excluir filme de teste', deleteErr);
            recordTestResult(false);
          }
        } else {
          throw new Error('Formato de resposta inválido para criação de filme');
        }
      } catch (err) {
        log.error('Falha ao criar filme (requer permissão de admin)', err);
        recordTestResult(false);
      }
      
      // Teste criar uma nova sessão (admin)
      if (movieId && theaterId) {
        try {
          // Data para a sessão (amanhã às 18h)
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(18, 0, 0, 0);
          
          const sessionData = {
            movie: movieId,
            theater: theaterId,
            datetime: tomorrow.toISOString(),
            fullPrice: 25.00,
            halfPrice: 12.50
          };
          
          log.info('Tentando criar uma nova sessão');
          const createSessionResponse = await api.post('/sessions', sessionData);
          
          if (createSessionResponse.data.success && createSessionResponse.data.data) {
            const newSessionId = createSessionResponse.data.data._id;
            log.success(`Sessão criada com sucesso! ID: ${newSessionId}`);
            recordTestResult(true);
            
            // Excluir a sessão criada (limpeza)
            try {
              log.info(`Excluindo sessão de teste ID: ${newSessionId}`);
              const deleteResponse = await api.delete(`/sessions/${newSessionId}`);
              
              if (deleteResponse.data.success) {
                log.success('Sessão excluída com sucesso!');
                recordTestResult(true);
              } else {
                throw new Error('Formato de resposta inválido para exclusão de sessão');
              }
            } catch (deleteErr) {
              log.error('Falha ao excluir sessão de teste', deleteErr);
              recordTestResult(false);
            }
          } else {
            throw new Error('Formato de resposta inválido para criação de sessão');
          }
        } catch (err) {
          log.error('Falha ao criar sessão (requer permissão de admin)', err);
          recordTestResult(false);
        }
      }
    } else {
      throw new Error('Formato de resposta inválido para login admin');
    }
  } catch (err) {
    log.error('Falha ao testar login admin', err);
    recordTestResult(false);
  }
  
  // Restaura token original
  authToken = previousToken;
}

// Inicia a validação
runTests();
