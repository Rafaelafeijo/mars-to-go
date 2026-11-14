# Modelo de simulação — Mars to Go

> Status: **aprovado em 2026-11-14 (Fase 0)**, com os ajustes registrados em §11–§15. Cada constante abaixo vai para `packages/sim/src/science.ts` com sua ficha do dado completa, e as partidas resolvidas viram os primeiros testes.
> Versão em inglês (padrão): [`docs/en/SIM_MODEL.md`](../en/SIM_MODEL.md).

## 1. Forma do jogo

- Uma missão dura **7 sóis** em uma base na Cratera Jezero. Um sol é uma rodada.
- O jogador administra **três recursos**: energia (células, gastas no mesmo sol), ar e comida (reservas que passam para o sol seguinte).
- Todo o resto (escudo, expedição, perguntar à Terra, crises) é uma **ação** que gasta energia e mexe no ar, na comida ou na exposição da tripulação.
- A exposição da tripulação **não é um quarto medidor**: é uma palavra (baixa, média, alta) mostrada no diário do sol e no veredito final, nunca um número de dose (ADR-0005).

## 2. Constantes

Todo valor aqui é uma regra do jogo, não uma medição, a menos que o rótulo diga *medido*. A coluna *Ligação com a ciência* diz qual fato real a regra representa; a fonte de cada fato está em `DATA_MAP.md`.

| ID | Valor | Unidade | Rótulo | Ligação com a ciência |
| --- | --- | --- | --- | --- |
| `MISSION_SOLS` | 7 | sol | cenário | Um sol é um dia de Marte (duração medida no DATA_MAP) |
| `CELLS_PER_SOL` | 10 | célula | cenário | Marte recebe menos luz do Sol que a Terra |
| `CELLS_DUST_SOL` | 6 | célula | cenário | Tempestades de poeira cortam a energia solar (tempestade de 2018) |
| `HEATING_CELLS` | 3 | célula, fixa | cenário | Marte é muito frio; o habitat precisa ser aquecido |
| `AIR_START` | 10 | unidade de ar | cenário | Reserva trazida da Terra |
| `AIR_USE_PER_SOL` | 5 | unidade de ar / sol | cenário | Tripulação de 4 respira todo sol (taxa medida no DATA_MAP) |
| `AIR_PER_LIFE_SUPPORT_CELL` | 1 | unidade de ar / célula | cenário | Fazer oxigênio a partir do CO₂ de Marte custa energia (MOXIE) |
| `FOOD_START` | 6 | unidade de comida | cenário | Comida trazida da Terra |
| `FOOD_USE_PER_SOL` | 2 | unidade de comida / sol | cenário | A tripulação come todo sol |
| `FOOD_PER_GREENHOUSE_CELL` | 2 | unidade de comida / célula | cenário | Uma estufa fechada transforma luz em comida |
| `GREENHOUSE_DELAY_SOLS` | 2 | sol | simplificação | As plantas levam tempo para crescer (cultivos reais levam semanas; CSA, Veggie) |
| `SHIELD_BLOCK_PER_CELL` | 1 | ponto de risco / célula | simplificação | A blindagem reduz a radiação que chega à tripulação |
| `EXPEDITION_CELLS` | 2 | célula | cenário | O rover e os trajes precisam de energia |
| `EXPEDITION_AIR` | 2 | unidade de ar | cenário | Os trajes usam oxigênio armazenado do lado de fora |
| `EXPEDITION_EXPOSURE` | 1 | ponto de exposição | simplificação | Do lado de fora, o habitat não protege mais a tripulação |
| `MAX_EXPEDITIONS_PER_SOL` | 1 | — | cenário | — |
| `ASK_EARTH_CELLS` | 1 | célula | cenário | A grande antena precisa de energia |
| `ASK_EARTH_ANSWER_AT` | diário desta noite | — | simplificação | O atraso real de ida é de ~4–24 min (DATA_MAP M9); a resposta chega depois que o plano é travado e aparece no diário desta noite, com o tempo de viagem do sinal |
| `RADIO_ROUND_TRIP_MIN_MINUTES` | 8 | min | medido (derivado) | 2 × ~4 min de ida na maior aproximação (DATA_MAP M9); mostrado no botão desativado durante uma crise |
| `EXPOSURE_LOW_MAX` | 2 | ponto de exposição | simplificação | Escala de três níveis, não uma dose |
| `EXPOSURE_MEDIUM_MAX` | 5 | ponto de exposição | simplificação | ≥ 6 é "alta" |
| `CRISIS_SECONDS` | 10 | s | cenário | O modo assistido para o relógio |

