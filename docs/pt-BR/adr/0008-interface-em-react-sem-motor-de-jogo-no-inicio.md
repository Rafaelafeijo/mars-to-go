# ADR-0008 — Interface em React; sem motor de jogo no início

Status: aceita, 2026-11-14.

**Contexto.** O jogo é de decisão por turnos, precisa de acessibilidade e idiomas, e o prazo é de um fim de semana.
**Decisão.** React + Vite, com animação em CSS e SVG. Um motor como o Phaser só entra para a cena de abertura, se houver folga, registrado em novo ADR.
**Consequências.** Menos peças para montar e depurar. Menos espetáculo visual.
