# ADR-0011 — GitHub Pages as the primary address; Railway for the API and the mirror

> Portuguese version: [`docs/pt-BR/adr/0011-github-pages-como-endereco-principal-railway-para-a-api-e-o.md`](../../pt-BR/adr/0011-github-pages-como-endereco-principal-railway-para-a-api-e-o.md).

Status: accepted, 2026-11-14.

**Context.** The submission requires public links with no sign-up.
**Decision.** The game, which is a static site, is published on GitHub Pages as the primary address. Railway hosts the live API and a mirror of the game, with commands filtered by package and watch paths per service. The game works fully without the API.
**Consequences.** Two publishing targets to maintain. Lower risk of the judges finding the address blocked by a network filter.
