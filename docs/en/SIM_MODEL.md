# Simulation model — Mars to Go

> Status: **approved 2026-11-14 (Phase 0)**, with the adjustments recorded in §11–§15. Every constant below moves to `packages/sim/src/science.ts` with its full data card, and the worked games become the first tests.
> Portuguese version: [`docs/pt-BR/SIM_MODEL.md`](../pt-BR/SIM_MODEL.md).

## 1. Shape of the game

- A mission is **7 sols** at a base in Jezero Crater. One sol is one round.
- The player manages **three resources**: power (cells, spent the same sol), air and food (reserves that carry over).
- Everything else (shield, expedition, asking Earth, crises) is an **action** that spends power and moves air, food or crew exposure.
- Crew exposure is **not a fourth meter**: it is a word (low, medium, high) shown in the sol log and the final verdict, never a number of dose (ADR-0005).

## 2. Constants

Every value here is a game rule, not a measurement, unless the label says *measured*. The *Science link* column says which real fact the rule stands for; the source for each fact is in `DATA_MAP.md`.

| ID | Value | Unit | Label | Science link |
| --- | --- | --- | --- | --- |
| `MISSION_SOLS` | 7 | sol | scenario | A sol is a Mars day (measured length in DATA_MAP) |
| `CELLS_PER_SOL` | 10 | cell | scenario | Mars gets less sunlight than Earth |
| `CELLS_DUST_SOL` | 6 | cell | scenario | Dust storms cut solar power (2018 storm) |
| `HEATING_CELLS` | 3 | cell, fixed | scenario | Mars is very cold; the habitat must be heated |
| `AIR_START` | 10 | air unit | scenario | Reserve brought from Earth |
| `AIR_USE_PER_SOL` | 5 | air unit / sol | scenario | Crew of 4 breathes every sol (measured rate in DATA_MAP) |
| `AIR_PER_LIFE_SUPPORT_CELL` | 1 | air unit / cell | scenario | Oxygen made from Mars CO₂ costs power (MOXIE) |
| `FOOD_START` | 6 | food unit | scenario | Food brought from Earth |
| `FOOD_USE_PER_SOL` | 2 | food unit / sol | scenario | Crew eats every sol |
| `FOOD_PER_GREENHOUSE_CELL` | 2 | food unit / cell | scenario | A closed greenhouse turns light into food |
| `GREENHOUSE_DELAY_SOLS` | 2 | sol | simplification | Plants take time to grow (real crops take weeks; CSA, Veggie) |
| `SHIELD_BLOCK_PER_CELL` | 1 | risk point / cell | simplification | Shielding reduces radiation reaching the crew |
| `EXPEDITION_CELLS` | 2 | cell | scenario | Rover and suits need power |
| `EXPEDITION_AIR` | 2 | air unit | scenario | Suits use stored oxygen outside |
| `EXPEDITION_EXPOSURE` | 1 | exposure point | simplification | Outside, the habitat no longer protects the crew |
| `MAX_EXPEDITIONS_PER_SOL` | 1 | — | scenario | — |
| `ASK_EARTH_CELLS` | 1 | cell | scenario | The big antenna needs power |
| `ASK_EARTH_ANSWER_AT` | tonight's log | — | simplification | The real one-way delay is ~4–24 min (DATA_MAP M9); the answer arrives after the plan is locked and shows in tonight's log with the signal travel time |
| `RADIO_ROUND_TRIP_MIN_MINUTES` | 8 | min | measured (derived) | 2 × ~4 min one-way at closest approach (DATA_MAP M9); shown on the disabled button in a crisis |
| `EXPOSURE_LOW_MAX` | 1 | exposure point | simplification | Three-level scale, not a dose (was 2; changed with the dose limit, §17) |
| `EXPOSURE_MEDIUM_MAX` | 2 | exposure point | simplification | > 2 is "high" and above the dose limit (was 5; §17) |
| `CRISIS_SECONDS` | 10 | s | scenario | Commander level |
| `CRISIS_SECONDS_CADET` | 30 | s | scenario | Cadet level (the assisted mode): more time instead of no clock (design review G) |

