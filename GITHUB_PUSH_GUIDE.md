# 📝 Como Fazer Push para GitHub

## Opção 1: Personal Access Token (RECOMENDADO - FÁCIL)

### Passo 1: Criar Token no GitHub

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token"** > **"Generate new token (classic)"**
3. Nome: `GitPush2026`
4. Expira em: 90 dias (ou escolher)
5. Selecione APENAS: `repo` (dar acesso ao repositório)
6. Clique **"Generate token"**
7. **COPIE o token** (aparece uma única vez!)

### Passo 2: Usar Token no Git Push

Copie e cole este comando no PowerShell:

```powershell
cd C:\Users\web_m\Documents\GitHub\projetotravianUO

# Usar Personal Access Token
$github_user = "AndreaBreschiare"
$github_token = "ghp_SEU_TOKEN_AQUI"  # Substituir com seu token

git remote set-url origin "https://${github_user}:${github_token}@github.com/${github_user}/EPICUREINOS.git"

git push -u origin main
```

**Substituir `ghp_SEU_TOKEN_AQUI` com o token que você copiou!**

---

## Opção 2: Git Credential Manager (SE TIVER INSTALADO)

Se instalou Git recente:

```powershell
cd C:\Users\web_m\Documents\GitHub\projetotravianUO
git push -u origin main

# Aparecerá popup do Windows para autentificar
# Clique em "Sign in with your browser"
```

---

## ✅ Verificar se funcionou

Depois de fazer push, execute:

```powershell
git remote -v
```

Deve mostrar:
```
origin  https://github.com/AndreaBreschiare/EPICUREINOS.git (fetch)
origin  https://github.com/AndreaBreschiare/EPICUREINOS.git (push)
```

---

## 🔐 Segurança

- Token deve estar privado (nunca compartilhar)
- Pode ser revogado em https://github.com/settings/tokens
- Expira automaticamente após 90 dias
