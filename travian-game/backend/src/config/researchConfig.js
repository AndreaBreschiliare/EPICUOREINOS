/**
 * Research Config
 * Dados da arvore de tecnologia e funcoes de calculo de custo/tempo.
 * 28 Pesquisas em 5 Níveis baseadas na árvore tecnológica completa
 */

const RESEARCH_TECHS = {
  // Nível 1
  TECNICAS_ARADO: 'tecnicas_arado',
  SILVICULTURA: 'cunhas_madeira',
  ESCORAMENTO_SIMPLES: 'escoramento_simples',
  REGISTROS_FEUDO: 'registros_feudo',
  ESTACAS_AFIADAS: 'estacas_afiadas',
  MILICIA_BASICA: 'milicia_basica',
  ESCRITA_FORMAL: 'escrita_formal',
  // Nível 2
  METALURGIA: 'metalurgia',
  CARPINTARIA_AVANCADA: 'carpintaria_avancada',
  HOSPITALIDADE_COMUNITARIA: 'hospitalidade_comunitaria',
  DOMESTICACAO_BESTAS: 'domesticacao_bestas',
  PRINCIPIOS_FE: 'principios_fe',
  TECNICAS_FORTIFICACAO: 'tecnicas_fortificacao',
  ADMINISTRACAO_CENTRALIZADA: 'administracao_centralizada',
  // Nível 3
  ORGANIZACAO_MILITAR: 'organizacao_militar',
  MEDICINA_SANEAMENTO: 'medicina_saneamento',
  FUNDAMENTOS_ALQUIMIA: 'fundamentos_alquimia',
  CONTABILIDADE_AVANCADA: 'contabilidade_avancada',
  ENGENHARIA_DEFENSIVA: 'engenharia_defensiva',
  // Nível 4
  ENGENHARIA_GUERRA: 'engenharia_guerra',
  TEORIA_ARCANA: 'teoria_arcana',
  ROTAS_CARAVANA: 'rotas_caravana',
  INFILTRACAO_SABOTAGEM: 'infiltracao_sabotagem',
  ARQUITETURA_BASTIAO: 'arquitetura_bastiao',
  // Nível 5
  ARQUITETURA_SOBERANA: 'arquitetura_soberana',
  CARTOGRAFIA_CELESTIAL: 'cartografia_celestial',
  GUERRA_SOMBRAS: 'guerra_sombras',
  DOUTRINA_LEGADO: 'doutrina_legado',
};

