# ADR 0004: Same-origin Sanctum deployment

Status: Accepted

Laravel serves the compiled SPA and `/api/v1` from one public Railway service. Sanctum uses first-party session cookies with CSRF protection. This avoids browser token storage and cross-origin cookie fragility. A separate worker uses the identical backend image.
