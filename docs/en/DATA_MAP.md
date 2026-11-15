# Data map — Mars to Go

> Status: **approved 2026-11-14 (Phase 0)**; updated 2026-11-15 to match the game now (missions 1 and 2, ADR-0033 to ADR-0035). One entry per data point the game shows or uses. Anything marked **pending** is hidden from screens (ADR-0024). Entries the game no longer uses are kept at the end, marked **not used**, so the trail stays honest.
> Portuguese version: [`docs/pt-BR/DATA_MAP.md`](../pt-BR/DATA_MAP.md). Sources accessed 2026-11-14 unless noted. Code sources of truth: `packages/sim/src/science.ts` (numbers), `packages/content/src/catalog.ts` (events), `cards.ts` (data cards), `facts.ts` (facts of the sol and the NASA sources list).
> Labels: **measured** (real observation), **scenario** (assumed for our base), **simplification** (what the model rounds or leaves out). Mode: **live** (fetched now), **snapshot** (saved by the Pages workflow), **archive** (bundled).

Each entry: **Source / record** · **Route / fields** · **Place, date** · **Treatment** · **Game use** · **Label · mode** · **Mars parallel** · **For kids** · **Validation**.

---

## 1. Space weather (DONKI)

Base: `https://ccmc.gsfc.nasa.gov/DONKI/WS/get/` — no key, CORS `*` (ADR-0027). Verified with real calls on 2026-11-14; mission 2 records checked on 2026-11-15.

### D1. Solar flare
- **Source / record:** DONKI FLR. Records in the game: `2024-05-10T00:10:00-FLR-001` (M1.3, peak 00:13Z, https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/30665/-1) and `2024-05-14T16:46:00-FLR-001` (X8.7, peak 16:51Z, AR 13664, https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/30849/-1).
- **Route / fields:** `FLR?startDate&endDate` → `flrID, classType, beginTime, peakTime, sourceLocation, activeRegionNum, link`
- **Place, date:** measured at Earth orbit (GOES X-ray sensor) about the Sun; event date
- **Treatment:** keep class letter + number; map to game risk (D6)
- **Game use:** forecast of the sol (mission 1 sol 3: M1.3, risk 1; mission 2 sol 1: X8.7, risk 2). `reachesMars: 'unknown'`: a flare alone never raises the dose; the Antenna answers "Earth does not know" (ADR-0033).
- **Label · mode:** measured (event); risk = simplification · archive
- **Mars parallel:** the Sun is the same for Earth and Mars, but a flare seen from Earth may not face Mars. The card says so (checklist K6).
- **For kids:** "A flare is a giant flash on the Sun. Its light reaches Mars first; tiny fast particles come tens of minutes later. Only the strongest particles get through the air of Mars to the ground."
- **Source for light vs particles (NASA wording, approved):** NASA/JPL release 2024-080 (2024-06-10): the X-rays and gamma rays "arrived first", the charged particles reached Mars "in just tens of minutes", "Only the most energetic can reach the surface to be measured by RAD." — https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/
- **Validation:** route ✅ · both records ✅ · light vs particles ✅

### D2. Coronal mass ejection (CME) and Mars arrival
- **Source / record:** DONKI CME + WSA-ENLIL simulation with `impactList[].location = "Mars"`.
- **Route / fields:** `CME`, `CMEAnalysis?mostAccurateOnly=true`, `WSAEnlilSimulations` → `activityID, startTime, speed, impactList{location, arrivalTime, isGlancingBlow}`
- **Place, date:** coronagraphs (SOHO, STEREO-A) about the Sun; arrival at Mars is a **model prediction**, not a measurement
- **Treatment:** event reaches Mars = a WSA-ENLIL run lists Mars; speed = DONKI's most accurate analysis; glancing blows kept as a flag
- **Label · mode:** CME measured; Mars arrival = model prediction (shown as "forecast by a NASA model") · archive
- **Mars parallel:** direct — the prediction is about Mars itself.
- **For kids:** "Sometimes the Sun throws a cloud of particles into space. Scientists use a computer model to guess which planets it will hit, like a weather forecast for space."

CMEs in the game (all `risk 2`):

