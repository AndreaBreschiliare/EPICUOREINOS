const Feud = require('../models/Feud');
const CargoService = require('../services/CargoService');
const { ERROR_CODES } = require('../config/constants');

async function ensureFeudOwner(feudId, userId) {
  const feud = await Feud.findById(feudId);
  if (!feud || feud.user_id !== userId) {
    return null;
  }
  return feud;
}

async function getFeudCargos(req, res) {
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

    const result = await CargoService.getFeudCargos(feudId);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting cargos:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving cargos',
    });
  }
}

async function getAvailableCargos(req, res) {
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

    const result = await CargoService.getAvailableCargos(feudId);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting available cargos:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving available cargos',
    });
  }
}

async function assignCargo(req, res) {
  try {
    const feudId = req.params.feudId;
    const cargoName = req.params.cargoName;
    const { holderName, isNpc = false } = req.body;

    const feud = await ensureFeudOwner(feudId, req.user.id);
    if (!feud) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Access denied',
      });
    }

    const result = await CargoService.assignCargo(feudId, cargoName, holderName, isNpc);
    res.status(201).json({
      success: true,
      message: 'Cargo assigned successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error assigning cargo:', error);

    const statusCode = error.message.includes('INVALID_')
      ? 400
      : error.message.includes('LEVEL_REQUIRED')
      ? 403
      : error.message.includes('ALREADY')
      ? 409
      : 500;

    res.status(statusCode).json({
      success: false,
      error: error.message,
      message: 'Error assigning cargo',
    });
  }
}

async function removeCargo(req, res) {
  try {
    const feudId = req.params.feudId;
    const cargoName = req.params.cargoName;

    const feud = await ensureFeudOwner(feudId, req.user.id);
    if (!feud) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Access denied',
      });
    }

    const result = await CargoService.removeCargo(feudId, cargoName);
    res.json({
      success: true,
      message: 'Cargo removed successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error removing cargo:', error);

    const statusCode = error.message.includes('NOT_FOUND')
      ? 404
      : error.message.includes('ALREADY')
      ? 409
      : 500;

    res.status(statusCode).json({
      success: false,
      error: error.message,
      message: 'Error removing cargo',
    });
  }
}

module.exports = {
  getFeudCargos,
  getAvailableCargos,
  assignCargo,
  removeCargo,
};
