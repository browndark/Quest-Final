# 🤖 Robot Framework - Testes API e UI

## 📋 Pré-requisitos

### 1. MongoDB Rodando
O backend precisa de MongoDB para autenticação funcionar:

```bash
# Opção 1: MongoDB Local (recomendado)
# Instale: https://www.mongodb.com/try/download/community
# Inicie o serviço MongoDB

# Opção 2: MongoDB Atlas (cloud)
# Configure MONGODB_URI no .env do backend
```

### 2. Popular Banco de Dados
```bash
cd cinema-challenge-back
npm run seed
```

Isso cria:
- ✅ **2 usuários de teste:**
  - Admin: `admin@example.com` / `password123`
  - User: `user@example.com` / `password123`
- ✅ **3 filmes** de exemplo
- ✅ **158 sessões** distribuídas

### 3. Backend Rodando
```bash
cd cinema-challenge-back
npm start
# Servidor deve iniciar em http://localhost:3000
```

### 4. Frontend Rodando (para testes UI)
```bash
cd cinema-challenge-front
npm run dev
# Aplicação deve iniciar em http://localhost:3002
```

---

## 🚀 Executar Testes

### Testes API (Smoke)
```bash
cd robot-tests
robot -d reports/api api/api_smoke.robot
```

**Testes incluídos:**
- ✅ Health check (GET /health)
- ✅ Listar filmes (GET /movies)
- ✅ Login admin e acessar reservas (autenticação)

### Testes UI (Browser)
```bash
cd robot-tests
robot -d reports/ui ui/check_base.robot
```

---

## 🔧 Variáveis de Configuração

Editáveis em `resources/variables.resource`:

```robot
${BASE_API}      http://localhost:3000/api/v1
${BASE_FRONT}    http://127.0.0.1:3002
${ADMIN_EMAIL}   admin@example.com
${ADMIN_PASS}    password123
```

**⚠️ IMPORTANTE:** 
- As credenciais devem corresponder aos usuários criados pelo `npm run seed`
- Se mudar as credenciais no seed, atualize também aqui

---

## 🐛 Troubleshooting

### ❌ Erro 401 no login
**Problema:** `POST /auth/login` retorna 401 Unauthorized

**Soluções:**
1. ✅ Verifique se o MongoDB está rodando
2. ✅ Execute `npm run seed` para criar usuários
3. ✅ Confirme credenciais em `variables.resource`:
   ```
   ${ADMIN_PASS}    password123  # NÃO é admin123!
   ```
4. ✅ Teste manualmente:
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"password123"}'
   ```

### ❌ Connection refused
**Problema:** Backend não está acessível

**Soluções:**
1. ✅ Inicie o backend: `cd cinema-challenge-back && npm start`
2. ✅ Verifique a porta: `http://localhost:3000/api/v1/health`
3. ✅ Confirme que não há conflito de porta

### ❌ Usuário não encontrado
**Problema:** Banco vazio ou usuários não existem

**Solução:**
```bash
cd cinema-challenge-back
npm run seed
```

---

## 📊 Relatórios

Após execução, relatórios são gerados em:
- `reports/api/` - Testes API
- `reports/ui/` - Testes UI
- `reports/browser/` - Testes browser

Arquivos:
- `report.html` - Relatório visual completo
- `log.html` - Log detalhado de execução
- `output.xml` - Saída XML para CI/CD

---

## ✅ Status Esperado

Com tudo configurado corretamente:

```
==============================================================================
Api Smoke :: Smoke da API do cinema (health, movies, reservas).
==============================================================================
Health deve responder 200                                             | PASS |
------------------------------------------------------------------------------
Listar filmes deve responder 200 e lista                              | PASS |
------------------------------------------------------------------------------
Admin consegue acessar reservas (200)                                 | PASS |
==============================================================================
Api Smoke :: Smoke da API do cinema (healt... | PASS |
3 tests, 3 passed, 0 failed
==============================================================================
```

---

## 🔗 Links Úteis

- [Robot Framework Docs](https://robotframework.org/robotframework/)
- [RequestsLibrary](https://marketsquare.github.io/robotframework-requests/doc/RequestsLibrary.html)
- [Browser Library](https://marketsquare.github.io/robotframework-browser/)

---

**Última atualização:** 28/10/2025  
**Mantido por:** Bruno Custodio de Castro - String Testers
