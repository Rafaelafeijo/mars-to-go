# Registro de teste com criança

> Versão em inglês (padrão): [`docs/en/PLAYTEST.md`](../en/PLAYTEST.md). Regras: ADR-0029. **Nada de nome, imagem, voz ou semelhança do testador em nenhum arquivo.** Só fatos.

Como fazer uma sessão: abra o link de teste (com `?playtest=1`) no celular, confira o indicador discreto "teste", deixe a criança jogar sem ajuda, a não ser que ela peça, e no fim toque em "Exportar sessão" e salve o JSON em `docs/playtest/`.

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

## Rodada 1

| Campo | Valor |
| --- | --- |
| Data e hora | |
| Aparelho (modelo, navegador) | |
| Versão do jogo (commit) | |
| Testador | testador, 8 anos |
| Idioma jogado | |
| Modo assistido | ligado / desligado |
| Arquivo da sessão | `docs/playtest/round1-session.json` |

### Observações por momento

| Momento | O que aconteceu (fatos) | Tempo |
| --- | --- | --- |
| Abertura | | |
| Primeira distribuição | | |
| Conta ao vivo | | |
| Primeira noite | | |
| Selo / ficha de dado | | |
| Crise | | |
| Fim | | |

### As cinco perguntas finais (brief §11)

1. Tempo até entender a primeira distribuição sem ajuda:
2. Onde travou, e o que mudou por causa disso:
3. O que fez na primeira crise:
4. Uma frase, com as palavras dele:
5. Pediu para jogar de novo?

### Observação → mudança

No máximo as três correções mais importantes; cada uma é um commit próprio citando a observação.

| # | Observação | Mudança feita | Commit | Antes | Depois |
| --- | --- | --- | --- | --- | --- |
| 1 | | | | `docs/playtest/r1-1-before.png` | `docs/playtest/r1-1-after.png` |
| 2 | | | | | |
| 3 | | | | | |

---

## Rodada 2 (domingo de manhã, se houver tempo)

Mesmo modelo da rodada 1.
