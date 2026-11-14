# ADR-0023 — Visual direction: illustrated world, real photo as proof

Status: accepted, 2026-11-14. Refines brief §7 and ADR-0008.

**Context.** Real photos everywhere make screens heavy, hard to read at 360 px and blur the line between "real" and "game". The challenge values credibility (real data, real photos) but warns against polish replacing mechanics.

**Decision.**
- **The world is illustrated.** Base, sky, horizon, crew, modules and interface are vector illustration made in code, with palette and silhouettes taken from real Jezero photos.
- **Real photos are proof.** A real photo appears full and highlighted only in "this is real" moments: data cards, expedition sites, Earth in the sky — always with the "REAL PHOTO" badge, credit, mission and date. A real photo may also serve as a darkened horizon texture with a gradient.
- **Edits.** Brightness, contrast and cropping are allowed. AI enhancement or recreation makes the image generated content: visible watermark, "ILLUSTRATION" badge (never "real photo"), entry in AI_USAGE.
- No NASA logos, insignia or mission identifiers. No images of minors.
- **Visual language (own identity, open-license fonts recorded in ASSETS):** dark background with grain; one warm Mars accent color; data badges in uppercase, letter-spaced monospace ("MEASURED · DONKI · 20 MAY 2024"); numbers and verdicts in a heavy, wide face, very large; title "MARS TO GO" in dot-matrix letters like a control panel; Mars or a base module as a slowly turning wireframe; thin grid lines between blocks; meters as cards (icon, big number, pill label: critical, tight, safe, plenty — never color alone); a ticker for "Today in space"; language codes at the top (PT, EN); "skip to content" link; soft transitions between moments and from day to night, off with reduced motion.
- **For kids:** buttons ≥ 44 px, soft corners, visual response to every tap, one friendly crew character, color in moments of achievement. Minimalism stays on decision screens, where it helps reading numbers. Text contrast 4.5:1.
- **Home:** text logo; three entries "Play" (the career), "How it works", "Surprise me"; a rotating word (today you are a pilot, engineer, scientist, Mars farmer); honest footer (who made it, AI use, where the data comes from).
- **Images:** a list of ten (IMAGES.md). For each, Claude Code brings 2–3 candidates with link, credit and date; the team chooses; Claude Code downloads the original, records it in ASSETS and prepares the sizes. Placeholders until then.
- **Opening and recording (after Phase 4):** animated 20–30 s, skippable scene built from the real screens (arrival at Mars, "here a day is called a sol", the 10 cells, "you decide"); an automated recording of the game running for the demo video. Sound off by default with a button to turn it on; music only with a free license recorded in ASSETS; no film soundtracks.

**Consequences.** Light pages and readable decision screens; credibility comes from badged real photos and data cards. Illustration work happens after mechanics (rule 2). Twelve moments are grouped into six scenes that reuse backdrop and components (ARCHITECTURE §7).
