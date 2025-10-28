# 🧪 Cypress E2E Tests - Cinema Challenge

## 📋 Estrutura de Testes

```
cypress/e2e/
├── auth/
│   ├── login.cy.js           # 5 testes - Login (200, 400, 401, validações)
│   └── register.cy.js        # 5 testes - Registro (201, 409, validações)
├── movies/
│   ├── list.cy.js            # 3 testes - Listagem e filtros
│   └── details.cy.js         # 2 testes - Detalhes e sessões
├── reservations/
│   └── booking.cy.js         # 5 testes - Fluxo de reserva
└── e2e/
    ├── complete-booking-flow.cy.js    # 2 testes - Fluxo completo E2E
    └── error-scenarios.cy.js          # 20+ testes - Cenários negativos
```

**Total: 42+ testes E2E** cobrindo caminho feliz e cenários de erro

---

## 🎯 Cobertura de Testes

### ✅ Caminho Feliz (Happy Path)

#### **Autenticação**
- ✅ Login com credenciais válidas (200)
- ✅ Registro de novo usuário (201)
- ✅ Persistência de token JWT
- ✅ Logout com limpeza de sessão

#### **Navegação e Filmes**
- ✅ Listar filmes disponíveis
- ✅ Paginação funcional
- ✅ Filtrar por gênero
- ✅ Ver detalhes do filme
- ✅ Ver sessões disponíveis

#### **Reservas**
- ✅ Selecionar sessão
- ✅ Escolher assentos disponíveis
- ✅ Calcular total corretamente
- ✅ Confirmar reserva
- ✅ Ver confirmação com ID da reserva
- ✅ Listar minhas reservas

#### **Fluxo Completo E2E**
- ✅ Login → Buscar filme → Selecionar sessão → Reservar assentos → Confirmar → Ver reserva

---

### ❌ Cenários Negativos (Error Scenarios)

#### **Autenticação - Erros**
- ❌ Login com email inválido (400)
- ❌ Login com senha incorreta (401)
- ❌ Registro com email duplicado (409)
- ❌ Senha muito curta (validação)
- ❌ Senhas não coincidem (validação)
- ❌ Token expirado (401)
- ❌ Acesso sem autenticação (redirect)

#### **Reservas - Erros**
- ❌ Reservar assento ocupado (409)
- ❌ Sessão inexistente (404)
- ❌ Cancelar reserva de outro usuário (403)
- ❌ Tentar reservar sem selecionar assentos
- ❌ Reservar sessão passada (400)
- ❌ Exceder limite máximo de assentos

#### **Filmes - Erros**
- ❌ Lista vazia de filmes
- ❌ Filme inexistente (404)
- ❌ Filme sem sessões disponíveis

#### **Validações de Formulário**
- ❌ Email inválido
- ❌ Campos obrigatórios vazios
- ❌ Senha muito curta
- ❌ Confirmação de senha diferente

#### **Erros de Servidor**
- ❌ Erro 500 (servidor)
- ❌ Erro de conexão/timeout
- ❌ Erro de rede

---

## 🚀 Executar Testes

### Pré-requisitos

1. **Frontend rodando:**
```bash
cd cinema-challenge-front
npm install
npm run dev
# Deve iniciar em http://localhost:3002
```

2. **Backend rodando (opcional para testes mocados):**
```bash
cd cinema-challenge-back
npm start
# Deve iniciar em http://localhost:5000
```

### Executar Testes

#### Modo Interativo (recomendado para desenvolvimento)
```bash
cd cinema-challenge-front
npx cypress open
```
- Selecione "E2E Testing"
- Escolha o browser (Chrome recomendado)
- Clique em um arquivo de teste para executar

#### Modo Headless (CI/CD)
```bash
cd cinema-challenge-front
npx cypress run
```

#### Executar arquivo específico
```bash
npx cypress run --spec "cypress/e2e/e2e/complete-booking-flow.cy.js"
```

#### Executar com browser específico
```bash
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
```

---

## 📊 Relatórios e Artefatos

Após execução em modo headless, são gerados:

### Screenshots (em caso de falha)
```
cypress/screenshots/
├── auth/login.cy.js/
├── reservations/booking.cy.js/
└── ...
```

