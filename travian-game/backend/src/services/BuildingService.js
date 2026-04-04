/**
 * Building Service
 * Gerencia construção, upgrade e demolição de edifícios
 */

const Building = require('../models/Building');
const Feud = require('../models/Feud');
const ProductionCalculator = require('../utils/ProductionCalculator');
const BuildingConfig = require('../config/buildingConfig');
const { emitToFeud } = require('../realtime/socketServer');

/**
 * Checks se é possível construir um edifício
 * Retorna { valid: bool, error?: string }
 */
async function validateBuild(feudId, buildingType, level = 1) {
  try {
    // 1. Validar tipo de edifício
    if (!BuildingConfig.BUILDING_DATA[buildingType]) {
      return { valid: false, error: 'INVALID_BUILDING_TYPE' };
    }

    // 2. Buscar feudo
    const feud = await Feud.findById(feudId);
    if (!feud) {
      return { valid: false, error: 'FEUD_NOT_FOUND' };
    }

    // 3. Validar nível mínimo do feudo
    const buildingData = BuildingConfig.BUILDING_DATA[buildingType];
    if (feud.level < buildingData.levelRequired) {
      return {
        valid: false,
        error: `LEVEL_REQUIRED_${buildingData.levelRequired}`,
      };
    }

    // 4. Calcular custo
    const cost = BuildingConfig.calculateBuildingCost(buildingType, level);

    // 5. Validar recursos
    const hasResources = ProductionCalculator.hasEnoughResources(feud, cost);
    if (!hasResources) {
      return { valid: false, error: 'INSUFFICIENT_RESOURCES' };
    }

    // 6. Validar limite de casas (máximo uma por tipo de nível)
    if (buildingType === BuildingConfig.BUILDING_TYPES.CASA) {
      const existingHouses = await Building.findByFeudIdAndType(
        feudId,
        BuildingConfig.BUILDING_TYPES.CASA
      );
      // Limite de 5 casas por feudo
      if (existingHouses.length >= 5) {
        return { valid: false, error: 'MAX_HOUSES_REACHED' };
      }
    }

    return {
      valid: true,
      cost,
      time: BuildingConfig.calculateConstructionTime(buildingType, level),
    };
  } catch (error) {
    console.error('[BuildingService] Error validating build:', error);
    return { valid: false, error: 'INTERNAL_ERROR' };
  }
}

/**
 * Inicia construção de um edifício
 */
async function startBuilding(feudId, buildingType, level = 1) {
  try {
    // 1. Validar
    const validation = await validateBuild(feudId, buildingType, level);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // 2. Buscar feudo
    const feud = await Feud.findById(feudId);

    // 3. Subtrair recursos
    const updatedResources = ProductionCalculator.subtractResources(
      feud,
      validation.cost
    );

    // 4. Atualizar feudo
    const feudAfterSpend = await Feud.updateResources(feudId, updatedResources);

    // 5. Criar construção com timer
    const now = new Date();
    const endTime = new Date(now.getTime() + validation.time * 1000);

    const building = await Building.create({
      feud_id: feudId,
      type: buildingType,
      level,
      status: 'construction',
      construction_start_time: now,
      construction_end_time: endTime,
    });

    emitToFeud(feudId, 'resources:updated', {
      source: 'building_start',
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
    });
    emitToFeud(feudId, 'building:started', {
      building,
      cost: validation.cost,
      constructionTime: validation.time,
      endTime,
    });

    return {
      building,
      cost: validation.cost,
      constructionTime: validation.time,
      endTime,
    };
  } catch (error) {
    console.error('[BuildingService] Error starting building:', error);
    throw error;
  }
}

/**
 * Completa uma construção (chamado manualmente ou por timer)
 */
async function completeBuilding(buildingId) {
  try {
    const building = await Building.findById(buildingId);
    if (!building) {
      throw new Error('BUILDING_NOT_FOUND');
    }

    // Finalizar construção
    const updated = await Building.update(buildingId, { status: 'complete' });

    emitToFeud(building.feud_id, 'building:completed', {
      building: updated,
    });

    return updated;
  } catch (error) {
    console.error('[BuildingService] Error completing building:', error);
    throw error;
  }
}

/**
 * Faz upgrade de um edifício existente
 */
async function upgradeBuilding(buildingId) {
  try {
    const building = await Building.findById(buildingId);
    if (!building) {
      throw new Error('BUILDING_NOT_FOUND');
    }

    // Verificar se já está no máximo nível
    const buildingData = BuildingConfig.BUILDING_DATA[building.type];
    if (building.level >= buildingData.maxLevel) {
      throw new Error('MAX_LEVEL_REACHED');
    }

    // Novo nível
    const newLevel = building.level + 1;

    // Validar upgrade
    const validation = await validateBuild(building.feud_id, building.type, newLevel);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Subtrair recursos
    const feud = await Feud.findById(building.feud_id);
    const updatedResources = ProductionCalculator.subtractResources(
      feud,
      validation.cost
    );
    const feudAfterSpend = await Feud.updateResources(building.feud_id, updatedResources);

    // Iniciar construção de upgrade
    const now = new Date();
    const endTime = new Date(now.getTime() + validation.time * 1000);

    const upgraded = await Building.update(buildingId, {
      level: newLevel,
      status: 'construction',
      construction_start_time: now,
      construction_end_time: endTime,
    });

    emitToFeud(building.feud_id, 'resources:updated', {
      source: 'building_upgrade',
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
    });
    emitToFeud(building.feud_id, 'building:upgraded', {
      building: upgraded,
      newLevel,
      cost: validation.cost,
      constructionTime: validation.time,
      endTime,
    });

    return {
      building: upgraded,
      newLevel,
      cost: validation.cost,
      constructionTime: validation.time,
      endTime,
    };
  } catch (error) {
    console.error('[BuildingService] Error upgrading building:', error);
    throw error;
  }
}

