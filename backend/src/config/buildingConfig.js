/**
 * Building Config
 * Dados de construções: custos, requisitos, tempos, produção
 */

const BUILDING_TYPES = {
  CASA: 'casa',
  FAZENDA: 'fazenda',
  LENHADOR: 'lenhador',
  MINERADOR: 'minerador',
  PALIÇADA: 'paliçada',
  MURALHA: 'muralha',
  BIBLIOTECA: 'biblioteca',
  FERREIRO: 'ferreiro',
  TAVERNA: 'taverna',
  ESTÁBULO: 'estábulo',
  TEMPLO: 'templo',
  QUARTEL: 'quartel',
  HOSPITAL: 'hospital',
  LAB_ALQUIMIA: 'lab_alquimia',
};

/**
 * Custo e requisitos por tipo de edifício
 * Aumentam com o nível exponencialmente
 */
const BUILDING_DATA = {
  [BUILDING_TYPES.CASA]: {
    name: 'Casa',
    category: 'residential',
    description: 'Aumenta população (+8 por casa nível 1)',
    baseCost: {
      madeira: 50,
      pedra: 30,
      ferro: 0,
      comida: 0,
      cobre: 0,
      pergaminhos: 0,
    },
    productionNivel1: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 0,
    },
    upkeepNivel1: {
      madeira: 15,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 0,
    },
    populationPerLevel: 8,
    baseConstructionTime: 60, // 60 segundos em dev
    levelRequired: 1,
    maxLevel: 5,
  },

  [BUILDING_TYPES.FAZENDA]: {
    name: 'Fazenda',
    category: 'production',
    description: 'Produz Comida (+100/dia nível 1)',
    baseCost: {
      madeira: 60,
      pedra: 20,
      ferro: 0,
      comida: 0,
      cobre: 0,
      pergaminhos: 0,
    },
    productionNivel1: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 100,
      cobre: 0,
    },
    upkeepNivel1: {
      madeira: 20,
      pedra: 5,
      ferro: 0,
      comida: 0,
      cobre: 0,
    },
    baseConstructionTime: 90,
    levelRequired: 1,
    maxLevel: 5,
  },

  [BUILDING_TYPES.LENHADOR]: {
    name: 'Casa do Lenhador',
    category: 'production',
    description: 'Produz Madeira (+100/dia nível 1)',
    baseCost: {
      madeira: 40,
      pedra: 10,
      ferro: 5,
      comida: 0,
      cobre: 0,
      pergaminhos: 0,
    },
    productionNivel1: {
      madeira: 100,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 0,
    },
    upkeepNivel1: {
      madeira: 25,
      pedra: 0,
      ferro: 5,
      comida: 0,
      cobre: 0,
    },
    baseConstructionTime: 90,
    levelRequired: 1,
    maxLevel: 5,
  },

  [BUILDING_TYPES.MINERADOR]: {
    name: 'Poço de Mineração',
    category: 'production',
    description: 'Produz Pedra e Ferro (+100/+10/dia nível 1)',
    baseCost: {
      madeira: 50,
      pedra: 40,
      ferro: 20,
      comida: 0,
      cobre: 0,
      pergaminhos: 0,
    },
    productionNivel1: {
      madeira: 0,
      pedra: 100,
      ferro: 10,
      comida: 0,
      cobre: 0,
    },
    upkeepNivel1: {
      madeira: 20,
      pedra: 10,
      ferro: 5,
      comida: 0,
      cobre: 0,
    },
    baseConstructionTime: 120,
    levelRequired: 1,
    maxLevel: 5,
  },

  [BUILDING_TYPES.PALIÇADA]: {
    name: 'Paliçada',
    category: 'defense',
    description: 'Defesa básica',
    baseCost: {
      madeira: 80,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 0,
      pergaminhos: 0,
    },
    productionNivel1: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 0,
    },
    upkeepNivel1: {
      madeira: 10,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 0,
    },
    health: 500,
    baseConstructionTime: 120,
    levelRequired: 2,
    maxLevel: 3,
  },

  [BUILDING_TYPES.MURALHA]: {
    name: 'Muralha',
    category: 'defense',
    description: 'Defesa avançada',
    baseCost: {
      madeira: 100,
      pedra: 200,
      ferro: 50,
      comida: 0,
      cobre: 0,
      pergaminhos: 0,
    },
    productionNivel1: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 0,
    },
    upkeepNivel1: {
      madeira: 20,
      pedra: 30,
      ferro: 10,
      comida: 0,
      cobre: 0,
    },
    health: 1500,
    baseConstructionTime: 180,
    levelRequired: 3,
    maxLevel: 5,
  },

  [BUILDING_TYPES.BIBLIOTECA]: {
    name: 'Biblioteca',
    category: 'institutional',
    description: 'Desbloqueio de pesquisa',
    baseCost: {
      madeira: 80,
      pedra: 50,
      ferro: 0,
      comida: 0,
      cobre: 0,
      pergaminhos: 50,
    },
    productionNivel1: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 0,
    },
    upkeepNivel1: {
      madeira: 15,
      pedra: 10,
      ferro: 0,
      comida: 0,
      cobre: 0,
    },
    baseConstructionTime: 150,
    levelRequired: 2,
    maxLevel: 5,
  },

  [BUILDING_TYPES.FERREIRO]: {
    name: 'Ferreiro',
    category: 'institutional',
    description: 'Permite contratar ferreiro (+5% produção)',
    baseCost: {
      madeira: 60,
      pedra: 40,
      ferro: 50,
      comida: 0,
      cobre: 0,
      pergaminhos: 0,
    },
    productionNivel1: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 0,
    },
    upkeepNivel1: {
      madeira: 10,
      pedra: 5,
      ferro: 10,
      comida: 0,
      cobre: 0,
    },
    baseConstructionTime: 120,
    levelRequired: 2,
    maxLevel: 5,
  },
};

