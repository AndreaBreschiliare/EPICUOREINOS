# 🗄️ Schema do Banco de Dados

## Entidades Principais

### users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

### feuds
```sql
CREATE TABLE feuds (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  level INT DEFAULT 1 CHECK (level >= 1 AND level <= 5),
  culture VARCHAR(50) NOT NULL, -- baduran, drow, aiglanos, etc
  
  -- Recursos
  madeira INT DEFAULT 20000,
  pedra INT DEFAULT 10000,
  ferro INT DEFAULT 5000,
  comida INT DEFAULT 50000,
  cobre INT DEFAULT 5000,
  pergaminhos INT DEFAULT 0,
  cristais INT DEFAULT 0,
  minério_raro INT DEFAULT 0,
  
  -- Demográficos
  população INT DEFAULT 8,
  moral INT DEFAULT 50,
  
  -- Timestamps
  last_resource_update TIMESTAMP DEFAULT NOW(),
  level_up_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_feuds_user_id ON feuds(user_id);
CREATE INDEX idx_feuds_level ON feuds(level);
CREATE INDEX idx_feuds_culture ON feuds(culture);
```

### buildings
```sql
CREATE TABLE buildings (
  id SERIAL PRIMARY KEY,
  feud_id INT NOT NULL REFERENCES feuds(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- casa, fazenda, lenhador, minério, paliçada, etc
  level INT DEFAULT 1,
  status VARCHAR(20) DEFAULT 'complete', -- complete, construction
  
  -- Construção
  construction_start_time TIMESTAMP,
  construction_end_time TIMESTAMP,
  
  -- Manutenção diária
  upkeep_madeira INT DEFAULT 0,
  upkeep_pedra INT DEFAULT 0,
  upkeep_ferro INT DEFAULT 0,
  upkeep_comida INT DEFAULT 0,
  upkeep_cobre INT DEFAULT 0,
  
  -- Produção
  produção_madeira INT DEFAULT 0,
  produção_pedra INT DEFAULT 0,
  produção_ferro INT DEFAULT 0,
  produção_comida INT DEFAULT 0,
  produção_cobre INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_buildings_feud_id ON buildings(feud_id);
CREATE INDEX idx_buildings_type ON buildings(type);
CREATE INDEX idx_buildings_status ON buildings(status);
```

### research
```sql
CREATE TABLE research (
  id SERIAL PRIMARY KEY,
  feud_id INT NOT NULL REFERENCES feuds(id) ON DELETE CASCADE,
  tech_name VARCHAR(100) NOT NULL,
  level INT DEFAULT 1,
  status VARCHAR(20) DEFAULT 'complete', -- complete, in_progress
  
  -- Pesquisa
  research_start_time TIMESTAMP,
  research_end_time TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_research_feud_id ON research(feud_id);
CREATE INDEX idx_research_tech_name ON research(tech_name);
CREATE INDEX idx_research_status ON research(status);
```

### cargos (Especialistas)
```sql
CREATE TABLE cargos (
  id SERIAL PRIMARY KEY,
  feud_id INT NOT NULL REFERENCES feuds(id) ON DELETE CASCADE,
  cargo_name VARCHAR(100) NOT NULL, -- ferreiro, líder, comandante, etc
  holder_name VARCHAR(100), -- Nome do especialista (pode ser NPC)
  is_npc BOOLEAN DEFAULT FALSE,
  
  -- Efeito dos bônus
  bonus_tipo VARCHAR(50), -- produção, defesa, etc
  bonus_valor DECIMAL(5, 2), -- 1.15 = +15%
  
  active BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cargos_feud_id ON cargos(feud_id);
CREATE INDEX idx_cargos_cargo_name ON cargos(cargo_name);
CREATE INDEX idx_cargos_active ON cargos(active);
```

### laws (Leis/Decretos)
```sql
CREATE TABLE laws (
  id SERIAL PRIMARY KEY,
  feud_id INT NOT NULL REFERENCES feuds(id) ON DELETE CASCADE,
  law_name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL, -- économica, militar, social, de_produção
  level_required INT NOT NULL,
  
  -- Estado
  status VARCHAR(20) DEFAULT 'inactive', -- active, inactive
  active_since TIMESTAMP,
  
  -- Efeitos
  bonus_tipo VARCHAR(50),
  bonus_value DECIMAL(5, 2),
  penalty_tipo VARCHAR(50),
  penalty_value DECIMAL(5, 2),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_laws_feud_id ON laws(feud_id);
CREATE INDEX idx_laws_status ON laws(status);
CREATE INDEX idx_laws_level_required ON laws(level_required);
```

