# ADR-0029 — Playtest mode: evidence of real use, kept on the device

> Portuguese version: [`docs/pt-BR/adr/0029-modo-de-teste.md`](../../pt-BR/adr/0029-modo-de-teste.md)

Status: accepted, 2026-11-14.

**Context.** The team will test the game with a real 8-year-old on a phone before Phase 5. Judges value evidence; children's privacy is non-negotiable (CLAUDE.md rules 9 and 10).

**Decision.**
- `?playtest=1` in the URL turns on playtest mode; a discreet indicator shows it is on.
- While on, the game records **on the device only** a list of anonymous, time-stamped events: start and end of each sol, every cell moved, time to lock the plan, prediction answer, data cards opened, help requested, crisis choice and time, result, "play again". No personal data, no typed text, nothing sent to any server.
- An "Export session" button downloads a JSON file.
- The team fills `docs/en/PLAYTEST.md`; files go to `docs/playtest/` (JSON, before/after screenshots, a short screen recording **without audio** — checked before commit).
- Each change made because of the test is its own commit citing the observation; at most the three most important fixes. A second round on Sunday morning if time allows.
- No name, image, voice or likeness of a minor in any file.

**Consequences.** One small event log module in the web app, off by default. The README and SUBMISSION gain a short, fact-only "Tested with a real child" section.
