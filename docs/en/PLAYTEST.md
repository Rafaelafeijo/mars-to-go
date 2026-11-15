# Playtest log

> Portuguese version: [`docs/pt-BR/PLAYTEST.md`](../pt-BR/PLAYTEST.md). Rules: ADR-0029. **No name, image, voice or likeness of the tester in any file.** Facts only.

How the sessions were run: the child played without help unless he asked; the parent wrote down facts only, during and right after the session. A session-export mode was planned (ADR-0029) but not built in time, so there are no exported files.

---

## Round 0 (3D prototype, before playtest mode)

Informal session, no exported file (playtest mode did not exist yet). Recorded by the parent, facts only.

| Field | Value |
| --- | --- |
| Date | 2026-11-14, evening |
| Device | computer, browser, local server |
| Game version (commit) | `21e1828` (branch `phase-3b`, 3D world prototype) |
| Tester | tester, 8 years old |
| Language played | Portuguese |
| Assisted mode | off |

### Observations

| Moment | What happened (facts) |
| --- | --- |
| Home screen | Did not want to read the opening explanation text. |
| Briefing | The second explanation, in bullet points, helped reading. |
| Mission | Did not notice that the game is a sequence of missions. Missing: what happened to the previous sol's choices. |
| Gameplay | What he liked most: walking on the terrain and discovering the items. Used tapping the machines more than the bottom bar. |
| Weather | Did not see the day's forecast at first. When he saw there would be a flare, he got excited and waited for something to happen; nothing happened in the scene. |
| Air | Never noticed that air was critical. |
| Food | Did not understand the food resource or the growing time. |
| Rover and antenna | Did not understand what they do or their impact. |
| Character | The astronaut looks like a block, not an astronaut (parent's note). |
| End | Early return for lack of air on sol 3; the reason was not clear. |
| Overall | He was moved by the game; concept assimilation was not clear to the parent. |

### The five final questions (brief §11)

1. Time to understand the first allocation without help: not measured.
2. Where he got stuck: critical air, food, rover and antenna, reason for the early return.
3. What he did in the first crisis: no crisis happened in the scene; he waited for the flare.
4. One sentence, in his own words: not recorded.
5. Did he ask to play again? not recorded.

**What round 0 changed:** these observations became block 1 (commit `c66cfa9`): a home screen with one image and one button, a briefing in bullets, the forecast banner at the start of each sol, the solar storm visible at night, a sol report after each night, a critical air tank, plants that grow, rover and antenna actions, our own astronaut, and the reason for an early return with its numbers.

---

## Design review A (adult, after block 1)

Not a child session: the parent reviewed commit `9198cfb` on a computer, in both languages. Recorded so each change has its reason.

| Observation | Change (commit `c550a4f`) |
| --- | --- |
| Footer does not follow the page; side margin too tight near the top buttons | One side margin for top bar, hero and footer; full-width footer |
| In Portuguese the "Jogar" button dropped to a new line | Buttons stay on one row from tablet width |
| Roles in Portuguese mixed feminine and masculine | One form for all roles (generic masculine, as the reviewer asked) |
| Sol opening dialog lacks contrast | Darker, blurred backdrop behind every dialog |
| Machine labels look like "Windows 97" and cover the panels | Glass labels with a colored dot, constant size on screen, no "▶" |
| Plant grows "in the middle of nothing"; more cells do not show more plants | Inflatable greenhouse (after the University of Arizona / NASA prototype), one tray per cell; harvest marks on the food bar |
| Is the air tank realistic? | Drawn as a white pressure tank with a level window; marked illustration (source to verify) |
| Invisible wall when walking | Warning before the limit ("too far, turn back"), then a soft stop |
| Wants to see the sky | Sky colored after NASA's description (yellow to orange), "Look at the sky" view with a real NASA fact and photo; mouse-wheel zoom |
| Report: low contrast, little breathing room, "low" not clearly radiation, button covers text, no scroll | Report rebuilt: labeled stat cards (Air, Food, Radiation), scrolling body, button fixed at the bottom |
| "Highlighter" look of labels | Same glass style for labels and panels |

---

## Round 1 — mission 1 after block 1 (child)

Informal session, no exported file. Recorded by the parent, facts only.

| Field | Value |
| --- | --- |
| Date | 2026-11-14, night |
| Devices | Computer: Windows 11 Pro, AMD Ryzen 7 7735HS with Radeon graphics, 15 GB RAM, screen 1920×1200 at 150% scale (1280×800 CSS px), browser: _to confirm (Chrome 157 or Edge 157 are installed)_ · iPhone 16, browser: _to confirm_ |
| Game version (commit) | `c550a4f` … `7d3c2d9` (branch `phase-3b`, after design review A) |
| Tester | tester, 8 years old |
| Language played | Portuguese |
| Mission | Mission 1 |

| Moment | What happened (facts) | Change it caused | Commit |
| --- | --- | --- | --- |
| Gameplay | Used the label of the machine he was next to (then shown with "▶") a lot to put cells straight into it, more than the bottom bar. | A clear action button next to the machine: "+ Add 1 cell" and "−", also key E. | `5bb50bb` |
| 3D base | Thought the air machine was the crew's little house. | A real crew habitat in the base, labeled "Habitat" (NASA's term), separate from the machines. | `5bb50bb`, `3a23255` |