Tabela de evento para risco (simplificação, ver §5).

## 3. Estado

```ts
type MissionState = {
  version: 1;
  seed: number;            // picks events from the curated catalog
  sol: number;             // 1..7
  air: number;             // air units
  food: number;            // food units
  exposure: number;        // exposure points (shown only as low/medium/high)
  pendingHarvests: { sol: number; food: number }[]; // greenhouse in progress
  discoveries: string[];   // science card IDs
  earthAnswers: { askedOnSol: number; aboutSol: number; reachedMars: boolean | 'unknown' }[];
  mode: 'guided' | 'free'; // guided = mission 1 unlocks (§11)
  log: SolLog[];           // one entry per resolved sol
  status: 'playing' | 'returned_all' | 'early_return';
};

type Allocation = {
  lifeSupport: number; greenhouse: number; shield: number;
  expedition: 0 | 1;       // costs EXPEDITION_CELLS when 1
  askEarth: 0 | 1;         // costs ASK_EARTH_CELLS when 1
};
```

Início: `air = 10`, `food = 6`, `exposure = 0`, `sol = 1`.

## 4. Um sol

1. **Previsão.** O sol mostra: o evento de clima espacial (do catálogo, ou nenhum), seu risco previsto de 0 a 3 e se vem poeira. O jogador responde a uma pergunta de previsão (sem efeito na conta; ela é comparada com o resultado no diário).
2. **Distribuição.** Células livres = `cells(sol) − HEATING_CELLS`, onde `cells(sol)` é 10, ou 6 em um sol de poeira. Então são **7 células livres** em um sol normal e **3** em um sol de poeira. Regra: `lifeSupport + greenhouse + shield + 2·expedition + 1·askEarth = células livres`. Não é permitido deixar células sem uso: a bateria não consegue guardá-las (simplificação, dita na tela). A "conta aberta" mostra, para cada célula, o que ela vai fazer nesta noite.
3. **Crise** (em alguns sóis): 10 segundos, ver §6.
4. **Noite**, nesta ordem exata:
   1. Suporte à Vida: `air += lifeSupport × 1`
   2. Colheita: `food += Σ pendingHarvests where sol = today`
   3. Plantio: `pendingHarvests.push({ sol: today + 2, food: greenhouse × 2 })`
   4. Respirar e comer: `air −= 5`, `food −= 2`
   5. Expedição: se enviada, `air −= 2`, `exposure += 1`, `discoveries.push(card)`
   6. Radiação: se o evento realmente chega a Marte, `exposure += max(0, risk − shield)`; caso contrário, `+0` (as células do escudo foram gastas mesmo assim)
   7. Terra: se houve pergunta, a resposta sobre o evento de amanhã aparece no diário desta noite, com o tempo de viagem do sinal
   8. Verificação de fim (§7)

   Efeitos das crises na mesma noite (implementado na Fase 2): a troca para o Escudo na tempestade solar muda a distribuição antes do passo 1; a crise da estufa acrescenta um passo logo depois do passo 1 (`greenhouseRescue`, −2 de ar, ou `harvestLost`); uma expedição recolhida mantém o custo de ar, mas não tem a exposição `outside` nem descoberta.
5. **Diário do sol.** Previsão vs. resultado, cada linha da conta acima, a fonte de dados do evento e uma linha "e se você tivesse…" calculada refazendo a noite com uma célula movida.

### O que perguntar à Terra dá (regra aprovada)

