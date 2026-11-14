# A ciência por trás de Mars to Go

> Versão em inglês (padrão): [`docs/en/SCIENCE.md`](../en/SCIENCE.md). Todas as fontes abaixo foram lidas em 2026-11-14. O detalhe completo de cada dado está em [`DATA_MAP.md`](DATA_MAP.md); todos os números do jogo estão em `packages/sim/src/science.ts`.

## 1. Três rótulos

| Rótulo | Significado |
| --- | --- |
| **Medido** | Uma observação real, com instrumento, local e data |
| **Cenário** | Um valor que assumimos para a nossa base imaginária |
| **Simplificação** | Algo que o modelo arredonda ou deixa de fora, de propósito, e avisa |

Dados estáticos nunca são mostrados como ao vivo. Dados ao vivo mostram a hora em que foram obtidos; dados de arquivo mostram a data do evento.

## 2. Marte em primeiro lugar

O jogo se passa na Cratera Jezero, em Marte. Cada dado diz onde foi medido: Marte, Estação Espacial Internacional (ISS), Sol, Terra ou Lua. Dados que não foram medidos em Marte só entram como **paralelo declarado**, com a justificativa abaixo (item K3 do checklist). Se um paralelo não tem justificativa aqui, ele não está no jogo.

## 3. Paralelos declarados

### P1. Eventos solares registrados perto da Terra → risco em Marte
- **Dado:** flares, CMEs e SEPs do DONKI (instrumentos na Terra ou perto dela: GOES, SOHO, STEREO-A).
- **Por que vale para Marte:** a Terra e Marte compartilham o mesmo Sol; uma erupção envia luz e partículas pelo sistema solar. O modelo WSA-ENLIL do DONKI também prevê chegadas a Marte.
- **O que é diferente em Marte:** um flare visto da Terra pode não estar voltado para Marte; Marte não tem campo magnético global e tem uma atmosfera fina. NASA: a luz chega primeiro, as partículas vêm dezenas de minutos depois, e "Only the most energetic can reach the surface to be measured by RAD." — https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/
- **Como o jogo trata isso:** cada evento do catálogo registra se chegou a Marte, com evidência (previsão do modelo ou medição em Marte). Os números de risco são uma simplificação declarada, nunca uma dose.

### P2. Plantas cultivadas na ISS → a estufa de Marte
- **Dado:** NASA Veggie: alface romana roxa cresceu por 33 dias na ISS — https://www.nasa.gov/wp-content/uploads/2019/04/veggie_fact_sheet_508.pdf
- **Por que vale para Marte:** os dois são câmaras fechadas com luz artificial, água e ar controlado, longe dos campos da Terra.
- **O que é diferente em Marte:** a luz do Sol é ~43% da da Terra (NASA Mars Fact Sheet); a gravidade é 0,38 da da Terra, não microgravidade; o solo marciano contém sais de perclorato nocivos à maioria das formas de vida — https://science.nasa.gov/biological-physical/investigations/efri-elis-kpmsg/
- **Como o jogo trata isso:** só é usado o princípio "plantar hoje, comer depois"; o atraso de 2 sóis é uma simplificação declarada.

### P3. Material da CSA sobre produção de alimentos na Lua → apenas princípios gerais
- **Dado:** kit da Agência Espacial Canadense "Food production on the Moon and in remote areas" — https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/
- **Uso:** princípios gerais de cultivo em ambiente fechado (água reciclada, luz artificial, tempo de crescimento). **Nenhum número lunar é apresentado como marciano** (item K4 do checklist). Os fatos são citados com link; nenhum texto de terceiros é copiado.

### P4. Dosímetros da ISS (RadLab) — fora do MVP por enquanto
- Não é usado na tela até entendermos o agrupamento das leituras do RadLab (ADR-0026). Se entrar, vai dizer: medido na ISS, dentro do campo magnético da Terra; Marte não tem um.

## 4. Medido em Marte

| Fato | Fonte |
| --- | --- |
| Atmosfera 95,1% CO₂; pressão na superfície 6,36 mb | NASA Mars Fact Sheet — https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html |
| Luz do Sol 586,2 W/m² (0,431 da Terra) | idem |
| Temperatura média ~−59 °C; variação diária de −89 a −31 °C | idem |
| Gravidade 3,73 m/s² | idem |
| Sol = 24 h 39 min 35 s | idem |
| Sem campo magnético global | https://science.nasa.gov/mars/facts/ |
| Radiação de fundo ~210 μGy/dia (Curiosity RAD, Cratera Gale) | https://science.nasa.gov/resource/radiation-measurements-on-mars/ |
| Evento de 2024-05-20: um astronauta ao lado do Curiosity teria recebido 8.100 μGy (≈ 30 radiografias de tórax) | https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/ |
| Tempestade de poeira de 2018: tau 10,5; Opportunity caiu para 21 Wh | https://science.nasa.gov/resource/on-mars-light-is-energy/ |
| O MOXIE produziu 122 g de oxigênio a partir do ar de Marte, até 12 g/h, em 16 operações | https://www.jpl.nasa.gov/news/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/ |
| Delta de Jezero a 2,3 km a oeste do local de pouso | https://www.jpl.nasa.gov/images/pia24485-perseverance-view-of-the-delta-in-jezero-crater/ |

## 5. Medido na Terra, sobre pessoas

| Fato | Fonte |
| --- | --- |
| Um tripulante usa 0,895 kg de oxigênio por dia | NASA BVAD, NASA/TP-2015-218570/REV2 — https://ntrs.nasa.gov/citations/20210024855 |
| Atraso de rádio Terra–Marte de ~4 a ~24 min em cada sentido | https://www.nasa.gov/centers-and-facilities/goddard/space-communications-7-things-you-need-to-know/ |

## 6. O que o jogo não modela

- Nenhuma dose é calculada para Marte; a exposição é uma palavra (baixa, média, alta).
- Nenhum limite médico encerra a missão.
- Células de energia, unidades de ar e unidades de comida são unidades do jogo, não watts nem quilogramas.
- O tempo é comprimido: as plantas levam 2 sóis, a Terra responde na mesma noite.
- O terreno não muda o custo da expedição; só a distância até o delta (2,3 km) é mostrada.
