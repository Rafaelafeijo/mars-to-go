# Uso de IA

> Versão em inglês (padrão): [`docs/en/AI_USAGE.md`](../en/AI_USAGE.md). Mantido atualizado durante o evento (regra 12 do CLAUDE.md). Última atualização: 15/11/2026.

## Resumo

- **A ideia do jogo, o design e todas as decisões são do time.** O briefing, o checklist do desafio e as ADRs iniciais foram escritos pelo time antes de programar. As ADRs seguintes (até a ADR-0035) registram decisões que o time tomou depois de revisões de design e testes com criança.
- **O código e a documentação são gerados com Claude Code (Anthropic) e revisados pelo time.** Muitas mensagens de commit dizem isso ("Generated with Claude Code, reviewed by the team."); este arquivo é o registro completo.
- **Pesquisa e conferência de fatos:** subagentes do Claude Code buscaram e leram fontes da NASA (registros do DONKI, artigos da NASA, páginas do Photojournal e do images.nasa.gov, relatórios do NTRS, briefs da NASA-STD-3001) e trouxeram citações e valores. Todo número do jogo vem de uma fonte listada em `packages/sim/src/science.ts`, `DATA_MAP.md` e `SCIENCE.md`; valores que não puderam ser confirmados ficam marcados "a confirmar" e não aparecem.
- **Nenhuma imagem, vídeo ou áudio gerado por IA está no jogo.** Toda foto é uma imagem real da NASA (ASSETS.md, 15 imagens, só recorte e redimensionamento). Os modelos 3D são pacotes CC0 da Kenney. O astronauta, o terreno, o céu e o conjunto de ícones são desenhados no código (primitivas do three.js e SVG). Se algum dia uma mídia de IA for usada, ela terá marca d'água visível e o selo "ILUSTRAÇÃO", e será listada abaixo.

## Registro

| Data | Ferramenta | O quê | Revisado por |
| --- | --- | --- | --- |
| 2026-11-14 | Claude Code | Fase 0: testes reais das APIs (DONKI, RadLab, OSDR, Mars Trek, CSA), verificação das fontes das constantes científicas, rascunhos de SIM_MODEL, DATA_MAP, ARCHITECTURE, ADR-0019 a ADR-0027 a partir das decisões do time | Time (aprovado) |
| 2026-11-14 | Claude Code | Traduções da documentação entre inglês e português | Time |
| 2026-11-14 | Claude Code | Fase 1: esqueleto do monorepo, API, workflows de CI e deploy, README | Time |
| 2026-11-14 | Claude Code | Busca de candidatas a imagens reais da NASA (nenhuma imagem gerada) | Time escolheu |
| 2026-11-14 | Claude Code | Download, recorte e redimensionamento das 10 imagens da NASA escolhidas (sem melhoria por IA) | Time |
| 2026-11-14 | Claude Code | Criação do projeto e publicação no Railway, com o aval do time | Time |
| 2026-11-14 | Claude Code | Fase 2: código e testes da simulação (`packages/sim`) a partir do SIM_MODEL aprovado | Time |
| 2026-11-14 | Claude Code | Fase 3: telas, texto das fichas em EN e PT (redigido a partir do DATA_MAP, fontes conferidas), teste automático de ponta a ponta | Time |
| 2026-11-14/15 | Claude Code | Fase 3B: projeção com testes (ADR-0031), sol em uma tela, protótipo do mundo 3D (ADR-0032) com modelos CC0 da Kenney, o astronauta e o conjunto de ícones desenhados no código | Time |
| 2026-11-14/15 | Claude Code | Mudanças depois dos testes com criança e das revisões de design A–F: tela inicial, briefing, vista do céu, relatório, crise com escolhas, fonte de texto legível | Time |
| 2026-11-15 | Claude Code | Regras e testes da simulação para a ADR-0033 (limite de dose, dano por radiação, amostras, três resultados) e a ADR-0035 (lugar do rover, frente do delta) | Time (ADRs aprovadas) |
| 2026-11-15 | Claude Code (subagentes) | Pesquisa da missão 2: registros de erupções, CMEs e WSA-ENLIL do DONKI de maio de 2024; release 2024-080 da NASA; fatos da missão 2 lidos no NTRS 20160004210, NTRS 20210000827, NASA-SP-2009-566, briefs da NASA-STD-3001, PIA24033; busca de mais cinco fotos reais da NASA (linhas 11–15 do ASSETS, nenhuma imagem gerada) | Time escolheu |
| 2026-11-15 | Claude Code | Missão 2 "A tempestade de maio" (ADR-0034): catálogo, fichas e fatos em EN e PT, crise, teste de ponta a ponta da missão 2 | Time |
| 2026-11-15 | Claude Code | "O Sol nesta semana" na tela inicial, a partir da cópia do DONKI | Time |
| 2026-11-15 | Claude Code | Documentação alinhada com o código: SCIENCE, DATA_MAP, STATUS, AI_USAGE, CHALLENGE_CHECKLIST (EN e PT) | Time |

## Mídia gerada

Nenhuma.
