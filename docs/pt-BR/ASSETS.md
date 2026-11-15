# Assets — fontes, créditos e licenças

> Versão em inglês (padrão): [`docs/en/ASSETS.md`](../en/ASSETS.md). Todo asset de terceiros é listado aqui **antes** de ser commitado (regra 11 do CLAUDE.md). Sem logos, insígnias, bandeiras ou identificadores de missão da NASA.

Diretrizes de uso de mídia da NASA: https://www.nasa.gov/nasa-brand-center/images-and-media/ — o conteúdo da NASA em geral não está sujeito a direitos autorais nos Estados Unidos e pode ser usado para fins educativos ou informativos; não pode sugerir endosso da NASA. Os créditos de parceiros (por exemplo, ASU, MSSS, Texas A&M) são copiados exatamente.

## Imagens

Escolhidas pelo time em 14/11/2026 (IMAGES.md). Originais em `assets-src/` (fora do repositório); tamanhos do jogo em `apps/web/public/images/<slug>-{480,960,1600}.webp`, gerados por `tools/data/prepare_images.py` (só recorte e redimensionamento). Todo uso na tela leva o selo **FOTO REAL** com lugar, crédito, missão e data; os marcados como *cor realçada* dizem isso.

| Nº | Slug | ID · página de origem | Crédito (exato) | Missão · instrumento | Data | Lugar (selo) | Cor (selo) | Tela |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `jezero-panorama` | PIA24921 · https://science.nasa.gov/photojournal/detailed-panorama-of-mars-jezero-crater-delta/ | NASA/JPL-Caltech/ASU/MSSS | Mars 2020 Perseverance · Mastcam-Z | 12 a 20/06/2022 | Cratera Jezero, Marte | Cor realçada (imagem principal) | Tela inicial; textura de horizonte |
| 2 | `gale-sunset` | PIA19400 · https://science.nasa.gov/photojournal/sunset-in-mars-gale-crater | NASA/JPL-Caltech/MSSS/Texas A&M Univ. | MSL Curiosity · Mastcam | 15/04/2015 (sol 956) | **Cratera Gale, Marte** | Calibrada, balanço de branco | Cena da noite; ficha |
| 3 | `earth-from-mars` | PIA17936 · https://science.nasa.gov/photojournal/bright-evening-star-seen-from-mars-is-earth/ | NASA/JPL-Caltech/MSSS/TAMU | MSL Curiosity · Mastcam (esquerda) | 31/01/2014 (sol 529) | **Cratera Gale, Marte** | Processada para tirar marcas de raios cósmicos | Fim: a Terra no céu |
| 4 | `sun-flare-x87` | SVS 14592 · https://svs.gsfc.nasa.gov/14592 | NASA/SDO | SDO · AIA (composição 171, 131, 193, 304 Å) | 14/05/2024 (erupção X8.7) | O Sol (visto da órbita da Terra) | **Cor realçada** (ultravioleta extremo, colorizado) | Ficha do evento solar; crise |
| 5 | `jezero-orbital` | PIA23239 · https://science.nasa.gov/photojournal/jezero-crater-mars-2020s-landing-site/ | NASA/JPL-Caltech/MSSS/JHU-APL | MRO · CTX + CRISM | publicada em 15/05/2019 | Cratera Jezero, Marte (de órbita) | **Cor realçada** (dados de minerais) | Mapa da expedição |
| 6 | `rochette` | PIA24840 · https://science.nasa.gov/photojournal/rochette-after-perseverance-sampling | NASA/JPL-Caltech | Mars 2020 Perseverance · Hazcam | 07/09/2021 (sol 196) | Cratera Jezero, Marte | Contraste realçado (segundo a legenda) | Ponto de expedição |
| 7 | `kodiak` | PIA24802 · https://science.nasa.gov/photojournal/perseverance-captures-image-of-kodiak | NASA/JPL-Caltech/ASU/MSSS | Mars 2020 Perseverance · Mastcam-Z | 18/04/2021 | Cratera Jezero, Marte | Cor realçada | Ponto de expedição |
| 8 | `delta-front` | PIA24925 · https://science.nasa.gov/photojournal/perseverance-workspace-at-skinner-ridge | NASA/JPL-Caltech/ASU/MSSS | Mars 2020 Perseverance · Mastcam-Z | 30/06 a 08/07/2022 | Delta da cratera Jezero, Marte | Cor realçada | Ponto de expedição |
| 9 | `moxie` | PIA24203 · https://science.nasa.gov/photojournal/moxie-all-tucked-in | NASA/JPL-Caltech | Mars 2020 · MOXIE (instalado no rover) | publicada em 19/01/2021 | **Terra, antes do lançamento** | Não informado | Ficha do Suporte à Vida |
| 10 | `iss-lettuce` | iss072e404269 · https://images.nasa.gov/details/iss072e404269 | NASA | Estação Espacial · Advanced Plant Habitat (Plant Habitat-07) | 27/12/2024 | Estação Espacial Internacional (paralelo) | Não informado | Ficha da Estufa |
| 11 | `spacesuit-materials` | PIA26520 · https://science.nasa.gov/photojournal/perseverance-and-sherlocs-calibration-target | NASA/JPL-Caltech/MSSS | Mars 2020 Perseverance · SHERLOC (câmera WATSON) | publicada em 26/03/2025 (data da foto não informada) | Cratera Jezero, Marte (no rover) | Não informado | Fato da missão 2: materiais de traje espacial |
| 12 | `kilopower` | GRC-2015-C-06315 · https://images.nasa.gov/details/GRC-2015-C-06315 | NASA | Fission Surface Power Technology Demonstration Unit · conversor Stirling de 10 kW (sem reator na foto) | 09/11/2016 (data do acervo) | **Terra: NASA Glenn Research Center, Cleveland, Ohio** (teste) | Não informado | Fato da missão 2: energia nuclear |
| 13 | `lunar-eva` | AS15-88-11901 · https://images.nasa.gov/details/as15-88-11901 | NASA | Apollo 15 · Lunar Roving Vehicle (Hasselblad 70 mm) | 31/07 a 02/08/1971 (terceira caminhada) | **Lua: Hadley-Apennine** (paralelo) | Não informado | Fato da missão 2: até onde caminhar |
| 14 | `ox-storage` | KSC-20191108-PH-JBS01_0049 · https://images.nasa.gov/details/KSC-20191108-PH-JBS01_0049 | NASA/Ben Smegelsky | Exploration Ground Systems · tanque de oxigênio líquido | 08/11/2019 | **Terra: Plataforma 39B, Kennedy Space Center, Flórida** (paralelo) | Não informado | Fato da missão 2: guardar oxigênio |
| 15 | `suit-backpack` | S68-34582 · https://images.nasa.gov/details/S68-34582 | NASA | Apollo · Portable Life Support System (PLSS), sem a tampa | 1968 (data do acervo 11/06/1968) | **Terra** (lugar não informado; registro da NASA Johnson, JSC) | Não informado | Fato da missão 2: tirar o CO2 |

