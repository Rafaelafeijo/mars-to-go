# ADR-0033: Escolhas com consequência (limite de dose, dano por radiação, amostras de rocha, três resultados)

- Status: aceita (revisão de design B, 15/11/2026)
- Inglês: [`../../en/adr/0033-choices-with-consequences.md`](../../en/adr/0033-choices-with-consequences.md)

## Contexto

A segunda revisão de design mostrou que pôr células só em ar e comida sempre vencia. As causas:

- **A radiação não tinha consequência.** A CME do sol 5, sem escudo, deixava a exposição em "baixa" (o limite era 2), e a exposição nunca encerrava a missão.
- **Rover e Antena não davam retorno.** A descoberta do rover era só texto. A resposta da Terra nunca aparecia no mundo 3D e, de qualquer forma, não teria importância, porque o escudo não importava.

O desafio pede escolhas com trocas reais. No jogo não havia dilema.

## Decisão

1. **Limite de dose.**
   - `DOSE_LIMIT = 2` pontos.
   - Se a exposição passa do limite no fim de uma noite, a missão termina em retorno antecipado, causa `radiation` ("o médico da missão traz a tripulação de volta").
   - A próxima missão fica bloqueada, porque a carreira só a abre com todos em casa.
   - Palavras: baixa 0–1, média 2, alta acima de 2.
   - Paralelo real: o limite de carreira da NASA, de 600 mSv (NASA-STD-3001 Vol. 1, §4.8.2). Pontos do jogo não são mSv.
2. **Dano por radiação.**
   - Os pontos que passam pelo escudo também custam células no sol seguinte: `RADIATION_DAMAGE_CELLS_PER_POINT = 1`, com teto `RADIATION_DAMAGE_MAX_CELLS = 2`.
   - Novo campo de estado `lostCells` e novo passo da noite `damage`.
   - `freeCells(dust, lostCells)`. A projeção inclui o dano.
   - Base real: o NASA SVS 31248 diz que partículas solares energéticas "danificam eletrônicos essenciais, degradam painéis solares".
3. **Amostras de rocha.**
   - Cada saída do rover traz 1 amostra.
   - Uma missão bem-sucedida exige `SAMPLES_GOAL = 1`. É um valor de cenário.
   - Base real: os tubos de amostra do Perseverance (página Mars Rock Samples da NASA).
4. **Três resultados.**
   - `missionResult` devolve `success`, `with_failures` ou `early_return`.
   - `missionObjectives` confere três coisas: em casa, amostra, dose.
   - A tela de fim mostra os três objetivos e o que falhou.
   - Os veredictos antigos (`on_edge`, `with_margin`, `reference`) ficam para o código de carreira.
5. **Antena.**
   - A resposta da Terra aparece no relatório da noite e na abertura do sol seguinte.
   - Um evento com `reachesMars: 'unknown'` é contado como "não há medição". Deixa de ser contado como "não chegou a Marte", o que era uma afirmação falsa.

## Consequências

- O jogo de exemplo B ("Cientista", no SIM_MODEL §8) agora termina no sol 2 por radiação: uma saída do rover seguida de nenhum escudo numa noite de risco 2. Os jogos A, C e o bônus mantêm os seus números.
- Na missão 1, coletar uma amostra exige proteger, ao menos em parte, contra a CME do sol 5; senão a dose passa do limite. Cada escolha agora tem um custo que aparece.
- Três cartões de dados são criados ou reescritos: `exposure`, `radiationDamage` e `samples`.
