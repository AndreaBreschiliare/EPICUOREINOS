/**
 * Cargo Config
 * Definicoes dos cargos disponiveis e seus bonus.
 */

const CARGO_DATA = {
  almoxarife: {
    name: 'Almoxarife',
    description: 'Melhora a administracao interna do feudo',
    levelRequired: 1,
    bonusType: 'governo',
    bonusValue: 1.05,
  },
  capataz_florestal: {
    name: 'Capataz Florestal',
    description: 'Aumenta eficiencia da cadeia de producao',
    levelRequired: 1,
    bonusType: 'produção',
    bonusValue: 1.1,
  },
  mestre_celeiro: {
    name: 'Mestre de Celeiro',
    description: 'Otimiza armazenamento e perdas de recursos',
    levelRequired: 1,
    bonusType: 'produção',
    bonusValue: 1.08,
  },
  escriba_real: {
    name: 'Escriba Real',
    description: 'Apoia burocracia e registros do governo',
    levelRequired: 2,
    bonusType: 'governo',
    bonusValue: 1.08,
  },
  estrategista: {
    name: 'Estrategista',
    description: 'Melhora prontidao militar e defensiva',
    levelRequired: 2,
    bonusType: 'defesa',
    bonusValue: 1.12,
  },
  erudito: {
    name: 'Erudito',
    description: 'Acelera progresso academico e de pesquisa',
    levelRequired: 3,
    bonusType: 'pesquisa',
    bonusValue: 1.15,
  },
};

module.exports = {
  CARGO_DATA,
};