/**
 * Demolir um edifício
 * Retorna 50% dos recursos investidos
 */
async function demolishBuilding(buildingId) {
  try {
    const building = await Building.findById(buildingId);
    if (!building) {
      throw new Error('BUILDING_NOT_FOUND');
    }

    // Não demolir se está em construção
    if (building.status === 'construction') {
      throw new Error('CANNOT_DEMOLISH_DURING_CONSTRUCTION');
    }

    // Calcular refund (50% dos custos totais investidos)
    const baseCost = BuildingConfig.calculateBuildingCost(building.type, 1);
    const totalCost = {
      madeira: Math.floor(baseCost.madeira * Math.pow(1.1, building.level - 1) * 0.5),
      pedra: Math.floor(baseCost.pedra * Math.pow(1.1, building.level - 1) * 0.5),
      ferro: Math.floor(baseCost.ferro * Math.pow(1.1, building.level - 1) * 0.5),
      cobre: Math.floor(baseCost.cobre * Math.pow(1.1, building.level - 1) * 0.5),
      pergaminhos: Math.floor(baseCost.pergaminhos * Math.pow(1.1, building.level - 1) * 0.5),
      comida: 0,
    };

    // Retornar recursos
    const feud = await Feud.findById(building.feud_id);
    const updatedResources = {
      madeira: feud.madeira + totalCost.madeira,
      pedra: feud.pedra + totalCost.pedra,
      ferro: feud.ferro + totalCost.ferro,
      comida: feud.comida,
      cobre: feud.cobre + totalCost.cobre,
      pergaminhos: feud.pergaminhos + totalCost.pergaminhos,
      cristais: feud.cristais,
      minério_raro: feud.minério_raro,
    };

    const feudAfterRefund = await Feud.updateResources(building.feud_id, updatedResources);

    // Deletar edifício
    await Building.delete(buildingId);

    emitToFeud(building.feud_id, 'resources:updated', {
      source: 'building_demolish',
      resources: {
        madeira: feudAfterRefund.madeira,
        pedra: feudAfterRefund.pedra,
        ferro: feudAfterRefund.ferro,
        comida: feudAfterRefund.comida,
        cobre: feudAfterRefund.cobre,
        pergaminhos: feudAfterRefund.pergaminhos,
        cristais: feudAfterRefund.cristais,
        minério_raro: feudAfterRefund.minério_raro,
      },
      refund: totalCost,
    });
    emitToFeud(building.feud_id, 'building:demolished', {
      buildingId: building.id,
      type: building.type,
      level: building.level,
      refund: totalCost,
    });

    return {
      demolished: building,
      refund: totalCost,
    };
  } catch (error) {
    console.error('[BuildingService] Error demolishing building:', error);
    throw error;
  }
}

/**
 * Retorna lista de construções possíveis para um feudo
 */
async function getAvailableBuildings(feudId) {
  try {
    const feud = await Feud.findById(feudId);
    if (!feud) {
      throw new Error('FEUD_NOT_FOUND');
    }

    const available = [];

    for (const [buildingType, buildingData] of Object.entries(BuildingConfig.BUILDING_DATA)) {
      if (feud.level >= buildingData.levelRequired) {
        const cost = BuildingConfig.calculateBuildingCost(buildingType, 1);
        const time = BuildingConfig.calculateConstructionTime(buildingType, 1);

        available.push({
          type: buildingType,
          name: buildingData.name,
          description: buildingData.description,
          category: buildingData.category,
          levelRequired: buildingData.levelRequired,
          maxLevel: buildingData.maxLevel,
          costLevel1: cost,
          timeLevel1: time,
          canBuild: ProductionCalculator.hasEnoughResources(feud, cost),
        });
      }
    }

    return available;
  } catch (error) {
    console.error('[BuildingService] Error getting available buildings:', error);
    throw error;
  }
}

/**
 * Retorna lista completa de edifícios de um feudo
 */
async function getFeudBuildings(feudId) {
  try {
    const buildings = await Building.findByFeudId(feudId);
    
    // Checar quais estão completas e atualizar se necessário
    const updated = [];
    for (const building of buildings) {
      if (building.status === 'construction') {
        const now = new Date();
        if (now >= building.construction_end_time) {
          // Construção completa
          const completed = await completeBuilding(building.id);
          updated.push(completed);
        } else {
          updated.push(building);
        }
      } else {
        updated.push(building);
      }
    }

    return updated;
  } catch (error) {
    console.error('[BuildingService] Error getting feud buildings:', error);
    throw error;
  }
}

module.exports = {
  validateBuild,
  startBuilding,
  completeBuilding,
  upgradeBuilding,
  demolishBuilding,
  getAvailableBuildings,
  getFeudBuildings,
};
