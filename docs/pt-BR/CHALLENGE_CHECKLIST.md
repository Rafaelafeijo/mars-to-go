# Checklist do desafio e da submissão

> Versão em inglês (padrão): [`docs/en/CHALLENGE_CHECKLIST.md`](../en/CHALLENGE_CHECKLIST.md).

Conferir este arquivo **antes de planejar cada fatia e antes de cada commit que muda o jogo**. Fonte: `docs/CHALLENGE_STATEMENT.md` (texto oficial) e o Project Submission Guide de 13 de novembro de 2026. Se um item não puder ser cumprido, registrar o motivo em `docs/pt-BR/adr/`.

**Situação revista em 15/11/2026** com base no código do commit `d77d8d2`. `[x]` = cumprido, com onde; `[ ]` = não cumprido ou ainda não conferido, com o que falta. "Parcial" quer dizer que parte do item está cumprida.

## A. A pergunta que decide tudo

> Uma criança de 7 a 12 anos sai do jogo entendendo uma restrição real de sobreviver no espaço profundo, e não só tendo se divertido?

Se a resposta para a fatia em andamento for "não", ela não está pronta. Evidência até agora: os testes com criança no `PLAYTEST.md` (um testador, de 8 anos); a ADR-0033 foi escrita porque a primeira versão não tinha dilema de verdade.

## B. Exigências do objetivo

- [x] **B1. É um jogo ou app interativo que funciona.** Publicado em https://rafaelafeijo.github.io/mars-to-go/; as missões 1 e 2 são jogadas de ponta a ponta pelo teste automático do CI (`scripts/playthrough.mjs`).
- [x] **B2. Público de 7 a 12 anos.** Textos das fichas em linguagem de criança (`packages/content/src/cards.ts`), números inteiros pequenos (10 células, 5 de ar); testado com uma criança de 8 anos (`PLAYTEST.md`). Só um testador até agora.
- [x] **B3. O jogador administra um posto avançado** — uma base em Jezero, Marte, num mundo 3D (ADR-0032).
- [x] **B4. Decisões reais sobre os cinco temas:**
  - [x] suporte à vida — Máquina de ar: 1 célula → 1 de ar; a tripulação respira 5 por sol
  - [x] blindagem contra radiação — células no Escudo contra eventos reais do DONKI; limite de dose (ADR-0033)
  - [x] orçamento de energia — 10 células por sol, 3 sempre para o aquecimento, células perdidas depois de dano por radiação
  - [x] produção de alimentos — Estufa: plantar hoje, colher 2 sóis depois
  - [x] atraso de comunicação — Perguntar à Terra só responde à noite; desligado na crise de 10 segundos
- [x] **B5. As consequências aparecem ao longo de uma missão simulada.** 7 sóis; ar, comida, dose, células perdidas e colheitas passam de um sol para o outro (`packages/sim`); gráfico final e "voltar ao sol em que tudo mudou".
- [x] **B6. Nenhuma escolha é grátis.** Toda célula sai das mesmas 10; o rover custa células, ar e dose; Perguntar à Terra custa uma célula; na crise, cada célula passada custa o que ela fazia.
- [ ] **B7. A mecânica de troca fica clara o bastante para a criança explicar.** Parcial: a conta ao vivo, as linhas de projeção e o relatório da noite mostram a troca; ainda não confirmado num teste com criança das missões 1 e 2 na forma atual.
- [x] **B8. Dados abertos reais da NASA sustentam a simulação.** Eventos do DONKI, RAD do Curiosity, MOXIE, Mars Fact Sheet, BVAD, Veggie (`science.ts`, `catalog.ts`, `DATA_MAP.md`).

## C. Armadilhas que o texto manda evitar

