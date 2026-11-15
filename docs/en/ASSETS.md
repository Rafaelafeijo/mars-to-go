# Assets — sources, credits and licenses

> Portuguese version: [`docs/pt-BR/ASSETS.md`](../pt-BR/ASSETS.md). Every third-party asset is listed here **before** it is committed (CLAUDE.md rule 11). No NASA logos, insignia, flags or mission identifiers.

NASA media usage guidelines: https://www.nasa.gov/nasa-brand-center/images-and-media/ — NASA content is generally not subject to copyright in the United States and may be used for educational or informational purposes; it must not imply NASA endorsement. Partner credits (e.g. ASU, MSSS, Texas A&M) are copied exactly.

## Images

Chosen by the team on 2026-11-14 (IMAGES.md). Originals in `assets-src/` (not committed); game sizes in `apps/web/public/images/<slug>-{480,960,1600}.webp`, made by `tools/data/prepare_images.py` (crop and resize only). Every on-screen use carries the **REAL PHOTO** badge with place, credit, mission and date; badges marked *enhanced color* say so.

| # | Slug | ID · source page | Credit (exact) | Mission · instrument | Date | Place (badge) | Color (badge) | Screen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `jezero-panorama` | PIA24921 · https://science.nasa.gov/photojournal/detailed-panorama-of-mars-jezero-crater-delta/ | NASA/JPL-Caltech/ASU/MSSS | Mars 2020 Perseverance · Mastcam-Z | 2022-06-12 to 06-20 | Jezero Crater, Mars | Enhanced color (main image) | Home; horizon texture |
| 2 | `gale-sunset` | PIA19400 · https://science.nasa.gov/photojournal/sunset-in-mars-gale-crater | NASA/JPL-Caltech/MSSS/Texas A&M Univ. | MSL Curiosity · Mastcam | 2015-04-15 (sol 956) | **Gale Crater, Mars** | Calibrated, white-balanced | Night scene; card |
| 3 | `earth-from-mars` | PIA17936 · https://science.nasa.gov/photojournal/bright-evening-star-seen-from-mars-is-earth/ | NASA/JPL-Caltech/MSSS/TAMU | MSL Curiosity · Mastcam (left) | 2014-01-31 (sol 529) | **Gale Crater, Mars** | Processed to remove cosmic-ray marks | End: Earth in the sky |
| 4 | `sun-flare-x87` | SVS 14592 · https://svs.gsfc.nasa.gov/14592 | NASA/SDO | SDO · AIA (171, 131, 193, 304 Å composite) | 2024-05-14 (X8.7 flare) | The Sun (seen from Earth orbit) | **Enhanced color** (extreme ultraviolet, colorized) | Solar event card; crisis |
| 5 | `jezero-orbital` | PIA23239 · https://science.nasa.gov/photojournal/jezero-crater-mars-2020s-landing-site/ | NASA/JPL-Caltech/MSSS/JHU-APL | MRO · CTX + CRISM | released 2019-05-15 | Jezero Crater, Mars (from orbit) | **Enhanced color** (mineral data) | Expedition map |
| 6 | `rochette` | PIA24840 · https://science.nasa.gov/photojournal/rochette-after-perseverance-sampling | NASA/JPL-Caltech | Mars 2020 Perseverance · Hazcam | 2021-09-07 (sol 196) | Jezero Crater, Mars | Contrast enhanced (per caption) | Expedition site |
| 7 | `kodiak` | PIA24802 · https://science.nasa.gov/photojournal/perseverance-captures-image-of-kodiak | NASA/JPL-Caltech/ASU/MSSS | Mars 2020 Perseverance · Mastcam-Z | 2021-04-18 | Jezero Crater, Mars | Enhanced color | Expedition site |
| 8 | `delta-front` | PIA24925 · https://science.nasa.gov/photojournal/perseverance-workspace-at-skinner-ridge | NASA/JPL-Caltech/ASU/MSSS | Mars 2020 Perseverance · Mastcam-Z | 2022-06-30 to 07-08 | Jezero Crater delta, Mars | Enhanced color | Expedition site |
| 9 | `moxie` | PIA24203 · https://science.nasa.gov/photojournal/moxie-all-tucked-in | NASA/JPL-Caltech | Mars 2020 · MOXIE (installed in the rover) | released 2021-01-19 | **Earth, before launch** | Not stated | Life Support card |
| 10 | `iss-lettuce` | iss072e404269 · https://images.nasa.gov/details/iss072e404269 | NASA | ISS · Advanced Plant Habitat (Plant Habitat-07) | 2024-12-27 | International Space Station (parallel) | Not stated | Greenhouse card |
| 11 | `spacesuit-materials` | PIA26520 · https://science.nasa.gov/photojournal/perseverance-and-sherlocs-calibration-target | NASA/JPL-Caltech/MSSS | Mars 2020 Perseverance · SHERLOC (WATSON camera) | released 2025-03-26 (date taken not stated) | Jezero Crater, Mars (on the rover) | Not stated | Mission 2 fact: spacesuit materials |
| 12 | `kilopower` | GRC-2015-C-06315 · https://images.nasa.gov/details/GRC-2015-C-06315 | NASA | Fission Surface Power Technology Demonstration Unit · 10-kW Stirling Power Conversion Unit (no reactor in the photo) | 2016-11-09 (library date) | **Earth: NASA Glenn Research Center, Cleveland, Ohio** (test) | Not stated | Mission 2 fact: nuclear power |
| 13 | `lunar-eva` | AS15-88-11901 · https://images.nasa.gov/details/as15-88-11901 | NASA | Apollo 15 · Lunar Roving Vehicle (Hasselblad 70 mm) | 1971-07-31 to 08-02 (third EVA) | **The Moon: Hadley-Apennine** (parallel) | Not stated | Mission 2 fact: how far to walk |
| 14 | `ox-storage` | KSC-20191108-PH-JBS01_0049 · https://images.nasa.gov/details/KSC-20191108-PH-JBS01_0049 | NASA/Ben Smegelsky | Exploration Ground Systems · liquid oxygen storage tank | 2019-11-08 | **Earth: Launch Pad 39B, Kennedy Space Center, Florida** (parallel) | Not stated | Mission 2 fact: storing oxygen |
| 15 | `suit-backpack` | S68-34582 · https://images.nasa.gov/details/S68-34582 | NASA | Apollo · Portable Life Support System (PLSS), cover removed | 1968 (library date 1968-06-11) | **Earth** (place not stated; record from NASA Johnson, JSC) | Not stated | Mission 2 fact: removing CO2 |