- **A pergunta de hoje é sobre amanhã.** A previsão de amanhã já aparece hoje, marcada como "talvez" (por exemplo, "Amanhã: evento solar, risco 2 — talvez chegue a Marte").
- Perguntar gasta 1 célula hoje. A resposta chega **depois que o plano é travado** e aparece no **diário do sol desta noite**, com o tempo de viagem do sinal naquele dia. Ela serve para o plano de amanhã, nunca para o de hoje.
- A resposta é o campo `reachedMars` do catálogo. Ela é **uma previsão de um modelo da NASA** (DONKI WSA-ENLIL) ou, no caso do evento âncora, uma medição em Marte — e a ficha do dado diz qual das duas.
- **Perguntar no sol 7 é inútil** (não há amanhã na missão); o botão continua funcionando, e o diário explica por que não ajudou.
- **Em uma crise de 10 segundos**, o botão mostra "a resposta levaria pelo menos 8 minutos" (`RADIO_ROUND_TRIP_MIN_MINUTES`) e fica desativado.

Informação custa energia, e chega atrasada.

### Passos da noite (a conta ao vivo)

`resolveNight(state, allocation)` devolve, além do novo estado, a lista ordenada de passos:

```ts
type NightStep = {
  id: 'lifeSupport' | 'harvest' | 'plant' | 'breathe' | 'eat' | 'expedition' | 'radiation' | 'earthAnswer';
  labelKey: string;      // text lives in packages/content
  resource: 'air' | 'food' | 'exposure' | 'none';
  before: number;
  delta: number;
  after: number;
  cardIds: string[];     // data cards behind this step
};
```

- **Tela de distribuição:** a mesma função roda como prévia a cada célula movida, então a conta aberta se atualiza ao vivo.
- **Tela da noite:** os passos são animados um por um, sempre na ordem de §4.4. No modo assistido, eles rodam mais devagar e podem ser repetidos.
- **Previsão opcional:** antes do resultado, a criança escolhe um de três desfechos (o real mais dois construídos movendo uma célula). Um acerto adiciona a faixa "previsão certeira"; um erro não custa nada.

## 5. Clima espacial: classe do evento → risco no jogo (simplificação)

| Evento real (DONKI) | Risco no jogo |
| --- | --- |
| Nenhum evento, ou erupção classe C | 0 — nenhum |
| Erupção classe M | 1 — baixo |
| Erupção classe X, ou CME com chegada a Marte na simulação WSA-ENLIL do DONKI | 2 — médio |
| Evento de partículas solares energéticas (SEP) medido por um instrumento em Marte | 3 — alto |

Limites honestos, ditos na ficha do dado do evento:
- O DONKI registra o que saiu do Sol. Se chega a Marte depende da direção. Cada evento do catálogo guarda `reachedMars: true/false` com sua evidência (lista de impactos do WSA-ENLIL ou leitura do MSL-RAD); sem evidência, o evento diz "desconhecido" e é tratado como se não chegasse a Marte.
- A formulação da NASA, usada na tela: a luz da erupção chega primeiro, as partículas carregadas vêm em seguida em dezenas de minutos, e "Only the most energetic can reach the surface to be measured by RAD." É por isso que o risco mais alto exige evidência de partículas em Marte.
- Um número de risco não é uma dose. O jogo não calcula nenhuma dose em Marte.

## 6. Crises (10 segundos, o modo assistido para o relógio)

No máximo uma crise por sol, 2–3 por missão. Elas acontecem depois da distribuição e antes da noite. Se o tempo acabar, a tripulação **segue o plano** (opção "manter o plano"). A escolha e seu custo vão para o diário.

