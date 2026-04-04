/**
 * Migration: Criar tabela edicts (Éditos Regionais)
 */
exports.up = function(knex) {
  return knex.schema.createTable('edicts', function(table) {
    table.increments('id').primary();
    table.integer('feud_id').unsigned().notNullable();
    table.foreign('feud_id').references('feuds.id').onDelete('CASCADE');
    
    table.string('edict_name', 100).notNullable();
    table.string('category', 50).notNullable(); // regional, comercial, militar, etc
    table.integer('level_required').notNullable();
    
    // Estado
    table.string('status', 20).defaultTo('inactive'); // active, inactive
    table.timestamp('active_since').nullable();
    
    // Efeitos multiplicadores
    table.decimal('effect_multipllier', 5, 2).defaultTo(1.0); // 1.15 = +15%
    table.text('effect_description').nullable();
    
    table.timestamps(true, true);
    
    // Índices
    table.index('feud_id');
    table.index('category');
    table.index('status');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('edicts');
};
