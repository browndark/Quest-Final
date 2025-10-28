# 🚀 GitHub Actions Workflows - Cinema Challenge# 🚀 GitHub Actions - CI/CD Workflows



## ✅ Workflows Ativos e PublicadosEsta pasta contém os workflows de CI/CD do projeto Cinema Challenge.



### 1. CI/CD Pipeline (`ci.yml`)## 📋 Workflows Disponíveis

**Status:** ✅ **ATIVO E PUBLICADO**  

**Trigger:** Push e Pull Request para `main`, `organização`, `Atualização3.1`### 1. **CI/CD - Testes Automatizados** (`ci.yml`)



**Jobs Executados:**Workflow completo que executa todos os testes automatizados do projeto.

- ✅ **Backend Tests (Jest):** 109 testes unitários com cobertura

- ✅ **Frontend Build:** Validação e build do Vite**Triggers:**

- Push em branches: `main`, `atualizacao3.0`, `Atualização3.1`

### 2. Testes Aprofundados (`smoke-tests.yml`)- Pull Requests para essas branches

**Status:** ✅ **ATIVO E PUBLICADO**  - Execução manual via `workflow_dispatch`

**Jobs:** Unit Tests (109) + Cypress E2E (42+) + Test Summary

**Jobs Executados:**

**Total:** 150+ testes automatizados executando em CI/CD

#### 🔧 Backend Tests (Jest + Newman)

---- **Matriz:** Node.js 18.x e 20.x

- **Testes:** 71 testes Jest (unit + integration)

**Documentação completa:** Ver arquivo para detalhes de artifacts, troubleshooting e métricas.- **Cobertura:** Statements, Branches, Functions, Lines

- **Newman:** Testes Postman da API backend
- **Artefatos:**
  - `jest-coverage-report-node-*.zip` - Relatórios HTML de cobertura
  - `newman-backend-reports-node-*.zip` - Relatórios HTML/JSON do Postman

#### 🎨 Frontend Tests (Cypress)
- **Matriz:** Chrome, Firefox, Edge
- **Testes:** E2E do frontend
- **Recursos:** Vídeos de todas as execuções, screenshots de falhas
- **Artefatos:**
  - `cypress-videos-*.zip` - Vídeos das execuções
  - `cypress-screenshots-*.zip` - Screenshots de falhas
  - `cypress-reports-*.zip` - Relatórios de testes

#### 📮 Newman Frontend
- **Testes:** Collection Postman do frontend
- **Artefatos:**
  - `newman-frontend-reports.zip` - Relatórios HTML/JSON

#### 🎭 Playwright Tests
- **Browsers:** Chromium, Firefox, WebKit
- **Testes:** E2E multi-browser
- **Artefatos:**
  - `playwright-report.zip` - Relatórios HTML
  - `playwright-traces.zip` - Traces para debug (apenas falhas)

#### 📊 Consolidar Resultados
- Baixa todos os artefatos
- Gera resumo consolidado
- Adiciona comentário em PRs
- Publica Job Summary

**Tempo de Execução:** ~10-15 minutos

---

### 2. **CI - Smoke Tests (Rápido)** (`smoke-tests.yml`)

Workflow leve para validações rápidas.

**Triggers:**
- Push em branches principais
- Pull Requests para `main`
- Schedule: Diariamente às 9h UTC (6h BRT)

**Executa:**
- ✅ Testes Jest unitários
- ✅ Health check do servidor
- ✅ Newman smoke test básico

**Tempo de Execução:** ~5 minutos

**Artefatos:**
- `smoke-coverage.zip` - Relatório de cobertura básico (7 dias)

---

## 📦 Artefatos Gerados

Todos os artefatos são salvos e podem ser baixados da página de Actions:

```
https://github.com/browndark/Quest-Final/actions
```

### Tipos de Artefatos:

| Tipo | Retenção | Descrição |
|------|----------|-----------|
| **Jest Coverage** | 30 dias | Relatórios HTML de cobertura de código |
| **Newman Reports** | 30 dias | Relatórios Postman (HTML + JSON) |
| **Cypress Videos** | 30 dias | Gravações de testes E2E |
| **Cypress Screenshots** | 30 dias | Screenshots de falhas |
| **Playwright Reports** | 30 dias | Relatórios com traces |
| **Test Summary** | 90 dias | Resumo consolidado de todos os testes |
| **Smoke Coverage** | 7 dias | Cobertura dos testes rápidos |