| Crise | Gatilho | Opções e custo |
| --- | --- | --- |
| Tempestade solar | Evento do catálogo com risco ≥ 2 marcado como `fast` (as partículas chegam em horas) | **Mover 2 células do Suporte à Vida para o Escudo** (−2 de ar nesta noite, +2 de escudo) · **Chamar de volta a expedição**, se houver uma lá fora (sem descoberta, sem `EXPEDITION_EXPOSURE`; o ar já foi gasto) · **Manter o plano** |
| Poeira | Cenário, no máximo uma vez | As células caem para 6 agora: a criança tira 4 células de onde as colocou |
| Falha na estufa | Cenário, no máximo uma vez, só se houver colheita pendente | **Salvar a colheita:** −2 de ar (o suporte à vida ajuda a estufa) · **Salvar o ar:** a próxima colheita pendente é perdida |
| Silêncio de rádio | Qualquer crise: "Perguntar à Terra" mostra "a resposta levaria pelo menos 8 minutos" e fica desativado | A criança decide sozinha. Depois da crise, chega a mensagem atrasada da Terra: "Vimos o que você fez. Confiamos em você." |

Fonte da formulação da crise de tempestade solar: NASA (2024-06-10) — os raios X e raios gama da erupção "arrived first", as partículas carregadas chegaram a Marte "in just tens of minutes", e "Only the most energetic can reach the surface to be measured by RAD." (DATA_MAP D7.)

## 7. Condições de fim

Verificadas no fim de cada noite:
- `air < 0` ou `food < 0` → **retorno antecipado**. O diário aponta para "o sol em que tudo mudou": para comida, `failedSol − GREENHOUSE_DELAY_SOLS` (último sol em que um plantio poderia ter resolvido); para ar, `failedSol − 1`. Nunca antes do sol 1.
- `sol = 7` e ambos ≥ 0 → **voltamos todos**.

A exposição não encerra a missão (não temos um limite médico defensável — nada de números inventados). Ela limita o veredito.

### Resultado

- **Margem em sóis** = `min(floor(air / 5), floor(food / 2))` → "Havia ar e comida para mais N sóis."
- **Palavras dos medidores** para ar e comida, por sóis de reserva: 0 crítico · 1 apertado · 2 seguro · ≥ 3 folgado. Medidor de energia: células livres hoje. Exposição: baixa (0–2) · média (3–5) · alta (≥ 6). Palavra e ícone, nunca só cor.
- **Veredito**: retorno antecipado · no limite (margem 0) · com margem (margem ≥ 1) · missão de referência (margem ≥ 1, exposição baixa, ≥ 1 descoberta).

## 8. Três partidas resolvidas (viram os primeiros testes)

Todas as partidas resolvidas rodam no **modo livre** (todos os destinos abertos, §11) com uma **semente de teste**; elas não são a missão 1. A partida A por acaso respeita os desbloqueios da missão guiada; B, C e o bônus não (usam a expedição antes do sol 3).

Mesma semente para as três: evento do sol 2 com risco 2, **chega a Marte** · sol 4 com **poeira** · evento do sol 5 com risco 3, **chega a Marte** · evento do sol 6 com risco 1, **não chega a Marte** · sóis 1, 3 e 7 calmos. Células livres: 7, 7, 7, 3, 7, 7, 7 = **45**.

Colunas: LS suporte à vida, GH estufa, SH escudo, EXP expedição (2 células), ASK perguntar à Terra (1 célula). Ar/comida/exposição são valores **depois** da noite.

### Partida A — "Guardião": voltamos todos, com margem

| Sol | LS | GH | SH | EXP | ASK | Ar | Comida | Exp. | Nota |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 5 | 2 | 0 | – | – | 10 + 5 − 5 = **10** | 6 − 2 = **4** | 0 | planta 4 de comida para a noite 3 |
| 2 | 3 | 2 | 2 | – | – | 10 + 3 − 5 = **8** | 4 − 2 = **2** | 0 + max(0, 2−2) = **0** | planta 4 para a noite 4 |
| 3 | 5 | 2 | 0 | – | – | 8 + 5 − 5 = **8** | 2 + 4 − 2 = **4** | 0 | planta 4 para a noite 5 |
| 4 poeira | 3 | 0 | 0 | – | – | 8 + 3 − 5 = **6** | 4 + 4 − 2 = **6** | 0 | |
| 5 | 4 | 0 | 3 | – | – | 6 + 4 − 5 = **5** | 6 + 4 − 2 = **8** | 0 + max(0, 3−3) = **0** | |
| 6 | 6 | 0 | 1 | – | – | 5 + 6 − 5 = **6** | 8 − 2 = **6** | **0** (o evento não veio; a célula do escudo foi gasta mesmo assim) | |
| 7 | 7 | 0 | 0 | – | – | 6 + 7 − 5 = **8** | 6 − 2 = **4** | 0 | |

