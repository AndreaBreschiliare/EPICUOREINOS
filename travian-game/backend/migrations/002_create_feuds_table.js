/**
 * Migration: Criar tabela feuds
 */
exports.up = function(knex) {
  return knex.schema.createTable('feuds', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().unique().notNullable();
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    
    table.string('name', 100).notNullable();
    table.integer('level').defaultTo(1);
    table.string('culture', 50).notNullable();
    
    // Recursos
    table.integer('madeira').defaultTo(0);
    table.integer('pedra').defaultTo(0);
    table.integer('ferro').defaultTo(0);
    table.integer('comida').defaultTo(0);
    table.integer('cobre').defaultTo(0);
    table.integer('pergaminhos').defaultTo(0);
    table.integer('cristais').defaultTo(0);
    table.integer('minério_raro').defaultTo(0);
    
    // Demográficos
    table.integer('população').defaultTo(0);
    table.integer('moral').defaultTo(50);
    
    table.timestamp('last_resource_update').defaultTo(knex.fn.now());
    table.timestamp('level_up_date').nullable();
    table.timestamps(true, true); // created_at, updated_at
    
    // Índices
    table.index('user_id');
    table.index('level');
    table.index('culture');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('feuds');
};
