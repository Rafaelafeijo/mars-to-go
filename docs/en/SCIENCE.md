# The science behind Mars to Go

> Portuguese version: [`docs/pt-BR/SCIENCE.md`](../pt-BR/SCIENCE.md). Updated 2026-11-15 to match the game as it is now (missions 1 and 2, ADR-0033 to ADR-0035). Full per-data-point detail is in [`DATA_MAP.md`](DATA_MAP.md). Every game number is in `packages/sim/src/science.ts`; every card text is in `packages/content/src/cards.ts` and `facts.ts`. Photo credits are in [`ASSETS.md`](ASSETS.md).

## 1. Three labels

| Label | Meaning |
| --- | --- |
| **Measured** | A real observation, with instrument, place and date |
| **Scenario** | A value we assumed for our imaginary base |
| **Simplification** | Something the model rounds or leaves out, on purpose, and says so |

Static data is never shown as live. The game has no live call: the space weather on the home screen is a dated copy of DONKI saved twice a day ([`DATA_MAP.md`](DATA_MAP.md) D5), and every mission event is from a bundled archive with its own date.

## 2. Mars first

The game happens in Jezero Crater, Mars. Every data point says where it was measured: Mars, International Space Station (ISS), Sun, Earth or Moon. Data not measured on Mars enters only as a **declared parallel**, listed in section 4 with its justification (checklist K3). If a parallel is not listed here, it is not in the game.

## 3. Measured on Mars

All labeled **measured**, place **Mars**. Note the site: not everything was measured in Jezero.

