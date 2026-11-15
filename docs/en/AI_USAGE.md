# Use of AI

> Portuguese version: [`docs/pt-BR/AI_USAGE.md`](../pt-BR/AI_USAGE.md). Kept current during the event (CLAUDE.md rule 12). Last update: 2026-11-15.

## Summary

- **The game idea, the design and every decision are the team's.** The brief, the challenge checklist and the initial ADRs were written by the team before coding (the brief was removed from the tree on 2026-11-15 because the README and SIM_MODEL replace it; it stays in the git history, last version at commit `febbf1a`). Later ADRs (up to ADR-0035) record decisions the team took after design reviews and playtests.
- **Code and docs are generated with Claude Code (Anthropic) and reviewed by the team.** Many commit messages say so ("Generated with Claude Code, reviewed by the team."); this file is the complete record.
- **Research and fact-checking:** Claude Code subagents searched and read NASA sources (DONKI records, NASA articles, Photojournal and images.nasa.gov pages, NTRS reports, NASA-STD-3001 briefs) and reported quotes and values. Every number in the game comes from a source listed in `packages/sim/src/science.ts`, `DATA_MAP.md` and `SCIENCE.md`; values that could not be confirmed are marked "to confirm" and are not shown.
- **The demo video's narration is AI-generated** (Kokoro-82M, text-to-speech); see "Generated media" below. Nothing else in the video is AI-generated.
- **No AI-generated image, video or audio is in the game.** Every photo is a real NASA image (ASSETS.md, 15 images, crop and resize only). The 3D models are Kenney CC0 packs. The astronaut, the terrain, the sky and the icon set are drawn in code (three.js primitives and SVG). If AI media is ever used, it will carry a visible watermark and the "ILLUSTRATION" badge, and will be listed below.

## Log

| Date | Tool | What | Reviewed by |
| --- | --- | --- | --- |
| 2026-11-14 | Claude Code | Phase 0: real API probes (DONKI, RadLab, OSDR, Mars Trek, CSA), source verification of science constants, drafts of SIM_MODEL, DATA_MAP, ARCHITECTURE, ADR-0019 to ADR-0027 from the team's decisions | Team (approved) |
| 2026-11-14 | Claude Code | Translations between English and Portuguese of the docs | Team |
| 2026-11-14 | Claude Code | Phase 1: monorepo skeleton, API, CI and deploy workflows, README | Team |
| 2026-11-14 | Claude Code | Search for real NASA image candidates (no image generated) | Team chose |
| 2026-11-14 | Claude Code | Download, crop and resize of the 10 chosen NASA images (no AI enhancement) | Team |
| 2026-11-14 | Claude Code | Railway project creation and deploy, with the team's approval | Team |
| 2026-11-14 | Claude Code | Phase 2: simulation code and tests (`packages/sim`) from the approved SIM_MODEL | Team |
| 2026-11-14 | Claude Code | Phase 3: screens, data-card text in EN and PT (drafted from DATA_MAP, sources checked), automated playthrough | Team |
| 2026-11-14/15 | Claude Code | Phase 3B: projection with tests (ADR-0031), one-screen sol, 3D world prototype (ADR-0032) with Kenney CC0 models, the astronaut and the icon set drawn in code | Team |
| 2026-11-14/15 | Claude Code | Changes after the playtests and design reviews A–F: home, briefing, sky view, report, crisis with choices, readable body font | Team |
| 2026-11-15 | Claude Code | Simulation rules and tests for ADR-0033 (dose limit, radiation damage, samples, three results) and ADR-0035 (rover site, delta front) | Team (approved ADRs) |
| 2026-11-15 | Claude Code (subagents) | Mission 2 research: DONKI flare, CME and WSA-ENLIL records for May 2024; NASA release 2024-080; mission 2 facts read from NTRS 20160004210, NTRS 20210000827, NASA-SP-2009-566, NASA-STD-3001 briefs, PIA24033; search for five more real NASA photos (ASSETS rows 11–15, no image generated) | Team chose |
| 2026-11-15 | Claude Code | Mission 2 "The May storm" (ADR-0034): catalog, cards and facts in EN and PT, crisis, e2e playthrough of mission 2 | Team |
| 2026-11-15 | Claude Code | "The Sun this week" on the home screen from the DONKI copy | Team |
| 2026-11-15 | Claude Code | Docs brought in line with the code: SCIENCE, DATA_MAP, STATUS, AI_USAGE, CHALLENGE_CHECKLIST (EN and PT) | Team |
| 2026-11-15 | Claude Code | Security review, Content Security Policy, live DONKI through the API service, phone direction pad and toolbar (design review H) | Team |
| 2026-11-15 | Claude Code (subagent) | README research: educational games (quiz vs simulation), astronomy teaching in Brazil (BNCC, OBA), children's interest in space, name search; every source opened and read, unverified items left out | Team |
| 2026-11-15 | Claude Code | Demo video: narration script options (the team chose and edited the text), voice samples, recording of real gameplay with Playwright, editing with ffmpeg (crops, zooms, captions, credits) | Team (approved) |
| 2026-11-15 | Kokoro-82M (run locally) | Narration audio of the demo video, voice `af_heart` | Team chose the voice |
| 2026-11-15 | Claude Code | README rewrite with the judging criteria and evidence; Portuguese translation | Team |

## Generated media

**In the game: none.**

**In the demo video only:** the narration (about 26 seconds of speech) was generated with **Kokoro-82M**, an open-source AI text-to-speech model (Apache-2.0), run locally, voice `af_heart`. It does not imitate any real person. The disclosure "Narration generated with Kokoro-82M, an AI text-to-speech tool" appears on screen at the end of the video, in the YouTube description and in the MP4 metadata. The narration text was written by the team with Claude Code. No AI-generated image or video is used in the demo: the pictures are real NASA photos and footage recorded from the game.
