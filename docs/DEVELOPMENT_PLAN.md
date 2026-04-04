# 📅 Plano de Desenvolvimento

## Cronograma: 8-10 Semanas

### Semana 1: Setup & Scaffolding
**Objetivo:** Estrutura base funcional

- [ ] Setup PostgreSQL local
- [ ] Criar projeto Node.js + Express
- [ ] Criar projeto React
- [ ] Migrations iniciais
- [ ] Modelo User básico
- [ ] Autenticação JWT
- [ ] Login/Register page

**Deliverable:** Usuários conseguem se registrar e fazer login

**Estimativa:** 40 horas

---

### Semana 2: Core Models
**Objetivo:** Estrutura de dados completa

- [ ] Modelo Feud
- [ ] Modelo Building
- [ ] Modelo Research
- [ ] Modelo Cargo
- [ ] Modelo Law
- [ ] Modelo NPC
- [ ] Relações no banco

**Código:**
```javascript
// models/Feud.js - Uma classe base para cada modelo
class Feud {
  static async create(data) { /* ... */ }
  static async findById(id) { /* ... */ }
  static async findByUserId(userId) { /* ... */ }
  static async update(id, data) { /* ... */ }
}
```

**Deliverable:** Schema completo no banco, modelos funcionais

**Estimativa:** 30 horas

---

### Semana 3: Resource System
**Objetivo:** Produção automática de recursos

- [ ] Job agendado para produção (24h)
- [ ] Cálculos de populati
- [ ] Sistema de multiplicadores
- [ ] Dashboard básico
- [ ] Display de recursos em tempo real

**Código:**
```javascript
// services/resourceService.js
async function produceResources(feudId) {
  // 1. Fetch feud
  // 2. Calculate population
  // 3. For each building:
  //    - Apply building production
  //    - Apply cargo bonuses
  //    - Apply law effects
  // 4. Update database
  // 5. Broadcast via WebSocket
}
```

**Testes:**
```javascript
describe('Resource Production', () => {
  it('should calculate production correctly', async () => {
    // ...
  });
});
```

**Deliverable:** Recursos aumentam a cada 24h, exibição em tempo real

**Estimativa:** 35 horas

---

### Semana 4: Building System
**Objetivo:** Construir e fazer upgrade de estruturas

- [ ] API endpoints para construções
- [ ] UI para listar/construir
- [ ] Tempo de construção real
- [ ] Validations (recursos, pré-requisitos)
- [ ] Modal de construção
- [ ] Progress bar

**Código:**
```javascript
// controllers/buildingController.js
async function startConstruction(req, res) {
  const { feudId, buildingType } = req.body;
  
  // Validate
  // Deduct resources
  // Create building record
  // Schedule completion
  // Broadcast
}
```

**Testes:**
```javascript
describe('Building Construction', () => {
  it('should fail if insufficient resources', () => {});
  it('should complete after duration', () => {});
});
```

**Deliverable:** Usuários conseguem construir e fazer upgrade

**Estimativa:** 40 horas

---

### Semana 5: Research System
**Objetivo:** Árvore tecnológica funcional

- [ ] Components para Research Tree
- [ ] API endpoints
- [ ] Tempo de pesquisa
- [ ] Desbloqueios de construções/cargos
- [ ] Progress tracking
- [ ] Visualization (tree, cards)

**Código:**
```javascript
// RESEARCH_TREE.js - Data structure
const RESEARCH_TREE = {
  level: {
    1: {
      Production: [
        { name: 'Técnicas de Arado', cost: { cobre: 500 }, time: 86400 },
        // ...
      ],
    },
  },
};
```

**Deliverable:** Pesquisa funcional, árvore visuais

**Estimativa:** 35 horas

---

### Semana 6: Advanced Features
**Objetivo:** Cargos, Leis e Éditos

- [ ] Sistema de Cargos (assign, bônus)
- [ ] Sistema de Leis (ativar/desativar)
- [ ] Sistema de Éditos
- [ ] Traços Culturais
- [ ] NPCs contratáveis
- [ ] Balanceamento

**Código:**
```javascript
// multipliers.js - CalculadorGeral
function calculateProduction(building, cargo, law) {
  let production = building.baseProduction;
  
  if (cargo) {
    production *= cargo.bonus;
  }
  
  if (law) {
    production *= law.effect;
  }
  
  return production;
}
```

**Testes:** Balanceamento e edge cases

**Deliverable:** Todos os sistemas operacionais