### Vídeos
```
cypress/videos/
├── auth/login.cy.js.mp4
├── e2e/complete-booking-flow.cy.js.mp4
└── ...
```

### Visualizar relatórios
```bash
# Instalar Cypress Dashboard (opcional)
npx cypress run --record --key <seu-key>
```

---

## ⚙️ Configuração

### cypress.config.js
```javascript
{
  baseUrl: 'http://localhost:3002',
  env: {
    apiUrl: 'http://localhost:5000/api/v1'
  },
  video: true,
  screenshotOnRunFailure: true,
  viewportWidth: 1280,
  viewportHeight: 720
}
```

### Variáveis de Ambiente
Edite `cypress.env.json` para customizar:
```json
{
  "baseUrl": "http://localhost:3002",
  "apiUrl": "http://localhost:5000/api/v1"
}
```

---

## 🔍 Data Test IDs

Os testes usam `data-testid` para selecionar elementos. Certifique-se de que os componentes têm:

### Login/Registro
- `[data-testid="email-input"]`
- `[data-testid="password-input"]`
- `[data-testid="login-button"]`
- `[data-testid="register-button"]`

### Filmes
- `[data-testid="movie-card"]`
- `[data-testid="movie-title"]`
- `[data-testid="genre-filter"]`

### Sessões e Reservas
- `[data-testid="session-card"]`
- `[data-testid="seat-A1"]`, `[data-testid="seat-B2"]`, etc.
- `[data-testid="selected-seats"]`
- `[data-testid="total-price"]`
- `[data-testid="confirm-booking"]`

### Navegação
- `[data-testid="nav-movies"]`
- `[data-testid="nav-my-reservations"]`
- `[data-testid="user-menu"]`
- `[data-testid="logout-button"]`

---

## 🧩 Mocks e Interceptação

Os testes usam `cy.intercept()` para mockar chamadas API:

```javascript
cy.intercept('POST', `${apiUrl}/auth/login`, {
  statusCode: 200,
  body: { success: true, token: 'fake-token' }
}).as('login');

cy.wait('@login');
```

Isso permite:
- ✅ Testar sem backend rodando
- ✅ Simular cenários de erro
- ✅ Testes rápidos e determinísticos
- ✅ Controle total sobre respostas

---

## 📈 Métricas de Teste

### Status Atual
- **Total de testes:** 42+
- **Cobertura:** 
  - Autenticação: 100%
  - Navegação: 100%
  - Reservas: 100%
  - Cenários negativos: 20+ casos

### Tempo de Execução
- **Modo interativo:** ~30 segundos (por arquivo)
- **Modo headless:** ~2-3 minutos (todos os testes)

---

## 🐛 Troubleshooting

### Erro: "cy.visit() failed trying to load"
**Solução:** Verifique se o frontend está rodando em `http://localhost:3002`

### Erro: "Timed out retrying"
**Solução:** 
- Aumente o timeout no `cypress.config.js`
- Verifique se os `data-testid` estão corretos
- Use `cy.wait()` para aguardar requisições

### Screenshots não são geradas
**Solução:** 
- Verifique `screenshotOnRunFailure: true` no config
- Execute em modo headless: `npx cypress run`

### Vídeos não são gerados
**Solução:**
- Verifique `video: true` no config
- Execute em modo headless

---

## ✅ Checklist de Entrega

- [x] ✅ Testes de autenticação (login, registro)
- [x] ✅ Testes de navegação (filmes, detalhes)
- [x] ✅ Testes de reserva (seleção, confirmação)
- [x] ✅ **Fluxo E2E completo** (login → filme → reserva)
- [x] ✅ **Cenários negativos** (401, 403, 404, 409, 500)
- [x] ✅ Validações de formulário
- [x] ✅ Mocks de API
- [x] ✅ Screenshots em falhas
- [x] ✅ Gravação de vídeos
- [x] ✅ Documentação completa

---

## 🔗 Recursos

- [Cypress Docs](https://docs.cypress.io/)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Intercept API](https://docs.cypress.io/api/commands/intercept)
- [Data Test IDs](https://docs.cypress.io/guides/references/best-practices#Selecting-Elements)

---

**Última atualização:** 28/10/2025  
**Mantido por:** Bruno Custodio de Castro - String Testers  
**Status:** ✅ **Completo - Pronto para entrega**
