const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');
const User = require('../models/User');
const Feud = require('../models/Feud');
const { ERROR_CODES } = require('../config/constants');

/**
 * Registra um novo usuário
 */
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Validação
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: ERROR_CODES.MISSING_FIELD,
        message: 'Username, email e password são obrigatórios',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: ERROR_CODES.INVALID_INPUT,
        message: 'Senha deve ter no mínimo 6 caracteres',
      });
    }

    // Verificar se usuário já existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: ERROR_CODES.USER_EXISTS,
        message: 'Este email já está cadastrado',
      });
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password_hash: passwordHash,
    });

    // Criar feudo para o novo usuário
    await Feud.create({
      user_id: user.id,
      name: `${username}'s Feud`,
      culture: 'Baduran', // Cultura padrão
      level: 1,
    });

    // Gerar token
    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        token,
      },
      message: 'Usuário registrado com sucesso',
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Erro ao registrar usuário',
    });
  }
}

/**
 * Faz login de usuário
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validação
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: ERROR_CODES.MISSING_FIELD,
        message: 'Email e password são obrigatórios',
      });
    }

    // Encontrar usuário
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: ERROR_CODES.INVALID_CREDENTIALS,
        message: 'Email ou senha incorretos',
      });
    }

    // Verificar senha
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        error: ERROR_CODES.INVALID_CREDENTIALS,
        message: 'Email ou senha incorretos',
      });
    }

    // Gerar token
    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        token,
      },
      message: 'Login bem-sucedido',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Erro ao fazer login',
    });
  }
}

module.exports = {
  register,
  login,
};
