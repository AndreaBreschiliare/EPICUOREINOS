const db = require('../config/database');

class ResourceHistory {
  /**
   * Cria um novo registro de histórico de recursos
   */
  static async create(historyData) {
    const result = await db('resource_history').insert({
      feud_id: historyData.feud_id,
      madeira: historyData.madeira || 0,
      pedra: historyData.pedra || 0,
      ferro: historyData.ferro || 0,
      comida: historyData.comida || 0,
      cobre: historyData.cobre || 0,
      pergaminhos: historyData.pergaminhos || 0,
      cristais: historyData.cristais || 0,
      minério_raro: historyData.minério_raro || 0,
      snapshot_at: historyData.snapshot_at || new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    }).returning('id');

    const id = result[0].id || result[0];
    return this.findById(id);
  }

  /**
   * Encontra registro por ID
   */
  static async findById(id) {
    return db('resource_history')
      .where('id', id)
      .first();
  }

  /**
   * Lista todo histórico de recursos de um feudo
   */
  static async findByFeudId(feudId) {
    return db('resource_history')
      .where('feud_id', feudId)
      .orderBy('snapshot_at', 'desc')
      .select('*');
  }

  /**
   * Lista histórico de recursos dos últimos 30 dias
   */
  static async findByFeudIdLast30Days(feudId) {
    const thirtyDaysAgo = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return db('resource_history')
      .where('feud_id', feudId)
      .where('snapshot_at', '>=', thirtyDaysAgo)
      .orderBy('snapshot_at', 'desc')
      .select('*');
  }

  /**
   * Lista histórico de recursos dos últimos N dias
   */
  static async findByFeudIdLastDays(feudId, days) {
    const daysAgo = new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000);
    
    return db('resource_history')
      .where('feud_id', feudId)
      .where('snapshot_at', '>=', daysAgo)
      .orderBy('snapshot_at', 'desc')
      .select('*');
  }

  /**
   * Atualiza registro de histórico
   */
  static async update(id, data) {
    await db('resource_history')
      .where('id', id)
      .update({
        ...data,
        updated_at: new Date(),
      });

    return this.findById(id);
  }

  /**
   * Calcula crescimento de recursos entre dois snapshots
   */
  static async calculateGrowth(feudId, startDate, endDate) {
    const startSnap = await db('resource_history')
      .where('feud_id', feudId)
      .where('snapshot_at', '>=', startDate)
      .orderBy('snapshot_at', 'asc')
      .first();

    const endSnap = await db('resource_history')
      .where('feud_id', feudId)
      .where('snapshot_at', '<=', endDate)
      .orderBy('snapshot_at', 'desc')
      .first();

    if (!startSnap || !endSnap) {
      return null;
    }

    return {
      madeira: endSnap.madeira - startSnap.madeira,
      pedra: endSnap.pedra - startSnap.pedra,
      ferro: endSnap.ferro - startSnap.ferro,
      comida: endSnap.comida - startSnap.comida,
      cobre: endSnap.cobre - startSnap.cobre,
      pergaminhos: endSnap.pergaminhos - startSnap.pergaminhos,
      cristais: endSnap.cristais - startSnap.cristais,
      minério_raro: endSnap.minério_raro - startSnap.minério_raro,
    };
  }

  /**
   * Calcula taxa média de produção
   */
  static async calculateAverageProduction(feudId, days = 7) {
    const history = await this.findByFeudIdLastDays(feudId, days);

    if (history.length < 2) {
      return null;
    }

    const firstRecord = history[history.length - 1];
    const lastRecord = history[0];

    const daysDiff = Math.max(1, Math.floor(
      (lastRecord.snapshot_at - firstRecord.snapshot_at) / (1000 * 60 * 60 * 24)
    ));

    return {
      madeira: Math.round((lastRecord.madeira - firstRecord.madeira) / daysDiff),
      pedra: Math.round((lastRecord.pedra - firstRecord.pedra) / daysDiff),
      ferro: Math.round((lastRecord.ferro - firstRecord.ferro) / daysDiff),
      comida: Math.round((lastRecord.comida - firstRecord.comida) / daysDiff),
      cobre: Math.round((lastRecord.cobre - firstRecord.cobre) / daysDiff),
      pergaminhos: Math.round((lastRecord.pergaminhos - firstRecord.pergaminhos) / daysDiff),
      cristais: Math.round((lastRecord.cristais - firstRecord.cristais) / daysDiff),
      minério_raro: Math.round((lastRecord.minério_raro - firstRecord.minério_raro) / daysDiff),
    };
  }

  /**
   * Deleta registros antigos (mais de N dias)
   */
  static async deleteOlderThan(feudId, days) {
    const cutoffDate = new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000);
    
    return db('resource_history')
      .where('feud_id', feudId)
      .where('snapshot_at', '<', cutoffDate)
      .del();
  }

  /**
   * Deleta um registro específico
   */
  static async delete(id) {
    return db('resource_history')
      .where('id', id)
      .del();
  }
}

module.exports = ResourceHistory;
