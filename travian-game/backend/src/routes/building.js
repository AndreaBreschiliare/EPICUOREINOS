const express = require('express');
const buildingController = require('../controllers/buildingController');
const { authenticate } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// Todas essas rotas requerem autenticação
router.use(authenticate);

// ==================== BUILDING ROUTES ====================

// GET /api/feud/:feudId/buildings - Listar todos os edifícios
router.get('/', buildingController.getFeudBuildings);

// GET /api/feud/:feudId/buildings/available - Listar disponíveis para construir
router.get('/available', buildingController.getAvailableBuildings);

// GET /api/feud/:feudId/buildings/:buildingId - Detalhes de um edifício
router.get('/:buildingId', buildingController.getBuildingById);

// POST /api/feud/:feudId/buildings - Iniciar construção
router.post('/', buildingController.startBuilding);

// PUT /api/feud/:feudId/buildings/:buildingId/upgrade - Fazer upgrade
router.put('/:buildingId/upgrade', buildingController.upgradeBuilding);

// DELETE /api/feud/:feudId/buildings/:buildingId - Demolir edifício
router.delete('/:buildingId', buildingController.demolishBuilding);

module.exports = router;
