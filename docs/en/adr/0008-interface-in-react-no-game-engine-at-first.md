# ADR-0008 — Interface in React; no game engine at first

> Portuguese version: [`docs/pt-BR/adr/0008-interface-em-react-sem-motor-de-jogo-no-inicio.md`](../../pt-BR/adr/0008-interface-em-react-sem-motor-de-jogo-no-inicio.md).

Status: accepted, 2026-11-14.

**Context.** The game is a turn-based decision game, needs accessibility and languages, and the deadline is one weekend.
**Decision.** React + Vite, with animation in CSS and SVG. An engine like Phaser only comes in for the opening scene, if there is slack, recorded in a new ADR.
**Consequences.** Fewer pieces to assemble and debug. Less visual spectacle.
