/**
 * Migration: Criar tabela npcs (Personagens Contratáveis)
 */
exports.up = function(knex) {
  return knex.schema.createTable('npcs', function(table) {
    table.increments('id').primary();
    table.integer('feud_id').unsigned().notNullable();
    table.foreign('feud_id').references('feuds.id').onDelete('CASCADE');
    
    table.string('npc_type', 100).notNullable(); // ferreiro, comandante, etc
    table.string('name', 100).notNullable();
    table.text('description').nullable();
    
    // Nível mínimo para contratar
    table.integer('level_required').defaultTo(1);
    
    // Custo mensal
    table.integer('cost_cobre_monthly').defaultTo(0);
    table.integer('cost_pergaminhos_monthly').nullable();
    
    // Bônus fornecido
    table.string('bonus_tipo', 50).nullable(); // produção, defesa, etc
    table.decimal('bonus_valor', 5, 2).nullable(); // 1.15 = +15%
    
    // Status
    table.boolean('hired').defaultTo(false);
    table.timestamp('hired_at').nullable();
    
    table.timestamps(true, true);
    
    // Índices
    table.index('feud_id');
    table.index('npc_type');
    table.index('hired');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('npcs');
};
