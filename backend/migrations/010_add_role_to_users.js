/**
 * Migration: Adicionar coluna role à tabela users
 */
exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    table.enum('role', ['player', 'admin']).defaultTo('player').notNullable();
    table.index('role');
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropIndex('role');
    table.dropColumn('role');
  });
};
