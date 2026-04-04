const Law = require('../models/Law');
const Feud = require('../models/Feud');
const { LEVELS } = require('../config/constants');
const { LAW_DATA } = require('../config/lawConfig');

async function ensureLawCatalog(feudId) {
  for (const [lawName, lawData] of Object.entries(LAW_DATA)) {
    const existing = await Law.findByFeudIdAndLawName(feudId, lawName);
    if (!existing) {
      await Law.create({
        feud_id: feudId,
        law_name: lawName,
        category: lawData.category,
        level_required: lawData.levelRequired,
        status: 'inactive',
        effect_multipllier: lawData.effectMultiplier,
        effect_description: lawData.description,
      });
    }
  }
}

function getLawSlotsByLevel(feudLevel) {
  const levelConfig = LEVELS[feudLevel] || LEVELS[1];
  return levelConfig.slots.laws;
}

async function getFeudLaws(feudId) {
  const feud = await Feud.findById(feudId);
  if (!feud) {
    throw new Error('FEUD_NOT_FOUND');
  }

  await ensureLawCatalog(feudId);
  const laws = await Law.findByFeudId(feudId);
  const activeCount = laws.filter(law => law.status === 'active').length;
  const maxSlots = getLawSlotsByLevel(feud.level);

  const mapped = laws.map(law => {
    const data = LAW_DATA[law.law_name] || {};
    return {
      ...law,
      displayName: data.name || law.law_name,
      description: data.description || law.effect_description,
      availableByLevel: feud.level >= law.level_required,
    };
  });

  return {
    feudId,
    feudLevel: feud.level,
    slots: {
      max: maxSlots,
      active: activeCount,
      free: Math.max(0, maxSlots - activeCount),
    },
    laws: mapped,
  };
}

async function getAvailableLaws(feudId) {
  const feud = await Feud.findById(feudId);
  if (!feud) {
    throw new Error('FEUD_NOT_FOUND');
  }

  await ensureLawCatalog(feudId);
  const laws = await Law.findByFeudId(feudId);
  const activeCount = laws.filter(law => law.status === 'active').length;
  const maxSlots = getLawSlotsByLevel(feud.level);

  const available = laws.map(law => {
    const lawData = LAW_DATA[law.law_name] || {};
    const levelOk = feud.level >= law.level_required;
    const slotOk = activeCount < maxSlots || law.status === 'active';
    const canActivate = levelOk && slotOk && law.status !== 'active';

    return {
      lawName: law.law_name,
      name: lawData.name || law.law_name,
      description: lawData.description || law.effect_description,
      category: law.category,
      levelRequired: law.level_required,
      effectMultiplier: law.effect_multipllier,
      status: law.status,
      canActivate,
      reason: !levelOk
        ? `FEUD_LEVEL_${law.level_required}_REQUIRED`
        : law.status === 'active'
        ? 'LAW_ALREADY_ACTIVE'
        : !slotOk
        ? 'NO_LAW_SLOTS_AVAILABLE'
        : null,
    };
  });

  return {
    feudId,
    slots: {
      max: maxSlots,
      active: activeCount,
      free: Math.max(0, maxSlots - activeCount),
    },
    total: available.length,
    available,
  };
}

async function activateLaw(feudId, lawName) {
  const feud = await Feud.findById(feudId);
  if (!feud) {
    throw new Error('FEUD_NOT_FOUND');
  }

  await ensureLawCatalog(feudId);
  const law = await Law.findByFeudIdAndLawName(feudId, lawName);
  if (!law) {
    throw new Error('LAW_NOT_FOUND');
  }

  if (law.status === 'active') {
    throw new Error('LAW_ALREADY_ACTIVE');
  }

  if (feud.level < law.level_required) {
    throw new Error(`LEVEL_REQUIRED_${law.level_required}`);
  }

  const activeLaws = await Law.findActiveByFeudId(feudId);
  const maxSlots = getLawSlotsByLevel(feud.level);
  if (activeLaws.length >= maxSlots) {
    throw new Error('NO_LAW_SLOTS_AVAILABLE');
  }

  const updated = await Law.activateLaw(law.id);

  return {
    law: updated,
    slots: {
      max: maxSlots,
      active: activeLaws.length + 1,
      free: Math.max(0, maxSlots - (activeLaws.length + 1)),
    },
  };
}

async function deactivateLaw(feudId, lawName) {
  const feud = await Feud.findById(feudId);
  if (!feud) {
    throw new Error('FEUD_NOT_FOUND');
  }

  await ensureLawCatalog(feudId);
  const law = await Law.findByFeudIdAndLawName(feudId, lawName);
  if (!law) {
    throw new Error('LAW_NOT_FOUND');
  }

  if (law.status !== 'active') {
    throw new Error('LAW_ALREADY_INACTIVE');
  }

  const updated = await Law.deactivateLaw(law.id);
  const activeLaws = await Law.findActiveByFeudId(feudId);
  const maxSlots = getLawSlotsByLevel(feud.level);

  return {
    law: updated,
    slots: {
      max: maxSlots,
      active: activeLaws.length,
      free: Math.max(0, maxSlots - activeLaws.length),
    },
  };
}

module.exports = {
  getFeudLaws,
  getAvailableLaws,
  activateLaw,
  deactivateLaw,
};
