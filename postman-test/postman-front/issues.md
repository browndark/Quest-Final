
# Issues geradas a partir da coleção `test-front`

Este arquivo registra os problemas detectados ao aplicar as técnicas de teste (caixa-preta, nulo, boundary, injeção, negativo, concorrência) contra a coleção `postman-test/postman-front/test-front`.

Resumo dos casos (exportado da coleção)

1) Front - GET / (Home)

Técnica aplicada: Smoke / Caixa-preta

O que valida: código 200 OK e presença de <body no HTML

Resultado: FALHA

Evidência: erro de requisição – connect ECONNREFUSED 127.0.0.1:3002 (Postman/Newman). Asserções falharam: “status do Front é 200” e “Front contém <body>”, devido à ausência de resposta.

Severidade da falha: Alta (indisponibilidade do frontend)

Sugestão de correção: iniciar o frontend (Vite) em http://127.0.0.1:3002, verificar os logs do Vite e garantir o health-check readiness antes de executar a coleção.

2) API - GET /health

Técnica aplicada: Smoke / Caixa-preta

O que valida: 200 OK e JSON válido

Resultado: SUCESSO

Evidência: 200 OK, resposta JSON (Newman run). Ver postman-test/reports/newman-front-report.json (execução mostra código 200, tempo de resposta 12 ms).

Severidade da falha (se ocorresse): Crítica (infraestrutura/pipeline)

3) API - GET /movies

Técnica aplicada: Caixa-preta / Boundary (lista vazia)

O que valida: 200 OK e retorno de array/objeto

Resultado: SUCESSO

Evidência: 200 OK, JSON retornando array/objeto (~1.35 kB).

4) API - POST /auth/login (admin)

Técnica aplicada: Caixa-preta / Partição de equivalência

O que valida: 200/201 e presença de token no JSON

Resultado: FALHA

Evidência: retorno 401 Unauthorized para as credenciais admin@admin.com / admin. Asserções falharam: esperado 200/201 e propriedade token no JSON. Ver postman-test/reports/newman-front-report.json (resposta: { success: false, ... }).

Severidade: Alta (fluxos autenticados dependem disso)

Recomendações: executar POST /setup/test-users antes da coleção (popular usuários de teste) ou iniciar o backend com USE_IN_MEMORY_DB=true e definir JWT_SECRET para os testes. Verificar se o usuário admin existe e se a senha está correta.

5) API - POST /auth/login (vazio)

Técnica aplicada: Nulo / Negativo

O que valida: deve retornar 400 ou 401

Resultado: SUCESSO

Evidência: requisição retornou 401 Unauthorized (aceitável para credenciais vazias).

6) API - POST /auth/login (injeção)

Técnica aplicada: Injeção / Fuzzing

O que valida: não retornar 200; rejeitar entrada maliciosa

Resultado: SUCESSO

Evidência: requisição retornou 401 Unauthorized (não retornou 200). Nenhum sinal de sucesso de injeção nesta execução.

Severidade se falhar: Crítica (vulnerabilidade de segurança)

7) API - GET /movies/:id (inválido)

Técnica aplicada: Negativo

O que valida: 400 ou 404 para ID inválido

Resultado: SUCESSO

Evidência: requisição retornou 404 Not Found para invalid-id-123, conforme esperado.

8) API - POST /reservations (sem assentos)

Técnica aplicada: Nulo / Negativo

O que valida: 400/422 quando o campo seats está ausente

Resultado: FALHA

Evidência: requisição retornou 401 Unauthorized (Newman). A asserção esperava 400/422, mas obteve 401 — provavelmente causado pela ausência de token (login falhou).

Recomendações: corrigir o problema de autenticação/usuário de teste primeiro; depois, validar o comportamento 400/422 quando o campo seats estiver ausente.

9) API - POST /reservations (criação)

Técnica aplicada: Caixa-preta / Concorrência

O que valida: retorno 200/201 e ID de reserva

Resultado: FALHA

Evidência: requisição retornou 401 Unauthorized; asserções esperando 200/201 e ID de reserva falharam.

Causa raiz: ausência de token (login retornou 401).

Recomendações: garantir que o usuário admin/de teste exista e o login retorne o token; então reexecutar para validar criação e testes de concorrência.

<img width="1293" height="1034" alt="postfront" src="https://github.com/user-attachments/assets/31b9017b-85cc-4d4d-ac97-b731b384eaaa" />


