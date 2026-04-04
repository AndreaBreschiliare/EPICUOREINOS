const Cargo = require('../models/Cargo');
const Feud = require('../models/Feud');
const { CARGO_DATA } = require('../config/cargoConfig');

async function ensureCargoCatalog(feudId) {
  for (const [cargoName, cargoData] of Object.entries(CARGO_DATA)) {
    const existing = await Cargo.findByFeudIdAndCargoName(feudId, cargoName);
    if (!existing) {
      await Cargo.create({
        feud_id: feudId,
        cargo_name: cargoName,
        holder_name: null,
        is_npc: false,
        bonus_tipo: cargoData.bonusType,
        bonus_valor: cargoData.bonusValue,
        active: false,
      });
    }
  }
}

async function getFeudCargos(feudId) {
  const feud = await Feud.findById(feudId);
  if (!feud) {
    throw new Error('FEUD_NOT_FOUND');
  }

  await ensureCargoCatalog(feudId);
  const cargos = await Cargo.findByFeudId(feudId);

  const mapped = cargos.map(cargo => {
    const data = CARGO_DATA[cargo.cargo_name] || {};
    return {
      ...cargo,
      displayName: data.name || cargo.cargo_name,
      description: data.description || null,
      levelRequired: data.levelRequired || 1,
      availableByLevel: feud.level >= (data.levelRequired || 1),
    };
  });

  return {
    feudId,
    feudLevel: feud.level,
    total: mapped.length,
    active: mapped.filter(cargo => cargo.active).length,
    cargos: mapped,
  };
}

async function getAvailableCargos(feudId) {
  const feud = await Feud.findById(feudId);
  if (!feud) {
    throw new Error('FEUD_NOT_FOUND');
  }

  await ensureCargoCatalog(feudId);
  const cargos = await Cargo.findByFeudId(feudId);
  const byName = cargos.reduce((acc, cargo) => {
    acc[cargo.cargo_name] = cargo;
    return acc;
  }, {});

  const available = Object.entries(CARGO_DATA).map(([cargoName, cargoData]) => {
    const cargoRow = byName[cargoName];
    const levelOk = feud.level >= cargoData.levelRequired;
    const isAssigned = cargoRow ? !!cargoRow.active : false;

    return {
      cargoName,
      name: cargoData.name,
      description: cargoData.description,
      levelRequired: cargoData.levelRequired,
      bonusType: cargoData.bonusType,
      bonusValue: cargoData.bonusValue,
      assignedTo: cargoRow ? cargoRow.holder_name : null,
      canAssign: levelOk && !isAssigned,
      reason: !levelOk
        ? `FEUD_LEVEL_${cargoData.levelRequired}_REQUIRED`
        : isAssigned
        ? 'CARGO_ALREADY_ASSIGNED'
        : null,
    };
  });

  return {
    feudId,
    total: available.length,
    available,
  };
}

async function assignCargo(feudId, cargoName, holderName, isNpc = false) {
  if (!holderName || holderName.trim().length < 2) {
    throw new Error('INVALID_HOLDER_NAME');
  }

  const feud = await Feud.findById(feudId);
  if (!feud) {
    throw new Error('FEUD_NOT_FOUND');
  }

  const cargoData = CARGO_DATA[cargoName];
  if (!cargoData) {
    throw new Error('INVALID_CARGO_NAME');
  }

  if (feud.level < cargoData.levelRequired) {
    throw new Error(`LEVEL_REQUIRED_${cargoData.levelRequired}`);
  }

  await ensureCargoCatalog(feudId);
  const cargo = await Cargo.findByFeudIdAndCargoName(feudId, cargoName);
  if (!cargo) {
    throw new Error('CARGO_NOT_FOUND');
  }

  if (cargo.active) {
    throw new Error('CARGO_ALREADY_ASSIGNED');
  }

  const updated = await Cargo.assignHolder(cargo.id, holderName.trim(), !!isNpc);

  return {
    cargo: updated,
    bonusType: cargoData.bonusType,
    bonusValue: cargoData.bonusValue,
  };
}

async function removeCargo(feudId, cargoName) {
  const feud = await Feud.findById(feudId);
  if (!feud) {
    throw new Error('FEUD_NOT_FOUND');
  }

  await ensureCargoCatalog(feudId);
  const cargo = await Cargo.findByFeudIdAndCargoName(feudId, cargoName);
  if (!cargo) {
    throw new Error('CARGO_NOT_FOUND');
  }

  if (!cargo.active) {
    throw new Error('CARGO_ALREADY_EMPTY');
  }

  const updated = await Cargo.removeHolder(cargo.id);

  return {
    cargo: updated,
  };
}

module.exports = {
  getFeudCargos,
  getAvailableCargos,
  assignCargo,
  removeCargo,
};
