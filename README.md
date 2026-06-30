# Simple Invoice

## Project overview

This repository contains a simple invoice management application with a React frontend and a NestJS backend.

- `backend/` contains a NestJS API using TypeORM and PostgreSQL.
- `frontend/` contains a Vite + React application.
- `docker-compose.yaml` defines three services: `backend`, `frontend`, and `postgres`.

The backend exposes REST endpoints and JWT-based authentication. The frontend consumes the backend API and displays invoices in a web UI.

## Architecture

- Backend: NestJS, TypeORM, PostgreSQL, JWT auth, Swagger API documentation.
- Frontend: Vite, React, Axios, Zustand store, Tailwind-style UI components.
- Database: PostgreSQL container configured with `simple_invoice` database.
- Docker: frontend served by Nginx, backend served by Node.js, database served by Postgres.

## Run with Docker

From the repository root:

```bash
cd /fullstack-simple-invoice
docker compose up --build
```

- Frontend: `http://localhost`
- Backend: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

Stop and remove containers:

```bash
docker compose down
```

## Default reviewer login credentials

A mocked reviewer account is available for testing:

- Email: `reviewer@101digital.io`
- Password: `Reviewer@101`

## Database seed script

Run the seed script from the backend folder:

```bash
cd /backend
yarn seed
```

This script creates a default reviewer user and inserts 30 seeded invoices.

If using Docker, ensure environment variables are available to the backend service, or run the seed script against the same database connection settings.

## Assumptions and design decisions

- The backend uses environment variables from `backend/.env` for database configuration.
- Docker Compose connects the backend to the database using service name `postgres`.
- Frontend API calls default to `http://localhost:3000/api` unless overridden by `VITE_API_BASE_URL`.
- The frontend is served by Nginx in Docker and built using Vite.
- A single seeded reviewer account is used for reviewer access rather than a full multi-user role system.

## Known limitations

- No user registration flow is included; only the seeded reviewer account is available.
- Refresh token support is not implemented; auth uses a single JWT access token.
- The seed script is manual and does not run automatically during `docker compose up`.
- Production readiness is limited: no HTTPS, no advanced environment validation, and no scaling configuration.
- Some frontend pages and features may be incomplete or simplified for demo purposes.

## Notes

- Backend database connection defaults:
  - Host: `postgres` inside Docker, `localhost` on host machine.
  - Port: `5432`
  - User: `postgres`
  - Password: `password`
  - Database: `simple_invoice`
