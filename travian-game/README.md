# 🏰 TravianUO - Web Strategy Game

Um jogo de estratégia web baseado em Travian, permitindo gerenciamento de feudos, recursos, construções, pesquisa e política.

## 📋 Visão Geral

**Descrição:** Jogo browser-based para até 50 jogadores simultâneos onde cada um gerencia seu próprio feudo dentro de um reino medieval, com sistemas de produção, construção, pesquisa, leis, éditos e possível expansão futuro para combate multiplayer.

**Stack Tecnológico:**
- Backend: Node.js + Express
- Frontend: React + Material-UI
- Banco: PostgreSQL
- Real-time: Socket.IO
- Autenticação: JWT

**Arquitetura:**
```
travian-game/
├── backend/           # API REST + WebSocket
├── frontend/          # React SPA
├── docs/              # Documentação
└── README.md
```

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- PostgreSQL 13+
- npm ou yarn

### Instalação

```bash
# 1. Clone e acesse o projeto
cd travian-game

# 2. Backend
cd backend
npm install
cp .env.example .env
npm run db:migrate
npm run dev

# 3. Frontend (em outro terminal)
cd frontend
npm install
npm start
```

---

## 📊 Arquitetura do Sistema

### Backend: `/backend`

```
backend/
├── src/
│   ├── config/          # Configurações (DB, JWT, etc)
│   ├── models/          # Modelos de dados (User, Feud, Building, etc)
│   ├── routes/          # Rotas da API
│   ├── controllers/      # Lógica de negócio
│   ├── services/        # Serviços reutilizáveis
│   ├── middleware/      # Autenticação, validação
│   ├── jobs/            # Tarefas agendadas (produção de recursos)
│   ├── websocket/       # Socket.IO handlers
│   └── app.js           # Express app
├── migrations/          # Migrações do banco
├── seeds/               # Dados iniciais
├── .env.example         # Variáveis de ambiente (modelo)
├── package.json
└── README.md
```

### Frontend: `/frontend`

```
frontend/
├── public/
├── src/
│   ├── components/      # Componentes React reutilizáveis
│   ├── pages/           # Páginas (Dashboard, Feud, Research, etc)
│   ├── services/        # Chamadas à API
│   ├── hooks/           # Custom hooks
│   ├── context/         # Context API para estado global
│   ├── styles/          # CSS/SCSS
│   ├── App.jsx
│   └── index.jsx
├── package.json
└── README.md
```

---

## 🎮 Mecânicas Principais

### 1. Gestão de Recursos
- Produção passiva automática a cada 24 horas
- 5 recursos: Madeira, Pedra, Ferro, Comida, Cobre
- Sistema populacional que consome reursos

### 2. Construções
- 5 níveis de evoluções
- Tempos de construção variáveis
- Upkeep (manutenção) diária
- Prerequisitos tecnológicos

### 3. Pesquisa
- Árvore tecnológica de 5 níveis
- 30+ ramos de pesquisa
- Desbloqueio de construções e cargos
- Tempo de pesquisa baseado em nível

### 4. Cargos Especializados
- 25+ cargos diferentes (Férreiro, Comandante, Espião, etc)
- Bônus mecânicos variados
- Limites por tipo de cargo

### 5. Leis e Éditos
- Sistema de decretos (até 5 nos Níveis 5)
- Sistema de éditos regionais (até 4 nos Nível 5)
- Penalidades e bônus balanceados

### 6. Ascensão de Níveis
- 5 níveis de nobreza (Senhor → Duque)
- Requisitos escalonados de infraestrutura
- Tributos monumentais para ascensão
- Recompensas progressivas (terreno, mecânicas)

---

## 📈 Fases do Desenvolvimento

### Fase 1: MVP (Semanas 1-2)
- [x] Setup básico Node.js + React + PostgreSQL
- [ ] Sistema de autenticação (registro/login)
- [ ] Modelo de usuário e feudo
- [ ] Dashboard básico
- [ ] Sistema de produção de recursos (mockado)
- [ ] Gestão de construções (UI apenas)

### Fase 2: Core Mechanics (Semanas 3-4)
- [ ] API REST completa
- [ ] Sistema de produção real (jobs agendados)
- [ ] Sistema de construções (tempo real)
- [ ] Sistema de pesquisa
- [ ] Cargos e especialistas
- [ ] WebSocket para updates em tempo real

### Fase 3: Advanced Systems (Semanas 5-6)
- [ ] Leis e EdDitos
- [ ] Sistema de ascensão de níveis
- [ ] Traços culturais
- [ ] NPCs contratáveis
- [ ] Validações e balanceamento

### Fase 4: Multiplayer (Semanas 7-8)
- [ ] Sistema de caravanas/comércio
- [ ] Aliança/Diplomacia básica
- [ ] Sistema de reputação
- [ ] Leaderboard
- [ ] Chat/Comunicação

### Fase 5: Polish & Deploy (Semana 9+)
- [ ] Testes automatizados
- [ ] Otimização performance
- [ ] Documentação final
- [ ] Deploy em servidor

---

