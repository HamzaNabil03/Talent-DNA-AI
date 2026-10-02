# Talent DNA AI

Production-oriented modular-monolith foundation for an Arabic-first talent product. This phase contains architecture, contracts, infrastructure, and a neutral connectivity bootstrap only; product pages are intentionally deferred.

## Prerequisites

- Node.js 22+
- PHP 8.2+ and Composer 2
- MySQL 8 (or Docker for the provided MySQL and Mailpit services)

## Setup

```bash
npm install
composer install --working-dir=apps/api
cp apps/api/.env.example apps/api/.env
php apps/api/artisan key:generate
docker compose up -d
npm run migrate
```

## Commands

| Command                      | Purpose                                           |
| ---------------------------- | ------------------------------------------------- |
| `npm run dev`                | Run Vite, Laravel, and the database queue worker  |
| `npm run build`              | Build the production React SPA                    |
| `npm test`                   | Run frontend and backend tests                    |
| `npm run lint`               | Run frontend lint, formatting, Pint, and Larastan |
| `npm run typecheck`          | Run strict TypeScript checks                      |
| `npm run contracts:validate` | Validate the OpenAPI document                     |
| `npm run contracts:generate` | Regenerate the TypeScript API contract            |
| `npm run contracts:check`    | Fail when the generated client is stale           |
| `npm run migrate`            | Run Laravel migrations                            |

Vite proxies `/api` to Laravel on port 8000 during local development. The production image builds the SPA into Laravel's `public/app` directory and serves browser routes and `/api/v1` from one origin.

## Identity administration

Public registration always creates a student. To create or reconcile the internal admin account, set `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in the runtime environment and run this seeder explicitly:

```bash
php apps/api/artisan db:seed --class=AdminUserSeeder
```

No default admin credentials are stored in Git. Email verification and password-reset notifications use Laravel SMTP configuration; `.env.example` contains the Brevo-compatible variable names without credentials.
