# tools/data

Python scripts that prepare data for `packages/content` (ADR-0007). They run on a developer machine, never in the browser.

Planned (Phase 4 and later):

- `build_catalog.py` — picks 8–12 real DONKI events, with Mars-arrival evidence, into the curated catalog.
- `prepare_images.py` — crops and exports the chosen NASA images at game sizes.

Run with `python3 -I`, standard library only unless a requirement is added here.
