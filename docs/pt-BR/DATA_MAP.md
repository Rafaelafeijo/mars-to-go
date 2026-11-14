# Mapa de dados — Mars to Go

> Status: **aprovado em 2026-11-14 (Fase 0)**, com as decisões sobre dados registradas abaixo. Uma entrada por dado que o jogo mostra ou usa. Tudo o que está marcado como **pendente** fica escondido das telas; isso não bloqueia o build nem o deploy (ADR-0024).
> Versão em inglês (padrão): [`docs/en/DATA_MAP.md`](../en/DATA_MAP.md). Fontes acessadas em 2026-11-14, salvo indicação.
> Rótulos: **medido** (observação real), **cenário** (suposto para a nossa base), **simplificação** (o que o modelo arredonda ou deixa de fora). Modo: **ao vivo** (buscado agora), **retrato** (salvo pelo job diário), **arquivo** (embutido).

Cada entrada: **Fonte / registro** · **Rota / campos** · **Local, data** · **Tratamento** · **Uso no jogo** · **Rótulo · modo** · **Paralelo com Marte** · **Para crianças** · **Validação**.

---

## 1. Clima espacial (DONKI)

Base: `https://ccmc.gsfc.nasa.gov/DONKI/WS/get/` — sem chave, CORS `*`. Verificado com chamadas reais em 2026-11-14 (`kauai.ccmc…` estourou o tempo limite; `api.nasa.gov/DONKI/FLR` devolveu 404).

### D1. Erupção solar
- **Fonte / registro:** DONKI FLR, por exemplo `2024-05-14T16:46:00-FLR-001` (classe X8.7, pico em 2024-05-14T16:51Z, AR 13664) — https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/30849/-1
- **Rota / campos:** `FLR?startDate&endDate` → `flrID, classType, beginTime, peakTime, sourceLocation, activeRegionNum, link`
- **Local, data:** medido na órbita da Terra (sensor de raios X do GOES), sobre o Sol; data do evento
- **Tratamento:** manter a letra da classe + o número; converter em risco do jogo (D6)
- **Uso no jogo:** previsão do sol; risco 1 (M) ou 2 (X) — SIM_MODEL §5
- **Rótulo · modo:** medido (evento); risco = simplificação · arquivo (catálogo), ao vivo/retrato em "Hoje no espaço"
- **Paralelo com Marte:** o Sol é o mesmo para a Terra e para Marte, mas uma erupção vista da Terra pode não estar voltada para Marte. A ficha diz isso (checklist K6).
- **Para crianças:** "Uma erupção é um clarão gigante no Sol. A luz dela chega a Marte primeiro; partículas minúsculas e rápidas chegam dezenas de minutos depois. Só as partículas mais fortes atravessam o ar de Marte até o chão."
- **Fonte para luz vs. partículas (formulação da NASA, aprovada):** NASA/JPL, "NASA Watches Mars Light Up During Epic Solar Storm", 2024-06-10, release 2024-080: os raios X e raios gama "arrived first", as partículas carregadas chegaram a Marte "in just tens of minutes", "Only the most energetic can reach the surface to be measured by RAD." — https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/
- **Validação:** rota verificada ✅ · luz vs. partículas ✅

### D2. Ejeção de massa coronal (CME) e chegada a Marte
- **Fonte / registro:** DONKI CME (por exemplo `2024-05-08T05:36:00-CME-001`) + simulação WSA-ENLIL `impactList[].location = "Mars"` (por exemplo `WSA-ENLIL/30726/1`, chegada a Marte em 2024-05-13T17:42Z) — https://ccmc.gsfc.nasa.gov/DONKI/view/WSA-ENLIL/30726/-1
- **Rota / campos:** `CME`, `CMEAnalysis?mostAccurateOnly=true`, `WSAEnlilSimulations` → `activityID, startTime, note, speed, halfAngle, impactList{location, arrivalTime, isGlancingBlow}`
- **Local, data:** coronógrafos (SOHO, STEREO-A), sobre o Sol; a chegada a Marte é uma **previsão de modelo**, não uma medição
- **Tratamento:** o evento chega a Marte = uma simulação WSA-ENLIL lista Marte; impactos de raspão ficam guardados como um indicador
- **Uso no jogo:** `reachedMars` para o risco 2; a resposta de "Perguntar à Terra" — SIM_MODEL §4, §5
- **Rótulo · modo:** CME medida; chegada a Marte = previsão de modelo (mostrada como "previsto por um modelo da NASA") · arquivo / ao vivo
- **Paralelo com Marte:** direto — a previsão é sobre o próprio Marte.
- **Para crianças:** "Às vezes o Sol lança uma nuvem de partículas no espaço. Os cientistas usam um modelo de computador para adivinhar em quais planetas ela vai bater, como uma previsão do tempo para o espaço."
- **Validação:** rota verificada ✅ (2024 tem chegadas a Marte na maioria dos meses)

