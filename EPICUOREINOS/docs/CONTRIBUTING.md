# 🤝 Guia de Contribuição

## Para Desenvolvedores

### Setup Local

1. **Clone o repositório**
```bash
git clone [repo-url]
cd travian-game
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Configure .env com suas credenciais
npm run db:migrate
npm run dev
```

3. **Setup Frontend** (outro terminal)
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

4. **Verificar se está tudo funcionando**
- Backend: http://localhost:5000/health
- Frontend: http://localhost:3000

### Estrutura de Pastas

#### Backend

```
backend/src/
├── config/
│   ├── database.js         # Connection pool
│   ├── jwt.js              # Token config
│   └── constants.js        # Game data
├── models/                 # Database models
├── routes/                 # API routes
├── controllers/            # Request handlers
├── services/               # Business logic
├── middleware/             # Auth, validation
├── jobs/                   # Scheduled tasks
├── utils/                  # Helper functions
├── websocket/              # Socket.IO
└── app.js                  # Express app
```

#### Frontend

```
frontend/src/
├── components/             # Reusable React components
├── pages/                  # Route pages
├── services/               # API calls
├── hooks/                  # Custom hooks
├── store/                  # Zustand stores
├── utils/                  # Helpers
├── styles/                 # CSS/SCSS
└── App.jsx
```

### Convenções de Código

#### JavaScript/Node.js

```javascript
// Imports no topo
const express = require('express');
const { validateInput } = require('../middleware/validation');

// Classes/Functions
class UserService {
  static async findById(id) {
    // ...
  }
}

// Error handling
try {
  // ...
} catch (error) {
  logger.error('Operation failed', { error, context: 'findUser' });
  throw new ApiError(500, 'Database error');
}

// Exports
module.exports = UserService;
```

#### React

```javascript
// Imports
import React, { useState, useEffect } from 'react';
import { Box, Card, Typography } from '@mui/material';

// Component
function BuildingCard({ building, onBuild }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load data
  }, [buildingId]);

  const handleBuild = async () => {
    setLoading(true);
    try {
      // ...
    } catch (error) {
      // error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Typography>{building.name}</Typography>
      {/* JSX */}
    </Card>
  );
}

export default BuildingCard;
```

### Naming Conventions

- **Variables:** camelCase
- **Functions:** camelCase
- **Classes:** PascalCase
- **Constants:** UPPER_SNAKE_CASE
- **Files:** kebab-case.js ou PascalCase.jsx
- **Folders:** kebab-case/

### Commit Messages

Usar formato Conventional Commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Tipos:
- `feat:` Nova funcionalidade
- `fix:` Bug fix
- `docs:` Mudanças em documentação
- `style:` Formatação, sem mudanças lógicas
- `refactor:` Refatoração de código
- `perf:` Melhorias de performance
- `test:` Adicionar/atualizar testes
- `chore:` Build, deps, config

Exemplos:
```
feat(buildings): add construction time validation

fix(auth): correctly hash password before storage

docs(api): update endpoint documentation

refactor(resources): extract calculation logic
```

### Pull Requests

1. **Create branch**
```bash
git checkout -b feat/feature-name
```

2. **Commit changes**
```bash
git add .
git commit -m "feat(scope): description"
```

3. **Push**
```bash
git push origin feat/feature-name
```

4. **Create Pull Request**
   - Descrever mudanças
   - Listar testes
   - Mencionar issues relacionadas

### Testing

#### Backend

```javascript
// tests/services/resourceService.test.js
describe('ResourceService', () => {
  beforeEach(() => {
    // Setup
  });

  it('should calculate production with bonuses', () => {
    // Arrange
    const feud = { population: 10 };
    const building = { production: 100 };
    const cargo = { bonus: 1.2 };

    // Act
    const result = calculateProduction(feud, building, cargo);

    // Assert
    expect(result).toBe(120);
  });

  afterEach(() => {
    // Cleanup
  });
});
```

#### Frontend

```javascript
// src/components/__tests__/ResourceDisplay.test.jsx
import { render, screen } from '@testing-library/react';
import ResourceDisplay from '../ResourceDisplay';

describe('ResourceDisplay', () => {
  it('should display resources correctly', () => {
    render(<ResourceDisplay madeira={1000} pedra={500} />);
    
    expect(screen.getByText(/1000/)).toBeInTheDocument();
    expect(screen.getByText(/500/)).toBeInTheDocument();
  });
});
```

### Code Review Checklist

- [ ] Código segue convenções do projeto
- [ ] Testes incluídos e passando
- [ ] Documentação atualizada
- [ ] Sem console.log/debugger
- [ ] Performance considerada
- [ ] Sem hardcoded values/secrets
- [ ] Tratamento de erros apropriado
- [ ] Input validation

### Debugging

#### Backend

```javascript
// Usar logger em vez de console.log
const logger = require('./utils/logger');

logger.info('Operation started', { feudId, buildingType });
logger.error('Operation failed', { error, context: 'buildBuilding' });

// Debugger
node inspect src/app.js
// ou com nodemon
node --inspect node_modules/.bin/nodemon src/app.js
```

#### Frontend

```javascript
// React DevTools Chrome extension
// Redux DevTools (quando adicionado)

// Conditional logging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info');
}
```

### Performance Tips

#### Backend
- Use database indexes
- Implement caching
- Batch queries when possible
- Limit query results

#### Frontend
- Use React.memo() para componentes pesados
- Code splitting com React.lazy()
- LazyLoad images
- Minimize re-renders

### Documentation

#### Código
```javascript
/**
 * Calculates feud production for a given building
 * @param {Feud} feud - The feud object
 * @param {Building} building - The building object
 * @param {Array<Cargo>} cargos - Active cargos with bonuses
 * @returns {Object} Production breakdown by resource
 */
function calculateProduction(feud, building, cargos) {
  // ...
}
```

#### README
- Descrever o que faz
- Como setup
- Como usar
- Exemplos
- Troubleshooting

### Common Issues

**Issue:** Banco não conecta
**Solução:**
```bash
# Verificar se PostgreSQL está rodando
psql -U postgres
# Criar database
createdb travian_game
```

**Issue:** Conflito de porta 5000
**Solução:**
```bash
# Encontrar processo
lsof -i :5000
# Matar processo
kill -9 <PID>
```

**Issue:** Node modules corrompido
**Solução:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Deploy Checklist

- [ ] Testes passando (backend e frontend)
- [ ] Documentação atualizada
- [ ] .env variables configuradas
- [ ] Database migrations rodadas
- [ ] Build frontend OK
- [ ] No console errors/warnings
- [ ] Performance metrics checked
- [ ] Security review completed

---

## Perguntas?

Abra uma issue ou entre em contato com o time!
