// ==================== GAME CONSTANTS ====================

const RESOURCES = {
  MADEIRA: 'madeira',
  PEDRA: 'pedra',
  FERRO: 'ferro',
  COMIDA: 'comida',
  COBRE: 'cobre',
  PERGAMINHOS: 'pergaminhos',
  CRISTAIS: 'cristais',
  MINÉRIO_RARO: 'minério_raro',
};

const INITIAL_RESOURCES = {
  [RESOURCES.MADEIRA]: 20000,
  [RESOURCES.PEDRA]: 10000,
  [RESOURCES.FERRO]: 5000,
  [RESOURCES.COMIDA]: 50000,
  [RESOURCES.COBRE]: 5000,
  [RESOURCES.PERGAMINHOS]: 100,
  [RESOURCES.CRISTAIS]: 0,
  [RESOURCES.MINÉRIO_RARO]: 0,
};

const LEVELS = {
  1: { title: 'Senhor', slots: { laws: 1, edicts: 0 } },
  2: { title: 'Barão', slots: { laws: 2, edicts: 1 } },
  3: { title: 'Conde', slots: { laws: 3, edicts: 2 } },
  4: { title: 'Marquês', slots: { laws: 4, edicts: 3 } },
  5: { title: 'Duque', slots: { laws: 5, edicts: 4 } },
};

const CULTURES = [
  'baduran', // Anões
  'drow', // Elfos Negros
  'aiglanos', // Romano
  'björske', // Rohan
  'polkinea', // Hobbit
  'gulthrak', // Orc
  'p_leste', // Oriental
  'aluriel', // Élfico
];

const ERROR_CODES = {
  // Auth
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_EXISTS: 'USER_EXISTS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_TOKEN: 'INVALID_TOKEN',

  // Validation
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_FIELD: 'MISSING_FIELD',

  // Feud
  FEUD_EXISTS: 'FEUD_EXISTS',
  FEUD_NOT_FOUND: 'FEUD_NOT_FOUND',

  // Resources
  INSUFFICIENT_RESOURCES: 'INSUFFICIENT_RESOURCES',

  // Database
  DATABASE_ERROR: 'DATABASE_ERROR',

  // General
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  FORBIDDEN: 'FORBIDDEN',
  UNAUTHORIZED: 'UNAUTHORIZED',
};

module.exports = {
  RESOURCES,
  INITIAL_RESOURCES,
  LEVELS,
  CULTURES,
  ERROR_CODES,
};
