# ADR-0031 — Fase 3B: toda escolha mostra a consequência na mesma tela

> Versão em inglês (padrão): [`docs/en/adr/0031-choice-and-consequence-on-one-screen.md`](../../en/adr/0031-choice-and-consequence-on-one-screen.md)

Status: aceita, 2026-11-14. Substitui a parte de layout da ADR-0030; as regras de arte, panorama e fotos continuam.

**Contexto.** O time testou a Fase 3 como adulta e não entendeu o jogo; o único momento claro foi "Marte é frio, o aquecimento custa 3". Diagnóstico: (1) o jogo pergunta antes de explicar; (2) a escolha e a consequência estão em telas diferentes; (3) não existe visão do todo — os 7 sóis, o que falta, por que não dá para marcar tudo; (4) é um formulário de rolar, não um jogo.

**Princípio.** Toda escolha mostra sua consequência na mesma tela, no mesmo instante.

**Decisão.**
1. **Uma tela só.** O sol inteiro cabe numa tela, sem rolagem, no celular de 360 px e no computador. Manhã, plano e noite são momentos dessa tela; painéis curtos abrem por cima e fecham.
2. **A trilha dos 7 sóis** fica fixa no topo, com a casa no fim: cada sol mostra a previsão (calmo, talvez tempestade, poeira com as células livres: 7 ou 3) e as colheitas a caminho. Duas linhas, ar e comida, saem de hoje e vão até o sol em que cada uma acaba; linha que chega à casa fica verde, linha que para antes fica vermelha com "o ar acaba no sol 5". Andam a cada célula colocada ou tirada.
3. **A projeção** (`packages/sim/src/projection.ts`, SIM_MODEL §16, testes primeiro): a partir do estado e do plano de hoje, ar e comida de amanhã e o sol em que cada um acaba "se todo sol fosse igual a hoje". Rótulo simplificação.
4. **O plano na cena:** bateria com 10 células (3 travadas no aquecimento); os destinos são objetos tocáveis que mostram as células e o efeito em uma linha ("+3 ar", "+4 comida no sol 5"); medidores sempre visíveis no formato "hoje → amanhã", com palavra; a tripulação reage antes de travar; destinos bloqueados apagados, com cadeado; o botão de travar não cobre nada.
5. **Ensino no formato do aquecimento:** fato do mundo real, depois o custo no jogo, uma frase cada, na primeira vez que o objeto aparece, e depois no losango. Nenhuma pergunta sobre regra ainda não mostrada; nenhum painel com mais de duas frases.
6. **Abertura:** uma tela antes do sol 1 — "Traga os quatro para casa. São 7 sóis. Ar e comida não podem acabar." — com a trilha já mostrando as duas linhas parando antes da casa.
7. **Sol 1 de mão dada:** o jogo sugere o plano do sol 1 célula por célula, e as linhas andam a cada uma. A partir do sol 2 a criança decide sozinha. O desbloqueio continua como está.
8. **Palpite:** sai a pergunta "quando a tripulação pode comer?". O palpite passa a ser sobre a conta ("com este plano, quanto ar sobra amanhã?"), opcional, com resposta na hora, na mesma tela.
9. **Noite:** a mesma tela escurece, os números correm de cada objeto para os medidores na ordem da simulação, e a trilha avança um sol. O diário é um painel curto.
10. **Visual:** Dentro (base em corte; kits CC0 da Kenney renderizados em 2D a partir dos modelos 3D, porque as versões 2D do pacote são pequenas demais), Fora (panorama real de Jezero, arrastar horizontal, marcadores), Céu (fotos reais com a previsão); um botão alterna; trilha e medidores fixos nas três. Fotos nunca completadas ou recriadas por IA; filtros de cor para dia, noite e poeira permitidos. O selo de dado é um losango pequeno. No computador: palco largo e centralizado, painel ao lado.
11. **Acessibilidade:** a lista vira "modo acessível" nos ajustes, com a mesma trilha e a mesma projeção; alvos de 44 px, teclado, movimento reduzido.