- [x] **C1. Não existe escolha "segura" sem custo.** Blindar todo sol deixa pouca energia (ADR-0034); só ar e comida falha o objetivo da amostra (ADR-0033, ADR-0035).
- [x] **C2. Acabamento visual não substitui mecânica correta.** Toda regra está em `packages/sim` com testes, escritos antes das telas.
- [x] **C3. Dois ou três recursos centrais.** Energia, ar, comida (regra 3 do CLAUDE.md); a dose é um limite, não um quarto medidor para gastar.
- [x] **C4. Não é abstrato demais nem técnico demais.** Fatos ligados à decisão que explicam (fato do sol, fichas).
- [ ] **C5. Não é só educativo nem só entretenimento.** Parcial: precisa do próximo teste com criança para confirmar.
- [x] **C6. Dado estático nunca é apresentado como ao vivo.** As missões usam um arquivo datado; "O Sol nesta semana" lê o DONKI ao vivo pelo serviço de API no Railway (selo "AO VIVO" com a hora da leitura); se o serviço não responder, mostra a cópia datada, identificada como cópia.

## D. Público e acesso

- [x] **D1. Linguagem simples; termos explicados em uma frase** (sol, erupção, CME, micrograys, milisievert, tau, coronógrafo nas fichas).
- [x] **D2. Roda no navegador, sem download e sem conta.**
- [ ] **D3. Irmãos mais velhos, pais ou sala de aula** (opcional). As fichas e o painel de dados da NASA ajudam os adultos; não há modo para sala de aula.

## E. Dados reais

- [x] **E1. Pelo menos um dado ou recurso da NASA é usado.** DONKI (e outros, `NASA_SOURCES` em `facts.ts`).
- [x] **E2. As fontes são creditadas dentro do jogo.** Selos, fichas, selos FOTO REAL, painel de dados da NASA.
- [x] **E3. Cada dado mostra se é ao vivo ou de arquivo, com a data.** As fichas mostram a data; "O Sol nesta semana" mostra "AO VIVO" e a hora da leitura, ou a hora da cópia.
- [x] **E4. Conjunto curado embutido como alternativa.** As missões rodam só com o catálogo embutido; o painel da tela inicial passa do ao vivo para a cópia datada, e some se os dois faltarem.
- **E5. Fontes sugeridas pelo desafio:**
  - [x] DONKI — eventos das missões, resposta da Antena, "O Sol nesta semana"
  - [ ] Dosimetria do RadLab / OSDR — **não usada** (ADR-0026); a radiação vem do RAD do Curiosity, em Marte
  - [ ] Achados de saúde do OSDR — **não usados** (cortados, ADR-0031)
  - [ ] Mars Trek — **não usado**; a vista da órbita é a foto PIA23239
  - [ ] NASA Open APIs (api.nasa.gov) — **não usadas** (o DONKI é lido direto no CCMC, ADR-0027)
  - [ ] Material da CSA sobre alimentos na Lua — **não usado**

## F. O que faz a solução se destacar

- [ ] **F1. A escolha no jogo se liga a uma consequência do mundo real.** Parcial: a decisão de blindagem usa eventos reais do DONKI de maio de 2024, com as datas; o clima espacial atual aparece ao vivo na tela inicial, mas ainda não entra nas missões.
- [ ] **F2. Rejogabilidade.** Parcial: duas missões com eventos diferentes; falhar termina com uma causa clara e uma nova tentativa.
  - [x] "Jogar esta missão de novo com outro plano?" no fim (`EndScreen.tsx`)
  - [x] "Voltar ao sol em que tudo mudou" depois de um retorno antecipado
  - [ ] Progresso salvo no aparelho, com código da missão — **não feito**: as regras do código existem em `packages/sim/src/code.ts`, mas o app só salva o idioma
- [x] **F3. Origem científica verificável em toda tela.** Fichas de dados (ADR-0014) e o painel de dados da NASA.

## G. Submissão (Project Submission Guide)

