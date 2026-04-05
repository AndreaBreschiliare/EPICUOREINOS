const User = require('../models/User');
const Feud = require('../models/Feud');
const { ERROR_CODES } = require('../config/constants');

/**
 * GET /api/admin/users
 * Lista todos os usuários
 */
async function getAllUsers(req, res) {
  try {
    // Verificar se é admin
    const isAdmin = await User.isAdmin(req.user.id);
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Admin access required',
      });
    }

    const users = await User.findAll();

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving users',
    });
  }
}

/**
 * GET /api/admin/players
 * Lista apenas players (não admins)
 */
async function getPlayers(req, res) {
  try {
    // Verificar se é admin
    const isAdmin = await User.isAdmin(req.user.id);
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Admin access required',
      });
    }

    const players = await User.findByRole('player');

    res.json({
      success: true,
      data: players,
    });
  } catch (error) {
    console.error('Error getting players:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving players',
    });
  }
}

/**
 * DELETE /api/admin/users/:userId
 * Deleta um usuário e todos seus feudos
 */
async function deleteUser(req, res) {
  try {
    const adminId = req.user.id;
    const userId = req.params.userId;

    // Verificar se é admin
    const isAdmin = await User.isAdmin(adminId);
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Admin access required',
      });
    }

    // Não permitir auto-deletar
    if (adminId === parseInt(userId)) {
      return res.status(400).json({
        success: false,
        error: ERROR_CODES.INVALID_INPUT,
        message: 'Cannot delete your own account',
      });
    }

    // Verificar se usuário existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: ERROR_CODES.USER_NOT_FOUND,
        message: 'User not found',
      });
    }

    // Deletar todos os feudos do usuário
    const feuds = await Feud.findByUserId(userId);
    if (feuds) {
      console.log(`[AdminController] Deleting feud ${feuds.id} for user ${userId}`);
      await Feud.delete(feuds.id);
      console.log(`[AdminController] Feud ${feuds.id} deleted successfully`);
    }

    // Deletar o usuário
    console.log(`[AdminController] Deleting user ${userId} (${user.email})`);
    await User.delete(userId);
    console.log(`[AdminController] User ${userId} deleted successfully`);

    res.json({
      success: true,
      message: 'User deleted successfully',
      userId: userId,
      userEmail: user.email,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error deleting user',
    });
  }
}

/**
 * POST /api/admin/users/:userId/role
 * Altera o role de um usuário
 */
async function setUserRole(req, res) {
  try {
    const adminId = req.user.id;
    const userId = req.params.userId;
    const { role } = req.body;

    // Verificar se é admin
    const isAdmin = await User.isAdmin(adminId);
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Admin access required',
      });
    }

    // Validar role
    if (!['player', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: ERROR_CODES.INVALID_INPUT,
        message: 'Invalid role. Must be "player" or "admin"',
      });
    }

    // Verificar se usuário existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: ERROR_CODES.USER_NOT_FOUND,
        message: 'User not found',
      });
    }

    // Atualizar role
    const updatedUser = await User.setRole(userId, role);

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error('Error setting user role:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error updating user role',
    });
  }
}

/**
 * GET /api/admin/stats
 * Retorna estatísticas do servidor
 */
async function getStats(req, res) {
  try {
    // Verificar se é admin
    const isAdmin = await User.isAdmin(req.user.id);
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        error: ERROR_CODES.FORBIDDEN,
        message: 'Admin access required',
      });
    }

    const db = require('../config/database');

    const totalUsers = await db('users').count('* as count').first();
    const players = await db('users').where('role', 'player').count('* as count').first();
    const admins = await db('users').where('role', 'admin').count('* as count').first();
    const totalFeuds = await db('feuds').count('* as count').first();

    res.json({
      success: true,
      data: {
        totalUsers: totalUsers.count || 0,
        players: players.count || 0,
        admins: admins.count || 0,
        totalFeuds: totalFeuds.count || 0,
      },
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving stats',
    });
  }
}

/**
 * POST /api/debug/make-admin
 * DEBUG: Torna um usuário admin (sem autenticação em dev)
 */
async function debugMakeAdmin(req, res) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: ERROR_CODES.MISSING_FIELD,
        message: 'userId is required',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: ERROR_CODES.USER_NOT_FOUND,
        message: 'User not found',
      });
    }

    const updatedUser = await User.setRole(userId, 'admin');

    res.json({
      success: true,
      message: `✅ User ${user.username} is now admin`,
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error('Error in debug make admin:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error making user admin',
    });
  }
}

/**
 * GET /api/debug/get-role
 * DEBUG: Retorna o role do usuário autenticado
 */
async function debugGetRole(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: ERROR_CODES.UNAUTHORIZED,
        message: 'Not authenticated',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: ERROR_CODES.USER_NOT_FOUND,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role || 'player',
      },
    });
  } catch (error) {
    console.error('Error in debug get role:', error);
    res.status(500).json({
      success: false,
      error: ERROR_CODES.INTERNAL_ERROR,
      message: 'Error retrieving role',
    });
  }
}

module.exports = {
  getAllUsers,
  getPlayers,
  deleteUser,
  setUserRole,
  getStats,
  debugMakeAdmin,
  debugGetRole,
};