Event-to-risk table (simplification, see §5).

## 3. State

```ts
type MissionState = {
  version: 1;
  seed: number;            // picks events from the curated catalog
  sol: number;             // 1..7
  air: number;             // air units
  food: number;            // food units
  exposure: number;        // exposure points (shown only as low/medium/high)
  pendingHarvests: { sol: number; food: number }[]; // greenhouse in progress
  discoveries: string[];   // science card IDs
  earthAnswers: { askedOnSol: number; aboutSol: number; reachedMars: boolean | 'unknown' }[];
  mode: 'guided' | 'free'; // guided = mission 1 unlocks (§11)
  log: SolLog[];           // one entry per resolved sol
  status: 'playing' | 'returned_all' | 'early_return';
};

type Allocation = {
  lifeSupport: number; greenhouse: number; shield: number;
  expedition: 0 | 1;       // costs EXPEDITION_CELLS when 1
  askEarth: 0 | 1;         // costs ASK_EARTH_CELLS when 1
};
```

Start: `air = 10`, `food = 6`, `exposure = 0`, `sol = 1`.

## 4. One sol

1. **Forecast.** The sol shows: space weather event (from the catalog, or none), its forecast risk 0–3, and whether dust is coming. The player answers one prediction question (no effect on the math; it is compared with the result in the log).
2. **Allocation.** Free cells = `cells(sol) − HEATING_CELLS`, where `cells(sol)` is 10, or 6 on a dust sol. So **7 free cells** on a normal sol, **3** on a dust sol. Rule: `lifeSupport + greenhouse + shield + 2·expedition + 1·askEarth = free cells`. Unspent cells are not allowed: the battery cannot store them (simplification, stated on screen). The "open math" shows, per cell, what it will do tonight.
3. **Crisis** (some sols): 10 seconds, see §6.
4. **Night**, in this exact order:
   1. Life support: `air += lifeSupport × 1`
   2. Harvest: `food += Σ pendingHarvests where sol = today`
   3. Plant: `pendingHarvests.push({ sol: today + 2, food: greenhouse × 2 })`
   4. Breathe and eat: `air −= 5`, `food −= 2`
   5. Expedition: if sent, `air −= 2`, `exposure += 1`, `discoveries.push(card)`
   6. Radiation: if the event really reaches Mars, `exposure += max(0, risk − shield)`; otherwise `+0` (shield cells were spent anyway)
   7. Earth: if asked, the answer about tomorrow's event appears in tonight's log, with the signal travel time
   8. End check (§7)

   Crisis effects in the same night (implemented in Phase 2): the solar-storm shield swap changes the allocation before step 1; the greenhouse crisis adds a step right after step 1 (`greenhouseRescue`, −2 air, or `harvestLost`); a recalled expedition keeps its air cost but has no `outside` exposure and no discovery.
5. **Sol log.** Prediction vs result, every line of the math above, the data source of the event, and one "what if you had…" line computed by re-running the night with one cell moved.

### What asking Earth gives (approved rule)

- **Today's question is about tomorrow.** Tomorrow's forecast already shows today, marked "maybe" (e.g. "Tomorrow: solar event, risk 2 — maybe reaches Mars").
- Asking spends 1 cell today. The answer arrives **after the plan is locked** and appears in **tonight's sol log**, with the signal travel time for that day. It is useful for tomorrow's plan, never for today's.
- The answer is the catalog's `reachedMars` field. It is **a prediction by a NASA model** (DONKI WSA-ENLIL) or, for the anchor event, a Mars measurement — and the data card says which.
- **Asking on sol 7 is useless** (there is no tomorrow in the mission); the button still works, and the log explains why it did not help.
- **In a 10-second crisis** the button shows "the answer would take at least 8 minutes" (`RADIO_ROUND_TRIP_MIN_MINUTES`) and is disabled.

Information costs power, and it arrives late.

### Night steps (the live math)

`resolveNight(state, allocation)` returns, besides the new state, the ordered list of steps:

