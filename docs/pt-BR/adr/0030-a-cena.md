# ADR-0030 — A cena: o jogo acontece num lugar, não num formulário

> Versão em inglês (padrão): [`docs/en/adr/0030-the-scene.md`](../../en/adr/0030-the-scene.md)

Status: aceita, 2026-11-14. Refina as ADR-0008 e ADR-0023. Mecânica da Fase 3 validada; visual da Fase 3 não validado.

**Contexto.** Depois da Fase 3 o jogo funciona, mas parece um formulário longo. Para crianças de 7 a 12 anos precisa parecer jogo: tudo acontece numa cena, e o que se toca são objetos, não listas. No computador precisa ser tão agradável quanto no celular.

**Decisão.**
- **Três vistas com um botão para alternar:** Dentro (a base em corte: bateria com 10 células, 3 travadas no aquecedor; máquina de ar com tanque que enche; estufa com brotos que crescem em dois sóis; tripulação de quatro que reage ao estado da base), Fora (o panorama real de Jezero, arrastado para os lados, com marcadores e painéis solares, antena, cobertura do escudo e rover ilustrados sobre o chão real; um selo diz o que é foto real e o que é ilustração), Céu (fotos reais: a previsão e, no fim, a Terra como ponto de luz apontado). Transições suaves, desligadas com movimento reduzido.
- **Jogar na cena:** tocar (ou arrastar) leva células da bateria para os objetos; cada objeto mostra suas células; a conta ao vivo sobe do objeto até o medidor ("+1 ar"); à noite a cena escurece e os números correm de cada objeto para os medidores, na ordem da simulação. Previsão, pergunta da manhã e diário são painéis curtos sobre a cena, nunca página de rolar. Destinos bloqueados ficam apagados, com cadeado.
- **Medidores sempre no topo:** energia, ar e comida com número grande e palavra; sol e exposição junto. No computador, palco largo e centralizado, com medidores e diário num painel ao lado.
- **O selo de dado vira um losango pequeno** no objeto ou no número; dado medido ganha destaque, regra de jogo fica discreta; tocar abre a mesma ficha. Nenhuma tela com mais de duas frases seguidas.
- **Mochila:** descobertas, cartões de ciência, insígnias e o caderno com todas as fichas.
- **Modo acessível:** a versão em lista da Fase 3 continua, selecionável nos ajustes e usada por leitor de tela. Objetos com nome e estado legíveis, alvos de 44 px, tudo por teclado.
- **Arte:** ilustração feita em código (SVG), plana, com paleta tirada das fotos de Jezero. Os pacotes CC0 da Kenney foram avaliados: as versões 2D são pequenas demais para uma cena de celular (prévias de 64 px; objetos isométricos de 40 a 150 px dentro de quadros de 512 px), e renderizar os modelos 3D exigiria um processo que não cabe no tempo. NASA 3D Resources: o mesmo problema para o rover; não usado. Nada dos dois vai para o jogo, então nada entra em ASSETS.
- **Panorama:** arrastar horizontal simples sobre a foto real (sem biblioteca). O Photo Sphere Viewer e o Pannellum aceitam panorama parcial, mas só com o campo de visão equirretangular conhecido; o mosaico de Jezero (PIA24921) é retificado e não publica esses valores, então uma esfera o deformaria, e os dois exigem WebGL em celular simples. Marcadores só onde a foto mostra o lugar (o delta, assunto da PIA24921); lugares fora da foto aparecem como placas, com a foto real própria na ficha.
- **Fotos nunca alteradas por IA.** Só brilho, contraste, recorte e filtros de cor: dia e noite por filtros, poeira como véu, tempestade solar como clarão.
- **Não muda:** a simulação e seus testes, as fichas, os dois idiomas, o inglês como padrão. O teste automático também joga a missão 1 pela cena.

**Consequências.** Mais trabalho de interface antes da Fase 4. Para caber no tempo, saem do escopo: avatar, código da carreira, missão 3 e cartões do OSDR. "Hoje no espaço" vira um cartão na vista Céu.
