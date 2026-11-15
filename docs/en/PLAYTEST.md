# Playtest log

> Portuguese version: [`docs/pt-BR/PLAYTEST.md`](../pt-BR/PLAYTEST.md). Rules: ADR-0029. **No name, image, voice or likeness of the tester in any file.** Facts only.

How to run a session: open the playtest link (with `?playtest=1`) on the phone, check the discreet "playtest" indicator, let the child play without help unless asked, then tap "Export session" and save the JSON in `docs/playtest/`.

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

## Round 1

| Field | Value |
| --- | --- |
| Date and time | |
| Device (model, browser) | |
| Game version (commit) | |
| Tester | tester, 8 years old |
| Language played | |
| Assisted mode | on / off |
| Session file | `docs/playtest/round1-session.json` |

### Observations by moment

| Moment | What happened (facts) | Time |
| --- | --- | --- |
| Opening | | |
| First allocation | | |
| Live math | | |
| First night | | |
| Data badge / card | | |
| Crisis | | |
| End | | |

### The five final questions (brief §11)

1. Time to understand the first allocation without help:
2. Where they got stuck, and what changed because of it:
3. What they did in the first crisis:
4. One sentence, in their own words:
5. Did they ask to play again?

### Observation → change

At most the three most important fixes; each is its own commit citing the observation.

| # | Observation | Change made | Commit | Before | After |
| --- | --- | --- | --- | --- | --- |
| 1 | | | | `docs/playtest/r1-1-before.png` | `docs/playtest/r1-1-after.png` |
| 2 | | | | | |
| 3 | | | | | |

---

## Round 2 (Sunday morning, if time allows)

Same template as round 1.
