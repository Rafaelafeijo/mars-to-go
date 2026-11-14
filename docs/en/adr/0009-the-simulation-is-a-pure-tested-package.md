# ADR-0009 — The simulation is a pure, tested package

> Portuguese version: [`docs/pt-BR/adr/0009-a-simulacao-e-um-pacote-puro-e-testado.md`](../../pt-BR/adr/0009-a-simulacao-e-um-pacote-puro-e-testado.md).

Status: accepted, 2026-11-14.

**Context.** Validity depends on correct, auditable calculations.
**Decision.** packages/sim imports nothing from the interface. Every calculation shown on screen has a test. Test before screen.
**Consequences.** The interface only displays what the simulation calculates.
