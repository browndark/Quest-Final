# Scripts de Setup - Cinema App

Este arquivo contém instruções para executar os scripts de configuração do banco de dados.

## 📍 Como Executar os Scripts

### **A partir da raiz do projeto (RECOMENDADO):**

```bash
# Navegar para a raiz do projeto
cd c:\Users\jacques.schmitz\Desktop\new-cinema-fixes\cinema-challenge-back

# Executar scripts
node src/utils/setup-movies-db.js
node src/utils/setup-test-users.js  
node src/utils/seedMoreMovies.js
```

### **A partir de qualquer diretório:**

Os scripts agora foram corrigidos para funcionar de qualquer lugar, mas ainda é recomendado executar a partir da raiz.

## 🎬 Scripts Disponíveis

### 1. **setup-movies-db.js**
- **Função:** Configura filmes básicos no banco de dados
- **Uso:** `node src/utils/setup-movies-db.js`
- **O que faz:** 
  - Limpa filmes existentes
  - Adiciona 3 filmes básicos com customId

### 2. **setup-test-users.js** 
- **Função:** Cria usuários de teste (admin e usuário comum)
- **Uso:** `node src/utils/setup-test-users.js`
- **O que faz:**
  - Cria usuário admin: admin@example.com / admin123
  - Cria usuário comum: user@example.com / user123

### 3. **seedMoreMovies.js**
- **Função:** Adiciona mais filmes e sessões ao banco
- **Uso:** `node src/utils/seedMoreMovies.js`
- **O que faz:**
  - Adiciona 16 filmes populares
  - Cria sessões para os próximos 7 dias
  - Gera horários automáticos (12h, 16h, 20h)

## ⚙️ Variáveis de Ambiente Necessárias

Certifique-se de que o arquivo `.env` na raiz contém:

```env
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=seu_jwt_secret_aqui
```

## 🚀 Sequência Recomendada de Setup

1. **Primeiro:** `node src/utils/setup-test-users.js`
2. **Segundo:** `node src/utils/setup-movies-db.js` 
3. **Terceiro:** `node src/utils/seedMoreMovies.js`

## ❌ Solucionando Problemas

- **Erro "Cannot find module":** Execute a partir da raiz do projeto
- **Erro "MONGODB_URI undefined":** Verifique se o arquivo `.env` existe na raiz
- **Erro de conexão:** Verifique se a string de conexão MongoDB está correta

## 📝 Alternativa via API

Você também pode usar as rotas de setup via API (development only):

```bash
POST http://localhost:3000/api/v1/setup/admin
POST http://localhost:3000/api/v1/setup/test-users
```
