/**
 * Migration: Criar tabela research
 */
exports.up = function(knex) {
  return knex.schema.createTable('research', function(table) {
    table.increments('id').primary();
    table.integer('feud_id').unsigned().notNullable();
    table.foreign('feud_id').references('feuds.id').onDelete('CASCADE');
    
    table.string('tech_name', 100).notNullable();
    table.integer('level').defaultTo(1);
    table.string('status', 20).defaultTo('complete'); // complete, in_progress
    
    // Pesquisa
    table.timestamp('research_start_time').nullable();
    table.timestamp('research_end_time').nullable();
    
    table.timestamps(true, true);
    
    // Índices
    table.index('feud_id');
    table.index('tech_name');
    table.index('status');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('research');
};
