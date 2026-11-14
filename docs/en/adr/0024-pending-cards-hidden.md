# ADR-0024 — Data with a pending card is hidden, not a build failure

Status: accepted, 2026-11-14. Refines ADR-0014.

**Context.** Rule 16 says no card, no screen. Failing the build on any pending card would block deploys during a weekend hackathon for reasons unrelated to what is on screen.

**Decision.** A data point whose card is incomplete or marked pending is hidden from every screen, the science page and the public JSON. The build lists hidden items in a report but does not fail, and the deploy goes on.

**Consequences.** Screens must work when a data point is hidden (no empty boxes). The report is checked before each phase commit.
