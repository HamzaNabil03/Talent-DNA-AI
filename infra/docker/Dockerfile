FROM node:22-alpine AS frontend

WORKDIR /workspace

COPY package.json package-lock.json* ./
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/config/package.json packages/config/package.json

RUN npm ci

COPY apps/web apps/web
COPY packages packages

RUN npm run build


FROM composer:2 AS vendor

WORKDIR /app

COPY apps/api/composer.json apps/api/composer.lock ./

RUN composer install \
    --no-dev \
    --prefer-dist \
    --no-interaction \
    --no-progress \
    --optimize-autoloader \
    --no-scripts

COPY apps/api ./

RUN composer dump-autoload \
    --no-dev \
    --no-interaction \
    --classmap-authoritative


FROM php:8.3-cli

RUN apt-get update \
    && apt-get install -y --no-install-recommends libzip-dev unzip \
    && docker-php-ext-install pdo_mysql zip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY apps/api ./
COPY --from=vendor /app/vendor ./vendor
COPY --from=vendor /app/bootstrap/cache ./bootstrap/cache
COPY --from=frontend /workspace/apps/web/dist ./public/app

COPY infra/railway/start-web.sh /usr/local/bin/start-web
COPY infra/railway/start-worker.sh /usr/local/bin/start-worker

RUN chmod +x /usr/local/bin/start-web /usr/local/bin/start-worker \
    && chown -R www-data:www-data storage bootstrap/cache

CMD ["/usr/local/bin/start-web"]