Fim: ar 8 → 1 sol, comida 4 → 2 sóis → **margem 1**, exposição baixa, 0 descobertas → **com margem**. Voltamos todos.

### Partida B — "Cientista": voltamos todos, no limite

| Sol | LS | GH | SH | EXP | ASK | Ar | Comida | Exp. |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 5 | 2 | 0 | – | – | **10** | **4** | 0 |
| 2 | 4 | 1 | 0 | 1 | – | 10 + 4 − 5 − 2 = **7** | 4 − 2 = **2** | 0 + 1 + max(0, 2−0) = **3** |
| 3 | 6 | 1 | 0 | – | – | 7 + 6 − 5 = **8** | 2 + 4 − 2 = **4** | 3 |
| 4 poeira | 3 | 0 | 0 | – | – | 8 + 3 − 5 = **6** | 4 + 2 − 2 = **4** | 3 |
| 5 | 4 | 0 | 3 | – | – | 6 + 4 − 5 = **5** | 4 + 2 − 2 = **4** | 3 |
| 6 | 5 | 0 | 0 | 1 | – | 5 + 5 − 5 − 2 = **3** | 4 − 2 = **2** | 3 + 1 + 0 = **4** |
| 7 | 7 | 0 | 0 | – | – | 3 + 7 − 5 = **5** | 2 − 2 = **0** | 4 |

Fim: ar 5 → 1 sol, comida 0 → 0 sóis → **margem 0**, exposição **média**, **2 descobertas** → **no limite**. Voltamos todos.

### Partida C — retorno antecipado

| Sol | LS | GH | SH | EXP | ASK | Ar | Comida | Exp. |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 5 | 0 | 0 | 1 | – | 10 + 5 − 5 − 2 = **8** | 6 − 2 = **4** | **1** |
| 2 | 4 | 1 | 2 | – | – | 8 + 4 − 5 = **7** | 4 − 2 = **2** | 1 + max(0, 2−2) = **1** |
| 3 | 4 | 0 | 0 | 1 | 1 | 7 + 4 − 5 − 2 = **4** | 2 − 2 = **0** | **2** |
| 4 poeira | 3 | 0 | 0 | – | – | 4 + 3 − 5 = **2** | 0 + 2 − 2 = **0** | 2 |
| 5 | 4 | 0 | 3 | – | – | 2 + 4 − 5 = **1** | 0 − 2 = **−2** | 2 |

Comida < 0 na noite 5 → **retorno antecipado**. "O sol em que tudo mudou" = 5 − 2 = **sol 3**: duas células de estufa ali teriam colhido 4 de comida na noite 5. O jogo oferece "Quer jogar esta missão de novo com outro plano?" e "Voltar ao sol 3".

### Bônus — a "missão de referência" existe, mas é uma aposta

Partida A com uma mudança no sol 6: LS 5, EXP 1, SH 0 (apostando que o evento de risco 1 não vai chegar a Marte). Noite 6: ar 5 + 5 − 5 − 2 = 3, comida 6, exposição 0 + 1 = 1. Noite 7: LS 7, ar 3 + 7 − 5 = 5, comida 4. Margem 1, exposição baixa, 1 descoberta → **missão de referência**. Se o evento tivesse chegado a Marte, a exposição seria 2 — ainda baixa aqui, mas a aposta custa mais em um sol de risco 3. Perguntar à Terra no sol 5 transformaria a aposta em conhecimento, por 1 célula.

## 9. Nenhuma escolha de graça, nenhum plano vencedor único

