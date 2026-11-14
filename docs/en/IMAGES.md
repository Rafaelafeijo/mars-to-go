# Game images — list and flow

> Portuguese version: [`docs/pt-BR/IMAGES.md`](../pt-BR/IMAGES.md).

Visual direction in ADR-0023 (November 14, 2026): **the game world is vector illustration made in code**, with palette and silhouettes taken from real photos of Jezero. **The real photo is proof**: it appears whole and prominently only in the "this is real" moments (data cards, expedition sites, Earth in the sky), always with a "real photo" badge, credit, mission and date. A real photo may serve as a horizon texture, darkened and with a gradient.

## The list (ten images)

| No. | Image | Where it goes | Priority |
| --- | --- | --- | --- |
| 1 | Ground-level panorama of Jezero | Home screen | **Highest quality**: processed mosaic, original |
| 2 | Martian sunset | Night scene; card | **Highest quality** |
| 3 | Earth seen from Mars (PIA17936) | Ending: Earth in the sky | **Highest quality** |
| 4 | The Sun with a flare | Solar event card; crisis | High |
| 5 | Jezero seen from above (Mars Trek) | Expedition map | High |
| 6 | The Rochette rock | Expedition site | Medium |
| 7 | Kodiak butte | Expedition site | Medium |
| 8 | The delta front, with layers | Expedition site | Medium |
| 9 | The MOXIE instrument | Life Support card | Medium |
| 10 | Plants grown on the Space Station | Greenhouse card (declared parallel) | Medium |

## Flow

1. Claude Code searches for and brings **two or three candidates per item**, with link, credit and date.
2. Rafaela chooses.
3. Claude Code **always downloads the original** into `assets-src/` (outside the site), records it in `docs/en/ASSETS.md` (source, credit, mission, instrument, date, place, true or enhanced color, screen) and prepares the game sizes.
4. Until the choice is made, the game uses **placeholders**.

## Rules

- **Is it real?** Instrument, mission and date known.
- **True or enhanced color?** Note it; the game declares it.
- **Editing allowed:** brightness, contrast, cropping.
- **AI:** AI enhancement or recreation turns the image into generated content: visible watermark, "illustration" badge, never "real photo", entry in `docs/en/AI_USAGE.md`.
- **No NASA logos, insignia or mission identifiers.** No images of minors. No recreating real people.
- **Whose is it?** Third-party material is marked in the credit line. When in doubt, don't use it.

## Where to look

| Collection | Address | Best for |
| --- | --- | --- |
| NASA Image and Video Library | https://images.nasa.gov/ | General search, with credit and description |
| NASA Photojournal | https://science.nasa.gov/photojournal/ | Planetary images with technical data (PIA codes) |
| Perseverance images | science.nasa.gov, Mars 2020 mission | Ground photos in Jezero |
| Mars Trek | https://trek.nasa.gov/mars/ | View of Jezero from above |
| Solar Dynamics Observatory | https://sdo.gsfc.nasa.gov/ | The Sun and flares |

## What is drawn, not sourced

Base modules, crew and character, avatar, power cells, gauges, icons, mission badge (without imitating real insignia), data badges, dot-matrix title, Mars or a module as a wireframe mesh. All our own vectors made in code, or a free-license set recorded in ASSETS.
