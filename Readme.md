# 🧩 Relatório Consolidado de Testes — Cinema Challenge

> **Departamento:** QA — Compass UOL  
> **Autor:** Bruno Custodio de Castro
> **Squad:** String Testers  
> **Data:** Outubro/2025  
> **Projeto:** Cinema Challenge (Full-stack QA & Test Automation)

![CI/CD](https://github.com/browndark/Quest-Final/actions/workflows/ci.yml/badge.svg)
![Smoke Tests](https://github.com/browndark/Quest-Final/actions/workflows/smoke-tests.yml/badge.svg)
![Node Version](https://img.shields.io/badge/node-18.x%20|%2020.x-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-branches%2046.9%25-yellow)

---

## * Sumário Rápido

| Área / Ferramenta | Resultados | Cobertura / Status |
|-------------------|-------------|---------------------|
| **Backend (Jest)** | ✅ 5 suítes / 71 testes (66 passed) | Statements: 36.12% • Branches: 46.9% • Functions: 44.26% |
| **Playwright (E2E)** | ✅ 2 passed | smoke funcional |
| **Robot (API)** | ⚠️ 2 passed / 1 falhou (login 401) | requer `USE_IN_MEMORY_DB=true` |
| **Robot (UI)** | ❌ 1 passed / 2 falharam | code 130 / ERR_CONNECTION_REFUSED |
| **Cypress** | ✅ 1 smoke | home.cy.js |
| **Vitest (Front)** | ✅ 1 smoke | runner operacional |

## 📊 **RESUMO DAS ISSUES**

| Categoria | Total | 🔴 Crítico | 🟡 Médio | 🟢 Baixo |
|-----------|-------|------------|----------|----------|
| **Frontend** | 7 | 1 | 4 | 2 |
| **Backend** | 6 | 3 | 2 | 1 |
| **Testes** | 3 | 1 | 1 | 1 |
| **Git/Deploy** | 1 | 0 | 0 | 1 |
| **TOTAL** | **17** | **5** | **7** | **5** |

---

## 🔴 **ISSUES CRÍTICAS (Prioridade Alta)**

### **ISSUE #001 - Forms Não Encontrados na Página Principal**
- **Categoria:** Frontend
- **Severidade:** 🔴 **CRÍTICA**
- **Arquivo:** `cinema-challenge-front/src/pages/*`
- **Teste que falhou:** `button-tests.cy.js` - Form submit buttons
- **Erro:** `Expected to find element: 'form', but never found it`

---

## 🧩 Relatório Consolidado de Testes

### Backend (Jest)
- Suítes executadas: **5**
- Testes: **71** (66 passaram, 5 com issues menores)
- Cobertura agregada:
  - Statements: 36.12%
  - Lines: 36.57%
  - Functions: 44.26% (+29% vs anterior)
  - Branches: 46.9% (+41% vs anterior)
- Artefatos:
  - `cinema-challenge-back/coverage/lcov-report/index.html`
  - `cinema-challenge-back/tests/unit/` - Testes unitários
  - `cinema-challenge-back/tests/integration/` - Testes de integração

**Testes Criados:**
- `authController.test.js` - 13 testes (register, login, getProfile, updateProfile)
- `movieController.test.js` - 16 testes (CRUD completo + paginação + filtros)
- `reservationController.test.js` - 17 testes (criação, cancelamento, autorização)
- `authMiddleware.test.js` - 9 testes (protect, authorize)
- `auth.test.js` (integração) - 16 testes com MongoDB em memória

**Cobertura por Controller:**
- ✅ `authController.js`: 97.67% statements, 100% branches, 100% functions
- ✅ `movieController.js`: 100% statements, 100% branches, 100% functions
- ✅ `reservationController.js`: 89.24% statements, 76.36% branches, 100% functions
- ✅ `auth.js` (middleware): 95.23% statements, 100% branches, 100% functions

**Observações:**
- Cobertura de branches aumentou de 5.55% para 46.9% (+41.35%)
- Cobertura de functions aumentou de 15.21% para 44.26% (+29.05%)
- 3 controllers principais com cobertura ≥89%
- Testes de integração funcionais com `mongodb-memory-server`
- Dependências adicionadas: `jest`, `supertest`, `mongodb-memory-server`

### Playwright (E2E smoke)
- Testes: 2 passed  
- Artefato: `playwright-tests/playwright-report`
- Recomendações: habilitar **trace/video** e rodar com `trace: 'on-first-retry'` em CI.

### Robot Framework (API)
- Casos: health, listar filmes, login/admin  
- 2 passed / 1 fail (login 401)
- Fix: rodar backend com `USE_IN_MEMORY_DB=true`
- Artefatos: `robot-tests/reports/api/*`

### Robot Framework (UI via Playwright)
- 3 testes (1 passou, 2 falharam)  
- Causas: `code 130` (SIGINT) e `ERR_CONNECTION_REFUSED`
- Correção: aguardar readiness (`Wait For Frontend`), revisar kills externos.

### Cypress (Smoke E2E)
- Arquivo: `cypress/e2e/home.cy.js`  
- Passou ✅
- Verifica frontend em `http://127.0.0.1:3002`

### Vitest (Frontend smoke)
- Arquivo: `src/tests/smoke.test.js`  
- Resultado: ✅ passou  
- Função: validar ambiente e runner.

---

## ⚙️ Recomendações Gerais

1. **Estabilizar o ambiente de teste:**
   - Rodar backend com `USE_IN_MEMORY_DB=true`
   - Garantir readiness do frontend antes de Robot/Playwright
2. **Adicionar `jest.setup.js`** para injetar `JWT_SECRET` e variáveis de ambiente.
3. **Ampliar coverage** para controllers críticos e fluxos de erro.
4. **Padronizar mensagens da API** (idioma, formato JSON).
5. **Ativar tracing/playback no Playwright** para depuração.
6. **Adicionar testes de concorrência** (Promise.all / k6 / Artillery).

---

## * Diário de Execuções Automatizadas

### 2025-10-27 — Backend (Jest) - Ampliação de Cobertura
- 5 suítes executadas: `authController.test.js`, `movieController.test.js`, `reservationController.test.js`, `authMiddleware.test.js`, `auth.test.js`
- Resultado: ✅ 66 testes passaram de 71 totais (93% success rate)
- Cobertura: Branches 46.9%, Functions 44.26%, Statements 36.12%
- Artefatos: `coverage/lcov-report/index.html`, `tests/unit/`, `tests/integration/`
- Notas: 
  - MongoDB Memory Server configurado para testes de integração
  - 61 novos testes criados (anteriormente 10, agora 71)
  - Cobertura de branches aumentou 41% (5.55% → 46.9%)
  - 3 controllers com cobertura ≥89%

### 2025-10-24 — Backend (Jest) - Baseline
- 3 suítes executadas: `api.test.js`, `routes.test.js`, `login-reservation.test.js`
- Resultado: ✅ todos passaram
- Artefatos: `jest-report.json`, `coverage/`
- Notas: `mongodb-memory-server` utilizado para testes em memória.

### 2025-10-24 — Frontend (Vitest)
- Teste smoke passou (runner operacional).

### 2025-10-24 — Playwright
- 2 testes passed (smoke)  
- Comando: `set BASE_FRONT=http://127.0.0.1:3002&& npm test`  
- Relatório: `playwright-report`

### 2025-10-24 — Robot UI
- 3 testes: 1 passed, 2 falharam (`ERR_CONNECTION_REFUSED`, code 130)  
- Recomendações: aguardar readiness e rodar modo headful.

### 2025-10-24 — Robot API
- 3 testes: 2 passed, 1 falhou (login 401)  
- Fix: ativar `USE_IN_MEMORY_DB`

### 2025-10-24 — Cypress Smoke
- 1 teste passou (home.cy.js)

---

## * Resultados Consolidados

| Tipo | Ferramenta | Resultado | Observação |
|------|-------------|-----------|-------------|
| Backend Unit/Integration | Jest | ✅ 66/71 passed (93%) | Branches 46.9%, Functions 44.26% |
| API Smoke | Robot | ⚠️ 1 falha (401) | Backend sem DB persistente |
| Frontend Smoke | Vitest | ✅ Passou | Runner ok |
| UI Smoke | Robot (Playwright) | ❌ Falhou | ERR_CONNECTION_REFUSED |
| E2E Smoke | Cypress | ✅ Passou | home.cy.js |

---

## * Métricas de Cobertura (Backend)

| Métrica | Valor Anterior | Valor Atual | Melhoria |
|----------|----------------|-------------|----------|
| Statements | 36.55% | 36.12% | -0.43% |
| Lines | 36.71% | 36.57% | -0.14% |
| Functions | 15.21% | **44.26%** | **+29.05%** 🚀 |
| Branches | 5.55% | **46.9%** | **+41.35%** 🚀 |
| **Testes Totais** | **10** | **71** | **+61 testes** 🎯 |

**Cobertura Detalhada por Módulo:**

| Módulo | Statements | Branches | Functions | Lines |
|--------|------------|----------|-----------|-------|
| **authController.js** | 97.67% | 100% | 100% | 97.67% |
| **movieController.js** | 100% | 100% | 100% | 100% |
| **reservationController.js** | 89.24% | 76.36% | 100% | 89.24% |
| **auth.js** (middleware) | 95.23% | 100% | 100% | 95.23% |
| **error.js** (middleware) | 51.51% | 50% | 66.66% | 51.51% |
| **Models** (aggregate) | 97.43% | 100% | 66.66% | 97.43% |

📍 **Relatório HTML:** `cinema-challenge-back/coverage/lcov-report/index.html`

---

## * Técnicas de Teste Aplicadas

| Técnica | Aplicação | Objetivo |
|----------|------------|-----------|
| **Black-Box (Funcional)** | Postman (Back + Front) | Validar endpoints via entradas/saídas |
| **Null/Missing-field** | Login, reservas, filmes | Testar validações de input |
| **Boundary Value** | Campos limite (ex.: assentos, textos) | Detectar erros de fronteira |
| **Equivalence Partitioning** | Login/reservas | Reduzir casos mantendo cobertura |
| **Injection/Fuzzing** | Campos login/movies | Verificar sanitização e segurança |
| **Negative Testing** | 401/403/404 | Garantir falhas seguras |
| **Concurrency (Race Condition)** | Reservas duplicadas | Detectar falhas de sincronização |

---

## * Ações Recomendadas

| Prioridade | Ação |
|-------------|------|
| 🔴 Alta | Implementar atomicidade em reservas (Mongo transações / índices únicos) |
| 🟠 Média | Adicionar testes de erro (controllers) e cobertura mínima 50% |
| 🟢 Baixa | Padronizar mensagens e adicionar testes visuais (a11y, UX) |

---

## * Artefatos Locais

| Ferramenta | Caminho |
|-------------|----------|
| Jest + Coverage | `cinema-challenge-back/coverage/` |
| Robot (UI/API) | `robot-tests/reports/` |
| Playwright | `playwright-tests/playwright-report` |
| Cypress | `cinema-challenge-front/cypress/e2e` |
| Vitest | `cinema-challenge-front/tests/` |

---

## 🚀 CI/CD - GitHub Actions

### Workflows Automatizados

O projeto conta com **2 workflows** configurados no GitHub Actions:

#### 1. **CI/CD - Testes Automatizados** (Completo)
- ✅ **Backend Jest** - 71 testes (unit + integration) em Node 18.x e 20.x
- ✅ **Newman Backend** - Testes Postman da API
- ✅ **Newman Frontend** - Testes Postman do UI
- ✅ **Cypress E2E** - Multi-browser (Chrome, Firefox, Edge)
- ✅ **Playwright** - Testes em Chromium, Firefox e WebKit

**Artefatos Publicados:**
- 📊 Relatórios de cobertura Jest (HTML)
- 📊 Relatórios Newman (HTML + JSON)
- 🎥 Vídeos Cypress de todas as execuções
- 📸 Screenshots de falhas
- 📊 Relatórios Playwright com traces
- 📝 Resumo consolidado

**Tempo de Execução:** ~10-15 minutos  
**Retenção:** 30 dias (90 dias para resumo)

#### 2. **CI - Smoke Tests** (Rápido)
- ✅ Testes Jest unitários
- ✅ Health check do servidor  
- ✅ Newman smoke test básico

**Tempo de Execução:** ~5 minutos  
**Schedule:** Diariamente às 9h UTC (6h BRT)

### Como Acessar os Artefatos

1. Acesse a [aba Actions](https://github.com/browndark/Quest-Final/actions)
2. Clique em uma execução do workflow
3. Role até a seção "Artifacts"
4. Baixe os relatórios desejados:
   - `jest-coverage-report-*.zip`
   - `newman-backend-reports-*.zip`
   - `cypress-videos-*.zip`
   - `cypress-screenshots-*.zip`
   - `playwright-report.zip`

### Executar Manualmente

Via GitHub UI:
```
Actions → CI/CD - Testes Automatizados → Run workflow
```

Via GitHub CLI:
```bash
gh workflow run ci.yml --ref Atualização3.1
gh run list --workflow=ci.yml
```

📚 **Documentação completa:** [`.github/workflows/README.md`](.github/workflows/README.md)

---

## * Postman — Resultados das execuções (Front & Back)

Resumo objetivo das execuções Newman (local):

- Front (coleção): `postman-test/postman-front/test-front.postman_collection.json`
  - Relatório: `postman-test/reports/newman-front-report.json`
  - Iterações: 1
  - Requests executadas: 9 (1 erro de conexão / ECONNREFUSED)
  - Asserções: 14 (7 falhas)
  - Principais problemas: Front não estava rodando em `127.0.0.1:3002` (ECONNREFUSED) e o POST `/auth/login` retornou 401, o que afetou chamadas dependentes de autenticação.

- Back (coleção): `postman-test/postman-back/test-back.postman_collection.json`
  - Relatório: `postman-test/reports/newman-back-report.json`
  - Iterações: 1
  - Requests executadas: 18
  - Asserções: 23 (13 falhas)
  - Principais problemas: `POST /setup/test-users` retornou 201, mas `POST /auth/login` com `admin@admin.com`/`admin` retornou 401; sem token, endpoints que exigem autorização (criar filmes/theaters/sessions/reservations) responderam 401.

Links para evidências (relatórios JSON gerados):

- `postman-test/reports/newman-front-report.json`
- `postman-test/reports/newman-back-report.json`

Próximos passos sugeridos:
- Levantar o frontend (Vite) em `127.0.0.1:3002` e garantir readiness.
- Verificar variáveis de ambiente do backend (ex.: `JWT_SECRET`) e garantir que `POST /setup/test-users` persista usuários na mesma base que o servidor em execução.
- Re-executar as coleções com Newman e anexar os relatórios atualizados.

---

## ✅ Conclusão

As suítes unitárias e smoke estão **funcionais e reproduzíveis**.  
As suítes Robot Framework foram ajustadas, mas **ainda dependem de persistência ou DB em memória**.  
Com as melhorias de cobertura, atomicidade e mensagens padronizadas, o projeto estará **pronto para pipelines CI/CD estáveis e métricas confiáveis**.

## ✅ Agradecimentos:
 Quero agradecer pela oportunidade que a Compass UOL está oferecendo no programa de bolsas de estudos e aprendizado em QA. Tenho me esforçado ao máximo para ser efetivado. Também agradeço ao meu squad (Caio, Ana Lívia, Amilly e Eduardo), com quem enfrentei vários desafios como uma equipe de verdade. Neste último desafio, realizamos dailies para trocar informações e dar força uns aos outros. Obrigado pela parceria e pela confiança!

<img src="./assets/ud.png" alt="Mapa-Mental" width="500">


