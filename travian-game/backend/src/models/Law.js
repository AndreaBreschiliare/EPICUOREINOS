const db = require('../config/database');

class Law {
  /**
   * Cria uma nova lei
   */
  static async create(lawData) {
    const result = await db('laws').insert({
      feud_id: lawData.feud_id,
      law_name: lawData.law_name,
      category: lawData.category,
      level_required: lawData.level_required,
      status: lawData.status || 'inactive',
      active_since: lawData.active_since || null,
      effect_multipllier: lawData.effect_multipllier || 1.0,
      effect_description: lawData.effect_description || null,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning('id');

    const id = result[0].id || result[0];
    return this.findById(id);
  }

  /**
   * Encontra lei por ID
   */
  static async findById(id) {
    return db('laws')
      .where('id', id)
      .first();
  }

  /**
   * Lista todas as leis de um feudo
   */
  static async findByFeudId(feudId) {
    return db('laws')
      .where('feud_id', feudId)
      .select('*');
  }

  /**
   * Encontra lei específica em um feudo
   */
  static async findByFeudIdAndLawName(feudId, lawName) {
    return db('laws')
      .where('feud_id', feudId)
      .where('law_name', lawName)
      .first();
  }

  /**
   * Lista leis ativas de um feudo
   */
  static async findActiveByFeudId(feudId) {
    return db('laws')
      .where('feud_id', feudId)
      .where('status', 'active')
      .select('*');
  }

  /**
   * Lista leis por categoria
   */
  static async findByFeudIdAndCategory(feudId, category) {
    return db('laws')
      .where('feud_id', feudId)
      .where('category', category)
      .select('*');
  }

  /**
   * Atualiza lei
   */
  static async update(id, data) {
    await db('laws')
      .where('id', id)
      .update({
        ...data,
        updated_at: new Date(),
      });

    return this.findById(id);
  }

  /**
   * Ativa uma lei
   */
  static async activateLaw(id) {
    return this.update(id, {
      status: 'active',
      active_since: new Date(),
    });
  }

  /**
   * Desativa uma lei
   */
  static async deactivateLaw(id) {
    return this.update(id, {
      status: 'inactive',
      active_since: null,
    });
  }

  /**
   * Conta leis ativas por categoria
   */
  static async countActiveByFeudAndCategory(feudId) {
    return db('laws')
      .where('feud_id', feudId)
      .where('status', 'active')
      .groupBy('category')
      .count('* as total')
      .select('category');
  }

  /**
   * Calcula multiplicador total de leis ativas
   */
  static async calculateTotalEffectMultiplier(feudId) {
    const activeLaws = await this.findActiveByFeudId(feudId);
    
    let totalMultiplier = 1.0;
    activeLaws.forEach(law => {
      totalMultiplier *= (law.effect_multipllier || 1.0);
    });

    return totalMultiplier;
  }

  /**
   * Deleta lei
   */
  static async delete(id) {
    return db('laws')
      .where('id', id)
      .del();
  }
}

module.exports = Law;
