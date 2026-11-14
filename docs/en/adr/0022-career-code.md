# ADR-0022 — Career code replaces the mission code

Status: accepted, 2026-11-14. Amends ADR-0017.

**Context.** With a career of missions (ADR-0021), restoring only the mission in progress would lose badges and unlocked missions on another device.

**Decision.** Progress is saved on the device after every sol, with a save version. A short "career code" stores unlocked missions, badges, discoveries and the mission in progress, and restores everything on another device: bits packed in Crockford base32, blocks of 4, one check character, about 16–20 characters. No personal data. Settings warn that, without the code, clearing the browser's data erases progress.

**Consequences.** The code format has its own version and a round-trip test. Sol checkpoints are not in the code.