```ts
type NightStep = {
  id: 'lifeSupport' | 'harvest' | 'plant' | 'breathe' | 'eat' | 'expedition' | 'radiation' | 'earthAnswer';
  labelKey: string;      // text lives in packages/content
  resource: 'air' | 'food' | 'exposure' | 'none';
  before: number;
  delta: number;
  after: number;
  cardIds: string[];     // data cards behind this step
};
```

- **Allocation screen:** the same function is run as a preview on every cell moved, so the open math updates live.
- **Night screen:** the steps are animated one by one, always in the order of §4.4. In assisted mode they run slower and can be replayed.
- **Optional prediction:** before the result, the child picks one of three outcomes (the real one plus two built by moving one cell). A correct pick adds the stripe "spot-on forecast"; a wrong pick costs nothing.

## 5. Space weather: event class → game risk (simplification)

| Real event (DONKI) | Game risk |
| --- | --- |
| No event, or C-class flare | 0 — none |
| M-class flare | 1 — low |
| X-class flare, or CME with a Mars arrival in DONKI's WSA-ENLIL run | 2 — medium |
| Solar energetic particle (SEP) event that a Mars instrument measured | 3 — high |

Honest limits, stated in the event's data card:
- DONKI records what left the Sun. Whether it reaches Mars depends on direction. Each catalog event stores `reachedMars: true/false` with its evidence (WSA-ENLIL impact list or MSL-RAD reading); without evidence the event says "unknown" and is treated as not reaching Mars.
- NASA's wording, used on screen: the flare's light arrives first, the charged particles follow in tens of minutes, and "Only the most energetic can reach the surface to be measured by RAD." This is why the highest risk needs particle evidence at Mars.
- A risk number is not a dose. No Mars dose is computed by the game.

## 6. Crises (10 seconds, assisted mode stops the clock)

At most one crisis per sol, 2–3 per mission. They happen after allocation and before the night. If the clock runs out, the crew **follows the plan** (option "keep the plan"). The choice and its cost go to the log.

| Crisis | Trigger | Options and cost |
| --- | --- | --- |
| Solar storm | Catalog event with risk ≥ 2 marked `fast` (particles arrive in hours) | **Move 2 cells from Life Support to Shield** (−2 air tonight, +2 shield) · **Recall the expedition** if one is out (no discovery, no `EXPEDITION_EXPOSURE`; the air was already spent) · **Keep the plan** |
| Dust | Scenario, at most once | Cells drop to 6 now: the child removes 4 cells from where they placed them |
| Greenhouse failure | Scenario, at most once, only if a harvest is pending | **Save the harvest:** −2 air (life support helps the greenhouse) · **Save the air:** the next pending harvest is lost |
| Radio silence | Any crisis: "Ask Earth" shows "the answer would take at least 8 minutes" and is disabled | The child decides alone. After the crisis, the delayed message from Earth arrives: "We saw what you did. We trust you." |

Source for the solar storm crisis wording: NASA (2024-06-10) — the flare's X-rays and gamma rays "arrived first", the charged particles reached Mars "in just tens of minutes", and "Only the most energetic can reach the surface to be measured by RAD." (DATA_MAP D7.)

## 7. End conditions

Checked at the end of each night:
- `air < 0` or `food < 0` → **early return**. The log points to "the sol where everything changed": for food, `failedSol − GREENHOUSE_DELAY_SOLS` (last sol a planting could have fixed it); for air, `failedSol − 1`. Never earlier than sol 1.
- `sol = 7` and both ≥ 0 → **everyone came home**.

Exposure does not end the mission (we have no defensible medical threshold — no invented numbers). It caps the verdict.

### Result

- **Margin in sols** = `min(floor(air / 5), floor(food / 2))` → "There was air and food for N more sols."
- **Meter words** for air and food, by sols of reserve: 0 critical · 1 tight · 2 safe · ≥ 3 plenty. Power meter: free cells today. Exposure: low (0–2) · medium (3–5) · high (≥ 6). Word and icon, never color alone.
- **Verdict**: early return · on the edge (margin 0) · with margin (margin ≥ 1) · reference mission (margin ≥ 1, exposure low, ≥ 1 discovery).

## 8. Three worked games (become the first tests)

