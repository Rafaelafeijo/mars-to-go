# Mars to Go — Project brief

> Portuguese version: [`docs/pt-BR/PROJECT_BRIEF.md`](../pt-BR/PROJECT_BRIEF.md).

> Tagline: **10 seconds to go.**
> Event: NASA Space Apps Challenge 2026, Universal Event, November 14 and 15, 2026.
> Challenge: **Build a Junior Astronaut Mission Trainer.**
> Team: **Rochette**, mother and son. The name comes from the rock in Jezero Crater sampled by the Perseverance rover (verify against a NASA source).
> Deadline: "Submit for Judging" by Sunday, November 15, 11:59 p.m. (Brasília time).
> Languages: the game is bilingual from the MVP, in Portuguese (language of creation) and English (universal). The code is in English. The documentation exists in English (default) and Portuguese. The project page, the demo and the slides are in English only, as required by the submission guide.
> Before any design decision, check `docs/en/CHALLENGE_CHECKLIST.md`.

---

## 1. What it is

Mars to Go is a mobile-first browser game in which children ages 7 to 12 run a crewed base on Mars, sol by sol, and discover that in space no choice is free: the energy that protects the crew today is the oxygen missing tomorrow.

**The problem the challenge points to:** the public almost never sees the decision logic behind a mission, only the outcome. The game exists to build that understanding of what surviving in these environments really requires.

### Value proposition

**Mars to Go makes a child feel that it is up to them to bring the crew back home, and discover that they can, using math, logic and real NASA data.**

In English: *Mars to Go lets a child feel what it takes to bring a crew home from Mars, and discover that math, logic and real NASA data are how you do it.*

| For whom | What it delivers |
| --- | --- |
| The child | The experience of being capable: they make the astronaut's decision and see the math that backs it |
| The family | A game that does not exploit the child's attention and leaves them talking about science |
| The world | The dream of Mars within reach of a basic phone, with no download and no account |

### The impact we stand for

Keeping alive, in children and teenagers, the dream of knowing the deep universe. The game trains, visibly on screen:

| Skill | Where it shows up |
| --- | --- |
| Logical reasoning | Chain of dependencies between energy, air, food and shield |
| Math | Counting and distributing cells; adding up consumption; comparing reserves |
| Physics and science | Sunlight, atmosphere, radiation, growing crops, radio delay, each with real data |
| Creativity | There is no single winning plan; different strategies work |
| Autonomy | The child decides without Earth when the radio is delayed |
| Courage | Ten seconds to choose and own the consequence |

## 2. Audience

- **Ages 7 to 12**, as the challenge asks. Assisted mode designed for ages 7 to 9.
- **Math:** counting, adding, comparing, multiplying by small numbers.
- **Language:** short sentences; scientific terms explained on the spot, in one sentence.
- **Context:** entry-level phone, screen from 360 px in portrait, unstable network, games of 5 to 8 minutes.

## 3. Principles

1. **No choice is free.** Every option shows what it costs.
2. **Mechanics before visuals.** Simple and true is worth more than pretty and empty.
3. **Three core resources.** Energy, air and food. The rest are actions and events.
4. **Mistakes teach, they don't punish.** Restarting takes seconds.
5. **Dexterity does not block.** Every timer has an assisted mode.
6. **Data with a source.** Every number carries a label, source and date.
7. **Addictive in the right way.** Short games, the urge to try another strategy. No purchases, no random rewards, no punishment for being away.
8. **No account and no personal data.**

## 4. The game

### 4.1 Overview

The crew has landed at Jezero and must keep the base running for **7 sols** until the return window. Each sol is a round of about one minute.

### 4.2 The three resources

| Resource | What it is | How it changes |
| --- | --- | --- |
| **Energy** | 10 cells per sol, the day's budget | Fewer cells when there is dust; never enough for everything |
| **Air** | The crew's oxygen reserve | Goes up with cells in Life Support; goes down every sol and on expeditions |
| **Food** | Food reserve | Goes up slowly with cells in the Greenhouse (plant today, harvest sols later); goes down every sol |

### 4.3 Where to spend the cells (the challenge's five themes)

