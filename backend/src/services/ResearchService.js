const Research = require('../models/Research');
const Feud = require('../models/Feud');
const Building = require('../models/Building');
const ProductionCalculator = require('../utils/ProductionCalculator');
const {
  RESEARCH_DATA,
  calculateResearchCost,
  calculateResearchTime,
} = require('../config/researchConfig');
const { emitToFeud } = require('../realtime/socketServer');

function getResearchByTech(researchList) {
  return researchList.reduce((acc, item) => {
    acc[item.tech_name] = item;
    return acc;
  }, {});
}

function getBestBuildingLevels(buildings) {
  return buildings.reduce((acc, building) => {
    if (building.status !== 'complete') return acc;

    if (!acc[building.type] || building.level > acc[building.type]) {
      acc[building.type] = building.level;
    }

    return acc;
  }, {});
}

function evaluateRequirements(techData, feud, researchByTech, buildingLevels) {
  const reasons = [];

  if (feud.level < techData.feudLevelRequired) {
    reasons.push(`FEUD_LEVEL_${techData.feudLevelRequired}_REQUIRED`);
  }

  if (techData.requiresResearch) {
    for (const requirement of techData.requiresResearch) {
      const currentResearch = researchByTech[requirement.tech];
      if (!currentResearch || currentResearch.level < requirement.level) {
        reasons.push(
          `RESEARCH_${requirement.tech.toUpperCase()}_LEVEL_${requirement.level}_REQUIRED`
        );
      }
    }
  }

  if (techData.requiresBuilding) {
    const { type, level } = techData.requiresBuilding;
    const currentLevel = buildingLevels[type] || 0;

    if (currentLevel < level) {
      reasons.push(`BUILDING_${type.toUpperCase()}_LEVEL_${level}_REQUIRED`);
    }
  }

  return {
    met: reasons.length === 0,
    reasons,
  };
}

async function completeFinishedResearch(feudId) {
  const inProgress = await Research.findActiveByFeudId(feudId);
  const now = new Date();

  for (const research of inProgress) {
    if (research.research_end_time && now >= research.research_end_time) {
      await Research.completeResearch(research.id);
      emitToFeud(feudId, 'research:completed', {
        researchId: research.id,
        techName: research.tech_name,
        level: research.level,
      });
    }
  }
}

async function buildResearchTree(feudId) {
  const feud = await Feud.findById(feudId);
  if (!feud) {
    throw new Error('FEUD_NOT_FOUND');
  }

  await completeFinishedResearch(feudId);

  const researchList = await Research.findByFeudId(feudId);
  const researchByTech = getResearchByTech(researchList);
  const buildingLevels = getBestBuildingLevels(await Building.findByFeudId(feudId));
  const hasActiveResearch = researchList.some(item => item.status === 'in_progress');

  const tree = Object.entries(RESEARCH_DATA).map(([techName, techData]) => {
    const currentResearch = researchByTech[techName];
    const currentLevel = currentResearch ? currentResearch.level : 0;
    const isAtMaxLevel = currentLevel >= techData.maxLevel;
    const nextLevel = isAtMaxLevel ? currentLevel : currentLevel + 1;

    const requirements = evaluateRequirements(
      techData,
      feud,
      researchByTech,
      buildingLevels
    );

    const nextCost = isAtMaxLevel ? null : calculateResearchCost(techName, nextLevel);
    const nextTime = isAtMaxLevel ? null : calculateResearchTime(techName, nextLevel);
    const hasResources = nextCost
      ? ProductionCalculator.hasEnoughResources(feud, nextCost)
      : true;

    const canStart =
      !isAtMaxLevel &&
      !hasActiveResearch &&
      (!currentResearch || currentResearch.status !== 'in_progress') &&
      requirements.met &&
      hasResources;

    return {
      techName,
      name: techData.name,
      description: techData.description,
      category: techData.category,
      currentLevel,
      maxLevel: techData.maxLevel,
      status: currentResearch ? currentResearch.status : 'not_started',
      isAtMaxLevel,
      nextLevel,
      nextCost,
      nextTime,
      effects: techData.effects,
      canStart,
      requirements,
      hasResources,
      researchEndTime: currentResearch ? currentResearch.research_end_time : null,
    };
  });

  return {
    feudId,
    tree,
  };
}

