# Project page — working draft

> Portuguese version: [`docs/pt-BR/SUBMISSION.md`](../pt-BR/SUBMISSION.md).

> Draft of the project page fields on the Space Apps site. The English texts are for pasting; whatever is in square brackets must be filled in with what was actually built. Do not claim anything the game does not do yet.
> Deadline: "Submit for Judging" by Sunday, November 15, 11:59 p.m. (Brasília). Save often; you can resubmit until the end.

---

## Project Name

```
Mars to Go
```

## High-Level Project Summary

```
Mars to Go is a browser game where kids ages 7–12 run a crewed base in Jezero Crater, Mars, for seven sols. Each sol they get ten power cells and must split them between life support, the greenhouse and radiation shielding — and there are never enough for everything. Real solar events from NASA's DONKI database trigger ten-second decisions, and communication delay means Earth cannot answer in time. Every choice shows its math and its cost, so a power cell saved today can be the oxygen missing tomorrow. The game needs no download and no account, runs on low-end phones, and labels every number as measured, scenario or simplification, with its NASA source. It matters because most kids only ever see the outcome of a space mission, never the trade-offs behind it.
```

## Link to Project Demo

```
[public link — 30-second video or 7-slide deck]
```

## Link to Final Project

```
[public game URL — GitHub Pages as primary; Railway mirror listed in the description]
```

Repository: `[public GitHub URL]` (mention it in the detailed description).

## Detailed Project Description

Suggested structure; write it in English once the game exists.

```
WHAT IT DOES
[2–3 sentences: the sol loop, the three resources, the five decisions.]

HOW IT WORKS
- The mission: 7 sols at a base in Jezero Crater.
- Power budgeting: 10 power cells per sol.
- Life support / Food production / Radiation shielding: where cells go, and what each one costs.
- Research trips: trading oxygen for a real discovery.
- Communication delay: asking Earth takes time; in a crisis the answer arrives too late.
- Ten-second crises: [list the ones actually built].
- The sol log: prediction vs. result, the math, the data source.

REAL NASA DATA IN THE GAME
[One line per dataset: what it is, where it appears, live or archived.]
Every number is labeled Measured, Scenario or Simplification. Archived data is never shown as live.

WHO IT IS FOR
Kids 7–12, with an assisted mode for the youngest. Browser-based, no download, no account, no personal data. English and Portuguese.

ACCESSIBILITY
[What was actually implemented: assisted mode, contrast, screen reader, reduced motion.]

WHAT WE LEARNED FROM OUR FIRST TESTER
[What changed in the game after an 8-year-old played it. Facts only.]

BENEFITS AND WHAT WE HOPE TO ACHIEVE
[Public understanding of what survival in deep space requires.]

TOOLS
TypeScript, React, Vite, [API framework], pnpm, Vitest, Python (data preparation), Railway, GitHub.

LIMITATIONS
[Honest list: what is simplified, what is scenario, what is not modeled.]
```

## Use of Super Intelligence (SI)

Answer with what actually happened. The guide allows AI as a tool, asks you to state where and how it was used, and says it must not be used to create the idea of how to solve the challenge. This field is not shown to the judges, but the answer must be true.

```
Yes. [Describe truthfully, for example:]
- Claude (Anthropic), including Claude Code: [research support / design documentation / suggestions of game mechanics / code generation and review / translation].
- [Other tools, if any, and what for.]
SI-generated code is acknowledged in the repository (docs/AI_USAGE.md and commit messages).
[If any image, video or audio was generated: where it is and how it is marked.]
No NASA branding appears in any generated content.
```

## NASA Data

List only what went into the game. At least one is required to compete for a global award.

```
- DONKI (CCMC Space Weather Database Of Notifications, Knowledge, Information): [which event types], used to [drive the solar storm events and shielding decisions]. [Live via API / curated archive of N real events, dated in-game.]
- OSDR RadLab: [ISS dosimetry readings used as real-world context for shielding; labeled as measured on the ISS].
- OSDR (Open Science Data Repository): [study IDs and findings shown as science cards].
- Mars Trek: [imagery / distances for the base site and research sites in Jezero Crater].
- [MOXIE results, Perseverance: reference for oxygen production; scaling declared as scenario.]
- [NASA images used, with IDs and credits.]
```

## Space Agency Partner Data and Other References

List everything: code, texts, images, libraries, even open ones.

```
- CSA (Canadian Space Agency): [Food production toolkit, used for greenhouse facts].
- Open-source libraries: [React, Vite, …].
- Art, icons, fonts, sounds: [name, author, license].
- References: [papers and pages cited in docs/SCIENCE.md].
```

---

# Demo

The demo link is the **video** with narration and footage of the game running. The slides are supporting material, linked in the detailed description. The guide suggests the order below. No image, voice or video of anyone under 18.

**Show me the code:** the video sets aside two or three seconds for real code on screen (the constants sheet with label and source, and the tests passing), and shows the repository address. In the slides, the code gets a slide of its own.

## Main demo — video of up to 30 seconds

Time it before publishing; going over 30 seconds removes the project from global judging. English subtitles.

| Time | What the guide asks for | Line | Screen |
| --- | --- | --- | --- |
| 0:00 | Name and team | I'm Rafaela, Team Rochette. | Team name |
| 0:02 | Challenge and inspiration | We chose the Junior Astronaut Mission Trainer because the dream of Mars starts in childhood. | Real Jezero; caption: *Built by a mom, tested by her 8-year-old.* |
| 0:05 | Title and tagline | This is Mars to Go: ten seconds to go. | Game home screen |
| 0:10 | How it works and NASA data | Kids run a Mars base: ten power cells a day, split between air, food and shielding. Real solar storms from NASA's DONKI force ten-second decisions. | Cell distribution; crisis with timer; data card open; quick cut to the code with the labeled constant and the tests passing |
| 0:20 | The future | The first person on Mars is a child today. We want her to know the way home. | Earth in the Martian sky; game address |

That is about 70 words; rehearse with a stopwatch and cut if it runs over.

## Supporting slides — up to 7, in English

1. **Title:** Mars to Go — 10 seconds to go. Team Rochette. Challenge: Build a Junior Astronaut Mission Trainer. Team members: [names as registered; for the minor, decide between first name or "and son"].
2. **The dream:** from the Moon to Mars; the dream starts in childhood and needs fuel.
3. **The gap:** kids see mission outcomes, never the trade-offs.
4. **The game:** 7 sols, 10 power cells, three resources; no choice is free. Screenshot.
5. **Real NASA data:** DONKI, RadLab, OSDR, Mars Trek; measured vs. scenario vs. simplification; a data card open in the game.
6. **Show me the code:** the labeled constant in `science.ts`, a passing test, the architecture in one diagram, the repository URL.
7. **The heart and the reach:** ten seconds, Earth can't answer in time; everyone comes home. Browser, no account, low-end phones, Portuguese and English, assisted mode. Built by a mom, tested by her 8-year-old. Closing line.

---

# Before clicking "Submit for Judging"

- [ ] All fields filled in, in English
- [ ] Demo within the limit (timed or counted)
- [ ] Links opened in an incognito window, without login
- [ ] Game opens on a phone from the public link
- [ ] No image, voice or video of a minor
- [ ] No NASA logo, insignia or mission identifier
- [ ] AI declaration true and complete
- [ ] NASA data list matches what is in the game
- [ ] Third-party resources list matches `docs/en/ASSETS.md`
- [ ] Terms and originality boxes checked
- [ ] Confirmation banner appeared
