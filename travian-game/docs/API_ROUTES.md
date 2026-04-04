# 🛣️ API Routes & Game Constants

## API Route Map

### Autenticação
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
```

### Feudo
```
GET    /api/feud/me                          # Meu feudo
POST   /api/feud                             # Criar novo feudo
GET    /api/feud/:id                         # Ver feudo (público/próprio)
PUT    /api/feud/:id                         # Atualizar feudo
GET    /api/feud/:id/summary                 # Resumo para leaderboard
POST   /api/feud/:id/level-up                # Solicitar ascensão
```

### Construções
```
GET    /api/feud/:feudId/buildings           # Listar todas
GET    /api/feud/:feudId/buildings/:id       # Detalhe
POST   /api/feud/:feudId/buildings           # Construir nova
PUT    /api/feud/:feudId/buildings/:id       # Fazer upgrade
DELETE /api/feud/:feudId/buildings/:id       # Demolir
GET    /api/feud/:feudId/buildings/available # Possíveis construir
```

### Pesquisa
```
GET    /api/feud/:feudId/research            # Listar todas
GET    /api/feud/:feudId/research/available  # Possíveis iniciar
POST   /api/feud/:feudId/research/start      # Iniciar pesquisa
GET    /api/feud/:feudId/research/progress   # Status de uma
GET    /api/feud/:feudId/research/tree       # Árvore completa
```

### Recursos
```
GET    /api/feud/:feudId/resources           # Saldo atual
GET    /api/feud/:feudId/resources/production # Taxa de produção
GET    /api/feud/:feudId/resources/history   # Histórico 30 dias
POST   /api/feud/:feudId/resources/collect   # Colheita manual
```

### Cargos
```
GET    /api/feud/:feudId/cargos              # Todos cargos + holders
GET    /api/feud/:feudId/cargos/available    # Possível atribuir
POST   /api/feud/:feudId/cargos/:name/assign # Atribuir especialista
DELETE /api/feud/:feudId/cargos/:name        # Remover especialista
```

### Leis
```
GET    /api/feud/:feudId/laws                # Leis ativas + slots livres
GET    /api/feud/:feudId/laws/available      # Possível ativar
POST   /api/feud/:feudId/laws/:name/activate # Ativar
DELETE /api/feud/:feudId/laws/:name          # Desativar
```

### Éditos
```
GET    /api/feud/:feudId/edicts              # Éditos ativos
GET    /api/feud/:feudId/edicts/available    # Possível ativar
POST   /api/feud/:feudId/edicts/:name/activate
DELETE /api/feud/:feudId/edicts/:name
```

### Traços Culturais
```
GET    /api/feud/:feudId/traits              # Traços escolhidos
GET    /api/cultures                         # Todas culturas
GET    /api/cultures/:name                   # Detalhe da cultura
```

### NPCs
```
GET    /api/feud/:feudId/npcs                # NPCs contratados
GET    /api/npc-types                        # Tipos disponíveis por nível
POST   /api/feud/:feudId/npcs/hire           # Contratar NPC
DELETE /api/feud/:feudId/npcs/:id            # Demitir NPC
```

### Leaderboard
```
GET    /api/leaderboard/prosperity           # Top 50 por prosperidade
GET    /api/leaderboard/military             # Top 50 por poder militar
GET    /api/leaderboard/research             # Top 50 por pesquisa
GET    /api/leaderboard/me                   # Minha posição
GET    /api/leaderboard/region               # Rankings regionais
```

### Admin/System
```
GET    /health                               # Health check
GET    /api/game/constants                   # Game data constants
GET    /api/game/stats                       # Estatísticas gerais
```

---

## Response Format

### Success (200, 201)
```javascript
{
  success: true,
  data: { /* dados */ },
  message: "Operation completed"
}
```

### Error (4xx, 5xx)
```javascript
{
  success: false,
  error: "ERROR_CODE",
  message: "Descrição do erro",
  details: { /* mais info */ }
}
```

---

## Game Constants

### Recursos Iniciais
```javascript
INITIAL_RESOURCES = {
  madeira: 20000,
  pedra: 10000,
  ferro: 5000,
  comida: 50000,
  cobre: 5000,
};
```

### Níveis de Feudo
```javascript
LEVELS = {
  1: { title: 'Senhor', slots: { laws: 1, edicts: 0 } },
  2: { title: 'Barão', slots: { laws: 2, edicts: 1 } },
  3: { title: 'Conde', slots: { laws: 3, edicts: 2 } },
  4: { title: 'Marquês', slots: { laws: 4, edicts: 3 } },
  5: { title: 'Duque', slots: { laws: 5, edicts: 4 } },
};
```

### Culturas
```javascript
CULTURES = {
  baduran: {
    name: 'Baduran (Anões)',
    level1Trait: 'Filhos da Montanha',
    bonus: { pedra: 0.2, ferro: 0.2 },
    penalty: { comida: -0.25 },
  },
  // ... mais culturas
};
```

### Construções
```javascript
BUILDINGS = {
  casa: {
    name: 'Casa',
    population: 8,
    upkeep: { madeira: 15 },
    costs: [
      { level: 1, madeira: 1000, pedra: 200 },
      { level: 2, madeira: 1500, pedra: 300 },
      // ...
    ],
  },
  // ... mais construções
};
```

### Pesquisas
```javascript
RESEARCH = {
  level_1: [
    {
      id: 'tecnicas_arado',
      name: 'Técnicas de Arado',
      cost: { cobre: 500, pergaminhos: 5 },
      time: 86400, // 1 dia em segundos
      effect: { comida: 0.1 }, // +10% comida
    },
    // ...
  ],
  // ... mais níveis
};
```

### Cargos
```javascript
CARGOS = {
  level_2: {
    ferreiro: {
      name: 'Ferreiro',
      prerequisite: 'forja_nv1',
      bonus: { type: 'metal_quality', value: 0.05 },
    },
    // ...
  },
  // ... mais níveis
};
```

### Leis
```javascript
LAWS = {
  level_1: [
    {
      id: 'decreto_capataz',
      name: 'Decreto do Capataz',
      category: 'producao',
      bonus: { madeira: 0.15, pedra: 0.15 },
      penalty: { comida: -0.1 },
    },
    // ...
  ],
  // ... mais níveis
};
```

---

## Exemplo de Resposta Real

### POST /api/auth/register

**Request:**
```javascript
{
  username: "player123",
  email: "player@example.com",
  password: "secure123"
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    id: 1,
    username: "player123",
    email: "player@example.com",
    token: "eyJhbGciOiJIUzI1NiIs...",
    expiresIn: "7d"
  },
  message: "User registered successfully"
}
```

---

### POST /api/feud

**Request:**
```javascript
{
  name: "Meu Feudo",
  culture: "baduran"
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    id: 42,
    userId: 1,
    name: "Meu Feudo",
    level: 1,
    culture: "baduran",
    resources: {
      madeira: 20000,
      pedra: 10000,
      ferro: 5000,
      comida: 50000,
      cobre: 5000
    },
    population: 8,
    moral: 50,
    buildings: [],
    research: [],
    createdAt: "2024-04-02T10:30:00Z"
  },
  message: "Feud created successfully"
}
```

---

### GET /api/feud/:id/resources

**Response:**
```javascript
{
  success: true,
  data: {
    current: {
      madeira: 22500,
      pedra: 11200,
      ferro: 5300,
      comida: 48500,
      cobre: 5150
    },
    production: {
      madeira: 450,  // por dia
      pedra: 300,
      ferro: 150,
      comida: 2000,
      cobre: 250
    },
    consumption: {
      comida: 400,   // por dia
      cobre: 100
    },
    lastUpdate: "2024-04-01T10:00:00Z"
  }
}
```

---

### POST /api/feud/:id/buildings

**Request:**
```javascript
{
  type: "fazenda",
  location: "plot_1"
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    id: 1,
    feudId: 42,
    type: "fazenda",
    level: 1,
    status: "construction",
    constructionStartTime: "2024-04-02T10:30:00Z",
    constructionEndTime: "2024-04-02T14:30:00Z",
    timeRemaining: 14400, // segundos
    upkeep: { madeira: 20 },
    production: { comida: 100 },
    resourcesDeducted: {
      madeira: 500,
      pedra: 100
    }
  },
  message: "Construction started"
}
```

---

### POST /api/feud/:id/research/start

**Request:**
```javascript
{
  techName: "tecnicas_arado"
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    id: 1,
    feudId: 42,
    techName: "tecnicas_arado",
    level: 1,
    status: "in_progress",
    startTime: "2024-04-02T10:30:00Z",
    endTime: "2024-04-03T10:30:00Z",
    timeRemaining: 86400,
    resourcesDeducted: {
      cobre: 500,
      pergaminhos: 5
    }
  },
  message: "Research started"
}
```

---

### Error Example

```javascript
{
  success: false,
  error: "INSUFFICIENT_RESOURCES",
 message: "Não há recursos suficientes",
  details: {
    required: { madeira: 1000, pedra: 500 },
    available: { madeira: 300, pedra: 200 }
  }
}
```

---

## WebSocket Events

### Server → Client

```javascript
// Recursos atualizados
socket.emit('resources:updated', {
  feudId, resources
});

// Construção completada
socket.emit('building:completed', {
  feudId, buildingId, building
});

// Pesquisa completada
socket.emit('research:completed', {
  feudId, techName, unlockedBuildings
});

// Erro
socket.emit('error:action', {
  message, code
});
```

### Client → Server

```javascript
// Conectar
socket.emit('user:connect', { userId, feudId });

// Disconnect
socket.emit('disconnect');

// Pode adicionar listeners para custom events
```

---

Esta é a base! Adaptar conforme necessário durante desenvolvimento.