### D3. Partículas solares energéticas (SEP)
- **Fonte / registro:** DONKI SEP, por exemplo `2024-05-09T13:59:00-SEP-001`
- **Rota / campos:** `SEP` → `sepID, eventTime, instruments, link`
- **Local, data:** instrumentos perto da Terra; data do evento
- **Tratamento:** usado só quando uma medição em Marte (D7) confirma partículas em Marte
- **Uso no jogo:** risco 3 — SIM_MODEL §5
- **Rótulo · modo:** medido · arquivo
- **Paralelo com Marte:** as SEPs do DONKI são perto da Terra; só um instrumento em Marte confirma Marte.
- **Para crianças:** "São pedacinhos minúsculos e muito rápidos que vêm do Sol. São eles que um escudo precisa barrar."
- **Validação:** rota verificada ✅

### D4. Tempestade geomagnética (GST)
- **Fonte / registro:** DONKI GST `2024-05-10T15:00:00-GST-001` (Kp até 9,0)
- **Uso no jogo:** **fora do jogo** (aprovado). Kp é um índice da Terra; Marte não tem campo magnético global.
- **Validação:** rota verificada ✅ · não usado

### D5. "Hoje no espaço"
- **Fonte:** as rotas D1–D3 nos últimos 7 dias. 2026-11-07→14: 7 erupções (a mais recente M1.7, `2026-11-11T21:06:00-FLR-001`), 22 CMEs.
- **Tratamento:** escolher o evento mais forte; mostrar a data e o selo do modo (ao vivo / atualizado / arquivo), nunca rotulado de novo
- **Uso no jogo:** tela inicial; entra na missão só se houver chegada a Marte
- **Validação:** verificado ✅

### D6. Tabela classe do evento → risco do jogo
- **Fonte:** nossa regra — SIM_MODEL §5
- **Rótulo:** simplificação. Um número de risco não é uma dose.
- **Para crianças:** "Transformamos cada evento real em 0, 1, 2 ou 3 para você poder planejar. Os cientistas de verdade usam muito mais detalhes."
- **Validação:** aguardando aprovação ⏳

---

## 2. Radiação (RadLab, artigos da NASA)

API do RadLab: `https://visualization.osdr.nasa.gov/radlab/api/` — sem chave, **sem cabeçalho CORS** (só em tempo de build). Campos: `timestamp, instrument_id, absorbed_dose_rate, dose_equivalent_rate` (documentação: μGy/hora, μSv/hora).

### D7. O RAD do Curiosity na superfície de Marte — o evento de 20 de maio de 2024
- **Fonte / registro:** NASA/JPL, "NASA Watches Mars Light Up During Epic Solar Storm" (2024-06-10, release 2024-080): "a solar flare later estimated to be an X12"; "If astronauts had been standing next to NASA's Curiosity Mars rover at the time, they would have received a radiation dose of 8,100 micrograys", "equivalent to 30 chest X-rays"; "the biggest surge measured by Curiosity's Radiation Assessment Detector, or RAD, since the rover landed 12 years ago." https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/
- **Local, data:** a posição do Curiosity na superfície de Marte, 2024-05-20. A ficha diz que a medição foi feita na **Cratera Gale** (aprovado); o artigo não cita Gale, então a ficha cita a página da missão Curiosity da NASA para isso (link a anexar na Fase 4 ⏳).
- **Tratamento:** o número da NASA é mostrado como escrito (8.100 micrograys ≈ 30 radiografias de tórax), apresentado como a NASA apresenta: a dose que um astronauta **teria recebido** ao lado do rover.
- **Uso no jogo:** evento âncora de risco 3 da missão 2 "A tempestade de maio"; cartão de ciência do escudo; evidência `reachedMars = true`
- **Rótulo · modo:** medido, **Marte** · arquivo
- **Paralelo com Marte:** nenhum necessário — medido em Marte (Gale, não Jezero).
- **Para crianças:** "Em 20 de maio de 2024, uma tempestade de verdade vinda do Sol chegou a Marte. Um astronauta ao lado do rover Curiosity teria recebido tanta radiação quanto 30 radiografias no médico. É por isso que o escudo importa."
- **Validação:** artigo da NASA ✅ · link da fonte sobre Gale ⏳
- **RadLab (aprovado): nenhum número do RadLab na tela.** A documentação dá μGy por hora, mas não explica como as leituras de Marte são agrupadas (cadência de 17 min; a média diária × 24 h ≈ 1.660 em 05-20 vs. os 8.100 da NASA). Mantido só para as nossas anotações.