Checks done on 2026-11-14: no NASA logo or insignia as subject; image 10 shows no person (checked visually at 1600 px); no minors in any image. Crops: 1 (right part of the panorama, no mosaic edges), 6 (rock centered, rover wheel out), 8 (layered cliff, rover arm out).

Images 11-15 added on 2026-11-15 (source files in a local scratch folder, named `11-…` to `15-…` for `prepare_images.py`). Checks: no NASA logo, insignia, flag or mission patch visible; no minors; image 11 replaces the requested PIA24033 graphic, which shows the Artemis logo, the Mars 2020 patch and a U.S. flag. Crops: 11 (right panel only, the WATSON photo; left panel with the rover and yellow circle out), 12 (right part: the Stirling converter; the technician and his branded cap out), 13 (part of the black sky and the film frame number out). Image 12 is the power converter of a ground test unit, not a reactor; image 14 stores rocket propellant, shown as a parallel for storing liquid oxygen.


**Notes (audit of 2026-11-15).**
- `jezero-wide-h480` and `jezero-wide-h840` are a wider crop of row 1 (PIA24921, same credit), made by `tools/data/prepare_images.py` for the list-mode outside view.
- `gale-sunset` has no 1600 px size because its original is smaller; the game asks for 1600 px only for the full-screen home image.
- Every image was checked by eye: no logos, insignia, flags, people or personal names. Text on hardware ("LIQUID OXYGEN", part numbers, "221BBAKER" on the SHERLOC target) is part of the real photos.
- Row 8 (`delta-front`) is shown in the night report when the rover brings the delta sample.

## 3D models

Used by the 3D world prototype (ADR-0032), in `apps/web/public/models/kenney/` with the original license files.

