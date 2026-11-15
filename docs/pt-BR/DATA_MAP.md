# Mapa de dados — Mars to Go

> Status: **aprovado em 2026-11-14 (Fase 0)**; atualizado em 2026-11-15 para corresponder ao jogo atual (missões 1 e 2, ADR-0033 a ADR-0035). Uma entrada por dado que o jogo mostra ou usa. Tudo o que está marcado como **pendente** fica escondido das telas (ADR-0024). As entradas que o jogo não usa mais ficam no fim, marcadas como **não usado**, para a trilha continuar honesta.
> Versão em inglês (padrão): [`docs/en/DATA_MAP.md`](../en/DATA_MAP.md). Fontes acessadas em 2026-11-14, salvo indicação. Fontes da verdade no código: `packages/sim/src/science.ts` (números), `packages/content/src/catalog.ts` (eventos), `cards.ts` (fichas), `facts.ts` (fatos do sol e a lista de fontes da NASA).
> Rótulos: **medido** (observação real), **cenário** (suposto para a nossa base), **simplificação** (o que o modelo arredonda ou deixa de fora). Modo: **ao vivo** (buscado agora), **retrato** (salvo pelo workflow do Pages), **arquivo** (embutido).

Cada entrada: **Fonte / registro** · **Rota / campos** · **Local, data** · **Tratamento** · **Uso no jogo** · **Rótulo · modo** · **Paralelo com Marte** · **Para crianças** · **Validação**.

---

## 1. Clima espacial (DONKI)

Base: `https://ccmc.gsfc.nasa.gov/DONKI/WS/get/` — sem chave, CORS `*` (ADR-0027). Verificado com chamadas reais em 2026-11-14; registros da missão 2 conferidos em 2026-11-15.

### D1. Erupção solar
- **Fonte / registro:** DONKI FLR. Registros no jogo: `2024-05-10T00:10:00-FLR-001` (M1.3, pico às 00:13Z, https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/30665/-1) e `2024-05-14T16:46:00-FLR-001` (X8.7, pico às 16:51Z, AR 13664, https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/30849/-1).
- **Rota / campos:** `FLR?startDate&endDate` → `flrID, classType, beginTime, peakTime, sourceLocation, activeRegionNum, link`
- **Local, data:** medido na órbita da Terra (sensor de raios X do GOES), sobre o Sol; data do evento
- **Tratamento:** manter a letra da classe + o número; converter em risco do jogo (D6)
- **Uso no jogo:** previsão do sol (missão 1, sol 3: M1.3, risco 1; missão 2, sol 1: X8.7, risco 2). `reachesMars: 'unknown'`: uma erupção sozinha nunca aumenta a dose; a Antena responde "a Terra não sabe" (ADR-0033).
- **Rótulo · modo:** medido (evento); risco = simplificação · arquivo
- **Paralelo com Marte:** o Sol é o mesmo para a Terra e para Marte, mas uma erupção vista da Terra pode não estar voltada para Marte. A ficha diz isso (checklist K6).
- **Para crianças:** "Uma erupção é um clarão gigante no Sol. A luz dela chega a Marte primeiro; partículas minúsculas e rápidas chegam dezenas de minutos depois. Só as partículas mais fortes atravessam o ar de Marte até o chão."
- **Fonte para luz vs. partículas (formulação da NASA, aprovada):** NASA/JPL release 2024-080 (2024-06-10): os raios X e raios gama "arrived first", as partículas carregadas chegaram a Marte "in just tens of minutes", "Only the most energetic can reach the surface to be measured by RAD." — https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/
- **Validação:** rota ✅ · os dois registros ✅ · luz vs. partículas ✅