### D8. Radiação de fundo em Marte
- **Fonte:** NASA PIA17600 "Radiation Measurements on Mars" (2013-12-09): "a slowly varying dose rate of about 210 micrograys per day" — https://science.nasa.gov/resource/radiation-measurements-on-mars/ · JPL (2013-12-09): "0.67 millisieverts per day from August 2012 to June 2013" — https://www.jpl.nasa.gov/news/nasa-curiosity-first-mars-age-measurement-and-human-exploration-help/
- **Uso no jogo:** só cartão de ciência; explica por que o habitat importa todos os dias. **Não entra em nenhuma fórmula.**
- **Rótulo · modo:** medido, Marte (Gale) · arquivo
- **Para crianças:** "Em Marte sempre há um pouco de radiação, como um sol que nunca se apaga. O habitat é o seu protetor solar."
- **Validação:** ✅

### D9. Dosímetros da ISS (paralelo)
- **Fonte / registro:** RadLab `spacecraft=ISS&instrument=DosTel`, por exemplo DosTel1 2022-04-01T23:00:33, taxa de dose absorvida 9,835 (μGy/h segundo a documentação)
- **Uso no jogo:** cartão de ciência "quanto um escudo importa", rotulado **medido na ISS, não em Marte** (ADR-0005)
- **Paralelo com Marte:** ambos estão fora do ar espesso da Terra; a ISS ainda está dentro do campo magnético da Terra, e Marte não tem um campo global. Justificativa a registrar no SCIENCE.md.
- **Validação:** rota ✅ · **fora do MVP, a menos que a questão de unidade/agrupamento se resolva** (aprovado) ⏳

---

## 3. Ambiente de Marte (os desafios específicos de Marte, brief §6.5)

Tudo do NASA Mars Fact Sheet (última atualização em 2025-05-19) — https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html — salvo indicação. Rótulo: medido, Marte. Modo: arquivo.

| ID | Fato (formulação da fonte) | Uso no jogo | Para crianças | Validação |
| --- | --- | --- | --- | --- |
| M1 | Atmosfera com 95,1% de CO₂; pressão na superfície de 6,36 mb (4,0–8,7 conforme a estação) | Por que o ar precisa ser fabricado → Suporte à Vida custa células | "O ar de Marte é quase todo o gás que a gente solta *para fora*. Precisamos fazer o nosso próprio oxigênio." | ✅ |
| M2 | Irradiância solar de 586,2 W/m² vs. 1.361,0 na Terra (razão de 0,431) | Por que só 10 células (`CELLS_PER_SOL`, cenário) | "A luz do Sol em Marte é menos da metade da que chega à Terra — como carregar o celular com um carregador fraco." | ✅ |
| M3 | Tempestade de poeira de 2018: tau 10,5 em 2018-06-10, energia do Opportunity de 21 Wh, a mais baixa de todas — https://science.nasa.gov/resource/on-mars-light-is-energy/ (o JPL dá 10,8: https://www.jpl.nasa.gov/news/six-things-about-opportunitys-recovery-efforts/) | Sol de poeira: 6 células (`CELLS_DUST_SOL`, cenário) | "A poeira pode cobrir tanto o céu que os painéis solares quase param — o Opportunity recebeu tão pouca energia que foi dormir." | ✅ (mostrar os dois valores de tau ou 10,5 com a sua página) |
| M4 | Média de ~214 K (−59 °C); variação diária de −89 a −31 °C | Aquecimento: 3 células fixas (`HEATING_CELLS`, cenário) | "Mais frio que qualquer freezer de casa, toda noite." | ✅ |
| M5 | O solo "contains perchlorate salts at concentrations harmful or fatal to most forms of life"; regolito "devoid of soil organic matter" — https://science.nasa.gov/biological-physical/investigations/efri-elis-kpmsg/ | A estufa é fechada e lenta (`GREENHOUSE_DELAY_SOLS`) | "A terra de Marte tem sais que fazem mal às plantas, então a gente cultiva dentro, na água." | ✅ |
| M6 | Gravidade de 3,73 m/s² (média; Terra 9,82, razão de 0,380) | Só um fato das Instruções | "Você pesaria mais ou menos um terço do que pesa na Terra." | ✅ — **o brief dizia 3,71; corrigido** |
| M7 | "Mars has no global magnetic field today" — https://science.nasa.gov/mars/facts/ | Por que a radiação chega à superfície → Escudo | "A Terra tem uma bolha invisível que barra as partículas do espaço. Marte perdeu a sua bolha." | ✅ |
| M8 | Sol = 24,6597 h = 24 h 39 min 35 s | Unidade de `MISSION_SOLS`; o sol explicado em uma frase | "Um sol é um dia em Marte — 40 minutos mais longo que o nosso." | ✅ |
| M9 | Atraso do rádio: ~4 min na maior aproximação (~35 milhões de milhas), ~24 min na maior distância (~250 milhões de milhas) — https://www.nasa.gov/centers-and-facilities/goddard/space-communications-7-things-you-need-to-know/ | Perguntar à Terra; crise de silêncio de rádio (a resposta não consegue chegar em 10 s) | "É como mandar uma mensagem de voz: a Terra ouve você minutos depois, e você ouve a resposta minutos depois disso." | ✅ — **o brief dizia 3–22 min; a página da NASA diz ~4–24** |

