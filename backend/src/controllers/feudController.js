const Feud = require('../models/Feud');
const ResourceService = require('../services/ResourceService');
const { ERROR_CODES } = require('../config/constants');

/**
 * GET /api/feud/me
 * Retorna o feudo do usuário autenticado
 */
async function getMyFeud(req, res) {
  try {
    const userId = req.user.id;

    // Buscar feudo do usuário
    const feud = await Feud.findByUserId(userId);
    if (!feud) {
      return res.status(404).json({
        success: false,
        error: ERROR_CODES.FEUD_NOT_FOUND,
        message: 'Feud not found',
      });
    }

    // Buscar informações de produção
    const productionInfo = await ResourceService.getProductionInfo(feud.id);

    res.json({
      success: true,
      data: productionInfo,
    });
  } catch (error) {
    console.error('Error getting my feud:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving feud',
    });
  }
}

/**
 * GET /api/feud/:id
 * Retorna dados públicos de um feudo (apenas recursos visíveis publicamente)
 */
async function getFeudById(req, res) {
  try {
    const feudId = req.params.id;

    // Buscar feudo
    const feud = await Feud.findById(feudId);
    if (!feud) {
      return res.status(404).json({
        success: false,
        error: ERROR_CODES.FEUD_NOT_FOUND,
        message: 'Feud not found',
      });
    }

    // Se é o próprio feudo, retornar dados completos
    if (req.user && req.user.id === feud.user_id) {
      const productionInfo = await ResourceService.getProductionInfo(feudId);
      return res.json({
        success: true,
        data: productionInfo,
        isOwner: true,
      });
    }

    // Caso contrário, retornar apenas dados públicos
    res.json({
      success: true,
      data: {
        feud: {
          id: feud.id,
          name: feud.name,
          level: feud.level,
          culture: feud.culture,
          moral: feud.moral,
          created_at: feud.created_at,
        },
        isPublic: true,
      },
    });
  } catch (error) {
    console.error('Error getting feud by ID:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving feud',
    });
  }
}

/**
 * GET /api/feud/:id/resources
 * Retorna recursos atuais do feudo
 */
async function getFeudResources(req, res) {
  try {
    const feudId = req.params.id;

    // Buscar feudo
    const feud = await Feud.findById(feudId);
    if (!feud) {
      return res.status(404).json({
        success: false,
        error: ERROR_CODES.FEUD_NOT_FOUND,
        message: 'Feud not found',
      });
    }

    // Se não é o proprietário, negar acesso (exceto se for público)
    if (req.user && req.user.id !== feud.user_id) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: {
        feudId: feud.id,
        resources: {
          madeira: feud.madeira,
          pedra: feud.pedra,
          ferro: feud.ferro,
          comida: feud.comida,
          cobre: feud.cobre,
          pergaminhos: feud.pergaminhos,
          cristais: feud.cristais,
          minério_raro: feud.minério_raro,
        },
        lastUpdate: feud.last_resource_update,
      },
    });
  } catch (error) {
    console.error('Error getting feud resources:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving resources',
    });
  }
}

/**
 * GET /api/feud/:id/production
 * Retorna informações detalhadas de produção
 */
async function getFeudProduction(req, res) {
  try {
    const feudId = req.params.id;

    // Buscar feudo
    const feud = await Feud.findById(feudId);
    if (!feud) {
      return res.status(404).json({
        success: false,
        error: ERROR_CODES.FEUD_NOT_FOUND,
        message: 'Feud not found',
      });
    }

    // Se não é o proprietário, negar acesso
    if (req.user && req.user.id !== feud.user_id) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Access denied',
      });
    }

    const productionInfo = await ResourceService.getProductionInfo(feudId);

    res.json({
      success: true,
      data: productionInfo,
    });
  } catch (error) {
    console.error('Error getting feud production:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving production info',
    });
  }
}

/**
 * GET /api/feud/:id/history
 * Retorna histórico de recursos (últimos 30 dias)
 */
async function getFeudHistory(req, res) {
  try {
    const feudId = req.params.id;
    const days = parseInt(req.query.days || 30);

    // Buscar feudo
    const feud = await Feud.findById(feudId);
    if (!feud) {
      return res.status(404).json({
        success: false,
        error: ERROR_CODES.FEUD_NOT_FOUND,
        message: 'Feud not found',
      });
    }

    // Se não é o proprietário, negar acesso
    if (req.user && req.user.id !== feud.user_id) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Access denied',
      });
    }

    const history = await ResourceService.getResourceHistory(feudId, days);

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('Error getting feud history:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving history',
    });
  }
}

