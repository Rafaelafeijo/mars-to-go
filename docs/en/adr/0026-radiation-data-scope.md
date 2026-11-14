# ADR-0026 — Radiation data on screen: the May 2024 event, no raw RadLab numbers

Status: accepted, 2026-11-14. Refines ADR-0005.

**Context.** Phase 0 probes found Curiosity RAD surface data in RadLab and a NASA article on the 2024-05-20 event measured at Mars. The RadLab series does not match NASA's published numbers without knowing how the Mars readings are grouped.

**Decision.**
- The 2024-05-20 event is the risk 3 anchor (mission 2). Its card uses the NASA article's numbers as written: an astronaut next to Curiosity would have received 8,100 micrograys, "equivalent to 30 chest X-rays"; measured in Gale Crater (with a NASA source for Gale).
- Light vs particles uses NASA's wording: the light arrives first, particles in tens of minutes, and only the most energetic reach the surface.
- No RadLab number appears on screen. The ISS dosimeter card leaves the MVP if the unit/grouping question does not close.
- The geomagnetic storm (Kp, an Earth index) is out of the game.

**Consequences.** Still no invented Mars dose. One strong, sourced Mars measurement replaces an uncertain series.