- [ ] **G1. Prazo:** submeter antes de domingo, 15 de novembro, 23h59 (horário local de quem criou o time).
- [ ] **G2. Todos os campos obrigatórios preenchidos**, em inglês — rascunhos guardados fora do repositório público:
  - [ ] Project Name
  - [ ] High-Level Project Summary
  - [ ] Link to Project Demo (link do vídeo ainda é um espaço reservado)
  - [ ] Link to Final Project
  - [ ] Detailed Project Description
  - [ ] Use of Super Intelligence (SI) (rascunho fora do repositório público)
  - [ ] NASA Data
  - [ ] Space Agency Partner Data and Other References
- [x] **G3. Demo:** vídeo de 29 segundos, https://youtu.be/zaAPhmpyvIg (fotos reais da NASA, imagens reais do jogo, legendas em inglês; narração por IA declarada).
  - [x] Vídeo com narração e imagens do jogo
  - [ ] Slides de apoio — não feitos (a demo é o vídeo)
  - [x] Código e provas: seções 3, 6 e 10 do README (regras, constantes, testes) e o endereço do repositório
- [ ] **G4. Idioma:** o repositório tem o inglês como padrão e traduções em português ✓; página do projeto, vídeo e slides ainda por fazer.
- [ ] **G5. Links públicos**, testados em janela anônima — fazer antes de submeter.
  - [x] O jogo público é o GitHub Pages (também no campo "Website" do repositório); o Railway roda o serviço de API e uma cópia de reserva do jogo
  - [x] O jogo funciona inteiro sem a API: só "O Sol nesta semana" a chama, e volta para a cópia datada se ela falhar
- [ ] **G6. Slides:** nome do time, nomes dos membros, desafio — por fazer.
- [x] **G7. Nenhuma imagem, vídeo, áudio ou semelhança de menores de 18 anos** no jogo e no repositório (conferências do ASSETS.md; o `PLAYTEST.md` registra só fatos). Continuar conferindo na demo e na página.
- [x] **G8. Uso de IA declarado** — `AI_USAGE.md`; nenhuma mídia gerada por IA no jogo; a narração do vídeo de demonstração é voz sintética por IA (Kokoro-82M), declarada na tela, na descrição e nos metadados do arquivo.
- [x] **G9. Tudo o que foi usado está listado** — `ASSETS.md` (imagens, modelos 3D, fonte), `package.json` / `pnpm-lock.yaml` (bibliotecas).
- [ ] **G10. Caixas "Terms and Conditions" e "Confirm All Work is Original"** — na submissão.
- [ ] **G11. Todos os membros confirmados no mesmo evento** — a confirmar no site do evento.
- [ ] **G12. Classificação no FortiGuard** (opcional) — não feita.
- [ ] **G13. Imagens na página do projeto** (JPG, PNG ou GIF de até 10 MB) — por preparar.

## H. Regras de participação que nos afetam

- [ ] **H1. Menor de 18 anos: registrado por responsável e acompanhado** — a confirmar pelo time (não dá para conferir no repositório).
- [x] **H2. Menor não usa foto própria.** O avatar é o astronauta do próprio jogo, desenhado no código.
- [ ] **H3. Um time, um desafio, no máximo seis pessoas** — a confirmar pelo time.
- [x] **H4. O trabalho acontece dentro do período do evento.** Commits de 14/11/2026 a 15/11/2026; histórico não reescrito (regra 13 do CLAUDE.md).

## I. Critérios de julgamento

| Critério | O que defendemos | Pergunta de conferência | Situação |
| --- | --- | --- | --- |
| Impact | Manter vivo em crianças e adolescentes o sonho de conhecer o universo profundo, treinando raciocínio lógico, matemática, física, ciências, criatividade, autonomia e coragem | A fatia desenvolve alguma dessas habilidades de forma visível? | Conta ao vivo e planejamento a cada sol |
| Creativity | Não há resposta única: a criança vê o impacto de cada escolha; pode explorar a base e o ambiente; avatar personalizável | Existem pelo menos dois planos diferentes que funcionam? | Base 3D para explorar; avatar não personalizável (cortado) |
| Validity | Lógica científica e matemática definida e validada antes das telas; dados reais de clima espacial, terreno e ambiente | Cada número tem ficha completa (seção J) e cada conta tem teste? | Fichas e testes prontos |
| Relevance | Os cinco temas do desafio jogáveis; adesão item a item a este checklist | Os itens B1 a B8 estão todos marcados? | B7 espera um teste com criança |
| Presentation | Linguagem inspiradora e impacto real na formação de crianças, junto com a prova de adesão aos requisitos, do uso de dados e do método | A página do projeto e a demo mostram o jogo, os dados e o código? | Página e demo por fazer |

