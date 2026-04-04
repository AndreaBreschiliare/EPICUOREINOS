/**
 * Production Scheduler
 * Executa produção de recursos automaticamente a cada 24 horas
 */

const schedule = require('node-schedule');
const ResourceService = require('../services/ResourceService');

let scheduledJob = null;

/**
 * Inicia o scheduler de produção
 */
function startProductionScheduler() {
  try {
    // Verificar configuração de ambiente
    const isDevelopment = process.env.NODE_ENV === 'development';
    const tickInterval = isDevelopment 
      ? process.env.TICK_INTERVAL_DEV_MS || 300000 // 5 minutos em dev
      : process.env.TICK_INTERVAL_MS || 86400000; // 24 horas em prod

    // Converter milissegundos para segundos para o cron
    const intervalSeconds = Math.floor(tickInterval / 1000);

    console.log(`[ProductionScheduler] Starting scheduler`);
    console.log(`[ProductionScheduler] Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[ProductionScheduler] Interval: ${intervalSeconds} seconds (${tickInterval}ms)`);

    // Executar imediatamente na primeira vez (de maneira opcional)
    // ResourceService.produceAllResources().catch(err => console.error(err));

    // Agendar para executar periodicamente
    // Usando setInterval é mais simples para testes
    const intervalId = setInterval(async () => {
      try {
        console.log(`[ProductionScheduler] Running production cycle at ${new Date().toISOString()}`);
        await ResourceService.produceAllResources();
      } catch (error) {
        console.error('[ProductionScheduler] Error in production cycle:', error);
      }
    }, tickInterval);

    scheduledJob = intervalId;

    console.log('[ProductionScheduler] Production scheduler started successfully');
    
    return intervalId;
  } catch (error) {
    console.error('[ProductionScheduler] Error starting scheduler:', error);
    throw error;
  }
}

/**
 * Para o scheduler
 */
function stopProductionScheduler() {
  try {
    if (scheduledJob) {
      clearInterval(scheduledJob);
      scheduledJob = null;
      console.log('[ProductionScheduler] Production scheduler stopped');
    }
  } catch (error) {
    console.error('[ProductionScheduler] Error stopping scheduler:', error);
    throw error;
  }
}

/**
 * Retorna status do scheduler
 */
function getSchedulerStatus() {
  return {
    isRunning: scheduledJob !== null,
    nextRun: scheduledJob ? 'See logs' : 'Not running',
    environment: process.env.NODE_ENV || 'development',
  };
}

/**
 * Executa produção manualmente (para testes)
 */
async function runProductionManually() {
  try {
    console.log('[ProductionScheduler] Running production manually');
    return await ResourceService.produceAllResources();
  } catch (error) {
    console.error('[ProductionScheduler] Error running production manually:', error);
    throw error;
  }
}

module.exports = {
  startProductionScheduler,
  stopProductionScheduler,
  getSchedulerStatus,
  runProductionManually,
};
