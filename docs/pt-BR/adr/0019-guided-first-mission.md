# ADR-0019 — Primeira missão guiada

Status: aceita, 2026-11-14.

**Contexto.** Cinco destinos no primeiro sol é muita coisa para uma criança de 7 anos (checklist C3, C4). As regras precisam ser as mesmas em todo lugar, para que o que a criança aprende na missão 1 valha em todas as missões.

**Decisão.** Na missão 1, os destinos vão sendo desbloqueados com o tempo: no sol 1, Suporte à Vida e Estufa; o sol 2 acrescenta o Escudo; o sol 3 acrescenta Expedição e Perguntar à Terra. Todas as outras missões começam com tudo aberto ("modo livre"). O desbloqueio só restringe o que está habilitado; as regras da simulação não mudam. As partidas resolvidas de SIM_MODEL §8 rodam no modo livre com uma semente de teste.

**Consequências.** `MissionState` carrega `mode: 'guided' | 'free'`; distribuições que usam um destino bloqueado são rejeitadas. A missão 1 ensina uma troca de cada vez.
