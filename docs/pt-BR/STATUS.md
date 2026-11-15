# Situação — o jogo completo

> Versão em inglês (padrão): [`docs/en/STATUS.md`](../en/STATUS.md). Atualizado no começo e no fim de cada fase. Funções congeladas domingo às 15h; submissão até as 21h (Brasília).

Legenda: ✅ feito · 🔄 em andamento · ⬜ a fazer · ✂️ cortado (com motivo e aval do time)

Última atualização: 15/11/2026, depois da revisão de design F (commit `d77d8d2`). As missões 1 e 2 são jogáveis de ponta a ponta no mundo 3D, em inglês e em português.

## O que funciona agora

| Parte | Situação | Onde / nota |
| --- | --- | --- |
| Mundo 3D da base (Jezero, low-poly) | ✅ | ADR-0032. Astronauta em terceira pessoa, máquinas com rótulos, botão de ação perto de cada máquina, zoom/inclinação/pinça, vista do céu. Modelos CC0 da Kenney; astronauta e ícones desenhados no código (ASSETS.md) |
| Missão 1 "Primeiros sóis" (guiada) | ✅ | Eventos reais: erupção M1.3 (sol 3), CME prevista em Marte pelo WSA-ENLIL (sol 5). Fatos do sol com fotos reais da NASA |
| Missão 2 "A tempestade de maio" (modo livre) | ✅ | ADR-0034. Um evento real de maio de 2024 a cada sol: erupção X8.7, dois alarmes falsos (CMEs previstas na Psyche), três CMEs rápidas previstas em Marte e a tempestade de 20 de maio medida pelo RAD do Curiosity (risco 3). Sete fatos próprios, cada um com uma foto real da NASA |
| Escolhas com consequência | ✅ | ADR-0033. O limite de dose (2 pontos) encerra a missão; radiação não bloqueada custa células no sol seguinte; uma amostra de rocha é objetivo; três resultados (sucesso, com falhas, retorno antecipado) |
| Escolha do lugar do rover; a missão 2 precisa da amostra da frente do delta | ✅ | ADR-0035. Lugares perto (Rochette, Kodiak) 2 de ar + 1 ponto; frente do delta (2,3 km, PIA24485) 3 de ar + 2 pontos |
| Crise de 10 segundos com escolhas | ✅ | Risco contra o Escudo; passar células da máquina que a criança escolher, ou chamar o rover de volta. Modo assistido: sem relógio |
| Perguntar à Terra (Antena) | ✅ | Resposta à noite sobre amanhã; desligada na crise (atraso de rádio) |
| Conta ao vivo, relatório da noite, tela final com gráfico | ✅ | Jogar de novo; voltar ao sol em que tudo mudou |
| Fichas de dados em todo número | ✅ | `packages/content/src/cards.ts` (EN + PT), selos, "Quero entender mais" |
| Painel de dados da NASA (lista de cada fonte da NASA e onde é usada) | ✅ | `apps/web/src/world/NasaDataPanel.tsx`, a partir de `NASA_SOURCES` em `facts.ts` |
| "O Sol nesta semana" na tela inicial | ✅ | Cópia do DONKI salva pelo workflow do Pages duas vezes por dia, mostrada com a hora UTC, nunca como ao vivo |
| Português e inglês | ✅ | Abre em inglês (ADR-0028); o idioma fica lembrado no aparelho |
| Movimento reduzido; chave do modo assistido na tela inicial | ✅ | `prefersReducedMotion()`; o modo assistido tira o relógio da crise |
| Testes da simulação (`packages/sim`) | ✅ | Toda regra testada antes |
| Teste de ponta a ponta no CI | ✅ | `.github/workflows/e2e.yml` + `scripts/playthrough.mjs`: missão 1 no mundo 3D (EN e PT) e nas telas antigas de uma tela e de lista (EN); missão 2 no mundo 3D (EN), termina em "Mission accomplished!" com a amostra do delta |
| Publicação: GitHub Pages (principal) | ✅ | https://rafaelafeijo.github.io/mars-to-go/ — a cada push na `main` e duas vezes por dia (cópia do DONKI) |
| Publicação: Railway (API + espelho do jogo) | ✅ | https://mars-to-go-api-production.up.railway.app/health — build pelo `railway.json`; o jogo não depende dele |

## Não feito (lista honesta)

| Parte | Situação | Nota |
| --- | --- | --- |
| Laboratório (tópicos interativos, ADR-0031) | ⬜ | Por enquanto as fichas de dados são a explicação |
| Modo de teste com criança (`?playtest=1`, exportar JSON com QR code, ADR-0029) | ⬜ | Os testes são registrados à mão no PLAYTEST.md |
| Missão 3 "Céu de poeira" | ✂️ | Cortada na ADR-0031. As regras e a ficha da poeira existem na simulação, mas nenhuma missão usa um sol de poeira |
| "Me surpreenda" (eventos sorteados) | ⬜ | As missões usam eventos reais fixos |
| Progresso salvo no aparelho; código da carreira na tela | ⬜ | As regras de codificar/decodificar existem e têm testes (`packages/sim/src/code.ts`, `career.ts`), mas o app só salva o idioma. A missão 2 abre pela tela final da missão 1 (ou `?mission=2`) |
| Página "A ciência por trás" e JSON público com todas as fichas | ⬜ | Os dados estão prontos em `cards.ts` / `science.ts`; ainda sem página nem arquivo exportado |
| Cena de abertura | ⬜ | Não feita |
| Avatar personalizável | ✂️ | Cortado na ADR-0031 |
| Auditoria completa WCAG 2.2 AA | ⬜ | Ainda não auditado; movimento reduzido e modo assistido estão prontos |
| Material de submissão (página, vídeo de 30 s, slides) | 🔄 | rascunhos guardados fora do repositório público |

## Limites conhecidos

- O **desempenho** só é medido no CI, no Chromium sem tela com SwiftShader (renderização por software), pela sonda de fps do teste de ponta a ponta. Não foi medido em celulares de verdade. No celular, abra o jogo com `?fps=1` para ver o contador de quadros.
- O teste de ponta a ponta da missão 2 roda só em inglês.
- Este arquivo descreve o commit `d77d8d2`. Um trabalho em andamento (revisão de design G, ainda sem commit) transforma o modo assistido num nível "Cadete" com 30 segundos na crise (`CRISIS_SECONDS_CADET`) em vez de nenhum relógio; atualizar as linhas da crise quando ele entrar.
- A CME da missão 1 (1.263 km/s) está com `fast: false` de propósito: a missão 1 é guiada e não tem crise.
