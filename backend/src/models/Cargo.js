const db = require('../config/database');

class Cargo {
  /**
   * Cria um novo cargo/posição
   */
  static async create(cargoData) {
    const result = await db('cargos').insert({
      feud_id: cargoData.feud_id,
      cargo_name: cargoData.cargo_name,
      holder_name: cargoData.holder_name || null,
      is_npc: cargoData.is_npc || false,
      bonus_tipo: cargoData.bonus_tipo || null,
      bonus_valor: cargoData.bonus_valor || null,
      active: cargoData.active || false,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning('id');

    const id = result[0].id || result[0];
    return this.findById(id);
  }

  /**
   * Encontra cargo por ID
   */
  static async findById(id) {
    return db('cargos')
      .where('id', id)
      .first();
  }

  /**
   * Lista todos os cargos de um feudo
   */
  static async findByFeudId(feudId) {
    return db('cargos')
      .where('feud_id', feudId)
      .select('*');
  }

  /**
   * Encontra cargo específico em um feudo
   */
  static async findByFeudIdAndCargoName(feudId, cargoName) {
    return db('cargos')
      .where('feud_id', feudId)
      .where('cargo_name', cargoName)
      .first();
  }

  /**
   * Lista cargos ativos de um feudo
   */
  static async findActiveByFeudId(feudId) {
    return db('cargos')
      .where('feud_id', feudId)
      .where('active', true)
      .select('*');
  }

  /**
   * Atualiza cargo
   */
  static async update(id, data) {
    await db('cargos')
      .where('id', id)
      .update({
        ...data,
        updated_at: new Date(),
      });

    return this.findById(id);
  }

  /**
   * Atribui um especialista a um cargo
   */
  static async assignHolder(id, holderName, isNpc = false) {
    return this.update(id, {
      holder_name: holderName,
      is_npc: isNpc,
      active: true,
    });
  }

  /**
   * Remove especialista de um cargo
   */
  static async removeHolder(id) {
    return this.update(id, {
      holder_name: null,
      is_npc: false,
      active: false,
    });
  }

  /**
   * Atualiza bônus de um cargo
   */
  static async updateBonus(id, bonusTipo, bonusValor) {
    return this.update(id, {
      bonus_tipo: bonusTipo,
      bonus_valor: bonusValor,
    });
  }

  /**
   * Calcula bônus total de um feudo
   */
  static async calculateTotalBonus(feudId) {
    const activeCargos = await this.findActiveByFeudId(feudId);
    
    const bonuses = {
      produção: 1.0,
      defesa: 1.0,
      pesquisa: 1.0,
      governo: 1.0,
    };

    activeCargos.forEach(cargo => {
      if (cargo.bonus_tipo && cargo.bonus_valor) {
        bonuses[cargo.bonus_tipo] *= cargo.bonus_valor;
      }
    });

    return bonuses;
  }

  /**
   * Deleta cargo
   */
  static async delete(id) {
    return db('cargos')
      .where('id', id)
      .del();
  }
}

module.exports = Cargo;
