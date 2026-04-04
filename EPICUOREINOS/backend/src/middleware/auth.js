const { verifyToken } = require('../config/jwt');
const { ERROR_CODES } = require('../config/constants');

/**
 * Middleware para verificar autenticação
 */
function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: ERROR_CODES.INVALID_TOKEN,
        message: 'Token não fornecido',
      });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: ERROR_CODES.INVALID_TOKEN,
      message: 'Token inválido ou expirado',
    });
  }
}

module.exports = {
  authenticate,
};
