# Data principles

1. MySQL constraints and transactions enforce ownership, version references, idempotency, and state transitions.
2. Published assessment versions and Talent DNA snapshots are immutable. Corrections create new versions.
3. Potential-skill confirmation atomically promotes selected taxonomy IDs and creates a snapshot once per idempotency key.
4. The server creates immutable assessment deadlines and auto-submits expired attempts. MCQs are graded deterministically; any essay holds the result in `PENDING_REVIEW` until manual review.
5. Private is the default. Evidence is accessed with short-lived signed URLs and public cards use an explicit field allowlist.
6. Logs and audit events exclude raw CVs, private links, response text, access tokens, and provider payloads.
