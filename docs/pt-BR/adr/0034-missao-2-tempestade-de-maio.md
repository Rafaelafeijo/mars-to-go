# ADR-0034: Missão 2 "A tempestade de maio" — alarmes falsos, CMEs rápidas e uma crise com escolhas

- Status: aceita (revisões de design C e D, 15/11/2026)
- Inglês: [`../../en/adr/0034-mission-2-may-storm.md`](../../en/adr/0034-mission-2-may-storm.md)

## Contexto
A primeira versão da missão 2 era fácil demais: só ar e comida quase sempre venciam. A Antena não dava retorno. A crise tinha uma única resposta pronta e aparecia mesmo quando o Escudo já cobria o risco.

## Decisão
1. **Um evento real em todo sol** (registros do DONKI conferidos em 15/11/2026):
   - **Sol 1:** erupção X8.7. Chegada a Marte desconhecida.
   - **Sóis 2 e 4:** alarmes falsos. O modelo WSA-ENLIL da NASA mandou essas duas CMEs para a nave Psyche, não para Marte (CME/30883, CME/30948); por isso `reachesMars: false`.
   - **Sóis 3, 5 e 6:** CMEs rápidas com chegada prevista a Marte.
   - **Sol 7:** a tempestade de 20/05/2024 medida pelo RAD do Curiosity.
2. **CME rápida** (regra do jogo): a velocidade mais precisa do DONKI é de pelo menos 1.000 km/s e há chegada a Marte. Todo evento rápido que chega a Marte traz a crise de 10 segundos.
3. **A crise mostra o risco contra o Escudo.**
   - Se o Escudo já cobre o risco, a crise diz isso e só pede para continuar.
   - Se não cobre, a criança passa células para o Escudo da máquina que escolher: Máquina de ar, Estufa ou Antena. Cada origem mostra o seu custo. O rover pode ser chamado de volta.
   - Quando o tempo acaba, as células já passadas ficam. O modo assistido não tem relógio.
4. **A resposta da Terra** é contada como "amanhã" à noite e como "hoje" na manhã seguinte.
5. **A missão 2 tem fatos próprios**, cada um com foto real da NASA. Nenhum fato ou foto se repete entre as missões.

## Consequências
- Proteger todo sol deixa energia de menos, então perguntar à Terra sobre o dia seguinte compensa.
- O plano de vitória testado pergunta à Terra nos sóis 1 e 3.
- A regra fixa `CRISIS_SHIELD_SWAP_CELLS` fica só nas telas antigas em lista.
