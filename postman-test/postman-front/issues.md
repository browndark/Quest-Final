
# Issues geradas a partir da coleção `test-front`

Este arquivo registra os problemas detectados ao aplicar as técnicas de teste (caixa-preta, nulo, boundary, injeção, negativo, concorrência) contra a coleção `postman-test/postman-front/test-front`.

Resumo dos casos (exportado da coleção)

1) Front - GET / (Home)
	- Técnica aplicada: Smoke / Caixa-preta
	- O que valida: 200 OK e presença de `<body` no HTML
	- Resultado: FAIL
	- Evidência: request error connect ECONNREFUSED 127.0.0.1:3002 (Postman/newman). Assertions failed: "Front status is 200" and "Front body contains <body>" due to no response.
	- Severidade se falhar: Alto (disponibilidade do front)
	- Sugestão de correção: iniciar o frontend (Vite) em `http://127.0.0.1:3002`, verificar logs do Vite e health-check readiness antes de rodar a coleção.

2) API - GET /health
	- Técnica aplicada: Smoke / Caixa-preta
	- O que valida: 200 OK e JSON válido
	- Resultado: PASS
	- Evidência: 200 OK, response JSON (newman run). See `postman-test/reports/newman-front-report.json` (execution for this request shows code 200, responseTime 12ms).
	- Severidade se falhar: Crítico (pipeline/infra)

3) API - GET /movies
	- Técnica aplicada: Caixa-preta / Boundary (lista vazia)
	- O que valida: 200 OK e retorno de array/obj
	- Resultado: PASS
	- Evidência: 200 OK, JSON array/object returned (newman run; responseSize ~1.35kB).

4) API - POST /auth/login (admin)
	- Técnica aplicada: Caixa-preta / Equivalence partitioning
	- O que valida: 200/201 e token no JSON
	- Resultado: FAIL
	- Evidência: 401 Unauthorized returned for credentials `admin@admin.com` / `admin`. Assertions failed: expected 200/201 and expected `token` property in response. See `postman-test/reports/newman-front-report.json` (login response: { success: false, ... }).
	- Severidade se falhar: Alto (fluxos autenticados dependem disso)
	- Recomendações: execute `POST /setup/test-users` prior to this collection (seed users) or start backend with `USE_IN_MEMORY_DB=true` and ensure `JWT_SECRET` is set for tests. Verify that admin user exists and password matches.

5) API - POST /auth/login (empty) - NULL
	- Técnica aplicada: Nulo / Negative
	- O que valida: receber 400 ou 401
	- Resultado: PASS
	- Evidência: Request returned 401 Unauthorized (acceptable for empty credentials).

6) API - POST /auth/login (injection) - FUZZ
	- Técnica aplicada: Injeção / Fuzzing
	- O que valida: não retornar 200; rejeitar entrada maliciosa
	- Resultado: PASS
	- Evidência: Request returned 401 Unauthorized (did not return 200). No evidence of injection success in this run.
	- Severidade se falhar: Crítico (vulnerabilidade de segurança)

7) API - GET /movies/:id (invalid) - NEGATIVE
	- Técnica aplicada: Negative
	- O que valida: 400 ou 404 para id inválido
	- Resultado: PASS
	- Evidência: Request returned 404 Not Found for `invalid-id-123` as expected.

8) API - POST /reservations (missing seats) - NULL
	- Técnica aplicada: Nulo / Negative
	- O que valida: 400/422 quando `seats` ausente
	- Resultado: FAIL
	- Evidência: Request returned 401 Unauthorized (newman). Assertion expected 400/422 but got 401 — likely caused by missing auth token because login step failed.
	- Recomendações: fix authentication/seed user issue first; once token is available, re-run and validate 400/422 behavior for missing seats.

9) API - POST /reservations (create)
	- Técnica aplicada: Caixa-preta / Concurrency (ver abaixo)
	- O que valida: retorna 200/201 e id de reserva
	- Resultado: FAIL
	- Evidência: Request returned 401 Unauthorized; assertions expecting 200/201 and reservation id failed. Root cause: no auth token (login returned 401).
	- Recomendações: ensure admin/test user exists and login returns token; then re-run to validate reservation creation and concurrency tests.