| Decision | Challenge theme | Gain | Cost |
| --- | --- | --- | --- |
| **Life Support** | Life support | Produces air today | Cells that don't go to the rest |
| **Greenhouse** | Food production | Food a few sols from now | Doesn't help today |
| **Shield** | Radiation shielding | Protects the crew tonight | Cells spent even if the storm doesn't come |
| **Science Expedition** | Trading reserves for science | A discovery at a real site in Jezero | Costs air; no shield out there |
| **Ask Earth** | Communication delay | Advice from mission control | The answer takes time; in a crisis it arrives too late |

Distributing the cells is the **power budgeting** the challenge asks for. No combination fills everything.

### 4.4 One sol, step by step

1. **Sol forecast.** Space weather (a real DONKI event) and dust. The child answers a question: "what do you think will happen if…?".
2. **Distribute the 10 cells.** By dragging or tapping. "The open math" shows the effect of each cell.
3. **Optional action:** science expedition or Ask Earth.
4. **Crisis** (on some sols): ten seconds to decide.
5. **Night.** The sol runs and the consequences appear.
6. **Sol log.** Forecast versus result, the math, the data source and "what if you had…?".

### 4.5 Ten-second crises

| Crisis | Trigger | Decision | Theme |
| --- | --- | --- | --- |
| Solar storm | Real DONKI event | Recall the expedition or continue; divert cells to the Shield | Radiation |
| Dust | Declared scenario | What to turn off with half the energy | Energy |
| Greenhouse failure | Declared scenario | Save the harvest or the air | Food and air |
| Radio silence | Real communication delay | Decide without Earth | Communication |

In assisted mode the timer stops while the child reads. After the crisis, Earth's delayed message arrives saying it saw what happened and trusts them.

### 4.6 End of the mission

- **Everyone came home:** the crew reaches the return window. Result in margin of sols and discoveries made.
- **Early return:** a reserve hit zero. The log shows on which sol the costly decision was made.
- **Play again:** at the end of every mission the game asks "Play this mission again with another plan?". After an early return, it also offers "Go back to the sol where everything changed".
- **Earth in the sky:** the final scene shows Earth as a point of light in the Martian sky, from a real photo taken by a rover.

### 4.7 Replayability

- Each game's events are drawn from a curated catalog of real DONKI events.
- **"Today in space" mode:** the game uses the real space weather of the last few days, fetched live, with the date on screen.
- When it ends, the game suggests a different strategy to try.

### 4.8 Saving without an account

- Progress is saved on the device itself every sol, with a version number so it doesn't break on updates.
- A short **career code** stores unlocked missions, badges, discoveries and the mission in progress; typed on another device, it restores everything. It contains no personal data (ADR-0022).
- Erasing progress is a visible option. The settings screen warns that, without the code, clearing the browser data erases the progress.

### 4.8.1 The journey (ADR-0021)

The game is a career of 7-sol missions, with the same rules and different event lists: mission 1 "First sols" (guided, calm Sun); mission 2 "The May storm" (the real event of 2024-05-20); mission 3 "Dusty sky"; "Surprise me"; "Today in space". Completing the game = full badge wall (the three missions with everyone back, one reference mission and all the discoveries), with the title of commander and a final scene. In mission 1 the destinations unlock gradually (ADR-0019).

### 4.9 Explore and customize

- **Explore the base:** the base screen is a tappable scene. Each module (life support, greenhouse, shield, antenna, panels) opens what it does, how much it consumes and the real data behind it.
- **Explore the environment:** the expedition sites are real places in Jezero, with a real photo and a card.
- **Avatar:** the child chooses a suit color and an emblem, and a codename from a ready-made list. Nothing typed, nothing personal. It enters the MVP only in the simple version; it comes after the core mechanics.

### 4.10 Opening: the descent

A short, non-playable scene that sets up the arrival on Mars with the real numbers from Perseverance's landing. It can be skipped. It is the first thing to simplify if time runs short.

### 4.11 The three moments that carry the emotion

| Moment | Where | What happens |
| --- | --- | --- |
| "You decide" | Crisis with radio silence | Earth doesn't answer in time; the child chooses alone |
| Earth in the sky | Final scene | Earth as a point of light, in a real photo |
| "Everyone came home" | End of the mission | Victory is the whole team back |

