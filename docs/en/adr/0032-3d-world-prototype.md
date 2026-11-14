# ADR-0032 — Prototype: a low-poly 3D world in third person

> Portuguese version: [`docs/pt-BR/adr/0032-prototipo-mundo-3d.md`](../../pt-BR/adr/0032-prototipo-mundo-3d.md)

Status: prototype under evaluation, 2026-11-14. The Phase 3B single screen stays as the fallback plan (`?ui=one`), and the Phase 3 list (`?ui=list`).

**Context.** The team wants the game to feel like an exploration game: a third-person character in a low-poly world, with panels floating over the scene (mission on the left, weather on the right, item bar at the bottom). Theme: Mars, Jezero Crater. The reference gives the structure only; names, colors, fonts and drawings are ours.

**Decision (prototype, 2 hours).**
- three.js with react-three-fiber and drei, loaded lazily so the panels work first; no shadows; device pixel ratio capped at 1.5.
- Low-poly illustrated terrain inspired by Jezero (gentle relief, a delta fan and a butte far away), Mars-colored sky with a small Sun — declared on screen as illustration. Real photos stay in the Laboratory and the sol report.
- Kenney CC0 3D models (Space Kit, Space Station Kit) for the base, the five touchable machines (air machine, greenhouse, shield, rover, antenna) and the astronaut. Recorded in ASSETS.
- Third-person astronaut: walks to a tapped point (phone) or with WASD/arrows (computer); the camera follows behind. Near a machine, tapping it adds a cell; the effect rises from the machine.
- Panels over the scene: top, the trail of 7 sols with the rocket at the end and air/food bars filled by the projection; left, Mission Control with the sol's challenge and objectives; right top, the forecast; right bottom, cells in hand and "Pass the night"; bottom, "Jezero Crater · Sol 1 of 7" and the machine bar.
- Everything done by walking can be done on the panels, by keyboard and screen reader. No separate list mode in the menu.
- No emoji anywhere on this screen: our own SVG icon set, one color per resource (air blue, food green, energy amber, radiation lilac).
- Without WebGL the scene is a still picture and the panels keep working.

**Unchanged.** The simulation, the projection and their tests; English by default, Portuguese optional.

**Consequences.** Heavier page (three.js) than the 2D screens; measured and reported to the team before approval.
