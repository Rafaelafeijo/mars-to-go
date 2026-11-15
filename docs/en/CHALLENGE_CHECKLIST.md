# Challenge and submission checklist

> Portuguese version: [`docs/pt-BR/CHALLENGE_CHECKLIST.md`](../pt-BR/CHALLENGE_CHECKLIST.md).

Check this file **before planning each slice and before every commit that changes the game**. Source: `docs/CHALLENGE_STATEMENT.md` (official text) and the Project Submission Guide of November 13, 2026. If an item cannot be met, record the reason in `docs/en/adr/`.

**Status reviewed on 2026-11-15** against the code at commit `d77d8d2`. `[x]` = met, with where; `[ ]` = not met or not yet checked, with what is missing. "Partial" means part of the item is met.

## A. The question that decides everything

> Does a child aged 7 to 12 leave the game understanding a real constraint of surviving in deep space, and not just having had fun?

If the answer for the slice in progress is "no", it is not ready. Evidence so far: the playtests in `PLAYTEST.md` (one tester, aged 8); ADR-0033 was written because the first version had no real dilemma.

## B. Objective requirements

- [x] **B1. It is a working game or interactive app.** Published at https://rafaelafeijo.github.io/mars-to-go/; missions 1 and 2 played end to end by the CI playthrough (`scripts/playthrough.mjs`).
- [x] **B2. Audience of 7 to 12 years old.** Kid-language card texts (`packages/content/src/cards.ts`), whole small numbers (10 cells, 5 air); tested with an 8-year-old (`PLAYTEST.md`). Only one tester so far.
- [x] **B3. The player manages an outpost** — a base in Jezero, Mars, in a 3D world (ADR-0032).
- [x] **B4. Real decisions about the five themes:**
  - [x] life support — Air machine: 1 cell → 1 air; crew breathes 5 a sol
  - [x] radiation shielding — Shield cells against real DONKI events; dose limit (ADR-0033)
  - [x] power budgeting — 10 cells a sol, 3 always for heating, lost cells after radiation damage
  - [x] food production — Greenhouse: plant today, harvest 2 sols later
  - [x] communication delay — Ask Earth answers only at night; off during the 10-second crisis
- [x] **B5. Consequences play out over a simulated mission.** 7 sols; air, food, dose, lost cells and harvests carry over (`packages/sim`); end chart and "go back to the sol where everything changed".
- [x] **B6. No choice is free.** Every cell comes from the same 10; rover costs cells, air and dose; Ask Earth costs a cell; crisis moves cost what the cell was doing.
- [ ] **B7. The trade-off mechanic is clear enough for the child to explain it.** Partial: live math, projection lines and the night report show the trade-off; not yet confirmed by a playtest of missions 1 and 2 in their current form.
- [x] **B8. Real NASA open data supports the simulation.** DONKI events, Curiosity RAD, MOXIE, Mars Fact Sheet, BVAD, Veggie (`science.ts`, `catalog.ts`, `DATA_MAP.md`).

## C. Pitfalls the text says to avoid

- [x] **C1. There is no "safe" choice without a cost.** Shielding every sol leaves too little power (ADR-0034); air and food only fails the sample objective (ADR-0033, ADR-0035).
- [x] **C2. Visual polish does not replace correct mechanics.** Every rule is in `packages/sim` with tests, written before the screens.
- [x] **C3. Two or three core resources.** Power, air, food (CLAUDE.md rule 3); dose is a limit, not a fourth meter to spend.
- [x] **C4. Not too abstract nor too technical.** Facts tied to the decision they explain (fact of the sol, data cards).
- [ ] **C5. Not only educational nor only entertainment.** Partial: needs the next playtest to confirm.
- [x] **C6. Static data is never presented as live.** Missions use a dated archive; "The Sun this week" shows "Updated … UTC · copied from NASA twice a day"; no live call in the game.

## D. Audience and access

- [x] **D1. Simple language; terms explained in one sentence** (sol, flare, CME, microgray, millisievert, tau, coronagraph in the cards).
- [x] **D2. Runs in the browser, with no download and no account.**
- [ ] **D3. Older siblings, parents or a classroom** (optional). Data cards and the NASA data panel help adults; no classroom mode.