| Mission · sol | CME record (DONKI page) | Speed used | WSA-ENLIL run | Forecast | `reachesMars` · `fast` |
| --- | --- | --- | --- | --- | --- |
| 1 · sol 5 | `2024-05-11T01:36:00-CME-001` (CME/30719) | 1,263 km/s | WSA-ENLIL/30726/1 | Mars 2024-05-13T17:42Z, not glancing | true · false (mission 1 is guided, no crisis) |
| 2 · sol 3 | `2024-05-13T09:12:00-CME-001` (CME/30814), full halo | 1,456 km/s | WSA-ENLIL/30822/1 | Mars 2024-05-16T18:09Z, not glancing | true · true |
| 2 · sol 5 | `2024-05-14T17:30:00-CME-001` (CME/30873), after the X8.7 flare | 1,199 km/s | WSA-ENLIL/30872/1 | Mars 2024-05-17T15:08Z, not glancing | true · true |
| 2 · sol 6 | `2024-05-16T13:38:00-CME-001` (CME/30936) | 1,452 km/s | WSA-ENLIL/30963/1 | Mars 2024-05-19T09:15Z | true · true |
| 2 · sol 2 | `2024-05-14T17:48:00-CME-001` (CME/30883) | 1,292 km/s | WSA-ENLIL runs | **Psyche, not Mars** (false alarm) | false · false |
| 2 · sol 4 | `2024-05-15T14:53:00-CME-001` (CME/30948) | 1,570 km/s | WSA-ENLIL runs | **Psyche, not Mars** (false alarm) | false · false |

- **Game use:** the forecast of the sol; the Antenna's answer about tomorrow; what the shield must block. Unblocked points raise the dose and cost cells the next sol (ADR-0033).
- **Validation:** all six records ✅ (checked in DONKI 2026-11-15) · DONKI page links in each card

### D2a. "Fast CME" game rule (ADR-0034)
- **Rule:** a CME is `fast` when DONKI's most accurate speed is **≥ 1,000 km/s** and a WSA-ENLIL run gives a Mars arrival. Every fast event that reaches Mars brings the 10-second crisis (`CRISIS_SECONDS`, scenario). The May 20 storm (D7) is also `fast`.
- **Label:** simplification (the threshold is ours, not a NASA class).
- **Note:** the false alarms are fast too, but `fast` stays false because they do not reach Mars. Mission 1 keeps its CME at `fast: false` (guided mission, no crisis).
- **For kids:** "1,452 km/s means it could cross Brazil from north to south in about 3 seconds."

### D3. Solar energetic particles (SEP)
- **Source / record:** DONKI SEP
- **Route / fields:** `SEP` → `sepID, eventTime, instruments, link`
- **Game use:** only the **count** in "The Sun this week" (D5). No DONKI SEP drives a mission: the risk-3 event is the Mars measurement (D7).
- **Label · mode:** measured · snapshot
- **Mars parallel:** DONKI SEPs are measured near Earth; only a Mars instrument confirms Mars.
- **Validation:** route ✅

### D4. Geomagnetic storm (GST)
- **Game use:** **not used** (approved). Kp is an Earth index; Mars has no global magnetic field.

### D5. "The Sun this week" (home screen)
- **Source:** `scripts/donki-snapshot.mjs` calls `FLR`, `CME` and `SEP` for the last 7 days and writes `apps/web/public/data/space-weather.json` (`updatedAt`, `range`, lists). It runs in `.github/workflows/pages.yml` on every push to `main` and **twice a day** (cron `17 6,18 * * *`). If DONKI fails, it writes nothing.
- **Treatment:** count flares, CMEs and SEPs; pick the strongest flare by class; show the copy's date and **UTC time** ("Updated … · copied from NASA twice a day").
- **Game use:** home screen only (`apps/web/src/screens/SunThisWeek.tsx`). It does not enter the missions. If the file is missing, the panel is hidden.
- **Label · mode:** measured · **snapshot**, never shown as live. The game itself makes no live call; the API's `/space-weather` route (Railway) is not used by the game screens.
- **Reading of the week:** "busy" if any flare reached class M5 or more (NOAA Space Weather Scales, radio blackout R2 "moderate" or higher) or any solar particle event (SEP) was recorded that week; otherwise "calm". Shown as one sentence under the numbers ("A calm week on the Sun" / "A busy week on the Sun"); the rule is in `SunThisWeek.tsx`.
- **Validation:** ✅