async function startResearch(feudId, techName) {
  const feud = await Feud.findById(feudId);
  if (!feud) {
    throw new Error('FEUD_NOT_FOUND');
  }

  const techData = RESEARCH_DATA[techName];
  if (!techData) {
    throw new Error('INVALID_RESEARCH_TECH');
  }

  await completeFinishedResearch(feudId);

  const activeResearch = await Research.findActiveByFeudId(feudId);
  if (activeResearch.length > 0) {
    throw new Error('RESEARCH_ALREADY_IN_PROGRESS');
  }

  const currentResearch = await Research.findByFeudIdAndTechName(feudId, techName);
  const currentLevel = currentResearch ? currentResearch.level : 0;

  if (currentLevel >= techData.maxLevel) {
    throw new Error('MAX_RESEARCH_LEVEL_REACHED');
  }

  const researchByTech = getResearchByTech(await Research.findByFeudId(feudId));
  const buildingLevels = getBestBuildingLevels(await Building.findByFeudId(feudId));
  const requirements = evaluateRequirements(techData, feud, researchByTech, buildingLevels);

  if (!requirements.met) {
    // Criar mensagem detalhada com requisitos não atendidos
    const missingReqs = [];
    
    for (const reason of requirements.reasons) {
      if (reason.includes('FEUD_LEVEL')) {
        const level = reason.match(/\d+/)[0];
        missingReqs.push(`Nível do feudo: precisa Nível ${level}, você tem Nível ${feud.level}`);
      } else if (reason.includes('RESEARCH_')) {
        const match = reason.match(/RESEARCH_(.+?)_LEVEL_(\d+)/);
        if (match) {
          missingReqs.push(`Pesquisa prévia: ${match[1]} Nível ${match[2]} não completada`);
        }
      } else if (reason.includes('BUILDING_')) {
        const match = reason.match(/BUILDING_(.+?)_LEVEL_(\d+)/);
        if (match) {
          const buildType = match[1];
          const needLevel = match[2];
          const hasLevel = buildingLevels[buildType.toLowerCase()] || 0;
          missingReqs.push(`Construção: ${buildType} Nível ${needLevel} necessária (você tem Nível ${hasLevel})`);
        }
      }
    }
    
    const errorDetails = missingReqs.join(' | ');
    throw new Error(`REQUIREMENTS_NOT_MET: ${errorDetails}`);
  }

  const nextLevel = currentLevel + 1;
  const cost = calculateResearchCost(techName, nextLevel);
  if (!ProductionCalculator.hasEnoughResources(feud, cost)) {
    // Criar mensagem detalhada com o que falta
    const missing = {};
    for (const resource in cost) {
      if (cost[resource] > (feud[resource] || 0)) {
        missing[resource] = {
          needed: cost[resource],
          available: feud[resource] || 0,
          deficit: cost[resource] - (feud[resource] || 0),
        };
      }
    }
    const errorDetails = Object.entries(missing)
      .map(([res, data]) => `${res}: precisa ${data.needed}, tem ${data.available} (falta ${data.deficit})`)
      .join(' | ');
    throw new Error(`INSUFFICIENT_RESOURCES: ${errorDetails}`);
  }

  const updatedResources = ProductionCalculator.subtractResources(feud, cost);
  const feudAfterSpend = await Feud.updateResources(feudId, updatedResources);

  const researchTime = calculateResearchTime(techName, nextLevel);
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + researchTime * 1000);

  let research;
  if (currentResearch) {
    research = await Research.update(currentResearch.id, {
      level: nextLevel,
      status: 'in_progress',
      research_start_time: startTime,
      research_end_time: endTime,
    });
  } else {
    research = await Research.create({
      feud_id: feudId,
      tech_name: techName,
      level: nextLevel,
      status: 'in_progress',
      research_start_time: startTime,
      research_end_time: endTime,
    });
  }

  emitToFeud(feudId, 'resources:updated', {
    source: 'research_start',
    resources: {
      madeira: feudAfterSpend.madeira,
      pedra: feudAfterSpend.pedra,
      ferro: feudAfterSpend.ferro,
      comida: feudAfterSpend.comida,
      cobre: feudAfterSpend.cobre,
      pergaminhos: feudAfterSpend.pergaminhos,
      cristais: feudAfterSpend.cristais,
      minério_raro: feudAfterSpend.minério_raro,
    },
    cost,
  });
  emitToFeud(feudId, 'research:started', {
    research,
    cost,
    researchTime,
    endTime,
  });

  return {
    research,
    cost,
    researchTime,
    endTime,
  };
}

async function getResearchProgress(feudId) {
  await completeFinishedResearch(feudId);

  const allResearch = await Research.findByFeudId(feudId);
  const now = new Date();

  const active = allResearch
    .filter(item => item.status === 'in_progress')
    .map(item => ({
      ...item,
      remainingSeconds: Math.max(
        0,
        Math.floor((new Date(item.research_end_time).getTime() - now.getTime()) / 1000)
      ),
    }));

  const completed = allResearch
    .filter(item => item.status === 'complete')
    .map(item => ({
      tech_name: item.tech_name,
      level: item.level,
      completed_at: item.updated_at,
    }));

  return {
    feudId,
    summary: {
      total: allResearch.length,
      completed: completed.length,
      inProgress: active.length,
    },
    active,
    completed,
  };
}

async function getAvailableResearch(feudId) {
  const treeData = await buildResearchTree(feudId);
  return treeData.tree.filter(item => !item.isAtMaxLevel);
}

module.exports = {
  buildResearchTree,
  startResearch,
  getResearchProgress,
  getAvailableResearch,
};
