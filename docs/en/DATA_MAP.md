# Data map — Mars to Go

> Status: **approved 2026-11-14 (Phase 0)**, with the data decisions recorded below. One entry per data point the game shows or uses. Anything marked **pending** is hidden from screens; it does not block the build or deploy (ADR-0024).
> Portuguese version: [`docs/pt-BR/DATA_MAP.md`](../pt-BR/DATA_MAP.md). Sources accessed 2026-11-14 unless noted.
> Labels: **measured** (real observation), **scenario** (assumed for our base), **simplification** (what the model rounds or leaves out). Mode: **live** (fetched now), **snapshot** (saved by the daily job), **archive** (bundled).

Each entry: **Source / record** · **Route / fields** · **Place, date** · **Treatment** · **Game use** · **Label · mode** · **Mars parallel** · **For kids** · **Validation**.

---

## 1. Space weather (DONKI)

Base: `https://ccmc.gsfc.nasa.gov/DONKI/WS/get/` — no key, CORS `*`. Verified with real calls on 2026-11-14 (`kauai.ccmc…` timed out; `api.nasa.gov/DONKI/FLR` returned 404).

### D1. Solar flare
- **Source / record:** DONKI FLR, e.g. `2024-05-14T16:46:00-FLR-001` (class X8.7, peak 2024-05-14T16:51Z, AR 13664) — https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/30849/-1
- **Route / fields:** `FLR?startDate&endDate` → `flrID, classType, beginTime, peakTime, sourceLocation, activeRegionNum, link`
- **Place, date:** measured at Earth orbit (GOES X-ray sensor) about the Sun; event date
- **Treatment:** keep class letter + number; map to game risk (D6)
- **Game use:** forecast of the sol; risk 1 (M) or 2 (X) — SIM_MODEL §5
- **Label · mode:** measured (event); risk = simplification · archive (catalog), live/snapshot in "Today in space"
- **Mars parallel:** the Sun is the same for Earth and Mars, but a flare seen from Earth may not face Mars. The card says so (checklist K6).
- **For kids:** "A flare is a giant flash on the Sun. Its light reaches Mars first; tiny fast particles come tens of minutes later. Only the strongest particles get through the air of Mars to the ground."
- **Source for light vs particles (NASA wording, approved):** NASA/JPL, "NASA Watches Mars Light Up During Epic Solar Storm", 2024-06-10, release 2024-080: the X-rays and gamma rays "arrived first", the charged particles reached Mars "in just tens of minutes", "Only the most energetic can reach the surface to be measured by RAD." — https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/
- **Validation:** route verified ✅ · light vs particles ✅

### D2. Coronal mass ejection (CME) and Mars arrival
- **Source / record:** DONKI CME (e.g. `2024-05-08T05:36:00-CME-001`) + WSA-ENLIL simulation `impactList[].location = "Mars"` (e.g. `WSA-ENLIL/30726/1`, Mars arrival 2024-05-13T17:42Z) — https://ccmc.gsfc.nasa.gov/DONKI/view/WSA-ENLIL/30726/-1
- **Route / fields:** `CME`, `CMEAnalysis?mostAccurateOnly=true`, `WSAEnlilSimulations` → `activityID, startTime, note, speed, halfAngle, impactList{location, arrivalTime, isGlancingBlow}`
- **Place, date:** coronagraphs (SOHO, STEREO-A) about the Sun; arrival at Mars is a **model prediction**, not a measurement
- **Treatment:** event reaches Mars = a WSA-ENLIL run lists Mars; glancing blows kept as a flag
- **Game use:** `reachedMars` for risk 2; the answer to "Ask Earth" — SIM_MODEL §4, §5
- **Label · mode:** CME measured; Mars arrival = model prediction (shown as "forecast by a NASA model") · archive / live
- **Mars parallel:** direct — the prediction is about Mars itself.
- **For kids:** "Sometimes the Sun throws a cloud of particles into space. Scientists use a computer model to guess which planets it will hit, like a weather forecast for space."
- **Validation:** route verified ✅ (2024 has Mars arrivals in most months)

### D3. Solar energetic particles (SEP)
- **Source / record:** DONKI SEP, e.g. `2024-05-09T13:59:00-SEP-001`
- **Route / fields:** `SEP` → `sepID, eventTime, instruments, link`
- **Place, date:** near-Earth instruments; event date
- **Treatment:** used only when a Mars measurement (D7) confirms particles at Mars
- **Game use:** risk 3 — SIM_MODEL §5
- **Label · mode:** measured · archive
- **Mars parallel:** DONKI SEPs are near Earth; only a Mars instrument confirms Mars.
- **For kids:** "These are tiny, very fast bits from the Sun. They are what a shield must stop."
- **Validation:** route verified ✅

