/**
 * Migration: Criar tabelas buildings
 */
exports.up = function(knex) {
  return knex.schema.createTable('buildings', function(table) {
    table.increments('id').primary();
    table.integer('feud_id').unsigned().notNullable();
    table.foreign('feud_id').references('feuds.id').onDelete('CASCADE');
    
    table.string('type', 50).notNullable(); // casa, fazenda, lenhador, etc
    table.integer('level').defaultTo(1);
    table.string('status', 20).defaultTo('complete');
    
    table.timestamp('construction_start_time').nullable();
    table.timestamp('construction_end_time').nullable();
    
    // Upkeep (manutenção)
    table.integer('upkeep_madeira').defaultTo(0);
    table.integer('upkeep_pedra').defaultTo(0);
    table.integer('upkeep_ferro').defaultTo(0);
    table.integer('upkeep_comida').defaultTo(0);
    table.integer('upkeep_cobre').defaultTo(0);
    
    // Produção
    table.integer('produção_madeira').defaultTo(0);
    table.integer('produção_pedra').defaultTo(0);
    table.integer('produção_ferro').defaultTo(0);
    table.integer('produção_comida').defaultTo(0);
    table.integer('produção_cobre').defaultTo(0);
    
    table.timestamps(true, true);
    
    // Índices
    table.index('feud_id');
    table.index('type');
    table.index('status');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('buildings');
};
