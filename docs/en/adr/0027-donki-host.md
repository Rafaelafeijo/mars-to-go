# ADR-0027 — DONKI from the CCMC host, without a key

Status: accepted, 2026-11-14. Refines ADR-0004.

**Context.** Real calls on 2026-11-14: `https://ccmc.gsfc.nasa.gov/DONKI/WS/get/*` answered with CORS `*` and no key; `kauai.ccmc.gsfc.nasa.gov` timed out; `api.nasa.gov/DONKI/FLR` returned 404 while other routes returned 200.

**Decision.** The API (live layer), the snapshot job and the data scripts call `ccmc.gsfc.nasa.gov/DONKI/WS/get`. The NASA API key is kept for other NASA APIs only, in `.env`, never in the repo or the browser.

**Consequences.** One host to monitor; the three-layer fallback (ADR-0004) covers its outages.
