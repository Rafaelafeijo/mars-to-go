# Imagens do jogo — lista e fluxo

Direção visual em ADR-0023 (14 de novembro de 2026): **o mundo do jogo é ilustração vetorial feita em código**, com paleta e silhuetas tiradas das fotos reais de Jezero. **A foto real é prova**: aparece inteira e em destaque só nos momentos "isto é real" (fichas de dados, pontos de expedição, a Terra no céu), sempre com selo "foto real", crédito, missão e data. Uma foto real pode servir de textura de horizonte, escurecida e com degradê.

## A lista (dez imagens)

| Nº | Imagem | Onde entra | Prioridade |
| --- | --- | --- | --- |
| 1 | Panorama de Jezero ao nível do solo | Tela inicial | **Máxima qualidade**: mosaico processado, original |
| 2 | Pôr do sol de Marte | Cena da noite; ficha | **Máxima qualidade** |
| 3 | A Terra vista de Marte (PIA17936) | Fim: a Terra no céu | **Máxima qualidade** |
| 4 | O Sol com uma erupção | Ficha do evento solar; crise | Alta |
| 5 | Jezero visto de cima (Mars Trek) | Mapa da expedição | Alta |
| 6 | A rocha Rochette | Ponto de expedição | Média |
| 7 | O monte Kodiak | Ponto de expedição | Média |
| 8 | A frente do delta, com camadas | Ponto de expedição | Média |
| 9 | O instrumento MOXIE | Ficha do Suporte à Vida | Média |
| 10 | Plantas cultivadas na Estação Espacial | Ficha da Estufa (paralelo declarado) | Média |

## Fluxo

1. O Claude Code procura e traz **duas ou três candidatas por item**, com link, crédito e data.
2. A Rafaela escolhe.
3. O Claude Code baixa **sempre o original** em `assets-src/` (fora do site), registra em `docs/ASSETS.md` (fonte, crédito, missão, instrumento, data, lugar, cor real ou realçada, tela) e prepara os tamanhos do jogo.
4. Até a escolha, o jogo usa **espaços reservados**.

## Regras

- **É real?** Instrumento, missão e data conhecidos.
- **Cor real ou realçada?** Anotar; o jogo declara.
- **Edição permitida:** brilho, contraste, recorte.
- **IA:** melhoria ou recriação por IA torna a imagem conteúdo gerado: marca-d'água visível, selo "ilustração", nunca "foto real", registro em `docs/AI_USAGE.md`.
- **Sem logotipos, insígnias ou identificadores de missão da NASA.** Sem imagem de menores. Sem recriar pessoas reais.
- **De quem é?** Material de terceiros vem marcado na linha de crédito. Na dúvida, não usar.

## Onde procurar

| Acervo | Endereço | Melhor para |
| --- | --- | --- |
| NASA Image and Video Library | https://images.nasa.gov/ | Busca geral, com crédito e descrição |
| NASA Photojournal | https://science.nasa.gov/photojournal/ | Imagens planetárias com ficha técnica (códigos PIA) |
| Imagens do Perseverance | science.nasa.gov, missão Mars 2020 | Fotos do solo em Jezero |
| Mars Trek | https://trek.nasa.gov/mars/ | Vista de cima de Jezero |
| Solar Dynamics Observatory | https://sdo.gsfc.nasa.gov/ | O Sol e erupções |

## O que é desenhado, não buscado

Módulos da base, tripulação e personagem, avatar, células de energia, medidores, ícones, insígnia da missão (sem imitar insígnias reais), selos de dado, título em letras de pontos, Marte ou módulo em malha de linhas. Tudo vetor próprio feito em código, ou conjunto de licença livre registrado em ASSETS.
