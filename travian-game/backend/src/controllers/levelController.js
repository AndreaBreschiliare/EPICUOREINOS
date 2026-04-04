const Feud = require('../models/Feud');
const LevelUpService = require('../services/LevelUpService');
const { ERROR_CODES } = require('../config/constants');

async function ensureFeudOwner(feudId, userId) {
  const feud = await Feud.findById(feudId);
  if (!feud || feud.user_id !== userId) {
    return null;
  }
  return feud;
}

async function getLevelUpStatus(req, res) {
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

    const result = await LevelUpService.getLevelUpStatus(feudId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error getting level-up status:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving level-up status',
    });
  }
}

async function levelUpFeud(req, res) {
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

    const result = await LevelUpService.levelUpFeud(feudId);

    res.json({
      success: true,
      message: 'Feud leveled up successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error leveling up feud:', error);

    const statusCode = error.message.includes('MAX_LEVEL')
      ? 409
      : error.message.includes('REQUIREMENTS_NOT_MET')
      ? 400
      : 500;

    res.status(statusCode).json({
      success: false,
      error: error.message,
      message: 'Error leveling up feud',
    });
  }
}

module.exports = {
  getLevelUpStatus,
  levelUpFeud,
};