| What the game says | Source | Place | Used in |
| --- | --- | --- | --- |
| Air 95.1% CO₂; pressure 6.36 mb | NASA Mars Fact Sheet (NSSDCA, updated 2025-05-19) — https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html | Mars (global) | Air, Life Support cards; sol 1 fact |
| Sunlight 586.2 W/m², 0.431 of Earth's | same | Mars (mean) | Power cells card |
| Average −59 °C | same | Mars (global) | Heating card |
| Daily range −89 to −31 °C | same: "Viking 1 Lander site" | **Viking 1 Lander site, not Jezero** | Thermometer; sol 4 fact |
| Gravity 3.73 m/s² | same | Mars | Greenhouse card (0.38 of Earth's) |
| Sol = 24.6597 h (24 h 39 min 35 s); "40 minutes longer" is rounded | same | Mars | Sol card |
| No global magnetic field today | NASA Science, Mars Facts — https://science.nasa.gov/mars/facts/ | Mars | Shield card; sol 3 fact |
| Soil has perchlorate salts harmful to most life | NASA Science — https://science.nasa.gov/biological-physical/investigations/efri-elis-kpmsg/ | Mars | Greenhouse card |
| Calm-day radiation ~210 μGy/day (Curiosity RAD) | NASA PIA17600 (2013-12-09) — https://science.nasa.gov/resource/radiation-measurements-on-mars/ | **Gale Crater** | Shield card (in no formula) |
| May 20, 2024 storm: an astronaut next to Curiosity "would have received" 8,100 μGy ≈ 30 chest X-rays; flare later estimated X12; biggest RAD surge since landing | NASA/JPL release 2024-080 (2024-06-10) — https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/ · Gale from https://science.nasa.gov/mission/msl-curiosity/ | **Gale Crater** | Mission 2 sol 7 (risk 3); sol 7 fact of mission 1; crisis card |
| 2018 dust storm: tau 10.5, Opportunity 21 Wh | NASA Science, "On Mars, Light Is Energy" (2018-06-13) — https://science.nasa.gov/resource/on-mars-light-is-energy/ | Opportunity's site, not Jezero | Dust card |
| MOXIE made 122 g of O₂ from Mars air, up to 12 g/h, 16 runs (2021–2023) | NASA/JPL (2023-09-06) — https://www.jpl.nasa.gov/news/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/ | Jezero | Life Support card; sol 1 fact |
| Sky yellow to orange by day, blue near the Sun at sunset; Sun ~2/3 the size seen from Earth | NASA Science, "What Do Sunrises and Sunsets Look Like on Mars?" — https://science.nasa.gov/solar-system/planets/mars/what-does-a-sunrise-sunset-look-like-on-mars/ | Mars (rover images) | 3D sky colors; "Look at the sky" fact |
| Delta front ~2.3 km west of the landing site | NASA/JPL PIA24485 (2021-03-05) — https://www.jpl.nasa.gov/images/pia24485-perseverance-view-of-the-delta-in-jezero-crater/ | Jezero | Far rover trip (ADR-0035) |
| Why the delta: "clear evidence that a large lake once filled the crater"; fine rocks at its base are the best bet for signs of ancient life | NASA/JPL, "NASA's Perseverance Rover Arrives at Delta for New Science Campaign" — https://www.jpl.nasa.gov/news/nasas-perseverance-rover-arrives-at-delta-for-new-science-campaign/ | Jezero | Delta-front card |
| Perseverance seals rock cores in tubes: 43 tubes, 38 for samples, for a future return | NASA Science, Mars Rock Samples — https://science.nasa.gov/mission/mars-2020-perseverance/mars-rock-samples/ | Jezero | Samples card (`SAMPLES_GOAL`, scenario) |
| First spacesuit materials on Mars, incl. a helmet-visor piece, on SHERLOC's calibration target | NASA/JPL PIA24033 — https://www.jpl.nasa.gov/images/pia24033-spacesuit-materials-on-perseverances-sherloc-calibration-target/ · photo PIA26520 | Jezero (on the rover) | Mission 2 sol 1 fact |
| Real photos: Jezero (PIA24921, PIA23239 from orbit), Rochette (PIA24840), Kodiak (PIA24802), delta front (PIA24925); Gale sunset (PIA19400) and Earth from Mars (PIA17936) | NASA Photojournal; rows 1–8 of [`ASSETS.md`](ASSETS.md) | Jezero; **Gale** for PIA19400 and PIA17936 | Home, facts, rover sites, end screen |

## 4. Declared parallels (not measured on Mars)

Each entry: **what** · **source** · **place** · **label** · **why it works for Mars** · **what differs on Mars**.

### ISS

**P1. Lettuce grew for 33 days (Veggie, VEG-01)**
- Source: NASA Veggie fact sheet — https://www.nasa.gov/wp-content/uploads/2019/04/veggie_fact_sheet_508.pdf · Place: ISS, 2014–2015 · Label: measured; the game's 2-sol wait is a simplification.
- Why: a closed chamber with lamps, water and controlled air, far from Earth's fields, like a Mars greenhouse.
- Differs on Mars: sunlight ~43% of Earth's; gravity 0.38 g, not microgravity; soil with perchlorate (section 3). Only the principle "plant today, eat later" is used.

**P2. Photo of plants in the Advanced Plant Habitat**
- Source: images.nasa.gov `iss072e404269` (2024-12-27) · Place: ISS · Label: real photo, badge "International Space Station (parallel)".
- Why: shows what a closed growth chamber looks like. Differs on Mars: as P1.

**P3. Pink grow lights in the 3D greenhouse (Veggie's LEDs)**
- What: the 3D greenhouse lamp is drawn pink/magenta, "from red and blue LEDs", after the LED-lit Veggie chamber (code comment in `apps/web/src/world/Scene3D.tsx`). It is a visual choice, not a number, and no text on screen states it.
- Source: NASA, "Growing Plants in Space" (https://www.nasa.gov/exploration-research-and-technology/growing-plants-in-space/, page updated 2023-12-08, read 2026-11-14): "Since plants reflect a lot of green light and use more red and blue wavelengths… the Veggie chamber typically glows magenta pink." (The Veggie fact sheet does not name the colors.)
- Why: a Mars greenhouse would also need artificial light. Differs on Mars: some sunlight is available (43% of Earth's), and dust can dim it.

### Moon

**P4. Apollo 15 rover photo**
- Source: images.nasa.gov `AS15-88-11901` (1971-07-31 to 08-02) · Place: Moon, Hadley-Apennine · Label: real photo, captioned as the Moon.
- Why: a rover lets astronauts travel farther from their lander, as the game's rover does. Differs on Mars: a thin CO₂ atmosphere (the Moon has none), dust storms, and 0.38 g of Earth's gravity.

**P5. Walks of about 2 km, because the suit must have air to walk back**
- Source: NASA, "Exploration EVA Testing and Analogs", NTRS 20210000827 — https://ntrs.nasa.gov/citations/20210000827 · Place: Moon planning · Label: planning value, shown as a Moon parallel in the fact title.
- Why: the walk-back rule is about suit consumables, which apply on any surface. Differs on Mars: NASA's figure is for the Moon; the game does not claim it as a Mars number. It explains the edge warning and the far-trip cost (3 air, 2 points: game values).

### Earth

**P6. Liquid oxygen storage tank, Kennedy Space Center**
- Source: images.nasa.gov `KSC-20191108-PH-JBS01_0049` (2019-11-08) · Place: Earth, Launch Pad 39B · Label: real photo, caption "Not on Mars".
- Text source: NASA Glenn, "Liquefaction and Storage of In-Situ Oxygen on the Surface of Mars", NTRS 20160004210 — https://ntrs.nasa.gov/citations/20160004210 (a design study for Mars).
- Why: storing oxygen as a cold liquid works the same way. Differs on Mars: the tank in the photo holds rocket propellant on Earth; on Mars the oxygen would be made from CO₂ and kept cold in a −59 °C average environment.

**P7. Stirling power converter test unit, NASA Glenn**
- Source: images.nasa.gov `GRC-2015-C-06315` (library date 2016-11-09) · Place: Earth, Cleveland, Ohio · Label: real photo; caption says no reactor is in the photo.
- Text source: NASA Mars Design Reference Architecture 5.0, NASA-SP-2009-566 — https://www.nasa.gov/pdf/373665main_NASA-SP-2009-566.pdf (a 30 kW nuclear plant ~1 km from the base: a plan, not a measurement).
- Why: it is a ground test of the hardware such a plant would use. Differs on Mars: never built or run on Mars; our base uses solar cells (game scenario).

**P8. Apollo spacesuit backpack (PLSS) photo**
- Source: images.nasa.gov `S68-34582` (1968) · Place: Earth (NASA Johnson record) · Label: real photo.
- Why: a suit backpack gives and cleans air the same way anywhere. Differs on Mars: a Mars suit would face dust, cold and CO₂ air outside.

**P9. How astronauts breathe in a suit**
- Source: NASA-STD-3001 Technical Briefs, Carbon Dioxide OCHMO-TB-004 (pp. 10–11) — https://www.nasa.gov/wp-content/uploads/2023/03/co2-technical-brief-ochmo.pdf — and ECLSS OCHMO-TB-002 (p. 18) · Place: Earth (NASA standard and suit hardware) · Label: engineering fact, shown as text only (no number).
- What the game says: pure oxygen flows into the helmet from behind the head, over the face and down the suit; the backpack removes CO₂ (headaches and tiredness if it builds up) and moisture, and sends the oxygen around again. The CO₂ brief states that the PLSS uses LiOH or METOX cartridges and that the helmet vent diffuses incoming gas over the face (both re-read on 2026-11-15).
- Suit pressure: the ECLSS brief (OCHMO-TB-002 Rev A, p. 18) says "The PLSS maintains a pure O2 atmosphere at approximately 4.2 psi" (verified, read in full 2026-11-15). The number is **not shown in the game**; the fact only says "pure oxygen".
- Why: the same suit physics applies on Mars. Differs on Mars: outside air is CO₂ at ~6 mb, so the suit must hold all its own pressure and oxygen.

**P10. Crew oxygen use 0.895 kg per person per day**
- Source: NASA BVAD, NASA/TP-2015-218570/REV2, Table 3-31 — https://ntrs.nasa.gov/citations/20210024855 · Place: Earth (human data) · Label: measured.
- Why: people breathe the same on Mars. Differs on Mars: nothing for breathing; the game uses game units, not kg.

**P11. Radio delay ~4 to ~24 min one way**
- Source: NASA, "Space Communications: 7 Things You Need to Know" (2020-10-06) — https://www.nasa.gov/centers-and-facilities/goddard/space-communications-7-things-you-need-to-know/ · Label: measured; the 8-min round trip is derived (simplification).
- Why: it is about the Earth–Mars distance itself. Differs: the game squeezes the wait into one night.

**P12. NASA career dose limit 600 mSv**
- Source: NASA-STD-3001 Vol. 1, §4.8.2 (keeps the extra cancer risk below 3%) · Place: Earth (NASA standard) · Label: the game's `DOSE_LIMIT = 2` points is a simplification.
- Used **only as the idea** behind the game's dose limit (ADR-0033). Game points are not millisieverts, no dose is computed, and the real limit covers a career, not a week.

**P13. Solar particles damage electronics**
- Source: NASA SVS 31248 — https://svs.gsfc.nasa.gov/31248: energetic particles can "damage critical electronics" and "degrade solar arrays" · Place: near-Earth spacecraft · Label: the 1 cell per point (max 2) is a simplification.
- Why: Mars has no global magnetic field, so the base's machines are even more exposed. Differs: real damage can last longer or be repaired.

### Sun

**P14. DONKI flares and CMEs, seen from near Earth**
- Source: NASA CCMC DONKI — https://ccmc.gsfc.nasa.gov/DONKI/ (GOES for flares; SOHO, STEREO-A coronagraphs for CMEs) · Place: Sun, seen from Earth's side · Label: measured (event).
- Why: Earth and Mars share the same Sun. Differs on Mars: a flare seen from Earth may not face Mars, so a flare alone never raises the dose (the Antenna answers "Earth does not know").

**P15. WSA-ENLIL arrival forecasts at Mars**
- Source: DONKI WSA-ENLIL runs (IDs in DATA_MAP D2) · Label: **model prediction**, shown as "forecast by a NASA model", never as a measurement.
- Why: the model follows the CME through the solar system and names Mars. Differs: a forecast can be wrong; two mission-2 CMEs were forecast at the spacecraft Psyche, not Mars (false alarms).

**P16. SDO image of the X8.7 flare**
- Source: NASA SVS 14592 (2024-05-14), enhanced color · Place: Sun from Earth orbit · Caption says when it is not the sol's own flare.

## 5. Not used any more (or never shown)

- **CSA lunar food material:** not used. No lunar number is presented as Martian (K4).
- **ISS dosimeters (RadLab / OSDR):** no number on screen (ADR-0026).
- **OSDR astronaut health studies:** not in the game (cut, ADR-0031).
- **Mars Trek:** not used; the orbital view is the photo PIA23239.
- **JPL "0.67 mSv/day" (2013) and the entry-speed facts:** recorded in DATA_MAP, not shown.

## 6. What the game does not model

- No dose is computed for Mars. Exposure is game points with words (low 0–1, medium 2, high above 2). The limit of 2 points ends the mission (ADR-0033); it stands for the idea of P12, not its value.
- Power cells, air units and food units are game units, not watts or kilograms.
- Time is compressed: plants take 2 sols; a CME arrives the same night; Earth answers the same night.
- Distance changes cost only for the delta front (2.3 km, PIA24485): 3 air and 2 points instead of 2 and 1 (game values, ADR-0035). Terrain is not modeled.
- The crisis gives 10 seconds (game rule); real crews would have minutes and written procedures.
