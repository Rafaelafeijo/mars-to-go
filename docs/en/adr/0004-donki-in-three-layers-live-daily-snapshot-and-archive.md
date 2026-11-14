# ADR-0004 — DONKI in three layers: live, daily snapshot and archive

> Portuguese version: [`docs/pt-BR/adr/0004-donki-em-tres-camadas-ao-vivo-retrato-diario-e-arquivo.md`](../../pt-BR/adr/0004-donki-em-tres-camadas-ao-vivo-retrato-diario-e-arquivo.md).

Status: accepted, 2026-11-14.

**Context.** The challenge highlights connecting the shielding decision to real space weather. Direct calls from the browser can fail and expose a key.
**Decision.** Three layers, from the freshest to the safest: the project's API queries DONKI and caches it; a scheduled task writes a daily snapshot into the site; a curated catalog of real events is built in. The game uses the freshest one that responds and shows which one it is. The conversion of event class into in-game risk is a table declared as a simplification.
**Consequences.** The game works offline and with DONKI down. The back end gets a real function.
