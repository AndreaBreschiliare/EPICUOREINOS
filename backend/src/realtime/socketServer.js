const { Server } = require('socket.io');
const { verifyToken } = require('../config/jwt');
const Feud = require('../models/Feud');

let ioInstance = null;

function extractToken(socket) {
  const authToken = socket.handshake?.auth?.token;
  if (authToken) {
    return authToken.startsWith('Bearer ') ? authToken.substring(7) : authToken;
  }

  const authHeader = socket.handshake?.headers?.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

function initializeSocket(server) {
  const configuredOrigin = process.env.FRONTEND_URL;
  const isDevelopment = (process.env.NODE_ENV || 'development') !== 'production';

  ioInstance = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true);
        }

        const isLocalhost = /^https?:\/\/localhost(?::\d+)?$/i.test(origin);
        if (isDevelopment && isLocalhost) {
          return callback(null, true);
        }

        if (configuredOrigin && origin === configuredOrigin) {
          return callback(null, true);
        }

        return callback(new Error('Not allowed by Socket.IO CORS'), false);
      },
      credentials: true,
    },
  });

  ioInstance.use((socket, next) => {
    try {
      const token = extractToken(socket);
      if (!token) {
        return next(new Error('AUTH_TOKEN_REQUIRED'));
      }

      const payload = verifyToken(token);
      socket.data.userId = payload.id;
      return next();
    } catch (error) {
      return next(new Error('INVALID_SOCKET_TOKEN'));
    }
  });

  ioInstance.on('connection', socket => {
    socket.emit('socket:connected', {
      success: true,
      socketId: socket.id,
      userId: socket.data.userId,
      timestamp: new Date().toISOString(),
    });

    socket.on('feud:subscribe', async payload => {
      try {
        const feudId = parseInt(payload?.feudId, 10);
        if (!feudId) {
          socket.emit('feud:error', {
            error: 'INVALID_FEUD_ID',
          });
          return;
        }

        const feud = await Feud.findById(feudId);
        if (!feud || feud.user_id !== socket.data.userId) {
          socket.emit('feud:error', {
            error: 'FORBIDDEN_FEUD_SUBSCRIPTION',
            feudId,
          });
          return;
        }

        const roomName = `feud:${feudId}`;
        socket.join(roomName);

        socket.emit('feud:subscribed', {
          feudId,
          room: roomName,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        socket.emit('feud:error', {
          error: 'SUBSCRIPTION_FAILED',
          message: error.message,
        });
      }
    });

    socket.on('feud:unsubscribe', payload => {
      const feudId = parseInt(payload?.feudId, 10);
      if (!feudId) {
        return;
      }

      const roomName = `feud:${feudId}`;
      socket.leave(roomName);
      socket.emit('feud:unsubscribed', {
        feudId,
        room: roomName,
      });
    });
  });

  return ioInstance;
}

function getIO() {
  return ioInstance;
}

function emitToFeud(feudId, eventName, payload) {
  if (!ioInstance) {
    return;
  }

  ioInstance.to(`feud:${feudId}`).emit(eventName, {
    feudId,
    timestamp: new Date().toISOString(),
    ...payload,
  });
}

module.exports = {
  initializeSocket,
  getIO,
  emitToFeud,
};