| Pack | Author | License | Source | Files used |
| --- | --- | --- | --- | --- |
| Space Kit 2.0 | Kenney (www.kenney.nl) | CC0 1.0 (public domain) | https://kenney.nl/assets/space-kit | astronautA, machine_generatorLarge (air machine), hangar_roundGlass (greenhouse), machine_wireless (shield), rover, satelliteDish_large (antenna), hangar_largeA (habitat), corridor, rock_largeA, rock_largeB, rocks_smallA, craterLarge (`.glb`, colors embedded) |
| Space Station Kit | Kenney (www.kenney.nl) | CC0 1.0 (public domain) | https://kenney.nl/assets/space-station-kit | container-tall (`.glb`) + `Textures/colormap.png` |

The terrain, sky and Sun are drawn in code (illustration inspired by Jezero Crater, declared on screen as illustration, not a photo).


Not loaded by this version (kept with their license): `astronautA` (the game draws its own astronaut), `corridor`, `hangar_roundGlass` (the greenhouse is drawn in code).

## Fonts

| Font | Author | License | Source | Use |
| --- | --- | --- | --- | --- |
| Atkinson Hyperlegible Next (variable) | Braille Institute of America | SIL Open Font License 1.1 | npm `@fontsource-variable/atkinson-hyperlegible-next@5.3.0` (self-hosted, no request to Google Fonts) | Body text and 3D labels. Chosen for legibility (ages 7–12, low vision). Titles keep the system monospace stack. |

## Icons, sounds, music

None in the game. The demo video's music is listed below.

## Demo video and README images

The 29-second demo video (https://youtu.be/zaAPhmpyvIg) is published on YouTube; its source files are not committed. Everything in it is listed here.

| Item | Source | Credit | License / terms | Use in the video |
| --- | --- | --- | --- | --- |
| The Moon (full disc), AS17-152-23311 | https://images.nasa.gov/details/as17-152-23311 | NASA (Apollo 17 crew, transearth coast, December 1972) | NASA media guidelines | Opening, slow zoom |
| Earthrise, AS08-14-2383 | https://images.nasa.gov/details/as08-14-2383 | NASA (Apollo 8, December 24, 1968) | NASA media guidelines | Opening, crop to 16:9 |
| Apollo 15 Lunar Roving Vehicle, AS15-88-11901 | row 13 above | NASA | NASA media guidelines | Opening, crop to 16:9 |
| Pale Blue Dot Revisited, PIA23645 | https://images.nasa.gov/details/PIA23645 | NASA/JPL-Caltech (Voyager 1, 1990; reprocessed 2020) | NASA media guidelines | Zoom on Earth, with a white ring drawn around the dot |
| Jezero panorama, PIA24921 | row 1 above | NASA/JPL-Caltech/ASU/MSSS | NASA media guidelines | Crop of the upper part, slow zoom |
| Music: "Space" by leberch | https://pixabay.com/music/ambiente-space-626368/ (audio ID 626368) | leberch, via Pixabay | Pixabay Content License; license certificate downloaded 2026-11-15 and kept by the team | Background, low, under the voice |
| Narration voice | Kokoro-82M (model `kokoro-v1.0.onnx`, voice `af_heart`), run locally with `kokoro-onnx` 0.6.1 (MIT) | AI-generated (see AI_USAGE.md) | Apache-2.0 (model); phonemes by espeak-ng (GPL-3.0), used as a tool, not distributed | The whole narration |
| Caption and label fonts | Atkinson Hyperlegible Next (above); DejaVu Sans Mono Bold | Braille Institute; DejaVu fonts | SIL OFL 1.1; DejaVu (Bitstream Vera) license | Burned-in captions and credit lines |
| Game footage | Recorded from this game with Playwright and Chromium | Team Rochette | MIT (this repository) | All gameplay scenes |

Checks done on 2026-11-15: no NASA logo, insignia, flag or mission patch in any video image; no people (the Apollo images show hardware and landscapes only); no minors; no voice of a real person.

**README images** (`docs/media/*.jpg`): screenshots and video frames of this game (team's own work, MIT). The home screen capture includes the game's own use of row 1 (PIA24921); the video cover includes the game footage only.

## Code libraries

Open-source dependencies are listed in `package.json` files and `pnpm-lock.yaml`. Main ones: React, Vite, i18next, react-i18next, Hono, Vitest, ESLint, TypeScript.
