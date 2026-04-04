# 🗑️ Script para Deletar Feudo (DEBUG)

## Opção 1: Via cURL (Local)

```bash
# Pegue seu token no localStorage do navegador:
# 1. Abra DevTools (F12)
# 2. Console → localStorage.getItem('token')

curl -X DELETE http://localhost:5000/api/feud/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Opção 2: Via JavaScript Console

Abra o DevTools (F12) do seu navegador na página e execute:

```javascript
fetch('/api/feud/1', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(data => console.log(data))
.catch(e => console.error(e))
```

## Opção 3: Script PowerShell (Windows)

```powershell
$token = "SEU_TOKEN_AQUI"
$feudId = 1

$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-WebRequest -Uri "http://localhost:5000/api/feud/$feudId" `
    -Method DELETE `
    -Headers $headers | ConvertTo-Json
```

---

## Como Pegar seu Token

1. Abra a aplicação no navegador
2. Abra DevTools (F12)
3. Vá para "Console"
4. Copie o resultado de: `localStorage.getItem('token')`
5. Substitua `SEU_TOKEN_AQUI` pelo seu token

---

## Depois Deletar, Você Pode:

1. ✅ Fazer refresh na página (`F5`)
2. ✅ Voltar para `/login`
3. ✅ Fazer logout
4. ✅ Fazer login novamente
5. ✅ Será redirecionado para `/kingdom-creation` novamente

Pronto para criar seu reino! 🏰