## 4. Suporte à vida e comida

### L1. MOXIE
- **Fonte:** JPL, "NASA's Oxygen-Generating Experiment MOXIE Completes Mars Mission" (2023-09-06): "a total of 122 grams of oxygen", "16 times", "12 grams of oxygen an hour", "98% purity or better", "about what a small dog breathes in 10 hours" — https://www.jpl.nasa.gov/news/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/ · Hoffman et al. 2022, Sci. Adv. 8(35) eabp8636.
- **Local, data:** Cratera Jezero, Marte, 2021–2023
- **Uso no jogo:** prova que "dá para fazer oxigênio a partir do ar de Marte com energia" → `AIR_PER_LIFE_SUPPORT_CELL` (cenário)
- **Regra de honestidade:** o pico do MOXIE não é capacidade contínua; o equipamento da base é um cenário (brief §6.6).
- **Para crianças:** "Uma máquina do tamanho de uma torradeira no rover Perseverance fez oxigênio a partir do ar de Marte — o suficiente para um cachorro pequeno por 10 horas. A nossa base tem uma muito maior, e ela come energia."
- **Validação:** ✅

### L2. Consumo de oxigênio da tripulação
- **Fonte:** NASA BVAD, NASA/TP-2015-218570/REV2 (fev. 2022), Tabela 3-31: oxigênio consumido de 0,895 kg por tripulante por dia (faixa de 0,61–1,08) — https://ntrs.nasa.gov/citations/20210024855
- **Tratamento:** 0,895 × 4 × 7 ≈ 25 kg para a nossa tripulação em 7 sóis (arredondado); não é usado como entrada de fórmula
- **Uso no jogo:** explica `AIR_USE_PER_SOL` (cenário, unidades do jogo)
- **Para crianças:** "Cada astronauta respira quase 1 kg de oxigênio por dia — mais ou menos o peso de uma garrafa grande de água."
- **Validação:** ✅ — **o "1 t/year for four" do brief é uma citação da NASA com ressalvas; o BVAD dá ≈ 1,3 t; usar o BVAD.**

### L3. As plantas levam tempo (atraso da estufa)
- **Fonte (principal, aprovada):** ficha técnica do Veggie da NASA: a alface romana vermelha 'Outredgeous' "grew for 33 days" (VEG-01, ISS) — https://www.nasa.gov/wp-content/uploads/2019/04/veggie_fact_sheet_508.pdf · secundária: CSA "Interplanetary Farming" (modificada em 2019-09-26): alface de folha verde, aprox. 21–28 dias — https://www.asc-csa.gc.ca/eng/youth-educators/activities/fitness-and-nutrition/interplanetary-farming.asp
- **Regra:** citar os fatos com link; nunca copiar texto de terceiros (aprovado).
- **Local:** ISS (Veggie); dados gerais de cultivo (CSA, não ligados a nenhum corpo celeste)
- **Uso no jogo:** `GREENHOUSE_DELAY_SOLS = 2` — **simplificação** (o real ≈ 30 dias; comprimido para que uma missão de 7 sóis mostre o atraso)
- **Paralelo com Marte:** uma estufa fechada com luz, água e ar controlado funciona do mesmo jeito em princípio; em Marte a luz é mais fraca, a gravidade é menor e o solo é inutilizável (M2, M5). Os números lunares da CSA **não** são usados (K4).
- **Para crianças:** "A alface no espaço levou 33 dias para crescer. No nosso jogo leva 2 sóis, para você ver acontecer — mas a regra é a mesma: planta hoje, come depois."
- **Validação:** ✅ · ler os termos de reúso da CSA antes de citar texto ⏳

