# ADR-0029 — Modo de teste: evidência de uso real, guardada no aparelho

> Versão em inglês (padrão): [`docs/en/adr/0029-playtest-mode.md`](../../en/adr/0029-playtest-mode.md)

Status: aceita, 2026-11-14.

**Contexto.** O time vai testar o jogo com uma criança real de 8 anos, num celular, antes da fase 5. Os jurados valorizam evidência; a privacidade da criança não se negocia (regras 9 e 10 do CLAUDE.md).

**Decisão.**
- `?playtest=1` no endereço liga o modo de teste; um indicador discreto mostra que está ligado.
- Enquanto ligado, o jogo grava **só no aparelho** uma lista de eventos anônimos com marca de tempo: início e fim de cada sol, cada célula movida, tempo até travar o plano, resposta da previsão, fichas de dado abertas, ajuda pedida, escolha e tempo na crise, resultado, "jogar de novo". Nenhum dado pessoal, nenhum texto digitado, nada enviado a servidor.
- Um botão "Exportar sessão" baixa um arquivo JSON.
- O time preenche `docs/pt-BR/PLAYTEST.md`; os arquivos vão para `docs/playtest/` (JSON, capturas de antes e depois, um trecho curto de gravação de tela **sem áudio**, conferido antes do commit).
- Cada mudança feita por causa do teste é um commit próprio citando a observação; no máximo as três correções mais importantes. Segunda rodada no domingo de manhã, se houver tempo.
- Nada de nome, imagem, voz ou semelhança de menor em nenhum arquivo.

**Consequências.** Um módulo pequeno de registro de eventos no app, desligado por padrão. O README e o SUBMISSION ganham uma seção curta, só com fatos, "Tested with a real child".
