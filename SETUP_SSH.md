# 🔐 Configurar PAT (Personal Access Token)

## Passo 1: Gerar Token no GitHub

1. Vá para: https://github.com/settings/tokens/new
2. Ou: GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
3. Clique **"Generate new token (classic)"**

## Passo 2: Configurar Permissões

Preencer o formulário:
- **Token name**: `travian-deployment`
- **Expiration**: 90 days (ou mais)
- **Scopes** (marcar):
  - ✓ `repo` (Full control of private repositories)
  - ✓ `workflow` (Update GitHub Action workflows)

## Passo 3: Copiar Token

- Clique **"Generate token"**
- **COPIAR O TOKEN** (só aparece uma vez!)
- Guardar em lugar seguro

## Passo 4: Usar Token no Push

```powershell
cd C:\Users\web_m\Documents\GitHub\projetotravianUO

# Voltar para HTTPS
git remote set-url origin https://github.com/AndreaBreschiare/EPICUREINOS.git

# Fazer push
# Quando pedir senha, use o token copiado
git push -u origin main
```

**Quando aparecer pedindo credenciais:**
```
Username: AndreaBreschiare
Password: [COLAR O TOKEN AQUI]
```

---

⏱️ **Tempo estimado**: 2 minutos

Fez já? Avise que vou finalizar o push!