- **Toda célula tem um custo de oportunidade.** Todos os destinos tiram das mesmas 7 células livres; uma célula em um lugar faz falta nos outros na mesma noite.
- **"Tudo" não cabe.** Sobreviver 7 sóis com blindagem completa e sem expedição exige pelo menos 25 células de suporte à vida (35 de ar consumido − 10 iniciais), 4 células de estufa (14 de comida consumida − 6 iniciais = 8, a 2 por célula) e 5 células de escudo: **34 de 45**. As 11 que sobram compram no máximo duas expedições (cada uma custa 2 células + 2 de ar = o equivalente a 4 células), sem sobrar margem. Sete expedições mais proteção completa exigem 34 + 28 = 62 células.
- **O Escudo nunca é de graça.** Ele é gasto mesmo quando o evento não atinge Marte (Partida A, sol 6).
- **A Estufa nunca é de graça.** Ela não faz nada nesta noite; paga dois sóis depois, e plantios nos sóis 6–7 nunca pagam dentro da missão.
- **Perguntar à Terra nunca é de graça.** 1 célula hoje, resposta só para amanhã, e inútil em uma crise de 10 segundos.
- **Nenhum plano vencedor único.** As partidas A, B e o bônus trazem a tripulação de volta com trocas diferentes (margem vs. descobertas vs. exposição). Os eventos mudam com a semente (a poeira pode cair no sol 1, um evento de risco 3 pode não atingir Marte), então uma distribuição fixa que vence com uma semente falha com outra — por exemplo, o sol 1 da Partida A (7 células) é impossível em um sol 1 com poeira, em que só 3 células estão livres.

## 10. Testes derivados deste modelo (Fase 2)

1. As partidas A, B e C reproduzem todos os números de §8, noite a noite.
2. Uma distribuição que não soma as células livres é rejeitada.
3. Um sol de poeira deixa 3 células livres.
4. A estufa plantada no sol *s* paga na noite *s + 2*, nunca antes; plantios nos sóis 6–7 nunca pagam.
5. O escudo reduz a exposição só quando o evento chega a Marte; as células são gastas de qualquer jeito.
6. Margem, palavras dos medidores, palavras de exposição e veredito seguem §7.
7. "O sol em que tudo mudou" segue §7.
8. Teste de propriedade: com qualquer semente, nenhum plano válido alcança o máximo de descobertas (7) e volta para casa.
9. Teste de propriedade: não existe uma única sequência de distribuições que alcance "missão de referência" com todas as sementes.
10. Missão 1 guiada: uma distribuição que usa um destino bloqueado é rejeitada; as regras da noite são idênticas às do modo livre.
11. `resolveNight` devolve os passos na ordem de §4.4, e `after = before + delta` em cada um.
12. Perguntar à Terra: a resposta aparece no diário desta noite, refere-se a amanhã, é inútil no sol 7 e fica indisponível em uma crise.
13. Carreira: regras de desbloqueio e a condição de "completo" de §13; o código da carreira faz a ida e volta (codificar → decodificar = mesmo progresso).

## 11. Primeira missão guiada (aprovada)

Na **missão 1**, os destinos vão sendo desbloqueados com o tempo; as regras da simulação não mudam, só o que está habilitado:

| Sol | Destinos abertos |
| --- | --- |
| 1 | Suporte à Vida, Estufa |
| 2 | + Escudo |
| 3 em diante | + Expedição, Perguntar à Terra |

Todas as outras missões começam com tudo aberto ("modo livre"). Destinos bloqueados mostram um cadeado e o sol em que abrem; não custam nada e não podem receber células.

## 12. Sol e dia (regras de redação)

- A abertura ensina isso uma vez: "Em Marte, o dia tem nome: sol. Ele dura 40 minutos a mais que o nosso. Sua missão dura 7 sóis." (DATA_MAP M8).
- Cabeçalho da missão 1: "SOL 3" com a legenda "dia 3 em Marte". A partir da missão 2: "SOL 3 de 7".
- Os resultados usam "sóis de reserva", com a mesma legenda na primeira vez em que aparece.

