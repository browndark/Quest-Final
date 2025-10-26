# Soluções para Criar Usuários Admin

## Problema
O endpoint `/auth/register` sempre cria usuários com role "user" por padrão. Não existe uma rota pública para criar usuários admin diretamente.

## Soluções Disponíveis

### 1. **Script de Setup (Recomendado para desenvolvimento)**
Execute o script que já existe no projeto:

```bash
node setup-test-users.js
```

Este script cria:
- **Usuário regular**: `test@example.com` / `password123`
- **Usuário admin**: `admin@example.com` / `admin123`

### 2. **Rotas de Setup via API (Novo - Desenvolvimento apenas)**
Foram adicionadas novas rotas de setup que só funcionam em ambiente de desenvolvimento:

#### Criar usuário admin específico:
```
POST /api/v1/setup/admin
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com", 
  "password": "admin123"
}
```

#### Criar usuários de teste padrão:
```
POST /api/v1/setup/test-users
```

### 3. **Via Postman Collection**
Na coleção do Postman foi adicionada uma seção "Setup (Development)" com:
- Create Admin User
- Create Test Users

### 4. **Através do endpoint de usuários (após ter um admin)**
Uma vez que você tenha um usuário admin, pode usar:

```
PUT /api/v1/users/{userId}
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "role": "admin"
}
```

## Correções Implementadas

### 1. **Middleware de criptografia**
Corrigido o middleware `pre('save')` no modelo User para garantir que senhas sejam sempre criptografadas:

```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

### 2. **Script melhorado**
O script `setup-test-users.js` foi melhorado com:
- Verificação de criptografia de senha
- Mensagens mais claras
- Melhor tratamento de erros

### 3. **Rotas de setup seguras**
As novas rotas de setup só funcionam em desenvolvimento (`NODE_ENV !== 'production'`).

## Verificação
Após criar usuários, você pode verificar se as senhas estão criptografadas:
- Senhas criptografadas começam com `$2b$`
- O script mostra se a criptografia está funcionando

## Uso em Produção
Para produção, recomenda-se:
1. Criar o primeiro admin via script durante o deploy
2. Usar o endpoint de atualização de usuários para promover outros usuários
3. As rotas de setup são automaticamente desabilitadas em produção