## 🗄️ Modelos de Dados Principais

### User
```javascript
{
  id, username, email, password_hash,
  created_at, updated_at
}
```

### Feud
```javascript
{
  id, user_id, name, level (1-5),
  resources: {
    madeira, pedra, ferro, comida, cobre,
    pergaminhos, cristais, minério_raro
  },
  population, morale,
  last_resource_update,
  created_at, updated_at
}
```

### Building
```javascript
{
  id, feud_id, type (casa, fazenda, lenhador, etc),
  level, status (completo, em_construção),
  construction_time_remaining,
  upkeep_daily,
  created_at, updated_at
}
```

### Research
```javascript
{
  id, feud_id, tech_name, level,
  status (completo, em_pesquisa),
  research_time_remaining,
  created_at, updated_at
}
```

### Cargo
```javascript
{
  id, feud_id, cargo_name,
  holder_name (se nomeado), bônus
}
```

### Law
```javascript
{
  id, feud_id, law_name,
  status (ativo, inativo),
  bonus_effects, penalty_effects
}
```

---

## 🔗 API Endpoints Principais

### Autenticação
- `POST /auth/register` - Registrar novo jogador
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token

### Feudo
- `GET /feud/me` - Dados do feudo do jogador
- `POST /feud/create` - Criar novo feudo
- `GET /feud/:id` - Ver feudo (público)
- `PUT /feud/:id` - Atualizar feudo

### Construções
- `GET /feud/:id/buildings` - Listar construções
- `POST /feud/:id/buildings` - Iniciar construção
- `PUT /feud/:id/buildings/:id` - Upgrade construção
- `DELETE /feud/:id/buildings/:id` - Demolir

### Pesquisa
- `GET /feud/:id/research` - Pesquisas disponíveis
- `POST /feud/:id/research/start` - Iniciar pesquisa
- `GET /feud/:id/research/progress` - Progresso

### Recursos
- `GET /feud/:id/resources` - Recursos atuais
- `POST /feud/:id/resources/harvest` - Colher manuais

### Cargos
- `GET /feud/:id/cargos` - Cargos disponíveis
- `POST /feud/:id/cargos/:name/assign` - Atribuir cargo

### Leis
- `GET /feud/:id/laws` - Leis disponíveis
- `POST /feud/:id/laws/:name/activate` - Ativar lei
- `POST /feud/:id/laws/:name/deactivate` - Desativar lei

---

## 🎨 Componentes React Principais

### Pages
- `Dashboard` - Visão geral do feudo
- `Buildings` - Gestão de construções
- `Research` - Árvore de pesquisa
- `Resources` - Mapa de recursos
- `Cargos` - Especialistas e bônus
- `Laws` - Leis ativas/disponíveis
- `Leaderboard` - Rankings dos feudos

### Components
- `ResourceDisplay` - Exibição de recursos
- `BuildingCard` - Info de construção
- `ProgressBar` - Barra de progresso
- `CultureSelector` - Escolha de cultura
- `LevelUpModal` - Ascensão de nível

---

## ⚙️ Sistemas de Game Loop

### Tick System (Produção de Recursos)
```
A cada 24 horas:
1. Calcular população efetiva
2. Processsar cada construção (multiplicador de produção)
3. Aplicar bônus de cargos
4. Aplicar efeitos de leis
5. Gerar recursos
6. Atualizar banco de dados
7. Notificar jogadores (WebSocket)
```

### Construção
```
Quando iniciar construção:
1. Validar recursos
2. Armazenar tempo de conclusão
3. Subtrair recursos
4. Quando completado:
   - Adicionar efeito da construção
   - Gerar upgrade para próximo nível
```

### Pesquisa
```
Quando iniciar:
1. Validar pré-requisitos
2. Armazenar tempo de conclusão
3. Quando completado:
   - Desbloquear construções/cargos
   - Aplicar bônus de tecnologia
```

---

## 🔐 Segurança

- JWT para autenticação
- Validação de input em todas as rotas
- Rate limiting
- HTTPS em produção
- Senha com bcrypt
- CORS configurado
- Validação servidor-side de todas as ações

---

## 📊 Performance para 50 Players

### Otimizações
- Database indexing em colunas frequentes
- Cache Redis para dados estáticos
- Lazy loading de componentes React
- Compressão gzip
- Minificação de assets
- Connection pooling no PostgreSQL

### Escalabilidade Futura
- Microserviços (Auth, Game, Chat)
- Message queue (Redis/RabbitMQ)
- CDN para assets
- Load balancing

---

## 📝 Próximos Passos

1. **Criar estrutura backend**
   - Setup Express + PostgreSQL
   - Migrations iniciais
   - Modelos de dados

2. **Implementar autenticação**
   - JWT + bcrypt
   - Endpoints de registro/login

3. **Criar UI React básica**
   - Dashboard
   - Gerenciador de construções

4. **Sistema de produção**
   - Jobs agendados
   - Cálculos de recursos

Quer que eu comece criando os arquivos específicos? Qual módulo você quer começar?

---

**Desenvolvido com ❤️ em 2026**