## 13. A jornada: missões e completar o jogo

Uma missão dura 7 sóis. O jogo é uma **carreira de missões**, todas com as mesmas regras e listas de eventos diferentes:

| Missão | Eventos | Desbloqueia quando |
| --- | --- | --- |
| 1 "Primeiros sóis" | Guiada (§11), Sol calmo | Aberta desde o início |
| 2 "A tempestade de maio" | Inclui o evento real de 2024-05-20 (âncora de risco 3, DATA_MAP D7) | Voltamos todos na missão 1 |
| 3 "Céu de poeira" | Poeira em mais de um sol | Voltamos todos na missão 2 |
| "Me surpreenda" | Sorteados do catálogo | Depois da missão 1 (qualquer resultado) |
| "Hoje no espaço" | Clima espacial real recente (ao vivo/retrato/arquivo, com seu selo) | Depois da missão 1 (qualquer resultado) |

**Completar o jogo** = mural de insígnias completo: missões 1–3 com todos de volta, pelo menos uma missão de referência e todas as descobertas. Isso dá o título de "comandante" e uma cena final. Toda missão pode ser jogada de novo. No fim de cada missão: "Quer jogar esta missão de novo com outro plano?"; depois de um retorno antecipado, também "Voltar ao sol em que tudo mudou".

A missão 3 precisa de um segundo sol de poeira; a regra é a mesma (`CELLS_DUST_SOL`), só a lista de eventos muda. Sua partida resolvida é um teste da Fase 2.

## 14. Salvar sem conta

- O progresso é salvo no aparelho depois de cada sol, com uma versão do salvamento.
- Um **código da carreira** curto guarda as missões desbloqueadas, as insígnias, as descobertas e a missão em andamento, e restaura tudo em outro aparelho. Nenhum dado pessoal. Formato em ARCHITECTURE §6.
- As configurações avisam: sem o código, limpar os dados do navegador apaga o progresso.

## 15. Fichas do dado ainda pendentes

Um dado cuja ficha está pendente fica **escondido das telas**; o build e o deploy não falham por causa dele (o build lista os itens escondidos em um relatório). A regra 16 vale: sem ficha, sem tela.

## 16. A projeção: "se todo sol fosse igual a hoje" (ADR-0031)

`project(def, state, todayAllocation)` em `packages/sim/src/projection.ts` devolve ar e comida depois desta noite e depois de cada noite restante, e o sol em que cada um acaba. Alimenta a trilha dos 7 sóis e os medidores "hoje → amanhã", e se atualiza a cada célula colocada ou tirada. Rótulo: **simplificação**.

Regras:
- Esta noite usa o plano de hoje exatamente como está (completo ou não), por `resolveNight` — os mesmos números da noite de verdade.
- Cada sol seguinte repete o **Suporte à Vida, a Estufa e o Escudo** de hoje. **Expedição e Perguntar à Terra são ações de um sol só** e não se repetem: repetir a expedição todo sol descreveria um plano que a criança não fez.
- **Regra de corte** num sol com menos células livres (o sol de poeira tem 3): tirar células do **Escudo primeiro, depois da Estufa, depois do Suporte à Vida** até o plano caber. O ar acaba mais rápido, então é o último a perder célula. O sol fica marcado como `cut` para a trilha dizer isso.
- Colheitas já plantadas chegam no seu sol; plantios repetidos rendem dois sóis depois; plantios que renderiam depois do sol 7 não contam.
- Cada linha (ar, comida) é projetada sozinha até ficar abaixo de zero (o sol em que acaba) ou chegar ao sol 7 (casa). A radiação não é projetada: depende de eventos futuros incertos.

Testes (`projection.test.ts`): os valores de hoje são iguais aos de `resolveNight`; o plano do sol 1 da partida A chega em casa, com o corte no sol de poeira; todas as células no Suporte à Vida → a comida acaba no sol 4; Suporte à Vida de menos → o ar acaba no sol 6; a expedição gasta ar só hoje; colheitas a caminho contam; plano incompleto funciona; cada linha anda sozinha.
