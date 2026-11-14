# ADR-0017 — Save without an account: device and mission code

> Portuguese version: [`docs/pt-BR/adr/0017-salvar-sem-conta-aparelho-e-codigo-da-missao.md`](../../pt-BR/adr/0017-salvar-sem-conta-aparelho-e-codigo-da-missao.md).

Status: accepted, 2026-11-14.

**Context.** The challenge values playing without an account; the child needs to be able to stop and come back.
**Decision.** The state is saved on the device every sol, with a version. A short code, with no personal data, lets the child continue on another device. At the end of each mission the game asks whether the child wants to play again with another plan.
**Consequences.** No account server. The code has to fit on the screen and be easy to type.
