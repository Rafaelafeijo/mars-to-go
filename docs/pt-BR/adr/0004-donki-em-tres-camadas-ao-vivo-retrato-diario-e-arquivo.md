# ADR-0004 — DONKI em três camadas: ao vivo, retrato diário e arquivo

Status: aceita, 2026-11-14.

**Contexto.** O desafio destaca ligar a decisão de blindagem ao clima espacial real. Chamadas diretas do navegador podem falhar e expor chave.
**Decisão.** Três camadas, da mais fresca à mais segura: a API do projeto consulta o DONKI e guarda em cache; uma tarefa agendada grava um retrato diário dentro do site; um catálogo curado de eventos reais vai embutido. O jogo usa a mais fresca que responder e mostra qual é. A conversão de classe do evento em risco no jogo é uma tabela declarada como simplificação.
**Consequências.** O jogo funciona offline e com o DONKI fora do ar. O back-end passa a ter função real.
