# 🚀 Guia de Correção - Deploy Railway & Cloudflare

## ✅ O Que Foi Corrigido

### 1. **Dockerfile** (Backend)
```diff
- COPY EPICUOREINOS/backend/package*.json ./
+ COPY backend/package*.json ./

- COPY EPICUOREINOS/backend/src ./src
+ COPY backend/src ./src

- COPY EPICUOREINOS/backend/knexfile.js ./
+ COPY backend/knexfile.js ./
```

### 2. **docker-compose.yml**
```diff
  volumes:
-   - ./backend/src:/app/backend/src
+   - ./backend/src:/app/src
```

### 3. **frontend/Dockerfile.dev** (Criado)
- Novo arquivo para desenvolvimento do frontend com Vite
- Expõe porta 5173 (padrão do Vite)

---

## 🔄 Próximos Passos no Railway

### 1. **Fazer Push do Novo Commit**
```bash
git push origin main
```

### 2. **Triggerar Novo Deploy no Railway**
- Acesse: https://railway.app
- Vá para seu projeto **EPICUOREINOS**
- Clique em "Deployments" → "Redeploy" (do commit mais recente)
- Ou aguarde auto-deploy automático (se habilitado)

### 3. **Monitorar o Build**
- Verifique os logs do Railway em tempo real
- Procure por: `[5/6] COPY backend/src ./src` ✅
- Se vir `Build succeeded`, está pronto!

---

## 🌐 Cloudflare Workers (se aplicável)

Se você usa Workers para proxy/routing:

### Verificar Configurações
1. Acesse Cloudflare → Seu Domínio → Workers
2. Verifique se os routes estão corretos:
   - `/api/*` → Railway Backend
   - `/` (ou paths estáticos) → Railway Frontend ou CDN

### Nenhuma mudança de código é necessária!
- Os paths do projeto não afetam Cloudflare
- Apenas certifique-se que os domínios estão corretos

---

## ✅ Verificação de Status

### Railway
- [ ] Novo commit com fix aparece no histórico
- [ ] Build inicia automaticamente
- [ ] Logs mostram `COPY backend/src` sem erros
- [ ] Deploy marca como `Success`

### Banco de Dados
- [ ] PostgreSQL conecta corretamente
- [ ] Migrações rodam sem erro
- [ ] Redis inicia normalmente

### Aplicação
- [ ] Backend responde em `$RAILWAY_PUBLIC_DOMAIN:5000`
- [ ] Frontend carrega em `https://seu-dominio.com`
- [ ] API calls funcionam sem CORS errors

---

## 📝 Comandos Úteis

### Verificar estrutura localmente
```bash
tree -L 2 -I 'node_modules'
```

### Testar build Docker local
```bash
docker build -t epicuoreinos-backend .
```

### Ver logs do Railway
```bash
# Se tiver CLI do Railway instalado
railway logs
```

---

**Última atualização:** 2026-04-04  
**Commit:** `fec598b`  
**Status:** ✅ Pronto para Deploy
