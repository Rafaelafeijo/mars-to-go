# A ciência por trás de Mars to Go

> Versão em inglês (padrão): [`docs/en/SCIENCE.md`](../en/SCIENCE.md). Atualizado em 2026-11-15 para corresponder ao jogo como ele está agora (missões 1 e 2, ADR-0033 a ADR-0035). O detalhe completo de cada dado está em [`DATA_MAP.md`](DATA_MAP.md). Todos os números do jogo estão em `packages/sim/src/science.ts`; todos os textos das fichas estão em `packages/content/src/cards.ts` e `facts.ts`. Os créditos das fotos estão em [`ASSETS.md`](ASSETS.md).

## 1. Três rótulos

| Rótulo | Significado |
| --- | --- |
| **Medido** | Uma observação real, com instrumento, local e data |
| **Cenário** | Um valor que assumimos para a nossa base imaginária |
| **Simplificação** | Algo que o modelo arredonda ou deixa de fora, de propósito, e avisa |

Dados estáticos nunca são mostrados como ao vivo. O jogo não faz nenhuma chamada ao vivo: o clima espacial da tela inicial é uma cópia datada do DONKI salva duas vezes por dia ([`DATA_MAP.md`](DATA_MAP.md) D5), e cada evento das missões vem de um arquivo embutido, com a sua própria data.

## 2. Marte em primeiro lugar

O jogo se passa na Cratera Jezero, em Marte. Cada dado diz onde foi medido: Marte, Estação Espacial Internacional (ISS), Sol, Terra ou Lua. Dados que não foram medidos em Marte só entram como **paralelo declarado**, listado na seção 4 com a sua justificativa (item K3 do checklist). Se um paralelo não está listado aqui, ele não está no jogo.

## 3. Medido em Marte

Todos com rótulo **medido**, local **Marte**. Atenção ao local: nem tudo foi medido em Jezero.

| O que o jogo diz | Fonte | Local | Usado em |
| --- | --- | --- | --- |
| Ar com 95,1% de CO₂; pressão de 6,36 mb | NASA Mars Fact Sheet (NSSDCA, atualizado em 2025-05-19) — https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html | Marte (global) | Fichas do Ar e do Suporte à Vida; fato do sol 1 |
| Luz do Sol de 586,2 W/m², 0,431 da da Terra | idem | Marte (média) | Ficha das células de energia |
| Média de −59 °C | idem | Marte (global) | Ficha do aquecimento |
| Variação diária de −89 a −31 °C | idem: "Viking 1 Lander site" | **Local de pouso da Viking 1, não Jezero** | Termômetro; fato do sol 4 |
| Gravidade de 3,73 m/s² | idem | Marte | Ficha da estufa (0,38 da da Terra) |
| Sol = 24,6597 h (24 h 39 min 35 s); "40 minutos a mais" é arredondado | idem | Marte | Ficha do sol |
| Sem campo magnético global hoje | NASA Science, Mars Facts — https://science.nasa.gov/mars/facts/ | Marte | Ficha do Escudo; fato do sol 3 |
| O solo tem sais de perclorato, que fazem mal à maioria dos seres vivos | NASA Science — https://science.nasa.gov/biological-physical/investigations/efri-elis-kpmsg/ | Marte | Ficha da estufa |
| Radiação em dia calmo ~210 μGy/dia (RAD do Curiosity) | NASA PIA17600 (2013-12-09) — https://science.nasa.gov/resource/radiation-measurements-on-mars/ | **Cratera Gale** | Ficha do Escudo (em nenhuma conta) |
| Tempestade de 20/05/2024: um astronauta ao lado do Curiosity "would have received" 8.100 μGy ≈ 30 radiografias do tórax; erupção estimada depois como X12; o maior pico do RAD desde o pouso | NASA/JPL release 2024-080 (2024-06-10) — https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/ · Gale em https://science.nasa.gov/mission/msl-curiosity/ | **Cratera Gale** | Sol 7 da missão 2 (risco 3); fato do sol 7 da missão 1; ficha da crise |
| Tempestade de poeira de 2018: tau 10,5, Opportunity com 21 Wh | NASA Science, "On Mars, Light Is Energy" (2018-06-13) — https://science.nasa.gov/resource/on-mars-light-is-energy/ | Local do Opportunity, não Jezero | Ficha da poeira |
| O MOXIE fez 122 g de O₂ com o ar de Marte, até 12 g/h, 16 operações (2021–2023) | NASA/JPL (2023-09-06) — https://www.jpl.nasa.gov/news/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/ | Jezero | Ficha do Suporte à Vida; fato do sol 1 |
| Céu amarelo a laranja de dia, azul perto do Sol no pôr do sol; Sol com ~2/3 do tamanho visto da Terra | NASA Science, "What Do Sunrises and Sunsets Look Like on Mars?" — https://science.nasa.gov/solar-system/planets/mars/what-does-a-sunrise-sunset-look-like-on-mars/ | Marte (imagens de rovers) | Cores do céu em 3D; fato "Olhar o céu" |
| Frente do delta a ~2,3 km a oeste do local de pouso | NASA/JPL PIA24485 (2021-03-05) — https://www.jpl.nasa.gov/images/pia24485-perseverance-view-of-the-delta-in-jezero-crater/ | Jezero | Viagem longa do rover (ADR-0035) |
| Por que o delta: "clear evidence that a large lake once filled the crater"; as rochas finas da base são a melhor aposta para sinais de vida antiga | NASA/JPL, "NASA's Perseverance Rover Arrives at Delta for New Science Campaign" — https://www.jpl.nasa.gov/news/nasas-perseverance-rover-arrives-at-delta-for-new-science-campaign/ | Jezero | Ficha da frente do delta |
| O Perseverance fecha núcleos de rocha em tubos: 43 tubos, 38 para amostras, para uma volta futura | NASA Science, Mars Rock Samples — https://science.nasa.gov/mission/mars-2020-perseverance/mars-rock-samples/ | Jezero | Ficha das amostras (`SAMPLES_GOAL`, cenário) |
| Primeiros materiais de traje espacial em Marte, incluindo um pedaço de viseira, no alvo de calibração do SHERLOC | NASA/JPL PIA24033 — https://www.jpl.nasa.gov/images/pia24033-spacesuit-materials-on-perseverances-sherloc-calibration-target/ · foto PIA26520 | Jezero (no rover) | Fato do sol 1 da missão 2 |
| Fotos reais: Jezero (PIA24921; PIA23239 da órbita), Rochette (PIA24840), Kodiak (PIA24802), frente do delta (PIA24925); pôr do sol em Gale (PIA19400) e a Terra vista de Marte (PIA17936) | NASA Photojournal; linhas 1–8 de [`ASSETS.md`](ASSETS.md) | Jezero; **Gale** para PIA19400 e PIA17936 | Tela inicial, fatos, lugares do rover, tela final |