## 5. Game evaluation (no stars)

| Element | What it shows |
| --- | --- |
| Margin in sols | "Air and food left over for N sols beyond what was needed" |
| Gauges | Energy, air, food, with words: critical, tight, safe, plenty |
| Crew exposure | Low, medium or high, in a word and an icon |
| Mission control verdict | Early return, at the limit, with margin, reference mission |
| Badge | One per completed mission, with "spot-on forecast" and "unassisted" stripes |
| Discoveries | Real science cards collected on expeditions |

Nothing is communicated by color alone.

## 6. Data

The scientific and mathematical logic is defined and validated **before** the screens: first the data map and the simulation model, then the interface.

### 6.1 Three labels, always visible

| Label | Meaning | On screen |
| --- | --- | --- |
| **Measured** | Real observation, with instrument, place and date | "Measured · DONKI · 10 May 2024" |
| **Scenario** | Parameter assumed for the game's base | "Game scenario" |
| **Simplification** | What the model rounds off or ignores | "Simplified" |

Live data shows "live" and the date of the query. Archive data shows "archive" and the date of the event. Never the other way around. Every piece of data also shows **where** it was measured: Mars, Space Station, Sun, Earth or Moon.

### 6.2 Sources and use

| Source | What it brings | Where it goes | Priority |
| --- | --- | --- | --- |
| **DONKI** (CCMC/NASA) | Solar flares, coronal mass ejections, energetic particles, geomagnetic storms | Sol forecast, solar storm crisis, "Today in space" mode | 1 |
| **RadLab** (OSDR) | Dose rates measured by dosimeters on the Space Station | "How much a shield matters" card, labeled as measured on the Station, not on Mars | 2 |
| **OSDR** | Real astronaut health findings (bone, muscle, sleep, immunity) | Science cards in the log and in discoveries | 2 |
| **Mars Trek** | Real imagery and terrain of Mars | Base site and expedition sites in Jezero, with distances measured in the tool | 2 |
| **MOXIE** (Perseverance) | Oxygen produced from Martian air | Life Support reference, with the scaling declared as scenario | 2 |
| **CSA** (partner) | Material on food production off Earth | Greenhouse facts | 3 |
| **Rover photos** (NASA) | Real images of the surface and sky | Backgrounds, discoveries, Earth in the sky | 3 |

### 6.3 How DONKI comes in

- **Using real space weather is feasible**, with three layers, from the freshest to the safest:
  1. Our server's API queries DONKI, caches it and delivers it to the game ("live").
  2. A scheduled task on GitHub writes a DONKI snapshot into the site itself, one or more times a day ("updated on" with the date).
  3. The built-in curated catalog ("archive").
- The game uses the freshest layer that responds and shows which one it is.
- The Sun may be calm over the weekend. That is why the mission always has events from the catalog, and real weather appears as "Today in space"; if there is a recent event, it enters the game.
- Limit to declare: DONKI records what left the Sun. Whether an event hits Mars depends on direction. Check whether DONKI analyses include a predicted arrival at Mars; if they do, use it.
- The curated catalog has 8 to 12 real events, of different intensities, with identifier, date and class.
- A simple, declared table converts the event class into in-game risk (low, medium, high). This conversion is labeled as a simplification: a solar event record is not a dose on Mars.

### 6.4 The data card for each piece of data (visible on every screen)

Every number on screen has a badge. One tap opens the card:

| Field | Question it answers |
| --- | --- |
| Source | Where did it come from? Link and record identifier |
| Place and date | Where and when was it measured? |
| Processing | What did we do with it? (filter, round, convert, group) |
| Use in the game | What rule or calculation does it feed? |
| Simplification | What did we leave out, and why? |
| Parallel | If it's not from Mars: why does it work and what is different there? |
| I want to understand better | Explanation in kid language, with an everyday example and where this applies outside the game |

Examples of everyday comparisons: power cells like a phone battery; the air reserve like a water bottle on a hike; the shield like sunscreen; radio delay like sending a letter instead of calling.