### D6. Event → game risk table
- **Source:** our rule — SIM_MODEL §5; card `riskTable`
- **Rule:** no event or C flare → 0; M flare → 1; X flare, or a CME with a WSA-ENLIL Mars arrival → 2; particle event measured at Mars → 3.
- **Label:** simplification. A risk number is not a dose.
- **For kids:** "We turned each real event into 0, 1, 2 or 3 so you can plan. Real scientists use much more detail."
- **Validation:** ✅ in use

---

## 2. Radiation (NASA articles)

### D7. Curiosity RAD on the Mars surface — the May 20, 2024 event
- **Source / record:** NASA/JPL, "NASA Watches Mars Light Up During Epic Solar Storm" (2024-06-10, release 2024-080): "a solar flare later estimated to be an X12"; "If astronauts had been standing next to NASA's Curiosity Mars rover at the time, they would have received a radiation dose of 8,100 micrograys", "equivalent to 30 chest X-rays"; "the biggest surge measured by Curiosity's Radiation Assessment Detector, or RAD, since the rover landed 12 years ago." https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/
- **Catalog id:** `NASA-2024-080-MARS-2024-05-20` (not a DONKI record), class label X12, `risk 3`, `reachesMars: true`, `fast: true`.
- **Place, date:** Curiosity, **Gale Crater**, Mars, 2024-05-20. Gale from NASA's Curiosity page: "Curiosity explores Gale Crater" — https://science.nasa.gov/mission/msl-curiosity/
- **Treatment:** NASA's number shown as written, framed as NASA frames it (would have received). Not in any formula.
- **Game use:** mission 2 sol 7 (risk 3 + crisis); mission 1 sol 7 fact; cards `evt-may-2024` and `crisis`.
- **Label · mode:** measured, **Mars** · archive
- **Mars parallel:** none needed (Gale, not Jezero; the card says so).
- **Validation:** ✅

### D8. Mars background radiation
- **Source:** NASA PIA17600 (2013-12-09): "about 210 micrograys per day" — https://science.nasa.gov/resource/radiation-measurements-on-mars/
- **Game use:** Shield card only. **Not in any formula.**
- **Label · mode:** measured, Mars (Gale) · archive
- **Validation:** ✅

### D9. Dose limit idea (parallel)
- **Source:** NASA-STD-3001 Vol. 1, §4.8.2: career limit 600 mSv (extra cancer risk below 3%).
- **Game use:** the idea behind `DOSE_LIMIT = 2` points (exposure card). Game points are not mSv.
- **Label:** simplification · Place: Earth (NASA standard). Justification in SCIENCE.md P12.

### D10. Radiation damages electronics (parallel)
- **Source:** NASA SVS 31248 — https://svs.gsfc.nasa.gov/31248: particles can "damage critical electronics" and "degrade solar arrays".
- **Game use:** `RADIATION_DAMAGE_CELLS_PER_POINT = 1`, `RADIATION_DAMAGE_MAX_CELLS = 2` (card `radiationDamage`).
- **Label:** simplification · Place: near-Earth spacecraft. Justification in SCIENCE.md P13.

---

## 3. Mars environment (brief §6.5)

All from NASA Mars Fact Sheet (last updated 2025-05-19) — https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html — unless noted. Label: measured, Mars. Mode: archive.

