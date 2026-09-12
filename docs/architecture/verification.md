# Foundation verification

Verified locally on 2026-09-12:

- The compiled React bootstrap is served by Laravel from the same origin. With the PHP development server started from `apps/api/public`, `GET /` returned HTTP 200 and an Arabic RTL document.
- `GET /api/v1/health` returned HTTP 200 with the documented JSON contract.
- Frontend tests, backend tests, lint, strict TypeScript, production build, OpenAPI validation/generation, Pint, Larastan, Composer validation, formatting, and diff whitespace checks are part of the local release gate.

## MySQL verification status

A clean local MySQL migration could not be executed because this workstation has neither Docker nor a MySQL server/client. The available XAMPP database is MariaDB and was deliberately not counted as a MySQL substitute. A temporary SQLite migration was useful only as a framework smoke test and is not evidence of MySQL compatibility.

The GitHub Actions backend job uses the official `mysql:8.4` service image, waits for its health check, configures Laravel with `DB_CONNECTION=mysql`, and runs `php artisan migrate:fresh --force` before Pint, Larastan, and PHPUnit. That CI job is the authoritative clean-MySQL gate.