### D4. Geomagnetic storm (GST)
- **Source / record:** DONKI GST `2024-05-10T15:00:00-GST-001` (Kp up to 9.0)
- **Game use:** **out of the game** (approved). Kp is an Earth index; Mars has no global magnetic field.
- **Validation:** route verified ✅ · not used

### D5. "Today in space"
- **Source:** the D1–D3 routes over the last 7 days. 2026-11-07→14: 7 flares (latest M1.7, `2026-11-11T21:06:00-FLR-001`), 22 CMEs.
- **Treatment:** pick the strongest event; show date and mode badge (live / updated / archive), never relabeled
- **Game use:** home screen; enters the mission only if a Mars arrival exists
- **Validation:** verified ✅

### D6. Event class → game risk table
- **Source:** our rule — SIM_MODEL §5
- **Label:** simplification. A risk number is not a dose.
- **For kids:** "We turned each real event into 0, 1, 2 or 3 so you can plan. Real scientists use much more detail."
- **Validation:** awaiting approval ⏳

---

## 2. Radiation (RadLab, NASA articles)

RadLab API: `https://visualization.osdr.nasa.gov/radlab/api/` — no key, **no CORS header** (build-time only). Fields: `timestamp, instrument_id, absorbed_dose_rate, dose_equivalent_rate` (docs: μGy/hour, μSv/hour).

