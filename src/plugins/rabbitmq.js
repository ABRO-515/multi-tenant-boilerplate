'use strict';

const fp = require('fastify-plugin');
const amqp = require('amqp-connection-manager');
const { asValue } = require('awilix');

async function rabbitmqPlugin(fastify) {
  const connection = amqp.connect([fastify.config.rabbitmq.url]);

  const channelWrapper = connection.createChannel({
    json: true,
    setup: async (channel) => {
      // Base exchanges/queues can be declared here.
      await channel.assertExchange('events', 'topic', { durable: true });
    }
  });

  async function publish({ routingKey, message }) {
    await channelWrapper.publish('events', routingKey, message, { persistent: true });
  }

  fastify.decorate('rabbitmq', { connection, channelWrapper, publish });

  fastify.container.register({
    rabbitmq: asValue(fastify.rabbitmq)
  });

  fastify.addHook('onClose', async () => {
    try {
      await channelWrapper.close();
    } catch (_) {}

    try {
      await connection.close();
    } catch (_) {}
  });
}

module.exports = fp(rabbitmqPlugin, { name: 'rabbitmqPlugin' });
