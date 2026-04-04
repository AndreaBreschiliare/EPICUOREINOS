# ⚡ Quick Start Guide

## Para Começar em 5 Minutos

### 1. Instalar Dependências

```bash
# Backend
cd backend
npm install

# Frontend (em outro terminal)
cd frontend
npm install
```

### 2. Configurar Banco de Dados

```bash
# Se não tiver PostgreSQL instalado
# Windows: https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql

# Conectar ao PostgreSQL
psql -U postgres

# No PSQL:
CREATE DATABASE travian_game;
\q

# Voltar ao backend e rodas as migrations
cd backend
npm run db:migrate
```

### 3. Arquivo .env

```bash
# backend/.env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/travian_game
JWT_SECRET=dev_secret_change_in_production
WS_PORT=5001
```

### 4. Rodar Servidores

```bash
# Terminal 1: Backend
cd backend
npm run dev
# Deve aparecer: "Server running on port 5000"

# Terminal 2: Frontend
cd frontend
npm start
# Deve abrir http://localhost:3000
```

### 5. Testar

- Acessar http://localhost:3000
- Registrar novo usuário
- Criar feudo
- Tentar construir algo

---

## Estrutura de Pastas - TL;DR

```
travian-game/
├── backend/              # API Node.js + WebSocket
│   ├── src/
│   │   ├── models/       # Database models
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API endpoints
│   │   └── services/     # Business logic
│   ├── migrations/       # Database versions
│   └── package.json
├── frontend/             # React SPA
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Route pages
│   │   ├── services/     # API calls
│   │   └── store/        # State management
│   └── package.json
├── docs/                 # Documentação completa
└── README.md
```

---

## Primeiras Tarefas

### Task 1: Setup Express básico (2h)
- [ ] Criar `backend/src/app.js` com Express
- [ ] Rota `GET /health` simples
- [ ] CORS configurado

### Task 2: Setup React básico (1h)
- [ ] Limpar CRA boilerplate
- [ ] Criar `src/App.jsx` básico
- [ ] Routing principal (Home, Login, Dashboard)

### Task 3: Database schema (3h)
- [ ] Migration para tabela users
- [ ] Migration para tabela feuds
- [ ] Seed com dados iniciais

### Task 4: Autenticação (3h)
- [ ] Rota POST /auth/register
- [ ] Rota POST /auth/login
- [ ] JWT token generation
- [ ] Login form em React

### Task 5: Feudo CRUD (2h)
- [ ] POST /feud/create
- [ ] GET /feud/me
- [ ] Dashboard React básico

---

## API Endpoints Essenciais (Fase 1)

```
POST   /api/auth/register      # { username, email, password }
POST   /api/auth/login         # { email, password }
POST   /api/feud               # { name, culture }
GET    /api/feud/me            # Meus dados de feudo
GET    /api/feud/:id           # Ver feudo público
GET    /api/health             # Health check
```

---

## Componentes React Essenciais (Fase 1)

```
src/pages/
  ├── LoginPage.jsx            # Tela de login
  ├── RegisterPage.jsx         # Tela de registro
  └── DashboardPage.jsx        # Dashboard principal

src/components/
  ├── common/
  │   ├── Header.jsx           # Top navigation
  │   └── Layout.jsx           # Wrapper layout
  ├── Dashboard/
  │   ├── ResourceDisplay.jsx  # Info de recursos
  │   └── QuickStats.jsx       # Estatísticas
  └── Auth/
      └── LoginForm.jsx        # Form de login
```

---

## Modelos de Dados Essenciais

### User
```javascript
{
  id, username, email, password_hash, created_at
}
```

### Feud
```javascript
{
  id, user_id, name, level,
  madeira, pedra, ferro, comida, cobre,
  população, moral,
  created_at
}
```

---

## Debugging

### Backend não inicia
```bash
# Verificar porta 5000 em uso
lsof -i :5000

# Verificar conexão database
psql -U postgres -d travian_game
```

### Frontend não abre
```bash
# Limpar cache
rm -rf frontend/node_modules
npm install
npm start
```

### CORS error
```javascript
// No backend app.js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000'
}));
```

---

## Próximos Passos

1. ✅ Setup completo
2. ✅ Autenticação
3. Criar/Listar Feudos
4. Sistema de Recursos
5. Construções
6. Pesquisa
7. Cargos/Leis
8. Level Up

---

## Recursos Úteis

- Documentação Completa: `/docs/`
- Plano de Desenvolvimento: `/docs/DEVELOPMENT_PLAN.md`
- Schema do Banco: `/docs/DATABASE_SCHEMA.md`
- Guia de Contribuição: `/docs/CONTRIBUTING.md`

---

## Stack Rápido

| Parte | Tech | Razão |
|-------|------|-------|
| Backend | Node.js + Express | Rápido, escalável |
| Frontend | React | UI componentizada |
| Database | PostgreSQL | Relacional, confiável |
| Real-time | Socket.IO | WebSocket fácil |
| Auth | JWT | Stateless, seguro |
| UI | Material-UI | Componentes prontos |

---

## Teste Manual - Fluxo Completo

1. **Registrar**
   - Acesso http://localhost:3000/register
   - Preencher form
   - Submit

2. **Login**
   - Email + password
   - Deve ir para dashboard

3. **Criar Feudo**
   - Escolher cultura
   - Nome do feudo
   - Submit

4. **Dashboard**
   - Ver recursos
   - Ver construções (none yet)
   - Próximos passo: Construir

---

**Sucesso? 🚀otic Próximo passo: README de Backend e Frontend!**
