# 🚀 Setup Completo - Passo a Passo

**Status:** ✅ Código criado e pronto para executar

---

## ✅ O Que Foi Criado

```
✓ backend/src/app.js           - Express app principal
✓ backend/src/config/          - Configurações (DB, JWT, constants)
✓ backend/src/models/          - User e Feud models
✓ backend/src/controllers/     - Auth controller
✓ backend/src/routes/          - Auth routes
✓ backend/src/middleware/      - Auth middleware
✓ backend/migrations/          - 3 migrations (users, feuds, buildings)
✓ backend/.env.example         - Template de variáveis
✓ knexfile.js                  - Config Knex
```

---

## 🔧 Passo 1: PostgreSQL (5 minutos)

### Windows
```bash
# Download: https://www.postgresql.org/download/windows/
# Usar pgAdmin que vem incluído
```

### Mac
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Linux
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

## 📊 Passo 2: Criar Database (2 minutos)

Abra o terminal (cmd no Windows) e execute:

```bash
psql -U postgres
```

Se pedir senha, colocar a senha do PostgreSQL que você escolheu na instalação.

Dentro do prompt `postgres=#`, execute:

```sql
CREATE DATABASE travian_game;
CREATE USER travian WITH PASSWORD 'travian123';
ALTER ROLE travian SET client_encoding TO 'utf8';
ALTER ROLE travian SET default_transaction_isolation TO 'read committed';
ALTER ROLE travian SET default_transaction_deferrable TO on;
ALTER ROLE travian SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE travian_game TO travian;
\q
```

✅ Pronto! Database criado.

---

## 🔑 Passo 3: Configurar .env Backend (2 minutos)

```bash
cd backend
cp .env.example .env
```

Abra `backend/.env` e deixe assim:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://travian:travian123@localhost:5432/travian_game
FRONTEND_URL=http://localhost:3000
JWT_SECRET=dev_secret_chage_in_production
JWT_EXPIRES_IN=7d
WS_PORT=5001
WS_CORS_ORIGIN=http://localhost:3000
```

---

## 📦 Passo 4: Instalar Dependências (2 minutos)

```bash
cd backend
npm install
```

Aguarde... vai instalar ~30 packages (~50MB)

---

## 🗄️ Passo 5: Rodar Migrations (1 minuto)

```bash
npm run db:migrate
```

Você deve ver:

```
✓ 001_create_users_table.js
✓ 002_create_feuds_table.js
✓ 003_create_buildings_table.js
```

✅ Pronto! Banco criado com tabelas.

---

## 🚀 Passo 6: Rodar Backend (1 minuto)

```bash
npm run dev
```

Você deve ver:

```
🚀 Server running on port 5000
📍 Environment: development
🌐 API Health: http://localhost:5000/health
```

✅ Backend rodando!

---

## 🧪 Passo 7: Testar API (5 minutos)

### Terminal novo (ou usar Postman/Insomnia)

**1. Test Health**
```bash
curl http://localhost:5000/health
```

Resposta:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-04-03T10:30:00Z"
}
```

**2. Registrar Usuário**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "player1",
    "email": "player1@example.com",
    "password": "senha123"
  }'
```

Resposta:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "player1",
    "email": "player1@example.com",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Usuário registrado com sucesso"
}
```

**3. Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "player1@example.com",
    "password": "senha123"
  }'
```

✅ Pronto! API de autenticação funcionando!

---

## 📝 Comandos Úteis

```bash
# Rodar migrations
npm run db:migrate

# Reverter última migration
npm run db:rollback

# Rodar em desenvolvimento (com nodemon)
npm run dev

# Rodar em produção
npm start

# Limpar console
npm run dev 2>&1 | head -20
```

---

## 🐛 Troubleshooting

### "cannot connect to database"
```
✓ Verifique se PostgreSQL está rodando
✓ Teste: psql -U travian -d travian_game
```

### "EADDRINUSE: address already in use :::5000"
```
Há outro processo usando porta 5000
Windows: netstat -ano | findstr :5000
Mac/Linux: lsof -i :5000
```

### "password authentication failed"
```
✓ Verifique DATABASE_URL no .env
✓ User deve ser 'travian' com password 'travian123'
```

---

## ✅ Checklist Completo

- [ ] PostgreSQL instalado
- [ ] Database `travian_game` criado
- [ ] User `travian` criado
- [ ] Backend clonado/baixado
- [ ] .env configurado
- [ ] `npm install` executado
- [ ] `npm run db:migrate` passou
- [ ] `npm run dev` rodando no port 5000
- [ ] Health check retorna 200
- [ ] Register endpoint funciona
- [ ] Login endpoint funciona

---

## 📊 Próximos Passos

Após confirmar que tudo funciona:

### Próxima Semana: Feudo
1. [ ] POST /api/feud - Criar feudo
2. [ ] GET /api/feud/me - Meu feudo
3. [ ] Dashboard básico

### Frontend
1. [ ] React setup
2. [ ] Login page
3. [ ] Dashboard page

---

## 📞 Se Tiver Problema

1. Verifique `.env` - DATABASE_URL deve estar correto
2. Verify Database - `psql -U travian -d travian_game`
3. Veja logs - `npm run dev` mostra erros
4. Verifique porta 5000 usando

---

**🎉 Parabéns! Backend pronto para começar!**

Próximo: Frontend React
