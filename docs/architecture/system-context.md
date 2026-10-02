# System context

Talent DNA AI supports the loop **Discover → Prove → Match → Grow**. An Arabic-first React SPA communicates with a versioned Laravel REST API. MySQL is the system of record, private S3-compatible storage holds evidence, and a database-backed worker runs AI and long-running jobs. Gemini is the external evidence-extraction provider; it suggests traceable skills but is never a scoring authority.

Users own profiles, evidence, confirmations, assessment attempts, Talent DNA snapshots, and explicit public-card publications. The MVP exposes a deliberately narrow assessment-admin boundary and no employer or institutional portal.
