const Feud = require('../models/Feud');
const LawService = require('../services/LawService');
const { ERROR_CODES } = require('../config/constants');

async function ensureFeudOwner(feudId, userId) {
  const feud = await Feud.findById(feudId);
  if (!feud || feud.user_id !== userId) {
    return null;
  }
  return feud;
}

async function getFeudLaws(req, res) {
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

    const result = await LawService.getFeudLaws(feudId);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting laws:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving laws',
    });
  }
}

async function getAvailableLaws(req, res) {
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

    const result = await LawService.getAvailableLaws(feudId);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting available laws:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving available laws',
    });
  }
}

async function activateLaw(req, res) {
  try {
    const feudId = req.params.feudId;
    const lawName = req.params.lawName;

    const feud = await ensureFeudOwner(feudId, req.user.id);
    if (!feud) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Access denied',
      });
    }

    const result = await LawService.activateLaw(feudId, lawName);
    res.status(201).json({
      success: true,
      message: 'Law activated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error activating law:', error);

    const statusCode = error.message.includes('NO_LAW_SLOTS_AVAILABLE')
      ? 409
      : error.message.includes('ALREADY_ACTIVE')
      ? 409
      : error.message.includes('NOT_FOUND')
      ? 404
      : error.message.includes('LEVEL_REQUIRED')
      ? 403
      : 500;

    res.status(statusCode).json({
      success: false,
      error: error.message,
      message: 'Error activating law',
    });
  }
}

async function deactivateLaw(req, res) {
  try {
    const feudId = req.params.feudId;
    const lawName = req.params.lawName;

    const feud = await ensureFeudOwner(feudId, req.user.id);
    if (!feud) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Access denied',
      });
    }

    const result = await LawService.deactivateLaw(feudId, lawName);
    res.json({
      success: true,
      message: 'Law deactivated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error deactivating law:', error);

    const statusCode = error.message.includes('ALREADY_INACTIVE')
      ? 409
      : error.message.includes('NOT_FOUND')
      ? 404
      : 500;

    res.status(statusCode).json({
      success: false,
      error: error.message,
      message: 'Error deactivating law',
    });
  }
}

module.exports = {
  getFeudLaws,
  getAvailableLaws,
  activateLaw,
  deactivateLaw,
};
