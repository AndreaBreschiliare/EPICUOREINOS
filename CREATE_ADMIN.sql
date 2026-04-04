-- 🛡️ Script para Criar Conta Admin
-- Execute este script no seu banco PostgreSQL

-- Opção 1: Tornar usuário ID 1 admin
UPDATE users 
SET role = 'admin' 
WHERE id = 1;

-- Verificar se deu certo
SELECT id, username, email, role 
FROM users 
WHERE role = 'admin';

-- Resultado esperado:
-- id | username | email | role
-- ---|----------|-------|------
-- 1  | seu_user | seu@email.com | admin
