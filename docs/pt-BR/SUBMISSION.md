# Project page — working draft

> Rascunho dos campos da página do projeto no site do Space Apps. Os textos em inglês são para colar; o que está entre colchetes precisa ser preenchido com o que foi de fato construído. Não afirmar nada que o jogo ainda não faça.
> Prazo: "Submit for Judging" até domingo, 15 de novembro, 23h59 (Brasília). Salvar com frequência; dá para reenviar até o fim.

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

Repositório: `[public GitHub URL]` (citar na descrição detalhada).

## Detailed Project Description

Estrutura sugerida; escrever em inglês depois que o jogo existir.

```
WHAT IT DOES
[2–3 sentences: the sol loop, the three resources, the five decisions.]

WHAT MAKES IT DIFFERENT
[Only what is true in the game: the math of every decision solved live on screen; an origin label on every number; a solar event measured on Mars (2024-05-20) as the anchor; radio delay as a mechanic; tested with a real child, changes documented; playable on any phone, no account, two languages, assisted mode.]

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

TESTED WITH A REAL CHILD
[Facts only, from docs/en/PLAYTEST.md: what was observed when an 8-year-old played on a phone, and what changed (up to three fixes, each with its commit). No name, image or voice of the child.]

BENEFITS AND WHAT WE HOPE TO ACHIEVE
[Public understanding of what survival in deep space requires.]

TOOLS
TypeScript, React, Vite, [API framework], pnpm, Vitest, Python (data preparation), Railway, GitHub.

LIMITATIONS
[Honest list: what is simplified, what is scenario, what is not modeled.]
```

## Use of Super Intelligence (SI)

Responder com o que de fato aconteceu. O guia permite IA como ferramenta, pede que se indique onde e como foi usada, e diz que ela não deve ser usada para criar a ideia de como resolver o desafio. Este campo não é mostrado aos jurados, mas a resposta precisa ser verdadeira.

```
Yes. [Describe truthfully, for example:]
- Claude (Anthropic), including Claude Code: [research support / design documentation / suggestions of game mechanics / code generation and review / translation].
- [Other tools, if any, and what for.]
SI-generated code is acknowledged in the repository (docs/AI_USAGE.md and commit messages).
[If any image, video or audio was generated: where it is and how it is marked.]
No NASA branding appears in any generated content.
```

## NASA Data

Listar só o que entrou no jogo. Pelo menos um é obrigatório para concorrer a prêmio global.

```
- DONKI (CCMC Space Weather Database Of Notifications, Knowledge, Information): [which event types], used to [drive the solar storm events and shielding decisions]. [Live via API / curated archive of N real events, dated in-game.]
- OSDR RadLab: [ISS dosimetry readings used as real-world context for shielding; labeled as measured on the ISS].
- OSDR (Open Science Data Repository): [study IDs and findings shown as science cards].
- Mars Trek: [imagery / distances for the base site and research sites in Jezero Crater].
- [MOXIE results, Perseverance: reference for oxygen production; scaling declared as scenario.]
- [NASA images used, with IDs and credits.]
```

## Space Agency Partner Data and Other References

Listar tudo: código, textos, imagens, bibliotecas, mesmo abertos.

```
- CSA (Canadian Space Agency): [Food production toolkit, used for greenhouse facts].
- Open-source libraries: [React, Vite, …].
- Art, icons, fonts, sounds: [name, author, license].
- References: [papers and pages cited in docs/SCIENCE.md].
```

---

# Demo

O link de demo é o **vídeo** com narração e imagens do jogo rodando. Os slides são material de apoio, ligados na descrição detalhada. O guia sugere a ordem abaixo. Nenhuma imagem, voz ou vídeo de menor de 18 anos.

**Show me the code:** o vídeo reserva dois ou três segundos para código real na tela (a ficha de constantes com rótulo e fonte, e os testes passando), e mostra o endereço do repositório. Nos slides, o código tem um slide próprio.

## Demo principal — vídeo de até 30 segundos

Cronometrar antes de publicar; passar de 30 segundos tira o projeto do julgamento global. Legendas em inglês.

| Tempo | O que o guia pede | Fala | Tela |
| --- | --- | --- | --- |
| 0:00 | Nome e time | I'm Rafaela, Team Rochette. | Nome do time |
| 0:02 | Desafio e inspiração | We chose the Junior Astronaut Mission Trainer because the dream of Mars starts in childhood. | Jezero real; legenda: *Built by a mom, tested by her 8-year-old.* |
| 0:05 | Título e chamada | This is Mars to Go: ten seconds to go. | Tela inicial do jogo |
| 0:10 | Como funciona e dados da NASA | Kids run a Mars base: ten power cells a day, split between air, food and shielding. Real solar storms from NASA's DONKI force ten-second decisions. | Distribuição de células; crise com relógio; ficha do dado aberta; corte rápido para o código com a constante rotulada e os testes passando |
| 0:20 | O futuro | The first person on Mars is a child today. We want her to know the way home. | A Terra no céu de Marte; endereço do jogo |

São cerca de 70 palavras; ensaiar com cronômetro e cortar se passar.

## Slides de apoio — até 7, em inglês

1. **Title:** Mars to Go — 10 seconds to go. Team Rochette. Challenge: Build a Junior Astronaut Mission Trainer. Team members: [nomes como forem registrados; para o menor, decidir entre primeiro nome ou "and son"].
2. **The dream:** from the Moon to Mars; the dream starts in childhood and needs fuel.
3. **The gap:** kids see mission outcomes, never the trade-offs.
4. **The game:** 7 sols, 10 power cells, three resources; no choice is free. Screenshot.
5. **Real NASA data:** DONKI, RadLab, OSDR, Mars Trek; measured vs. scenario vs. simplification; a data card open in the game.
6. **Show me the code:** the labeled constant in `science.ts`, a passing test, the architecture in one diagram, the repository URL.
7. **The heart and the reach:** ten seconds, Earth can't answer in time; everyone comes home. Browser, no account, low-end phones, Portuguese and English, assisted mode. Built by a mom, tested by her 8-year-old. Closing line.

---

# Antes de clicar em "Submit for Judging"

- [ ] Todos os campos preenchidos, em inglês
- [ ] Demo dentro do limite (cronometrada ou contada)
- [ ] Links abertos em janela anônima, sem login
- [ ] Jogo abre no celular pelo link público
- [ ] Nenhuma imagem, voz ou vídeo de menor
- [ ] Nenhum logotipo, insígnia ou identificador de missão da NASA
- [ ] Declaração de IA verdadeira e completa
- [ ] Lista de dados da NASA bate com o que está no jogo
- [ ] Lista de recursos de terceiros bate com `docs/ASSETS.md`
- [ ] Caixas de termos e de originalidade marcadas
- [ ] Banner de confirmação apareceu
