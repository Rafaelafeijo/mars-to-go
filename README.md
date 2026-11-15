# Mars to Go

*No choice is free.* · [Português](README.pt-BR.md)

A browser game for kids ages 7–12. You command a crewed base in Jezero Crater, Mars, for 7 sols (Mars days), and you find out what real deep-space survival depends on: power is always short. The cell that protects the crew from radiation tonight is air or food that is missing tomorrow. Every solar event in the game is a real NASA record, and every number shows where it comes from.

- **Play:** https://rafaelafeijo.github.io/mars-to-go/ (computer or phone; English by default, Portuguese on the top bar).
- **Jump to mission 2:** https://rafaelafeijo.github.io/mars-to-go/?mission=2 (it normally opens after mission 1).
- **Mirror and API:** https://mars-to-go-api-production.up.railway.app/ ([/health](https://mars-to-go-api-production.up.railway.app/health))
- **Challenge:** NASA Space Apps Challenge 2026, *Build a Junior Astronaut Mission Trainer* ([official text](docs/CHALLENGE_STATEMENT.md))
- **Team:** Rochette

## How it plays

You walk an astronaut around a 3D base and plan each sol. Every sol you get **10 power cells**. 3 always keep the base warm (Mars nights reach −89 °C), and you place the other 7:

| Machine | What one cell does | What it costs |
| --- | --- | --- |
| **Air machine** | +1 air tonight (like NASA's MOXIE, which made oxygen from Mars air) | Four astronauts breathe 5 every night |
| **Greenhouse** | +2 food, but only 2 sols later | Nothing tonight; plant early or go hungry |
| **Shield** | Blocks 1 point of radiation tonight | Spent even if the storm misses Mars |
| **Rover** (2 cells) | Brings a rock sample from a real Jezero site | Suit air and radiation outside; the delta front is far |
| **Antenna** | Earth tells you tonight whether tomorrow's storm will reach Mars | One cell that makes no air or food |

Choices have consequences:

- **Radiation dose limit.** If the dose goes above the limit, the mission doctor sends the crew home. If radiation gets past the shield, it also damages the electronics, and you lose cells the next sol.
- **The 10-second crisis.** When a fast storm reaches Mars, you see the risk against your Shield and choose which machine gives up cells to protect the crew. There is no timer in assisted mode.
- **Three results.** "Mission accomplished" needs everyone home, the rock sample and the dose within the limit. Otherwise the result is "Mission with failures", which shows what failed, or "Early return", which shows why, with that night's numbers.

**Mission 1, "First sols"**, is guided: machines open over the first sols. **Mission 2, "The May storm"**, replays the real week of May 14–20, 2024:

- An X8.7 flare.
- Two false alarms: CMEs that NASA's WSA-ENLIL model forecast would hit the Psyche spacecraft, not Mars.
- Three fast CMEs forecast to arrive at Mars.
- The May 20 storm, measured on Mars by Curiosity's RAD.

Shielding every sol is too expensive, so asking Earth pays off. The sample must come from the **delta front**, NASA's best bet for finding signs of ancient life.

After each night, a report explains every change, with the conclusion in bold. It also shows **one real NASA fact with a real photo**; no fact or photo repeats.

The full rules are in [`docs/en/SIM_MODEL.md`](docs/en/SIM_MODEL.md). Decisions: [`docs/en/adr/`](docs/en/adr/), especially ADR-0033 to ADR-0035.

## Real NASA data

| Source | What the game uses | Where |
| --- | --- | --- |
| **NASA CCMC DONKI** | Real solar flares and CMEs, and NASA's WSA-ENLIL forecasts of arrival at Mars | Each sol's forecast, the Antenna's answer, "The Sun this week" on the home screen |
| **Curiosity RAD** (NASA/JPL release 2024-080) | The May 20, 2024 storm measured on the surface of Mars | Mission 2, sol 7 |
| **NASA Mars Fact Sheet** | 95.1% CO₂ air, −89/−31 °C (Viking 1 site), weak sunlight | Thermometer, power, air |
| **MOXIE**, **Veggie**, **BVAD** | Oxygen made from Mars air; lettuce grown in 33 days on the ISS; oxygen a crew uses | Air machine, greenhouse, data cards |
| **NASA-STD-3001** (Vol. 1 and technical briefs) | Astronaut dose limits; how astronauts breathe inside a suit | Dose limit card, mission 2 fact |
| **NASA studies** (NTRS, Design Reference Architecture 5.0) | Oxygen stored in tanks, base power, suit CO₂, how far astronauts walk | Mission 2 facts, air tank, walking limit |
| **NASA Photojournal, images.nasa.gov, SVS, NASA Science** | Real photos of Jezero, Kodiak, Rochette, the sky of Mars, MOXIE, plants on the ISS and the May 2024 flare | Report facts, home screen |

Every number lives in [`packages/sim/src/science.ts`](packages/sim/src/science.ts) with its value, unit, label, source, URL, place and access date.

- **Labels:** each number is **measured**, **scenario** or **simplification**.
- **Dates:** archived data is never shown as live. "The Sun this week" shows the UTC time of its copy.
- **Parallels:** anything not measured on Mars (ISS, Moon, Earth, Sun) is shown as a declared parallel with its justification ([`docs/en/SCIENCE.md`](docs/en/SCIENCE.md)).

Sources, places and dates: [`docs/en/DATA_MAP.md`](docs/en/DATA_MAP.md).

## Tested with a real child

An 8-year-old played every version on a computer and an iPhone, on November 14 (mission 1) and 15 (mission 2). Some things he did changed the game:

- He skipped long text, so the screens became short bullets.
- He played by walking up to machines, so the game gained an action button next to each one.
- He thought the air machine was the crew's house, so the base gained a real habitat.
- He asked how astronauts breathe in a suit, and that became a real NASA fact in the game.

Every observation, the change it caused and its commit are in [`docs/en/PLAYTEST.md`](docs/en/PLAYTEST.md). The log has facts only, with no name, image or voice of the child.

## Accessibility

- Body font: Atkinson Hyperlegible Next, designed for legibility.
- Touch targets of at least 44 px.
- Nothing is told by color alone: icons and words go with every color.
- Reduced motion is respected.
- An assisted mode removes every timer.
- Everything done in 3D can also be done with the bottom bar, the keyboard or a screen reader.

## Run it

Requirements: Node 22 and pnpm (via `corepack enable`).

```bash
pnpm install
pnpm dev          # game at http://localhost:5173
pnpm dev:api      # API at http://localhost:8787 (/health, /space-weather)
pnpm check        # typecheck + lint + tests
pnpm build
node scripts/playthrough.mjs out en world   # plays missions 1 and 2 end to end (Playwright)
```

No API key is needed: DONKI is read from `ccmc.gsfc.nasa.gov` without a key.

## Repository

```
apps/web          React + Vite + three.js game
apps/api          Hono API: /health, /space-weather (DONKI with cache), game mirror
packages/sim      pure game rules, tested first; science.ts holds every constant with its source
packages/content  texts in en and pt-BR, event catalog, data cards, NASA facts
packages/ui       design tokens
tools/data        Python scripts for images and data
docs/en, docs/pt-BR   documentation in both languages
```

Architecture: [`docs/en/ARCHITECTURE.md`](docs/en/ARCHITECTURE.md).

## Use of AI

The game idea, design, playtests and decisions are the team's. Code and docs were written with **Claude Code** (Anthropic) and reviewed by the team. Claude Code was also used to read and check NASA sources. All photos are real NASA images; there are no AI-generated images. Details: [`docs/en/AI_USAGE.md`](docs/en/AI_USAGE.md).

## Privacy

There are no accounts, no analytics and no personal data. The font is hosted with the game, with no request to a font service. The language choice stays on the device.

## Credits

NASA, NASA/JPL-Caltech, CCMC (DONKI), and the partner institutions credited on each image. 3D models: Kenney (CC0). Font: Braille Institute (OFL). Every asset, credit and license: [`docs/en/ASSETS.md`](docs/en/ASSETS.md). This project is not endorsed by NASA.

## License

Code: [MIT](LICENSE). NASA data and images keep their own terms (see ASSETS).
