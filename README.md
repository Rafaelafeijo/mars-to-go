# Mars to Go

*10 seconds to go.* · [Português](README.pt-BR.md)

A browser game where kids ages 7–12 run a crewed base in Jezero Crater, Mars, sol by sol — and find out that in space no choice is free: the power that protects the crew today is the oxygen missing tomorrow.

- **Play:** https://rafaelafeijo.github.io/mars-to-go/ (GitHub Pages, primary) · Railway mirror: *[to be added]*
- **Challenge:** NASA Space Apps Challenge 2026 — *Build a Junior Astronaut Mission Trainer* ([official text](docs/CHALLENGE_STATEMENT.md))
- **Team:** Rochette

> Status: under construction during the event (November 14–15, 2026). Phase 1: skeleton and deploy.

## How it plays

Each sol (a Mars day, 40 minutes longer than ours) the player gets **10 power cells** — 3 always go to heating — and splits the rest between **Life Support** (air now), **Greenhouse** (food two sols later), **Shield** (protection tonight), **Expedition** (a real discovery, costs air) and **Ask Earth** (an answer that arrives late). Real solar events from NASA's DONKI database shape the risk. The math is always on screen. The full model is in [`docs/en/SIM_MODEL.md`](docs/en/SIM_MODEL.md).

## NASA data, and why

| Source | Why | Where |
| --- | --- | --- |
| **DONKI** (CCMC space weather) | Real solar flares, CMEs and particle events, and NASA's model forecast of arrivals at Mars | Forecast, solar storm crisis, "Today in space" |
| **Curiosity RAD** (via NASA article) | The 2024-05-20 solar storm measured on the surface of Mars | Mission 2, shield science card |
| **NASA Mars Fact Sheet**, MOXIE, Veggie, BVAD | Why air must be made, why power is short, how long plants take, how much a crew breathes | Data cards |
| **OSDR**, **Mars Trek** | Astronaut health findings; Jezero seen from orbit | Science cards; expedition map |
| **CSA** (partner agency) | General principles of growing food in closed environments | Greenhouse card (declared parallel) |

Every source, place and date: [`docs/en/DATA_MAP.md`](docs/en/DATA_MAP.md) and [`docs/en/SCIENCE.md`](docs/en/SCIENCE.md).

### Labels

Every number in the game shows a badge: **Measured** (real observation, with place and date), **Scenario** (assumed for our base) or **Simplification** (rounded or left out, on purpose). Archived data is never shown as live. Data not measured on Mars is shown as a declared parallel.

## Tested with a real child

Not yet: the first playtest with an 8-year-old tester is planned after Phase 4. Observations and the changes they caused will be listed in [`docs/en/PLAYTEST.md`](docs/en/PLAYTEST.md), facts only, with no name, image or voice of the child.

## Run it

Requirements: Node 22+, pnpm (via `corepack enable`).

```bash
pnpm install
pnpm dev          # game at http://localhost:5173
pnpm dev:api      # API at http://localhost:8787 (/health, /space-weather)
pnpm check        # typecheck + lint + tests
pnpm build
```

No API key is needed: DONKI is called at `ccmc.gsfc.nasa.gov` without a key. A NASA key, if used for other APIs, goes in a local `.env` (never committed).

## Repository

```
apps/web        React + Vite game (PWA)
apps/api        Hono API: /health, /space-weather (DONKI with cache), game mirror
packages/sim    pure game rules + science.ts (every constant with its source)
packages/content  texts in en and pt-BR, catalog, data cards
packages/ui     design tokens and components
tools/data      Python scripts to build the catalog
docs/en, docs/pt-BR   documentation in both languages
```

Architecture: [`docs/en/ARCHITECTURE.md`](docs/en/ARCHITECTURE.md). Decisions: [`docs/en/adr/`](docs/en/adr/).

## Use of AI

The game idea, design and decisions are the team's. Code is generated with **Claude Code** (Anthropic) and reviewed by the team. Details: [`docs/en/AI_USAGE.md`](docs/en/AI_USAGE.md).

## Privacy

No accounts, no analytics, no personal data. Progress stays on the device.

## Credits

NASA, CCMC (DONKI), NASA OSDR, NASA/JPL-Caltech and partner institutions, Canadian Space Agency. Image and asset credits: [`docs/en/ASSETS.md`](docs/en/ASSETS.md). This project is not endorsed by NASA.

## License

Code: [MIT](LICENSE). NASA data and images keep their own terms (see ASSETS).
