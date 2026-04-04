const db = require('../config/database');

class Building {
  /**
   * Cria uma nova construção
   */
  static async create(buildingData) {
    const result = await db('buildings').insert({
      feud_id: buildingData.feud_id,
      type: buildingData.type,
      level: buildingData.level || 1,
      status: buildingData.status || 'complete',
      construction_start_time: buildingData.construction_start_time || null,
      construction_end_time: buildingData.construction_end_time || null,
      upkeep_madeira: buildingData.upkeep_madeira || 0,
      upkeep_pedra: buildingData.upkeep_pedra || 0,
      upkeep_ferro: buildingData.upkeep_ferro || 0,
      upkeep_comida: buildingData.upkeep_comida || 0,
      upkeep_cobre: buildingData.upkeep_cobre || 0,
      produção_madeira: buildingData.produção_madeira || 0,
      produção_pedra: buildingData.produção_pedra || 0,
      produção_ferro: buildingData.produção_ferro || 0,
      produção_comida: buildingData.produção_comida || 0,
      produção_cobre: buildingData.produção_cobre || 0,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning('id');

    const id = result[0].id || result[0];
    return this.findById(id);
  }

  /**
   * Encontra construção por ID
   */
  static async findById(id) {
    return db('buildings')
      .where('id', id)
      .first();
  }

  /**
   * Lista todas as construções de um feudo
   */
  static async findByFeudId(feudId) {
    return db('buildings')
      .where('feud_id', feudId)
      .select('*');
  }

  /**
   * Lista construções de um tipo específico
   */
  static async findByFeudIdAndType(feudId, type) {
    return db('buildings')
      .where('feud_id', feudId)
      .where('type', type)
      .select('*');
  }

  /**
   * Atualiza construção
   */
  static async update(id, data) {
    await db('buildings')
      .where('id', id)
      .update({
        ...data,
        updated_at: new Date(),
      });

    return this.findById(id);
  }

  /**
   * Faz upgrade de construção
   */
  static async upgrade(id, newLevel) {
    return this.update(id, { level: newLevel });
  }

  /**
   * Deleta construção
   */
  static async delete(id) {
    return db('buildings')
      .where('id', id)
      .del();
  }

  /**
   * Calcula produção total de um feudo
   */
  static async calculateTotalProduction(feudId) {
    const buildings = await this.findByFeudId(feudId);
    
    const production = {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 0,
    };

    buildings.forEach(building => {
      production.madeira += building.produção_madeira || 0;
      production.pedra += building.produção_pedra || 0;
      production.ferro += building.produção_ferro || 0;
      production.comida += building.produção_comida || 0;
      production.cobre += building.produção_cobre || 0;
    });

    return production;
  }

  /**
   * Calcula manutenção total de um feudo
   */
  static async calculateTotalUpkeep(feudId) {
    const buildings = await this.findByFeudId(feudId);
    
    const upkeep = {
      madeira: 0,
      pedra: 0,
      ferro: 0,
      comida: 0,
      cobre: 0,
    };

    buildings.forEach(building => {
      upkeep.madeira += building.upkeep_madeira || 0;
      upkeep.pedra += building.upkeep_pedra || 0;
      upkeep.ferro += building.upkeep_ferro || 0;
      upkeep.comida += building.upkeep_comida || 0;
      upkeep.cobre += building.upkeep_cobre || 0;
    });

    return upkeep;
  }
}

module.exports = Building;