### D2. Ejeção de massa coronal (CME) e chegada a Marte
- **Fonte / registro:** DONKI CME + simulação WSA-ENLIL com `impactList[].location = "Mars"`.
- **Rota / campos:** `CME`, `CMEAnalysis?mostAccurateOnly=true`, `WSAEnlilSimulations` → `activityID, startTime, speed, impactList{location, arrivalTime, isGlancingBlow}`
- **Local, data:** coronógrafos (SOHO, STEREO-A), sobre o Sol; a chegada a Marte é uma **previsão de modelo**, não uma medição
- **Tratamento:** o evento chega a Marte = uma rodada do WSA-ENLIL cita Marte; velocidade = a análise mais precisa do DONKI; impactos de raspão ficam marcados
- **Rótulo · modo:** CME medida; chegada a Marte = previsão de modelo (mostrada como "previsão de um modelo da NASA") · arquivo
- **Paralelo com Marte:** direto — a previsão é sobre o próprio Marte.
- **Para crianças:** "Às vezes o Sol joga uma nuvem de partículas no espaço. Os cientistas usam um modelo de computador para adivinhar em quais planetas ela vai bater, como uma previsão do tempo para o espaço."

CMEs no jogo (todas com `risco 2`):

| Missão · sol | Registro da CME (página do DONKI) | Velocidade usada | Rodada WSA-ENLIL | Previsão | `reachesMars` · `fast` |
| --- | --- | --- | --- | --- | --- |
| 1 · sol 5 | `2024-05-11T01:36:00-CME-001` (CME/30719) | 1.263 km/s | WSA-ENLIL/30726/1 | Marte 2024-05-13T17:42Z, não de raspão | true · false (missão 1 é guiada, sem crise) |
| 2 · sol 3 | `2024-05-13T09:12:00-CME-001` (CME/30814), halo completo | 1.456 km/s | WSA-ENLIL/30822/1 | Marte 2024-05-16T18:09Z, não de raspão | true · true |
| 2 · sol 5 | `2024-05-14T17:30:00-CME-001` (CME/30873), depois da erupção X8.7 | 1.199 km/s | WSA-ENLIL/30872/1 | Marte 2024-05-17T15:08Z, não de raspão | true · true |
| 2 · sol 6 | `2024-05-16T13:38:00-CME-001` (CME/30936) | 1.452 km/s | WSA-ENLIL/30963/1 | Marte 2024-05-19T09:15Z | true · true |
| 2 · sol 2 | `2024-05-14T17:48:00-CME-001` (CME/30883) | 1.292 km/s | rodadas WSA-ENLIL | **Psyche, não Marte** (alarme falso) | false · false |
| 2 · sol 4 | `2024-05-15T14:53:00-CME-001` (CME/30948) | 1.570 km/s | rodadas WSA-ENLIL | **Psyche, não Marte** (alarme falso) | false · false |

- **Uso no jogo:** a previsão do sol; a resposta da Antena sobre amanhã; o que o escudo precisa bloquear. Os pontos não bloqueados aumentam a dose e custam células no sol seguinte (ADR-0033).
- **Validação:** os seis registros ✅ (conferidos no DONKI em 2026-11-15) · link da página do DONKI em cada ficha

### D2a. Regra do jogo "CME rápida" (ADR-0034)
- **Regra:** uma CME é `fast` quando a velocidade mais precisa do DONKI é **≥ 1.000 km/s** e uma rodada do WSA-ENLIL prevê chegada a Marte. Todo evento rápido que chega a Marte traz a crise de 10 segundos (`CRISIS_SECONDS`, cenário). A tempestade de 20 de maio (D7) também é `fast`.
- **Rótulo:** simplificação (o limite é nosso, não uma classe da NASA).
- **Nota:** os alarmes falsos também são rápidos, mas `fast` fica falso porque eles não chegam a Marte. A missão 1 mantém a sua CME com `fast: false` (missão guiada, sem crise).
- **Para crianças:** "1.452 km/s quer dizer que ela atravessaria o Brasil de norte a sul em uns 3 segundos."

