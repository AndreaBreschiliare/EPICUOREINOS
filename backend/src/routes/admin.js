const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Todas as rotas requerem autenticação (verificação de admin é feita no controller)
router.use(authenticate);

// ==================== ADMIN ROUTES ====================

// GET /api/admin/users - Listar todos os usuários
router.get('/users', adminController.getAllUsers);

// GET /api/admin/players - Listar apenas players
router.get('/players', adminController.getPlayers);

// GET /api/admin/stats - Estatísticas do servidor
router.get('/stats', adminController.getStats);

// DELETE /api/admin/users/:userId - Deletar um usuário
router.delete('/users/:userId', adminController.deleteUser);

// POST /api/admin/users/:userId/role - Alterar role de um usuário
router.post('/users/:userId/role', adminController.setUserRole);

module.exports = router;