**Ordem (parar e mostrar ao fim de cada passo).** A: projeção com testes. B: a tela única com trilha, linhas, medidores e plano por toque, formas simples, sem arte; capturas em 360 px e em computador; o time joga os sóis 1 e 2. C: ensino, abertura, sol 1 guiado e palpite novo. D: arte da vista Dentro, depois Fora, depois Céu. E: Fase 4 (clima espacial real e crise de 10 segundos) nessa mesma tela.

**Cortes.** Saem do escopo: avatar, código da carreira, missão 3, cartões do OSDR e a mochila (só se sobrar tempo). "Hoje no espaço" vira um cartão na vista do céu. Se a arte atrasar, o passo B com formas simples e a vista Fora já são o jogo. O teste automático joga a missão 1 pela tela nova, em inglês e português.

## Adendo (14/11/2026, depois de mais testes do time)

1. **Selos fora do jogo.** Os rótulos "cenário / simplificado / regra do jogo" saem de todas as telas de jogo. Número ou objeto com dado real por trás ganha um ícone pequeno; tocar ou passar o mouse mostra uma **dica de uma linha** ("Medido em Marte pelo MOXIE, 2021–2023"); tocar na dica abre o Laboratório. Regra de jogo pura não ganha nada. Os rótulos medido, cenário e simplificação ficam dentro do Laboratório e na página de ciência. (Substitui o losango da ADR-0030 nas telas de jogo.)
2. **O Laboratório substitui a janela de ficha.** Tela cheia, feita para a criança explorar. Cada tema tem: a foto real em destaque, com lugar e data; **um gráfico interativo** que a criança mexe; "a conta de verdade", com os números reais e as unidades; "Quero entender melhor", com o exemplo do dia a dia (textos atuais mantidos); fonte, tratamento e o que o jogo simplificou, no fim. Primeiros temas, só com dados já validados no DATA_MAP: (a) luz do Sol — arrastar Marte para longe do Sol e ver a luz cair com o quadrado da distância, ligado às células de energia; (b) ar — oxigênio que quatro pessoas usam por dia e quantos MOXIEs seriam necessários, ligado ao Suporte à Vida; (c) sinal de rádio — distância dividida pela velocidade da luz, com controle de distância e o sinal viajando, ligado a Perguntar à Terra; (d) tempestade de maio de 2024 — linha do tempo do evento e a dose medida comparada com radiografias, ligado ao Escudo; (e) gravidade — altura do pulo na Terra e em Marte. Cada valor é conferido na fonte antes de usar; divergências são avisadas ao time. Gráficos em SVG, no estilo do jogo, legíveis em 360 px, sem biblioteca pesada.
3. **A noite sem lista.** Saem "A conta aberta" em lista numerada e o "E se…" em texto. A noite é a animação dos medidores na cena, com a trilha avançando. Depois dela, um convite curto — "Quer ver a conta de verdade de hoje?" — abre o tema do Laboratório ligado ao que aconteceu naquele sol.
4. **A trilha mostra também o sol marcado como "cortado" pela poeira** (o `cut` da projeção).

**Ordem revista.** A: projeção com testes (feito). B: tela única com trilha, linhas, medidores e plano por toque — sem selos, noite já como animação dos medidores; parar e mostrar. C: selos fora, dica de uma linha, noite animada, ensino e sol 1 guiado. D: Laboratório com os temas a, b e c; parar e mostrar. E: arte da vista Dentro e panorama real na vista Fora. F: Fase 4 — clima espacial real e crise, com os temas d e e. A vista Céu só entra se sobrar tempo.

**Consequências.** As regras, os testes, os textos das fichas e os dois idiomas da Fase 3 continuam. As vistas do protótipo da Fase 3B (ramo `phase-3b`) são reaproveitadas no passo D.