const RESEARCH_DATA = {
  // ===== NÍVEL 1 =====
  [RESEARCH_TECHS.TECNICAS_ARADO]: {
    name: 'Técnicas de Arado',
    description: 'Melhora na produção de Comida',
    category: 'production',
    maxLevel: 1,
    feudLevelRequired: 1,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 500,
      pergaminhos: 5,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 86400, // 1 dia em segundos
    effects: ['Produção de Comida +10%'],
  },

  [RESEARCH_TECHS.SILVICULTURA]: {
    name: 'Cunhas de Madeira',
    description: 'Melhora na produção de Madeira',
    category: 'production',
    maxLevel: 1,
    feudLevelRequired: 1,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 500,
      pergaminhos: 5,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 86400, // 1 dia
    effects: ['Produção de Madeira +10%'],
  },

  [RESEARCH_TECHS.ESCORAMENTO_SIMPLES]: {
    name: 'Escoramento Simples',
    description: 'Melhora na produção de Pedra',
    category: 'production',
    maxLevel: 1,
    feudLevelRequired: 1,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 500,
      pergaminhos: 5,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 86400,
    effects: ['Produção de Pedra +10%'],
  },

  [RESEARCH_TECHS.REGISTROS_FEUDO]: {
    name: 'Registros do Feudo',
    description: 'Reduz Upkeep de construções',
    category: 'social',
    maxLevel: 1,
    feudLevelRequired: 1,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 800,
      pergaminhos: 10,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 172800, // 2 dias
    effects: ['Upkeep -10%'],
  },

  [RESEARCH_TECHS.ESTACAS_AFIADAS]: {
    name: 'Estacas Afiadas',
    description: 'Fortalece Paliçada de Madeira',
    category: 'military',
    maxLevel: 1,
    feudLevelRequired: 1,
    baseCost: {
      madeira: 300,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 600,
      pergaminhos: 0,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 86400,
    effects: ['Paliçada +500 HP'],
  },

  [RESEARCH_TECHS.MILICIA_BASICA]: {
    name: 'Milícia Básica',
    description: 'Potencializa cargo Vigia',
    category: 'military',
    maxLevel: 1,
    feudLevelRequired: 1,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 100,
      comida: 0,
      cobre: 1200,
      pergaminhos: 0,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 259200, // 3 dias
    effects: ['Vigia +35% HP'],
  },

  [RESEARCH_TECHS.ESCRITA_FORMAL]: {
    name: 'Escrita Formal',
    description: '(Final Nv. 1) Desbloqueia Biblioteca',
    category: 'governance',
    maxLevel: 1,
    feudLevelRequired: 1,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 2000,
      pergaminhos: 25,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 345600, // 4 dias
    effects: ['Desbloqueia Biblioteca'],
    isFinal: true,
  },

  // ===== NÍVEL 2 =====
  [RESEARCH_TECHS.METALURGIA]: {
    name: 'Fundamentos da Metalurgia',
    description: 'Desbloqueia Forja e Ferreiro',
    category: 'production',
    maxLevel: 1,
    feudLevelRequired: 2,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 500,
      comida: 0,
      cobre: 3000,
      pergaminhos: 30,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 432000, // 5 dias
    effects: ['Desbloqueia Forja', 'Cargo: Ferreiro'],
  },

  [RESEARCH_TECHS.CARPINTARIA_AVANCADA]: {
    name: 'Carpintaria Avançada',
    description: 'Desbloqueia Marcenaria e Carpinteiro',
    category: 'production',
    maxLevel: 1,
    feudLevelRequired: 2,
    baseCost: {
      madeira: 1000,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 3000,
      pergaminhos: 30,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 432000,
    effects: ['Desbloqueia Marcenaria', 'Cargo: Carpinteiro'],
  },

  [RESEARCH_TECHS.HOSPITALIDADE_COMUNITARIA]: {
    name: 'Hospitalidade Comunitária',
    description: 'Desbloqueia Taverna e Taverneiro',
    category: 'social',
    maxLevel: 1,
    feudLevelRequired: 2,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 2500,
      pergaminhos: 25,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 345600, // 4 dias
    effects: ['Desbloqueia Taverna', 'Cargo: Taverneiro'],
  },

  [RESEARCH_TECHS.DOMESTICACAO_BESTAS]: {
    name: 'Domesticação de Bestas',
    description: 'Desbloqueia Estábulo e Domador',
    category: 'social',
    maxLevel: 1,
    feudLevelRequired: 2,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 3500,
      pergaminhos: 35,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 432000,
    effects: ['Desbloqueia Estábulo', 'Cargo: Domador'],
  },

  [RESEARCH_TECHS.PRINCIPIOS_FE]: {
    name: 'Princípios da Fé',
    description: 'Desbloqueia Igreja/Templo e Sacerdote',
    category: 'social',
    maxLevel: 1,
    feudLevelRequired: 2,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 3000,
      pergaminhos: 30,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 432000,
    effects: ['Desbloqueia Igreja', 'Cargo: Sacerdote'],
  },

  [RESEARCH_TECHS.TECNICAS_FORTIFICACAO]: {
    name: 'Técnicas de Fortificação',
    description: 'Desbloqueia Muralha de Pedra',
    category: 'military',
    maxLevel: 1,
    feudLevelRequired: 2,
    baseCost: {
      madeira: 0,
      pedra: 1000,
      ferro: 0,
      comida: 0,
      cobre: 4000,
      pergaminhos: 0,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 518400, // 6 dias
    effects: ['Desbloqueia Muralha de Pedra'],
  },

  [RESEARCH_TECHS.ADMINISTRACAO_CENTRALIZADA]: {
    name: 'Administração Centralizada',
    description: '(Final Nv. 2) Desbloqueia Salão do Conselho',
    category: 'governance',
    maxLevel: 1,
    feudLevelRequired: 2,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 5000,
      pergaminhos: 50,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 604800, // 7 dias
    effects: ['Desbloqueia Salão do Conselho'],
    isFinal: true,
  },

  // ===== NÍVEL 3 =====
  [RESEARCH_TECHS.ORGANIZACAO_MILITAR]: {
    name: 'Organização Militar',
    description: 'Desbloqueia Quartel e Comandante',
    category: 'military',
    maxLevel: 1,
    feudLevelRequired: 3,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 1000,
      comida: 0,
      cobre: 8000,
      pergaminhos: 75,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 864000, // 10 dias
    effects: ['Desbloqueia Quartel', 'Cargo: Comandante'],
  },

  [RESEARCH_TECHS.MEDICINA_SANEAMENTO]: {
    name: 'Medicina e Saneamento',
    description: 'Desbloqueia Hospital e Médico',
    category: 'science',
    maxLevel: 1,
    feudLevelRequired: 3,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 7000,
      pergaminhos: 60,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 777600, // 9 dias
    effects: ['Desbloqueia Hospital', 'Cargo: Médico'],
  },

  [RESEARCH_TECHS.FUNDAMENTOS_ALQUIMIA]: {
    name: 'Fundamentos da Alquimia',
    description: 'Desbloqueia Laboratório de Alquimia',
    category: 'science',
    maxLevel: 1,
    feudLevelRequired: 3,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 7500,
      pergaminhos: 70,
      cristais: 0,
      minério_raro: 50,
    },
    baseTime: 777600,
    effects: ['Desbloqueia Lab. Alquimia', 'Cargo: Alquimista'],
  },

  [RESEARCH_TECHS.CONTABILIDADE_AVANCADA]: {
    name: 'Contabilidade Avançada',
    description: 'Desbloqueia Mercado e Mestre das Moedas',
    category: 'economy',
    maxLevel: 1,
    feudLevelRequired: 3,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 6000,
      pergaminhos: 80,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 691200, // 8 dias
    effects: ['Desbloqueia Mercado', 'Cargo: Mestre das Moedas'],
  },

  [RESEARCH_TECHS.ENGENHARIA_DEFENSIVA]: {
    name: 'Engenharia Defensiva',
    description: '(Final Nv. 3) Muralhas Altas com Torres',
    category: 'engineering',
    maxLevel: 1,
    feudLevelRequired: 3,
    baseCost: {
      madeira: 0,
      pedra: 5000,
      ferro: 0,
      comida: 0,
      cobre: 12000,
      pergaminhos: 0,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 1209600, // 14 dias
    effects: ['Desbloqueia Muralhas Altas com Torres'],
    isFinal: true,
  },

  // ===== NÍVEL 4 =====
  [RESEARCH_TECHS.ENGENHARIA_GUERRA]: {
    name: 'Engenharia de Guerra',
    description: 'Desbloqueia Oficina de Cerco',
    category: 'engineering',
    maxLevel: 1,
    feudLevelRequired: 4,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 3000,
      comida: 0,
      cobre: 20000,
      pergaminhos: 150,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 1555200, // 18 dias
    effects: ['Desbloqueia Oficina de Cerco', 'Cargo: Engenheiro'],
  },

  [RESEARCH_TECHS.TEORIA_ARCANA]: {
    name: 'Teoria Arcana de Batalha',
    description: 'Desbloqueia Torre Mágica',
    category: 'magic',
    maxLevel: 1,
    feudLevelRequired: 4,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 22000,
      pergaminhos: 0,
      cristais: 50,
      minério_raro: 0,
    },
    baseTime: 1728000, // 20 dias
    effects: ['Desbloqueia Torre Mágica'],
  },

  [RESEARCH_TECHS.ROTAS_CARAVANA]: {
    name: 'Rotas de Caravana',
    description: 'Desbloqueia Casa de Comércio',
    category: 'economy',
    maxLevel: 1,
    feudLevelRequired: 4,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 18000,
      pergaminhos: 120,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 1382400, // 16 dias
    effects: ['Desbloqueia Casa de Comércio', 'Cargo: Mercador'],
  },

  [RESEARCH_TECHS.INFILTRACAO_SABOTAGEM]: {
    name: 'Infiltração e Sabotagem',
    description: 'Desbloqueia Guilda de Ladrões',
    category: 'espionage',
    maxLevel: 1,
    feudLevelRequired: 4,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 25000,
      pergaminhos: 200,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 1814400, // 21 dias
    effects: ['Desbloqueia Guilda de Ladrões', 'Cargos: Ladrão, Espião'],
  },

  [RESEARCH_TECHS.ARQUITETURA_BASTIAO]: {
    name: 'Arquitetura de Bastião',
    description: '(Final Nv. 4) Muralhas Reforçadas',
    category: 'governance',
    maxLevel: 1,
    feudLevelRequired: 4,
    baseCost: {
      madeira: 0,
      pedra: 10000,
      ferro: 0,
      comida: 0,
      cobre: 30000,
      pergaminhos: 0,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 2419200, // 28 dias
    effects: ['Desbloqueia Muralhas Reforçadas'],
    isFinal: true,
  },

  // ===== NÍVEL 5 =====
  [RESEARCH_TECHS.ARQUITETURA_SOBERANA]: {
    name: 'Arquitetura Soberana',
    description: 'Desbloqueia Castelo/Palácio',
    category: 'governance',
    maxLevel: 1,
    feudLevelRequired: 5,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 50000,
      pergaminhos: 500,
      cristais: 0,
      minério_raro: 2000,
    },
    baseTime: 3456000, // 40 dias
    effects: ['Desbloqueia Castelo/Palácio'],
  },

  [RESEARCH_TECHS.CARTOGRAFIA_CELESTIAL]: {
    name: 'Cartografia Celestial',
    description: 'Desbloqueia Observatório',
    category: 'science',
    maxLevel: 1,
    feudLevelRequired: 5,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 60000,
      pergaminhos: 0,
      cristais: 100,
      minério_raro: 0,
    },
    baseTime: 3888000, // 45 dias
    effects: ['Desbloqueia Observatório'],
  },

  [RESEARCH_TECHS.GUERRA_SOMBRAS]: {
    name: 'Guerra nas Sombras',
    description: 'Desbloqueia Câmara das Sombras',
    category: 'espionage',
    maxLevel: 1,
    feudLevelRequired: 5,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 75000,
      pergaminhos: 300,
      cristais: 0,
      minério_raro: 0,
    },
    baseTime: 4320000, // 50 dias
    effects: ['Desbloqueia Câmara das Sombras', 'Cargo: Mestre Espião'],
  },

  [RESEARCH_TECHS.DOUTRINA_LEGADO]: {
    name: 'Doutrina de Legado Cultural',
    description: '(Final do Jogo) Legado Cultural',
    category: 'culture',
    maxLevel: 1,
    feudLevelRequired: 5,
    baseCost: {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 100000,
      pergaminhos: 0,
      cristais: 0,
      minério_raro: 50,
    },
    baseTime: 5184000, // 60 dias
    effects: ['Desbloqueia Legado Cultural', 'Vitória Cultural!'],
    isFinal: true,
  },
};

function calculateResearchCost(techName, level) {
  const data = RESEARCH_DATA[techName];
  if (!data) return null;

  const multiplier = Math.pow(1.25, level - 1);

  return {
    madeira: Math.floor(data.baseCost.madeira * multiplier),
    pedra: Math.floor(data.baseCost.pedra * multiplier),
    ferro: Math.floor(data.baseCost.ferro * multiplier),
    comida: Math.floor(data.baseCost.comida * multiplier),
    cobre: Math.floor(data.baseCost.cobre * multiplier),
    pergaminhos: Math.floor(data.baseCost.pergaminhos * multiplier),
    cristais: Math.floor(data.baseCost.cristais * multiplier),
    minério_raro: Math.floor(data.baseCost.minério_raro * multiplier),
  };
}

function calculateResearchTime(techName, level) {
  const data = RESEARCH_DATA[techName];
  if (!data) return null;

  return Math.floor(data.baseTime * Math.pow(1.2, level - 1));
}

module.exports = {
  RESEARCH_TECHS,
  RESEARCH_DATA,
  calculateResearchCost,
  calculateResearchTime,
};
