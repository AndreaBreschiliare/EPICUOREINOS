# 📁 Estrutura do Projeto - EPICUOREINOS

## Hierarquia Organizada

```
EPICUOREINOS/
│
├── 🎮 CÓDIGO DO PROJETO
│   ├── backend/              # API REST + WebSocket (Node.js + Express)
│   ├── frontend/             # Interface (React + Vite)
│   └── docs/                 # Documentação técnica
│
├── 📊 DADOS
│   └── data/                 # Arquivos CSV com informações do jogo
│       ├── cargos.csv
│       ├── construcoes por nivel.csv
│       ├── npcs.csv
│       └── ... (13 arquivos de dados)
│
├── 🐳 CONFIGURAÇÃO
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── .env.example
│   └── railway.json
│
├── 📋 DOCUMENTAÇÃO
│   ├── README.md              # Visão geral do projeto
│   ├── DEPLOY_GUIDE.md
│   ├── GITHUB_PUSH_GUIDE.md
│   ├── GUIA_COMPLETO_SISTEMA_FEUDOS.md
│   └── ... (outros guias)
│
└── .git/                      # Repositório Git
```

## O Que Mudou

| Antes | Depois |
|-------|--------|
| `EPICUOREINOS/EPICUOREINOS/backend` | `backend/` |
| `EPICUOREINOS/EPICUOREINOS/frontend` | `frontend/` |
| `EPICUOREINOS/EPICUOREINOS/docs` | `docs/` |
| CSVs espalhados na raiz | `data/` |
| `frontend/` vazio | ❌ Removido |
| `EPICUOREINOS/EPICUOREINOS/` | ❌ Removido |

## Como Usar

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker
```bash
docker-compose up
```

## Próximos Passos

- [ ] Revisar `.env.example` e criar `.env`
- [ ] Executar migrações do banco de dados
- [ ] Testar backend + frontend
- [ ] Verificar variáveis de ambiente

---

**Data da reorganização:** 2026-04-04
