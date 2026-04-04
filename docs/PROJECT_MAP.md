# 🗺️ Mapa do Projeto

## O que foi criado

### Estrutura de Pastas

```
travian-game/
├── README.md                          # 📖 Overview do projeto
├── backend/
│   ├── package.json                   # 📦 Dependências
│   ├── knexfile.js                    # 🔧 Config Knex
│   ├── .env.example                   # 🔑 Variáveis de ambiente
│   ├── README.md                      # 📚 Guia backend
│   ├── src/
│   │   ├── app.js                     # (a criar)
│   │   ├── config/                    # (a criar)
│   │   ├── models/                    # (a criar)
│   │   ├── routes/                    # (a criar)
│   │   ├── controllers/               # (a criar)
│   │   ├── services/                  # (a criar)
│   │   ├── middleware/                # (a criar)
│   │   ├── jobs/                      # (a criar)
│   │   └── websocket/                 # (a criar)
│   ├── migrations/                    # (a criar)
│   └── tests/                         # (a criar)
│
├── frontend/
│   ├── package.json                   # 📦 Dependências
│   ├── public/                        # Arquivos estáticos
│   ├── .env.example                   # 🔑 Variáveis de ambiente
│   ├── README.md                      # 📚 Guia frontend
│   └── src/
│       ├── App.jsx                    # (a criar)
│       ├── components/                # (a criar)
│       ├── pages/                     # (a criar)
│       ├── services/                  # (a criar)
│       ├── hooks/                     # (a criar)
│       ├── store/                     # (a criar)
│       ├── utils/                     # (a criar)
│       ├── styles/                    # (a criar)
│       └── tests/                     # (a criar)
│
└── docs/
    ├── 🚀 QUICK_START.md              # ⚡ Iniciar em 5 min
    ├── 📐 ARCHITECTURE.md             # Arquitetura do sistema
    ├── 🗄️  DATABASE_SCHEMA.md         # Schema do banco
    ├── 🛣️  API_ROUTES.md              # Endpoints e constants
    ├── 📅 DEVELOPMENT_PLAN.md         # Cronograma 10 semanas
    └── 🤝 CONTRIBUTING.md             # Guia de contribuição
```

---

## Arquivos Criados: Checklist

### ✅ Já Criados

- [x] `README.md` - Overview do projeto
- [x] `backend/package.json` - Dependências
- [x] `backend/knexfile.js` - Configuração Knex
- [x] `backend/.env.example` - Template de variáveis
- [x] `backend/README.md` - Guia backend
- [x] `frontend/package.json` - Dependências React
- [x] `frontend/README.md` - Guia frontend
- [x] `docs/QUICK_START.md` - Quick start guide
- [x] `docs/ARCHITECTURE.md` - Arquitetura
- [x] `docs/DATABASE_SCHEMA.md` - Schema ED desgin
- [x] `docs/API_ROUTES.md` - Endpoints e respostas
- [x] `docs/DEVELOPMENT_PLAN.md` - Cronograma
- [x] `docs/CONTRIBUTING.md` - Guia de contribuição

### ⏳ Próximos: Fase 1 (Primeira Semana)

- [ ] `backend/src/app.js` - Express app setup
- [ ] `backend/src/config/database.js` - PG connection
- [ ] `backend/src/config/jwt.js` - JWT config
- [ ] `backend/migrations/001_create_users.js` - Users table
- [ ] `backend/migrations/002_create_feuds.js` - Feuds table
- [ ] `backend/src/models/User.js` - User model
- [ ] `backend/src/models/Feud.js` - Feud model
- [ ] `backend/src/routes/auth.js` - Auth routes
- [ ] `backend/src/controllers/authController.js` - Auth logic
- [ ] `frontend/src/App.jsx` - React app
- [ ] `frontend/src/pages/LoginPage.jsx` - Login
- [ ] `frontend/src/pages/RegisterPage.jsx` - Register

---

## Como Usar Este Projeto

