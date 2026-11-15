# Registro de teste com criança

> Versão em inglês (padrão): [`docs/en/PLAYTEST.md`](../en/PLAYTEST.md). Regras: ADR-0029. **Nada de nome, imagem, voz ou semelhança do testador em nenhum arquivo.** Só fatos.

Como as sessões foram feitas: a criança jogou sem ajuda, a não ser quando pediu; a mãe anotou só fatos, durante e logo depois da sessão. Um modo de exportar a sessão foi planejado (ADR-0029), mas não ficou pronto a tempo; por isso não há arquivos exportados.

---

## Rodada 0 (protótipo 3D, antes do modo de teste)

Sessão informal, sem arquivo exportado (o modo de teste ainda não existia). Registro feito pela responsável, só com fatos.

| Campo | Valor |
| --- | --- |
| Data | 14/11/2026, noite |
| Aparelho | computador, navegador, servidor local |
| Versão do jogo (commit) | `21e1828` (ramo `phase-3b`, protótipo do mundo 3D) |
| Testador | testador, 8 anos |
| Idioma jogado | português |
| Modo assistido | desligado |

### Observações

| Momento | O que aconteceu (fatos) |
| --- | --- |
| Tela inicial | Não quis ler o texto explicativo inicial. |
| Instruções | A segunda explicação, em tópicos, ajudou a leitura. |
| Missão | Não percebeu que o jogo é uma sequência de missões. Faltou mostrar o que aconteceu com as escolhas do sol anterior. |
| Jogabilidade | Foi o que mais gostou: andar pelo terreno e conhecer os itens. Usou mais o toque nas máquinas do que a barra de baixo. |
| Clima | Não viu a previsão do dia no início. Quando viu que haveria erupção, se emocionou e ficou esperando algo acontecer; nada aconteceu na cena. |
| Ar | Não percebeu em nenhum momento que o ar estava crítico. |
| Comida | Não entendeu o recurso comida nem o tempo de crescimento. |
| Rover e antena | Não entendeu o que fazem nem o impacto. |
| Personagem | Achou o astronauta parecido com bloco, não com astronauta (observação da responsável). |
| Fim | Retorno antecipado por falta de ar no sol 3; o motivo não ficou claro. |
| Geral | Se emocionou com o jogo; a assimilação dos conceitos não ficou clara para a responsável. |

### As cinco perguntas finais (brief §11)

1. Tempo até entender a primeira distribuição sem ajuda: não medido.
2. Onde travou: ar crítico, comida, rover e antena, motivo do retorno antecipado.
3. O que fez na primeira crise: não houve crise na cena; esperou a erupção acontecer.
4. Uma frase, com as palavras dele: não registrada.
5. Pediu para jogar de novo? não registrado.

**O que a rodada 0 mudou:** essas observações viraram o bloco 1 (commit `c66cfa9`): tela inicial com uma imagem e um botão, briefing em tópicos, a previsão em destaque no início de cada sol, a tempestade solar visível à noite, um relatório depois de cada noite, o tanque de ar crítico, plantas que crescem, ações do rover e da antena, o nosso próprio astronauta e o motivo do retorno antecipado com os números.

---

## Revisão de design A (adulto, depois do bloco 1)

Não é sessão com criança: a mãe revisou o commit `9198cfb` no computador, nos dois idiomas. Registrado para que cada mudança tenha o seu motivo.

| Observação | Mudança (commit `c550a4f`) |
| --- | --- |
| O rodapé não acompanha a página; margem lateral apertada perto dos botões do topo | Uma só margem lateral para barra do topo, herói e rodapé; rodapé na largura toda |
| Em português o botão "Jogar" desceu de linha | Os botões ficam numa linha a partir da largura de tablet |
| Os papéis em português misturavam feminino e masculino | Uma forma para todos os papéis (masculino genérico, como a revisora pediu) |
| A abertura do sol tem pouco contraste | Fundo mais escuro e desfocado atrás de todo diálogo |
| Os rótulos das máquinas parecem "Windows 97" e cobrem os painéis | Rótulos de vidro com ponto colorido, tamanho fixo na tela, sem "▶" |
| A planta nasce "no meio do nada"; mais células não mostram mais plantas | Estufa inflável (a partir do protótipo da Universidade do Arizona com a NASA), uma bandeja por célula; marcas de colheita na barra de comida |
| O tanque de ar é realista? | Desenhado como tanque de pressão branco com visor de nível; marcado como ilustração (fonte a verificar) |
| Parede invisível ao andar | Aviso antes do limite ("longe demais, volte") e depois uma parada suave |
| Quer ver o céu | Céu colorido a partir da descrição da NASA (amarelo a laranja), vista "Olhar o céu" com fato real da NASA e foto; zoom com a roda do mouse |
| Relatório: pouco contraste, pouco respiro, "baixa" não parece radiação, botão cobre o texto, sem rolagem | Relatório refeito: cartões com rótulo (Ar, Comida, Radiação), corpo com rolagem, botão fixo embaixo |
| Aspecto de "marca-texto" nos rótulos | Mesmo estilo de vidro para rótulos e painéis |

