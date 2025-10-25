
# Resultados dos testes automatizados (Postman) - Backend

Data: 2025-10-25

Observação geral
- O servidor backend respondeu e os endpoints públicos (health, GET /movies, GET /movies/:id invalid) funcionaram.
- O endpoint de criação/fluxos que exigem autenticação (login admin → criação de movie/theater/session/reservation) falharam porque o POST /auth/login retornou 401 (Unauthorized). Isso fez com que as etapas dependentes de token também não fossem autorizadas.

Resumo por requisição (nome da requisição — resultado — status HTTP observado — nota)

- API - GET /health — PASS — 200 — serviço saudável.
- API - GET /movies — PASS — 200 — lista de filmes retornada.
- API - POST /setup/test-users (create test users) — PASS — 201 — rota criada/retornou 201 (usuários de teste aparentemente criados).
- API - POST /auth/login (admin) — FAIL — 401 — login do admin com `admin@admin.com`/`admin` retornou 401; não foi retornado token.
	- Impacto: sem token, todas as rotas que exigem Authorization: Bearer falham com 401.
	- Possíveis causas: a rota /setup/test-users não persiste usuário na mesma store usada pelo /auth/login, JWT_SECRET ausente/incorreto, ou flow de criação/validação difere do esperado.

- API - POST /auth/login (empty payload) - NULL TEST — PASS — 401 (esperado 400/401) — validação de payload parece presente.
- API - POST /auth/login (injection) - FUZZ/INJECTION — PASS — 401 (não retorna 200) — não parece vulnerável a injeção simples.

- API - POST /movies (null title) - NULL/BVA — FAIL — 401 — falhou por falta de autenticação (veja login).
- API - POST /movies (boundary durations) - BOUNDARY — FAIL — 401 — falhou por falta de autenticação.
- API - POST /movies (very long title) - FUZZ — PASS — 401 (assertion verifica só que não foi 500) — servidor não retornou 500; porém a chamada respondeu 401 (sem token).
- API - POST /movies (create movie) [requires admin] — FAIL — 401 — falhou por falta de autenticação; id não foi retornado.

- API - GET /movies/:id (invalid id) - NEGATIVE — PASS — 404 — comportamento negativo adequado.

- API - POST /theaters (create theater) [requires admin] — FAIL — 401 — falta de autenticação.
- API - POST /sessions (create session) [requires admin] — FAIL — 401 — falta de autenticação.
- API - POST /sessions (invalid movie/theater) - NEGATIVE — FAIL — 401 — falta de autenticação.

- API - POST /reservations (missing seats) - NULL — FAIL — 401 — falta de autenticação.
- API - POST /reservations (create reservation) [requires auth] — FAIL — 401 — falta de autenticação.
- API - POST /reservations (duplicate seat) - CONCURRENCY/NEGATIVE — FAIL — 401 — falta de autenticação.
- API - GET /reservations (list) — FAIL (assert status) / PASS (body check) — 401 — a listagem retornou 401 (assert de status falhou), mas o teste que verifica corpo em try/catch passou (possivelmente body com mensagem de erro presente).

Agregados do run
- Requests executadas: 18
- Asserções totais: 23 (13 falhas)

Evidências (trechos do relatório)
- login (POST /auth/login) → status: 401 Unauthorized (corpo retornado indicou sucesso=false / mensagem de credenciais inválidas)
- setup/test-users → status: 201 Created
- health → 200 OK

---
Arquivo relatório completo: `postman-test/reports/newman-back-report.json`
