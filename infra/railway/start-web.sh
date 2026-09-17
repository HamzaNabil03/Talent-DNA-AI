#!/usr/bin/env sh
set -eu

php artisan config:cache
php artisan migrate --force

exec apache2-foreground