### edicts (Éditos Regionais)
```sql
CREATE TABLE edicts (
  id SERIAL PRIMARY KEY,
  feud_id INT NOT NULL REFERENCES feuds(id) ON DELETE CASCADE,
  edict_name VARCHAR(100) NOT NULL,
  level_required INT NOT NULL,
  
  -- Estado
  status VARCHAR(20) DEFAULT 'inactive',
  active_since TIMESTAMP,
  
  -- Descrição
  description TEXT,
  rp_effect TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_edicts_feud_id ON edicts(feud_id);
CREATE INDEX idx_edicts_status ON edicts(status);
```

### cultural_traits (Traços Culturais)
```sql
CREATE TABLE cultural_traits (
  id SERIAL PRIMARY KEY,
  feud_id INT NOT NULL UNIQUE REFERENCES feuds(id) ON DELETE CASCADE,
  culture VARCHAR(50) NOT NULL,
  level_1_trait VARCHAR(100) NOT NULL, -- Traço inato Nv. 1
  level_2_choice VARCHAR(100), -- Escolha do Nv. 2
  level_3_doctrine VARCHAR(100), -- Doutrina permanente do Nv. 3
  level_4_doctrine VARCHAR(100), -- Doutrina do Nv. 4
  level_5_legacy VARCHAR(100), -- Legado do Nv. 5
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_traits_feud_id ON cultural_traits(feud_id);
CREATE INDEX idx_traits_culture ON cultural_traits(culture);
```

### npcs (Personagens Contratáveis)
```sql
CREATE TABLE npcs (
  id SERIAL PRIMARY KEY,
  feud_id INT NOT NULL REFERENCES feuds(id) ON DELETE CASCADE,
  npc_type VARCHAR(50) NOT NULL, -- miliciano, mercador, arauto, etc
  npc_name VARCHAR(100) NOT NULL,
  level INT DEFAULT 1,
  
  -- Manutenção
  upkeep_cobre INT DEFAULT 0,
  upkeep_comida INT DEFAULT 0,
  upkeep_cristais INT DEFAULT 0,
  
  -- Status
  active BOOLEAN DEFAULT TRUE,
  hired_at TIMESTAMP,
  salary_paid_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_npcs_feud_id ON npcs(feud_id);
CREATE INDEX idx_npcs_npc_type ON npcs(npc_type);
```

### level_progression (Requisitos de Ascensão)
```sql
CREATE TABLE level_progression (
  feud_id INT NOT NULL PRIMARY KEY REFERENCES feuds(id) ON DELETE CASCADE,
  
  -- Nv. 1 → 2 Progress
  level_2_infrastructure BOOLEAN DEFAULT FALSE,
  level_2_population BOOLEAN DEFAULT FALSE,
  level_2_knowledge BOOLEAN DEFAULT FALSE,
  level_2_tribute_paid BOOLEAN DEFAULT FALSE,
  
  -- Nv. 2 → 3 Progress
  level_3_infrastructure BOOLEAN DEFAULT FALSE,
  level_3_stability BOOLEAN DEFAULT FALSE,
  level_3_knowledge BOOLEAN DEFAULT FALSE,
  level_3_tribute_paid BOOLEAN DEFAULT FALSE,
  
  -- Etc para níveis 4 e 5
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_progression_feud_id ON level_progression(feud_id);
```

## Relações

```
users (1) ──→ (many) feuds
    ↓
    └─→ (many) cargos
    └─→ (many) buildings
    └─→ (many) research
    └─→ (many) laws
    └─→ (many) edicts
    └─→ (1) cultural_traits
    └─→ (many) npcs
    └─→ (1) level_progression
```

## Índices

```sql
-- Performance crítica
CREATE INDEX idx_feuds_user_id ON feuds(user_id);
CREATE INDEX idx_buildings_feud_id ON buildings(feud_id);
CREATE INDEX idx_research_feud_id ON research(feud_id);

-- Queries frequentes
CREATE INDEX idx_buildings_status ON buildings(status);
CREATE INDEX idx_research_status ON research(status);
CREATE INDEX idx_cargos_active ON cargos(active);
CREATE INDEX idx_laws_status ON laws(status);

-- Ordering/Filtering
CREATE INDEX idx_feuds_level ON feuds(level);
CREATE INDEX idx_feuds_culture ON feuds(culture);
```

## Valores Padrão

### Recursos Iniciais (Nv. 1)
- Madeira: 20.000
- Pedra: 10.000
- Ferro: 5.000
- Comida: 50.000
- Cobre: 5.000

### Trilítos Iniciais
- 1 Casa
- 2 Estruturas de Produção (à escolher)
- 1 Paliçada

## Migrações

Estrutura de migrações:
```
migrations/
├── 001_create_users.js
├── 002_create_feuds.js
├── 003_create_buildings.js
├── 004_create_research.js
├── 005_create_cargos.js
├── 006_create_laws.js
├── 007_create_edicts.js
├── 008_create_cultural_traits.js
├── 009_create_npcs.js
└── 010_create_level_progression.js
```
