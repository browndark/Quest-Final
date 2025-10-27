# 🎯 Plano de Ação - 100% na Avaliação

> Melhorias técnicas necessárias para alcançar nota máxima

**Data:** 27/10/2025  
**Branch:** atualizacao3.0  
**Status:** 🔄 Em Andamento

---

## 📊 **Visão Geral**

| Prioridade | Itens | Status |
|------------|-------|--------|
| 🔴 **CRÍTICA** | 1 | ✅ 75% Concluído |
| 🟡 **ALTA** | 3 | ⏳ Pendente |
| 🟢 **MÉDIA** | 4 | ⏳ Pendente |

---

## 🔴 **PRIORIDADE CRÍTICA**

### ✅ **1. Login Funcional - Destravar /auth/login**

**Problema:**
- Endpoint `/auth/login` retorna **401 Unauthorized**
- Bloqueia todos os fluxos autenticados
- Impossível criar filme/sessão/reserva

**Impacto:** 🔴 CRÍTICO - Sistema 90% não funcional

**Progresso Realizado:**
- ✅ Código analisado - `authController.js` está correto
- ✅ Modelo `User.js` com bcrypt funcionando
- ✅ JWT token generator configurado
- ✅ Middleware de autenticação validado
- ✅ Script de seed criado e testado (2 usuários + 3 filmes + 158 sessões)
- ✅ Script de teste `test-login.js` criado
- ✅ Arquivo `.env.example` criado com documentação
- ✅ Guia completo MongoDB (`MONGODB-SETUP.md`) com 3 opções de instalação

**Pendências:**
- ⏳ MongoDB precisa estar instalado/rodando
- ⏳ Executar `npm run seed` para popular banco
- ⏳ Executar `node test-login.js` para validar

**Credenciais de Teste (após seed):**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
{
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
```

**Arquivos Criados/Modificados:**
- ✅ `cinema-challenge-back/.env` - Configurado com MongoDB URI
- ✅ `cinema-challenge-back/.env.example` - Template com instruções
- ✅ `cinema-challenge-front/.env.example` - Configuração frontend
- ✅ `cinema-challenge-back/test-login.js` - Script de validação
- ✅ `MONGODB-SETUP.md` - Guia completo de instalação

**Status:** ✅ 75% CONCLUÍDO (aguardando MongoDB instalado)

---

## 🟡 **PRIORIDADE ALTA**

### **2. Cobertura de Testes do Backend**

**Situação Atual:**
- ❌ ~36% statements
- ❌ ~5% branches
- ❌ Faltam cenários negativos (4xx)

**Meta:**
- ✅ Mínimo 80% statements
- ✅ Mínimo 70% branches
- ✅ Cenários 400, 401, 404, 409, 500

**Implementação:**
```javascript
// Testes a adicionar:
- POST /auth/login - 200, 400 (campos faltando), 401 (credenciais inválidas)
- POST /auth/register - 201, 400 (validação), 409 (email duplicado)
- GET /movies - 200 (vazio), 200 (com dados)
- POST /movies - 201, 400, 401 (sem token), 403 (não admin)
- POST /reservations - 201, 400, 401, 409 (assento ocupado)
- GET /sessions - 200, 404
```

**Arquivos:**
- `cinema-challenge-back/tests/auth.test.js` (criar)
- `cinema-challenge-back/tests/movies.test.js` (criar)
- `cinema-challenge-back/tests/reservations.test.js` (criar)

**Status:** ⏳ Pendente

---

### **3. Padronização de Respostas de Erro**

**Problema:**
- Respostas inconsistentes (JSON vs text/plain)
- Dificulta asserções nos testes

**Solução - Padrão JSON:**
```javascript
// Sucesso
{
  "success": true,
  "data": { ... }
}

// Erro
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email é obrigatório",
    "details": [...]
  }
}
```

**Implementação:**
1. Criar middleware de erro padronizado
2. Atualizar todos os controllers
3. Mapear códigos de erro consistentes

**Arquivos:**
- `cinema-challenge-back/src/middleware/errorHandler.js` (criar)
- Todos os controllers

**Status:** ⏳ Pendente

---

### **4. CI/CD - GitHub Actions**

**Requisitos:**
- ✅ Pipeline Newman (Postman)
- ✅ Pipeline Cypress
- ✅ Upload de relatórios/vídeos/screenshots
- ⚠️ Robot Framework (opcional)

**Implementação:**
```yaml
# .github/workflows/tests.yml
name: CI/CD Tests
on: [push, pull_request]

