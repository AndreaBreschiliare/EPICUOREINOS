# 🔑 Cheatsheet - Próximos Passos

## Etapa 1: Criar Repositório GitHub ✗ (PENDENTE)

**O que fazer AGORA:**
1. Apareça que está na página de criação do repositório EPICUREINOS
2. Clique no botão verde **"Create Repository"**
3. Aguarde a confirmação

**Screenshot esperado após clicar:**
- Página com: "We've initialized your repository"
- URL: https://github.com/AndreaBreschiare/EPICUREINOS
- Opção de HTTPS ou SSH

---

## Etapa 2: Fazer Push do Código (PRÓXIMO)

Depois que criar, execute no terminal:

```powershell
# Você está aqui:
cd c:\Users\web_m\Documents\GitHub\projetotravianUO

# Push para GitHub
git push -u origin main

# ✓ Se aparecer pedindo senha, use seu Personal Access Token:
# GitHub > Settings > Developer settings > Tokens
```

---

## Etapa 3: Configurar Railway (APÓS o push)

1. Acesse https://railway.app
2. Login / Signup
3. "New Project" > "Deploy from GitHub"
4. Selecione EPICUREINOS
5. Railway fará o build automaticamente

---

## Etapa 4: Configurar Domínio (FINAL)

1. Railway Dashboard > Settings > Domains
2. Adicionar: `api.thiagorivero.com.br`
3. Obter CNAME do Railway
4. Ir ao seu provedor de DNS
5. Criar registro CNAME

---

## ✅ Quando tudo estiver feito:

- Frontend: https://thiagorivero.com.br
- API: https://api.thiagorivero.com.br
- Dashboard: https://railway.app/dashboard

🎉 Seu jogo estará online!