### 1️⃣ Entender a Estrutura

1. Ler `README.md` (visão geral)
2. Ler `docs/QUICK_START.md` (começar)
3. Ler `docs/ARCHITECTURE.md` (visão técnica)
4. Ler `docs/DATABASE_SCHEMA.md` (dados)

### 2️⃣ Setup Local

```bash
# Clonar
git clone [repo]
cd travian-game

# Backend
cd backend
npm install
cp .env.example .env
npm run db:migrate

# Frontend
cd ../frontend
npm install

# Rodar
# Terminal 1: backend
cd backend && npm run dev

# Terminal 2: frontend
cd frontend && npm start
```

### 3️⃣ Começar a Desenvolver

1. Ler `docs/CONTRIBUTING.md` (convenções)
2. Ler `docs/DEVELOPMENT_PLAN.md` (tarefas)
3. Pegar uma task da Semana 1
4. Criar branch: `git checkout -b feat/task-name`
5. Desenvolver
6. Fazer PR

---

## Roadmap Visual

### Semana 1: Foundation ✨
```
Users → Login/Register → Create Feud → Dashboard
```

### Semana 2-3: Resources 📊
```
Produção 24h → Display Resources → Calcular Bônus
```

### Semana 4: Buildings 🏗️
```
UI Construções → Build → Upgrade → Completar
```

### Semana 5: Research 🧪
```
Tech Tree → Start → Progress → Complete → Unlock
```

### Semana 6: Cargos/Leis 👑
```
Assign Cargos → Bonus Calculation → Laws Activation
```

### Semana 7: Level Up 📈
```
Requisitos → Tribute → Ascender → Recompensas
```

### Semana 8: Multiplayer 🌐
```
WebSocket → Leaderboard → Chat → Reputação
```

### Semana 9: Testing 🧪
```
Unit Tests → Integration → Performance → Docs
```

### Semana 10: Deploy 🚀
```
AWS Setup → DB Migration → SSL → Live!
```

---

## Tecnologias por Camada

### Frontend
```
┌─────────────────────────┐
│   React 18              │ (UI)
├─────────────────────────┤
│   Material-UI           │ (Components)
├─────────────────────────┤
│   Zustand              │ (State Management)
├─────────────────────────┤
│   Axios + Socket.IO    │ (API Communication)
├─────────────────────────┤
│   React Router         │ (Routing)
└─────────────────────────┘
```

### Backend
```
┌─────────────────────────┐
│   Express.js           │ (Server)
├─────────────────────────┤
│   Socket.IO            │ (Real-time)
├─────────────────────────┤
│   JWT + Bcrypt         │ (Auth)
├─────────────────────────┤
│   Knex.js              │ (Query Builder)
├─────────────────────────┤
│   PostgreSQL           │ (Database)
├─────────────────────────┤
│   Node-Schedule        │ (Jobs/Cron)
└─────────────────────────┘
```

---

## Fluxo de Dados Resumido

```
User Input
    ↓
React Component
    ↓
API Call (Axios)
    ↓
Express Route
    ↓
Controller → Service
    ↓
Database Query (Knex)
    ↓
PostgreSQL
    ↓
Response
    ↓
Zustand Store Update
    ↓
React Re-render
```

---

## Estrutura de Dados Simplificada

```
User
  ├── many Feuds
  │   ├── many Buildings
  │   ├── many Research
  │   ├── many Cargos
  │   ├── many Laws
  │   ├── many Edicts
  │   ├── many NPCs
  │   └── Resources {madeira, pedra, ferro, etc}
  └── Authentication (JWT)
```

---

## Métricas do Projeto

### Tamanho
- **Backend:** ~500 linhas (estrutura inicial)
- **Frontend:** ~400 linhas (estrutura inicial)
- **Banco:** 10 tabelas + índices

### Complexidade
- **APIs:** 40+ endpoints
- **Components:** 30+ componentes
- **Lógica:** 3+ algorit
