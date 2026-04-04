const db = require('../config/database');
const { INITIAL_RESOURCES, LEVELS } = require('../config/constants');

class Feud {
  /**
   * Cria um novo feudo
   */
  static async create(feudData) {
    const result = await db('feuds').insert({
      user_id: feudData.user_id,
      name: feudData.name,
      level: 1,
      culture: feudData.culture,
      madeira: INITIAL_RESOURCES.madeira,
      pedra: INITIAL_RESOURCES.pedra,
      ferro: INITIAL_RESOURCES.ferro,
      comida: INITIAL_RESOURCES.comida,
      cobre: INITIAL_RESOURCES.cobre,
      pergaminhos: INITIAL_RESOURCES.pergaminhos,
      cristais: INITIAL_RESOURCES.cristais,
      minério_raro: INITIAL_RESOURCES.minério_raro,
      população: 8, // 1 casa inicial
      moral: 50,
      last_resource_update: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    }).returning('id');

    const id = result[0].id || result[0];
    return this.findById(id);
  }

  /**
   * Encontra feudo por ID
   */
  static async findById(id) {
    return db('feuds')
      .where('id', id)
      .first();
  }

  /**
   * Encontra feudo por user_id
   */
  static async findByUserId(userId) {
    return db('feuds')
      .where('user_id', userId)
      .first();
  }

  /**
   * Lista todos feudos (para leaderboard)
   */
  static async findAll(limit = 50) {
    return db('feuds')
      .orderBy('level', 'desc')
      .orderBy('cobre', 'desc')
      .limit(limit);
  }

  /**
   * Atualiza feudo
   */
  static async update(id, data) {
    await db('feuds')
      .where('id', id)
      .update({
        ...data,
        updated_at: new Date(),
      });

    return this.findById(id);
  }

  /**
   * Atualiza recursos
   */
  static async updateResources(id, resources) {
    await db('feuds')
      .where('id', id)
      .update({
        ...resources,
        last_resource_update: new Date(),
        updated_at: new Date(),
      });

    return this.findById(id);
  }

  /**
   * Faz upgrade de nivel
   */
  static async levelUp(id, newLevel) {
    const data = await db('feuds')
      .where('id', id)
      .update({
        level: newLevel,
        level_up_date: new Date(),
        updated_at: new Date(),
      });

    return this.findById(id);
  }

  /**
   * Deleta feudo
   */
  static async delete(id) {
    return db('feuds')
      .where('id', id)
      .del();
  }
}

module.exports = Feud;
