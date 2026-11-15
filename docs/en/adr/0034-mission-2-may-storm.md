# ADR-0034: Mission 2 "The May storm" — false alarms, fast CMEs and a crisis with choices

- Status: accepted (design reviews C and D, 2026-11-15)
- Portuguese: [`../../pt-BR/adr/0034-missao-2-tempestade-de-maio.md`](../../pt-BR/adr/0034-missao-2-tempestade-de-maio.md)

## Context
The first version of mission 2 was too easy: air and food alone almost always won. The Antenna gave nothing back. The crisis offered one fixed answer, and it appeared even when the Shield already covered the risk.

## Decision
1. **A real event every sol** (DONKI records checked on 2026-11-15):
   - **Sol 1:** X8.7 flare. Mars arrival unknown.
   - **Sols 2 and 4:** false alarms. NASA's WSA-ENLIL model sent these two CMEs to the spacecraft Psyche, not to Mars (CME/30883, CME/30948), so `reachesMars: false`.
   - **Sols 3, 5 and 6:** fast CMEs forecast at Mars.
   - **Sol 7:** the May 20, 2024 storm measured by Curiosity's RAD.
2. **Fast CME** (game rule): DONKI's most accurate speed is at least 1,000 km/s and there is a Mars arrival. Every fast event that reaches Mars brings the 10-second crisis.
3. **The crisis shows the risk against the Shield.**
   - If the Shield already covers the risk, the crisis says so and only asks to continue.
   - If not, the child moves cells into the Shield from the machine they choose: Air machine, Greenhouse or Antenna. Each source shows its cost. The rover can be called back.
   - When the time runs out, the cells already moved stay. Assisted mode has no timer.
4. **Earth's answer** is told as "tomorrow" at night and as "today" the next morning.
5. **Mission 2 has its own facts**, each with a real NASA photo. No fact or photo repeats across missions.

## Consequences
- Shielding every sol leaves too little power, so asking Earth about tomorrow pays off.
- The winning test plan asks Earth on sols 1 and 3.
- The fixed `CRISIS_SHIELD_SWAP_CELLS` rule stays only in the older list screens.
