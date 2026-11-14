# ADR-0021 — Uma carreira de missões, e o que significa "completar o jogo"

Status: aceita, 2026-11-14.

**Contexto.** A rejogabilidade se destaca no desafio (checklist F2). Uma única missão de 7 sóis acaba rápido demais; eventos aleatórios sozinhos não dão sensação de progresso.

**Decisão.** O jogo é uma carreira de missões de 7 sóis, todas com as mesmas regras e listas de eventos diferentes: missão 1 "Primeiros sóis" (guiada, Sol calmo, aberta desde o início); missão 2 "A tempestade de maio" (o evento real de 2024-05-20; abre quando todos voltam na missão 1); missão 3 "Céu de poeira" (poeira em mais de um sol; abre quando todos voltam na missão 2); "Me surpreenda" (eventos sorteados) e "Hoje no espaço" (clima espacial real recente), ambas abertas depois da missão 1. Completar o jogo = mural de insígnias completo: missões 1–3 com todos de volta, pelo menos uma missão de referência, todas as descobertas. Isso dá o título de "comandante" e uma cena final. Toda missão pode ser jogada de novo e termina com "Quer jogar esta missão de novo com outro plano?" e, depois de um retorno antecipado, "Voltar ao sol em que tudo mudou".

**Consequências.** As missões são dados (listas de eventos) em `packages/content`, não código. As regras de desbloqueio e de conclusão são testadas em `packages/sim`.
