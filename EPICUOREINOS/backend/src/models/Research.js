const db = require('../config/database');

class Research {
  /**
   * Cria uma nova pesquisa
   */
  static async create(researchData) {
    const result = await db('research').insert({
      feud_id: researchData.feud_id,
      tech_name: researchData.tech_name,
      level: researchData.level || 1,
      status: researchData.status || 'complete',
      research_start_time: researchData.research_start_time || null,
      research_end_time: researchData.research_end_time || null,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning('id');

    const id = result[0].id || result[0];
    return this.findById(id);
  }

  /**
   * Encontra pesquisa por ID
   */
  static async findById(id) {
    return db('research')
      .where('id', id)
      .first();
  }

  /**
   * Lista todas as pesquisas de um feudo
   */
  static async findByFeudId(feudId) {
    return db('research')
      .where('feud_id', feudId)
      .select('*');
  }

  /**
   * Encontra uma pesquisa específica por feudo e nome da tech
   */
  static async findByFeudIdAndTechName(feudId, techName) {
    return db('research')
      .where('feud_id', feudId)
      .where('tech_name', techName)
      .first();
  }

  /**
   * Lista pesquisas ativas
   */
  static async findActiveByFeudId(feudId) {
    return db('research')
      .where('feud_id', feudId)
      .where('status', 'in_progress')
      .select('*');
  }

  /**
   * Atualiza pesquisa
   */
  static async update(id, data) {
    await db('research')
      .where('id', id)
      .update({
        ...data,
        updated_at: new Date(),
      });

    return this.findById(id);
  }

  /**
   * Inicia uma pesquisa
   */
  static async startResearch(id, endTime) {
    return this.update(id, {
      status: 'in_progress',
      research_start_time: new Date(),
      research_end_time: endTime,
    });
  }

  /**
   * Completa uma pesquisa
   */
  static async completeResearch(id) {
    return this.update(id, {
      status: 'complete',
      research_end_time: new Date(),
    });
  }

  /**
   * Faz upgrade em uma pesquisa
   */
  static async upgradeResearch(id, newLevel) {
    return this.update(id, { level: newLevel });
  }

  /**
   * Deleta pesquisa
   */
  static async delete(id) {
    return db('research')
      .where('id', id)
      .del();
  }

  /**
   * Retorna todas as pesquisas completadas
   */
  static async findCompletedByFeudId(feudId) {
    return db('research')
      .where('feud_id', feudId)
      .where('status', 'complete')
      .select('*');
  }
}

module.exports = Research;
