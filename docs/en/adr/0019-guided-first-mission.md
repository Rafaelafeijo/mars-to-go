# ADR-0019 — Guided first mission

Status: accepted, 2026-11-14.

**Context.** Five destinations on the first sol is a lot for a 7-year-old (checklist C3, C4). The rules must stay the same everywhere so that what the child learns in mission 1 is true in every mission.

**Decision.** In mission 1 destinations unlock over time: sol 1 Life Support and Greenhouse; sol 2 adds Shield; sol 3 adds Expedition and Ask Earth. Every other mission starts with everything open ("free mode"). Unlocking only restricts what is enabled; the simulation rules do not change. The worked games of SIM_MODEL §8 run in free mode on a test seed.

**Consequences.** `MissionState` carries `mode: 'guided' | 'free'`; allocations using a locked destination are rejected. Mission 1 teaches one trade-off at a time.
