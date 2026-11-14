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

Checks done on 2026-11-14: no NASA logo or insignia as subject; image 10 shows no person (checked visually at 1600 px); no minors in any image. Crops: 1 (right part of the panorama, no mosaic edges), 6 (rock centered, rover wheel out), 8 (layered cliff, rover arm out).

## Fonts

None yet; the game uses system fonts. Open-license fonts will be recorded here before use (ADR-0023).

## Icons, sounds, music

None yet.

## Code libraries

Open-source dependencies are listed in `package.json` files and `pnpm-lock.yaml`. Main ones: React, Vite, i18next, react-i18next, Hono, Vitest, ESLint, TypeScript.
