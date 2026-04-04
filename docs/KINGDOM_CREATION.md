# 🏰 Página de Criação de Reino

## Visão Geral

A página de criação de reino é o primeiro passo depois que o usuário se registra. Nela, o jogador escolhe:

1. **Nome do Reino** - Identificador único do feudo
2. **Cultura** - Define características e bônus do reino

## ⚙️ Arquitetura

### Frontend

**Arquivo:** [frontend/src/pages/KingdomCreationPage.jsx](frontend/src/pages/KingdomCreationPage.jsx)

**Características:**
- ✅ Formulário com validação client-side
- ✅ Seleção visual de 8 culturas com descrições
- ✅ Preview da cultura selecionada
- ✅ Tema feudal com gradientes e cores temáticas
- ✅ Loading state durante requisição
- ✅ Feedback de erros com Alert

**Validações:**
- Nome obrigatório
- Mínimo 3 caracteres no nome
- Máximo 50 caracteres no nome
- Cultura obrigatória

**Design:**
- Layout responsivo (Grid 2 colunas em MD+)
- Card com borda dourada (#D4A574)
- Gradiente de fundo feudal
- Material-UI com customização de cores

### Backend

**Rota:** `POST /api/feud`

**Controller:** [backend/src/controllers/feudController.js](backend/src/controllers/feudController.js)

**Função:** `createFeud()`

**Request:**
```json
{
  "name": "Reino da Esperança",
  "culture": "baduran"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Feud created successfully",
  "data": {
    "feudId": 1,
    "name": "Reino da Esperança",
    "culture": "baduran",
    "level": 1,
    "resources": { ... },
    "population": 8,
    "moral": 50,
    "productionInfo": { ... }
  }
}
```

**Erros Possíveis:**
- `400` - MISSING_FIELD: name ou culture ausentes
- `409` - FEUD_EXISTS: Usuário já tem um reino
- `500` - INTERNAL_ERROR: Erro no servidor

### Fluxo de Autenticação

```
[RegisterPage] 
    ↓ (registro sucesso)
[KingdomCreationPage] 
    ↓ (criar reino sucesso)
[DashboardPage]
```

**Mudanças:**
- ✅ RegisterPage redireciona para `/kingdom-creation` em vez de `/dashboard`
- ✅ KingdomCreationPage redireciona para `/dashboard` após criar reino

## 📊 Culturas Disponíveis

| ID | Nome | Descrição |
|----|------|-----------|
| `baduran` | Baduran | Anões - Mestres em construção e mineração |
| `drow` | Drow | Elfos Negros - Especialistas em intriga |
| `aiglanos` | Aiglanos | Romano - Poder militar e organização |
| `björske` | Björske | Rohan - Guerreiros nórdicos |
| `polkinea` | Polkinea | Hobbit - Agricultores astuciosos |
| `gulthrak` | Gulthrak | Orc - Força bruta e agressão |
| `p_leste` | P. Leste | Oriental - Sabedoria e comércio |
| `aluriel` | Aluriel | Élfico - Magia e elegância |

*Fonte: [backend/src/config/constants.js](backend/src/config/constants.js)*

## 🚀 Como Usar

### Fluxo do Usuário

1. **Registra** na página `/register`
2. **É redirecionado** para `/kingdom-creation`
3. **Digita** nome do reino
4. **Seleciona** uma cultura de interesse
5. **Clica** em "⚔️ Fundar Reino"
6. **Aguarda** resposta do servidor
7. **É redirecionado** para `/dashboard`

### Rota

```typescript
// App.jsx
<Route
  path="/kingdom-creation"
  element={
    <ProtectedRoute>
      <KingdomCreationPage />
    </ProtectedRoute>
  }
/>
```

## 🎨 Estilo e Design

### Tema Feudal
- **Cor Primária:** #D4A574 (Dourado)
- **Cor Secundária:** #8B6F47 (Marrom)
- **Background:** Gradiente escuro #1a1a1a → #2d2d2d
- **Texto:** Branco/Cinza claro

### Componentes Material-UI Utilizados
- `Container` - Layout centralizado
- `Grid` - Layout responsivo
- `Paper` - Card de formulário
- `TextField` - Entrada de nome
- `Select` - Seleção de cultura
- `Button` - Submit
- `Alert` - Exibição de erros
- `CircularProgress` - Loading spinner
- `Typography` - Textos

## 📝 Dados Iniciais

Quando um reino é criado, recebe:

| Campo | Valor |
|-------|-------|
| `level` | 1 |
| `madeira` | 20.000 |
| `pedra` | 10.000 |
| `ferro` | 5.000 |
| `comida` | 50.000 |
| `cobre` | 5.000 |
| `pergaminhos` | 100 |
| `cristais` | 0 |
| `minério_raro` | 0 |
| `população` | 8 |
| `moral` | 50 |

*Fonte: [backend/src/config/constants.js](backend/src/config/constants.js)*

## 🔄 Desenvolvimento Futuro

- [ ] Adicionar effects visuais e animações
- [ ] Validar culturalmente o nome (filtro de palavras)
- [ ] Mostrar bônus iniciais da cultura escolhida
- [ ] Adicionar mapa de preview do reino
- [ ] Integrar com tutorial de introdução
- [ ] Salvar preferência de cultura do usuário

---

**Commit:** `6580509`  
**Data:** 2026-04-04  
**Status:** ✅ Implementado