## Round 2 — mission 2 (child)

| Field | Value |
| --- | --- |
| Date | 2026-11-15 |
| Devices | Same computer as round 1 · iPhone 16 |
| Game version (commit) | `22205ed` … `8ae30de` (branch `phase-3b`) |
| Tester | tester, 8 years old |
| Language played | Portuguese |
| Mission | Mission 2 "The May storm" |

| Moment | What happened (facts) | Change it caused | Commit |
| --- | --- | --- | --- |
| After playing | Asked how astronauts breathe inside the suit: does the oxygen go inside? | Fact of sol 7 in mission 2 "How astronauts breathe in a suit", written from NASA-STD-3001 technical briefs read in full, with a real photo of an Apollo suit backpack. | `d77d8d2` |

---

## Design reviews B–H (adult)

Not child sessions: the parent reviewed each build on the computer and on the iPhone 16, in both languages. They shaped most of the game rules.

| Review | Main observations | Changes | Commit |
| --- | --- | --- | --- |
| B | Air and food always win; no penalty without a shield; rover and antenna give nothing; walking bugs; unclear report numbers | Dose limit, radiation damage to cells, rock sample objective, three results, Earth's answer shown, walking fixes, clearer report (ADR-0033) | `5bb50bb` |
| C | Mission 2 too easy; Antenna gives no feedback; repeated facts and photos; "tomorrow" said the next morning; right click walks | False alarms, crisis on every fast storm, Antenna feedback, own facts for mission 2, "today/tomorrow" fix (ADR-0034) | `f49362f` |
| D | Crisis only text and always the same answer, even with enough shield; missing photos | Crisis with picture, risk vs shield meter, choose where cells come from; real NASA photos for every mission 2 fact | `5afc51c` |
| E | The rover needs a real mission; key numbers hidden in text | Rover chooses its site; mission 2 needs the delta front sample (ADR-0035); report conclusions in bold | `8ae30de` |
| F | Body font looks generic; text starting in bold; Sun card wraps | Atkinson Hyperlegible Next font; one bold pattern; Sun card gradient | `d77d8d2` |
| G | Home screen: the assisted-mode switch needed a better design; Sun card too long; photo credit not exact; "sol" must stay "sol" | Cadet / Commander level buttons; one-line Sun card with a calm/busy sentence (explanation moved to the NASA data panel); exact photo credit; copy back to sols, smaller level buttons | `99f87c6`, `7c944f3`, `f3815c1` |
| H | On the phone: no room to tap below the astronaut to walk toward the camera; too many loose buttons; sky card covers the Sun; edge warning could not be closed. "The Sun this week" was not live | Direction pad and higher camera; one toolbar for sky, zoom and menu; sky card moves down; edge warning hides by itself; live DONKI through the API service | `9de3e5d` |

---

## What testing with a child changed

1. **Reading:** the child skipped long text, so the game moved to short bullets, one strong image and numbers you can see (round 0).
2. **Seeing consequences:** "nothing happened" when a flare came, so solar events became visible at night, and the report now explains every number (round 0, review B).
3. **Acting where you look:** the child played by walking up to machines, so the game gained an action button next to each machine (round 1).
4. **Understanding the base:** the air machine looked like a house, so the base gained a real habitat (round 1).
5. **Curiosity as content:** the child's question about breathing in a suit became a real NASA fact in the game (round 2).
