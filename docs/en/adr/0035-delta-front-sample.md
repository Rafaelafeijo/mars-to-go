# ADR-0035: The rover chooses its site; mission 2 needs the sample from the delta front

- Status: accepted (design review E, option A, 2026-11-15)
- Portuguese: [`../../pt-BR/adr/0035-amostra-da-frente-do-delta.md`](../../pt-BR/adr/0035-amostra-da-frente-do-delta.md)

## Context
One sample from anywhere was too easy and gave the rover no real decision.

## Decision
- When the rover is planned, the child chooses its site.
  - **Rochette** is near: `EXPEDITION_AIR` = 2 air and `EXPEDITION_EXPOSURE` = 1 point.
  - **The delta front** is far, 2.3 km (NASA/JPL PIA24485): `EXPEDITION_FAR_AIR` = 3 air and `EXPEDITION_FAR_EXPOSURE` = 2 points.
  - The numbers are game values.
- `MissionDef.sampleSite`: mission 2 counts only the sample from `delta-front`. Mission 1 counts any sample.
- Why the delta: NASA/JPL ("Perseverance Arrives at Delta") explains that NASA chose Jezero for its delta, "clear evidence that a large lake once filled the crater", and that the fine rocks at the delta's base are the mission's best bet for finding preserved signs of ancient life.
- With no site given, the rover goes to the first near site it has not visited yet. Mission 1 never reaches the far site by default.

## Consequences
- In mission 2, the delta sample uses 2 of the 2 dose points. From then on, every storm must be fully shielded.
- The winning test plan sends the rover to the delta on sol 2.
