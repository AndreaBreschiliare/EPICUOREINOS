const Feud = require('../models/Feud');
const Building = require('../models/Building');
const Research = require('../models/Research');
const ProductionCalculator = require('../utils/ProductionCalculator');
const {
  LEVEL_UP_REQUIREMENTS,
  MAX_FEUD_LEVEL,
} = require('../config/levelUpConfig');
const { emitToFeud } = require('../realtime/socketServer');

const PRODUCTION_BUILDING_TYPES = ['fazenda', 'lenhador', 'minerador'];

function countBuildingsAtRequirement(buildings, requirement) {
  return buildings.filter(
    building =>
      building.status === 'complete' &&
      building.type === requirement.type &&
      building.level >= requirement.minLevel
  ).length;
}

function buildInfrastructureStatus(requirements, buildings) {
  const byBuilding = requirements.infrastructure.buildings.map(requirement => {
    const current = countBuildingsAtRequirement(buildings, requirement);
    const met = current >= requirement.minCount;

    return {
      type: requirement.type,
      minLevel: requirement.minLevel,
      requiredCount: requirement.minCount,
      currentCount: current,
      met,
    };
  });

  const productionCurrent = buildings.filter(
    building =>
      building.status === 'complete' &&
      PRODUCTION_BUILDING_TYPES.includes(building.type)
  ).length;

  const productionRequired = requirements.infrastructure.productionBuildingsMinCount || 0;

  const productionStatus = {
    requiredCount: productionRequired,
    currentCount: productionCurrent,
    met: productionCurrent >= productionRequired,
  };

  const met = byBuilding.every(item => item.met) && productionStatus.met;

  return {
    met,
    byBuilding,
    productionBuildings: productionStatus,
  };
}

function buildSocialStatus(requirements, feud, productionInfo) {
  const social = requirements.social;
  const checks = {
    minPopulation: {
      required: social.minPopulation || 0,
      current: feud.população || 0,
      met: (feud.população || 0) >= (social.minPopulation || 0),
    },
  };

  if (social.positiveFoodBalance) {
    checks.positiveFoodBalance = {
      currentNet: productionInfo.netProduction.comida,
      met: productionInfo.netProduction.comida > 0,
    };
  }

  if (social.positiveCopperBalance) {
    checks.positiveCopperBalance = {
      currentNet: productionInfo.netProduction.cobre,
      met: productionInfo.netProduction.cobre > 0,
    };
  }

  return {
    met: Object.values(checks).every(item => item.met),
    checks,
  };
}

function buildKnowledgeStatus(requirements, completedResearch) {
  const required = requirements.knowledge.minCompletedResearch || 0;
  const current = completedResearch.length;

  return {
    met: current >= required,
    requiredCount: required,
    currentCount: current,
  };
}

function applyRewardsToFeud(feud, rewards) {
  return {
    madeira: feud.madeira + (rewards.madeira || 0),
    pedra: feud.pedra + (rewards.pedra || 0),
    ferro: feud.ferro + (rewards.ferro || 0),
    comida: feud.comida + (rewards.comida || 0),
    cobre: feud.cobre + (rewards.cobre || 0),
    pergaminhos: feud.pergaminhos + (rewards.pergaminhos || 0),
    cristais: feud.cristais + (rewards.cristais || 0),
    minério_raro: feud.minério_raro + (rewards.minério_raro || 0),
    moral: Math.min(100, (feud.moral || 50) + (rewards.moral || 0)),
  };
}

async function getLevelUpStatus(feudId) {
  const feud = await Feud.findById(feudId);
  if (!feud) {
    throw new Error('FEUD_NOT_FOUND');
  }

  if (feud.level >= MAX_FEUD_LEVEL) {
    return {
      feudId,
      currentLevel: feud.level,
      maxLevel: MAX_FEUD_LEVEL,
      canLevelUp: false,
      alreadyMaxLevel: true,
      targetLevel: feud.level,
      requirements: null,
    };
  }

  const targetLevel = feud.level + 1;
  const requirements = LEVEL_UP_REQUIREMENTS[targetLevel];
  if (!requirements) {
    throw new Error('LEVEL_CONFIG_NOT_FOUND');
  }

  const buildings = await Building.findByFeudId(feudId);
  const completedResearch = await Research.findCompletedByFeudId(feudId);
  const productionInfo = await require('./ResourceService').getProductionInfo(feudId);

  const infrastructure = buildInfrastructureStatus(requirements, buildings);
  const social = buildSocialStatus(requirements, feud, productionInfo);
  const knowledge = buildKnowledgeStatus(requirements, completedResearch);

  const tribute = {
    required: requirements.tribute,
    hasEnough: ProductionCalculator.hasEnoughResources(feud, requirements.tribute),
    currentResources: {
      madeira: feud.madeira,
      pedra: feud.pedra,
      ferro: feud.ferro,
      comida: feud.comida,
      cobre: feud.cobre,
      pergaminhos: feud.pergaminhos,
      cristais: feud.cristais,
      minério_raro: feud.minério_raro,
    },
  };

  const canLevelUp =
    infrastructure.met &&
    social.met &&
    knowledge.met &&
    tribute.hasEnough;

  return {
    feudId,
    currentLevel: feud.level,
    targetLevel,
    title: requirements.title,
    canLevelUp,
    alreadyMaxLevel: false,
    requirements: {
      infrastructure,
      social,
      knowledge,
      tribute,
    },
    rewards: requirements.rewards,
  };
}

async function levelUpFeud(feudId) {
  const status = await getLevelUpStatus(feudId);
  if (status.alreadyMaxLevel) {
    throw new Error('MAX_LEVEL_REACHED');
  }

  if (!status.canLevelUp) {
    throw new Error('LEVEL_UP_REQUIREMENTS_NOT_MET');
  }

  const feud = await Feud.findById(feudId);
  const tributeCost = status.requirements.tribute.required;

  const afterTribute = ProductionCalculator.subtractResources(feud, tributeCost);
  await Feud.updateResources(feudId, afterTribute);

  const leveledFeud = await Feud.levelUp(feudId, status.targetLevel);
  const rewardsApplied = applyRewardsToFeud(leveledFeud, status.rewards || {});

  const updated = await Feud.update(feudId, rewardsApplied);

  emitToFeud(feudId, 'resources:updated', {
    source: 'level_up',
    resources: {
      madeira: updated.madeira,
      pedra: updated.pedra,
      ferro: updated.ferro,
      comida: updated.comida,
      cobre: updated.cobre,
      pergaminhos: updated.pergaminhos,
      cristais: updated.cristais,
      minério_raro: updated.minério_raro,
    },
    tributePaid: tributeCost,
    rewardsReceived: status.rewards,
  });
  emitToFeud(feudId, 'feud:level_up', {
    previousLevel: status.currentLevel,
    newLevel: status.targetLevel,
    title: status.title,
    rewardsReceived: status.rewards,
  });

  return {
    feudId,
    previousLevel: status.currentLevel,
    newLevel: status.targetLevel,
    title: status.title,
    tributePaid: tributeCost,
    rewardsReceived: status.rewards,
    feud: updated,
  };
}

module.exports = {
  getLevelUpStatus,
  levelUpFeud,
};
