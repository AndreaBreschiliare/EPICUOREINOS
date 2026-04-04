# 🛡️ Sistema de Roles - Documentação

## O Que Foi Implementado

### 1. **Backend**
- ✅ Coluna `role` adicionada à tabela `users`
- ✅ Controller `adminController.js` com 5 endpoints
- ✅ Rotas de admin em `/api/admin/*`
- ✅ Validação de admin em cada endpoint

### 2. **Frontend**
- ✅ Página `AdminPage.jsx` com interface completa
- ✅ Rota protegida `/admin`
- ✅ Verificação de role inclusa

---

## 📊 Rotas de Admin

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/admin/users` | Listar todos os usuários |
| `GET` | `/api/admin/players` | Listar apenas players |
| `GET` | `/api/admin/stats` | Estatísticas do servidor |
| `DELETE` | `/api/admin/users/:userId` | Deletar usuário |
| `POST` | `/api/admin/users/:userId/role` | Alterar role de usuário |

---

## 🚀 Como Criar a Primeira Conta Admin

### Opção 1: Via SQL Direto (PostgreSQL)

```sql
-- Conecte ao banco e execute:
UPDATE users 
SET role = 'admin' 
WHERE id = 1;
```

### Opção 2: Via Script Python/Node

```javascript
// Script Node.js
const db = require('./backend/src/config/database');
const User = require('./backend/src/models/User');

async function makeAdmin(userId) {
  await User.setRole(userId, 'admin');
  console.log(`✅ Usuário ${userId} agora é admin`);
}

makeAdmin(1); // Mude 1 para o ID do seu usuário
```

### Opção 3: Via API (se já for admin)

```bash
# Pegue seu token de admin
TOKEN="seu_token_aqui"

# Altere o role de alguém para admin
curl -X POST http://localhost:5000/api/admin/users/2/role \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

---

## 🎮 Interface Admin

A página `/admin` permite:

### 📋 Visualizar
- ✅ Todos os usuários do sistema
- ✅ Username, Email, Role, Data de Criação
- ✅ Estatísticas: Total usuários, Players, Admins, Reinos

### 🗑️ Deletar Usuários
- ✅ Clique no botão "Deletar"
- ✅ Confirme a exclusão
- ✅ Sistema deleta o usuário E todos seus reinos

### ⚠️ Proteções
- ❌ Admin não pode deletar a si mesmo
- ✅ Todos os reinos são removidos automaticamente
- ✅ Apenas admins podem acessar a página

---

## 🔐 Fluxo de Verificação

```javascript
// Toda rota admin começa com verificação:
const isAdmin = await User.isAdmin(req.user.id);
if (!isAdmin) {
  return res.status(403).json({
    error: 'FORBIDDEN',
    message: 'Admin access required'
  });
}
```

---

## 📊 Dados na Resposta de Login

Agora o login retorna o `role`:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "andreabresch",
    "email": "thiagorivero@gmail.com",
    "role": "admin",
    "token": "eyJhbGc..."
  }
}
```

---

## 🧪 Testando

### 1. Criar primeira conta admin

```sql
-- No seu banco PostgreSQL
UPDATE users SET role = 'admin' WHERE id = 1;
```

### 2. Fazer login
```
GET /login
Email: seu_email@email.com
Senha: sua_senha
```

### 3. Acessar painel admin
```
GET /admin
```

### 4. Listar usuários
```bash
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 5. Deletar usuário
```bash
curl -X DELETE http://localhost:5000/api/admin/users/2 \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 🛠️ Estrutura de Arquivos

```
backend/
├── migrations/
│   └── 010_add_role_to_users.js          ← Nova coluna role
├── src/
│   ├── controllers/
│   │   └── adminController.js             ← Lógica de admin
│   ├── models/
│   │   └── User.js                        ← Métodos de role
│   └── routes/
│       └── admin.js                       ← Rotas de admin
│
frontend/
├── src/
│   ├── pages/
│   │   └── AdminPage.jsx                  ← Interface admin
│   └── App.jsx                            ← Rota /admin
```

---

## 📝 Próximas Etapas

- [ ] Adicionar logs de auditoria
- [ ] Permissões mais granulares
- [ ] Painel de moderação
- [ ] Sistema de bans
- [ ] Relatórios de jogadores

---

**Commit:** `37c6035`  
**Data:** 2026-04-04  
**Status:** ✅ Implementado