/**
 * Calcula custo de construção com fórmula exponencial
 * custo * (1.1 ^ (level - 1))
 */
function calculateBuildingCost(buildingType, level) {
  const data = BUILDING_DATA[buildingType];
  if (!data) return null;

  const multiplier = Math.pow(1.1, level - 1);

  return {
    madeira: Math.floor(data.baseCost.madeira * multiplier),
    pedra: Math.floor(data.baseCost.pedra * multiplier),
    ferro: Math.floor(data.baseCost.ferro * multiplier),
    comida: Math.floor(data.baseCost.comida * multiplier),
    cobre: Math.floor(data.baseCost.cobre * multiplier),
    pergaminhos: Math.floor(data.baseCost.pergaminhos * multiplier),
  };
}

/**
 * Calcula produção de construção por nível
 * produção * (1.5 ^ (level - 1))
 */
function calculateBuildingProduction(buildingType, level) {
  const data = BUILDING_DATA[buildingType];
  if (!data) return null;

  const multiplier = Math.pow(1.5, level - 1);

  return {
    madeira: Math.floor(data.productionNivel1.madeira * multiplier),
    pedra: Math.floor(data.productionNivel1.pedra * multiplier),
    ferro: Math.floor(data.productionNivel1.ferro * multiplier),
    comida: Math.floor(data.productionNivel1.comida * multiplier),
    cobre: Math.floor(data.productionNivel1.cobre * multiplier),
  };
}

/**
 * Calcula upkeep de construção por nível
 * upkeep * (1.3 ^ (level - 1))
 */
function calculateBuildingUpkeep(buildingType, level) {
  const data = BUILDING_DATA[buildingType];
  if (!data) return null;

  const multiplier = Math.pow(1.3, level - 1);

  return {
    madeira: Math.floor(data.upkeepNivel1.madeira * multiplier),
    pedra: Math.floor(data.upkeepNivel1.pedra * multiplier),
    ferro: Math.floor(data.upkeepNivel1.ferro * multiplier),
    comida: Math.floor(data.upkeepNivel1.comida * multiplier),
    cobre: Math.floor(data.upkeepNivel1.cobre * multiplier),
  };
}

/**
 * Calcula tempo de construção em segundos
 * tempo * (1.15 ^ (level - 1))
 */
function calculateConstructionTime(buildingType, level) {
  const data = BUILDING_DATA[buildingType];
  if (!data) return null;

  const multiplier = Math.pow(1.15, level - 1);
  return Math.floor(data.baseConstructionTime * multiplier);
}

module.exports = {
  BUILDING_TYPES,
  BUILDING_DATA,
  calculateBuildingCost,
  calculateBuildingProduction,
  calculateBuildingUpkeep,
  calculateConstructionTime,
};