### D3. Partículas solares energéticas (SEP)
- **Fonte / registro:** DONKI SEP
- **Rota / campos:** `SEP` → `sepID, eventTime, instruments, link`
- **Uso no jogo:** só a **contagem** em "O Sol nesta semana" (D5). Nenhuma SEP do DONKI comanda uma missão: o evento de risco 3 é a medição em Marte (D7).
- **Rótulo · modo:** medido · retrato
- **Paralelo com Marte:** as SEPs do DONKI são medidas perto da Terra; só um instrumento em Marte confirma Marte.
- **Validação:** rota ✅

### D4. Tempestade geomagnética (GST)
- **Uso no jogo:** **não usado** (aprovado). Kp é um índice da Terra; Marte não tem campo magnético global.

### D5. "O Sol nesta semana" (tela inicial)
- **Fonte:** `scripts/donki-snapshot.mjs` chama `FLR`, `CME` e `SEP` dos últimos 7 dias e grava `apps/web/public/data/space-weather.json` (`updatedAt`, `range`, listas). Ele roda em `.github/workflows/pages.yml` a cada push na `main` e **duas vezes por dia** (cron `17 6,18 * * *`). Se o DONKI falhar, não grava nada.
- **Tratamento:** contar erupções, CMEs e SEPs; escolher a erupção mais forte pela classe; mostrar a data e a **hora UTC** da cópia ("Atualizado em … · copiado da NASA 2 vezes por dia").
- **Uso no jogo:** só na tela inicial (`apps/web/src/screens/SunThisWeek.tsx`). Não entra nas missões. Se o arquivo faltar, o painel some.
- **Rótulo · modo:** medido · **retrato**, nunca mostrado como ao vivo. O jogo não faz nenhuma chamada ao vivo; a rota `/space-weather` da API (Railway) não é usada pelas telas do jogo.
- **Leitura da semana:** "agitada" se alguma erupção chegou à classe M5 ou mais (escalas de clima espacial da NOAA, apagão de rádio R2 "moderado" ou maior) ou se houve um evento de partículas solares (SEP) na semana; senão, "calma". Aparece como uma frase abaixo dos números ("Semana calma no Sol" / "Semana agitada no Sol"); a regra está em `SunThisWeek.tsx`.
- **Validação:** ✅

### D6. Tabela evento → risco do jogo
- **Fonte:** nossa regra — SIM_MODEL §5; ficha `riskTable`
- **Regra:** nenhum evento ou erupção C → 0; erupção M → 1; erupção X, ou CME com chegada a Marte pelo WSA-ENLIL → 2; evento de partículas medido em Marte → 3.
- **Rótulo:** simplificação. Um número de risco não é uma dose.
- **Para crianças:** "Transformamos cada evento real em 0, 1, 2 ou 3 para você poder planejar. Cientistas de verdade usam muito mais detalhes."
- **Validação:** ✅ em uso

---

## 2. Radiação (artigos da NASA)

### D7. RAD do Curiosity na superfície de Marte — o evento de 20 de maio de 2024
- **Fonte / registro:** NASA/JPL, "NASA Watches Mars Light Up During Epic Solar Storm" (2024-06-10, release 2024-080): "a solar flare later estimated to be an X12"; "If astronauts had been standing next to NASA's Curiosity Mars rover at the time, they would have received a radiation dose of 8,100 micrograys", "equivalent to 30 chest X-rays"; "the biggest surge measured by Curiosity's Radiation Assessment Detector, or RAD, since the rover landed 12 years ago." https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/
- **ID no catálogo:** `NASA-2024-080-MARS-2024-05-20` (não é um registro do DONKI), classe X12, `risco 3`, `reachesMars: true`, `fast: true`.
- **Local, data:** Curiosity, **Cratera Gale**, Marte, 2024-05-20. Gale pela página do Curiosity da NASA: "Curiosity explores Gale Crater" — https://science.nasa.gov/mission/msl-curiosity/
- **Tratamento:** o número da NASA aparece como foi escrito, no mesmo enquadramento da NASA (teria recebido). Não entra em nenhuma conta.
- **Uso no jogo:** sol 7 da missão 2 (risco 3 + crise); fato do sol 7 da missão 1; fichas `evt-may-2024` e `crisis`.
- **Rótulo · modo:** medido, **Marte** · arquivo
- **Paralelo com Marte:** não precisa (Gale, não Jezero; a ficha diz isso).
- **Validação:** ✅

