/**
 * Building Controller
 * Endpoints para construção, upgrade e demolição
 */

const Building = require('../models/Building');
const BuildingService = require('../services/BuildingService');
const { ERROR_CODES } = require('../config/constants');

/**
 * GET /api/feud/:feudId/buildings
 * Lista todos os edifícios de um feudo
 */
async function getFeudBuildings(req, res) {
  try {
    const feudId = req.params.feudId;

    // Validar proprietário
    const feud = require('../models/Feud');
    const feudData = await feud.findById(feudId);
    if (!feudData || feudData.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Access denied',
      });
    }

    const buildings = await BuildingService.getFeudBuildings(feudId);

    res.json({
      success: true,
      data: {
        feudId,
        buildings,
        total: buildings.length,
      },
    });
  } catch (error) {
    console.error('Error getting feud buildings:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving buildings',
    });
  }
}

/**
 * GET /api/feud/:feudId/buildings/available
 * Lista edifícios disponíveis para construir
 */
async function getAvailableBuildings(req, res) {
  try {
    const feudId = req.params.feudId;

    // Validar proprietário
    const feud = require('../models/Feud');
    const feudData = await feud.findById(feudId);
    if (!feudData || feudData.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Access denied',
      });
    }

    const available = await BuildingService.getAvailableBuildings(feudId);

    res.json({
      success: true,
      data: {
        feudId,
        available,
        total: available.length,
      },
    });
  } catch (error) {
    console.error('Error getting available buildings:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving available buildings',
    });
  }
}

/**
 * GET /api/feud/:feudId/buildings/:buildingId
 * Retorna detalhes de um edifício específico
 */
async function getBuildingById(req, res) {
  try {
    const { feudId, buildingId } = req.params;

    // Validar proprietário
    const feud = require('../models/Feud');
    const feudData = await feud.findById(feudId);
    if (!feudData || feudData.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Access denied',
      });
    }

    const building = await Building.findById(buildingId);
    if (!building || building.feud_id !== parseInt(feudId)) {
      return res.status(404).json({
        success: false,
        error: ERROR_CODES.NOT_FOUND,
        message: 'Building not found',
      });
    }

    res.json({
      success: true,
      data: building,
    });
  } catch (error) {
    console.error('Error getting building by ID:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving building',
    });
  }
}

/**
 * POST /api/feud/:feudId/buildings
 * Iniciar construção de um edifício
 * Body: { type, level? }
 */
async function startBuilding(req, res) {
  try {
    const feudId = req.params.feudId;
    const { type, level = 1 } = req.body;

    // Validação
    if (!type) {
      return res.status(400).json({
        success: false,
        error: ERROR_CODES.MISSING_FIELD,
        message: 'Building type is required',
      });
    }

    // Validar proprietário
    const feud = require('../models/Feud');
    const feudData = await feud.findById(feudId);
    if (!feudData || feudData.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Access denied',
      });
    }

    // Iniciar construção
    const result = await BuildingService.startBuilding(feudId, type, level);

    res.status(201).json({
      success: true,
      message: 'Building construction started',
      data: {
        building: result.building,
        cost: result.cost,
        constructionTime: result.constructionTime,
        endTime: result.endTime,
      },
    });
  } catch (error) {
    console.error('Error starting building:', error);
    
    const errorMessage = error.message;
    const statusCode = errorMessage.includes('INSUFFICIENT') ? 400 : 
                      errorMessage.includes('LEVEL_REQUIRED') ? 403 :
                      errorMessage.includes('MAX_') ? 409 : 500;

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      message: 'Error starting building construction',
    });
  }
}

/**
 * PUT /api/feud/:feudId/buildings/:buildingId/upgrade
 * Fazer upgrade de um edifício
 */
async function upgradeBuilding(req, res) {
  try {
    const { feudId, buildingId } = req.params;

    // Validar proprietário
    const feud = require('../models/Feud');
    const feudData = await feud.findById(feudId);
    if (!feudData || feudData.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Access denied',
      });
    }

    // Verificar que o edifício pertence ao feudo
    const building = await Building.findById(buildingId);
    if (!building || building.feud_id !== parseInt(feudId)) {
      return res.status(404).json({
        success: false,
        error: ERROR_CODES.NOT_FOUND,
        message: 'Building not found',
      });
    }

    // Fazer upgrade
    const result = await BuildingService.upgradeBuilding(buildingId);

    res.json({
      success: true,
      message: 'Building upgrade started',
      data: {
        building: result.building,
        newLevel: result.newLevel,
        cost: result.cost,
        constructionTime: result.constructionTime,
        endTime: result.endTime,
      },
    });
  } catch (error) {
    console.error('Error upgrading building:', error);
    
    const errorMessage = error.message;
    const statusCode = errorMessage.includes('INSUFFICIENT') ? 400 : 
                      errorMessage.includes('MAX_LEVEL') ? 409 :
                      errorMessage.includes('CONSTRUCTION') ? 409 : 500;

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      message: 'Error upgrading building',
    });
  }
}

/**
 * DELETE /api/feud/:feudId/buildings/:buildingId
 * Demolir um edifício
 */
async function demolishBuilding(req, res) {
  try {
    const { feudId, buildingId } = req.params;

    // Validar proprietário
    const feud = require('../models/Feud');
    const feudData = await feud.findById(feudId);
    if (!feudData || feudData.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Access denied',
      });
    }

    // Verificar que o edifício pertence ao feudo
    const building = await Building.findById(buildingId);
    if (!building || building.feud_id !== parseInt(feudId)) {
      return res.status(404).json({
        success: false,
        error: ERROR_CODES.NOT_FOUND,
        message: 'Building not found',
      });
    }

    // Demolir
    const result = await BuildingService.demolishBuilding(buildingId);

    res.json({
      success: true,
      message: 'Building demolished',
      data: {
        demolished: result.demolished,
        refund: result.refund,
      },
    });
  } catch (error) {
    console.error('Error demolishing building:', error);
    
    const errorMessage = error.message;
    const statusCode = errorMessage.includes('CONSTRUCTION') ? 409 : 500;

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      message: 'Error demolishing building',
    });
  }
}

module.exports = {
  getFeudBuildings,
  getAvailableBuildings,
  getBuildingById,
  startBuilding,
  upgradeBuilding,
  demolishBuilding,
};
