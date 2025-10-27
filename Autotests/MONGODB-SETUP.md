# 🗄️ Guia de Configuração do MongoDB

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Opção 1: MongoDB Atlas (Recomendado)](#opção-1-mongodb-atlas-recomendado)
- [Opção 2: MongoDB Local](#opção-2-mongodb-local)
- [Opção 3: Docker](#opção-3-docker)
- [Verificação da Instalação](#verificação-da-instalação)
- [Solução de Problemas](#solução-de-problemas)

---

## 🎯 Visão Geral

O projeto Cinema Challenge requer MongoDB como banco de dados. Você tem 3 opções:

| Opção | Dificuldade | Tempo | Recomendado para |
|-------|-------------|-------|------------------|
| **MongoDB Atlas** (Cloud) | ⭐ Fácil | 5-10 min | **Desenvolvimento e Produção** |
| **MongoDB Local** | ⭐⭐ Médio | 15-20 min | Desenvolvimento Offline |
| **Docker** | ⭐⭐⭐ Avançado | 5-10 min | Desenvolvedores experientes |

---

## 🌐 Opção 1: MongoDB Atlas (Recomendado)

### Por que Atlas?
- ✅ **Gratuito** para desenvolvimento (512MB)
- ✅ **Sem instalação** local necessária
- ✅ **Funciona em qualquer SO**
- ✅ **Backup automático**
- ✅ **Pronto para produção**

### Passo a Passo

#### 1. Criar Conta
1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Registre-se com email ou Google/GitHub
3. Confirme seu email

#### 2. Criar Cluster (Banco de Dados)
1. Clique em **"Build a Database"**
2. Escolha **"M0 FREE"** (512MB)
3. Selecione região mais próxima (ex: São Paulo, Virginia)
4. Nomeie o cluster: `cinema-cluster`
5. Clique **"Create"**

#### 3. Configurar Acesso

**3.1. Criar Usuário do Banco**
1. Em "Security Quick Start", crie usuário:
   - Username: `cinema_admin`
   - Password: *gere senha automática ou crie uma*
   - **COPIE A SENHA** (você vai precisar!)
2. Clique **"Create User"**

**3.2. Permitir Acesso de Qualquer IP**
1. Em "Network Access", adicione IP:
   - Clique **"Add IP Address"**
   - Selecione **"Allow Access from Anywhere"** (`0.0.0.0/0`)
   - Clique **"Confirm"**

#### 4. Obter String de Conexão
1. Clique em **"Connect"** no seu cluster
2. Escolha **"Connect your application"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copie a string de conexão:
```
mongodb+srv://cinema_admin:<password>@cinema-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

#### 5. Configurar no Projeto
1. Abra `cinema-challenge-back/.env`
2. Substitua `<password>` pela senha que você criou:
```env
MONGODB_URI=mongodb+srv://cinema_admin:SUA_SENHA_AQUI@cinema-cluster.xxxxx.mongodb.net/cinema-challenge?retryWrites=true&w=majority
```

#### 6. Testar Conexão
```bash
cd cinema-challenge-back
npm run seed
```

Se aparecer `✅ MongoDB Connected`, está funcionando! 🎉

---

## 💻 Opção 2: MongoDB Local

### Windows

#### 1. Download
1. Acesse [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Selecione:
   - Version: `7.0.x (current)`
   - Platform: `Windows`
   - Package: `msi`

#### 2. Instalação
1. Execute o arquivo `.msi` baixado
2. Escolha **"Complete"** installation
3. Em "Service Configuration":
   - ✅ Install MongoDB as a Service
   - Service Name: `MongoDB`
   - Data Directory: `C:\Program Files\MongoDB\Server\7.0\data`
   - Log Directory: `C:\Program Files\MongoDB\Server\7.0\log`
4. Clique **"Next"** e **"Install"**

#### 3. Verificar Instalação
```powershell
# Verificar se serviço está rodando
Get-Service MongoDB

# Status deve ser "Running"
```

#### 4. Adicionar ao PATH (Opcional, mas recomendado)
1. Procurar "Variáveis de Ambiente" no Windows
2. Em "Variáveis do Sistema", editar `Path`
3. Adicionar: `C:\Program Files\MongoDB\Server\7.0\bin`
4. Reiniciar PowerShell

#### 5. Configurar no Projeto
```env
# cinema-challenge-back/.env
MONGODB_URI=mongodb://localhost:27017/cinema-challenge
```

### Linux (Ubuntu/Debian)

```bash
# Importar chave pública
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Adicionar repositório
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Instalar
sudo apt update
sudo apt install -y mongodb-org

# Iniciar serviço
sudo systemctl start mongod
sudo systemctl enable mongod

# Verificar status
sudo systemctl status mongod
```

### macOS

```bash
# Com Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Iniciar serviço
brew services start mongodb-community@7.0

# Verificar status
brew services list
```

---

## 🐳 Opção 3: Docker

### Pré-requisito
- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado

### Método 1: Comando Rápido
```bash
# Iniciar MongoDB
docker run -d \
  --name mongodb-cinema \
  -p 27017:27017 \
  -e MONGO_INITDB_DATABASE=cinema-challenge \
  mongo:7.0

# Verificar se está rodando
docker ps
```

### Método 2: Docker Compose (Recomendado)
Crie `docker-compose.yml` na raiz do projeto:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: mongodb-cinema
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: cinema-challenge
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

Comandos:
```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Ver logs
docker-compose logs -f
```

---

## ✅ Verificação da Instalação

### 1. Testar Conexão com Mongo Shell
```bash
# MongoDB Atlas
mongosh "mongodb+srv://cinema_admin:<password>@cinema-cluster.xxxxx.mongodb.net/"

# MongoDB Local
mongosh

# Docker
docker exec -it mongodb-cinema mongosh
```

### 2. Testar com o Projeto
```bash
cd cinema-challenge-back

# Popular banco de dados
npm run seed

# Iniciar servidor
npm start
```

### 3. Verificar no Navegador
Abra http://localhost:5000/api/v1/health

Resposta esperada:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 5.234
}
```

---

## 🔧 Solução de Problemas

### Erro: "MongooseError: Operation buffering timed out"

**Causa:** MongoDB não está rodando ou string de conexão incorreta

**Solução:**
```bash
# Windows - Verificar serviço
Get-Service MongoDB

# Se parado, iniciar:
Start-Service MongoDB

# Linux/Mac
sudo systemctl status mongod
sudo systemctl start mongod

# Docker
docker ps
docker start mongodb-cinema
```

### Erro: "Authentication failed"

**Causa:** Usuário/senha incorretos no MongoDB Atlas

**Solução:**
1. Vá para MongoDB Atlas > Database Access
2. Edite usuário e redefina senha
3. Atualize `.env` com nova senha
4. **Lembre-se:** Senha deve ter caracteres especiais codificados:
   - `@` = `%40`
   - `#` = `%23`
   - `:` = `%3A`

Exemplo:
```env
# Senha: Pass@123
MONGODB_URI=mongodb+srv://user:Pass%40123@cluster.mongodb.net/...
```

### Erro: "IP not whitelisted"

**Causa:** Seu IP não está autorizado no MongoDB Atlas

**Solução:**
1. MongoDB Atlas > Network Access
2. Add IP Address > Allow Access from Anywhere
3. Aguarde 1-2 minutos para aplicar

### Porta 27017 já está em uso

**Solução Windows:**
```powershell
# Ver o que está usando a porta
netstat -ano | findstr :27017

# Matar processo (substitua PID)
taskkill /PID <numero_do_pid> /F
```

**Solução Linux/Mac:**
```bash
# Ver o que está usando a porta
lsof -i :27017

# Matar processo
kill -9 <PID>
```

### MongoDB não inicia após instalação (Windows)

**Solução:**
```powershell
# Executar como Administrador

# Criar diretórios necessários
mkdir C:\data\db

# Reinstalar serviço
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --install

# Iniciar serviço
net start MongoDB
```

---

## 📊 Comparação de Opções

| Recurso | Atlas | Local | Docker |
|---------|-------|-------|--------|
| Tempo de setup | 10 min | 20 min | 5 min |
| Requer instalação | ❌ | ✅ | ✅ Docker |
| Funciona offline | ❌ | ✅ | ✅ |
| Backup automático | ✅ | ❌ | ❌ |
| Uso de espaço | 0 MB | ~500 MB | ~400 MB |
| Pronto para produção | ✅ | ❌ | ⚠️ Requer config |
| Suporte multi-ambiente | ✅ | ❌ | ✅ |

---

## 🎓 Recursos de Aprendizado

- [Documentação MongoDB](https://www.mongodb.com/docs/)
- [MongoDB University](https://university.mongodb.com/) - Cursos grátis
- [Mongoose Docs](https://mongoosejs.com/docs/guide.html)
- [Atlas Getting Started](https://www.mongodb.com/docs/atlas/getting-started/)

---

## 📞 Precisa de Ajuda?

1. Verifique os logs do servidor: `npm start`
2. Teste conexão: `npm run seed`
3. Consulte a [Wiki do Projeto](../Wiki/Troubleshooting.md)
4. Abra uma issue no GitHub

---

**Última atualização:** 2024
