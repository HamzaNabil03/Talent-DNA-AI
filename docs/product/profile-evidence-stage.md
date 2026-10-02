# Evidence analysis and Talent DNA stage

This stage stores student input, reads supported private files only after an explicit user action, requests conservative structured skill suggestions from Gemini, and creates an immutable Talent DNA version only after the user selects suggestions.

## Data and lifecycle

- Every user has one profile. `input_completed_at` means only that required input exists.
- Direction and the student's view are self-described context, never skill evidence.
- Team projects require the student's role.
- A project with linked evidence cannot be deleted. Evidence must be reassigned or explicitly deleted first.
- Uploaded files are private. API responses never expose the internal disk or path, and downloads require authentication, verified email, current consent, and ownership.
- A saved external link is never fetched. It remains `not_read` and `not_analyzed`.
- A file marked `type_and_size_validated` passed only configured extension/MIME/size validation. This is not a malware scan, content read, or analysis.

## Temporary development limits

These are conservative, configurable development defaults—not approved launch policy:

- 20 evidence items per user (`EVIDENCE_MAX_ITEMS_PER_USER`).
- 10 MiB per uploaded file (`EVIDENCE_MAX_FILE_SIZE_KB`).
- PDF, JPEG, PNG, plain text, DOCX, HTML, CSS, and JavaScript. Archives and executable formats are not accepted.
- One run reads at most 5 files, 100,000 text characters per file, and 30 PDF pages. Exceeding a boundary is reported as a partial result rather than hidden.

Product approval is required before launch for formats, counts, retention, deletion, scanning, and size limits.

## Storage

Local development uses the private `evidence` disk rooted under `storage/app/private/evidence`; no `storage:link` is involved. Set `EVIDENCE_DISK` to a configured private object-storage disk later. The bucket/container must remain private, and access must continue through the authorized API rather than permanent public URLs.

## Gemini and review boundary

The backend calls the official Gemini Interactions API with `gemini-3.8-flash` and a JSON schema. `GEMINI_API_KEY` is server-only; no browser/Vite variable may contain it. Missing configuration produces a persisted `not_configured` state and never substitutes fake output. The test environment alone binds a deterministic fake provider.

The processing contract is:

1. HTML/CSS/JS/TXT are decoded as untrusted UTF-8 text and line numbered; they are never rendered or executed. DOCX paragraphs and PDF pages receive stable references. Images and scanned PDFs use visual observations rather than invented quotes.
2. The server validates that every evidence id and range exists and every text quote occurs in the stored extraction. Unsupported provider output is dropped.
3. HTML, CSS, and JavaScript are the initial assessment scope. Supported additional skills are explicitly marked outside the current scope.
4. Analysis is queued, fingerprinted, idempotent, status/progress persisted, and retried only for transient 408/429/5xx or connection failures. File/auth/schema failures are not repeatedly retried.
5. A user must select at least one suggestion. Confirmation is transactional and idempotent, rejects changed/deleted evidence, and creates a new immutable version. Skills remain `not_assessed`; there are no scores, readiness, verification, ownership, hiring, or proficiency verdicts.
6. Deleting evidence removes unconfirmed runs and extracted text. Confirmed snapshot references retain only non-sensitive provenance marked as source-deleted; quotes and observations are scrubbed.

## Privacy and production readiness

Gemini processing sends selected private evidence to Google only after the explicit start action. Google's current abuse-monitoring documentation states that prompts, context, and outputs may be retained for 55 days. This retention must be reflected in the approved privacy notice/consent before enabling real-user production analysis. Google AI Studio logging/data-sharing opt-in must remain disabled for private evidence.

The application uses inline requests within its lower 10 MiB upload boundary, so it does not create Gemini Files API objects. Production requires a persistent private store that both the web and worker processes can access. A Railway volume mounted to only one service is insufficient for a separate worker; use a private object-storage disk or a verified shared-storage topology. Without it, file analysis is not production-ready.

Run both the web process and a durable queue worker. Required server variables include `AI_PROVIDER=gemini`, server-only `GEMINI_API_KEY`, `GEMINI_MODEL=gemini-3.8-flash`, a database-backed queue, and a private shared `EVIDENCE_DISK` configuration.