Conferências feitas em 14/11/2026: nenhum logo ou insígnia da NASA como assunto; a imagem 10 não mostra nenhuma pessoa (conferida a 1600 px); nenhum menor em nenhuma imagem. Recortes: 1 (parte direita do panorama, sem bordas do mosaico), 6 (rocha no centro, sem a roda do rover), 8 (penhasco com camadas, sem o braço do rover).

Imagens 11 a 15 adicionadas em 15/11/2026 (arquivos de origem numa pasta local temporária, com nomes `11-…` a `15-…` para o `prepare_images.py`). Conferências: nenhum logo, insígnia, bandeira ou emblema de missão da NASA visível; nenhum menor; a imagem 11 substitui o gráfico PIA24033 pedido, que mostra o logo do Artemis, o emblema do Mars 2020 e uma bandeira dos EUA. Recortes: 11 (só o painel da direita, a foto da WATSON; sai o painel da esquerda com o rover e o círculo amarelo), 12 (parte direita: o conversor Stirling; saem o técnico e o boné com marca), 13 (sai parte do céu preto e o número do quadro do filme). A imagem 12 é o conversor de energia de uma unidade de teste em solo, não um reator; a imagem 14 guarda combustível de foguete e aparece como paralelo para guardar oxigênio líquido.

## Modelos 3D

Usados pelo protótipo do mundo 3D (ADR-0032), em `apps/web/public/models/kenney/` com os arquivos de licença originais.

| Pacote | Autor | Licença | Fonte | Arquivos usados |
| --- | --- | --- | --- | --- |
| Space Kit 2.0 | Kenney (www.kenney.nl) | CC0 1.0 (domínio público) | https://kenney.nl/assets/space-kit | astronautA, machine_generatorLarge (máquina de ar), hangar_roundGlass (estufa), machine_wireless (escudo), rover, satelliteDish_large (antena), hangar_largeA (habitat), corridor, rock_largeA, rock_largeB, rocks_smallA, craterLarge (`.glb`, cores embutidas) |
| Space Station Kit | Kenney (www.kenney.nl) | CC0 1.0 (domínio público) | https://kenney.nl/assets/space-station-kit | container-tall (`.glb`) + `Textures/colormap.png` |

O terreno, o céu e o Sol são desenhados em código (ilustração inspirada na cratera Jezero, declarada na tela como ilustração, não foto).

## Fontes tipográficas

| Fonte | Autor | Licença | Origem | Uso |
| --- | --- | --- | --- | --- |
| Atkinson Hyperlegible Next (variável) | Braille Institute of America | SIL Open Font License 1.1 | npm `@fontsource-variable/atkinson-hyperlegible-next@5.3.0` (hospedada no próprio jogo, sem pedido ao Google Fonts) | Texto principal e rótulos 3D. Escolhida pela legibilidade (7 a 12 anos, baixa visão). Os títulos mantêm a fonte monoespaçada do sistema. |

## Ícones, sons, música

Nenhum ainda.

## Bibliotecas de código

As dependências de código aberto estão listadas nos arquivos `package.json` e no `pnpm-lock.yaml`. As principais: React, Vite, i18next, react-i18next, Hono, Vitest, ESLint, TypeScript.
