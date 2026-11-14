# Situação — o jogo completo

> Versão em inglês (padrão): [`docs/en/STATUS.md`](../en/STATUS.md). Atualizado no começo e no fim de cada fase. Meta: o jogo **completo**, não uma demonstração parcial. Primeiro o caminho inteiro, depois o acabamento. Funções congeladas domingo às 15h; submissão até as 21h (Brasília).

Legenda: ✅ feito · 🔄 em andamento · ⬜ a fazer · ✂️ cortado (com motivo e aval do time)

Última atualização: 14/11/2026, fim da Fase 3 (missão 1 jogável de ponta a ponta num celular de 360 px em EN e PT, conferida por um teste automático no CI).

| Parte do jogo completo | Fase | Situação | Nota |
| --- | --- | --- | --- |
| Abertura (20 a 30 s, pulável) | 7 | ⬜ | A primeira a simplificar se faltar tempo (imagem + uma frase) |
| Tela inicial com a carreira | 3 / 6 | 🔄 | Feito: linha de números, selo da foto real, papel que alterna, rodapé honesto. Lista da carreira na Fase 6 |
| Missão 1 "Primeiros sóis" (guiada) | 3 | ✅ | Eventos reais: erupção M1.3 (sol 3), CME com previsão de chegada a Marte (sol 5) |
| Missão 2 "A tempestade de maio" | 6 | ⬜ | Evento-âncora de 20/05/2024 |
| Missão 3 "Céu de poeira" | 6 | ⬜ | |
| "Me surpreenda" | 6 | ⬜ | |
| "Hoje no espaço" | 4 | ⬜ | O retrato já é publicado pelo workflow do Pages |
| Cinco destinos | 2 (regras) · 3 · 5 | 🔄 | Regras na Fase 2 |
| Crises (tempestade solar, poeira, estufa, silêncio de rádio) | 2 (regras) · 4 · 5 | 🔄 | |
| Fase 3B A: projeção "se todo sol fosse igual a hoje" | 3B | ✅ | `packages/sim/src/projection.ts`, 11 testes, SIM_MODEL §16 |
| Fase 3B B: tela única — trilha dos 7 sóis com linhas de ar e comida, medidores hoje→amanhã, plano por toque, noite animada | 3B | 🔄 | Ramo `phase-3b`, esperando o time jogar os sóis 1 e 2. O ramo principal e o jogo publicado não mudaram |
| Fase 3B C a F: dica no lugar dos selos, ensino, sol 1 guiado, Laboratório, arte | 3B | ⬜ | Ordem da ADR-0031 |
| Cortes (ADR-0031): avatar, código da carreira, missão 3, cartões do OSDR, mochila (só se sobrar tempo) | — | ✂️ | Aprovado pelo time |
| Conta ao vivo (passos da noite) | 2 (regras) · 3 | ✅ | Atualiza a cada célula movida; noite animada passo a passo; palpite opcional; rever |
| Fichas de dado em toda tela | 3 → 7 | 🔄 | 18 fichas em EN e PT, selo em todo número, "Quero entender melhor". Fichas das crises na Fase 4. Ficha de Perguntar à Terra a ajustar para a missão 2 (lá a resposta é uma medição em Marte) |
| Teste de ponta a ponta (CI, 360 px, EN + PT) | 3 | ✅ | `.github/workflows/e2e.yml`, base da gravação da demo |
| Clima espacial em três camadas | 1 (API, retrato) · 4 (jogo) | 🔄 | API e retrato no ar; lado do jogo na Fase 4 |
| Fim: a Terra no céu, jogar de novo, voltar ao sol | 6 | ⬜ | |
| Salvar no aparelho + código da carreira | 2 (regras do código) · 6 | 🔄 | |
| Insígnias e "zerar" | 2 (regras) · 6 | 🔄 | |
| A ciência por trás + JSON público | 7 | ⬜ | |
| Português e inglês | 1 → todas | 🔄 | Abre em inglês (ADR-0028) |
| Acessibilidade + modo assistido | 3 → 7 | ⬜ | |
| Modo de teste (`?playtest=1`, exportar JSON) | 4 | ⬜ | Antes da pausa para teste |
| Imagens (10 escolhidas) | 1 | ✅ | Preparadas; entram a partir da Fase 3 |
| Publicação: GitHub Pages | 1 | ✅ | https://rafaelafeijo.github.io/mars-to-go/ |
| Publicação: Railway (API + espelho) | 1 | ✅ | https://mars-to-go-api-production.up.railway.app/health — publicado com `railway up`; publicar a cada push exige ligar o repositório do GitHub no painel do Railway |
| Documentação bilíngue | 0 → todas | 🔄 | |
| Material de submissão (página, vídeo de 30 s, slides) | 8 | ⬜ | |
| Avatar, base tocável | 6 | ⬜ | Primeiros a sair (brief §10) |

## Plano de tempo (horário de Brasília)

| Fase | Janela | Risco principal |
| --- | --- | --- |
| 2 Simulação | sáb 13h45–15h30 | — |
| 3 Sol jogável | sáb 15h30–19h | Conta ao vivo em 360 px |
| 4 Clima espacial + crise + modo de teste | sáb 19h–21h30 | A pausa para teste pode ir para domingo 8h |
| Teste com a criança | sáb à noite ou dom 8h | Disponibilidade da criança |
| 5 Cinco temas completos | dom 8h30–10h30 | |
| 6 Fim, carreira, salvar, insígnias | dom 10h30–13h | Muitas partes pequenas |
| 7 Ciência por trás, acessibilidade, offline, abertura | dom 13h–15h (congelamento) | Abertura é a primeira a simplificar |
| 8 Submissão | dom 15h–21h | Vídeo de até 30 s |