## 4. Paralelos declarados (não medidos em Marte)

Cada entrada: **o quê** · **fonte** · **local** · **rótulo** · **por que serve para Marte** · **o que é diferente em Marte**.

### ISS

**P1. Uma alface cresceu por 33 dias (Veggie, VEG-01)**
- Fonte: ficha técnica do Veggie da NASA — https://www.nasa.gov/wp-content/uploads/2019/04/veggie_fact_sheet_508.pdf · Local: ISS, 2014–2015 · Rótulo: medido; a espera de 2 sóis do jogo é simplificação.
- Por quê: uma câmara fechada com lâmpadas, água e ar controlado, longe dos campos da Terra, como uma estufa em Marte.
- Diferente em Marte: luz do Sol ~43% da da Terra; gravidade de 0,38 g, não microgravidade; solo com perclorato (seção 3). Só o princípio "plantar hoje, comer depois" é usado.

**P2. Foto de plantas na Advanced Plant Habitat**
- Fonte: images.nasa.gov `iss072e404269` (2024-12-27) · Local: ISS · Rótulo: foto real, selo "Estação Espacial Internacional (paralelo)".
- Por quê: mostra como é uma câmara fechada de cultivo. Diferente em Marte: como em P1.

**P3. Luzes de cultivo cor-de-rosa na estufa 3D (os LEDs do Veggie)**
- O quê: a lâmpada da estufa 3D é desenhada rosa/magenta, "from red and blue LEDs", inspirada na câmara Veggie iluminada por LEDs (comentário no código em `apps/web/src/world/Scene3D.tsx`). É uma escolha visual, não um número, e nenhum texto na tela afirma isso.
- Fonte: NASA, "Growing Plants in Space" (https://www.nasa.gov/exploration-research-and-technology/growing-plants-in-space/, página atualizada em 08/12/2023, lida em 14/11/2026): "Since plants reflect a lot of green light and use more red and blue wavelengths… the Veggie chamber typically glows magenta pink." (A ficha técnica do Veggie não cita as cores.)
- Por quê: uma estufa em Marte também precisaria de luz artificial. Diferente em Marte: há alguma luz do Sol (43% da da Terra), e a poeira pode diminuí-la.

### Lua

**P4. Foto do jipe lunar da Apollo 15**
- Fonte: images.nasa.gov `AS15-88-11901` (1971-07-31 a 08-02) · Local: Lua, Hadley-Apennine · Rótulo: foto real, com legenda dizendo que é a Lua.
- Por quê: um veículo deixa os astronautas irem mais longe do módulo de pouso, como o rover do jogo. Diferente em Marte: uma atmosfera fina de CO₂ (a Lua não tem nenhuma), tempestades de poeira e 0,38 da gravidade da Terra.

**P5. Caminhadas de cerca de 2 km, porque o traje precisa ter ar para a volta**
- Fonte: NASA, "Exploration EVA Testing and Analogs", NTRS 20210000827 — https://ntrs.nasa.gov/citations/20210000827 · Local: planejamento para a Lua · Rótulo: valor de planejamento, mostrado como paralelo com a Lua no título do fato.
- Por quê: a regra da volta depende dos consumíveis do traje, que valem em qualquer superfície. Diferente em Marte: o número da NASA é para a Lua; o jogo não o apresenta como número de Marte. Ele explica o aviso na borda e o custo da viagem longa (3 de ar, 2 pontos: valores do jogo).

### Terra

**P6. Tanque de oxigênio líquido, Kennedy Space Center**
- Fonte: images.nasa.gov `KSC-20191108-PH-JBS01_0049` (2019-11-08) · Local: Terra, Launch Pad 39B · Rótulo: foto real, legenda "Não é em Marte".
- Fonte do texto: NASA Glenn, "Liquefaction and Storage of In-Situ Oxygen on the Surface of Mars", NTRS 20160004210 — https://ntrs.nasa.gov/citations/20160004210 (um estudo de projeto para Marte).
- Por quê: guardar oxigênio como líquido frio funciona do mesmo jeito. Diferente em Marte: o tanque da foto guarda propelente de foguete na Terra; em Marte o oxigênio seria feito a partir do CO₂ e mantido frio num ambiente com média de −59 °C.

**P7. Unidade de teste do conversor Stirling, NASA Glenn**
- Fonte: images.nasa.gov `GRC-2015-C-06315` (data da biblioteca 2016-11-09) · Local: Terra, Cleveland, Ohio · Rótulo: foto real; a legenda diz que não há reator na foto.
- Fonte do texto: NASA Mars Design Reference Architecture 5.0, NASA-SP-2009-566 — https://www.nasa.gov/pdf/373665main_NASA-SP-2009-566.pdf (uma usina nuclear de 30 kW a ~1 km da base: um plano, não uma medição).
- Por quê: é um teste em solo do equipamento que uma usina assim usaria. Diferente em Marte: nunca foi construída nem operada em Marte; a nossa base usa células solares (cenário do jogo).

**P8. Foto da mochila do traje Apollo (PLSS)**
- Fonte: images.nasa.gov `S68-34582` (1968) · Local: Terra (registro da NASA Johnson) · Rótulo: foto real.
- Por quê: a mochila de um traje dá e limpa o ar do mesmo jeito em qualquer lugar. Diferente em Marte: um traje marciano enfrentaria poeira, frio e ar de CO₂ do lado de fora.

**P9. Como os astronautas respiram no traje**
- Fonte: NASA-STD-3001 Technical Briefs, Carbon Dioxide OCHMO-TB-004 (pp. 10–11) — https://www.nasa.gov/wp-content/uploads/2023/03/co2-technical-brief-ochmo.pdf — e ECLSS OCHMO-TB-002 (p. 18) · Local: Terra (norma da NASA e equipamento de traje) · Rótulo: fato de engenharia, mostrado só como texto (sem número).
- O que o jogo diz: oxigênio puro entra no capacete por trás da cabeça, passa pelo rosto e desce pelo traje; a mochila tira o CO₂ (dor de cabeça e cansaço se acumular) e a umidade, e manda o oxigênio de volta. O brief de CO₂ diz que o PLSS usa cartuchos de LiOH ou METOX e que a ventilação do capacete espalha o gás que entra sobre o rosto (os dois relidos em 2026-11-15).
- Pressão do traje: o resumo de ECLSS (OCHMO-TB-002 Rev A, p. 18) diz "The PLSS maintains a pure O2 atmosphere at approximately 4.2 psi" (conferido, lido por inteiro em 15/11/2026). O número **não aparece no jogo**; o fato diz só "oxigênio puro".
- Por quê: a mesma física do traje vale em Marte. Diferente em Marte: o ar de fora é CO₂ a ~6 mb, então o traje precisa manter sozinho toda a sua pressão e o seu oxigênio.

**P10. Consumo de oxigênio de 0,895 kg por pessoa por dia**
- Fonte: NASA BVAD, NASA/TP-2015-218570/REV2, Tabela 3-31 — https://ntrs.nasa.gov/citations/20210024855 · Local: Terra (dados humanos) · Rótulo: medido.
- Por quê: as pessoas respiram igual em Marte. Diferente em Marte: nada na respiração; o jogo usa unidades do jogo, não kg.

**P11. Atraso de rádio de ~4 a ~24 min, só a ida**
- Fonte: NASA, "Space Communications: 7 Things You Need to Know" (2020-10-06) — https://www.nasa.gov/centers-and-facilities/goddard/space-communications-7-things-you-need-to-know/ · Rótulo: medido; os 8 min de ida e volta são derivados (simplificação).
- Por quê: trata da própria distância Terra–Marte. Diferente: o jogo encurta a espera para uma noite.

**P12. Limite de dose na carreira da NASA: 600 mSv**
- Fonte: NASA-STD-3001 Vol. 1, §4.8.2 (mantém o risco extra de câncer abaixo de 3%) · Local: Terra (norma da NASA) · Rótulo: o `DOSE_LIMIT = 2` pontos do jogo é simplificação.
- Usado **só como a ideia** por trás do limite de dose do jogo (ADR-0033). Pontos do jogo não são milisieverts, nenhuma dose é calculada, e o limite real vale para uma carreira, não uma semana.

**P13. Partículas solares danificam eletrônicos**
- Fonte: NASA SVS 31248 — https://svs.gsfc.nasa.gov/31248: partículas energéticas podem "damage critical electronics" e "degrade solar arrays" · Local: naves perto da Terra · Rótulo: 1 célula por ponto (máximo 2) é simplificação.
- Por quê: Marte não tem campo magnético global, então as máquinas da base ficam ainda mais expostas. Diferente: um dano real pode durar mais ou ser consertado.

### Sol

**P14. Erupções e CMEs do DONKI, vistas de perto da Terra**
- Fonte: NASA CCMC DONKI — https://ccmc.gsfc.nasa.gov/DONKI/ (GOES para erupções; coronógrafos do SOHO e do STEREO-A para CMEs) · Local: o Sol, visto do lado da Terra · Rótulo: medido (evento).
- Por quê: a Terra e Marte têm o mesmo Sol. Diferente em Marte: uma erupção vista da Terra pode não estar voltada para Marte, então uma erupção sozinha nunca aumenta a dose (a Antena responde "a Terra não sabe").

**P15. Previsões de chegada a Marte do WSA-ENLIL**
- Fonte: rodadas WSA-ENLIL do DONKI (IDs no DATA_MAP D2) · Rótulo: **previsão de modelo**, mostrada como "previsão de um modelo da NASA", nunca como medição.
- Por quê: o modelo acompanha a CME pelo Sistema Solar e cita Marte. Diferente: uma previsão pode errar; duas CMEs da missão 2 foram previstas na nave Psyche, não em Marte (alarmes falsos).

**P16. Imagem do SDO da erupção X8.7**
- Fonte: NASA SVS 14592 (2024-05-14), cores realçadas · Local: o Sol, visto da órbita da Terra · A legenda avisa quando não é a erupção do próprio sol.

## 5. Não usado mais (ou nunca mostrado)

- **Material lunar da CSA sobre alimentos:** não é usado. Nenhum número lunar é apresentado como marciano (K4).
- **Dosímetros da ISS (RadLab / OSDR):** nenhum número na tela (ADR-0026).
- **Estudos de saúde de astronautas do OSDR:** fora do jogo (cortado, ADR-0031).
- **Mars Trek:** não é usado; a vista da órbita é a foto PIA23239.
- **"0,67 mSv/dia" do JPL (2013) e os dados de velocidade de entrada:** registrados no DATA_MAP, não mostrados.

## 6. O que o jogo não modela

- Nenhuma dose é calculada para Marte. Exposição são pontos do jogo com palavras (baixa 0–1, média 2, alta acima de 2). O limite de 2 pontos encerra a missão (ADR-0033); ele representa a ideia de P12, não o seu valor.
- Células de energia, unidades de ar e unidades de comida são unidades do jogo, não watts nem quilos.
- O tempo é comprimido: as plantas levam 2 sóis; uma CME chega na mesma noite; a Terra responde na mesma noite.
- A distância só muda o custo para a frente do delta (2,3 km, PIA24485): 3 de ar e 2 pontos em vez de 2 e 1 (valores do jogo, ADR-0035). O terreno não é modelado.
- A crise dá 10 segundos (regra do jogo); uma tripulação de verdade teria minutos e procedimentos escritos.