| ID | Fact (source wording) | Game use | For kids | Validation |
| --- | --- | --- | --- | --- |
| M1 | Atmosphere CO₂ 95.1%; surface pressure 6.36 mb | Why air must be made → Life Support costs cells; sol 1 fact | "Mars air is almost all the gas we breathe *out*. We must make our own oxygen." | ✅ |
| M2 | Solar irradiance 586.2 W/m² (ratio 0.431) | Why only 10 cells (`CELLS_PER_SOL`, scenario) | "Sunlight on Mars is less than half of Earth's." | ✅ |
| M3 | 2018 dust storm: tau 10.5 on 2018-06-10, Opportunity 21 Wh — https://science.nasa.gov/resource/on-mars-light-is-energy/ | Dust card (`CELLS_DUST_SOL` = 6). No dust sol in missions 1 and 2. | "Opportunity got so little power it went to sleep." | ✅ |
| M4 | Average −59 °C; daily range −89 to −31 °C **at the Viking 1 Lander site** | Heating: 3 fixed cells; thermometer; sol 4 fact names Viking 1 | "Colder than any freezer at home." | ✅ |
| M5 | Soil "contains perchlorate salts at concentrations harmful or fatal to most forms of life" — https://science.nasa.gov/biological-physical/investigations/efri-elis-kpmsg/ | Greenhouse card | "Mars dirt has salts that hurt plants." | ✅ |
| M6 | Gravity 3.73 m/s² (ratio 0.380) | Greenhouse card parallel | "You would weigh about a third." | ✅ |
| M7 | "Mars has no global magnetic field today" — https://science.nasa.gov/mars/facts/ | Shield card; sol 3 fact | "Mars lost its bubble." | ✅ |
| M8 | Sol = 24.6597 h | Sol card; "40 min longer" (simplification) | "A sol is a day on Mars." | ✅ |
| M9 | Radio delay ~4 to ~24 min one way — https://www.nasa.gov/centers-and-facilities/goddard/space-communications-7-things-you-need-to-know/ | Ask Earth answers at night; off in the crisis (≥ 8 min round trip) | "Like a voice message." | ✅ |
| M10 | Mars sky "yellow to orange", blue near the Sun at sunset; Sun ~2/3 the size seen from Earth (`SUN_SIZE_FROM_MARS_RATIO` 0.67) — https://science.nasa.gov/solar-system/planets/mars/what-does-a-sunrise-sunset-look-like-on-mars/ | 3D sky colors, Sun size, "Look at the sky" fact | — | ✅ |

## 4. Life support, food and the suit

### L1. MOXIE
- **Source:** JPL (2023-09-06): "a total of 122 grams of oxygen", "16 times", "12 grams of oxygen an hour" — https://www.jpl.nasa.gov/news/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/
- **Place, date:** Jezero, Mars, 2021–2023 · photo PIA24203 (on Earth, before launch)
- **Game use:** proves oxygen can be made from Mars air with power → `AIR_PER_LIFE_SUPPORT_CELL` (scenario); sol 1 fact
- **Honesty rule:** MOXIE's peak is not continuous capacity.
- **Validation:** ✅

### L2. Crew oxygen use
- **Source:** NASA BVAD, NASA/TP-2015-218570/REV2, Table 3-31: 0.895 kg per crew member per day — https://ntrs.nasa.gov/citations/20210024855
- **Game use:** explains `AIR_USE_PER_SOL` (game units); "about 25 kg for our crew over 7 sols" in the Air card
- **Place:** Earth (human data) · **Validation:** ✅

### L3. Plants take time
- **Source:** NASA Veggie fact sheet: red romaine "grew for 33 days" (VEG-01, ISS) — https://www.nasa.gov/wp-content/uploads/2019/04/veggie_fact_sheet_508.pdf · photo `iss072e404269` (Advanced Plant Habitat, ISS, 2024-12-27)
- **Game use:** `GREENHOUSE_DELAY_SOLS = 2` — simplification; sol 2 fact
- **Mars parallel:** SCIENCE.md P1–P3. CSA material is **not used**.
- **Validation:** ✅

### L4. Rock samples
- **Source:** NASA Science, Mars Rock Samples — https://science.nasa.gov/mission/mars-2020-perseverance/mars-rock-samples/ : 43 tubes, 38 for samples
- **Game use:** `SAMPLES_GOAL = 1` (scenario); mission objective "bring a sample home" (ADR-0033)
- **Validation:** ✅

### L5. Mission 2 facts (one per sol, each with a real NASA photo; ADR-0034)

