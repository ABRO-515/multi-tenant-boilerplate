# Fastify Multi-Tenant SaaS Boilerplate (Backend)

Enterprise-grade **multi-tenant SaaS** backend boilerplate using **Fastify (Node.js / JavaScript)** with **schema-per-tenant** isolation in PostgreSQL.

## Requirements

- Node.js >= 18
- Docker + Docker Compose

## Quick start (local)

1. Copy env file

```bash
cp .env.example .env
```

2. Install dependencies

```bash
npm install
```

3. Run dev server

```bash
npm run dev
```

## Run with Docker Compose

This spins up Postgres, Redis, RabbitMQ, and the API.

```bash
docker compose up --build
```

RabbitMQ Management UI:

- http://localhost:15672
- user: `guest`
- pass: `guest`

## Multi-tenancy (schema-per-tenant)

### 1) Create a tenant (system route)

This creates a row in `public.tenants`, creates the tenant schema (e.g. `tenant_acme`), and runs tenant migrations.

```bash
curl -X POST http://localhost:3000/system/tenants \
  -H "content-type: application/json" \
  -H "x-api-key: dev_system_key" \
  -d '{"tenantId":"acme","name":"Acme Inc"}'
```

Response contains `tenantKey` (store it; it is returned only once).

### 2) Call tenant-scoped APIs

Tenant is resolved via headers:

- `x-tenant-id`
- `x-tenant-key`

```bash
curl http://localhost:3000/v1/users \
  -H "x-tenant-id: acme" \
  -H "x-tenant-key: <TENANT_KEY_FROM_CREATE_RESPONSE>"
```

Create a user:

```bash
curl -X POST http://localhost:3000/v1/users \
  -H "content-type: application/json" \
  -H "x-tenant-id: acme" \
  -H "x-tenant-key: <TENANT_KEY_FROM_CREATE_RESPONSE>" \
  -d '{"email":"alice@acme.com","displayName":"Alice"}'
```

## API

- `GET /health`
- `GET /docs` (Swagger UI)
- `GET /metrics` (Prometheus)

---

This repository is built step-by-step to add:

- Schema-per-tenant multi-tenancy with TypeORM
- JWT auth (access/refresh), Redis sessions, RBAC
- RabbitMQ async tasks
- Docker compose + tests + CI
