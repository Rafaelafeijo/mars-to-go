# ADR-0024 — Dado com ficha pendente fica escondido, não quebra o build

Status: aceita, 2026-11-14. Refina a ADR-0014.

**Contexto.** A regra 16 diz: sem ficha, sem tela. Fazer o build falhar por qualquer ficha pendente bloquearia os deploys durante um hackathon de fim de semana por motivos sem relação com o que está na tela.

**Decisão.** Um dado cuja ficha está incompleta ou marcada como pendente fica escondido de todas as telas, da página de ciência e do JSON público. O build lista os itens escondidos em um relatório, mas não falha, e o deploy segue.

**Consequências.** As telas precisam funcionar quando um dado está escondido (nada de caixas vazias). O relatório é conferido antes de cada commit de fase.
