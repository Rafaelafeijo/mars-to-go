# ADR-0030 — The scene: the game happens in a place, not on a form

> Portuguese version: [`docs/pt-BR/adr/0030-a-cena.md`](../../pt-BR/adr/0030-a-cena.md)

Status: accepted, 2026-11-14. Refines ADR-0008 and ADR-0023. Phase 3 mechanics validated; Phase 3 visuals not validated.

**Context.** After Phase 3 the game works but reads as a long text form. For ages 7–12 it must feel like a game: everything happens in one scene, and what you touch are objects, not lists. It must be as pleasant on a computer as on a phone.

**Decision.**
- **Three views with one switch:** Inside (the base in cutaway: battery with 10 cells, 3 locked to the heater; air machine with a tank that fills; greenhouse with sprouts that grow over two sols; crew of four that reacts to the base state), Outside (the real Jezero panorama, dragged sideways, with markers and illustrated solar panels, antenna, shield cover and rover on the real ground; a badge says what is real photo and what is illustration), Sky (real photos: the forecast, and Earth as a pointed dot of light at the end). Soft transitions, off with reduced motion.
- **Play in the scene:** tap (or drag) moves cells from the battery to objects; each object shows its cells; the live math rises from the object to the meter ("+1 air"); at night the scene darkens and numbers run from each object to the meters in the order of the simulation. Forecast, morning question and sol log are short panels over the scene, never a scrolling page. Locked destinations are dimmed with a padlock.
- **Meters always on top:** power, air, food with a big number and a word; sol and exposure next to them. On a computer, a wide centered stage with meters and log in a side panel.
- **Data badge becomes a small diamond** on the object or number; measured data is highlighted, game rules stay discreet; tapping opens the same data card. No screen shows more than two sentences in a row.
- **Backpack:** discoveries, science cards, badges and the notebook with every data card.
- **Accessible mode:** the Phase 3 list version stays, selectable in settings and used by screen readers. Objects have readable names and states, 44 px targets, full keyboard use.
- **Art:** illustration made in code (SVG), flat, palette from the Jezero photos. Kenney CC0 kits were evaluated: their 2D renders are too small for a phone scene (64 px previews; isometric objects about 40–150 px inside 512 px frames), and rendering the 3D models would need a render pipeline we do not have time for. NASA 3D Resources: same issue for the rover; not used. Nothing from either is shipped, so nothing is added to ASSETS.
- **Panorama:** a simple horizontal drag over the real photo (no library). Photo Sphere Viewer and Pannellum accept partial panoramas, but only with a known equirectangular field of view; the Jezero mosaic (PIA24921) is a rectified mosaic without published FOV values, so a sphere would warp it, and both need WebGL on low-end phones. Markers are placed only where the photo shows the place (the delta, the subject of PIA24921); sites not in the photo appear as signposts with their own real photo in the card.
- **Photos are never altered by AI.** Brightness, contrast, crop and color filters only: day and night by filters, dust as a veil, a solar storm as a flash.
- **Unchanged:** the simulation and its tests, the data cards, both languages, English by default. The automated playthrough also plays mission 1 through the scene.

**Consequences.** More front-end work before Phase 4. To fit the time, out of scope: avatar, career code, mission 3 and OSDR science cards. "Today in space" becomes a card in the Sky view.