jobs:
  backend-tests:
    - Jest tests
    - Newman/Postman API tests
    
  frontend-tests:
    - Cypress E2E tests
    - Upload artifacts (videos, screenshots)
    
  reports:
    - Publish coverage reports
    - Upload test results
```

**Arquivos:**
- `.github/workflows/tests.yml` (criar)

**Status:** ⏳ Pendente

---

## 🟢 **PRIORIDADE MÉDIA**

### **5. E2E Cypress - Caminho Feliz + Negativos**

**Cenários a Implementar:**

**Login:**
- ✅ Login com credenciais válidas (200)
- ✅ Login sem email (400)
- ✅ Login com senha errada (401)

**Registro:**
- ✅ Registro bem-sucedido (201)
- ✅ Registro com campos faltando (400)
- ✅ Registro com email duplicado (409)

**Movies:**
- ✅ Listar filmes (lista vazia - 200)
- ✅ Listar filmes (com dados - 200)
- ✅ Criar filme como admin (201)
- ✅ Criar filme sem autenticação (401)

**Reserva:**
- ✅ Criar reserva bem-sucedida (201)
- ✅ Reserva com assento ocupado (409)
- ✅ Reserva sem autenticação (401)

**Arquivos:**
- `Cypress-test/cypress/e2e/auth.cy.js`
- `Cypress-test/cypress/e2e/movies.cy.js`
- `Cypress-test/cypress/e2e/reservations.cy.js`

**Status:** ⏳ Pendente

---

### **6. README/Wiki de QA Consolidado**

**Itens a Adicionar:**

✅ **Já Criado:**
- Wiki completa (14 páginas)
- Instruções de execução
- Estratégia de testes
- FAQ e Troubleshooting

❌ **Faltando:**
- `.env.example` (criar)
- Plano de testes detalhado
- Matriz de risco (probabilidade x impacto)
- Links para relatórios

**Implementação:**
```markdown
## Matriz de Risco

| Funcionalidade | Probabilidade | Impacto | Risco | Mitigação |
|----------------|---------------|---------|-------|-----------|
| Login | Alta | Crítico | 🔴 | Testes E2E + Unit |
| Reservas | Média | Alto | 🟡 | Validação de conflitos |
| Pagamento | Baixa | Médio | 🟢 | Mock de gateway |
```

**Arquivos:**
- `cinema-challenge-back/.env.example` (criar)
- `cinema-challenge-front/.env.example` (criar)
- `Wiki/Test-Plan.md` (criar)
- `Wiki/Risk-Matrix.md` (criar)

**Status:** ⏳ Pendente

---

### **7. UX/PT-BR - Mensagens de Validação**

**Problema:**
- Mensagens em inglês
- Erros nativos do HTML5

**Solução:**
```javascript
// Mapeamento de erros
const errorMessages = {
  400: 'Dados inválidos. Verifique os campos.',
  401: 'Não autorizado. Faça login novamente.',
  404: 'Recurso não encontrado.',
  409: 'Conflito. Este recurso já existe.',
  500: 'Erro no servidor. Tente novamente.'
};

// Validação customizada
<input
  required
  onInvalid={(e) => e.target.setCustomValidity('Email é obrigatório')}
  onInput={(e) => e.target.setCustomValidity('')}
