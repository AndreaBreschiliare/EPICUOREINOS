const db = require('../config/database');

class Edict {
  /**
   * Cria um novo édito
   */
  static async create(edictData) {
    const result = await db('edicts').insert({
      feud_id: edictData.feud_id,
      edict_name: edictData.edict_name,
      category: edictData.category,
      level_required: edictData.level_required,
      status: edictData.status || 'inactive',
      active_since: edictData.active_since || null,
      effect_multipllier: edictData.effect_multipllier || 1.0,
      effect_description: edictData.effect_description || null,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning('id');

    const id = result[0].id || result[0];
    return this.findById(id);
  }

  /**
   * Encontra édito por ID
   */
  static async findById(id) {
    return db('edicts')
      .where('id', id)
      .first();
  }

  /**
   * Lista todos os éditos de um feudo
   */
  static async findByFeudId(feudId) {
    return db('edicts')
      .where('feud_id', feudId)
      .select('*');
  }

  /**
   * Encontra édito específico em um feudo
   */
  static async findByFeudIdAndEdictName(feudId, edictName) {
    return db('edicts')
      .where('feud_id', feudId)
      .where('edict_name', edictName)
      .first();
  }

  /**
   * Lista éditos ativos de um feudo
   */
  static async findActiveByFeudId(feudId) {
    return db('edicts')
      .where('feud_id', feudId)
      .where('status', 'active')
      .select('*');
  }

  /**
   * Lista éditos por categoria
   */
  static async findByFeudIdAndCategory(feudId, category) {
    return db('edicts')
      .where('feud_id', feudId)
      .where('category', category)
      .select('*');
  }

  /**
   * Atualiza édito
   */
  static async update(id, data) {
    await db('edicts')
      .where('id', id)
      .update({
        ...data,
        updated_at: new Date(),
      });

    return this.findById(id);
  }

  /**
   * Ativa um édito
   */
  static async activateEdict(id) {
    return this.update(id, {
      status: 'active',
      active_since: new Date(),
    });
  }

  /**
   * Desativa um édito
   */
  static async deactivateEdict(id) {
    return this.update(id, {
      status: 'inactive',
      active_since: null,
    });
  }

  /**
   * Conta éditos ativos por categoria
   */
  static async countActiveByFeudAndCategory(feudId) {
    return db('edicts')
      .where('feud_id', feudId)
      .where('status', 'active')
      .groupBy('category')
      .count('* as total')
      .select('category');
  }

  /**
   * Calcula multiplicador total de éditos ativos
   */
  static async calculateTotalEffectMultiplier(feudId) {
    const activeEdicts = await this.findActiveByFeudId(feudId);
    
    let totalMultiplier = 1.0;
    activeEdicts.forEach(edict => {
      totalMultiplier *= (edict.effect_multipllier || 1.0);
    });

    return totalMultiplier;
  }

  /**
   * Deleta édito
   */
  static async delete(id) {
    return db('edicts')
      .where('id', id)
      .del();
  }
}

module.exports = Edict;
