# ADR-0016 — Validate before designing screens

> Portuguese version: [`docs/pt-BR/adr/0016-validar-antes-de-desenhar-telas.md`](../../pt-BR/adr/0016-validar-antes-de-desenhar-telas.md).

Status: accepted, 2026-11-14.

**Context.** Redoing screens because of a model error is expensive over a weekend.
**Decision.** The first phase produces the architecture with diagrams, the data map and the simulation model, with a 90-minute cap, and only ends with Rafaela's approval. Each following phase also ends with validation, a commit and a tag in the repository.
**Consequences.** The first screens appear later, on an already validated foundation.
