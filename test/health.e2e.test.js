'use strict';

const request = require('supertest');
const { buildContainer } = require('../src/di/container');
const { buildApp } = require('../src/app');

describe('System', () => {
  /** @type {import('fastify').FastifyInstance} */
  let app;

  beforeAll(async () => {
    const container = buildContainer();
    app = await buildApp({ container });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('GET /health returns ok', async () => {
    const res = await request(app.server).get('/health').expect(200);

    expect(res.body).toMatchObject({
      status: 'ok'
    });
  });
});
