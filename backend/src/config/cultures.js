// Configuração de bônus e malus por cultura
const CULTURE_MODIFIERS = {
  baduran: {
    name: 'Baduran',
    bonus: { pedra: 20, ferro: 20, minério_raro: 15 },
    malus: { comida: -25 },
  },
  drow: {
    name: 'Drow',
    bonus: { cobre: 15, cristais: 10 },
    malus: { madeira: -15 },
  },
  aiglanos: {
    name: 'Aiglanos',
    bonus: { cobre: 20, pergaminhos: 15 },
    malus: { madeira: -10, pedra: -10 },
  },
  björske: {
    name: 'Björske',
    bonus: { comida: 20, madeira: 15 },
    malus: { pergaminhos: -15 },
  },
  polkinea: {
    name: 'Polkinea',
    bonus: { comida: 25, cobre: 10 },
    malus: { pedra: -20 },
  },
  gulthrak: {
    name: 'Gulthrak',
    bonus: { minério_raro: 15, ferro: 15, pedra: 10 },
    malus: { cobre: -25 },
  },
  p_leste: {
    name: 'P. Leste',
    bonus: { pergaminhos: 20, cristais: 15 },
    malus: { comida: -20 },
  },
  aluriel: {
    name: 'Aluriel',
    bonus: { cristais: 25, pergaminhos: 10, madeira: 15 },
    malus: { pedra: -20 },
  },
};

module.exports = { CULTURE_MODIFIERS };
