# 🚀 Guia Completo de Deploy - Travian Feudos Última Online

## 📋 Sumário
1. [Preparação Inicial](#preparação-inicial)
2. [Upload para GitHub](#upload-para-github)
3. [Deploy no Railway](#deploy-no-railway)
4. [Configuración de Domínio](#configuracion-de-domínio)
5. [Monitoramento](#monitoramento)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Preparação Inicial

### Pré-requisitos
- [ ] Git instalado localmente
- [ ] Conta GitHub (AndreaBreschiare)
- [ ] Conta Railway.app
- [ ] Acesso ao DNS de thiagorivero.com.br

### 1. Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env.production
```

Editar `.env.production` com valores reais:
```env
DATABASE_URL=postgresql://user:secure_password@db-host:5432/travian_feudos
JWT_SECRET=gerar-com-: openssl rand -base64 32
CORS_ORIGIN=https://thiagorivero.com.br
VITE_API_URL=https://api.thiagorivero.com.br
```

---

## 📤 Upload para GitHub

### Passo 1: Inicializar Git Localmente

```powershell
cd c:\Users\web_m\Documents\GitHub\projetotravianUO

# Remover git anterior (se existir)
Remove-Item -Force -Recurse C:\Users\web_m\.git

# Inicializar git corretamente
git init
git config user.name "Andrea Breschiare"
git config user.email "seu-email@example.com"
```

### Passo 2: Adicionar Remoto GitHub

```powershell
git remote add origin https://github.com/AndreaBreschiare/EPICUREINOS.git
git branch -M main
```

### Passo 3: Primeiro Commit e Push

```powershell
# Adicionar todos os arquivos (exceto .gitignore)
git add .
git commit -m "🎮 Initial commit: Travian Feudos game structure with Railway config"

# Push para GitHub
git push -u origin main
```

### Passo 4: Problemas Comuns?

Se receber erro de autenticação:
```powershell
# Usar SSH em vez de HTTPS (recomendado)
git remote set-url origin git@github.com:AndreaBreschiare/EPICUREINOS.git

# Ou usar Personal Access Token (PAT) no GitHub
# 1. GitHub Settings > Developer settings > Personal access tokens
# 2. Criar token com scopes: repo, read:user
# 3. Usar no lugar da senha
```

---

## 🚆 Deploy no Railway.app

### Passo 1: Conectar GitHub ao Railway

1. Acessar [railway.app](https://railway.app)
2. Login / Sign up
3. Clique em **"New Project"**
4. Selecione **"Deploy from GitHub"**
5. Autorize o Railway a acessar seu GitHub
6. Selecione o repositório **EPICUREINOS**

### Passo 2: Configurar Banco de Dados

O Railway detectará o `Dockerfile` automaticamente:

```bash
1. Na dashboard, clique em "Add Service"
2. Selecione "PostgreSQL"
3. Railway criará automaticamente DATABASE_URL
```

### Passo 3: Variáveis de Ambiente para Produção

Na dashboard do Railway:
- **Environment > Raw Editor** adicionar:

```env
DATABASE_URL=postgresql://...  # Gerado automaticamente
NODE_ENV=production
PORT=5000
JWT_SECRET=gerar-com-openssl-rand-base64-32
CORS_ORIGIN=https://thiagorivero.com.br
VITE_API_URL=https://api.thiagorivero.com.br
```

### Passo 4: Deploy Automático

```bash
# Railway fará deploy automaticamente quando você fizer push
git commit -m "Update configuration"
git push
# Railway detectará a mudança automaticamente!
```

Para visualizar logs:
```bash
# Se tiver Railway CLI instalado
railway logs
```

---

## 🌐 Configuración de Domínio

### Opção A: Usando Subdomínio API no Railway

1. Railway Dashboard > Settings > Domains
2. Clique em **"Add Custom Domain"**
3. Digite: `api.thiagorivero.com.br`
4. Railway fornecerá um CNAME

### Opção B: Configurar DNS (seu provedor de domínio)

**Registros DNS a adicionar:**

| Tipo  | Nome | Valor |
|-------|------|-------|
| CNAME | api | seu-railway-domain.railway.app |
| TLS   | - | Let's Encrypt (automático) |

**Exemplo (Registro A/CNAME):**
```dns
api.thiagorivero.com.br CNAME railway-hash.railway.app
```

### Passo com Seu Provedor de DNS

1. Acesse painel de controle do domínio
2. Vá para **DNS / Registros de DNS**
3. Crie novo registro CNAME:
   - Host: `api`
   - Aponta para: `seu-railway.railway.app` (do Railway)
4. Aguarde propagação (5-30 min)

**Verificar se propagou:**
```powershell
nslookup api.thiagorivero.com.br
# Ou use online: https://mxtoolbox.com/nslookup
```

---

## 📊 Monitoramento

### Verificar Status do Deployment

```bash
# Railway CLI
railway status
railway logs --follow
```

### Acessar a Aplicação

- **Frontend**: https://thiagorivero.com.br
- **API**: https://api.thiagorivero.com.br
- **Dashboard Railway**: https://railway.app/dashboard

### Métricas Importantes

Monitorar no Railway Dashboard:
- CPU Usage
- Memory Usage
- Disk Space
- Error Rate
- Response Time

---

## 🐛 Troubleshooting

### ❌ Erro: "Permission denied" no Git Push

```powershell
# Solução 1: SSH
git remote set-url origin git@github.com:AndreaBreschiare/EPICUREINOS.git
ssh-keygen -t ed25519  # Gerar chave SSH
# Adicionar chave pública no GitHub Settings

# Solução 2: Personal Access Token
# GitHub > Settings > Developer settings > Personal access tokens
# Usar token no lugar da senha
```

### ❌ Erro: "Database connection failed"

```bash
# Verificar se DATABASE_URL está configurada
echo $DATABASE_URL

# Railway -> pode levar 1-2 min para ficar pronto
# Verifique se PostgreSQL está "Running" no dashboard
```

### ❌ Erro: "Build failed"

Verificar logs:
```bash
# Via Railway Dashboard > Deployments > View Logs
# Procurar por erros em package.json ou dependências

# Local: testar build
docker build -t travian-test .
docker run travian-test
```

### ❌ Domínio não resolve

```powershell
# Verificar propagação de DNS
nslookup api.thiagorivero.com.br
dig api.thiagorivero.com.br

# Se não aparecer após 1h, verificar:
# 1. CNAME está correto no provedor?
# 2. Railway domínio está ativo?
# 3. Propagação global (aguarde 24-48h)
```

### ⚠️ Railway Container para com erro

**Verificar:**
1. Espaço em disco
2. Memory limit (aumentar se necessário)
3. Variáveis de ambiente completas
4. Logs de erro específicos

---

## ✅ Checklist Final

Antes de colocar em produção:

- [ ] Git repository criado e conectado ✓
- [ ] Código feito push para EPICUREINOS ✓
- [ ] Railroad project criado e conectado ✓
- [ ] PostgreSQL está rodando ✓
- [ ] Variáveis de ambiente configuradas ✓
- [ ] Deploy initial foi sucesso ✓
- [ ] Domínio DNS configurado ✓
- [ ] HTTPS/SSL funcionando ✓
- [ ] Teste final: acessar https://api.thiagorivero.com.br ✓
- [ ] Frontend conectando na API ✓

---

## 📞 Suporte

Se encontrar problemas:

1. **Verificar logs**: Railway Dashboard > Logs
2. **Testar localmente**: `docker-compose up`
3. **Consultar documentação**: 
   - Railway: https://docs.railway.app
   - Docker: https://docs.docker.com

---

**Última atualização**: 04/04/2026
**Versão do projeto**: 1.0.0
