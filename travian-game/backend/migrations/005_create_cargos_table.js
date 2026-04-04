/**
 * Migration: Criar tabela cargos (Especialistas/Positions)
 */
exports.up = function(knex) {
  return knex.schema.createTable('cargos', function(table) {
    table.increments('id').primary();
    table.integer('feud_id').unsigned().notNullable();
    table.foreign('feud_id').references('feuds.id').onDelete('CASCADE');
    
    table.string('cargo_name', 100).notNullable(); // ferreiro, líder, comandante, etc
    table.string('holder_name', 100).nullable(); // Nome do especialista (pode ser NPC)
    table.boolean('is_npc').defaultTo(false);
    
    // Efeito dos bônus
    table.string('bonus_tipo', 50).nullable(); // produção, defesa, etc
    table.decimal('bonus_valor', 5, 2).nullable(); // 1.15 = +15%
    
    table.boolean('active').defaultTo(false);
    
    table.timestamps(true, true);
    
    // Índices
    table.index('feud_id');
    table.index('cargo_name');
    table.index('active');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('cargos');
};