The cards, the "The science behind" page and a public file for the judges all come from the same place (`science.ts` and the catalog), so they never diverge.

### 6.5 The real Mars and parallels

The MVP takes place on Mars. The planet's own challenges appear in the game, each with a source to verify before it goes in:

| Mars challenge | Effect in the game |
| --- | --- |
| Thin atmosphere, almost all CO₂ | Air has to be produced; Life Support costs energy |
| Less sunlight than on Earth | Only 10 cells per sol |
| Dust storms | Days with fewer cells |
| Intense cold | Part of the energy is fixed for heating the habitat |
| Soil not directly usable for planting | The Greenhouse is closed and slow to yield |
| No global magnetic field and thin air | Radiation reaches the surface; the Shield matters |
| Distance from Earth | Radio delay; deciding alone |

**CSA lunar material.** The set covers food production on the Moon and in remote areas. Using lunar numbers in a Martian base would be a mistake, and adapting everything would be too much effort for the MVP. Decision: use only the general principles of growing crops in a closed environment (recycled water, artificial light, growing time), presented as a parallel and with the difference stated on the card (gravity, light, day length, dust). If the justification cannot be verified in a source, the data stays out.

**Space Station.** RadLab readings and OSDR findings come from low Earth orbit. They enter as parallels, with the card explaining that on Mars the exposure is different.

### 6.6 Honesty rules for data

- A Space Station measurement is not presented as a measurement on Mars.
- MOXIE's peak production is not continuous capacity; the base's equipment is scenario.
- The terrain photo does not reveal every obstacle.
- No number without a row in the constants sheet.

### 6.7 Constants sheet (starting point; verify each one at its source)

| Constant | Value | Label | Status |
| --- | --- | --- | --- |
| Mission length in the game | 7 sols | Scenario | Defined |
| Power cells per sol | 10 | Scenario | Defined |
| Mars atmosphere | 95.1% CO₂ | Measured | Verified (Mars Fact Sheet) |
| MOXIE oxygen | 122 g in total; up to 12 g/h; 16 runs | Measured | Verified (JPL, 2023-09-06) |
| Oxygen breathed | 0.895 kg per person per day (about 1.3 t per year for four people) | Measured | Verified (BVAD, 2022); corrected |
| Earth–Mars radio delay | About 4 to 24 minutes each way | Measured | Verified (NASA); corrected |
| Length of a sol | 24 h 39 min 35 s | Measured | Verified |
| Gravity on Mars | 3.73 m/s² | Measured | Verified (Mars Fact Sheet); corrected |
| Perseverance landing | Entry at about 19,500 km/h; parachute near 11 km | Measured | Verified (press kit); corrected |
| Air produced per cell | 1 unit of air | Scenario | Declared in SIM_MODEL |
| Air spent per expedition | 2 units of air | Scenario | Declared in SIM_MODEL |
| Harvest time | 2 sols | Simplification | Declared; main source Veggie (33 days on the Station) |
| Solar event class → risk | Table from 0 to 3 | Simplification | Declared in SIM_MODEL §5 |

## 7. Visuals and sound

Full decision in ADR-0023 (November 14, 2026).