| Sol | Fact | Text source | Photo (place) | Parallel |
| --- | --- | --- | --- | --- |
| 1 | Spacesuit materials already on Mars | NASA/JPL PIA24033 | PIA26520 (Jezero, on the rover) | — |
| 2 | Oxygen stored as a liquid in tanks | NTRS 20160004210 | KSC-20191108-PH-JBS01_0049 (Earth) | P6 |
| 3 | 30 kW nuclear plant ~1 km from the base | NASA-SP-2009-566 (DRA 5.0) | GRC-2015-C-06315 (Earth) | P7 |
| 4 | Holes in the rock Rochette | PIA24840 | PIA24840 (Jezero) | — |
| 5 | Walks of about 2 km (Moon) | NTRS 20210000827 | AS15-88-11901 (Moon) | P4, P5 |
| 6 | Kodiak, a hill near the base | PIA24802 | PIA24802 (Jezero) | — |
| 7 | How astronauts breathe in a suit | NASA-STD-3001 briefs OCHMO-TB-004 pp. 10–11, OCHMO-TB-002 p. 18 | S68-34582 (Earth) | P8, P9 |

## 5. Place: Jezero

| ID | Fact | Source | Game use | Validation |
| --- | --- | --- | --- | --- |
| J1 | Landing site ~18° N, 77° E, 45 km crater | https://www.jpl.nasa.gov/news/press_kits/mars_2020/landing/mission/landing_site/ | Base location | ✅ |
| J2 | Delta front ~2.3 km west of the landing site | PIA24485 — https://www.jpl.nasa.gov/images/pia24485-perseverance-view-of-the-delta-in-jezero-crater/ | **Far site** (ADR-0035): `EXPEDITION_FAR_AIR` 3, `EXPEDITION_FAR_EXPOSURE` 2; mission 2 needs its sample | ✅ |
| J2a | Why the delta (lake evidence, best bet for signs of ancient life) | https://www.jpl.nasa.gov/news/nasas-perseverance-rover-arrives-at-delta-for-new-science-campaign/ | Card `deltaSite` | ✅ |
| J3 | Rochette: rock of the first sample cores, 2021 | PIA24840 | **Near site** (2 air, 1 point); team name | ✅ · no distance shown |
| J4 | Kodiak butte | PIA24802 | **Near site** (2 air, 1 point) | ✅ · no distance shown |

Near-site costs are game values with no distance claimed; only the delta's 2.3 km is shown.

## 6. Images

All in [`ASSETS.md`](ASSETS.md) (15 NASA images, each with ID, credit, place and color note), shown with a REAL PHOTO badge. The 3D terrain and sky are drawn in code and declared as illustration.

## 7. Scenario constants (no external source by design)

All values in SIM_MODEL §2 labeled scenario/simplification, including ADR-0033 to ADR-0035 (`DOSE_LIMIT`, `RADIATION_DAMAGE_*`, `SAMPLES_GOAL`, `EXPEDITION_FAR_*`) and `CRISIS_SECONDS`. Each card says "Game rule" and points to the real fact it stands for.

## 8. Not used (kept for the record)

Checked against the code on 2026-11-15 (no reference in `packages/` or `apps/web/src/`):

| Former entry | Status |
| --- | --- |
| RadLab (ISS DosTel, Mars readings) — `https://visualization.osdr.nasa.gov/radlab/api/` | **Not used.** No RadLab number on screen (ADR-0026: the grouping of readings was never explained in the docs). |
| OSDR studies (OSD-53, OSD-174) | **Not used.** Science cards from OSDR were cut (ADR-0031). |
| Mars Trek CTX mosaic (base map) | **Not used.** The orbital view is the photo PIA23239. |
| CSA "Interplanetary Farming" / lunar food toolkit | **Not used.** Veggie is the only greenhouse source. |
| JPL "0.67 mSv per day" (2013) | **Not used** on screen. |
| Entry speed 19,500 km/h, parachute (opening scene) | **Not used.** The opening scene was not built. |
| DONKI live call from the game | **Not used.** The game reads only the snapshot (D5). |

## Pending

None hidden from screens at the moment. To confirm, not shown: the exact Veggie LED colors behind the 3D greenhouse lamp, and the suit pressure in the ECLSS brief (SCIENCE.md P3, P9).