All worked games run in **free mode** (all destinations open, §11) on a **test seed**; they are not mission 1. Game A happens to respect the guided unlocks; B, C and the bonus do not (they use the expedition before sol 3).

Same seed for all three: sol 2 event risk 2, **reaches Mars** · sol 4 **dust** · sol 5 event risk 3, **reaches Mars** · sol 6 event risk 1, **does not reach Mars** · sols 1, 3, 7 calm. Free cells: 7, 7, 7, 3, 7, 7, 7 = **45**.

Columns: LS life support, GH greenhouse, SH shield, EXP expedition (2 cells), ASK ask Earth (1 cell). Air/food/exposure are values **after** the night.

### Game A — "Guardian": everyone home, with margin

| Sol | LS | GH | SH | EXP | ASK | Air | Food | Exp. | Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 5 | 2 | 0 | – | – | 10 + 5 − 5 = **10** | 6 − 2 = **4** | 0 | plants 4 food for night 3 |
| 2 | 3 | 2 | 2 | – | – | 10 + 3 − 5 = **8** | 4 − 2 = **2** | 0 + max(0, 2−2) = **0** | plants 4 for night 4 |
| 3 | 5 | 2 | 0 | – | – | 8 + 5 − 5 = **8** | 2 + 4 − 2 = **4** | 0 | plants 4 for night 5 |
| 4 dust | 3 | 0 | 0 | – | – | 8 + 3 − 5 = **6** | 4 + 4 − 2 = **6** | 0 | |
| 5 | 4 | 0 | 3 | – | – | 6 + 4 − 5 = **5** | 6 + 4 − 2 = **8** | 0 + max(0, 3−3) = **0** | |
| 6 | 6 | 0 | 1 | – | – | 5 + 6 − 5 = **6** | 8 − 2 = **6** | **0** (event did not come; the shield cell was spent anyway) | |
| 7 | 7 | 0 | 0 | – | – | 6 + 7 − 5 = **8** | 6 − 2 = **4** | 0 | |

End: air 8 → 1 sol, food 4 → 2 sols → **margin 1**, exposure low, 0 discoveries → **with margin**. Everyone came home.

### Game B — "Scientist": everyone home, on the edge

| Sol | LS | GH | SH | EXP | ASK | Air | Food | Exp. |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 5 | 2 | 0 | – | – | **10** | **4** | 0 |
| 2 | 4 | 1 | 0 | 1 | – | 10 + 4 − 5 − 2 = **7** | 4 − 2 = **2** | 0 + 1 + max(0, 2−0) = **3** |
| 3 | 6 | 1 | 0 | – | – | 7 + 6 − 5 = **8** | 2 + 4 − 2 = **4** | 3 |
| 4 dust | 3 | 0 | 0 | – | – | 8 + 3 − 5 = **6** | 4 + 2 − 2 = **4** | 3 |
| 5 | 4 | 0 | 3 | – | – | 6 + 4 − 5 = **5** | 4 + 2 − 2 = **4** | 3 |
| 6 | 5 | 0 | 0 | 1 | – | 5 + 5 − 5 − 2 = **3** | 4 − 2 = **2** | 3 + 1 + 0 = **4** |
| 7 | 7 | 0 | 0 | – | – | 3 + 7 − 5 = **5** | 2 − 2 = **0** | 4 |

End: air 5 → 1 sol, food 0 → 0 sols → **margin 0**, exposure **medium**, **2 discoveries** → **on the edge**. Everyone came home.

### Game C — early return

| Sol | LS | GH | SH | EXP | ASK | Air | Food | Exp. |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 5 | 0 | 0 | 1 | – | 10 + 5 − 5 − 2 = **8** | 6 − 2 = **4** | **1** |
| 2 | 4 | 1 | 2 | – | – | 8 + 4 − 5 = **7** | 4 − 2 = **2** | 1 + max(0, 2−2) = **1** |
| 3 | 4 | 0 | 0 | 1 | 1 | 7 + 4 − 5 − 2 = **4** | 2 − 2 = **0** | **2** |
| 4 dust | 3 | 0 | 0 | – | – | 4 + 3 − 5 = **2** | 0 + 2 − 2 = **0** | 2 |
| 5 | 4 | 0 | 3 | – | – | 2 + 4 − 5 = **1** | 0 − 2 = **−2** | 2 |

