#!/usr/bin/env sh
set -eu

php artisan config:cache
exec php artisan queue:work --sleep=2 --tries=3 --timeout=180 --max-time=3600
