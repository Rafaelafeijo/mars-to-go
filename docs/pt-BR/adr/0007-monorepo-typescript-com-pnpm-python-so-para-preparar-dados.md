# ADR-0007 — Monorepo TypeScript com pnpm; Python só para preparar dados

Status: aceita, 2026-11-14.

**Contexto.** Front, API e simulação compartilham tipos e constantes.
**Decisão.** pnpm workspaces com apps/web, apps/api, packages/sim, packages/content, packages/ui. Python apenas em tools/data.
**Consequências.** Uma linguagem em produção.