### D7. Curiosity RAD on the Mars surface — the May 20, 2024 event
- **Source / record:** NASA/JPL, "NASA Watches Mars Light Up During Epic Solar Storm" (2024-06-10, release 2024-080): "a solar flare later estimated to be an X12"; "If astronauts had been standing next to NASA's Curiosity Mars rover at the time, they would have received a radiation dose of 8,100 micrograys", "equivalent to 30 chest X-rays"; "the biggest surge measured by Curiosity's Radiation Assessment Detector, or RAD, since the rover landed 12 years ago." https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/
- **Place, date:** Curiosity's location on the Mars surface, 2024-05-20. The card says the measurement was made in **Gale Crater** (approved); the article does not name Gale, so the card cites NASA's Curiosity mission page for it (link to attach in Phase 4 ⏳).
- **Treatment:** the NASA number is shown as written (8,100 micrograys ≈ 30 chest X-rays), framed as NASA frames it: the dose an astronaut **would have received** standing next to the rover.
- **Game use:** risk 3 anchor event of mission 2 "The May storm"; science card for the shield; evidence `reachedMars = true`
- **Label · mode:** measured, **Mars** · archive
- **Mars parallel:** none needed — measured on Mars (Gale, not Jezero).
- **For kids:** "On May 20, 2024, a real storm from the Sun reached Mars. An astronaut standing next to the rover Curiosity would have received as much radiation as 30 X-rays at the doctor. That is why the shield matters."
- **Validation:** NASA article ✅ · Gale source link ⏳
- **RadLab (approved): no RadLab number on screen.** The docs give μGy per hour, but do not explain how the Mars readings are grouped (17-min cadence; the daily mean × 24 h ≈ 1,660 on 05-20 vs NASA's 8,100). Kept for our own notes only.

### D8. Mars background radiation
- **Source:** NASA PIA17600 "Radiation Measurements on Mars" (2013-12-09): "a slowly varying dose rate of about 210 micrograys per day" — https://science.nasa.gov/resource/radiation-measurements-on-mars/ · JPL (2013-12-09): "0.67 millisieverts per day from August 2012 to June 2013" — https://www.jpl.nasa.gov/news/nasa-curiosity-first-mars-age-measurement-and-human-exploration-help/
- **Game use:** science card only; explains why the habitat matters every day. **Not in any formula.**
- **Label · mode:** measured, Mars (Gale) · archive
- **For kids:** "On Mars there is always a little radiation, like sunshine that never turns off. The habitat is your sunscreen."
- **Validation:** ✅

### D9. ISS dosimeters (parallel)
- **Source / record:** RadLab `spacecraft=ISS&instrument=DosTel`, e.g. DosTel1 2022-04-01T23:00:33, absorbed dose rate 9.835 (μGy/h per docs)
- **Game use:** science card "how much a shield matters", labeled **measured on the ISS, not on Mars** (ADR-0005)
- **Mars parallel:** both are outside Earth's thick air; the ISS is still inside Earth's magnetic field, Mars has no global one. Justification to record in SCIENCE.md.
- **Validation:** route ✅ · **out of the MVP unless the unit/grouping question closes** (approved) ⏳

---

## 3. Mars environment (the Mars-specific challenges, brief §6.5)

All from NASA Mars Fact Sheet (last updated 2025-05-19) — https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html — unless noted. Label: measured, Mars. Mode: archive.

| ID | Fact (source wording) | Game use | For kids | Validation |
| --- | --- | --- | --- | --- |
| M1 | Atmosphere CO₂ 95.1%; surface pressure 6.36 mb (4.0–8.7 by season) | Why air must be made → Life Support costs cells | "Mars air is almost all the gas we breathe *out*. We must make our own oxygen." | ✅ |
| M2 | Solar irradiance 586.2 W/m² vs Earth 1361.0 (ratio 0.431) | Why only 10 cells (`CELLS_PER_SOL`, scenario) | "Sunlight on Mars is less than half of Earth's — like charging your phone with a weak charger." | ✅ |
| M3 | 2018 dust storm: tau 10.5 on 2018-06-10, Opportunity energy 21 Wh, lowest ever — https://science.nasa.gov/resource/on-mars-light-is-energy/ (JPL gives 10.8: https://www.jpl.nasa.gov/news/six-things-about-opportunitys-recovery-efforts/) | Dust sol: 6 cells (`CELLS_DUST_SOL`, scenario) | "Dust can cover the sky so much that solar panels almost stop — Opportunity got so little power it went to sleep." | ✅ (show both tau values or 10.5 with its page) |
| M4 | Average ~214 K (−59 °C); daily range −89 to −31 °C | Heating: 3 fixed cells (`HEATING_CELLS`, scenario) | "Colder than any freezer at home, every night." | ✅ |
| M5 | Soil "contains perchlorate salts at concentrations harmful or fatal to most forms of life"; regolith "devoid of soil organic matter" — https://science.nasa.gov/biological-physical/investigations/efri-elis-kpmsg/ | Greenhouse is closed and slow (`GREENHOUSE_DELAY_SOLS`) | "Mars dirt has salts that hurt plants, so we grow them inside, in water." | ✅ |
| M6 | Gravity 3.73 m/s² (mean; Earth 9.82, ratio 0.380) | Briefing fact only | "You would weigh about a third of what you weigh on Earth." | ✅ — **brief said 3.71; corrected** |
| M7 | "Mars has no global magnetic field today" — https://science.nasa.gov/mars/facts/ | Why radiation reaches the surface → Shield | "Earth has an invisible bubble that blocks space particles. Mars lost its bubble." | ✅ |
| M8 | Sol = 24.6597 h = 24 h 39 min 35 s | `MISSION_SOLS` unit; sol explained in one sentence | "A sol is a day on Mars — 40 minutes longer than ours." | ✅ |
| M9 | Radio delay: ~4 min at closest (~35 million miles), ~24 min at greatest distance (~250 million miles) — https://www.nasa.gov/centers-and-facilities/goddard/space-communications-7-things-you-need-to-know/ | Ask Earth; radio silence crisis (answer cannot arrive in 10 s) | "Like sending a voice message: Earth hears you minutes later, and you hear back minutes after that." | ✅ — **brief said 3–22 min; NASA page says ~4–24** |

## 4. Life support and food

### L1. MOXIE
- **Source:** JPL, "NASA's Oxygen-Generating Experiment MOXIE Completes Mars Mission" (2023-09-06): "a total of 122 grams of oxygen", "16 times", "12 grams of oxygen an hour", "98% purity or better", "about what a small dog breathes in 10 hours" — https://www.jpl.nasa.gov/news/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/ · Hoffman et al. 2022, Sci. Adv. 8(35) eabp8636.
- **Place, date:** Jezero Crater, Mars, 2021–2023
- **Game use:** proves "oxygen can be made from Mars air with power" → `AIR_PER_LIFE_SUPPORT_CELL` (scenario)
- **Honesty rule:** MOXIE's peak is not continuous capacity; the base's equipment is a scenario (brief §6.6).
- **For kids:** "A machine the size of a toaster on the rover Perseverance made oxygen from Mars air — enough for a small dog for 10 hours. Our base has a much bigger one, and it eats power."
- **Validation:** ✅

### L2. Crew oxygen use
- **Source:** NASA BVAD, NASA/TP-2015-218570/REV2 (Feb 2022), Table 3-31: oxygen consumed 0.895 kg per crew member per day (range 0.61–1.08) — https://ntrs.nasa.gov/citations/20210024855
- **Treatment:** 0.895 × 4 × 7 ≈ 25 kg for our crew over 7 sols (rounded); not used as a formula input
- **Game use:** explains `AIR_USE_PER_SOL` (scenario, game units)
- **For kids:** "Each astronaut breathes almost 1 kg of oxygen a day — about the weight of a big bottle of water."
- **Validation:** ✅ — **brief's "1 t/year for four" is a hedged NASA quote; BVAD gives ≈ 1.3 t; use BVAD.**

### L3. Plants take time (greenhouse delay)
- **Source (primary, approved):** NASA Veggie fact sheet: 'Outredgeous' red romaine "grew for 33 days" (VEG-01, ISS) — https://www.nasa.gov/wp-content/uploads/2019/04/veggie_fact_sheet_508.pdf · secondary: CSA "Interplanetary Farming" (modified 2019-09-26): green leaf lettuce approx. 21–28 days — https://www.asc-csa.gc.ca/eng/youth-educators/activities/fitness-and-nutrition/interplanetary-farming.asp
- **Rule:** cite facts with a link; never copy third-party text (approved).
- **Place:** ISS (Veggie); general crop data (CSA, not tied to any body)
- **Game use:** `GREENHOUSE_DELAY_SOLS = 2` — **simplification** (real ≈ 30 days; compressed so a 7-sol mission shows the delay)
- **Mars parallel:** closed greenhouse with light, water and controlled air works the same in principle; on Mars light is weaker, gravity lower, soil unusable (M2, M5). CSA lunar numbers are **not** used (K4).
- **For kids:** "Lettuce in space took 33 days to grow. In our game it takes 2 sols, so you can see it happen — but the rule is the same: plant today, eat later."
- **Validation:** ✅ · CSA terms of reuse to read before quoting text ⏳

## 5. Place: Jezero

| ID | Fact | Source | Game use | Validation |
| --- | --- | --- | --- | --- |
| J1 | Landing site ~18° N, 77° E, 45 km crater | https://www.jpl.nasa.gov/news/press_kits/mars_2020/landing/mission/landing_site/ | Base location | ✅ (precise coordinates not on a NASA page) |
| J2 | Delta remnant ~2.3 km west of the landing site | PIA24485 — https://www.jpl.nasa.gov/images/pia24485-perseverance-view-of-the-delta-in-jezero-crater/ | Expedition site + distance | ✅ |
| J3 | Rochette: rock of the first sample cores (Montdenier, Montagnac), 2021 | https://science.nasa.gov/resource/perseverances-journey-to-first-successful-sample-collection/ | Expedition site; team name | ✅ fact · **no distance shown** (no source) · core dates differ across NASA pages, so no date on screen |
| J4 | Kodiak butte, southern edge of the delta | https://www.nasa.gov/solar-system/nasas-perseverance-sheds-more-light-on-jezero-craters-watery-past/ | Expedition site | ✅ fact · **no distance shown** (no source) |

Approved: only the delta distance (2.3 km, J2) is shown. The expedition has a **fixed cost** whatever the site (SIM_MODEL §2).
| J5 | Base map | Mars Trek CTX mosaic `JEZ_ctx_B_soc_008_orthoMosaic_6m_Eqc_latTs0_lon0` (WMTS public) | Expedition map capture | route ✅ · license wording **pending** |

## 6. Images

| ID | Image | Source | Validation |
| --- | --- | --- | --- |
| I1 | Earth from Mars, "Bright 'Evening Star' Seen from Mars is Earth", PIA17936, Curiosity Mastcam, 2014-01-31 | https://science.nasa.gov/photojournal/bright-evening-star-seen-from-mars-is-earth | ✅ |
| I2–I6 | Images 1, 5, 6, 8, 14 of `docs/IMAGES.md` | To fetch (you) | ⏳ |

## 7. Opening scene (optional)

| ID | Fact | Source | Validation |
| --- | --- | --- | --- |
| E1 | Entry at about 19,500 km/h; parachute at about 11 km, ~1,512 km/h | https://www.jpl.nasa.gov/news/press_kits/mars_2020/landing/mission/ | ✅ — **brief said ~20,000 km/h; press kit says 19,500** |

## 8. Science cards (OSDR)

| ID | Study | Source | Use | Validation |
| --- | --- | --- | --- | --- |
| O1 | OSD-53 "Spaceflight Modulates Gene Expression in Astronauts" (6 astronauts, Shuttle) | `https://osdr.nasa.gov/osdr/data/osd/meta/53` | Science card (parallel: Earth orbit) | route ✅ · kid-level finding to write and check ⏳ |
| O2 | OSD-174 hair follicles of 10 ISS astronauts (JAXA) | OSDR search | Science card | ⏳ |

Picking 3–5 cards with one plain finding each is Phase 6 work.

## 9. Scenario constants (no external source by design)

All values in SIM_MODEL §2 labeled scenario/simplification. Each card says "Game scenario" and points to the real fact it stands for (M1–M9, L1–L3).

## Pending (hidden from screens until closed)

1. RadLab: grouping of Mars readings; ISS card out of the MVP if not closed (D9).
2. NASA source naming Gale Crater for the D7 card.
3. Mars Trek and CSA reuse terms.
4. OSDR card findings in kid language.

Closed on 2026-11-14: light vs particles (NASA wording, D1); distances (only the delta's 2.3 km; fixed expedition cost); geomagnetic storm out of the game; Veggie as the greenhouse's primary source.
