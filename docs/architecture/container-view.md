# Container view

| Container       | Responsibility                                                | Interface                          |
| --------------- | ------------------------------------------------------------- | ---------------------------------- |
| React SPA       | RTL presentation, routing, forms, server-state cache          | HTTPS, generated TypeScript client |
| Laravel web/API | Policies, use cases, validation, REST resources, SPA delivery | `/api/v1`, same origin             |
| Laravel worker  | Retried AI and background processing                          | Database queue                     |
| MySQL           | Transactional system of record and queue                      | Private connection                 |
| Object storage  | Private evidence blobs and signed reads                       | S3-compatible API                  |
| OpenAI          | Schema-constrained extraction/explanation                     | `AiProvider` adapter only          |

Railway runs the public web process and queue worker from the same image. The SPA build is copied into Laravel `public/app`; browser history fallback excludes `/api`.
