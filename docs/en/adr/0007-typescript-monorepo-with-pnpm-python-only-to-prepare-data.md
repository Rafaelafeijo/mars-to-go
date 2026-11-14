# ADR-0007 — TypeScript monorepo with pnpm; Python only to prepare data

> Portuguese version: [`docs/pt-BR/adr/0007-monorepo-typescript-com-pnpm-python-so-para-preparar-dados.md`](../../pt-BR/adr/0007-monorepo-typescript-com-pnpm-python-so-para-preparar-dados.md).

Status: accepted, 2026-11-14.

**Context.** Front end, API and simulation share types and constants.
**Decision.** pnpm workspaces with apps/web, apps/api, packages/sim, packages/content, packages/ui. Python only in tools/data.
**Consequences.** One language in production.
