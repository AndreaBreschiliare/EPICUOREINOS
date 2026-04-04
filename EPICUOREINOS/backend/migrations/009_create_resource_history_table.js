/**
 * Migration: Criar tabela resource_history (Histórico de Recursos)
 */
exports.up = function(knex) {
  return knex.schema.createTable('resource_history', function(table) {
    table.increments('id').primary();
    table.integer('feud_id').unsigned().notNullable();
    table.foreign('feud_id').references('feuds.id').onDelete('CASCADE');
    
    // Recursos no momento do snapshot
    table.integer('madeira').defaultTo(0);
    table.integer('pedra').defaultTo(0);
    table.integer('ferro').defaultTo(0);
    table.integer('comida').defaultTo(0);
    table.integer('cobre').defaultTo(0);
    table.integer('pergaminhos').defaultTo(0);
    table.integer('cristais').defaultTo(0);
    table.integer('minério_raro').defaultTo(0);
    
    // Timestamp do snapshot (daily/hourly)
    table.timestamp('snapshot_at').notNullable();
    
    table.timestamps(true, true);
    
    // Índices
    table.index('feud_id');
    table.index('snapshot_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('resource_history');
};
