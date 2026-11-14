# The science behind Mars to Go

> Portuguese version: [`docs/pt-BR/SCIENCE.md`](../pt-BR/SCIENCE.md). Every source below was read on 2026-11-14. Full per-data-point detail is in [`DATA_MAP.md`](DATA_MAP.md); every game number is in `packages/sim/src/science.ts`.

## 1. Three labels

| Label | Meaning |
| --- | --- |
| **Measured** | A real observation, with instrument, place and date |
| **Scenario** | A value we assumed for our imaginary base |
| **Simplification** | Something the model rounds or leaves out, on purpose, and says so |

Static data is never shown as live. Live data shows the time it was fetched; archived data shows the date of the event.

## 2. Mars first

The game happens in Jezero Crater, Mars. Every data point says where it was measured: Mars, International Space Station (ISS), Sun, Earth or Moon. Data not measured on Mars enters only as a **declared parallel**, with the justification below (checklist K3). If a parallel has no justification here, it is not in the game.

## 3. Declared parallels

### P1. Solar events recorded near Earth → risk at Mars
- **Data:** DONKI flares, CMEs and SEPs (instruments at or near Earth: GOES, SOHO, STEREO-A).
- **Why it works for Mars:** Earth and Mars share the same Sun; an eruption sends light and particles into the solar system. DONKI's WSA-ENLIL model predicts arrivals at Mars too.
- **What differs on Mars:** a flare seen from Earth may not face Mars; Mars has no global magnetic field and a thin atmosphere. NASA: the light arrives first, the particles follow in tens of minutes, and "Only the most energetic can reach the surface to be measured by RAD." — https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/
- **How the game handles it:** each catalog event stores whether it reached Mars, with evidence (model prediction or Mars measurement). Risk numbers are a declared simplification, never a dose.

### P2. Plants grown on the ISS → the Mars greenhouse
- **Data:** NASA Veggie: red romaine lettuce grew for 33 days on the ISS — https://www.nasa.gov/wp-content/uploads/2019/04/veggie_fact_sheet_508.pdf
- **Why it works for Mars:** both are closed chambers with artificial light, water and controlled air, far from Earth's fields.
- **What differs on Mars:** sunlight is ~43% of Earth's (NASA Mars Fact Sheet); gravity is 0.38 of Earth's, not microgravity; Martian soil contains perchlorate salts harmful to most life — https://science.nasa.gov/biological-physical/investigations/efri-elis-kpmsg/
- **How the game handles it:** only the principle "plant today, eat later" is used; the 2-sol delay is a declared simplification.

### P3. CSA lunar food-production material → general principles only
- **Data:** Canadian Space Agency toolkit "Food production on the Moon and in remote areas" — https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/
- **Use:** general principles of closed-environment growing (recycled water, artificial light, growth time). **No lunar number is presented as Martian** (checklist K4). Facts are cited with a link; no third-party text is copied.

### P4. ISS dosimeters (RadLab) — out of the MVP for now
- Not used on screen until the grouping of RadLab readings is understood (ADR-0026). If it enters, it will say: measured on the ISS, inside Earth's magnetic field; Mars has none.

## 4. Measured on Mars

| Fact | Source |
| --- | --- |
| Atmosphere 95.1% CO₂; surface pressure 6.36 mb | NASA Mars Fact Sheet — https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html |
| Sunlight 586.2 W/m² (0.431 of Earth) | same |
| Average temperature ~−59 °C; daily range −89 to −31 °C | same |
| Gravity 3.73 m/s² | same |
| Sol = 24 h 39 min 35 s | same |
| No global magnetic field | https://science.nasa.gov/mars/facts/ |
| Background radiation ~210 μGy/day (Curiosity RAD, Gale Crater) | https://science.nasa.gov/resource/radiation-measurements-on-mars/ |
| 2024-05-20 event: an astronaut next to Curiosity would have received 8,100 μGy (≈ 30 chest X-rays) | https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/ |
| 2018 dust storm: tau 10.5; Opportunity down to 21 Wh | https://science.nasa.gov/resource/on-mars-light-is-energy/ |
| MOXIE made 122 g of oxygen from Mars air, up to 12 g/h, 16 runs | https://www.jpl.nasa.gov/news/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/ |
| Jezero delta 2.3 km west of the landing site | https://www.jpl.nasa.gov/images/pia24485-perseverance-view-of-the-delta-in-jezero-crater/ |

## 5. Measured on Earth, about people

| Fact | Source |
| --- | --- |
| A crew member uses 0.895 kg of oxygen per day | NASA BVAD, NASA/TP-2015-218570/REV2 — https://ntrs.nasa.gov/citations/20210024855 |
| Radio delay Earth–Mars ~4 to ~24 min one way | https://www.nasa.gov/centers-and-facilities/goddard/space-communications-7-things-you-need-to-know/ |

## 6. What the game does not model

- No dose is computed for Mars; exposure is a word (low, medium, high).
- No medical threshold ends the mission.
- Power cells, air units and food units are game units, not watts or kilograms.
- Time is compressed: plants take 2 sols, Earth answers the same night.
- Terrain does not change expedition cost; only the delta distance (2.3 km) is shown.