### D8. Radiação de fundo em Marte
- **Fonte:** NASA PIA17600 (2013-12-09): "about 210 micrograys per day" — https://science.nasa.gov/resource/radiation-measurements-on-mars/
- **Uso no jogo:** só na ficha do Escudo. **Não entra em nenhuma conta.**
- **Rótulo · modo:** medido, Marte (Gale) · arquivo
- **Validação:** ✅

### D9. A ideia do limite de dose (paralelo)
- **Fonte:** NASA-STD-3001 Vol. 1, §4.8.2: limite de carreira de 600 mSv (risco extra de câncer abaixo de 3%).
- **Uso no jogo:** a ideia por trás do `DOSE_LIMIT = 2` pontos (ficha da exposição). Pontos do jogo não são mSv.
- **Rótulo:** simplificação · Local: Terra (norma da NASA). Justificativa em SCIENCE.md P12.

### D10. A radiação danifica eletrônicos (paralelo)
- **Fonte:** NASA SVS 31248 — https://svs.gsfc.nasa.gov/31248: as partículas podem "damage critical electronics" e "degrade solar arrays".
- **Uso no jogo:** `RADIATION_DAMAGE_CELLS_PER_POINT = 1`, `RADIATION_DAMAGE_MAX_CELLS = 2` (ficha `radiationDamage`).
- **Rótulo:** simplificação · Local: naves perto da Terra. Justificativa em SCIENCE.md P13.

---

## 3. Ambiente de Marte (briefing §6.5)

Tudo da NASA Mars Fact Sheet (atualizada em 2025-05-19) — https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html — salvo indicação. Rótulo: medido, Marte. Modo: arquivo.

| ID | Fato (formulação da fonte) | Uso no jogo | Para crianças | Validação |
| --- | --- | --- | --- | --- |
| M1 | Atmosfera com 95,1% de CO₂; pressão na superfície de 6,36 mb | Por que o ar precisa ser fabricado → o Suporte à Vida custa células; fato do sol 1 | "O ar de Marte é quase todo o gás que a gente *solta*. Precisamos fazer o nosso oxigênio." | ✅ |
| M2 | Irradiância solar de 586,2 W/m² (razão 0,431) | Por que só 10 células (`CELLS_PER_SOL`, cenário) | "A luz do Sol em Marte é menos da metade da que chega à Terra." | ✅ |
| M3 | Tempestade de poeira de 2018: tau 10,5 em 2018-06-10, Opportunity com 21 Wh — https://science.nasa.gov/resource/on-mars-light-is-energy/ | Ficha da poeira (`CELLS_DUST_SOL` = 6). Não há sol de poeira nas missões 1 e 2. | "O Opportunity recebeu tão pouca energia que dormiu." | ✅ |
| M4 | Média de −59 °C; variação diária de −89 a −31 °C **no local de pouso da Viking 1** | Aquecimento: 3 células fixas; termômetro; o fato do sol 4 cita a Viking 1 | "Mais frio que qualquer freezer de casa." | ✅ |
| M5 | O solo "contains perchlorate salts at concentrations harmful or fatal to most forms of life" — https://science.nasa.gov/biological-physical/investigations/efri-elis-kpmsg/ | Ficha da estufa | "A terra de Marte tem sais que fazem mal às plantas." | ✅ |
| M6 | Gravidade de 3,73 m/s² (razão 0,380) | Paralelo na ficha da estufa | "Você pesaria cerca de um terço." | ✅ |
| M7 | "Mars has no global magnetic field today" — https://science.nasa.gov/mars/facts/ | Ficha do Escudo; fato do sol 3 | "Marte perdeu a sua bolha." | ✅ |
| M8 | Sol = 24,6597 h | Ficha do sol; "40 min a mais" (simplificação) | "Sol é um dia em Marte." | ✅ |
| M9 | Atraso de rádio de ~4 a ~24 min, só a ida — https://www.nasa.gov/centers-and-facilities/goddard/space-communications-7-things-you-need-to-know/ | Perguntar à Terra responde à noite; desligado na crise (ida e volta ≥ 8 min) | "Como um áudio no celular." | ✅ |
| M10 | Céu de Marte "yellow to orange", azul perto do Sol no pôr do sol; Sol com ~2/3 do tamanho visto da Terra (`SUN_SIZE_FROM_MARS_RATIO` 0,67) — https://science.nasa.gov/solar-system/planets/mars/what-does-a-sunrise-sunset-look-like-on-mars/ | Cores do céu em 3D, tamanho do Sol, fato "Olhar o céu" | — | ✅ |

