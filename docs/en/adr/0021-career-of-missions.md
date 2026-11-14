# ADR-0021 — A career of missions, and what "completing the game" means

Status: accepted, 2026-11-14.

**Context.** Replayability stands out in the challenge (checklist F2). A single 7-sol mission ends too fast; random events alone give no sense of progress.

**Decision.** The game is a career of 7-sol missions, all with the same rules and different event lists: mission 1 "First sols" (guided, calm Sun, open from the start); mission 2 "The May storm" (the real 2024-05-20 event; opens with everyone home in mission 1); mission 3 "Dusty sky" (dust on more than one sol; opens with everyone home in mission 2); "Surprise me" (drawn events) and "Today in space" (recent real space weather), both open after mission 1. Completing the game = full badge wall: missions 1–3 with everyone home, at least one reference mission, all discoveries. It gives the title "commander" and a final scene. Every mission is replayable and ends with "Play this mission again with another plan?" and, after an early return, "Go back to the sol where everything changed".

**Consequences.** Missions are data (event lists) in `packages/content`, not code. Unlock and completion rules are tested in `packages/sim`.
