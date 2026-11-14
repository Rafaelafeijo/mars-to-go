# ADR-0022 — O código da carreira substitui o código da missão

Status: aceita, 2026-11-14. Altera a ADR-0017.

**Contexto.** Com uma carreira de missões (ADR-0021), restaurar só a missão em andamento faria perder as insígnias e as missões desbloqueadas em outro aparelho.

**Decisão.** O progresso é salvo no aparelho depois de cada sol, com uma versão do salvamento. Um "código da carreira" curto guarda as missões desbloqueadas, as insígnias, as descobertas e a missão em andamento, e restaura tudo em outro aparelho: bits compactados em base32 de Crockford, blocos de 4, um caractere de verificação, cerca de 16–20 caracteres. Nenhum dado pessoal. As configurações avisam que, sem o código, limpar os dados do navegador apaga o progresso.

**Consequências.** O formato do código tem sua própria versão e um teste de ida e volta. Os checkpoints dos sóis não estão no código.
