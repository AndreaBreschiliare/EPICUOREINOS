# Backend - TravianUO

API REST + WebSocket para gerenciamento de feudos.

## Estrutura

```
src/
├── config/
│   ├── database.js       # Conexão PostgreSQL
│   ├── jwt.js            # Configuração JWT
│   └── constants.js      # Constantes do jogo
├── models/
│   ├── User.js
│   ├── Feud.js
│   ├── Building.js
│   ├── Research.js
│   ├── Cargo.js
│   ├── Law.js
│   └── Resource.js
├── routes/
│   ├── auth.js
│   ├── feud.js
│   ├── buildings.js
│   ├── research.js
│   ├── resources.js
│   ├── cargos.js
│   └── laws.js
├── controllers/
│   ├── authController.js
│   ├── feudController.js
│   ├── buildingController.js
│   ├── researchController.js
│   ├── cargoController.js
│   └── lawController.js
├── services/
│   ├── resourceService.js      # Lógica de produção
│   ├── buildingService.js
│   ├── researchService.js
│   ├── cargoService.js
│   ├── levelUpService.js
│   └── gameEngine.js           # Game loop
├── middleware/
│   ├── auth.js                 # JWT verification
│   ├── errorHandler.js
│   └── validation.js
├── jobs/
│   ├── resourceProduction.js   # Job agendado (24h)
│   └── scheduler.js            # Node schedule
├── websocket/
│   ├── events.js
│   └── handlers.js
└── app.js                      # Express app
```

## Instalação

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

## Variáveis de Ambiente

Crie um arquivo `.env`:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/travian_game
JWT_SECRET=seu_secret_muito_seguro_aqui
JWT_EXPIRES_IN=7d

# WebSocket
WS_PORT=5001

# Game
TICK_INTERVAL_MS=86400000  # 24 horas
```

## Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Registrar
- `POST /api/auth/login` - Login

### Feudo
- `GET /api/feud/me` - Dados do meu feudo
- `POST /api/feud` - Criar feudo
- `GET /api/feud/:id` - Ver feudo público

### Construções
- `GET /api/feud/:feudId/buildings` - Listar
- `POST /api/feud/:feudId/buildings` - Construir
- `PUT /api/feud/:feudId/buildings/:id/upgrade` - Fazer upgrade

### Pesquisa
- `GET /api/feud/:feudId/research/available` - Pesquisas disponíveis
- `POST /api/feud/:feudId/research/start` - Iniciar
- `GET /api/feud/:feudId/research/progress` - Progresso

### Recursos
- `GET /api/feud/:feudId/resources` - Saldo atual
- `POST /api/feud/:feudId/resources/collect` - Colher (manual)

### Cargos
- `GET /api/feud/:feudId/cargos` - Cargos e holders
- `POST /api/feud/:feudId/cargos/:name/assign` - Atribuir cargo

### Leis
- `GET /api/feud/:feudId/laws/available` - Leis disponíveis
- `POST /api/feud/:feudId/laws/:name/activate` - Ativar
- `POST /api/feud/:feudId/laws/:name/deactivate` - Desativar

## WebSocket Events

### Escuta (Server → Client)
- `resource:updated` - Recursos atualizados
- `building:progress` - Construção em progresso
- `building:completed` - Construção completa
- `research:progress` - Pesquisa em progresso
- `research:completed` - Pesquisa completa

### Emit (Client → Server)
- `connect` - Conectar
- `disconnect` - Desconectar

## Game Engine

### Resource Production Cycle
A cada 24 horas:
1. Calcula população efetiva
2. Processa cada construção
3. Aplica multiplicadores de cargos
4. Aplica modificadores de leis
5. Gera recursos
6. Atualiza banco de dados
7. Broadcasting para jogadores

## Autenticação

Usa JWT Bearer token:

```
Authorization: Bearer <token>
```

## Rate Limiting

Implementado para prevenir abuse:
- 100 requests por minuto por IP
- 30 requests por minuto por usuário (operações de escrita)
