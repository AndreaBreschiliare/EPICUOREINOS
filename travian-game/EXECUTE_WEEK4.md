# 🏗️ EXECUTE WEEK 4: BUILDING SYSTEM

## 📋 Checklist de Verificação

### Pré-requisitos
- [ ] PostgreSQL rodando
- [ ] Backend node modules instalados
- [ ] `.env` configurado com DATABASE_URL

### Passos para Testar

#### 1️⃣ Inicia o Servidor
```bash
cd backend
npm run dev
```

**Esperado:**
```
✅ Server running on port 3000
✅ Database connection successful
✅ Production scheduler started
✅ 24-hour production cycle configured (dev: 5 minutes)
```

---

#### 2️⃣ Registra um Usuário (Terminal/Curl)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@game.com",
    "password": "senha123"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": 1,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### 3️⃣ Cria um Feudo

```bash
TOKEN="seu_token_aqui"

curl -X POST http://localhost:3000/api/feud \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Meu Feudo",
    "culture": "germânica"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "feud": {
    "id": 1,
    "name": "Meu Feudo",
    "user_id": 1,
    "level": 1,
    "resources": {
      "madeira": 2000,
      "pedra": 2000,
      "comida": 4000,
      "ferro": 500,
      "pergaminho": 250
    }
  }
}
```

**Salvar o `feud_id` = 1 e `token`**

---

#### 4️⃣ Vê Edifícios Disponíveis para Construir

```bash
curl http://localhost:3000/api/feud/1/buildings/available \
  -H "Authorization: Bearer $TOKEN"
```

**Resposta:**
```json
{
  "success": true,
  "availableBuildings": [
    {
      "type": "casa",
      "nextLevel": 1,
      "cost": { "madeira": 50, "pedra": 30, ... },
      "productionNivel1": { "populacao": 8 },
      "upkeep": { "madeira": 15 },
      "constructionTime": 60,
      "canBuild": true,
      "reason": null
    },
    {
      "type": "fazenda",
      "nextLevel": 1,
      "cost": { "madeira": 60, "pedra": 20 },
      "productionNivel1": { "comida": 100 },
      "upkeep": { "madeira": 20 },
      "constructionTime": 90,
      "canBuild": true,
      "reason": null
    },
    ...
  ]
}
```

---

#### 5️⃣ Inicia uma Construção (Casa)

```bash
curl -X POST http://localhost:3000/api/feud/1/buildings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "type": "casa", "level": 1 }'
```

**Resposta:**
```json
{
  "success": true,
  "building": {
    "id": 101,
    "feud_id": 1,
    "type": "casa",
    "level": 1,
    "status": "construction",
    "construction_end_time": "2026-04-03T16:00:60Z",
    "created_at": "2026-04-03T16:00:00Z"
  },
  "resourcesSubtracted": {
    "madeira": 50,
    "pedra": 30
  },
  "remainingResources": {
    "madeira": 1950,
    "pedra": 1970,
    ...
  }
}
```

---

#### 6️⃣ Lista Edifícios do Feudo

```bash
curl http://localhost:3000/api/feud/1/buildings \
  -H "Authorization: Bearer $TOKEN"
```

**Resposta:**
```json
{
  "success": true,
  "buildings": [
    {
      "id": 101,
      "type": "casa",
      "level": 1,
      "status": "construction",
      "construction_end_time": "2026-04-03T16:00:60Z",
      "expected_production": { "populacao": 8 }
    }
  ]
}
```

---

#### 7️⃣ Aguarda Construção Completar

**Em desenvolvimento:** 60 segundos = 1 minuto

```bash
sleep 65  # Aguarda um pouco mais

# Depois checa novamente
curl http://localhost:3000/api/feud/1/buildings \
  -H "Authorization: Bearer $TOKEN"
```

**Resposta:**
```json
{
  "buildings": [
    {
      "id": 101,
      "type": "casa",
      "level": 1,
      "status": "complete",
      "expected_production": { "populacao": 8 }
    }
  ]
}
```

---

#### 8️⃣ Faz Upgrade da Casa para Nível 2

```bash
curl -X PUT http://localhost:3000/api/feud/1/buildings/101/upgrade \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Resposta:**
```json
{
  "success": true,
  "building": {
    "id": 101,
    "type": "casa",
    "level": 2,
    "status": "construction",
    "construction_end_time": "2026-04-03T16:01:03Z"
  },
  "upgradeCost": {
    "madeira": 55,
    "pedra": 33
  }
}
```

---

#### 9️⃣ Demolir um Edifício

```bash
curl -X DELETE http://localhost:3000/api/feud/1/buildings/101 \
  -H "Authorization: Bearer $TOKEN"
```

**Resposta:**
```json
{
  "success": true,
  "message": "Building demolished",
  "refund": {
    "madeira": 27,  // 50% de 55
    "pedra": 16     // 50% de 33
  }
}
```

---

## 📊 Validações Testadas

### ✅ Teste: Sem recursos suficientes

```bash
# Tenta construir Muralha com 80 madeira (custa 100)
curl -X POST http://localhost:3000/api/feud/1/buildings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "type": "muralha", "level": 1 }'
```

**Esperado:** `400 {"error": "Not enough resources"}`

---

### ✅ Teste: Nível mínimo do feudo

```bash
# Casa requer feodo level 1 (ok)
# Muralha requer level 3 (vai falhar se feudo é level 1)
curl -X POST http://localhost:3000/api/feud/1/buildings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "type": "muralha", "level": 1 }'
```

**Esperado:** `400 {"error": "Feud level too low. Required: 3"}`

---

### ✅ Teste: Access Control (usuário errado)

```bash
OUTRO_TOKEN="token_de_outro_usuario"

curl http://localhost:3000/api/feud/1/buildings \
  -H "Authorization: Bearer $OUTRO_TOKEN"
```

**Esperado:** `403 {"error": "Unauthorized"}`

---

### ✅ Teste: Building ID inválido

```bash
curl http://localhost:3000/api/feud/1/buildings/99999 \
  -H "Authorization: Bearer $TOKEN"
```

**Esperado:** `404 {"error": "Building not found"}`

---

## 🔍 Debugging

### Logs do Servidor

Se houver erro, verifica o terminal do npm run dev:

```
❌ Error: Cannot find module './BuildingService'
❌ Building route mounting failed
❌ Database connection error
```

---

### Verifica Status do Banco de Dados

```bash
# Em outro terminal, conecta ao PostgreSQL
psql -U seu_user -d seu_database

# Query para ver edifícios
SELECT * FROM buildings;

# Query para ver status
SELECT id, type, level, status, construction_end_time FROM buildings;
```

---

## 🎯 Sucesso Confirmado Quando

- ✅ POST /buildings cria edifício com status "construction"
- ✅ GET /buildings lista edifícios do feudo
- ✅ GET /buildings/available lista construções possíveis
- ✅ PUT /buildings/:id/upgrade incrementa level
- ✅ DELETE /buildings/:id remove e dá refund
- ✅ Validações funcionam (recursos, level, ownership)
- ✅ Construção completa automaticamente após timer

---

## 📈 Próximo Passo

Se tudo passar, próxima fase: **Semana 5 - Research System**

```bash
# Será similar:
# POST /api/feud/:feudId/research/start
# GET /api/feud/:feudId/research/progress
# GET /api/feud/:feudId/research/tree
```
