# ADR 0001: Modular monolith

Status: Accepted

Use one Laravel deployment with explicit domain modules. This preserves transactional consistency and a small operational footprint while keeping future extraction seams visible. Microservices are not justified for the MVP.