## 4. Suporte à vida, comida e traje

### L1. MOXIE
- **Fonte:** JPL (2023-09-06): "a total of 122 grams of oxygen", "16 times", "12 grams of oxygen an hour" — https://www.jpl.nasa.gov/news/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/
- **Local, data:** Jezero, Marte, 2021–2023 · foto PIA24203 (na Terra, antes do lançamento)
- **Uso no jogo:** prova que dá para fazer oxigênio com o ar de Marte usando energia → `AIR_PER_LIFE_SUPPORT_CELL` (cenário); fato do sol 1
- **Regra de honestidade:** o pico do MOXIE não é capacidade contínua.
- **Validação:** ✅

### L2. Consumo de oxigênio da tripulação
- **Fonte:** NASA BVAD, NASA/TP-2015-218570/REV2, Tabela 3-31: 0,895 kg por tripulante por dia — https://ntrs.nasa.gov/citations/20210024855
- **Uso no jogo:** explica o `AIR_USE_PER_SOL` (unidades do jogo); "cerca de 25 kg para a nossa tripulação em 7 sóis" na ficha do Ar
- **Local:** Terra (dados humanos) · **Validação:** ✅

### L3. Plantas levam tempo
- **Fonte:** ficha técnica do Veggie da NASA: alface romana roxa "grew for 33 days" (VEG-01, ISS) — https://www.nasa.gov/wp-content/uploads/2019/04/veggie_fact_sheet_508.pdf · foto `iss072e404269` (Advanced Plant Habitat, ISS, 2024-12-27)
- **Uso no jogo:** `GREENHOUSE_DELAY_SOLS = 2` — simplificação; fato do sol 2
- **Paralelo com Marte:** SCIENCE.md P1–P3. O material da CSA **não é usado**.
- **Validação:** ✅

### L4. Amostras de rocha
- **Fonte:** NASA Science, Mars Rock Samples — https://science.nasa.gov/mission/mars-2020-perseverance/mars-rock-samples/ : 43 tubos, 38 para amostras
- **Uso no jogo:** `SAMPLES_GOAL = 1` (cenário); objetivo da missão "levar uma amostra para casa" (ADR-0033)
- **Validação:** ✅

### L5. Fatos da missão 2 (um por sol, cada um com uma foto real da NASA; ADR-0034)

| Sol | Fato | Fonte do texto | Foto (local) | Paralelo |
| --- | --- | --- | --- | --- |
| 1 | Materiais de traje já em Marte | NASA/JPL PIA24033 | PIA26520 (Jezero, no rover) | — |
| 2 | Oxigênio guardado como líquido em tanques | NTRS 20160004210 | KSC-20191108-PH-JBS01_0049 (Terra) | P6 |
| 3 | Usina nuclear de 30 kW a ~1 km da base | NASA-SP-2009-566 (DRA 5.0) | GRC-2015-C-06315 (Terra) | P7 |
| 4 | Furos na rocha Rochette | PIA24840 | PIA24840 (Jezero) | — |
| 5 | Caminhadas de cerca de 2 km (Lua) | NTRS 20210000827 | AS15-88-11901 (Lua) | P4, P5 |
| 6 | Kodiak, um morro perto da base | PIA24802 | PIA24802 (Jezero) | — |
| 7 | Como os astronautas respiram no traje | briefs NASA-STD-3001 OCHMO-TB-004 pp. 10–11, OCHMO-TB-002 p. 18 | S68-34582 (Terra) | P8, P9 |

