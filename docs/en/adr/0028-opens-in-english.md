# ADR-0028 — The game always opens in English

> Portuguese version: [`docs/pt-BR/adr/0028-abre-em-ingles.md`](../../pt-BR/adr/0028-abre-em-ingles.md)

Status: accepted, 2026-11-14. Amends ADR-0012.

**Context.** Judges open the submission link in English. Detecting the browser language would show Portuguese to some judges and make the demo unpredictable.

**Decision.** The game always opens in English. Portuguese is optional, through the PT/EN button at the top, and the manual choice is saved on the device. No browser-language detection.

**Consequences.** Both languages stay complete (ADR-0012). A Portuguese-speaking child taps PT once; the choice sticks on that device.
