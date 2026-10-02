# Railway configuration

Create a public web service and a private worker service from the same repository, commit SHA, and Dockerfile. Select the corresponding TOML/start command for each. Keep the existing Railway MySQL service. Configure a private S3-compatible object store that both services can reach; a volume attached to only one Railway service is not shared storage.

Required variable names (values belong in Railway secrets):

`APP_NAME`, `APP_ENV`, `APP_KEY`, `APP_DEBUG`, `APP_URL`, `LOG_CHANNEL`, `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, `SESSION_DRIVER`, `SESSION_DOMAIN`, `SANCTUM_STATEFUL_DOMAINS`, `QUEUE_CONNECTION`, `CACHE_STORE`, `FILESYSTEM_DISK`, `EVIDENCE_DISK`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`, `AWS_BUCKET`, `AWS_ENDPOINT`, `AWS_URL`, `AWS_USE_PATH_STYLE_ENDPOINT`, `MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME`, `AI_PROVIDER`, `GEMINI_API_KEY`, `GEMINI_MODEL`, and `GEMINI_TIMEOUT_SECONDS`.

Use `QUEUE_CONNECTION=database`, `AI_PROVIDER=gemini`, `GEMINI_MODEL=gemini-3.8-flash`, and `EVIDENCE_DISK=s3` for the current production topology. Add only the variables needed by each service; never copy a local `.env` wholesale. The Gemini key is server-only and is required by the worker, not the browser build. Keep Google project logging/data sharing disabled for private evidence and use a billing-enabled Paid Services project before processing real-user evidence.
