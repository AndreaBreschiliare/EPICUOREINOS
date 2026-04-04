// 🗑️ COMO DELETAR FEUDO - SOLUÇÃO RÁPIDA

// Abra o DevTools (F12) na página do dashboard
// Cole isto no Console e execute:

// =========== PASSO 1: PEGUE SEU TOKEN ===========
const token = localStorage.getItem('token');
console.log('Seu token:', token);

// =========== PASSO 2: DELETE O FEUDO ===========
fetch('/api/feud/1', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => {
  console.log('Resposta:', data);
  if (data.success) {
    console.log('✅ Feudo deletado com sucesso!');
    console.log('Atualizando página em 2 segundos...');
    setTimeout(() => window.location.reload(), 2000);
  }
})
.catch(e => console.error('❌ Erro:', e));

// =========== RESULTADO ESPERADO ===========
// ✅ Feudo deletado com sucesso!
// Você será redirecionado para /kingdom-creation automaticamente
