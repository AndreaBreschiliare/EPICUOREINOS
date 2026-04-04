const express = require('express');
const feudController = require('../controllers/feudController');
const buildingRoutes = require('./building');
const researchRoutes = require('./research');
const cargoRoutes = require('./cargo');
const lawRoutes = require('./law');
const levelRoutes = require('./level');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Todas essas rotas requerem autenticação
router.use(authenticate);

// ==================== FEUD ROUTES ====================

// GET /api/feud/me - Meu feudo com informações completas
router.get('/me', feudController.getMyFeud);

// POST /api/feud - Criar novo feudo
router.post('/', feudController.createFeud);

// GET /api/feud/:id - Ver feudo (público ou completo se for seu)
router.get('/:id', feudController.getFeudById);

// GET /api/feud/:id/resources - Ver recursos do feudo
router.get('/:id/resources', feudController.getFeudResources);

// GET /api/feud/:id/production - Ver informações de produção
router.get('/:id/production', feudController.getFeudProduction);

// GET /api/feud/:id/history - Ver histórico de recursos
router.get('/:id/history', feudController.getFeudHistory);

// POST /api/feud/:id/collect - Coletar recursos manualmente
router.post('/:id/collect', feudController.collectResources);

// POST /api/feud/:id/reset-resources - DEBUG: Reset recursos ao inicial (para testes)
router.post('/:id/reset-resources', feudController.resetFieudResources);

// DELETE /api/feud/:id - DEBUG: Deletar feudo (para testes)
router.delete('/:id', feudController.deleteFeud);

// ==================== BUILDINGS ROUTES ====================

// Incluir rotas de building como sub-rotas
router.use('/:feudId/buildings', buildingRoutes);

// ==================== RESEARCH ROUTES ====================

// Incluir rotas de pesquisa como sub-rotas
router.use('/:feudId/research', researchRoutes);

// ==================== CARGOS ROUTES ====================

// Incluir rotas de cargos como sub-rotas
router.use('/:feudId/cargos', cargoRoutes);

// ==================== LAWS ROUTES ====================

// Incluir rotas de leis como sub-rotas
router.use('/:feudId/laws', lawRoutes);

// ==================== LEVEL-UP ROUTES ====================

// Incluir rotas de ascensao como sub-rota
router.use('/:feudId/level-up', levelRoutes);

// ==================== LEADERBOARD ====================

// GET /api/leaderboard/prosperity - Top 50 por prosperidade
router.get('/leaderboard/prosperity', feudController.getLeaderboard);

module.exports = router;
