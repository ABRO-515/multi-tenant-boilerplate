'use strict';

const { buildContainer } = require('./di/container');
const { buildApp } = require('./app');

async function main() {
  const container = buildContainer();

  const config = container.resolve('config');
  const logger = container.resolve('logger');

  logger.info('🚀 Starting Multi-Tenant SaaS API...');
  logger.info('📦 Initializing dependencies...');
  logger.info('🔧 Loading configuration...');
  logger.info(`🌐 Environment: ${config.env}`);
  logger.info('🌐 Creating Fastify application...');
  const app = await buildApp({ container });

  const shutdown = async (signal) => {
    logger.info('shutdown requested', { signal });

    try {
      await app.close();
      logger.info('shutdown complete');
    } catch (err) {
      logger.error('shutdown error', {
        err: {
          name: err.name,
          message: err.message,
          stack: err.stack
        }
      });
      process.exitCode = 1;
    }
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('unhandledRejection', (reason) => {
    logger.error('unhandledRejection', { reason });
  });

  process.on('uncaughtException', (err) => {
    logger.error('uncaughtException', {
      err: {
        name: err.name,
        message: err.message,
        stack: err.stack
      }
    });
    process.exit(1);
  });

  try {
    await app.listen({ port: config.app.port, host: config.app.host });

    const hostForUrl = config.app.host === '0.0.0.0' ? 'localhost' : config.app.host;
    const baseUrl = `http://${hostForUrl}:${config.app.port}`;

    logger.info(`✅ Server running on: ${baseUrl}`);

    if (config.swagger && config.swagger.enabled) {
      logger.info(`📚 API Documentation: ${baseUrl}${config.swagger.routePrefix}`);
    }

    if (config.metrics && config.metrics.enabled) {
      logger.info(`📊 Metrics: ${baseUrl}${config.metrics.route}`);
    }

    logger.info('🟦 Ready to start the development.');

    logger.info('server listening', {
      host: config.app.host,
      port: config.app.port
    });
  } catch (err) {
    logger.error('failed to start server', {
      err: {
        name: err.name,
        message: err.message,
        stack: err.stack
      }
    });
    process.exit(1);
  }
}

main();
