# ✅ CHECKLIST: O Que Fazer Agora

**Objetivo:** Ter backend rodando localmente em ~15 minutos

---

## 🔵 AGORA (15 minutos)

### Passo 1: PostgreSQL (5 min)
- [ ] Instalar PostgreSQL (https://www.postgresql.org/download/)
- [ ] Abrir terminal/CMD
- [ ] Executar: `psql -U postgres`
- [ ] Colar o script SQL abaixo

```sql
CREATE DATABASE travian_game;
CREATE USER travian WITH PASSWORD 'travian123';
ALTER ROLE travian SET client_encoding TO 'utf8';
ALTER ROLE travian SET default_transaction_isolation TO 'read committed';
ALTER ROLE travian SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE travian_game TO travian;
\q
```

- [ ] Confirmar: Deve sair e voltar ao terminal normal

### Passo 2: Backend Setup (10 min)
- [ ] Abrir terminal na pasta `backend/`
- [ ] `cp .env.example .env` OU copiar arquivo e renomear
- [ ] `npm install` (vai levar ~2 minutos)
- [ ] `npm run db:migrate` (deve aparecer 3x ✓)
- [ ] `npm run dev`  (deve dizer: "Server running on port 5000")

### Passo 3: Verify (0 min)
- [ ] Abrir navegador: http://localhost:5000/health
- [ ] Deve ver JSON com "success": true e hora atual

✅ **Backend funcionando!**

---

## 🔵 HOJE AINDA (30 min adicional - OPCIONAL)

Se tiver tempo, teste os endpoints:

### Test 1: Register Users
```bash
# Terminal novo
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"player1","email":"p1@test.com","password":"123456"}'

# Resultado deve ter "token": "eyJh..."
```

### Test 2: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"p1@test.com","password":"123456"}'

# Resultado deve ter "token": "eyJh..."
```

✅ **Autenticação funcionando!**

---

## 🔵 AMANHÃ (2 horas)

Frontend React:

- [ ] Setup React: `cd frontend && npm install`
- [ ] Criar Login page
- [ ] Criar Register page
- [ ] Conectar com API backend
- [ ] Testar fluxo completo

---

## 📊 Checklist Terminal por Terminal

### Terminal 1: PostgreSQL (deixar aberto)
```
✓ psql -U postgres executado
✓ Database travian_game criado
✓ User travian criado
```

### Terminal 2: Backend (deixar rodando)
```bash
cd backend
npm install
npm run db:migrate
npm run dev

# Esperado ver:
# 🚀 Server running on port 5000
# 📍 Environment: development
```

### Terminal 3: Testes (opcional)
```bash
curl http://localhost:5000/health
curl -X POST http://localhost:5000/api/auth/register ...
```

---

## 🚨 Se Algo Der Errado

### "Cannot connect to database"
```
✓ PostgreSQL está rodando?
✓ .env tem DATABASE_URL correto?
✓ Database travian_game existe?
```

### "Port 5000 already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID 1234 /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### "npm command not found"
```
✓ Node.js instalado?
✓ npm -v funciona?
```

### "migrate error"
```
✓ Rode: npm install novamente
✓ Verifique .env DATABASE_URL
```

---

## 📝 Resumo do Que Você Tem

✅ **12 arquivos de código backend**
✅ **3 migrations de banco**
✅ **2 endpoints funcionais** (register, login)
✅ **Autenticação completa** (JWT, bcrypt)
✅ **Documentação completa**

---

## 🎯 Sucesso Quando...

- ✅ `npm run dev` rodando sem erros
- ✅ http://localhost:5000/health retorna JSON
- ✅ POST /api/auth/register cria usuário
- ✅ POST /api/auth/login retorna token

---

## 💡 Arquivos Importantes

```
backend/
├── src/app.js              ← Arquivo principal
├── src/config/             ← Configurações
├── src/models/             ← Modelos do banco
├── src/controllers/        ← Lógica de autenticação
├── migrations/             ← Estrutura do banco
└── .env                    ← Variáveis (cria do .example)
```

---

## 📞 Próxima Ação

**→ Vá para: SETUP_INSTRUCTIONS.md**

Tem instruções detalhadas passo a passo!

---

**Tempo total: ~15 minutos para ter backend rodando! ⏱️**

Vai! 🚀
