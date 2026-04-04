/**
 * Law Config
 * Definicoes das leis disponiveis por nivel de feudo.
 */

const LAW_DATA = {
  decreto_capataz: {
    name: 'Decreto do Capataz',
    description: 'Padroniza metas de produtividade no feudo',
    category: 'producao',
    levelRequired: 1,
    effectMultiplier: 1.08,
  },
  lei_do_mercado: {
    name: 'Lei do Mercado',
    description: 'Estimula arrecadacao e atividade comercial',
    category: 'economia',
    levelRequired: 1,
    effectMultiplier: 1.07,
  },
  estatuto_militar: {
    name: 'Estatuto Militar',
    description: 'Reforca disciplina e organizacao de defesa',
    category: 'militar',
    levelRequired: 2,
    effectMultiplier: 1.1,
  },
  lei_dos_oficios: {
    name: 'Lei dos Oficios',
    description: 'Aprimora qualidade de trabalho especializado',
    category: 'social',
    levelRequired: 2,
    effectMultiplier: 1.06,
  },
  reforma_agraria: {
    name: 'Reforma Agraria',
    description: 'Otimizacao ampla de producao rural',
    category: 'producao',
    levelRequired: 3,
    effectMultiplier: 1.12,
  },
};

module.exports = {
  LAW_DATA,
};
