'use strict';

/**
 * @param {{ config: { app: { name: string }, env: string } }} deps
 */
module.exports = ({ config }) => {
  return {
    getHealth() {
      return {
        status: 'ok',
        app: config.app.name,
        env: config.env,
        uptime: process.uptime()
      };
    }
  };
};
