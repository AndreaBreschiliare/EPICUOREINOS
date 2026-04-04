/**
 * Resource Service
 * Gerencia produção, consumo e histórico de recursos
 */

const Feud = require('../models/Feud');
const ResourceHistory = require('../models/ResourceHistory');
const ProductionCalculator = require('../utils/ProductionCalculator');
const { emitToFeud } = require('../realtime/socketServer');

/**
 * Executa a produção de recursos para um feudo específico
 * Chamado pelo scheduler a cada 24 horas
 */
async function produceResources(feudId) {
  try {
    console.log(`[ResourceService] Producing resources for feud ${feudId}`);

    // 1. Buscar feudo
    const feud = await Feud.findById(feudId);
    if (!feud) {
      throw new Error(`Feud ${feudId} not found`);
    }

    // 2. Calcular produção líquida
    const productionData = await ProductionCalculator.calculateNetProduction(feud);
    const netProduction = productionData.netProduction;

    // 3. Aplicar produção (subtrair upkeep, adicionar bônus)
    const updatedResources = await ProductionCalculator.applyProduction(feud, netProduction);

    // 4. Atualizar feudo no banco
    const updatedFeud = await Feud.updateResources(feudId, updatedResources);

    // 5. Salvar snapshot no histórico
    await ResourceHistory.create({
      feud_id: feudId,
      madeira: updatedFeud.madeira,
      pedra: updatedFeud.pedra,
      ferro: updatedFeud.ferro,
      comida: updatedFeud.comida,
      cobre: updatedFeud.cobre,
      pergaminhos: updatedFeud.pergaminhos,
      cristais: updatedFeud.cristais,
      minério_raro: updatedFeud.minério_raro,
      snapshot_at: new Date(),
    });

    console.log(`[ResourceService] Production completed for feud ${feudId}`);

    emitToFeud(feudId, 'resources:updated', {
      source: 'scheduler',
      resources: {
        madeira: updatedFeud.madeira,
        pedra: updatedFeud.pedra,
        ferro: updatedFeud.ferro,
        comida: updatedFeud.comida,
        cobre: updatedFeud.cobre,
        pergaminhos: updatedFeud.pergaminhos,
        cristais: updatedFeud.cristais,
        minério_raro: updatedFeud.minério_raro,
      },
      netProduction,
    });
    emitToFeud(feudId, 'production:tick', {
      production: productionData.production,
      upkeep: productionData.upkeep,
      netProduction,
    });
    
    return {
      feudId,
      production: productionData.production,
      upkeep: productionData.upkeep,
      netProduction,
      newResources: updatedFeud,
    };
  } catch (error) {
    console.error(`[ResourceService] Error producing resources for feud ${feudId}:`, error);
    throw error;
  }
}

/**
 * Produz recursos para TODOS os feudos (chamado pelo scheduler)
 */
async function produceAllResources() {
  try {
    console.log('[ResourceService] Starting production cycle for all feuds');

    // Buscar todos os feudos
    const feuds = await Feud.findAll(1000); // Limite de 1000 feudos por agora

    const results = [];
    const errors = [];

    // Produzir recursos para cada feudo
    for (const feud of feuds) {
      try {
        const result = await produceResources(feud.id);
        results.push(result);
      } catch (error) {
        console.error(`Error producing resources for feud ${feud.id}:`, error);
        errors.push({
          feudId: feud.id,
          error: error.message,
        });
      }
    }

    console.log(`[ResourceService] Production cycle completed. Results: ${results.length}, Errors: ${errors.length}`);

    return {
      successCount: results.length,
      errorCount: errors.length,
      results,
      errors,
    };
  } catch (error) {
    console.error('[ResourceService] Error in production cycle:', error);
    throw error;
  }
}

/**
 * Retorna informações completas de produção de um feudo
 */
async function getProductionInfo(feudId) {
  try {
    const feud = await Feud.findById(feudId);
    if (!feud) {
      throw new Error(`Feud ${feudId} not found`);
    }

    const productionData = await ProductionCalculator.calculateNetProduction(feud);
    const npcCost = await ProductionCalculator.calculateNPCCost(feudId);

    return {
      feud: {
        id: feud.id,
        name: feud.name,
        level: feud.level,
        culture: feud.culture,
        população: feud.população,
        moral: feud.moral,
      },
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
      production: productionData.production,
      upkeep: productionData.upkeep,
      netProduction: productionData.netProduction,
      npcMonthlyCost: npcCost,
      bonuses: {
        cargo: productionData.details.cargoBonus,
        law: productionData.details.lawMultiplier,
        edict: productionData.details.edictMultiplier,
        npc: productionData.details.npcBonus,
        population: productionData.details.populationMultiplier,
      },
    };
  } catch (error) {
    console.error('[ResourceService] Error getting production info:', error);
    throw error;
  }
}

/**
 * Retorna histórico de 30 dias de um feudo
 */
async function getResourceHistory(feudId, days = 30) {
  try {
    const history = await ResourceHistory.findByFeudIdLastDays(feudId, days);
    
    if (history.length < 2) {
      return {
        feudId,
        message: 'Not enough data',
        history: history,
      };
    }

    const growth = await ResourceHistory.calculateGrowth(
      feudId,
      history[history.length - 1].snapshot_at,
      history[0].snapshot_at
    );

    const averageProduction = await ResourceHistory.calculateAverageProduction(feudId, days);

    return {
      feudId,
      days,
      totalSnapshots: history.length,
      growth,
      averageProduction,
      history: history.slice(0, 100), // Limitar a 100 registros
    };
  } catch (error) {
    console.error('[ResourceService] Error getting resource history:', error);
    throw error;
  }
}

/**
 * Coletores manuais de recursos (botão "Harvest" no frontend)
 */
async function collectResources(feudId, amount = 1) {
  try {
    const feud = await Feud.findById(feudId);
    if (!feud) {
      throw new Error(`Feud ${feudId} not found`);
    }

    // Simular colheita manual (10% da produção base)
    const productionData = await ProductionCalculator.calculateNetProduction(feud);
    
    const manualHarvest = {
      madeira: Math.floor(productionData.production.madeira * 0.1 * amount),
      pedra: Math.floor(productionData.production.pedra * 0.1 * amount),
      ferro: Math.floor(productionData.production.ferro * 0.1 * amount),
      comida: Math.floor(productionData.production.comida * 0.1 * amount),
      cobre: Math.floor(productionData.production.cobre * 0.1 * amount),
    };

    // Adicionar ao feudo
    const updatedResources = {
      madeira: feud.madeira + manualHarvest.madeira,
      pedra: feud.pedra + manualHarvest.pedra,
      ferro: feud.ferro + manualHarvest.ferro,
      comida: feud.comida + manualHarvest.comida,
      cobre: feud.cobre + manualHarvest.cobre,
      pergaminhos: feud.pergaminhos,
      cristais: feud.cristais,
      minério_raro: feud.minério_raro,
    };

    const updated = await Feud.updateResources(feudId, updatedResources);

    emitToFeud(feudId, 'resources:updated', {
      source: 'manual_collect',
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
      collected: manualHarvest,
    });

    return {
      collected: manualHarvest,
      newResources: updated,
    };
  } catch (error) {
    console.error('[ResourceService] Error collecting resources:', error);
    throw error;
  }
}

module.exports = {
  produceResources,
  produceAllResources,
  getProductionInfo,
  getResourceHistory,
  collectResources,
};
