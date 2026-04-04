# 📊 SEMANA 2: CORE MODELS - PROGRESSO COMPLETO ✅

**Data:** 3 de Abril de 2026, 14:45 UTC  
**Fase:** Semana 2 (Core Models)  
**Status:** 🚀 **ESTRUTURA DE DADOS COMPLETA**

---

## ✅ Código Criado (100% Semana 2)

### 📁 Estrutura de Tabelas
```
✓ Semana 1: users, feuds, buildings
✓ Semana 2: research, cargos, laws, edicts, npcs, resource_history
```

### 🗄️ Migrations Criadas (6 novas)

```
✓ 004_create_research_table.js
  - id, feud_id, tech_name, level, status
  - research_start_time, research_end_time
  - Índices: feud_id, tech_name, status

✓ 005_create_cargos_table.js
  - id, feud_id, cargo_name, holder_name, is_npc
  - bonus_tipo, bonus_valor, active
  - Índices: feud_id, cargo_name, active

✓ 006_create_laws_table.js
  - id, feud_id, law_name, category, level_required
  - status (active/inactive), active_since
  - effect_multipllier, effect_description
  - Índices: feud_id, category, status

✓ 007_create_edicts_table.js
  - id, feud_id, edict_name, category, level_required
  - status, active_since, effect_multipllier
  - Índices: feud_id, category, status

✓ 008_create_npcs_table.js
  - id, feud_id, npc_type, name, description
  - level_required, cost_cobre_monthly, cost_pergaminhos_monthly
  - bonus_tipo, bonus_valor, hired, hired_at
  - Índices: feud_id, npc_type, hired

✓ 009_create_resource_history_table.js
  - id, feud_id, snapshot_at
  - madeira, pedra, ferro, comida, cobre, pergaminhos, cristais, minério_raro
  - Índices: feud_id, snapshot_at
```

### 📝 Models Implementados (7 arquivos)

```
✓ backend/src/models/Building.js      (150 linhas)
  - create(), findById(), findByFeudId(), findByFeudIdAndType()
  - upgrade(), delete()
  - calculateTotalProduction()
  - calculateTotalUpkeep()

✓ backend/src/models/Research.js      (140 linhas)
  - create(), findById(), findByFeudId(), findByFeudIdAndTechName()
  - findActiveByFeudId(), findCompletedByFeudId()
  - startResearch(), completeResearch(), upgradeResearch()
  - delete()

✓ backend/src/models/Cargo.js         (160 linhas)
  - create(), findById(), findByFeudId(), findByFeudIdAndCargoName()
  - findActiveByFeudId()
  - assignHolder(), removeHolder()
  - updateBonus(), calculateTotalBonus()
  - delete()

✓ backend/src/models/Law.js           (160 linhas)
  - create(), findById(), findByFeudId(), findByFeudIdAndLawName()
  - findActiveByFeudId(), findByFeudIdAndCategory()
  - activateLaw(), deactivateLaw()
  - countActiveByFeudAndCategory()
  - calculateTotalEffectMultiplier()
  - delete()

✓ backend/src/models/Edict.js         (160 linhas)
  - create(), findById(), findByFeudId(), findByFeudIdAndEdictName()
  - findActiveByFeudId(), findByFeudIdAndCategory()
  - activateEdict(), deactivateEdict()
  - countActiveByFeudAndCategory()
  - calculateTotalEffectMultiplier()
  - delete()

✓ backend/src/models/NPC.js           (170 linhas)
  - create(), findById(), findByFeudId()
  - findHiredByFeudId(), findAvailableByFeudId()
  - findByFeudIdAndType()
  - hire(), fire()
  - calculateMonthlyCost(), calculateTotalBonus()
  - delete()

✓ backend/src/models/ResourceHistory.js (200 linhas)
  - create(), findById(), findByFeudId()
  - findByFeudIdLast30Days(), findByFeudIdLastDays()
  - calculateGrowth(), calculateAverageProduction()
  - deleteOlderThan(), delete()
```

---

## 📊 Testes de Migration

```bash
$ npm run db:migrate

Output:
Using environment: development
Batch 2 run: 6 migrations

✓ All migrations executed successfully
```

**Total de tabelas no banco:**
- ✅ users
- ✅ feuds
- ✅ buildings
- ✅ research
- ✅ cargos
- ✅ laws
- ✅ edicts
- ✅ npcs
- ✅ resource_history

**Total: 9 tabelas com relacionamentos CASCADE**

---

## 🎯 Funcionalidades por Model

### Building
- Produção: Madeira, Pedra, Ferro, Comida, Cobre
- Manutenção: Custos diários por recurso
- Construção com timer (start/end times)
- Cálculos de produção e upkeep totais

### Research
- Árvore tecnológica com 5 níveis
- Status: complete ou in_progress
- Timers de pesquisa
- Bônus aplicáveis (pesquisa +20%, etc)

### Cargo (Positions)
- Especialistas: Ferreiro, Comandante, etc
- Atribuição de holders (jogador ou NPC)
- Bônus multiplicadores (1.0 = neutro, 1.15 = +15%)
- Cálculo de bônus totais por feudo

### Law
- Categorias: Econômica, Militar, Social, De Produção
- Status: active/inactive
- Slots limitados por nível (1→5)
- Efeitos multiplicadores acumuláveis

### Edict (Édito Regional)
- Similar a Laws
- Aplicáveis a regiões
- Slots limitados por nível (0→4)

### NPC
- Tipo: Ferreiro, pescador, etc
- Custo mensal em Cobre/Pergaminhos
- Status: hired/available
- Contribuem com bônus

### ResourceHistory
- Snapshot diário de recursos
- Histórico de 30 dias
- Cálculo de crescimento
- Taxa média de produção

---

## 🔗 Relacionamentos no Banco

```sql
feuds.id → buildings.feud_id (cascade delete)
feuds.id → research.feud_id (cascade delete)
feuds.id → cargos.feud_id (cascade delete)
feuds.id → laws.feud_id (cascade delete)
feuds.id → edicts.feud_id (cascade delete)
feuds.id → npcs.feud_id (cascade delete)
feuds.id → resource_history.feud_id (cascade delete)
```

---

## 📈 Estatísticas

| Item | Semana 1 | Semana 2 | Total |
|------|----------|----------|-------|
| Migrations | 3 | 6 | 9 |
| Models | 2 | 7 | 9 |
| Linhas Código | 500+ | 1200+ | 1700+ |
| Tabelás DB | 3 | 9 | 9 |
| Endpoints | 2 | 0 (prep) | 2 |
| **Status** | ✅ | ✅ | 🚀 |

---

## 🎮 Dados Prontos para Próxima Etapa

Semana 3 irá implementar:
- Sistema de produção automática de recursos (jobs)
- Atualização diária via WebSocket
- Cálculos de bônus (Cargo + Laws + NPCs)
- Dashboard com visualização de dados

---

## 💾 Comandos Úteis

```bash
# Rodar todas as migrations
npm run db:migrate

# Reverter última migration
npm run db:rollback

# Status do banco
npm run info

# Testar models
node -e "const Building = require('./src/models/Building'); console.log(Building)"
```

---

## ✨ Próximos Passos (Semana 3)

- [ ] Criar ResourceService (lógica de produção)
- [ ] Implementar job agendado (24h)
- [ ] WebSocket para real-time updates
- [ ] Dashboard backend com cálculos
- [ ] Tests unitários dos models

**Estimativa:** 35 horas
**Status:** 🔄 Em Fila
