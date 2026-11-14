# ADR-0020 — A conta ao vivo: a simulação devolve a noite passo a passo

Status: aceita, 2026-11-14.

**Contexto.** A criança precisa conseguir explicar a troca com as próprias palavras (checklist B7). Um resultado sem os passos por trás dele não ensina nada; a tela não deve calcular nada por conta própria (ADR-0009).

**Decisão.** `resolveNight` devolve a lista ordenada de passos (chave do rótulo, recurso, valor antes, mudança, valor depois, fichas do dado). A tela de distribuição a roda como prévia a cada célula movida, então a conta se atualiza ao vivo. A tela da noite anima os passos um por um, sempre na mesma ordem. Opcionalmente, a criança escolhe o resultado entre três opções antes de ele ser mostrado; um acerto rende a faixa "previsão certeira", um erro não custa nada. No modo assistido, a conta roda mais devagar e pode ser repetida.

**Consequências.** Uma única função alimenta a prévia, a animação, o diário do sol e os testes. Cada passo precisa ser testável isoladamente (`after = before + delta`).
