# Relatório rápido de testes — Postman

Data: 2025-10-25

Resumo objetivo com resultados das execuções Newman (local)

## Testes Front

- Coleção utilizada: `postman-test/postman-front/test-front.postman_collection.json`
- Relatório gerado: `postman-test/reports/newman-front-report.json`
- Execução: 1 iteração
- Requests executadas: 9 (1 request com erro de conexão)
- Asserções: 14 (7 falhas)

Principais erros encontrados (front):
- Front - GET / (Home): falha de conexão (ECONNREFUSED 127.0.0.1:3002) — 2 asserções falharam (status/body checks).
- API - POST /auth/login (admin): retornou 401 Unauthorized — esperava 200/201 e token.
- Reservas / chamadas que dependem de autenticação: falharam por 401 (sem token válido).

Observação: algumas verificações de conteúdo passaram (API health, GET /movies). Para corrigir os testes do front, inicie o servidor frontend (Vite) em `127.0.0.1:3002` e garanta que o backend esteja acessível e com usuários seedados para login.

## Testes Back

- Coleção utilizada: `postman-test/postman-back/test-back.postman_collection.json`
- Relatório gerado: `postman-test/reports/newman-back-report.json`
- Execução: 1 iteração
- Requests executadas: 18
- Asserções: 23 (13 falhas)

Principais erros encontrados (back):
- API - POST /auth/login (admin): retornou 401 Unauthorized mesmo após `POST /setup/test-users` (que retornou 201). Sem token, as requisições que exigem autorização (criar movie, theater, session, reservation) responderam 401 e geraram falhas nas asserções.
- Comportamento negativo verificado corretamente: GET /movies/:id (invalid) retornou 404.

Impacto e próximos passos recomendados
- Resolver o motivo do 401 no login (possíveis causas: JWT_SECRET não definido, seed não persiste na mesma base usada pelo servidor em execução, ou fluxo de autenticação diferente do esperado).
- Após corrigir autenticação, re-executar ambas as coleções com Newman e anexar os novos relatórios.

Comandos úteis para re-execução (PowerShell / CMD):

```powershell
npx newman run postman-test/postman-front/test-front.postman_collection.json --reporters json,cli --reporter-json-export postman-test/reports/newman-front-report.json
npx newman run postman-test/postman-back/test-back.postman_collection.json --reporters json,cli --reporter-json-export postman-test/reports/newman-back-report.json
```

Arquivos relacionados
- `postman-test/postman-front/issues.md` — issues geradas para o front (detalhes e sugestões).
- `postman-test/postman-back/issues.md` — issues geradas para o back (detalhes e sugestões).
- `postman-test/reports/` — diretório com os relatórios JSON gerados pelo Newman.

Se quiser, eu:
- tento re-run automático de seed+login agora e atualizo este README com os novos números;
- ou apenas re-executo depois que você iniciar o frontend/backend localmente.

