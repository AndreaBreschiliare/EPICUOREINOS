const Feud = require('../models/Feud');
const Research = require('../models/Research');
const ResearchService = require('../services/ResearchService');
const { ERROR_CODES } = require('../config/constants');

async function ensureFeudOwner(feudId, userId) {
  const feud = await Feud.findById(feudId);
  if (!feud || feud.user_id !== userId) {
    return null;
  }
  return feud;
}

async function listResearch(req, res) {
  try {
    const feudId = req.params.feudId;
    const feud = await ensureFeudOwner(feudId, req.user.id);

    if (!feud) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Access denied',
      });
    }

    const research = await Research.findByFeudId(feudId);

    res.json({
      success: true,
      data: {
        feudId,
        research,
        total: research.length,
      },
    });
  } catch (error) {
    console.error('Error listing research:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving research list',
    });
  }
}

async function getResearchTree(req, res) {
  try {
    const feudId = req.params.feudId;
    const feud = await ensureFeudOwner(feudId, req.user.id);

    if (!feud) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Access denied',
      });
    }

    const result = await ResearchService.buildResearchTree(feudId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error getting research tree:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving research tree',
    });
  }
}

async function getResearchProgress(req, res) {
  try {
    const feudId = req.params.feudId;
    const feud = await ensureFeudOwner(feudId, req.user.id);

    if (!feud) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Access denied',
      });
    }

    const result = await ResearchService.getResearchProgress(feudId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error getting research progress:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving research progress',
    });
  }
}

async function getAvailableResearch(req, res) {
  try {
    const feudId = req.params.feudId;
    const feud = await ensureFeudOwner(feudId, req.user.id);

    if (!feud) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Access denied',
      });
    }

    const available = await ResearchService.getAvailableResearch(feudId);

    res.json({
      success: true,
      data: {
        feudId,
        available,
        total: available.length,
      },
    });
  } catch (error) {
    console.error('Error getting available research:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving available research',
    });
  }
}

async function startResearch(req, res) {
  try {
    const feudId = req.params.feudId;
    const { techName } = req.body;

    if (!techName) {
      return res.status(400).json({
        success: false,
        error: ERROR_CODES.MISSING_FIELD,
        message: 'techName is required',
      });
    }

    const feud = await ensureFeudOwner(feudId, req.user.id);
    if (!feud) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Access denied',
      });
    }

    const result = await ResearchService.startResearch(feudId, techName);

    res.status(201).json({
      success: true,
      message: 'Research started successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error starting research for feud', feudId, 'tech', techName, ':', error.message);

    // Erros de negócio - Recursos insuficientes
    if (error.message.includes('INSUFFICIENT_RESOURCES')) {
      const details = error.message.replace('INSUFFICIENT_RESOURCES: ', '');
      return res.status(400).json({
        success: false,
        error: 'INSUFFICIENT_RESOURCES',
        message: `Recursos insuficientes para esta pesquisa. ${details}`,
      });
    }

    // Pesquisa inválida
    if (error.message.includes('INVALID_RESEARCH_TECH')) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_RESEARCH_TECH',
        message: `Pesquisa "${techName}" não foi encontrada no sistema`,
      });
    }

    // Requisitos não atendidos (edificios, pesquisas pré-requisitas, level)
    if (error.message.includes('REQUIREMENTS_NOT_MET')) {
      // Extrair detalhes já formatados do ResearchService
      const detailsMatch = error.message.match(/REQUIREMENTS_NOT_MET:\s*(.+)/);
      const details = detailsMatch ? detailsMatch[1] : 'Requisitos não atendidos';
      
      return res.status(400).json({
        success: false,
        error: 'REQUIREMENTS_NOT_MET',
        message: details,
      });
    }

    // Pesquisa já em andamento
    if (error.message.includes('RESEARCH_ALREADY_IN_PROGRESS')) {
      return res.status(409).json({
        success: false,
        error: 'RESEARCH_ALREADY_IN_PROGRESS',
        message: 'Você já possui uma pesquisa em andamento. Aguarde a conclusão.',
      });
    }

    // Pesquisa no nível máximo
    if (error.message.includes('MAX_RESEARCH_LEVEL_REACHED')) {
      return res.status(409).json({
        success: false,
        error: 'MAX_RESEARCH_LEVEL_REACHED',
        message: 'Esta pesquisa já atingiu o nível máximo',
      });
    }

    // Erro genérico
    res.status(500).json({
      success: false,
      error: 'RESEARCH_START_ERROR',
      message: error.message || 'Erro ao iniciar pesquisa',
    });
  }
}

module.exports = {
  listResearch,
  getResearchTree,
  getResearchProgress,
  getAvailableResearch,
  startResearch,
};
