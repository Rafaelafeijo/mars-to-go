# ADR-0009 — A simulação é um pacote puro e testado

Status: aceita, 2026-11-14.

**Contexto.** A validade depende de contas corretas e auditáveis.
**Decisão.** packages/sim não importa nada de interface. Cada conta mostrada na tela tem teste. Teste antes da tela.
**Consequências.** A interface só exibe o que a simulação calcula.