- **Illustrated world, real photo as proof.** Base, sky, horizon, crew, modules and interface are vector illustration made in code, with palette and silhouettes taken from real photos of Jezero. The real photo appears whole and prominently only in the "this is real" moments (data cards, expedition sites, Earth in the sky), always with a "real photo" badge, credit, mission and date. A real photo may serve as a horizon texture, darkened and with a gradient.
- **Editing.** Brightness, contrast and cropping are allowed. AI enhancement or recreation turns the image into generated content: visible watermark, "illustration" badge (never "real photo") and an entry in AI_USAGE.
- **Its own visual language:** dark background with grain; one warm Mars color as the accent; data badges in a monospaced font, uppercase and spaced out ("MEASURED · DONKI · 20 MAY 2024"); numbers and verdicts in a heavy, wide font, very large; the "MARS TO GO" title in dot-matrix letters, like a control panel; Mars or a base module as a slowly rotating wireframe mesh; thin grid lines between blocks; gauges as cards (icon, big number, pill label: critical, tight, safe, plenty), nothing by color alone; a scrolling text ticker for "Today in space"; languages as abbreviations at the top (PT, EN); a "skip to content" link; smooth transitions between moments and from day to night, turned off with reduced motion. Open-license fonts, recorded in ASSETS.
- **For children:** buttons of 44 px or more, soft corners, visual feedback on every tap, a friendly crew character, color in moments of achievement. Minimalism stays on the decision screens. 4.5:1 contrast for text.
- **Home screen:** text wordmark; three entries, "Play" (the career), "How it works" and "Surprise me"; a rotating word (today you are a Mars pilot, engineer, scientist, farmer); an honest footer (who made it, AI use, where the data comes from).
- **Opening and recording (after phase 4):** an animated scene of 20 to 30 seconds, skippable, with the real screens; automatic recording of the game running for the demo video.
- No text inside images. No NASA logo, insignia or mission identifier. No images of minors.
- **Sound:** off by default, with a button to turn it on; few effects, always with a visual equivalent. Music only under a free license, recorded in ASSETS; no film soundtracks.
- Every image, sound and font goes into `docs/en/ASSETS.md` with origin, credit and license.
- The list of images and the selection flow are in `docs/en/IMAGES.md`.

## 8. Quality targets

| Differentiator | Target |
| --- | --- |
| Mobile first | Playable in portrait from 360 px, with one thumb; 44 px targets |
| Access | Browser, no download, no account |
| Performance | First screen in under 3 s on ordinary 4G |
| Offline | After the first visit, plays without a network using the archive catalog |
| Accessibility | WCAG 2.2 AA on decision screens; screen reader; reduced motion; assisted mode |
| Contrast | 4.5:1 for text, 3:1 for components; high-contrast theme |
| Languages | Full Portuguese and English from the MVP |
| Privacy | No personal data; progress only on the device |

## 9. Architecture

```
mars-to-go/
  apps/
    web/        React + Vite + TypeScript, installable (PWA)
    api/        TypeScript: /health and /space-weather (DONKI with cache and archive)
  packages/
    sim/        game rules and constants in pure TypeScript, with tests
    content/    texts in en and pt-BR; event catalog; data cards; science cards
    ui/         components and design tokens
  tools/
    data/       Python scripts to build the catalog and prepare images
  docs/
    en/  pt-BR/   the same documentation in both languages
      PROJECT_BRIEF  CHALLENGE_CHECKLIST  ARCHITECTURE  DATA_MAP  SIM_MODEL
      SCIENCE  ASSETS  AI_USAGE  IMAGES  SUBMISSION  adr/
    CHALLENGE_STATEMENT.md   official text, English only
  CLAUDE.md
  README.md  README.pt-BR.md
```

### Publishing

| Part | Where | Why |
| --- | --- | --- |
| Game (static site) | **GitHub Pages**, primary address in the submission | Well-known domain, same place as the repository, no server to go down |
| DONKI daily snapshot | Scheduled task in GitHub Actions, writing a file into the site | Recent space weather without depending on a server |
| Live API and game mirror | **Railway**, personal account | Live query with cache; a second address if the first one fails |

Railway is not blocked in the United States, but there are recent reports of the platform's addresses being flagged by the FortiGuard filter, the same one the submission guide cites as a risk for the judges. That is why the game must work fully without the API, and the primary address is not the Railway one.

## 10. Scope and build order

Each row ends with something playable and published.

| Order | Deliverable | When (suggested) |
| --- | --- | --- |
| 0 | **Design and validation, before any screen:** architecture with diagrams, data map, simulation model. Rafaela's approval | Saturday, until 1:30 p.m. (90-minute cap) |
| 1 | Repository, skeleton, publishing (GitHub Pages and Railway), Portuguese and English | Saturday, early afternoon |
| 2 | Tested simulation: 7 sols, 10 cells, air, food | Saturday, afternoon |
| 3 | Playable sol screen with "the open math", the log and the data cards | Saturday, late afternoon |
| 4 | DONKI: archive catalog, API route, labels; solar storm crisis | Saturday, evening |
| 5 | Test with the 8-year-old tester; adjustments | Saturday, evening |
| 6 | Shield, expedition, Ask Earth, radio silence | Sunday, morning |
| 7 | End of mission, play again, mission code, Earth in the sky, badge, science cards (OSDR, RadLab), simple avatar | Sunday, midday |
| 8 | "The science behind" page, accessibility, high contrast | Sunday, early afternoon |
| 9 | Descent opening | Only if there is slack |
| 10 | Video with narration and code on screen, supporting slides, project page, submission | Sunday, from 5 p.m. |

