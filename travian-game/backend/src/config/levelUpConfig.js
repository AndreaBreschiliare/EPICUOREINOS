/**
 * Level Up Config
 * Requisitos e recompensas para ascensao de nivel do feudo.
 */

const MAX_FEUD_LEVEL = 5;

const LEVEL_UP_REQUIREMENTS = {
  2: {
    title: 'Barão',
    infrastructure: {
      buildings: [
        { type: 'casa', minLevel: 1, minCount: 1 },
      ],
      productionBuildingsMinCount: 2,
    },
    social: {
      minPopulation: 8,
      positiveFoodBalance: true,
    },
    knowledge: {
      minCompletedResearch: 2,
    },
    tribute: {
      madeira: 2500,
      pedra: 1500,
      ferro: 200,
      comida: 0,
      cobre: 2500,
      pergaminhos: 0,
      cristais: 0,
      minério_raro: 0,
    },
    rewards: {
      moral: 5,
      pergaminhos: 25,
    },
  },

  3: {
    title: 'Conde',
    infrastructure: {
      buildings: [
        { type: 'muralha', minLevel: 1, minCount: 1 },
        { type: 'biblioteca', minLevel: 1, minCount: 1 },
      ],
      productionBuildingsMinCount: 3,
    },
    social: {
      minPopulation: 24,
      positiveFoodBalance: true,
      positiveCopperBalance: true,
    },
    knowledge: {
      minCompletedResearch: 4,
    },
    tribute: {
      madeira: 20000,
      pedra: 25000,
      ferro: 5000,
      comida: 0,
      cobre: 20000,
      pergaminhos: 2000,
      cristais: 0,
      minério_raro: 0,
    },
    rewards: {
      moral: 8,
      cristais: 10,
    },
  },

  4: {
    title: 'Marquês',
    infrastructure: {
      buildings: [
        { type: 'muralha', minLevel: 2, minCount: 1 },
        { type: 'ferreiro', minLevel: 2, minCount: 1 },
        { type: 'biblioteca', minLevel: 2, minCount: 1 },
      ],
      productionBuildingsMinCount: 4,
    },
    social: {
      minPopulation: 40,
      positiveFoodBalance: true,
      positiveCopperBalance: true,
    },
    knowledge: {
      minCompletedResearch: 6,
    },
    tribute: {
      madeira: 0,
      pedra: 0,
      ferro: 10000,
      comida: 0,
      cobre: 50000,
      pergaminhos: 0,
      cristais: 0,
      minério_raro: 0,
    },
    rewards: {
      moral: 10,
      cristais: 20,
    },
  },

  5: {
    title: 'Duque',
    infrastructure: {
      buildings: [
        { type: 'muralha', minLevel: 3, minCount: 1 },
        { type: 'ferreiro', minLevel: 3, minCount: 1 },
        { type: 'biblioteca', minLevel: 3, minCount: 1 },
      ],
      productionBuildingsMinCount: 5,
    },
    social: {
      minPopulation: 64,
      positiveFoodBalance: true,
      positiveCopperBalance: true,
    },
    knowledge: {
      minCompletedResearch: 8,
    },
    tribute: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 100000,
      pergaminhos: 0,
      cristais: 20,
      minério_raro: 5,
    },
    rewards: {
      moral: 15,
      minério_raro: 3,
    },
  },
};

module.exports = {
  MAX_FEUD_LEVEL,
  LEVEL_UP_REQUIREMENTS,
};
