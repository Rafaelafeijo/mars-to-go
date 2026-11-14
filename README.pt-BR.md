# Mars to Go

*10 segundos para decidir.* · [English](README.md)

Um jogo de navegador em que crianças de 7 a 12 anos comandam uma base tripulada na Cratera Jezero, em Marte, sol a sol — e descobrem que no espaço nenhuma escolha é de graça: a energia que protege a tripulação hoje é o oxigênio que falta amanhã.

- **Jogar:** https://rafaelafeijo.github.io/mars-to-go/ (GitHub Pages, principal) · Espelho no Railway: *[a ser adicionado]*
- **Desafio:** NASA Space Apps Challenge 2026 — *Build a Junior Astronaut Mission Trainer* ([texto oficial](docs/CHALLENGE_STATEMENT.md))
- **Time:** Rochette

> Status: em construção durante o evento (14–15 de novembro de 2026). Fase 1: esqueleto e deploy.

## Como se joga

A cada sol (um dia marciano, 40 minutos mais longo que o nosso) o jogador recebe **10 células de energia** — 3 vão sempre para o aquecimento — e divide o resto entre **Suporte à Vida** (ar agora), **Estufa** (comida dois sóis depois), **Escudo** (proteção esta noite), **Expedição** (uma descoberta real, custa ar) e **Perguntar à Terra** (uma resposta que chega atrasada). Eventos solares reais do banco de dados DONKI da NASA definem o risco. A conta está sempre na tela. O modelo completo está em [`docs/pt-BR/SIM_MODEL.md`](docs/pt-BR/SIM_MODEL.md).

## Dados da NASA, e por quê

| Fonte | Por quê | Onde |
| --- | --- | --- |
| **DONKI** (clima espacial do CCMC) | Flares solares, CMEs e eventos de partículas reais, e a previsão do modelo da NASA para chegadas a Marte | Previsão, crise de tempestade solar, "Hoje no espaço" |
| **Curiosity RAD** (via artigo da NASA) | A tempestade solar de 2024-05-20 medida na superfície de Marte | Missão 2, cartão de ciência do escudo |
| **NASA Mars Fact Sheet**, MOXIE, Veggie, BVAD | Por que o ar precisa ser produzido, por que a energia é pouca, quanto tempo as plantas levam, quanto uma tripulação respira | Fichas do dado |
| **OSDR**, **Mars Trek** | Descobertas sobre a saúde de astronautas; Jezero vista da órbita | Cartões de ciência; mapa da expedição |
| **CSA** (agência parceira) | Princípios gerais de cultivo de alimentos em ambientes fechados | Cartão da estufa (paralelo declarado) |

Cada fonte, local e data: [`docs/pt-BR/DATA_MAP.md`](docs/pt-BR/DATA_MAP.md) e [`docs/pt-BR/SCIENCE.md`](docs/pt-BR/SCIENCE.md).

### Rótulos

Cada número no jogo mostra um selo: **Medido** (observação real, com local e data), **Cenário** (assumido para a nossa base) ou **Simplificação** (arredondado ou deixado de fora, de propósito). Dados de arquivo nunca são mostrados como ao vivo. Dados que não foram medidos em Marte são mostrados como paralelo declarado.

## Como rodar

Requisitos: Node 22+, pnpm (via `corepack enable`).

```bash
pnpm install
pnpm dev          # jogo em http://localhost:5173
pnpm dev:api      # API em http://localhost:8787 (/health, /space-weather)
pnpm check        # typecheck + lint + testes
pnpm build
```

Não é preciso chave de API: o DONKI é chamado em `ccmc.gsfc.nasa.gov` sem chave. Uma chave da NASA, se usada para outras APIs, vai num `.env` local (nunca commitado).

## Repositório

```
apps/web        React + Vite game (PWA)
apps/api        Hono API: /health, /space-weather (DONKI with cache), game mirror
packages/sim    pure game rules + science.ts (every constant with its source)
packages/content  texts in en and pt-BR, catalog, data cards
packages/ui     design tokens and components
tools/data      Python scripts to build the catalog
docs/en, docs/pt-BR   documentation in both languages
```

Arquitetura: [`docs/pt-BR/ARCHITECTURE.md`](docs/pt-BR/ARCHITECTURE.md). Decisões: [`docs/pt-BR/adr/`](docs/pt-BR/adr/).

## Uso de IA

A ideia do jogo, o design e as decisões são do time. O código é gerado com **Claude Code** (Anthropic) e revisado pelo time. Detalhes: [`docs/pt-BR/AI_USAGE.md`](docs/pt-BR/AI_USAGE.md).

## Privacidade

Sem contas, sem analytics, sem dados pessoais. O progresso fica no dispositivo.

## Créditos

NASA, CCMC (DONKI), NASA OSDR, NASA/JPL-Caltech e instituições parceiras, Agência Espacial Canadense. Créditos de imagens e assets: [`docs/pt-BR/ASSETS.md`](docs/pt-BR/ASSETS.md). Este projeto não é endossado pela NASA.

## Licença

Código: [MIT](LICENSE). Dados e imagens da NASA mantêm seus próprios termos (veja ASSETS).
