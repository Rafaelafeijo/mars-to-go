# Use of AI

> Portuguese version: [`docs/pt-BR/AI_USAGE.md`](../pt-BR/AI_USAGE.md). Kept current during the event (CLAUDE.md rule 12).

## Summary

- **The game idea, the design and every decision are the team's.** The brief, the challenge checklist and the initial ADRs were written by the team before coding.
- **Code is generated with Claude Code (Anthropic) and reviewed by the team.** Commits say so in their message.
- No AI-generated image, video or audio is used so far. If one is, it carries a visible watermark and the "ILLUSTRATION" badge, and is listed below.

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

## Generated media

None.