A maior parte da avaliação vem da página do projeto; a demo pesa no critério Presentation.

## J. Visibilidade dos dados, sempre

Todo dado que aparece no jogo responde a três perguntas, na própria tela: **de onde veio, como foi tratado e como o jogo usa.**

- [x] **J1. Selo de origem nos números com dado real** (`apps/web/src/cards/Badge.tsx`); rótulo, fonte, lugar e data na ficha.
- [x] **J2. Um toque abre a ficha do dado** (`CardDialog.tsx`) com:
  - [x] Fonte, com link e identificador do registro
  - [x] Onde e quando foi medido
  - [x] Como foi tratado
  - [x] Como o jogo usa
  - [x] O que foi simplificado e por quê
- [x] **J3. "Quero entender mais"** com um exemplo do dia a dia em toda ficha.
- [ ] **J4. Página "A ciência por trás" e arquivo público com todas as fichas** — **não feito**. Os dados estão prontos em `cards.ts` e `science.ts`; por enquanto `SCIENCE.md` e `DATA_MAP.md` atendem os jurados.
- [x] **J5. Nenhuma tela mostra dado sem ficha.** O `cards.test.ts` confere as fichas contra o `science.ts`; fichas pendentes ficam escondidas (ADR-0024).
- [x] **J6. Validação antes das telas.** SIM_MODEL, DATA_MAP e ARCHITECTURE aprovados na Fase 0; ADR-0033 a ADR-0035 aprovadas antes das suas telas.

## K. Marte de verdade e paralelos declarados

O jogo se passa em Marte. Dado que não foi medido em Marte só entra como paralelo, e o paralelo aparece sempre.

- [x] **K1. Todo dado traz o lugar da medição** (`place` no `science.ts` e nas fichas; selos das fotos).
- [x] **K2. Paralelo declarado na ficha** (campo `parallel`; legendas como "Na Terra … Não é em Marte", "um paralelo com a Lua").
- [x] **K3. Paralelo só entra com justificativa no `SCIENCE.md`.** A seção 4 lista P1–P16. Dois detalhes visuais/de texto estão marcados "a confirmar" lá (cores dos LEDs do Veggie, pressão do traje) e não aparecem como número.
- [x] **K4. Material lunar da CSA** — não é usado, então nenhum número lunar aparece como marciano.
- [x] **K5. Os desafios próprios de Marte aparecem, cada um com fonte:** ar fino de CO₂ (M1), menos luz do Sol (M2), tempestades de poeira (M3, ficha da poeira; nenhuma missão tem sol de poeira ainda), frio (M4), solo (M5), gravidade (M6), atraso de rádio (M9).
- [x] **K6. Evento solar não é dose em Marte.** Erupções nunca aumentam a dose (chegada a Marte desconhecida); CMEs precisam de previsão do WSA-ENLIL em Marte; dois alarmes falsos mostram previsões do modelo na Psyche; o risco 3 exige uma medição em Marte.

## L. Idiomas

- [x] **L1. O jogo é bilíngue** (`packages/content/src/locales/en.json`, `pt-BR.json`; `locales.test.ts`).
- [x] **L2. Código em inglês.**
- [x] **L3. Documentação bilíngue** (`docs/en/`, `docs/pt-BR/`).
- [x] **L4. README em inglês**, com `README.pt-BR.md`.
- [ ] **L5. Página do projeto, demo e slides em inglês** — demo feita em inglês; página do projeto em rascunho fora do repositório; sem slides.
