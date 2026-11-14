# ADR-0020 — The live math: the simulation returns the night step by step

Status: accepted, 2026-11-14.

**Context.** The child must be able to explain the trade-off in their own words (checklist B7). A result without the steps behind it teaches nothing; the screen must not compute anything on its own (ADR-0009).

**Decision.** `resolveNight` returns the ordered list of steps (label key, resource, value before, change, value after, data cards). The allocation screen runs it as a preview on every cell moved, so the math updates live. The night screen animates the steps one by one, always in the same order. Optionally the child picks the result among three options before it is shown; a correct pick earns the stripe "spot-on forecast", a wrong pick costs nothing. In assisted mode the math runs slower and can be replayed.

**Consequences.** One function feeds preview, animation, sol log and tests. Each step must be testable on its own (`after = before + delta`).
