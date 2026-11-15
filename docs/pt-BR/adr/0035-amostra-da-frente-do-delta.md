# ADR-0035: O rover escolhe o destino; a missão 2 exige a amostra da frente do delta

- Status: aceita (revisão de design E, opção A, 15/11/2026)
- Inglês: [`../../en/adr/0035-delta-front-sample.md`](../../en/adr/0035-delta-front-sample.md)

## Contexto
Uma amostra de qualquer lugar era fácil demais e não dava ao rover uma decisão de verdade.

## Decisão
- Quando o rover está no plano, a criança escolhe o destino.
  - **Rochette** fica perto: `EXPEDITION_AIR` = 2 de ar e `EXPEDITION_EXPOSURE` = 1 ponto.
  - **A frente do delta** fica longe, a 2,3 km (NASA/JPL PIA24485): `EXPEDITION_FAR_AIR` = 3 de ar e `EXPEDITION_FAR_EXPOSURE` = 2 pontos.
  - Os números são valores do jogo.
- `MissionDef.sampleSite`: a missão 2 só conta a amostra de `delta-front`. A missão 1 conta qualquer amostra.
- Por que o delta: a NASA/JPL ("Perseverance Arrives at Delta") explica que a NASA escolheu Jezero pelo seu delta, "prova clara de que um grande lago já encheu a cratera", e que as rochas finas da base do delta são a melhor aposta da missão para achar sinais preservados de vida antiga.
- Sem destino escolhido, o rover vai ao primeiro lugar perto que ainda não visitou. A missão 1 nunca chega ao lugar longe por padrão.

## Consequências
- Na missão 2, a amostra do delta usa os 2 pontos de dose de 2. Dali em diante, toda tempestade precisa ser totalmente bloqueada.
- O plano de vitória testado manda o rover ao delta no sol 2.
