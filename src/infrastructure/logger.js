'use strict';

const fs = require('node:fs');
const path = require('node:path');
const winston = require('winston');

/**
 * Winston logger factory.
 *
 * Console transport is developer-friendly, file transport is machine-friendly.
 * File logs are intended for shipping to a centralized log store in production.
 *
 * @param {{ level: string, dir: string, appName: string, env: string }} params
 * @returns {import('winston').Logger}
 */
function createLogger({ level, dir, appName, env }) {
  const logDir = path.resolve(process.cwd(), dir);

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const fileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  );

  winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    http: 'magenta',
    verbose: 'cyan',
    debug: 'green',
    silly: 'gray'
  });

  const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp(),
    winston.format.printf((info) => {
      const { timestamp, level: lvl, message, ...meta } = info;
      const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
      return `${timestamp} ${lvl}: ${message}${metaStr ? ` ${metaStr}` : ''}`;
    })
  );

  const auditOnly = winston.format((info) => {
    if (info.channel === 'audit') return info;
    return false;
  });

  return winston.createLogger({
    level,
    defaultMeta: { service: appName, env },
    transports: [
      new winston.transports.Console({ format: consoleFormat }),
      new winston.transports.File({
        filename: path.join(logDir, 'app.log'),
        format: fileFormat
      }),
      new winston.transports.File({
        filename: path.join(logDir, 'audit.log'),
        format: winston.format.combine(auditOnly(), fileFormat)
      })
    ]
  });
}

module.exports = { createLogger };
