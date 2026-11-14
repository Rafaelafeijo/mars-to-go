# Status — the complete game

> Portuguese version: [`docs/pt-BR/STATUS.md`](../pt-BR/STATUS.md). Updated at the start and end of every phase. Goal: the **complete** game, not a partial demo. First the whole path, then the finish. Features freeze Sunday 15:00; submission by 21:00 (Brasília).

Legend: ✅ done · 🔄 in progress · ⬜ to do · ✂️ cut (with reason and the team's OK)

Last update: 2026-11-14, end of Phase 3 (mission 1 playable end to end on a 360 px phone in EN and PT, checked by an automated playthrough in CI).

| Part of the complete game | Phase | Status | Note |
| --- | --- | --- | --- |
| Opening (20–30 s, skippable) | 7 | ⬜ | First to simplify if time is short (image + one sentence) |
| Home with the career | 3 / 6 | 🔄 | Done: numbers line, real photo badge, rotating role, honest footer. Career list in Phase 6 |
| Mission 1 "First sols" (guided) | 3 | ✅ | Real events: M1.3 flare (sol 3), CME with a Mars arrival forecast (sol 5) |
| Mission 2 "The May storm" | 6 | ⬜ | 2024-05-20 anchor event |
| Mission 3 "Dusty sky" | 6 | ⬜ | |
| "Surprise me" | 6 | ⬜ | |
| "Today in space" | 4 | ⬜ | Snapshot already published by the Pages workflow |
| Five destinations | 2 (rules) · 3 · 5 | 🔄 | Rules in Phase 2 |
| Crises (solar storm, dust, greenhouse, radio silence) | 2 (rules) · 4 · 5 | 🔄 | |
| Phase 3B A: projection "if every sol were like today" | 3B | ✅ | `packages/sim/src/projection.ts`, 11 tests, SIM_MODEL §16 |
| Phase 3B B: one screen — trail of 7 sols with air/food lines, today→tomorrow meters, plan by tap, animated night | 3B | 🔄 | Branch `phase-3b`, waiting for the team to play sols 1–2. Main and the published game unchanged |
| Phase 3B C–F: hint instead of badges, teaching, guided sol 1, Laboratory, art | 3B | ⬜ | ADR-0031 order |
| Cut (ADR-0031): avatar, career code, mission 3, OSDR cards, backpack (only if time) | — | ✂️ | Approved by the team |
| Live math (night steps) | 2 (rules) · 3 | ✅ | Updates on every cell moved; night animated step by step; optional pick-the-result; replay |
| Data cards on every screen | 3 → 7 | 🔄 | 18 cards in EN and PT, badge on every number, "I want to understand more". Crisis cards in Phase 4. Ask Earth card to adjust for mission 2 (answer is a Mars measurement there) |
| End-to-end test (CI playthrough, 360 px, EN + PT) | 3 | ✅ | `.github/workflows/e2e.yml`, base for the demo recording |
| Space weather in three layers | 1 (API, snapshot) · 4 (game) | 🔄 | API and snapshot live; game side in Phase 4 |
| End: Earth in the sky, play again, go back to the sol | 6 | ⬜ | |
| Save on device + career code | 2 (code rules) · 6 | 🔄 | |
| Badges and "completing the game" | 2 (rules) · 6 | 🔄 | |
| The science behind + public JSON | 7 | ⬜ | |
| Portuguese and English | 1 → all | 🔄 | Opens in English (ADR-0028) |
| Accessibility + assisted mode | 3 → 7 | ⬜ | |
| Playtest mode (`?playtest=1`, export JSON) | 4 | ⬜ | Before the test pause |
| Images (10 chosen) | 1 | ✅ | Prepared; used from Phase 3 |
| Publication: GitHub Pages | 1 | ✅ | https://rafaelafeijo.github.io/mars-to-go/ |
| Publication: Railway (API + mirror) | 1 | ✅ | https://mars-to-go-api-production.up.railway.app/health — deployed with `railway up`; auto-deploy on push needs the GitHub repo connected in the Railway dashboard |
| Bilingual documentation | 0 → all | 🔄 | |
| Submission material (page, 30 s video, slides) | 8 | ⬜ | |
| Avatar, touchable base | 6 | ⬜ | First to cut (brief §10) |

## Time plan (Brasília time)

| Phase | Window | Main risk |
| --- | --- | --- |
| 2 Simulation | Sat 13:45–15:30 | — |
| 3 Playable sol | Sat 15:30–19:00 | Live math UI on 360 px |
| 4 Space weather + crisis + playtest mode | Sat 19:00–21:30 | Playtest pause may move to Sunday 08:00 |
| Playtest | Sat evening or Sun 08:00 | Child's availability |
| 5 Five themes complete | Sun 08:30–10:30 | |
| 6 End, career, save, badges | Sun 10:30–13:00 | Many small parts |
| 7 Science page, accessibility, offline, opening | Sun 13:00–15:00 (freeze) | Opening is first to simplify |
| 8 Submission | Sun 15:00–21:00 | Video ≤ 30 s |