/**
 * POST /api/feud/:id/collect
 * Coleta recursos manualmente (10% da produção)
 */
async function collectResources(req, res) {
  try {
    const feudId = req.params.id;

    // Buscar feudo
    const feud = await Feud.findById(feudId);
    if (!feud) {
      return res.status(404).json({
        success: false,
        error: ERROR_CODES.FEUD_NOT_FOUND,
        message: 'Feud not found',
      });
    }

    // Se não é o proprietário, negar acesso
    if (req.user && req.user.id !== feud.user_id) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Access denied',
      });
    }

    const result = await ResourceService.collectResources(feudId, 1);

    res.json({
      success: true,
      message: 'Resources collected',
      data: result,
    });
  } catch (error) {
    console.error('Error collecting resources:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error collecting resources',
    });
  }
}

/**
 * GET /api/leaderboard/prosperity
 * Retorna top 50 feudos por prosperidade (recursos totais)
 */
async function getLeaderboard(req, res) {
  try {
    const limit = parseInt(req.query.limit || 50);

    // Buscar todos os feudos ordenados por recursos
    const feuds = await Feud.findAll(limit);

    const leaderboard = feuds.map((feud, index) => ({
      rank: index + 1,
      feudId: feud.id,
      name: feud.name,
      level: feud.level,
      culture: feud.culture,
      prosperity: feud.madeira + feud.pedra + feud.ferro + feud.comida + feud.cobre,
    }));

    res.json({
      success: true,
      data: {
        type: 'prosperity',
        leaderboard,
      },
    });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving leaderboard',
    });
  }
}

async function createFeud(req, res) {
  try {
    const userId = req.user.id;
    const { name, culture } = req.body;

    // Validação
    if (!name || !culture) {
      return res.status(400).json({
        success: false,
        error: ERROR_CODES.MISSING_FIELD,
        message: 'Name and culture are required',
      });
    }

    // Checar se usuário já tem um feudo
    const existingFeud = await Feud.findByUserId(userId);
    if (existingFeud) {
      return res.status(409).json({
        success: false,
        error: ERROR_CODES.FEUD_EXISTS,
        message: 'User already has a feud',
      });
    }

    // Criar novo feudo
    const feud = await Feud.create({
      user_id: userId,
      name,
      culture,
      level: 1,
    });

    const productionInfo = await ResourceService.getProductionInfo(feud.id);

    res.status(201).json({
      success: true,
      message: 'Feud created successfully',
      data: productionInfo,
    });
  } catch (error) {
    console.error('Error creating feud:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error creating feud',
    });
  }
}

/**
 * POST /api/feud/:id/reset-resources
 * DEBUG: Reseta recursos do feudo aos valores iniciais
 */
async function resetFieudResources(req, res) {
  try {
    const feudId = req.params.id;
    const userId = req.user.id;

    // Verificar se o feudo pertence ao usuário
    const feud = await Feud.findById(feudId);
    if (!feud || feud.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Unauthorized',
      });
    }

    // Reset para recursos iniciais
    const { INITIAL_RESOURCES } = require('../config/constants');
    const updatedFeud = await Feud.updateResources(feudId, INITIAL_RESOURCES);

    res.json({
      success: true,
      message: 'Resources reset to initial values',
      data: updatedFeud,
    });
  } catch (error) {
    console.error('Error resetting resources:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error resetting resources',
    });
  }
}

/**
 * DELETE /api/feud/:id
 * DEBUG: Deleta um feudo (apenas para testes)
 */
async function deleteFeud(req, res) {
  try {
    const feudId = req.params.id;
    const userId = req.user.id;

    // Buscar feudo
    const feud = await Feud.findById(feudId);
    if (!feud) {
      return res.status(404).json({
        success: false,
        error: ERROR_CODES.FEUD_NOT_FOUND,
        message: 'Feud not found',
      });
    }

    // Verificar se o feudo pertence ao usuário
    if (feud.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Unauthorized',
      });
    }

    // Deletar o feudo
    await Feud.delete(feudId);

    res.json({
      success: true,
      message: 'Feud deleted successfully',
      feudId: feudId,
    });
  } catch (error) {
    console.error('Error deleting feud:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error deleting feud',
    });
  }
}

module.exports = {
  getMyFeud,
  getFeudById,
  getFeudResources,
  getFeudProduction,
  getFeudHistory,
  collectResources,
  getLeaderboard,
  createFeud,
  resetFieudResources,
  deleteFeud,
};
