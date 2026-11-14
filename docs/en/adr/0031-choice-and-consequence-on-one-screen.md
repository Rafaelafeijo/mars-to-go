# ADR-0031 — Phase 3B: every choice shows its consequence on the same screen

> Portuguese version: [`docs/pt-BR/adr/0031-escolha-e-consequencia-na-mesma-tela.md`](../../pt-BR/adr/0031-escolha-e-consequencia-na-mesma-tela.md)

Status: accepted, 2026-11-14. Supersedes the layout parts of ADR-0030; its art, panorama and photo rules stay.

**Context.** The team tested Phase 3 as an adult and did not understand the game; the only clear moment was "Mars is cold, heating costs 3". Diagnosis: (1) the game asks before it explains; (2) choice and consequence are on different screens; (3) there is no view of the whole — the 7 sols, what is missing, why not everything fits; (4) it is a scrolling form, not a game.

**Principle.** Every choice shows its consequence on the same screen, at the same moment.

**Decision.**
1. **One screen.** A whole sol fits on one screen without scrolling, on a 360 px phone and on a computer. Morning, plan and night are moments of that screen; short panels open on top and close.
2. **The trail of 7 sols** is fixed at the top, with home at the end: each sol shows its forecast (calm, maybe storm, dust with its free cells: 7 or 3) and harvests arriving. Two lines, air and food, run from today to the sol where each runs out; a line that reaches home is green, one that stops is red with "air runs out on sol 5". They move at every cell placed or removed.
3. **The projection** (`packages/sim/src/projection.ts`, SIM_MODEL §16, tested first): from the state and today's plan, air and food tomorrow and the sol each runs out "if every sol were like today". Labeled simplification.
4. **The plan in the scene:** battery with 10 cells (3 locked to heating); destinations are touchable objects showing their cells and their effect in one line ("+3 air", "+4 food on sol 5"); meters always visible as "today → tomorrow" with a word; the crew reacts before the plan is locked; locked destinations dimmed with a padlock; the lock button covers nothing.
5. **Teaching like the heating line:** a real-world fact, then the cost in the game, one sentence each, the first time an object appears, then on its diamond. No question about a rule not yet shown; no panel with more than two sentences.
6. **Opening:** one screen before sol 1 — "Bring the four home. It is 7 sols. Air and food cannot run out." — with the trail already showing both lines stopping before home.
7. **Sol 1 hand in hand:** the game suggests the sol 1 plan cell by cell and the lines move at each one. From sol 2 the child decides alone. Unlocks stay as they are.
8. **Guess:** the "when can the crew eat?" question goes away. The guess is about the math ("with this plan, how much air is left tomorrow?"), optional, answered at once on the same screen.
9. **Night:** the same screen darkens, numbers run from each object to the meters in simulation order, and the trail moves one sol. The log is a short panel.
10. **Visual:** Inside (base in cutaway; Kenney CC0 kits rendered to 2D from their 3D models, since their bundled 2D renders are too small), Outside (real Jezero panorama, horizontal drag, markers), Sky (real photos with the forecast); one switch; trail and meters fixed in all three. Photos never completed or recreated by AI; color filters for day, night and dust allowed. Data badge is a small diamond. Computer: wide centered stage with a side panel.
11. **Accessibility:** the list becomes "accessible mode" in settings, with the same trail and projection; 44 px targets, keyboard, reduced motion.

**Order (stop and show at the end of each step).** A: projection with tests. B: the single screen with trail, lines, meters and plan by tap, simple shapes, no art; screenshots at 360 px and on a computer; the team plays sols 1 and 2. C: teaching, opening, guided sol 1, new guess. D: art for Inside, then Outside, then Sky. E: Phase 4 (real space weather and the 10-second crisis) on this same screen.

**Cuts.** Out of scope: avatar, career code, mission 3, OSDR cards, and the backpack (only if time is left). "Today in space" becomes a card in the Sky view. If art is late, step B with simple shapes plus the Outside view is the game. The automated playthrough plays mission 1 through the new screen in English and Portuguese.

**Consequences.** The Phase 3 rules, tests, data cards and both languages stay. The Phase 3B prototype views (branch `phase-3b`) are reused in step D.
