# Fastify Multi-Tenant SaaS Boilerplate (Backend)

Multi-tenant SaaS backend boilerplate using **Fastify (Node.js / JavaScript)** with **schema-per-tenant** isolation in PostgreSQL.

Key features:
- **Schema-per-tenant** multi-tenancy (PostgreSQL)
- **JWT auth** (access/refresh) + **Redis sessions**
- **RBAC** authorization helpers
- **Swagger** docs, **Prometheus** metrics
- **RabbitMQ** integration scaffold
- Clean layering: routes → controllers → mediators → services → repositories → entities

## Requirements

- Node.js >= 18
- Docker + Docker Compose (for infrastructure: Postgres/Redis/RabbitMQ/Adminer)

## Quick start (local API + Docker infrastructure)

1. Copy env file

```bash
cp .env.example .env
```

2. Start infrastructure (Postgres, Redis, RabbitMQ, Adminer)

```bash
docker compose up -d
```

3. Install dependencies

```bash
npm install
```

4. Run dev server

```bash
npm run dev

API will start on:

- http://localhost:7000
- Swagger UI (if enabled): http://localhost:7000/docs
- Metrics (if enabled): http://localhost:7000/metrics
```

## Docker services

`docker compose up` starts supporting services:

```bash
docker compose up -d
```

RabbitMQ Management UI:

- http://localhost:15672
- user: `guest`
- pass: `guest`

Adminer (DB UI):

- http://localhost:8080

## Multi-tenancy (schema-per-tenant)

Most APIs in this project are **tenant-scoped**, meaning you must provide tenant context on every request.

### 1) Create a tenant (system route)

This creates a row in `public.tenants`, creates the tenant schema (e.g. `tenant_acme`), and runs tenant migrations.

The system route is protected by a **system API key**.

```bash
curl -X POST http://localhost:7000/system/tenants \
  -H "content-type: application/json" \
  -H "x-api-key: <SYSTEM_API_KEY>" \
  -d '{"tenantId":"acme","name":"Acme Inc"}'
```

Response contains `tenantKey` (store it; it is returned only once):

```json
{
  "tenant": {
    "id": "acme",
    "name": "Acme Inc",
    "schemaName": "tenant_acme",
    "createdAt": "..."
  },
  "tenantKey": "..."
}
```

### 2) Call tenant-scoped APIs

Tenant is resolved via headers:

- `x-tenant-id`
- `x-tenant-key`

```bash
curl http://localhost:7000/v1/users \
  -H "x-tenant-id: acme" \
  -H "x-tenant-key: <TENANT_KEY_FROM_CREATE_RESPONSE>"
```

Create a user:

```bash
curl -X POST http://localhost:7000/v1/users \
  -H "content-type: application/json" \
  -H "x-tenant-id: acme" \
  -H "x-tenant-key: <TENANT_KEY_FROM_CREATE_RESPONSE>" \
  -d '{"email":"alice@acme.com","displayName":"Alice"}'
```

## Authentication flow (recommended order)

1. Create a tenant: `POST /system/tenants` (requires `x-api-key`)
2. Register user inside that tenant: `POST /v1/auth/register` (requires `x-tenant-id` + `x-tenant-key`)
3. Login: `POST /v1/auth/login` (requires tenant headers)
4. Use the returned access token to call protected routes (also keep tenant headers)

Protected routes include:

- `GET /v1/users` (requires `fastify.authenticate`)
- `POST /v1/users` (requires `fastify.authenticate` + RBAC permission)

## API

- `GET /health`
- `GET /docs` (Swagger UI)
- `GET /metrics` (Prometheus)

## Environment variables

The application reads values from your local `.env` file.

Important variables:

- `PORT` (default: `7000`)
- `SYSTEM_API_KEY` (required for `POST /system/tenants`)
- `TENANT_HEADER_ID` (default: `x-tenant-id`)
- `TENANT_HEADER_KEY` (default: `x-tenant-key`)
- `TENANT_BASE_DOMAIN` (optional; enables subdomain-based tenancy)

Note: `.env.example` is only a template; the app does **not** load it automatically.

## Troubleshooting

### Port already in use (EADDRINUSE)

If you see `listen EADDRINUSE 0.0.0.0:7000`, find and stop the process using the port:

```powershell
netstat -ano | findstr :7000
taskkill /PID <PID> /T /F
```

### "Tenant not resolved"

Most endpoints require tenant context. Provide both headers:

- `x-tenant-id`
- `x-tenant-key`

You get the `tenantKey` only when you create the tenant (`POST /system/tenants`).

---

This repository includes:

- Schema-per-tenant multi-tenancy with TypeORM
- JWT auth (access/refresh), Redis sessions, RBAC
- RabbitMQ async tasks
- Docker compose + tests + CI
