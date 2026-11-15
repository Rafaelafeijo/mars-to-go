# Status — the complete game

> Portuguese version: [`docs/pt-BR/STATUS.md`](../pt-BR/STATUS.md). Updated at the start and end of every phase. Features freeze Sunday 15:00; submission by 21:00 (Brasília).

Legend: ✅ done · 🔄 in progress · ⬜ to do · ✂️ cut (with reason and the team's OK)

Last update: 2026-11-15, after design review F (commit `d77d8d2`). Missions 1 and 2 are playable end to end in the 3D world, in English and Portuguese.

## What works now

| Part | Status | Where / note |
| --- | --- | --- |
| 3D world of the base (Jezero, low-poly) | ✅ | ADR-0032. Third-person astronaut, machines with labels, action button near each machine, zoom/tilt/pinch, sky view. Kenney CC0 models; astronaut and icons drawn in code (ASSETS.md) |
| Mission 1 "First sols" (guided) | ✅ | Real events: M1.3 flare (sol 3), CME forecast at Mars by WSA-ENLIL (sol 5). Facts of the sol with real NASA photos |
| Mission 2 "The May storm" (free mode) | ✅ | ADR-0034. A real May 2024 event every sol: X8.7 flare, two false alarms (CMEs forecast at Psyche), three fast CMEs forecast at Mars, and the May 20 storm measured by Curiosity's RAD (risk 3). Its own seven facts, each with a real NASA photo |
| Choices with consequences | ✅ | ADR-0033. Dose limit (2 points) ends the mission; unblocked radiation costs cells the next sol; a rock sample is an objective; three results (success, with failures, early return) |
| Rover site choice; mission 2 needs the delta-front sample | ✅ | ADR-0035. Near sites (Rochette, Kodiak) 2 air + 1 point; delta front (2.3 km, PIA24485) 3 air + 2 points |
| 10-second crisis with choices | ✅ | Risk against Shield; move cells from the machine you choose, or call the rover back. Assisted mode: no timer |
| Ask Earth (Antenna) | ✅ | Answer at night about tomorrow; off during the crisis (radio delay) |
| Live math, night report, end screen with chart | ✅ | Play again; go back to the sol where everything changed |
| Data cards on every number | ✅ | `packages/content/src/cards.ts` (EN + PT), badges, "I want to understand more" |
| NASA data panel (list of every NASA source and where it is used) | ✅ | `apps/web/src/world/NasaDataPanel.tsx`, from `NASA_SOURCES` in `facts.ts` |
| "The Sun this week" on the home screen | ✅ | DONKI copy saved by the Pages workflow twice a day, shown with its UTC time, never as live |
| Portuguese and English | ✅ | Opens in English (ADR-0028); language remembered on the device |
| Reduced motion; assisted mode switch on the home screen | ✅ | `prefersReducedMotion()`; assisted mode removes the crisis timer |
| Simulation tests (`packages/sim`) | ✅ | Every rule tested first |
| E2E playthrough in CI | ✅ | `.github/workflows/e2e.yml` + `scripts/playthrough.mjs`: mission 1 in the 3D world (EN and PT) and in the older one-screen and list views (EN); mission 2 in the 3D world (EN), ends "Mission accomplished!" with the delta sample |
| Publication: GitHub Pages (primary) | ✅ | https://rafaelafeijo.github.io/mars-to-go/ — on every push to `main` and twice a day (DONKI copy) |
| Publication: Railway (API + game mirror) | ✅ | https://mars-to-go-api-production.up.railway.app/health — built from `railway.json`; the game does not depend on it |

## Not done (honest list)

| Part | Status | Note |
| --- | --- | --- |
| Laboratory (interactive topics, ADR-0031) | ⬜ | Data cards are the explanation for now |
| Playtest mode (`?playtest=1`, export JSON with QR code, ADR-0029) | ⬜ | Playtests are recorded by hand in PLAYTEST.md |
| Mission 3 "Dusty sky" | ✂️ | Cut in ADR-0031. Dust rules and the dust card exist in the simulation, but no mission uses a dust sol |
| "Surprise me" (random events) | ⬜ | Missions use fixed real events |
| Progress saved on the device; career code on screen | ⬜ | The encode/decode rules exist and are tested (`packages/sim/src/code.ts`, `career.ts`), but the web app saves only the language. Mission 2 opens from the mission 1 end screen (or `?mission=2`) |
| "The science behind" page and public JSON of all cards | ⬜ | The data is ready in `cards.ts` / `science.ts`; no page or exported file yet |
| Opening scene | ⬜ | Not built |
| Customizable avatar | ✂️ | Cut in ADR-0031 |
| Full WCAG 2.2 AA audit | ⬜ | Not audited yet; reduced motion and assisted mode are in place |
| Submission material (page, 30 s video, slides) | 🔄 | drafts kept outside the public repository |

## Known limits

- **Performance** is only measured in CI, in headless Chromium with SwiftShader (software rendering), by the playthrough's fps probe. It has not been measured on real phones. On a phone, open the game with `?fps=1` to see the frame counter.
- The mission 2 playthrough runs in English only.
- This file describes commit `d77d8d2`. Work in progress (design review G, not committed yet) turns assisted mode into a "Cadet" level with 30 seconds in the crisis (`CRISIS_SECONDS_CADET`) instead of no timer; update the crisis rows when it lands.
- Mission 1's CME (1,263 km/s) is marked `fast: false` on purpose: mission 1 is guided and has no crisis.
