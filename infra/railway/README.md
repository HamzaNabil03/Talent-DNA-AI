# Railway configuration

Create a public web service and a private worker service from the same repository and Dockerfile. Select the corresponding TOML/start command for each. Add Railway MySQL and configure the object-storage endpoint separately.

Required variable names (values belong in Railway secrets):

`APP_NAME`, `APP_ENV`, `APP_KEY`, `APP_DEBUG`, `APP_URL`, `LOG_CHANNEL`, `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, `SESSION_DRIVER`, `SESSION_DOMAIN`, `SANCTUM_STATEFUL_DOMAINS`, `QUEUE_CONNECTION`, `CACHE_STORE`, `FILESYSTEM_DISK`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`, `AWS_BUCKET`, `AWS_ENDPOINT`, `AWS_URL`, `AWS_USE_PATH_STYLE_ENDPOINT`, `MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME`, `OPENAI_API_KEY`, and `OPENAI_MODEL`.

No deployment or real secret is part of this phase.