---

## 🎯 Como Visualizar Resultados

### 1. Via GitHub Actions UI
1. Acesse a [aba Actions](https://github.com/browndark/Quest-Final/actions)
2. Clique em uma execução (workflow run)
3. Veja o status de cada job
4. Baixe os artefatos na seção "Artifacts"

### 2. Via Job Summary
- Cada execução gera um resumo automático
- Visível na página da execução
- Inclui status de todos os jobs e links para artefatos

### 3. Via Comentário no PR
- Pull Requests recebem comentário automático
- Resumo dos testes executados
- Links diretos para artefatos

---

## 🔧 Executar Manualmente

### Via GitHub UI:
1. Acesse Actions → CI/CD - Testes Automatizados
2. Clique em "Run workflow"
3. Selecione a branch
4. Clique em "Run workflow"

### Via GitHub CLI:
```bash
# Executar workflow completo
gh workflow run ci.yml --ref Atualização3.1

# Executar smoke tests
gh workflow run smoke-tests.yml --ref Atualização3.1

# Ver status
gh run list --workflow=ci.yml

# Ver logs
gh run view <run-id> --log
```

---

## 📊 Métricas e Badges

### Adicionar Badge no README:

```markdown
![CI/CD](https://github.com/browndark/Quest-Final/actions/workflows/ci.yml/badge.svg)
![Smoke Tests](https://github.com/browndark/Quest-Final/actions/workflows/smoke-tests.yml/badge.svg)
```

### Status Atual:
- ✅ Backend: 71 testes (66 passing)
- ✅ Newman Backend: 18 requests
- ✅ Newman Frontend: 9 requests
- ✅ Cypress: Multi-browser support
- ✅ Playwright: 3 browsers

---

## 🐛 Troubleshooting

### Workflow falhou?

1. **Verifique os logs:**
   - Clique no job que falhou
   - Expanda os steps
   - Leia os erros

2. **Baixe os artefatos:**
   - Screenshots de falhas
   - Vídeos Cypress
   - Traces Playwright
   - Logs em JSON

3. **Reproduza localmente:**
   ```bash
   # Backend
   cd cinema-challenge-back
   npm test
   
   # Cypress
   cd cinema-challenge-front
   npm run cypress:open
   
   # Newman
   cd postman-test
   npm run test:back
   ```

### Problemas Comuns:

#### 1. Timeout nos testes
- **Solução:** Aumentar `timeout-minutes` no job
- **Causa:** Testes lentos ou servidor não respondendo

#### 2. Artefatos não gerados
- **Solução:** Verificar `if: always()` no step de upload
- **Causa:** Job cancelado antes de upload

#### 3. Newman sem relatórios
- **Solução:** Verificar se collection existe
- **Causa:** Caminho incorreto para arquivo JSON

#### 4. Cypress não grava vídeo
- **Solução:** Adicionar `config: video=true`
- **Causa:** Configuração desabilitada

---

## 🔄 Manutenção

### Atualizar versões:
- **Node.js:** Modificar `node-version` nos steps
- **Actions:** Atualizar `@v4` para versões mais recentes
- **Browsers:** Atualizar no Playwright install

### Adicionar novo teste:
1. Criar o teste localmente
2. Verificar se passa em `npm test`
3. Workflow pegará automaticamente

### Modificar retenção:
- Editar `retention-days` nos steps de upload
- Padrão: 30 dias (exceto smoke: 7 dias, summary: 90 dias)

---

## 📚 Referências

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Cypress GitHub Action](https://github.com/cypress-io/github-action)
- [Upload Artifact Action](https://github.com/actions/upload-artifact)
- [Newman CLI](https://learning.postman.com/docs/running-collections/using-newman-cli/)
- [Playwright CI](https://playwright.dev/docs/ci)

---

**Última atualização:** 27/10/2025  
**Autor:** Bruno Custodio de Castro  
**Squad:** String Testers - Compass UOL
