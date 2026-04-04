# 🏗️ Arquitetura do Sistema

## Visão Geral

```
┌─────────────────┐
│   React SPA     │ (Frontend - Port 3000)
│   Material-UI   │
└────────┬────────┘
         │ HTTP/REST
         │ WebSocket
         │
┌────────┴────────┐
│  Express.js     │ (Backend - Port 5000)
│  - REST API     │
│  - Socket.IO    │
│  - Game Engine  │
└────────┬────────┘
         │ SQL
         │
┌────────┴────────┐
│  PostgreSQL     │
│  - Users        │
│  - Feudos       │
│  - Buildings    │
│  - Research     │
│  - Resources    │
│  - Laws/Edicts  │
└─────────────────┘
```

## Fluxo de Dados

### 1. Autenticação
```
Client Login Request
    ↓
Express API validates credentials
    ↓
Generate JWT token
    ↓
Return token to client
    ↓
Client stores token in localStorage
    ↓
Include in Authorization header for future requests
```

### 2. Criação de Feudo
```
User submits form (culture + name)
    ↓
Frontend validates input
    ↓
POST /api/feud/create
    ↓
Backend validates:
    - User is authenticated
    - User doesn't have feud yet
    - Culture is valid
    ↓
Create Feud record
    ↓
Initialize resources (20000 Madeira, 10000 Pedra, etc)
    ↓
Create initial Population = 8 (1 House)
    ↓
Return feud data + socket connection
    ↓
Frontend connects to WebSocket
```

### 3. Produção de Recursos
```
Node Schedule Trigger (Every 24h)
    ↓
Fetch all feudos from DB
    ↓
For each Feudo:
    - Calculate effective population
    - Get all buildings
    - For each building:
        * Get base production
        * Apply building level multiplier
        * Apply cargo bonuses
        * Apply law effects
        * Calculate final production
    - Sum all productions
    - Update feud.resources
    ↓
Broadcast via WebSocket to all connected players
    ↓
Frontend updates UI
```

### 4. Construção de Edifício
```
User clicks "Build"
    ↓
Frontend sends POST /api/feud/:id/buildings
    ↓
Backend validates:
    - User owns the feud
    - Has enough resources
    - Has free building slot
    - Has required research
    ↓
Deduct resources from feud
    ↓
Create Building record:
    - status: 'construction'
    - construction_time_end: now + time
    - type: casa, fazenda, etc
    ↓
Broadcast to user via WebSocket
    ↓
Schedule completion event
    ↓
When complete:
    - Update building.status to 'complete'
    - Trigger completion event
    - Unlock building effects
```

## Camadas da Aplicação

### Frontend Layer
- **UI Components** - React components reutilizáveis
- **Pages** - Container components para rotas
- **Services** - Abstraem chamadas à API
- **Hooks** - Lógica reutilizável
- **Store** - Estado global (Zustand)

### API Layer
- **Routes** - Definem endpoints HTTP
- **Controllers** - Validam requisições e delegam
- **Middleware** - Autenticação, validação, erro
- **Services** - Lógica de negócio
- **Models** - Acesso ao banco

### Data Layer
- **PostgreSQL** - Persistência
- **Knex** - Query builder
- **Migrations** - Versionamento de schema

### Real-time Layer
- **Socket.IO** - WebSocket para atualizações
- **Event Emitters** - Broadcast de eventos

## Padrões de Design

### Model-View-Controller (MVC)
- **Model** - User, Feud, Building (banco de dados)
- **View** - React components
- **Controller** - Express routes + services

### Service Layer
Lógica de negócio separada da API:
```
Route → Controller → Service → Model → Database
                        ↓
                   WebSocket (emit)
```

### Repository Pattern
Abstraem operações de banco:
```javascript
const feud = await FuedRepository.findById(id);
const buildings = await BuildingRepository.findByFeudId(feudId);
```

## Fluxo de Estado Comum

### Frontend State Management
```
Component → Hook (useState/useContext)
         → Custom Hook (useFeud)
         → API Service call
         → Server response
         → Zustand Store update
         → Component re-render
         ↓
         WebSocket update
         → Store update
         → Component re-render
```

### Backend State Management
```
Request → Auth verify
       → DB fetch
       → Calculation
       → DB update
       → Cache invalidate
       → WebSocket emit
```

## Segurança

### Autenticação
- JWT Bearer tokens
- Refresh tokens com validade curta
- Senha com bcrypt (hash + salt)

### Autorizacao
- Middleware verifica se usuário é owner do feudo
- Validação server-side em todas as operações

### Validação
- Input validation no frontend (UX)
- Validation rigorosa no backend
- Sanitização de inputs
- SQL injection protection (Knex query builder)

### Rate Limiting
- 100 requests/min por IP
- 30 write operations/min por usuário

## Performance

### Frontend
- Code splitting com React.lazy()
- Memoização com React.memo()
- lazy image loading
- CSS minification

### Backend
- Database indexing
- Connection pooling
- Caching (Redis para dados estáticos)
- Compression gzip

### Database
- Proper indexing (user_id, feud_id)
- Prepared statements
- Query optimization

## Escalabilidade Futura

### Microserviços
```
Gateway → Auth Service
       → Game Service
       → Chat Service
       → Ranking Service
```

### Message Queue
- Redis para job queue
- Armazenar tarefas assincronas
- Separar game loop de API

### CDN
- Servir assets (CSS, JS, imagens)
- Reduzir latência
- Global distribution

### Database Sharding
- Particionar dados por região
- Load balancing
