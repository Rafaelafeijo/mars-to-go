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

Conferências feitas em 14/11/2026: nenhum logo ou insígnia da NASA como assunto; a imagem 10 não mostra nenhuma pessoa (conferida a 1600 px); nenhum menor em nenhuma imagem. Recortes: 1 (parte direita do panorama, sem bordas do mosaico), 6 (rocha no centro, sem a roda do rover), 8 (penhasco com camadas, sem o braço do rover).

## Modelos 3D

Usados pelo protótipo do mundo 3D (ADR-0032), em `apps/web/public/models/kenney/` com os arquivos de licença originais.

| Pacote | Autor | Licença | Fonte | Arquivos usados |
| --- | --- | --- | --- | --- |
| Space Kit 2.0 | Kenney (www.kenney.nl) | CC0 1.0 (domínio público) | https://kenney.nl/assets/space-kit | astronautA, machine_generatorLarge (máquina de ar), hangar_roundGlass (estufa), machine_wireless (escudo), rover, satelliteDish_large (antena), hangar_largeA (habitat), corridor, rock_largeA, rock_largeB, rocks_smallA, craterLarge (`.glb`, cores embutidas) |
| Space Station Kit | Kenney (www.kenney.nl) | CC0 1.0 (domínio público) | https://kenney.nl/assets/space-station-kit | container-tall (`.glb`) + `Textures/colormap.png` |

O terreno, o céu e o Sol são desenhados em código (ilustração inspirada na cratera Jezero, declarada na tela como ilustração, não foto).

## Fontes tipográficas

Nenhuma ainda; o jogo usa as fontes do sistema. Fontes com licença aberta serão registradas aqui antes do uso (ADR-0023).

## Ícones, sons, música

Nenhum ainda.

## Bibliotecas de código

As dependências de código aberto estão listadas nos arquivos `package.json` e no `pnpm-lock.yaml`. As principais: React, Vite, i18next, react-i18next, Hono, Vitest, ESLint, TypeScript.
