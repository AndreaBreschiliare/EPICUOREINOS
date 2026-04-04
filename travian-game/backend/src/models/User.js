const db = require('../config/database');

class User {
  /**
   * Cria um novo usuário
   */
  static async create(userData) {
    const result = await db('users').insert({
      username: userData.username,
      email: userData.email,
      password_hash: userData.password_hash,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning('id');

    const id = result[0].id || result[0];
    return this.findById(id);
  }

  /**
   * Encontra usuário por ID
   */
  static async findById(id) {
    return db('users')
      .where('id', id)
      .first();
  }

  /**
   * Encontra usuário por email
   */
  static async findByEmail(email) {
    return db('users')
      .where('email', email.toLowerCase())
      .first();
  }

  /**
   * Encontra usuário por username
   */
  static async findByUsername(username) {
    return db('users')
      .where('username', username.toLowerCase())
      .first();
  }

  /**
   * Atualiza usuário
   */
  static async update(id, data) {
    await db('users')
      .where('id', id)
      .update({
        ...data,
        updated_at: new Date(),
      });

    return this.findById(id);
  }

  /**
   * Deleta usuário
   */
  static async delete(id) {
    return db('users')
      .where('id', id)
      .del();
  }
}

module.exports = User;
