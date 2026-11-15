# ADR-0033: Choices with consequences (dose limit, radiation damage, rock samples, three results)

- Status: accepted (design review B, 2026-11-15)
- Portuguese: [`../../pt-BR/adr/0033-escolhas-com-consequencia.md`](../../pt-BR/adr/0033-escolhas-com-consequencia.md)

## Context

The second design review found that putting cells only in air and food always won. The causes:

- **Radiation had no consequence.** The sol-5 CME, unshielded, left exposure at "low" (the threshold was 2), and exposure never ended a mission.
- **Rover and Antenna gave nothing back.** The rover's discovery was only text. Earth's answer was never shown in the 3D world, and it would not have mattered anyway, since the shield did not matter.

The challenge asks for choices with real trade-offs. In the game there was no dilemma.

## Decision

1. **Dose limit.**
   - `DOSE_LIMIT = 2` points.
   - If exposure goes above the limit at the end of a night, the mission ends with an early return, cause `radiation` ("the mission doctor brings the crew home").
   - The next mission stays locked, since the career opens it only when everyone is home.
   - Exposure words: low 0–1, medium 2, high above 2.
   - Real parallel: the NASA career limit of 600 mSv (NASA-STD-3001 Vol. 1, §4.8.2). Game points are not mSv.
2. **Radiation damage.**
   - The points that get past the shield also cost cells the next sol: `RADIATION_DAMAGE_CELLS_PER_POINT = 1`, capped at `RADIATION_DAMAGE_MAX_CELLS = 2`.
   - New state field `lostCells` and night step `damage`.
   - `freeCells(dust, lostCells)`. The projection includes the damage.
   - Real basis: NASA SVS 31248 says solar energetic particles "damage critical electronics, degrade solar arrays".
3. **Rock samples.**
   - Each rover trip brings 1 sample.
   - A successful mission needs `SAMPLES_GOAL = 1`. This is a scenario value.
   - Real basis: Perseverance's sample tubes (NASA Mars Rock Samples page).
4. **Three results.**
   - `missionResult` returns `success`, `with_failures` or `early_return`.
   - `missionObjectives` checks three things: home, sample, dose.
   - The end screen shows the three objectives and what failed.
   - The old verdicts (`on_edge`, `with_margin`, `reference`) stay for the career code.
5. **Antenna.**
   - Earth's answer is shown in the night report and in the next sol's opening.
   - An event with `reachesMars: 'unknown'` is told as "there is no measurement". It is no longer told as "it did not reach Mars", which was a false claim.

## Consequences

- Worked game B ("Scientist" in SIM_MODEL §8) now ends on sol 2 for radiation: a rover trip followed by no shield on a risk-2 night. Games A, C and the bonus game keep their numbers.
- In mission 1, collecting a sample means shielding the sol-5 CME at least partly, or the dose goes over the limit. Each choice now costs something that shows.
- Three data cards are added or rewritten: `exposure`, `radiationDamage` and `samples`.