**Estimativa:** 45 horas

---

### Semana 7: Level Progression
**Objetivo:** Sistema de ascensão de níveis

- [ ] Requisitos por nível
- [ ] Validações de ascensão
- [ ] Tributos numerários
- [ ] UI para level-up
- [ ] Recompensas (terreno, mecânicas)
- [ ] Limites por nível

**Código:**
```javascript
// LEVEL_REQUIREMENTS.js
const LEVEL_REQUIREMENTS = {
  2: {
    infrastructure: ['paliçada', 'casa', '2x produção'],
    social: { minPopulation: 8, days: 3 },
    knowledge: { researchCount: 2 },
    tribute: { madeira: 2500, pedra: 1500 },
  },
};
```

**Deliverable:** Sistema de ascensão completo e balanceado

**Estimativa:** 30 horas

---

### Semana 8: Multiplayer & Polish
**Objetivo:** Integração multiplayer inicial

- [ ] WebSocket para updates
- [ ] Chat básico (opcional)
- [ ] Leaderboard
- [ ] Reputação básica
- [ ] Validações finais
- [ ] Otimizações performance

**Código:**
```javascript
// websocket/gameEvents.js
socket.on('resource:request', (action) => {
  // Validate
  // Execute
  // Emit to all connected users
  io.emit('game:update', data);
});
```

**Deliverable:** Sistema multiplayer básico funcional

**Estimativa:** 40 horas

---

### Semana 9: Testing & Documentation
**Objetivo:** QA e documentação completa

- [ ] Testes unitários (50%+ coverage)
- [ ] Testes de integração
- [ ] Documentação da API
- [ ] Deploy guide
- [ ] Bug fixes
- [ ] Performance tuning

**Testes:**
```bash
npm test                    # Todos os testes
npm run test:coverage      # Coverage report
npm run test:integration   # Only integration tests
```

**Deliverable:** Código testado, documentado e pronto para deploy

**Estimativa:** 35 horas

---

### Semana 10: Deploy & Launch
**Objetivo:** Sistema em produção

- [ ] Setup servidor (AWS, Heroku, Digital Ocean)
- [ ] Deploy PostgreSQL
- [ ] SSL/HTTPS
- [ ] Monitoring
- [ ] Backup strategy
- [ ] Load testing
- [ ] Launch!

**Deliverable:** Jogo ao vivo para 50 players

**Estimativa:** 25 horas

---

## Totalizando

- **Esforço Total:** ~350 horas
- **Equipe recomendada:** 2-3 desenvolvedores
- **Timeline realista:** 8-10 semanas (full-time)

---

## Fases Pós-Launch

### Fase 11: Combate (Semana 11-12)
- Sistema de ataque/defesa
- Unidades militares
- Caravanas
- Strategy gameplay

### Fase 12: Diplomacia (Semana 13-14)
- Alianças
- Mapa político
- Tributos
- Vassalagem

### Fase 13: Endgame (Semana 15+)
- Evento supremo
- Construção de legado
- Achievements
- Seasonal resets

---

## Recursos Necessários

### Servidor
- VPS com 2 CPU, 4GB RAM (start)
- PostgreSQL 13+
- Node.js 18+

### Custo Mensal (estimado)
- VPS: $20
- Database: $10
- Backup: $5
- DNS: $0-5
- **Total:** ~$35-40/mês

### Desenvolvimento
- Editor: VSCode (free)
- Git: GitHub (free para público)
- CI/CD: GitHub Actions (free)
- Design: Figma (free tier)

---

## Métricas de Sucesso

### Semana 1-2
- [ ] Usuários conseguem logar
- [ ] Feudo é criado com sucesso

### Semana 3-4
- [ ] Recursos aumentam automático
- [ ] Construções são possíveis

### Semana 5-6
- [ ] Pesquisa desbloqueiastructuras
- [ ] Cargos dão bônus reais

### Semana 7-8
- [ ] Ascensão de nível funciona
- [ ] Multiplayer básico

### Semana 9-10
- [ ] 0 game-breaking bugs
- [ ] 95%+ uptime em testing
- [ ] Todos os sistemas balanceados

---

## Roadmap Pós-Launch

**Mês 1-3:**
- Combate multiplayer
- Diplomacia
- Events/Tournaments

**Mês 4-6:**
- Seasonal resets
- New cultures
- Trading systems

**Mês 7+:**
- Mobile app
- Expansão de mapa
- Social features