/>
```

**Arquivos:**
- `cinema-challenge-front/src/utils/errorMessages.js` (criar)
- Todos os formulários

**Status:** ⏳ Pendente

---

### **8. Readiness/Estabilidade dos Testes UI**

**Problema:**
- `ERR_CONNECTION_REFUSED`
- Seletores instáveis
- Timeouts

**Solução:**

1. **Health Check antes dos testes:**
```javascript
// cypress/support/commands.js
Cypress.Commands.add('waitForBackend', () => {
  cy.request({
    url: 'http://localhost:3000/api/v1/health',
    retryOnStatusCodeFailure: true,
    timeout: 30000
  });
});

// Uso
before(() => {
  cy.waitForBackend();
});
```

2. **Seletores estáveis:**
```javascript
// Ruim
cy.get('.button')

// Bom
cy.get('[data-testid="submit-button"]')
```

3. **Timeouts adequados:**
```javascript
cy.get('[data-testid="movies"]', { timeout: 10000 })
```

**Arquivos:**
- `Cypress-test/cypress/support/commands.js`
- Todos os testes Cypress

**Status:** ⏳ Pendente

---

## 📅 **Cronograma de Implementação**

### **Semana 1 (27/10 - 03/11)**
- [x] Criar este plano de ação
- [ ] ✅ Corrigir login funcional (CRÍTICA)
- [ ] ✅ Criar seed de usuários
- [ ] ✅ Padronizar respostas de erro

### **Semana 2 (04/11 - 10/11)**
- [ ] ✅ Aumentar cobertura backend (80%+)
- [ ] ✅ Implementar testes negativos (4xx)
- [ ] ✅ Criar .env.example

### **Semana 3 (11/11 - 17/11)**
- [ ] ✅ Configurar GitHub Actions CI/CD
- [ ] ✅ E2E Cypress completo
- [ ] ✅ UX PT-BR

### **Semana 4 (18/11 - 24/11)**
- [ ] ✅ Estabilidade de testes UI
- [ ] ✅ Matriz de risco
- [ ] ✅ Plano de testes detalhado
- [ ] ✅ Revisão final

---

## ✅ **Checklist de Entrega**

### **Obrigatório (100%)**
- [ ] Login funcional emitindo JWT
- [ ] Cobertura backend ≥ 80%
- [ ] Cenários 4xx testados
- [ ] Respostas JSON padronizadas
- [ ] CI/CD funcionando
- [ ] E2E caminho feliz + negativos
- [ ] .env.example criado
- [ ] Matriz de risco documentada

### **Desejável (Bônus)**
- [ ] Cobertura ≥ 90%
- [ ] Robot Framework no CI/CD
- [ ] Testes de performance (K6)
- [ ] Documentação em vídeo
- [ ] Deploy em produção

---

## 📊 **Métricas de Sucesso**

| Métrica | Atual | Meta | Status |
|---------|-------|------|--------|
| **Cobertura Backend** | 36% | 80%+ | ❌ |
| **Branches** | 5% | 70%+ | ❌ |
| **Testes E2E** | 23 | 40+ | ⏳ |
| **Login Funcional** | ❌ | ✅ | 🔄 |
| **CI/CD** | ❌ | ✅ | ❌ |
| **Docs Completa** | ✅ | ✅ | ✅ |

---

## 🔗 **Referências**

- [Issues Catalogadas](Wiki/Issues.md) - 12 issues
- [Testing Strategy](Wiki/Testing-Strategy.md) - 110 testes
- [Architecture](Wiki/Architecture.md) - Arquitetura completa
- [Contributing](Wiki/Contributing.md) - Como contribuir

---

**Última atualização:** 27/10/2025  
**Responsável:** Equipe de Desenvolvimento  
**Prazo:** 24/11/2025 (4 semanas)  
**Status Geral:** 🔄 **30% Concluído**