## 5. Lugar: Jezero

| ID | Fato | Fonte | Uso no jogo | Validação |
| --- | --- | --- | --- | --- |
| J1 | Local de pouso ~18° N, 77° L, cratera de 45 km | https://www.jpl.nasa.gov/news/press_kits/mars_2020/landing/mission/landing_site/ | Local da base | ✅ |
| J2 | Frente do delta a ~2,3 km a oeste do local de pouso | PIA24485 — https://www.jpl.nasa.gov/images/pia24485-perseverance-view-of-the-delta-in-jezero-crater/ | **Lugar longe** (ADR-0035): `EXPEDITION_FAR_AIR` 3, `EXPEDITION_FAR_EXPOSURE` 2; a missão 2 precisa da amostra dele | ✅ |
| J2a | Por que o delta (prova de um lago, melhor aposta para sinais de vida antiga) | https://www.jpl.nasa.gov/news/nasas-perseverance-rover-arrives-at-delta-for-new-science-campaign/ | Ficha `deltaSite` | ✅ |
| J3 | Rochette: rocha dos primeiros núcleos de amostra, 2021 | PIA24840 | **Lugar perto** (2 de ar, 1 ponto); nome do time | ✅ · nenhuma distância mostrada |
| J4 | Morro Kodiak | PIA24802 | **Lugar perto** (2 de ar, 1 ponto) | ✅ · nenhuma distância mostrada |

Os custos dos lugares perto são valores do jogo, sem distância declarada; só os 2,3 km do delta aparecem.

## 6. Imagens

Todas em [`ASSETS.md`](ASSETS.md) (15 imagens da NASA, cada uma com ID, crédito, local e nota de cor), mostradas com o selo FOTO REAL. O terreno e o céu em 3D são desenhados no código e declarados como ilustração.

## 7. Constantes de cenário (sem fonte externa, de propósito)

Todos os valores do SIM_MODEL §2 com rótulo cenário/simplificação, incluindo os das ADR-0033 a ADR-0035 (`DOSE_LIMIT`, `RADIATION_DAMAGE_*`, `SAMPLES_GOAL`, `EXPEDITION_FAR_*`) e `CRISIS_SECONDS`. Cada ficha diz "Regra do jogo" e aponta o fato real que ela representa.

## 8. Não usado (mantido para o registro)

Conferido no código em 2026-11-15 (nenhuma referência em `packages/` nem em `apps/web/src/`):

| Entrada antiga | Situação |
| --- | --- |
| RadLab (DosTel da ISS, leituras de Marte) — `https://visualization.osdr.nasa.gov/radlab/api/` | **Não usado.** Nenhum número do RadLab na tela (ADR-0026: o agrupamento das leituras nunca foi explicado na documentação). |
| Estudos do OSDR (OSD-53, OSD-174) | **Não usado.** As fichas de ciência do OSDR foram cortadas (ADR-0031). |
| Mosaico CTX do Mars Trek (mapa da base) | **Não usado.** A vista da órbita é a foto PIA23239. |
| CSA "Interplanetary Farming" / kit sobre alimentos na Lua | **Não usado.** O Veggie é a única fonte da estufa. |
| "0,67 mSv por dia" do JPL (2013) | **Não usado** na tela. |
| Velocidade de entrada de 19.500 km/h, paraquedas (cena de abertura) | **Não usado.** A cena de abertura não foi feita. |
| Chamada ao vivo ao DONKI pelo jogo | **Não usado.** O jogo só lê o retrato (D5). |

## Pendente

Nada escondido das telas no momento. A confirmar, sem aparecer no jogo: as cores exatas dos LEDs do Veggie por trás da lâmpada da estufa 3D e a pressão do traje no brief de ECLSS (SCIENCE.md P3, P9).
