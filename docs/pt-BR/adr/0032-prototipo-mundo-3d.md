# ADR-0032 — Protótipo: um mundo 3D de poucos polígonos em terceira pessoa

> Versão em inglês (padrão): [`docs/en/adr/0032-3d-world-prototype.md`](../../en/adr/0032-3d-world-prototype.md)

Status: protótipo em avaliação, 14/11/2026. A tela única da Fase 3B continua como plano de reserva (`?ui=one`), assim como a lista da Fase 3 (`?ui=list`).

**Contexto.** O time quer que o jogo pareça um jogo de exploração: personagem em terceira pessoa num mundo de poucos polígonos, com painéis flutuando sobre a cena (missão à esquerda, clima à direita, barra de itens embaixo). Tema: Marte, cratera Jezero. A referência dá só a estrutura; nomes, cores, fontes e desenhos são nossos.

**Decisão (protótipo, 2 horas).**
- three.js com react-three-fiber e drei, carregados sob demanda para os painéis funcionarem antes; sem sombras; densidade de pixels limitada a 1,5.
- Terreno ilustrado de poucos polígonos inspirado em Jezero (relevo suave, um leque de delta e um monte ao fundo), céu cor de Marte com o Sol pequeno — declarado na tela como ilustração. Fotos reais ficam no Laboratório e no relatório do sol.
- Modelos 3D CC0 da Kenney (Space Kit, Space Station Kit) para a base, as cinco máquinas tocáveis (máquina de ar, estufa, escudo, rover, antena) e o astronauta. Registrados em ASSETS.
- Astronauta em terceira pessoa: anda até o ponto tocado (celular) ou com WASD/setas (computador); a câmera segue atrás. Perto de uma máquina, tocar nela põe uma célula; o efeito sobe da máquina.
- Painéis sobre a cena: topo, a trilha dos 7 sóis com o foguete no fim e as barras de ar e comida que enchem com a projeção; esquerda, Controle da Missão com o desafio e os objetivos do sol; direita em cima, a previsão; direita embaixo, células na mão e "Passar a noite"; base, "Cratera Jezero · Sol 1 de 7" e a barra de máquinas.
- Tudo o que se faz andando também se faz pelos painéis, com teclado e leitor de tela. Sem modo lista separado no menu.
- Nenhum emoji nesta tela: conjunto próprio de ícones SVG, uma cor por recurso (ar azul, comida verde, energia âmbar, radiação lilás).
- Sem WebGL, a cena vira uma imagem parada e os painéis continuam funcionando.

**Não muda.** A simulação, a projeção e seus testes; inglês por padrão, português opcional.

**Consequências.** Página mais pesada (three.js) que as telas 2D; medida e informada ao time antes da aprovação.
