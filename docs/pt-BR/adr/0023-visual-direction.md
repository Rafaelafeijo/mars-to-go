# ADR-0023 — Direção visual: mundo ilustrado, foto real como prova

Status: aceita, 2026-11-14. Refina o brief §7 e a ADR-0008.

**Contexto.** Fotos reais em todo lugar deixam as telas pesadas, difíceis de ler em 360 px, e borram a linha entre "real" e "jogo". O desafio valoriza a credibilidade (dados reais, fotos reais), mas alerta contra o acabamento visual tomar o lugar da mecânica.

**Decisão.**
- **O mundo é ilustrado.** Base, céu, horizonte, tripulação, módulos e interface são ilustração vetorial feita em código, com paleta e silhuetas tiradas de fotos reais de Jezero.
- **Fotos reais são prova.** Uma foto real aparece inteira e em destaque só nos momentos de "isto é real": fichas do dado, locais de expedição, a Terra no céu — sempre com o selo "FOTO REAL", crédito, missão e data. Uma foto real também pode servir de textura escurecida do horizonte, com um degradê.
- **Edições.** Brilho, contraste e recorte são permitidos. Melhoria ou recriação por IA transforma a imagem em conteúdo gerado: marca d'água visível, selo "ILUSTRAÇÃO" (nunca "foto real"), registro no AI_USAGE.
- Nada de logotipos, insígnias ou identificadores de missão da NASA. Nada de imagens de menores de idade.
- **Linguagem visual (identidade própria, fontes de licença aberta registradas em ASSETS):** fundo escuro com granulado; uma cor de destaque quente de Marte; selos de dados em maiúsculas, monoespaçados e com espaçamento entre letras ("MEDIDO · DONKI · 20 MAI 2024"); números e veredito em uma fonte pesada e larga, bem grandes; título "MARS TO GO" em letras de matriz de pontos, como um painel de controle; Marte ou um módulo da base como um wireframe girando devagar; linhas finas de grade entre os blocos; medidores como cartões (ícone, número grande, rótulo em pílula: crítico, apertado, seguro, folgado — nunca só cor); um letreiro rolante para o "Hoje no espaço"; códigos de idioma no topo (PT, EN); link "pular para o conteúdo"; transições suaves entre os momentos e do dia para a noite, desligadas com movimento reduzido.
- **Para crianças:** botões ≥ 44 px, cantos arredondados, resposta visual a cada toque, um personagem simpático da tripulação, cor nos momentos de conquista. O minimalismo fica nas telas de decisão, onde ajuda a ler os números. Contraste de texto de 4,5:1.
- **Início:** logo em texto; três entradas "Jogar" (a carreira), "Como funciona", "Me surpreenda"; uma palavra que se alterna (hoje você é piloto, engenheira, cientista, agricultora de Marte); rodapé honesto (quem fez, uso de IA, de onde vêm os dados).
- **Imagens:** uma lista de dez (IMAGES.md). Para cada uma, o Claude Code traz 2–3 candidatas com link, crédito e data; a equipe escolhe; o Claude Code baixa o original, registra em ASSETS e prepara os tamanhos. Até lá, placeholders.
- **Abertura e gravação (depois da Fase 4):** cena animada de 20–30 s, pulável, construída a partir das telas reais (chegada a Marte, "aqui o dia se chama sol", as 10 células, "você decide"); uma gravação automatizada do jogo rodando para o vídeo de demonstração. Som desligado por padrão, com um botão para ligar; música só com licença livre registrada em ASSETS; nada de trilhas sonoras de filmes.

**Consequências.** Páginas leves e telas de decisão legíveis; a credibilidade vem das fotos reais com selo e das fichas do dado. O trabalho de ilustração acontece depois da mecânica (regra 2). Doze momentos são agrupados em seis cenas que reaproveitam cenário de fundo e componentes (ARCHITECTURE §7).
