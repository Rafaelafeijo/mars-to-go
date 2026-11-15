# Mars to Go

*Nenhuma escolha é grátis.* · [English](README.md)

Um jogo de navegador para crianças de 7 a 12 anos. Você comanda uma base tripulada na Cratera Jezero, em Marte, por 7 sóis (dias de Marte), e descobre do que depende a sobrevivência no espaço profundo: a energia sempre falta. A célula que protege a tripulação da radiação esta noite é o ar ou a comida que faltam amanhã. Todo evento solar do jogo é um registro real da NASA, e todo número mostra de onde vem.

- **Jogar:** https://rafaelafeijo.github.io/mars-to-go/ (computador ou celular; abre em inglês, com português na barra do topo).
- **Ir direto para a missão 2:** https://rafaelafeijo.github.io/mars-to-go/?mission=2 (normalmente ela abre depois da missão 1).
- **Cópia e API:** https://mars-to-go-api-production.up.railway.app/ ([/health](https://mars-to-go-api-production.up.railway.app/health))
- **Desafio:** NASA Space Apps Challenge 2026, *Build a Junior Astronaut Mission Trainer* ([texto oficial](docs/CHALLENGE_STATEMENT.md))
- **Time:** Rochette

## Como se joga

Você anda com um astronauta por uma base 3D e planeja cada sol. A cada sol você recebe **10 células de energia**. 3 sempre aquecem a base (as noites de Marte chegam a −89 °C), e você distribui as outras 7:

| Máquina | O que uma célula faz | O que custa |
| --- | --- | --- |
| **Máquina de ar** | +1 de ar nesta noite (como o MOXIE da NASA, que fez oxigênio com o ar de Marte) | Quatro astronautas respiram 5 toda noite |
| **Estufa** | +2 de comida, mas só 2 sóis depois | Nada nesta noite; plante cedo ou passe fome |
| **Escudo** | Bloqueia 1 ponto de radiação nesta noite | É gasto mesmo se a tempestade não chegar a Marte |
| **Rover** (2 células) | Traz uma amostra de rocha de um lugar real de Jezero | Ar dos trajes e radiação lá fora; a frente do delta fica longe |
| **Antena** | A Terra diz, à noite, se a tempestade de amanhã vai chegar a Marte | Uma célula que não faz ar nem comida |

As escolhas têm consequência:

- **Limite de dose de radiação.** Se a dose passa do limite, o médico da missão manda a tripulação para casa. Se a radiação passa pelo escudo, também estraga os eletrônicos, e você perde células no sol seguinte.
- **A crise de 10 segundos.** Quando uma tempestade rápida chega a Marte, você vê o risco contra o seu Escudo e escolhe qual máquina cede células para proteger a tripulação. No modo assistido não há relógio.
- **Três resultados.** "Missão bem-sucedida" exige todos em casa, a amostra de rocha e a dose dentro do limite. Senão o resultado é "Missão com falhas", que mostra o que faltou, ou "Retorno antecipado", que mostra o porquê com os números daquela noite.

A **missão 1, "Primeiros sóis"**, é guiada: as máquinas abrem nos primeiros sóis. A **missão 2, "A tempestade de maio"**, refaz a semana real de 14 a 20 de maio de 2024:

- Uma erupção X8.7.
- Dois alarmes falsos: CMEs que o modelo WSA-ENLIL da NASA previu que atingiriam a nave Psyche, não Marte.
- Três CMEs rápidas com chegada prevista a Marte.
- A tempestade de 20 de maio, medida em Marte pelo RAD do Curiosity.

Proteger todo sol custa caro demais, então perguntar à Terra compensa. A amostra precisa vir da **frente do delta**, a melhor aposta da NASA para achar sinais de vida antiga.

Depois de cada noite, um relatório explica cada mudança, com a conclusão em negrito. Ele também mostra **um fato real da NASA com uma foto real**; nenhum fato ou foto se repete.

As regras completas estão em [`docs/pt-BR/SIM_MODEL.md`](docs/pt-BR/SIM_MODEL.md). Decisões: [`docs/pt-BR/adr/`](docs/pt-BR/adr/), principalmente as ADR-0033 a ADR-0035.

## Dados reais da NASA

| Fonte | O que o jogo usa | Onde |
| --- | --- | --- |
| **NASA CCMC DONKI** | Erupções e CMEs reais, e as previsões do modelo WSA-ENLIL da NASA de chegada a Marte | Previsão de cada sol, resposta da Antena, "O Sol nesta semana" na tela inicial |
| **RAD do Curiosity** (comunicado NASA/JPL 2024-080) | A tempestade de 20 de maio de 2024 medida na superfície de Marte | Missão 2, sol 7 |
| **NASA Mars Fact Sheet** | Ar com 95,1% de CO₂, −89/−31 °C (local da Viking 1), luz do Sol fraca | Termômetro, energia, ar |
| **MOXIE**, **Veggie**, **BVAD** | Oxigênio feito com o ar de Marte; alface que cresceu em 33 dias na ISS; oxigênio que uma tripulação usa | Máquina de ar, estufa, cartões de dados |
| **NASA-STD-3001** (Vol. 1 e resumos técnicos) | Limites de dose dos astronautas; como os astronautas respiram dentro do traje | Cartão do limite de dose, fato da missão 2 |
| **Estudos da NASA** (NTRS, Design Reference Architecture 5.0) | Oxigênio guardado em tanques, energia da base, CO₂ no traje, até onde os astronautas andam | Fatos da missão 2, tanque de ar, limite ao andar |
| **NASA Photojournal, images.nasa.gov, SVS, NASA Science** | Fotos reais de Jezero, Kodiak, Rochette, do céu de Marte, do MOXIE, de plantas na ISS e da erupção de maio de 2024 | Fatos do relatório, tela inicial |

