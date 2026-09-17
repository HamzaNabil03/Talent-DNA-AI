#!/usr/bin/env sh
set -eu

a2dismod mpm_event 2>/dev/null || true
a2dismod mpm_worker 2>/dev/null || true

rm -f /etc/apache2/mods-enabled/mpm_event.* \
      /etc/apache2/mods-enabled/mpm_worker.* || true

a2enmod mpm_prefork >/dev/null 2>&1 || true

php artisan config:cache
php artisan route:cache
php artisan migrate --force

exec apache2-foreground
