require('dotenv').config();

const http = require('http');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const feudRoutes = require('./routes/feud');
const adminRoutes = require('./routes/admin');
const ProductionScheduler = require('./jobs/ProductionScheduler');
const { initializeSocket } = require('./realtime/socketServer');

// Initialize Express app
const app = express();

// ==================== MIDDLEWARE ====================

// CORS
app.use(cors({
  origin: (origin, callback) => {
    const configuredOrigin = process.env.FRONTEND_URL;
    const isDevelopment = (process.env.NODE_ENV || 'development') !== 'production';

    // Allow requests from tools/postman or same-origin calls without an Origin header.
    if (!origin) {
      return callback(null, true);
    }

    // Development fallback: allow localhost with any port (e.g. Vite 5173/5174).
    const isLocalhost = /^https?:\/\/localhost(?::\d+)?$/i.test(origin);
    if (isDevelopment && isLocalhost) {
      return callback(null, true);
    }

    if (configuredOrigin && origin === configuredOrigin) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ==================== HEALTH CHECK ====================

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ==================== API ROUTES ====================

app.use('/api/auth', authRoutes);
app.use('/api/feud', feudRoutes);
app.use('/api/admin', adminRoutes);

// ==================== DEBUG ROUTES ====================
// DEBUG: Endpoint para fazer admin (sem auth em dev)
const adminDebugController = require('./controllers/adminController');
app.post('/api/debug/make-admin', adminDebugController.debugMakeAdmin);

// Status endpoint para scheduler
app.get('/api/admin/scheduler/status', (req, res) => {
  res.json({
    success: true,
    data: ProductionScheduler.getSchedulerStatus(),
  });
});

// Endpoint para executar produção manualmente (para testes)
app.post('/api/admin/scheduler/run', async (req, res) => {
  try {
    const result = await ProductionScheduler.runProductionManually();
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'SCHEDULER_ERROR',
      message: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: 'Endpoint not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.code || 'INTERNAL_ERROR',
    message: err.message || 'Internal server error',
  });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = initializeSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API Health: http://localhost:${PORT}/health`);
  console.log(`📡 Socket.IO enabled on ws://localhost:${PORT}`);

  // Iniciar scheduler de produção
  try {
    ProductionScheduler.startProductionScheduler();
    console.log('✅ Production scheduler started');
  } catch (error) {
    console.error('❌ Failed to start production scheduler:', error);
  }
});

module.exports = { app, server, io };
