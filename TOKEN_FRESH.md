# 🔑 Gerar Novo Personal Access Token

## Passo 1: Criar Token Fresh

1. Abra: https://github.com/settings/tokens/new
   
2. Preencha assim:
   ```
   Token name: GitPush-Travian
   Expiration: 90 days
   ```

3. **Scopes** - Marque APENAS:
   ✅ repo (Full control of private repositories)
   
4. Desmarque tudo o mais

5. Clique **"Generate token"**

6. **COPIE** o código que aparece (tipo: `ghp_xxxxxxxxxxxx`)

---

## Passo 2: Usar Token no Git

Copie este comando e substitua `YOUR_TOKEN_HERE`:

```powershell
$token = 'YOUR_TOKEN_HERE'
git remote set-url origin "https://AndreaBreschiliare:${token}@github.com/AndreaBreschiliare/EPICUOREINOS.git"
git push -u origin main
```

---

## ✅ Sucesso?

Se ver:
```
Enumerating objects: XXX, done.
Counting objects: 100% (XXX/XXX), done.
...
 * [new branch]      main -> main
```

**Parabéns! 🎉 Código já está no GitHub!**
