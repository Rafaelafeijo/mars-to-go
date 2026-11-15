# Mars to Go — project rules for Claude Code

NASA Space Apps Challenge 2026, challenge "Build a Junior Astronaut Mission Trainer". Team Rochette. Deadline: Sunday, November 15, 2026, 23:59 America/Sao_Paulo.

## Read first

1. `docs/CHALLENGE_STATEMENT.md` — the official challenge text. Source of truth.
2. `docs/en/CHALLENGE_CHECKLIST.md` — check it before planning each slice and before each commit that changes the game.
3. `docs/en/PROJECT_BRIEF.md` — the game design.
4. `docs/en/SIM_MODEL.md`, `docs/en/DATA_MAP.md`, `docs/en/ARCHITECTURE.md` — approved in Phase 0.
5. `docs/en/adr/` — decisions already taken.
6. `docs/en/CHALLENGE_CHECKLIST.md` section G — what the project page needs. The page drafts live in `private/SUBMISSION.en.md` (git-ignored, local only; never commit them).

Docs live in `docs/en/` (default) and `docs/pt-BR/`; references below to `docs/X.md` mean both.

## The one question

Does a 7–12-year-old walk away understanding a real constraint of deep-space survival, not just having played a fun game? If a slice does not serve that, stop and ask.

## Non-negotiable rules

1. **No free choice.** Every option in the game shows its cost.
2. **Mechanics before polish.** Do not spend time on visuals while a core mechanic is missing.
3. **Three core resources** (power, air, food). Do not add a fourth meter without an ADR.
4. **Science.** No constant outside `packages/sim/src/science.ts`. Each has value, unit, label (`measured | scenario | simplification`), source, URL, place, access date. Never invent a value or a source: mark `TODO` and tell the user.
5. **Live vs archived.** Static data is never presented as live. Every data point shows its date.
6. **Radiation.** No fabricated Mars dose numbers. ISS measurements are labeled as ISS.
7. **Text.** No UI strings in code. All text in `packages/content`, in `en` (default) and `pt-BR`, both complete from the MVP. Plain language for ages 7–12; explain a scientific term in one sentence where it appears.
8. **Accessibility.** WCAG 2.2 AA on decision screens, 44 px touch targets, nothing by color alone, reduced motion respected, assisted mode for every timer.
9. **Privacy.** No accounts, no third-party analytics, no personal data. Progress in local storage.
10. **Minors.** No name, photo, video, voice or likeness of anyone under 18 anywhere: game, repo, demo, project page.
11. **Rights.** Every third-party asset goes in `docs/ASSETS.md` (source, credit, license) before it is committed. No NASA logos, insignia, flags or mission identifiers.
12. **AI disclosure.** Keep `docs/AI_USAGE.md` current: what was generated, with which tool. AI-generated images or video carry a visible watermark.
13. **Honest record.** Never alter commit dates, rewrite history, or state that something was done at a time it was not.
14. **Secrets.** No tokens or `.env` in the repo. The repo is public.
15. **Language.** Code, comments and commit messages in English. Docs are bilingual: `docs/en/` (default) and `docs/pt-BR/`; `README.md` in English with `README.pt-BR.md`. The project page, demo and slides are English only. Talk to the user in Portuguese.
16. **Data trail on every screen.** Every data point shown in the game has a complete data card: source and record ID, where and when it was measured, how it was treated, how the game uses it, what was simplified, a kid-level explanation with an everyday example, and the Mars parallel when it was not measured on Mars. No card, no screen. Cards, the "science behind" page and a public JSON all come from the same source of truth.
17. **Mars first, parallels declared.** Data not measured on Mars (ISS, Moon, Sun, Earth) is always shown as a parallel with its scientific justification and what differs on Mars. No justification in `docs/SCIENCE.md`, no data.
18. **Validate before building screens.** Architecture diagrams, the data map and the simulation model are approved by the user before any UI that depends on them.
19. **Phase gates.** Work in phases. At the end of each phase, show what was done and wait for the user's validation before committing to `main` and moving on. Tag each validated phase.

## How to work

- Short plan first, then wait for the user's OK.
- Vertical slices in the order of `docs/PROJECT_BRIEF.md` section 10. Each slice ends deployed and playable.
- In `packages/sim`: test first, then code.
- Progressive commits per validated phase; Conventional Commits; a git tag per phase.
- Typecheck, lint and tests before every commit.
- New architecture decision → new ADR in `docs/adr/`.
- Ask before anything destructive or anything that costs money.
- If a science or event-rule question is ambiguous, stop and ask.
- The user is a full-stack developer (TypeScript, Python) making her first game, working with her 8-year-old as first tester. Favor simple, readable code she can change quickly.

## Commands

Node 22 (`nvm use 22`; Node 25+ has no corepack), pnpm via `corepack enable`. Run in WSL.

- Install: `pnpm install`
- Dev: `pnpm dev` (game, :5173) · `pnpm dev:api` (API, :8787)
- Test: `pnpm test` · Typecheck: `pnpm typecheck` · Lint: `pnpm lint` · All three: `pnpm check`
- Build: `pnpm build` (Pages build: `BASE_PATH=/mars-to-go/ pnpm --filter @mars-to-go/web build`)
- Deploy: push to `main` → GitHub Pages (`.github/workflows/pages.yml`, also twice a day for the DONKI snapshot); Railway builds from `railway.json` (API + game mirror, `pnpm start`).
- TypeScript is pinned to 6.x: typescript-eslint does not support TS 7 yet.