## 5. Local: Jezero

| ID | Fato | Fonte | Uso no jogo | Validação |
| --- | --- | --- | --- | --- |
| J1 | Local de pouso a ~18° N, 77° E, cratera de 45 km | https://www.jpl.nasa.gov/news/press_kits/mars_2020/landing/mission/landing_site/ | Localização da base | ✅ (coordenadas precisas não estão em uma página da NASA) |
| J2 | Remanescente do delta a ~2,3 km a oeste do local de pouso | PIA24485 — https://www.jpl.nasa.gov/images/pia24485-perseverance-view-of-the-delta-in-jezero-crater/ | Local de expedição + distância | ✅ |
| J3 | Rochette: rocha dos primeiros núcleos de amostra (Montdenier, Montagnac), 2021 | https://science.nasa.gov/resource/perseverances-journey-to-first-successful-sample-collection/ | Local de expedição; nome de equipe | ✅ fato · **nenhuma distância mostrada** (sem fonte) · as datas dos núcleos diferem entre páginas da NASA, então nenhuma data na tela |
| J4 | Butte Kodiak, borda sul do delta | https://www.nasa.gov/solar-system/nasas-perseverance-sheds-more-light-on-jezero-craters-watery-past/ | Local de expedição | ✅ fato · **nenhuma distância mostrada** (sem fonte) |

Aprovado: só a distância do delta (2,3 km, J2) é mostrada. A expedição tem um **custo fixo**, qualquer que seja o local (SIM_MODEL §2).
| J5 | Mapa da base | Mosaico CTX do Mars Trek `JEZ_ctx_B_soc_008_orthoMosaic_6m_Eqc_latTs0_lon0` (WMTS público) | Captura para o mapa da expedição | rota ✅ · redação da licença **pendente** |

## 6. Imagens

| ID | Imagem | Fonte | Validação |
| --- | --- | --- | --- |
| I1 | A Terra vista de Marte, "Bright 'Evening Star' Seen from Mars is Earth", PIA17936, Mastcam do Curiosity, 2014-01-31 | https://science.nasa.gov/photojournal/bright-evening-star-seen-from-mars-is-earth | ✅ |
| I2–I6 | Imagens 1, 5, 6, 8 e 14 de `docs/IMAGES.md` | A buscar (você) | ⏳ |

## 7. Cena de abertura (opcional)

| ID | Fato | Fonte | Validação |
| --- | --- | --- | --- |
| E1 | Entrada a cerca de 19.500 km/h; paraquedas a cerca de 11 km, ~1.512 km/h | https://www.jpl.nasa.gov/news/press_kits/mars_2020/landing/mission/ | ✅ — **o brief dizia ~20.000 km/h; o press kit diz 19.500** |

## 8. Cartões de ciência (OSDR)

| ID | Estudo | Fonte | Uso | Validação |
| --- | --- | --- | --- | --- |
| O1 | OSD-53 "Spaceflight Modulates Gene Expression in Astronauts" (6 astronautas, ônibus espacial) | `https://osdr.nasa.gov/osdr/data/osd/meta/53` | Cartão de ciência (paralelo: órbita da Terra) | rota ✅ · achado em linguagem infantil a escrever e conferir ⏳ |
| O2 | OSD-174, folículos capilares de 10 astronautas da ISS (JAXA) | Busca no OSDR | Cartão de ciência | ⏳ |

Escolher 3–5 cartões com um achado simples cada é trabalho da Fase 6.

## 9. Constantes de cenário (sem fonte externa, de propósito)

Todos os valores de SIM_MODEL §2 rotulados como cenário/simplificação. Cada ficha diz "Cenário do jogo" e aponta para o fato real que ela representa (M1–M9, L1–L3).

## Pendentes (escondidos das telas até serem resolvidos)

1. RadLab: agrupamento das leituras de Marte; a ficha da ISS fica fora do MVP se não for resolvido (D9).
2. Fonte da NASA que cite a Cratera Gale para a ficha D7.
3. Termos de reúso do Mars Trek e da CSA.
4. Achados das fichas do OSDR em linguagem infantil.

Resolvidos em 2026-11-14: luz vs. partículas (formulação da NASA, D1); distâncias (só os 2,3 km do delta; custo fixo da expedição); tempestade geomagnética fora do jogo; Veggie como fonte principal da estufa.
