# Robot Framework — Sessão de Testes (API & UI)

Data: 2025-10-24


Relatórios gerados

- Local: `robot-tests/reports/`
  - `output.xml`, `log.html`, `report.html`

Resumo rápido

- Testes executados: 3
- Passaram: 2
- Falharam: 1

Casos de teste (detalhado)

1) Health deve responder 200 — PASS
- O teste faz GET em `/api/v1/health`.
- Resultado: HTTP 200, payload OK.
- Observação: endpoint adicionado para checks de smoke.

2) Listar filmes deve responder 200 e lista — PASS
- O teste faz GET em `/api/v1/movies`.
- Resultado: HTTP 200 e retorno de lista de filmes.

3) Admin consegue acessar reservas (200) — FAIL
- Sequência executada pelo teste:
  1. POST `/setup/test-users` — preparar dados de teste (cria/atualiza users de desenvolvimento).
  2. POST `/auth/login` com payload `{ email: 'admin@example.com', password: 'admin123' }` — obter token.
  3. GET `/reservations` com Authorization Bearer token — verificar acesso admin.
- Observação nos logs:
  - A chamada a `/setup/test-users` retorna 200 (ou 201) e lista usuários existentes/alterados.
  - O POST em `/auth/login` responde 401 com corpo: `{"success":false,"message":"Invalid email or password"}`.
  - Erro exibido pelo Robot: `HTTPError: 401 Client Error: Unauthorized for url: http://localhost:5000/api/v1/auth/login`.

Evidência (trecho relevante do log Robot):

- POST Request : url=http://localhost:5000/api/v1/setup/test-users — status=200
- POST Request : url=http://localhost:5000/api/v1/auth/login — status=401 — body: {"success":false,"message":"Invalid email or password"}

Diagnóstico e causas prováveis

1) Credenciais inconsistentes
- Embora `/setup/test-users` seja chamado, o login recebe 401. Isso sugere que o usuário `admin@example.com` não tem efetivamente a senha `admin123` armazenada no banco no momento do login. Possíveis motivos:
  - A rota `setup/test-users` não está gravando no banco (por exemplo, falta de conexão com MongoDB).
  - A rota gravou, mas o hashing da senha não está sendo aplicado/recuperado corretamente na autenticação (ex.: `select('+password')` ou `matchPassword` com campo `password` não funcionando como esperado).

2) Ambiente sem persistência (Mongo não conectado)
- O servidor foi modificado para não falhar na inicialização quando `MONGODB_URI` não está definido (modo smoke/test). Se o servidor roda sem DB, o endpoint de setup pode retornar uma resposta que indica sucesso, mas não gravar dados.
- Logs do servidor indicam: `MONGODB_URI not set - skipping MongoDB connection (running in smoke/test mode)` em algumas execuções.

3) Versão de código em execução diferente da alterada
- Se o servidor não foi reiniciado após mudanças (por exemplo, depois de alterar `setup/test-users` para atualizar senhas), a suite pode estar testando código antigo que não aplica correções.

Ações realizadas nesta sessão

- Corrigimos variáveis Robot (BASE_API/BASE_FRONT) para os hosts/ports corretos (`http://localhost:5000/api/v1` e `http://localhost:3002`).
- Substituímos sintaxe obsoleta de Robot (`[Return]` -> `RETURN`).
- Adicionamos `GET /health` no backend para health-check.
- Atualizamos `POST /setup/test-users` para que, em ambiente de desenvolvimento, atualize nome/role/senha de usuários existentes (para forçar credenciais previsíveis). Também adicionamos logs de debug nesta rota.
- Reiniciamos o servidor e re-executamos a suite Robot — resultados: health e listagem passaram; login admin seguiu retornando 401.

Recomendações e próximos passos (prioritários)

1) Rode com MongoDB real ou em memória
- Execute o backend com um MongoDB local (ou Atlas) ou configure o projeto para usar `mongodb-memory-server` durante testes/CI. Isso garante que o `setup/test-users` persista dados e os endpoints de autenticação operem corretamente.

2) Validar manualmente os endpoints
- Executar estas chamadas no PowerShell para inspecionar respostas completas e depurar:

```powershell
# Criar/atualizar usuários de teste
Invoke-RestMethod -Method POST -Uri http://localhost:5000/api/v1/setup/test-users -ContentType 'application/json'

# Tentar login manualmente
Invoke-RestMethod -Method POST -Uri http://localhost:5000/api/v1/auth/login -ContentType 'application/json' -Body (@{ email='admin@example.com'; password='admin123' } | ConvertTo-Json)
```

- Se o `login` manual retornar 401, inspecione os logs do servidor (procure por `[setupRoutes]` e logs do `authController`) para confirmar se o usuário foi encontrado e o resultado de `matchPassword`.

3) Habilitar logs de depuração temporários
- Adicione logs temporários em `authController.login` para imprimir se o usuário foi encontrado e o resultado de `matchPassword`. NÃO registre senhas em texto claro em produção.

4) Forçar re-criação de admin (dev only)
- Como remédio rápido, a rota `setup/test-users` já foi alterada para atualizar senha de usuários existentes. Se ainda houver problema, criar um endpoint dev-only que force a exclusão do admin e recrie com a senha conhecida (dev only).

5) Implementar `mongodb-memory-server` para testes
- Implementar isto tornará as suites de aceite menos frágeis em ambientes sem MongoDB instalado. Posso criar essa alteração se quiser.

Validação pós-correção

- Depois de garantir que o banco está operando e que a rota `setup/test-users` realmente ajusta a senha do admin, re-execute:

```powershell
robot -d robot-tests/reports robot-tests/api
```

- Verifique `robot-tests/reports/log.html` e `report.html`.

Observações finais

- O erro atual (401) não indica falha no algoritmo de hashing do bcrypt por si só — indica que, no momento da autenticação, a senha enviada não corresponde àquela armazenada. O próximo passo é confirmar persistência/versão de código em execução.

- Posso: (A) executar as chamadas HTTP de verificação e colar aqui as respostas, (B) instrumentar logs adicionais no `authController` e reexecutar, ou (C) implementar `mongodb-memory-server` para garantir persistência em testes. Diga qual dessas opções prefere que eu faça e eu executo.