## E. Real data

- [x] **E1. At least one NASA dataset or resource is used.** DONKI (and others, `NASA_SOURCES` in `facts.ts`).
- [x] **E2. Sources are credited inside the game.** Badges, data cards, REAL PHOTO badges, NASA data panel.
- [x] **E3. Each piece of data shows whether it is live or archive, with the date.** Cards show the date; "The Sun this week" shows its copy time.
- [x] **E4. A built-in curated set as a fallback.** The missions run only on the bundled catalog; if the DONKI copy is missing, the home panel is hidden.
- **E5. Sources suggested by the challenge:**
  - [x] DONKI — mission events, Antenna answer, "The Sun this week"
  - [ ] RadLab / OSDR dosimetry — **not used** (ADR-0026); radiation comes from Curiosity RAD on Mars instead
  - [ ] OSDR health findings — **not used** (cut, ADR-0031)
  - [ ] Mars Trek — **not used**; the orbital view is the photo PIA23239
  - [ ] NASA Open APIs (api.nasa.gov) — **not used** (DONKI is read from CCMC directly, ADR-0027)
  - [ ] CSA lunar food material — **not used**

## F. What makes the solution stand out

- [ ] **F1. The in-game choice connects to a real-world consequence.** Partial: the shield decision uses real DONKI events from May 2024 with their dates; current space weather is shown on the home screen but does not enter the missions. The game reads only the snapshot and the archive (no live call).
- [ ] **F2. Replayability.** Partial: two missions with different events; failing ends with a clear cause and a retry.
  - [x] "Play this mission again with another plan?" at the end (`EndScreen.tsx`)
  - [x] "Go back to the sol where everything changed" after an early return
  - [ ] Progress saved on the device, with a mission code — **not done**: code rules exist in `packages/sim/src/code.ts`, but the app saves only the language
- [x] **F3. Scientific origin verifiable on every screen.** Data cards (ADR-0014) and the NASA data panel.

## G. Submission (Project Submission Guide)

