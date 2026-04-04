const db = require('../config/database');

class NPC {
  /**
   * Cria um novo NPC
   */
  static async create(npcData) {
    const result = await db('npcs').insert({
      feud_id: npcData.feud_id,
      npc_type: npcData.npc_type,
      name: npcData.name,
      description: npcData.description || null,
      level_required: npcData.level_required || 1,
      cost_cobre_monthly: npcData.cost_cobre_monthly || 0,
      cost_pergaminhos_monthly: npcData.cost_pergaminhos_monthly || null,
      bonus_tipo: npcData.bonus_tipo || null,
      bonus_valor: npcData.bonus_valor || null,
      hired: npcData.hired || false,
      hired_at: npcData.hired_at || null,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning('id');

    const id = result[0].id || result[0];
    return this.findById(id);
  }

  /**
   * Encontra NPC por ID
   */
  static async findById(id) {
    return db('npcs')
      .where('id', id)
      .first();
  }

  /**
   * Lista todos os NPCs de um feudo
   */
  static async findByFeudId(feudId) {
    return db('npcs')
      .where('feud_id', feudId)
      .select('*');
  }

  /**
   * Lista NPCs contratados de um feudo
   */
  static async findHiredByFeudId(feudId) {
    return db('npcs')
      .where('feud_id', feudId)
      .where('hired', true)
      .select('*');
  }

  /**
   * Lista NPCs disponíveis (não contratados) de um feudo
   */
  static async findAvailableByFeudId(feudId) {
    return db('npcs')
      .where('feud_id', feudId)
      .where('hired', false)
      .select('*');
  }

  /**
   * Encontra NPC específico por tipo
   */
  static async findByFeudIdAndType(feudId, npcType) {
    return db('npcs')
      .where('feud_id', feudId)
      .where('npc_type', npcType)
      .select('*');
  }

  /**
   * Atualiza NPC
   */
  static async update(id, data) {
    await db('npcs')
      .where('id', id)
      .update({
        ...data,
        updated_at: new Date(),
      });

    return this.findById(id);
  }

  /**
   * Contrata um NPC
   */
  static async hire(id) {
    return this.update(id, {
      hired: true,
      hired_at: new Date(),
    });
  }

  /**
   * Demite um NPC
   */
  static async fire(id) {
    return this.update(id, {
      hired: false,
      hired_at: null,
    });
  }

  /**
   * Calcula custo mensal total de NPCs contratados
   */
  static async calculateMonthlyCost(feudId) {
    const hiredNpcs = await this.findHiredByFeudId(feudId);
    
    let totalCobre = 0;
    let totalPergaminhos = 0;

    hiredNpcs.forEach(npc => {
      totalCobre += npc.cost_cobre_monthly || 0;
      totalPergaminhos += npc.cost_pergaminhos_monthly || 0;
    });

    return {
      cobre: totalCobre,
      pergaminhos: totalPergaminhos,
    };
  }

  /**
   * Calcula bônus total de NPCs contratados
   */
  static async calculateTotalBonus(feudId) {
    const hiredNpcs = await this.findHiredByFeudId(feudId);
    
    const bonuses = {
      produção: 1.0,
      defesa: 1.0,
      pesquisa: 1.0,
      governo: 1.0,
    };

    hiredNpcs.forEach(npc => {
      if (npc.bonus_tipo && npc.bonus_valor) {
        bonuses[npc.bonus_tipo] *= npc.bonus_valor;
      }
    });

    return bonuses;
  }

  /**
   * Deleta NPC
   */
  static async delete(id) {
    return db('npcs')
      .where('id', id)
      .del();
  }
}

module.exports = NPC;