---

## Rodada 1 — missão 1 depois do bloco 1 (criança)

Sessão informal, sem arquivo exportado. Registrada pela mãe, só fatos.

| Campo | Valor |
| --- | --- |
| Data | 14/11/2026, noite |
| Aparelhos | Computador: Windows 11 Pro, AMD Ryzen 7 7735HS com gráficos Radeon, 15 GB de RAM, tela 1920×1200 em escala 150% (1280×800 px CSS), navegador: _a confirmar (Chrome 157 ou Edge 157 estão instalados)_ · iPhone 16, navegador: _a confirmar_ |
| Versão do jogo (commit) | `c550a4f` … `7d3c2d9` (ramo `phase-3b`, depois da revisão de design A) |
| Testador | testador, 8 anos |
| Idioma | Português |
| Missão | Missão 1 |

| Momento | O que aconteceu (fatos) | Mudança que causou | Commit |
| --- | --- | --- | --- |
| Jogo | Usava muito o rótulo da máquina ao lado dele (então com "▶") para pôr células direto nela, mais que a barra de baixo. | Um botão de ação claro ao lado da máquina: "+ Pôr 1 célula" e "−", também pela tecla E. | `5bb50bb` |
| Base 3D | Achou que a máquina de ar era a casinha da tripulação. | Um habitat de verdade na base, com o rótulo "Habitat" (termo da NASA), separado das máquinas. | `5bb50bb`, `3a23255` |

## Rodada 2 — missão 2 (criança)

| Campo | Valor |
| --- | --- |
| Data | 15/11/2026 |
| Aparelhos | O mesmo computador da rodada 1 · iPhone 16 |
| Versão do jogo (commit) | `22205ed` … `8ae30de` (ramo `phase-3b`) |
| Testador | testador, 8 anos |
| Idioma | Português |
| Missão | Missão 2 "A tempestade de maio" |

| Momento | O que aconteceu (fatos) | Mudança que causou | Commit |
| --- | --- | --- | --- |
| Depois de jogar | Perguntou como os astronautas respiram dentro do traje: o oxigênio passa por dentro? | Fato do sol 7 da missão 2 "Como os astronautas respiram no traje", escrito a partir dos resumos técnicos NASA-STD-3001 lidos por inteiro, com foto real de uma mochila de traje da Apollo. | `d77d8d2` |

---

## Revisões de design B a F (adulto)

Não são sessões com criança: a mãe revisou cada versão no computador e no iPhone 16, nos dois idiomas. Elas definiram a maior parte das regras do jogo.

| Revisão | Principais observações | Mudanças | Commit |
| --- | --- | --- | --- |
| B | Ar e comida sempre vencem; sem castigo sem escudo; rover e antena não dão nada; bugs ao andar; números do relatório confusos | Limite de dose, dano da radiação nas células, objetivo de amostra de rocha, três resultados, resposta da Terra na tela, correções ao andar, relatório mais claro (ADR-0033) | `5bb50bb` |
| C | Missão 2 fácil demais; Antena sem aviso; fatos e fotos repetidos; "amanhã" dito na manhã seguinte; botão direito faz andar | Alarmes falsos, crise em toda tempestade rápida, aviso da Antena, fatos próprios na missão 2, correção "hoje/amanhã" (ADR-0034) | `f49362f` |
| D | Crise só com texto e sempre a mesma resposta, mesmo com escudo suficiente; fotos faltando | Crise com desenho, medidor risco x escudo, escolher de onde tirar as células; fotos reais da NASA em todo fato da missão 2 | `5afc51c` |
| E | O rover precisa de uma missão de verdade; números importantes escondidos no texto | Rover escolhe o destino; a missão 2 exige a amostra da frente do delta (ADR-0035); conclusões do relatório em negrito | `8ae30de` |
| F | Fonte do texto parece genérica; frases começando em negrito; cartão do Sol quebrando | Fonte Atkinson Hyperlegible Next; um só padrão de negrito; degradê no cartão do Sol | `d77d8d2` |

---

## O que o teste com criança mudou

1. **Leitura:** a criança pulava texto longo, então o jogo passou a usar tópicos curtos, uma imagem forte e números que dá para ver (rodada 0).
2. **Ver a consequência:** "não aconteceu nada" quando veio a erupção, então os eventos solares ficaram visíveis à noite e o relatório passou a explicar cada número (rodada 0, revisão B).
3. **Agir onde se olha:** a criança jogava andando até as máquinas, então o jogo ganhou um botão de ação ao lado de cada máquina (rodada 1).
4. **Entender a base:** a máquina de ar parecia uma casa, então a base ganhou um habitat de verdade (rodada 1).
5. **Curiosidade vira conteúdo:** a pergunta da criança sobre respirar no traje virou um fato real da NASA no jogo (rodada 2).
