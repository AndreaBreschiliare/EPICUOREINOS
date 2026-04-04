/**
 * Production Calculator
 * Calcula produção de recursos com aplicação de bônus
 */

const Building = require('../models/Building');
const Cargo = require('../models/Cargo');
const Law = require('../models/Law');
const Edict = require('../models/Edict');
const NPC = require('../models/NPC');

/**
 * Calcula a produção efetiva de um feudo
 * Leva em conta: população, edifícios, cargos, leis, éditos, NPCs
 */
async function calculateProduction(feud) {
  try {
    // 1. Produção base dos edifícios
    const baseProduction = await Building.calculateTotalProduction(feud.id);

    // 2. Obter bônus de cargos ativos
    const cargoBonus = await Cargo.calculateTotalBonus(feud.id);

    // 3. Obter multiplicador de leis ativas
    const lawMultiplier = await Law.calculateTotalEffectMultiplier(feud.id);

    // 4. Obter multiplicador de éditos ativos
    const edictMultiplier = await Edict.calculateTotalEffectMultiplier(feud.id);

    // 5. Obter bônus de NPCs contratados
    const npcBonus = await NPC.calculateTotalBonus(feud.id);

    // 6. Aplicar multiplicadores à população
    // População aumenta com casas (1 casa = 8 população base)
    const populationMultiplier = Math.max(0.5, (feud.população || 8) / 8);

    // 7. Calcular produção final com todos os bônus
    const finalProduction = {
      madeira: Math.floor(baseProduction.madeira * cargoBonus.produção * lawMultiplier * edictMultiplier * npcBonus.produção * populationMultiplier),
      pedra: Math.floor(baseProduction.pedra * cargoBonus.produção * lawMultiplier * edictMultiplier * npcBonus.produção * populationMultiplier),
      ferro: Math.floor(baseProduction.ferro * cargoBonus.produção * lawMultiplier * edictMultiplier * npcBonus.produção * populationMultiplier),
      comida: Math.floor(baseProduction.comida * cargoBonus.produção * lawMultiplier * edictMultiplier * npcBonus.produção * populationMultiplier),
      cobre: Math.floor(baseProduction.cobre * cargoBonus.produção * lawMultiplier * edictMultiplier * npcBonus.produção * populationMultiplier),
    };

    return {
      baseProduction,
      cargoBonus,
      lawMultiplier,
      edictMultiplier,
      npcBonus,
      populationMultiplier,
      finalProduction,
    };
  } catch (error) {
    console.error('Error calculating production:', error);
    throw error;
  }
}

/**
 * Calcula a manutenção (upkeep) de recursos
 */
async function calculateUpkeep(feudId) {
  try {
    const upkeep = await Building.calculateTotalUpkeep(feudId);
    return upkeep;
  } catch (error) {
    console.error('Error calculating upkeep:', error);
    throw error;
  }
}

/**
 * Calcula a produção líquida (produção - upkeep)
 */
async function calculateNetProduction(feud) {
  try {
    const production = await calculateProduction(feud);
    const upkeep = await calculateUpkeep(feud.id);

    const netProduction = {
      madeira: production.finalProduction.madeira - upkeep.madeira,
      pedra: production.finalProduction.pedra - upkeep.pedra,
      ferro: production.finalProduction.ferro - upkeep.ferro,
      comida: production.finalProduction.comida - upkeep.comida,
      cobre: production.finalProduction.cobre - upkeep.cobre,
    };

    return {
      production: production.finalProduction,
      upkeep,
      netProduction,
      details: production,
    };
  } catch (error) {
    console.error('Error calculating net production:', error);
    throw error;
  }
}

/**
 * Aplica produção a um feudo (adiciona recursos)
 * Pode ser chamado por job agendado ou manualmente
 */
async function applyProduction(feud, productionOverride = null) {
  try {
    let netProduction;
    
    if (productionOverride) {
      netProduction = productionOverride;
    } else {
      const calc = await calculateNetProduction(feud);
      netProduction = calc.netProduction;
    }

    // Calcular novos valores de recursos
    const updatedResources = {
      madeira: Math.max(0, feud.madeira + netProduction.madeira),
      pedra: Math.max(0, feud.pedra + netProduction.pedra),
      ferro: Math.max(0, feud.ferro + netProduction.ferro),
      comida: Math.max(0, feud.comida + netProduction.comida),
      cobre: Math.max(0, feud.cobre + netProduction.cobre),
      // Pergaminhos, cristais e minério raro só aumentam com pesquisa/eventos
      pergaminhos: feud.pergaminhos,
      cristais: feud.cristais,
      minério_raro: feud.minério_raro,
    };

    return updatedResources;
  } catch (error) {
    console.error('Error applying production:', error);
    throw error;
  }
}

/**
 * Calcula custo mensal de NPCs
 */
async function calculateNPCCost(feudId) {
  try {
    const npcCost = await NPC.calculateMonthlyCost(feudId);
    return npcCost;
  } catch (error) {
    console.error('Error calculating NPC cost:', error);
    throw error;
  }
}

/**
 * Valida se um feudo tem recursos suficientes
 */
function hasEnoughResources(feud, requiredResources) {
  return (
    feud.madeira >= (requiredResources.madeira || 0) &&
    feud.pedra >= (requiredResources.pedra || 0) &&
    feud.ferro >= (requiredResources.ferro || 0) &&
    feud.comida >= (requiredResources.comida || 0) &&
    feud.cobre >= (requiredResources.cobre || 0) &&
    feud.pergaminhos >= (requiredResources.pergaminhos || 0) &&
    feud.cristais >= (requiredResources.cristais || 0) &&
    feud.minério_raro >= (requiredResources.minério_raro || 0)
  );
}

/**
 * Subtrai recursos do feudo
 */
function subtractResources(feud, resources) {
  return {
    madeira: Math.max(0, feud.madeira - (resources.madeira || 0)),
    pedra: Math.max(0, feud.pedra - (resources.pedra || 0)),
    ferro: Math.max(0, feud.ferro - (resources.ferro || 0)),
    comida: Math.max(0, feud.comida - (resources.comida || 0)),
    cobre: Math.max(0, feud.cobre - (resources.cobre || 0)),
    pergaminhos: Math.max(0, feud.pergaminhos - (resources.pergaminhos || 0)),
    cristais: Math.max(0, feud.cristais - (resources.cristais || 0)),
    minério_raro: Math.max(0, feud.minério_raro - (resources.minério_raro || 0)),
  };
}

module.exports = {
  calculateProduction,
  calculateUpkeep,
  calculateNetProduction,
  applyProduction,
  calculateNPCCost,
  hasEnoughResources,
  subtractResources,
};
