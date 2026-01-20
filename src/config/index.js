'use strict';

const path = require('node:path');
const dotenv = require('dotenv');
const { cleanEnv, str, num, bool } = require('envalid');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const env = cleanEnv(process.env, {
  NODE_ENV: str({ default: 'development' }),
  APP_NAME: str({ default: 'multi-tenant-saas-api' }),
  HOST: str({ default: '0.0.0.0' }),
  PORT: num({ default: 7000 }),

  LOG_LEVEL: str({ default: 'info' }),
  LOG_DIR: str({ default: 'logs' }),

  CORS_ORIGIN: str({ default: '*' }),

  SWAGGER_ENABLED: bool({ default: true }),
  SWAGGER_ROUTE_PREFIX: str({ default: '/docs' }),

  METRICS_ENABLED: bool({ default: true }),
  METRICS_ROUTE: str({ default: '/metrics' }),

  RATE_LIMIT_ENABLED: bool({ default: true }),
  RATE_LIMIT_MAX: num({ default: 100 }),
  RATE_LIMIT_TIME_WINDOW: str({ default: '1 minute' }),

  DATABASE_HOST: str({ default: 'localhost' }),
  DATABASE_PORT: num({ default: 5432 }),
  DATABASE_USER: str({ default: 'postgres' }),
  DATABASE_PASSWORD: str({ default: 'postgres' }),
  DATABASE_NAME: str({ default: 'saas' }),

  REDIS_HOST: str({ default: 'localhost' }),
  REDIS_PORT: num({ default: 6379 }),
  REDIS_PASSWORD: str({ default: '' }),

  RABBITMQ_URL: str({ default: 'amqp://guest:guest@localhost:5672' }),

  TENANT_HEADER_ID: str({ default: 'x-tenant-id' }),
  TENANT_HEADER_KEY: str({ default: 'x-tenant-key' }),
  TENANT_BASE_DOMAIN: str({ default: '' }),

  SYSTEM_API_KEY: str({ default: 'dev_system_key' }),

  JWT_ACCESS_SECRET: str({ default: 'CHANGE_ME' }),
  JWT_ACCESS_TTL_SECONDS: num({ default: 900 }),
  REFRESH_TOKEN_TTL_SECONDS: num({ default: 60 * 60 * 24 * 30 }),
  SESSION_TTL_SECONDS: num({ default: 60 * 60 * 24 })
});

if (env.NODE_ENV === 'production' && env.JWT_ACCESS_SECRET === 'CHANGE_ME') {
  throw new Error('JWT_ACCESS_SECRET must be set in production (not CHANGE_ME)');
}

if (env.NODE_ENV === 'production' && env.SYSTEM_API_KEY === 'dev_system_key') {
  throw new Error('SYSTEM_API_KEY must be set in production (not dev_system_key)');
}

const config = Object.freeze({
  env: env.NODE_ENV,
  app: {
    name: env.APP_NAME,
    host: env.HOST,
    port: env.PORT
  },
  log: {
    level: env.LOG_LEVEL,
    dir: env.LOG_DIR
  },
  cors: {
    origin: env.CORS_ORIGIN
  },
  swagger: {
    enabled: env.SWAGGER_ENABLED,
    routePrefix: env.SWAGGER_ROUTE_PREFIX
  },
  metrics: {
    enabled: env.METRICS_ENABLED,
    route: env.METRICS_ROUTE
  },
  rateLimit: {
    enabled: env.RATE_LIMIT_ENABLED,
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_TIME_WINDOW
  },
  db: {
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME
  },
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD || undefined
  },
  rabbitmq: {
    url: env.RABBITMQ_URL
  },
  tenancy: {
    headers: {
      tenantId: env.TENANT_HEADER_ID,
      tenantKey: env.TENANT_HEADER_KEY
    },
    baseDomain: env.TENANT_BASE_DOMAIN || undefined
  },
  system: {
    apiKey: env.SYSTEM_API_KEY
  },
  auth: {
    jwtAccessSecret: env.JWT_ACCESS_SECRET,
    jwtAccessTtlSeconds: env.JWT_ACCESS_TTL_SECONDS,
    refreshTokenTtlSeconds: env.REFRESH_TOKEN_TTL_SECONDS,
    sessionTtlSeconds: env.SESSION_TTL_SECONDS
  }
});

module.exports = { config };