- [ ] **G1. Deadline:** submit before Sunday, November 15, 23:59 (team creator's local time).
- [ ] **G2. All required fields filled in**, in English — drafts kept outside the public repository:
  - [ ] Project Name
  - [ ] High-Level Project Summary
  - [ ] Link to Project Demo (video link still a placeholder)
  - [ ] Link to Final Project
  - [ ] Detailed Project Description
  - [ ] Use of Super Intelligence (SI) (drafted outside the public repository)
  - [ ] NASA Data
  - [ ] Space Agency Partner Data and Other References
- [ ] **G3. Demo:** video up to 30 seconds or up to 7 slides — **not made yet**.
  - [ ] Video with narration and game footage (the CI playthrough screenshots are a base)
  - [ ] Supporting slides
  - [ ] "Show me the code" excerpt (constants sheet + a passing test) and repo address
- [ ] **G4. Language:** repo is English-first with Portuguese translations ✓; project page, video and slides still to make.
- [ ] **G5. Public links**, tested in an incognito window — to do before submitting.
  - [x] Final project link = GitHub Pages; Railway is the mirror
  - [x] The game works fully without the API (it never calls it)
- [ ] **G6. Slides:** team name, member names, challenge — to do.
- [x] **G7. No image, video, audio or likeness of anyone under 18** in the game and repo (ASSETS.md checks; `PLAYTEST.md` records facts only). Keep checking for the demo and the page.
- [x] **G8. AI use declared** — `AI_USAGE.md`; no AI-generated media in the game.
- [x] **G9. Everything used is listed** — `ASSETS.md` (images, 3D models, font), `package.json` / `pnpm-lock.yaml` (libraries).
- [ ] **G10. "Terms and Conditions" and "Confirm All Work is Original"** — at submission.
- [ ] **G11. All members confirmed in the same event** — to confirm on the event site.
- [ ] **G12. FortiGuard classification** (optional) — not done.
- [ ] **G13. Images on the project page** (JPG, PNG or GIF up to 10 MB) — to prepare.

## H. Participation rules that affect us

- [ ] **H1. Under 18: registered by a guardian and accompanied** — to confirm by the team (not checkable in the repo).
- [x] **H2. A minor does not use their own photo.** The avatar is the game's own astronaut drawn in code.
- [ ] **H3. One team, one challenge, six people at most** — to confirm by the team.
- [x] **H4. Work happens within the event period.** Commits from 2026-11-14 to 2026-11-15; history not rewritten (CLAUDE.md rule 13).

## I. Judging criteria

| Criterion | What we stand for | Check question | Status |
| --- | --- | --- | --- |
| Impact | Keeping alive in children and teenagers the dream of knowing the deep universe, training logical reasoning, math, physics, science, creativity, autonomy and courage | Does the slice visibly develop any of these skills? | Live math and planning each sol |
| Creativity | There is no single answer: the child sees the impact of each choice; can explore the base and the environment; customizable avatar | Are there at least two different plans that work? | 3D base to explore; avatar not customizable (cut) |
| Validity | Scientific and mathematical logic defined and validated before the screens; real data on space weather, terrain and environment | Does every number have a complete card (section J) and every calculation a test? | Cards and tests in place |
| Relevance | The challenge's five themes playable; item-by-item adherence to this checklist | Are items B1 to B8 all checked? | B7 waits for a playtest |
| Presentation | Inspiring language and real impact on children's education, together with proof of adherence to the requirements, of data use and of the method | Do the project page and the demo show the game, the data and the code? | Page and demo to make |

Most of the evaluation comes from the project page; the demo weighs on the Presentation criterion.

## J. Data visibility, always

Every piece of data that appears in the game answers three questions, on the screen itself: **where it came from, how it was processed and how the game uses it.**

- [x] **J1. Origin badge on numbers with real data** (`apps/web/src/cards/Badge.tsx`); label, source, place and date in the card.
- [x] **J2. One tap opens the data card** (`CardDialog.tsx`) with:
  - [x] Source, with link and record ID
  - [x] Where and when it was measured
  - [x] How it was processed
  - [x] How the game uses it
  - [x] What was simplified and why
- [x] **J3. "I want to understand more"** with an everyday example in every card.
- [ ] **J4. "The science behind" page and a public file with all cards** — **not done**. The data is ready in `cards.ts` and `science.ts`; `SCIENCE.md` and `DATA_MAP.md` cover the judges for now.
- [x] **J5. No screen shows data without a card.** `cards.test.ts` checks cards against `science.ts`; pending cards are hidden (ADR-0024).
- [x] **J6. Validation before screens.** SIM_MODEL, DATA_MAP, ARCHITECTURE approved in Phase 0; ADR-0033 to ADR-0035 approved before their screens.

## K. The real Mars and declared parallels

The game takes place on Mars. Data that was not measured on Mars only goes in as a parallel, and the parallel is always shown.

- [x] **K1. Every piece of data shows the place of measurement** (`place` in `science.ts` and cards; photo badges).
- [x] **K2. Parallel declared on the card** (`parallel` field; photo captions such as "On Earth … Not on Mars", "a Moon parallel").
- [x] **K3. A parallel only goes in with a justification in `SCIENCE.md`.** Section 4 lists P1–P16. Two visual/text details are marked "to confirm" there (Veggie LED colors, suit pressure) and are not shown as numbers.
- [x] **K4. CSA lunar material** — not used at all, so no lunar number is presented as Martian.
- [x] **K5. Mars's own challenges appear, each with a source:** thin CO₂ air (M1), less sunlight (M2), dust storms (M3, dust card; no mission has a dust sol yet), cold (M4), soil (M5), gravity (M6), radio delay (M9).
- [x] **K6. A solar event is not a dose on Mars.** Flares never raise the dose (Mars arrival unknown); CMEs need a WSA-ENLIL Mars forecast; two false alarms show model forecasts at Psyche; risk 3 needs a Mars measurement.

## L. Languages

- [x] **L1. The game is bilingual** (`packages/content/src/locales/en.json`, `pt-BR.json`; `locales.test.ts`).
- [x] **L2. Code in English.**
- [x] **L3. Bilingual documentation** (`docs/en/`, `docs/pt-BR/`).
- [x] **L4. README in English**, with `README.pt-BR.md`.
- [ ] **L5. Project page, demo and slides in English** — still to make.
