'use strict';

const { createContainer, asFunction, asValue } = require('awilix');
const { config } = require('../config');
const { createLogger } = require('../infrastructure/logger');

/**
 * Root DI container.
 *
 * We use a per-request scoped container later (for tenant context, auth context, etc.)
 * while keeping singletons (config, logger) at the root.
 *
 * @returns {import('awilix').AwilixContainer}
 */
function buildContainer() {
  const container = createContainer();

  container.register({
    config: asValue(config),
    logger: asFunction(({ config: cfg }) =>
      createLogger({
        level: cfg.log.level,
        dir: cfg.log.dir,
        appName: cfg.app.name,
        env: cfg.env
      })
    ).singleton()
  });

  const logger = container.resolve('logger');
  logger.info('🧩 DI container: registering components...');

  // Mediators
  container.register({
    authMediator: asFunction(require('../mediators/auth.mediator')).scoped(),
    userMediator: asFunction(require('../mediators/user.mediator')).scoped(),
    tenantMediator: asFunction(require('../mediators/tenant.mediator')).scoped()
  });

  logger.info('🧩 DI loaded: mediators');

  // Services
  container.register({
    healthService: asFunction(require('../services/health.service')).scoped(),
    tenantService: asFunction(require('../services/tenant.service')).scoped(),
    userService: asFunction(require('../services/user.service')).scoped(),
    authService: asFunction(require('../services/auth.service')).scoped()
  });

  logger.info('🧩 DI loaded: services');

  // Repositories
  container.register({
    tenantRepository: asFunction(require('../repositories/tenant.repository')).scoped(),
    userRepository: asFunction(require('../repositories/user.repository')).scoped()
  });

  logger.info('🧩 DI loaded: repositories');

  // Controllers
  container.register({
    healthController: asFunction(require('../controllers/health.controller')).scoped(),
    systemTenantController: asFunction(require('../controllers/system/tenant.controller')).scoped(),
    userController: asFunction(require('../controllers/user.controller')).scoped(),
    authController: asFunction(require('../controllers/auth.controller')).scoped()
  });

  logger.info('🧩 DI loaded: controllers');

  return container;
}

module.exports = { buildContainer };