Food < 0 on night 5 → **early return**. "The sol where everything changed" = 5 − 2 = **sol 3**: two greenhouse cells there would have harvested 4 food on night 5. The game offers "Play this mission again with another plan?" and "Go back to sol 3".

### Bonus — "reference mission" exists, but it is a bet

Game A with one change on sol 6: LS 5, EXP 1, SH 0 (betting that the risk-1 event will not reach Mars). Night 6: air 5 + 5 − 5 − 2 = 3, food 6, exposure 0 + 1 = 1. Night 7: LS 7, air 3 + 7 − 5 = 5, food 4. Margin 1, exposure low, 1 discovery → **reference mission**. Had the event reached Mars, exposure would be 2 — still low here, but the bet costs more on a risk-3 sol. Asking Earth on sol 5 would turn the bet into knowledge, for 1 cell.

## 9. No free choice, no single winning plan

- **Every cell has an opportunity cost.** All destinations draw from the same 7 free cells; a cell in one place is missing from the others the same night.
- **"Everything" does not fit.** Surviving 7 sols with full shielding and no expedition needs at least 25 life-support cells (35 air used − 10 start), 4 greenhouse cells (14 food used − 6 start = 8, at 2 per cell) and 5 shield cells: **34 of 45**. The 11 left buy at most two expeditions (each costs 2 cells + 2 air = 4 cells' worth) with no margin left. Seven expeditions plus full protection need 34 + 28 = 62 cells.
- **Shield is never free.** It is spent even when the event misses Mars (Game A, sol 6).
- **Greenhouse is never free.** It does nothing tonight; it pays two sols later, and plantings on sols 6–7 never pay inside the mission.
- **Asking Earth is never free.** 1 cell today, answer only tomorrow, and useless in a 10-second crisis.
- **No single winning plan.** Games A, B and the bonus all bring the crew home with different trade-offs (margin vs discoveries vs exposure). Events change with the seed (dust may fall on sol 1, a risk-3 event may miss Mars), so a fixed allocation that wins one seed fails another — e.g. Game A's sol 1 (7 cells) is impossible on a dust sol 1, where only 3 cells are free.

## 10. Tests derived from this model (Phase 2)

1. Games A, B and C reproduce every number in §8, night by night.
2. Allocation that does not sum to the free cells is rejected.
3. Dust sol leaves 3 free cells.
4. Greenhouse planted on sol *s* pays on night *s + 2*, never before; plantings on sols 6–7 never pay.
5. Shield reduces exposure only when the event reaches Mars; the cells are spent either way.
6. Margin, meter words, exposure words and verdict follow §7.
7. "Sol where everything changed" follows §7.
8. Property test: on any seed, no valid plan reaches the maximum discoveries (7) and comes home.
9. Property test: there is no single allocation sequence that reaches "reference mission" on every seed.
10. Guided mission 1: an allocation using a locked destination is rejected; the rules of the night are identical to free mode.
11. `resolveNight` returns the steps in the order of §4.4, and `after = before + delta` for each.
12. Ask Earth: the answer appears in tonight's log, refers to tomorrow, is useless on sol 7, and is unavailable in a crisis.
13. Career: unlock rules and the "complete" condition of §13; the career code round-trips (encode → decode = same progress).

## 11. Guided first mission (approved)

In **mission 1** destinations unlock over time; the simulation rules do not change, only what is enabled:

| Sol | Open destinations |
| --- | --- |
| 1 | Life Support, Greenhouse |
| 2 | + Shield |
| 3 onwards | + Expedition, Ask Earth |

All other missions start with everything open ("free mode"). Locked destinations show a padlock and the sol they open; they cost nothing and cannot hold cells.

## 12. Sol and day (wording rules)

- The opening teaches it once: "On Mars, a day has a name: sol. It lasts 40 minutes longer than ours. Your mission lasts 7 sols." (DATA_MAP M8).
- Mission 1 header: "SOL 3" with the caption "day 3 on Mars". From mission 2: "SOL 3 of 7".
- Results use "sols of reserve", with the same caption the first time it appears.

## 13. The journey: missions and completing the game

A mission is 7 sols. The game is a **career of missions**, all with the same rules and different event lists:

| Mission | Events | Unlocks when |
| --- | --- | --- |
| 1 "First sols" | Guided (§11), calm Sun | Open from the start |
| 2 "The May storm" | Includes the real 2024-05-20 event (risk 3 anchor, DATA_MAP D7) | Everyone home in mission 1 |
| 3 "Dusty sky" | Dust on more than one sol | Everyone home in mission 2 |
| "Surprise me" | Drawn from the catalog | After mission 1 (any result) |
| "Today in space" | Recent real space weather (live/snapshot/archive, with its badge) | After mission 1 (any result) |

**Completing the game** = full badge wall: missions 1–3 with everyone home, at least one reference mission, and all discoveries. It gives the title "commander" and a final scene. Every mission can be replayed. At the end of each mission: "Play this mission again with another plan?"; after an early return, also "Go back to the sol where everything changed".

Mission 3 needs a second dust sol; the rule is the same (`CELLS_DUST_SOL`), only the event list changes. Its worked game is a Phase 2 test.

## 14. Saving without an account

- Progress is saved on the device after every sol, with a save version.
- A short **career code** stores unlocked missions, badges, discoveries and the mission in progress, and restores everything on another device. No personal data. Format in ARCHITECTURE §6.
- Settings warn: without the code, clearing the browser's data erases progress.

## 15. Data cards that are still pending

A data point whose card is pending is **hidden from screens**; the build and the deploy do not fail because of it (the build lists hidden items in a report). Rule 16 holds: no card, no screen.

## 16. The projection: "if every sol were like today" (ADR-0031)

`project(def, state, todayAllocation)` in `packages/sim/src/projection.ts` returns air and food after tonight and after each remaining night, and the sol on which each one runs out. It feeds the trail of 7 sols and the "today → tomorrow" meters, and updates at every cell placed or removed. Label: **simplification**.

Rules:
- Tonight uses today's plan exactly as placed (complete or not), through `resolveNight` — the same numbers as the real night.
- Each later sol repeats today's **Life Support, Greenhouse and Shield**. **Expedition and Ask Earth are one-sol actions** and are not repeated: repeating an expedition every sol would describe a plan the child did not make.
- **Cut rule** on a sol with fewer free cells (a dust sol has 3): remove cells from **Shield first, then Greenhouse, then Life Support** until the plan fits. Air runs out fastest, so it loses cells last. The sol is marked `cut` so the trail can say so.
- Harvests already planted arrive on their sol; repeated plantings pay two sols later; plantings that would pay after sol 7 never count.
- Each line (air, food) is projected on its own until it goes below zero (the sol it runs out) or reaches sol 7 (home). Radiation is not projected: it depends on future events that are uncertain.

Tests (`projection.test.ts`): today's values equal `resolveNight`; Game A's sol 1 plan reaches home with the dust sol cut; all cells in Life Support → food runs out on sol 4; too little Life Support → air runs out on sol 6; an expedition costs air today only; harvests on the way are counted; partial plans work; each line runs on its own.

## 17. Consequences (ADR-0033, design review B)

- Dose limit `DOSE_LIMIT` = 2 points: above it at the end of a night → early return, cause `radiation`. Words: low 0–1, medium 2, high > 2.
- Radiation damage: unblocked points × `RADIATION_DAMAGE_CELLS_PER_POINT` (1), at most `RADIATION_DAMAGE_MAX_CELLS` (2), are lost from the next sol's free cells (`lostCells`, step `damage`). The projection includes it.
- Rock samples: each rover trip adds 1; a successful mission needs `SAMPLES_GOAL` (1).
- Results: `success` (home + sample + dose within limit), `with_failures` (home, an objective missed), `early_return`.
- Worked game B (§8) now ends on night 2 for radiation (exposure 3 > 2); games A, C and bonus are unchanged.