Todo número fica em [`packages/sim/src/science.ts`](packages/sim/src/science.ts), com valor, unidade, rótulo, fonte, URL, lugar e data de acesso.

- **Rótulos:** cada número é **medido**, **cenário** ou **simplificação**.
- **Datas:** dado de arquivo nunca aparece como ao vivo. "O Sol nesta semana" mostra o horário UTC da cópia.
- **Paralelos:** o que não foi medido em Marte (ISS, Lua, Terra, Sol) aparece como paralelo declarado, com a justificativa ([`docs/pt-BR/SCIENCE.md`](docs/pt-BR/SCIENCE.md)).

Fontes, lugares e datas: [`docs/pt-BR/DATA_MAP.md`](docs/pt-BR/DATA_MAP.md).

## Testado com uma criança de verdade

Uma criança de 8 anos jogou cada versão num computador e num iPhone, em 14 de novembro (missão 1) e 15 de novembro (missão 2). Algumas coisas que ela fez mudaram o jogo:

- Pulava texto longo, então as telas viraram tópicos curtos.
- Jogava andando até as máquinas, então o jogo ganhou um botão de ação ao lado de cada uma.
- Achou que a máquina de ar era a casa da tripulação, então a base ganhou um habitat de verdade.
- Perguntou como os astronautas respiram no traje, e isso virou um fato real da NASA no jogo.

Cada observação, a mudança que causou e o seu commit estão em [`docs/pt-BR/PLAYTEST.md`](docs/pt-BR/PLAYTEST.md). O registro tem só fatos, sem nome, imagem ou voz da criança.

## Acessibilidade

- Fonte do texto: Atkinson Hyperlegible Next, feita para a leitura.
- Áreas de toque de pelo menos 44 px.
- Nada é dito só pela cor: ícones e palavras acompanham cada cor.
- O movimento reduzido é respeitado.
- O modo assistido tira todos os relógios.
- Tudo o que se faz no 3D também dá para fazer pela barra de baixo, pelo teclado ou com leitor de tela.

## Como rodar

Requisitos: Node 22 e pnpm (via `corepack enable`).

```bash
pnpm install
pnpm dev          # jogo em http://localhost:5173
pnpm dev:api      # API em http://localhost:8787 (/health, /space-weather)
pnpm check        # typecheck + lint + testes
pnpm build
node scripts/playthrough.mjs out en world   # joga as missões 1 e 2 de ponta a ponta (Playwright)
```

Não é preciso chave de API: o DONKI é lido em `ccmc.gsfc.nasa.gov` sem chave.

## Repositório

```
apps/web          jogo em React + Vite + three.js
apps/api          API Hono: /health, /space-weather (DONKI com cache), cópia do jogo
packages/sim      regras puras do jogo, testadas antes; science.ts guarda cada constante com a sua fonte
packages/content  textos em en e pt-BR, catálogo de eventos, cartões de dados, fatos da NASA
packages/ui       tokens de design
tools/data        scripts Python de imagens e dados
docs/en, docs/pt-BR   documentação nos dois idiomas
```

Arquitetura: [`docs/pt-BR/ARCHITECTURE.md`](docs/pt-BR/ARCHITECTURE.md).

## Uso de IA

A ideia do jogo, o design, os testes com a criança e as decisões são do time. O código e os documentos foram escritos com o **Claude Code** (Anthropic) e revisados pelo time. O Claude Code também foi usado para ler e conferir as fontes da NASA. Todas as fotos são imagens reais da NASA; não há imagem gerada por IA. Detalhes: [`docs/pt-BR/AI_USAGE.md`](docs/pt-BR/AI_USAGE.md).

## Privacidade

Não há conta, analytics nem dado pessoal. A fonte é hospedada com o jogo, sem pedido a um serviço de fontes. A escolha de idioma fica no aparelho.

## Créditos

NASA, NASA/JPL-Caltech, CCMC (DONKI) e as instituições parceiras creditadas em cada imagem. Modelos 3D: Kenney (CC0). Fonte: Braille Institute (OFL). Cada recurso, crédito e licença: [`docs/pt-BR/ASSETS.md`](docs/pt-BR/ASSETS.md). Este projeto não tem endosso da NASA.

## Licença

Código: [MIT](LICENSE). Os dados e imagens da NASA seguem os seus próprios termos (veja ASSETS).
