# Challenge and submission checklist

> Portuguese version: [`docs/pt-BR/CHALLENGE_CHECKLIST.md`](../pt-BR/CHALLENGE_CHECKLIST.md).

Check this file **before planning each slice and before every commit that changes the game**. Source: `docs/CHALLENGE_STATEMENT.md` (official text) and the Project Submission Guide of November 13, 2026. If an item cannot be met, record the reason in `docs/en/adr/`.

## A. The question that decides everything

> Does a child aged 7 to 12 leave the game understanding a real constraint of surviving in deep space, and not just having had fun?

If the answer for the slice in progress is "no", it is not ready.

## B. Objective requirements

- [ ] **B1. It is a working game or interactive app** (playable prototype, not a video or slides).
- [ ] **B2. Audience of 7 to 12 years old.** Text and math fit that range.
- [ ] **B3. The player manages an outpost**, lunar or Martian (ours: a base in Jezero, Mars).
- [ ] **B4. Real decisions about the five themes:**
  - [ ] life support
  - [ ] radiation shielding
  - [ ] power budgeting
  - [ ] food production
  - [ ] communication delay
- [ ] **B5. Consequences play out over a simulated mission** (one sol's choices affect the following ones).
- [ ] **B6. No choice is free.** Every option costs something visible.
- [ ] **B7. The trade-off mechanic is clear** enough for the child to explain it in their own words ("I saved energy today and ran short of oxygen tomorrow").
- [ ] **B8. Real NASA open data supports the simulation**, instead of made-up numbers.

## C. Pitfalls the text says to avoid

- [ ] **C1. There is no "safe" choice without a cost.**
- [ ] **C2. Visual polish does not replace correct mechanics.** A simple game that teaches a real constraint is worth more than a pretty one that doesn't teach.
- [ ] **C3. Two or three core resources**, not five or six at the same time.
- [ ] **C4. Not too abstract** (loose facts) **nor too technical** for the age.
- [ ] **C5. Not only educational** (loses attention) **nor only entertainment** (loses accuracy).
- [ ] **C6. Static data is never presented as live.**

## D. Audience and access

- [ ] **D1. Simple language.** Unavoidable scientific terms (radiation dose, sol, microgravity) are explained right there, in one sentence.
- [ ] **D2. Runs in the browser, with no download and no account.**
- [ ] **D3. Can also serve older siblings, parents or a classroom** (optional).

## E. Real data

- [ ] **E1. At least one NASA dataset or resource is used** (a condition for a global award).
- [ ] **E2. Sources are credited inside the game**, so the child knows it is real science.
- [ ] **E3. Each piece of data shows whether it is live or archive, with the date.**
- [ ] **E4. A built-in curated set as a fallback** when the live call fails.
- [ ] **E5. Sources suggested by the challenge, in our order of priority:**
  - [ ] DONKI (space weather: flares, ejections, particles) — radiation and communication
  - [ ] RadLab / OSDR (real dosimetry on the Space Station) — shielding
  - [ ] OSDR (real astronaut health findings) — science cards
  - [ ] Mars Trek (real imagery and terrain) — base site
  - [ ] NASA Open APIs (free key)
  - [ ] CSA: material on food production on the Moon (partner) — only general greenhouse principles, always as a declared parallel (see section K)

## F. What makes the solution stand out

- [ ] **F1. The in-game choice connects to a real-world consequence**: the shielding decision uses real DONKI space weather, with the date on screen. Fallback chain: live API → daily snapshot written into the site → archive catalog.
- [ ] **F2. Replayability:** events vary every game; failing teaches and doesn't punish.
  - [ ] At the end of each mission, completed or not, the game asks: "Play this mission again with another plan?"
  - [ ] After an early return, it also offers "Go back to the sol where everything changed".
  - [ ] Progress is saved on the device, with no account. A "mission code" lets you continue on another device.
- [ ] **F3. Scientific origin and feasibility verifiable on every screen**, not only in the README (see section J).

## G. Submission (Project Submission Guide)

- [ ] **G1. Deadline:** "Submit for Judging" before Sunday, November 15, 11:59 p.m., in the local time of whoever created the team (Universal Event). Save often; only the last saved version is judged.
- [ ] **G2. All required fields filled in**, in English:
  - [ ] Project Name
  - [ ] High-Level Project Summary
  - [ ] Link to Project Demo
  - [ ] Link to Final Project
  - [ ] Detailed Project Description
  - [ ] Use of Super Intelligence (SI)
  - [ ] NASA Data
  - [ ] Space Agency Partner Data and Other References
- [ ] **G3. Demo:** a video of up to 30 seconds **or** up to 7 slides (counting title and introduction). Going over the limit removes the project from global judging.
  - [ ] Main format: video with narration and footage of the game running.
  - [ ] Supporting slides in parallel, linked in the detailed description.
  - [ ] "Show me the code": the video and the slides show a real excerpt of the code (the constants sheet with labels and a passing test) and the repository address.
- [ ] **G4. Language:** project page and linked materials in English (a guide requirement). The video may be spoken in another language, with English subtitles. Slides in English. In the repository, English is the default and Portuguese appears as an identified translation.
- [ ] **G5. Public links**, with no password, permission or sign-up. Test in an incognito window.
  - [ ] The final project link points to the game's primary address (GitHub Pages); the Railway address stays as a mirror.
  - [ ] The game works fully even if the API is unreachable.
- [ ] **G6. Slides (if that is the format):** team name, member names, chosen challenge.
- [ ] **G7. No image, video, audio or likeness of anyone under 18** in the demo, the project, the avatar or the team page.
- [ ] **G8. AI use declared**, stating where and how. Generated images and video: visible watermark. Generated audio, code and data: declared in text and metadata. No NASA brand, logo, flag or mission identifier in generated content.
- [ ] **G9. Everything used is listed** (code, text, images, even open ones). Copyrighted material only with permission.
- [ ] **G10. "Terms and Conditions" and "Confirm All Work is Original" boxes** checked truthfully.
- [ ] **G11. All members confirmed in the same event** (Universal Event).
- [ ] **G12. New site:** request classification in the FortiGuard Web Filter to reduce the risk of being blocked on the judges' network (optional, recommended).
- [ ] **G13. Images on the project page:** JPG, PNG or GIF up to 10 MB.

## H. Participation rules that affect us

- [ ] **H1. Under 18:** registered by a parent or guardian and accompanied at all times.
- [ ] **H2. A minor does not use their own photo** as an avatar or on the team page. A portrait recreated by AI from his photo is still his likeness: use an avatar that does not represent him (rocket, rock, planet).
- [ ] **H3. One team, one challenge.** Six people at most.
- [ ] **H4. Work on the challenge happens within the event period.**

## I. Judging criteria

| Criterion | What we stand for | Check question |
| --- | --- | --- |
| Impact | Keeping alive in children and teenagers the dream of knowing the deep universe, training logical reasoning, math, physics, science, creativity, autonomy and courage | Does the slice visibly develop any of these skills? |
| Creativity | There is no single answer: the child sees the impact of each choice; can explore the base and the environment; customizable avatar | Are there at least two different plans that work? |
| Validity | Scientific and mathematical logic defined and validated before the screens; real data on space weather, terrain and environment | Does every number have a complete card (section J) and every calculation a test? |
| Relevance | The challenge's five themes playable; item-by-item adherence to this checklist | Are items B1 to B8 all checked? |
| Presentation | Inspiring language and real impact on children's education, together with proof of adherence to the requirements, of data use and of the method | Do the project page and the demo show the game, the data and the code? |

Most of the evaluation comes from the project page; the demo weighs on the Presentation criterion.

## J. Data visibility, always

Every piece of data that appears in the game answers three questions, on the screen itself: **where it came from, how it was processed and how the game uses it.**

- [ ] **J1. Origin badge on every number**: label (measured, scenario, simplification), source, place and date.
- [ ] **J2. One tap opens the data card** with:
  - [ ] Source, with link and identifier of the original record
  - [ ] Where and when it was measured
  - [ ] How it was processed (filtered, rounded, converted, grouped)
  - [ ] How the game uses it (which rule, which calculation)
  - [ ] What was simplified and why
- [ ] **J3. "I want to understand better"**: a longer explanation, in kid language, with a practical everyday example (phone battery, allowance, water bottle, sunscreen) and where it applies outside the game.
- [ ] **J4. Same information for the judges**: a "The science behind" page and a public file with all the cards, generated from the same place that feeds the screens.
- [ ] **J5. No screen shows data without a card.** New data only goes in after its card is complete.
- [ ] **J6. Validation before screens**: the data map and the simulation model are reviewed and approved before any interface that depends on them.

## K. The real Mars and declared parallels

The game takes place on Mars. Data that was not measured on Mars only goes in as a parallel, and the parallel is always shown.

- [ ] **K1. Every piece of data shows the place of measurement** (Mars, Space Station, Sun, Earth, Moon).
- [ ] **K2. Parallel declared on the card**: why it works for the Martian base and what is different on Mars.
- [ ] **K3. A parallel only goes in with a scientific justification** recorded in `docs/en/SCIENCE.md`, with a source. Without a justification, the data stays out.
- [ ] **K4. CSA lunar material**: use only general principles of growing crops in a closed environment. Do not use lunar numbers as if they were Martian.
- [ ] **K5. Mars's own challenges appear in the game**, each with a verified source: thin CO₂ atmosphere, less sunlight than on Earth, dust storms, cold, soil not directly usable for planting, lower gravity, radio delay.
- [ ] **K6. A solar event is not a dose on Mars**: DONKI records what left the Sun; whether the event hits Mars depends on direction. The game says so.

## L. Languages

- [ ] **L1. The game is bilingual from the MVP**: Portuguese (language of creation) and English (universal).
- [ ] **L2. Code in English**: names, comments, commit messages.
- [ ] **L3. Bilingual documentation**: `docs/en/` and `docs/pt-BR/`, with English as the default.
- [ ] **L4. README in English**, with `README.pt-BR.md` next to it.
- [ ] **L5. Project page, demo and slides in English.**