Each row is a phase: it ends with Rafaela's validation, a commit and a tag in the repository.

**Feature freeze at 3 p.m. on Sunday.** Submit by 9 p.m. and use the rest to fix things.

### Cut order

1. The descent opening becomes an image with one sentence.
2. "Today in space" mode is dropped; the archive catalog stays.
3. Crises drop to two: solar storm and radio silence.
4. Avatar and base exploration are dropped.
5. Expedition becomes a single fixed option.

Not cut: distributing cells with a visible cost, the log with the math, DONKI with a label, the data card for each piece of data, both languages, play again.

## 11. The story behind it

The game is built by a developer mother with her 8-year-old son, a NASA fan, as the first tester. She appears in the pitch in one or two sentences, and his test is evidence of use:

- [ ] Time until he understands the first cell distribution without help
- [ ] Where he got stuck and what changed because of it
- [ ] What he did in the first crisis
- [ ] One sentence from him, in his own words: `[to be filled in]`
- [ ] Did he ask to play again?

No full name, face, voice or image of him anywhere in the submission, the repository or the game.

## 12. Risks

| Risk | Response |
| --- | --- |
| Scope larger than the time | Build order and cut order from section 10 |
| Looking like a quiz or a dashboard without a game | Every decision goes through the simulation and changes the following sols |
| Too many resources on screen | Three gauges; the rest are actions |
| DONKI down | Built-in archive catalog, labeled |
| Station data read as Mars data | Place label on every measured value |
| Link blocked for the judges | Primary address on GitHub Pages; Railway as mirror; test in an incognito window; classification request to FortiGuard |
| Parallel without a scientific basis | Without a justification verified at a source, the data doesn't go in |
| Too much time on design | 90-minute cap for phase 0 |
| Going over 30 seconds or 7 slides | Time it before publishing |

## 13. References

### Challenge and rules

- Challenge text: `docs/CHALLENGE_STATEMENT.md`
- Participant FAQs — https://www.spaceappschallenge.org/resources/participant-faqs/
- Team Formation Guide — https://www.spaceappschallenge.org/resources/team-formation-guide/
- Project Submission Guide — https://www.spaceappschallenge.org/resources/project-submission-guide/

### Data pointed to by the challenge

- NASA Open APIs — https://api.nasa.gov/
- DONKI — https://ccmc.gsfc.nasa.gov/tools/DONKI/
- DONKI, API reference — https://ccmc.gsfc.nasa.gov/DONKI/api/
- OSDR — https://osdr.nasa.gov/bio/repo/ and https://science.nasa.gov/biological-physical/data/osdr/
- OSDR, search — https://osdr.nasa.gov/osdr/data/search?term=KEYWORD
- RadLab — https://visualization.osdr.nasa.gov/radlab/gui/data-api/
- Mars Trek — https://trek.nasa.gov/mars/
- CSA, food production — https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/
- CSA, resources for youth — https://www.asc-csa.gc.ca/eng/youth-educators/resources-stem-and-youth-organizations.asp

### Others

- MOXIE (Science Advances) — https://pmc.ncbi.nlm.nih.gov/articles/PMC9432831
- Perseverance landing — https://www.nasa.gov/image-article/perseverance-heat-shield-separates-2/
- NASA Image and Video Library — https://images.nasa.gov/
- Use of NASA images — https://www.nasa.gov/nasa-brand-center/images-and-media/
- Railway, monorepos — https://docs.railway.com/deploy/monorepo
- Railway, plugin for agents — https://github.com/railwayapp/railway-skills
- Claude Code, plugins — https://code.claude.com/docs/en/discover-plugins.md
