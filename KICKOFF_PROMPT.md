# Como começar — Mars to Go

## 1. Preparar a pasta (5 minutos)

1. Extraia o pacote numa pasta `mars-to-go` e abra no VS Code.
2. No terminal, confira as contas pessoais:

```
gh auth status
railway login
```

3. Abra o Claude Code na pasta e instale os plugins (você digita; o Claude não roda comandos com barra):

```
/plugin install frontend-design@claude-plugins-official
/plugin install railway@claude-plugins-official
/plugin install github@claude-plugins-official
```

4. Peça uma chave gratuita em https://api.nasa.gov/ e guarde num arquivo `.env` local (nunca no repositório).
5. Cole o prompt abaixo.

## 2. Prompt

```
Vamos construir o Mars to Go para o NASA Space Apps Challenge 2026. O hackathon
está em andamento e o prazo é domingo, 15 de novembro, 23h59 (Brasília).

Leia agora, nesta ordem: CLAUDE.md, docs/CHALLENGE_STATEMENT.md,
docs/CHALLENGE_CHECKLIST.md, docs/PROJECT_BRIEF.md, docs/adr/ADRS.md,
docs/IMAGES.md e docs/SUBMISSION.md. O CLAUDE.md tem as regras que não se
negociam. Em caso de conflito, o texto oficial do desafio vence; me avise.

Fale comigo em português. Código, comentários e commits em inglês. Jogo e
documentação em inglês e português.

COMO VAMOS TRABALHAR
- Por fases. Ao fim de cada fase você me mostra o que fez e ESPERA a minha
  validação. Só depois disso faz o commit em main, cria a marca da fase
  (phase-0, phase-1, …) e segue.
- Antes de planejar cada fase e antes de cada commit que muda o jogo, percorra
  docs/CHALLENGE_CHECKLIST.md e me diga em poucas linhas quais itens a fase
  atende e quais ficaram em risco. A pergunta da seção A decide se está pronto.
- Nenhuma tela antes de a lógica e os dados por trás dela estarem validados.

FASE 0 — DESENHO E VALIDAÇÃO (teto de 90 minutos; nenhum código de produto)
Objetivo: eu aprovar a arquitetura, os dados e a matemática antes de existir
qualquer tela.

0.1 Ambiente (10 minutos)
   - Versões de node, pnpm, git, gh, python e railway; o que falta.
   - `gh auth status`: mostre a conta ativa. Se não for a minha pessoal, pare.

0.2 Sondagem dos dados, com chamadas reais
   Para cada fonte, faça uma chamada de verdade e me mostre um registro:
   - DONKI: endereço base, rotas (FLR, CME, SEP, GST, notificações), parâmetros
     de data, chave, limites, se o navegador consegue chamar direto.
     https://ccmc.gsfc.nasa.gov/DONKI/api/ e https://api.nasa.gov/
     Ponto de partida a verificar, não a assumir: rotas do tipo
     .../DONKI/WS/get/FLR?startDate=AAAA-MM-DD&endDate=AAAA-MM-DD, campos como
     classType, beginTime, peakTime. Verifique também se as análises trazem
     previsão de chegada a Marte.
   - RadLab: https://visualization.osdr.nasa.gov/radlab/gui/data-api/
   - OSDR: https://osdr.nasa.gov/osdr/data/search?term=radiation
   - Mars Trek: imagem de Jezero e medição de distância.
   - CSA, produção de alimentos:
     https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/
   Diga o que funcionou, o que não funcionou e o que isso muda no plano.

0.3 docs/en/DATA_MAP.md (e a versão em pt-BR)
   Uma linha por dado que o jogo vai mostrar ou usar: fonte e identificador do
   registro, rota, campos, lugar e data da medição, tratamento, uso no jogo
   (qual regra), rótulo (medido, cenário, simplificação), ao vivo ou arquivo,
   paralelo com Marte e sua justificativa, explicação para criança com exemplo
   do dia a dia, situação da validação. Inclua os desafios próprios de Marte da
   seção 6.5 do brief, cada um com fonte conferida. O que não tiver fonte fica
   marcado como pendente e não entra em tela.

0.4 docs/en/SIM_MODEL.md (e pt-BR)
   O modelo completo da simulação, antes de programar: estados, as 10 células,
   o efeito de cada célula em cada destino, consumo por sol, atraso da estufa,
   escudo e exposição em três níveis, expedição, perguntar à Terra, crises,
   condições de fim, margem em sóis. Para cada regra: a conta, as unidades, o
   rótulo de cada constante. Inclua três partidas de exemplo calculadas à mão
   (uma que termina bem, uma no limite, uma com retorno antecipado) e mostre
   que não existe distribuição sem custo nem estratégia única que vence.
   Essas partidas viram os primeiros testes.

0.5 docs/en/ARCHITECTURE.md (e pt-BR), com diagramas Mermaid
   - Contexto: jogador, jogo no navegador, GitHub Pages, API no Railway, DONKI
     e demais fontes, tarefa agendada do retrato diário.
   - Módulos do monorepo e quem depende de quem.
   - Fluxo do dado: fonte → tratamento → ficha → tela → página de ciência →
     arquivo público.
   - Clima espacial em três camadas: ao vivo, retrato diário, arquivo.
   - Máquina de estados de um sol e de uma missão.
   - Modelo do que é salvo no aparelho e do código da missão.
   - Mapa de telas, mobile first, com o que cada uma mostra e quais fichas.

0.6 Me entregue um resumo de uma tela com as decisões que preciso validar e as
    dúvidas em aberto. Espere a minha aprovação.

FASE 1 — REPOSITÓRIO E ESQUELETO
a. Estruture docs/ em docs/en/ (padrão) e docs/pt-BR/. Os documentos que
   recebi estão em português: mova-os para pt-BR e crie as versões em inglês.
   Separe os ADRs em arquivos próprios. docs/CHALLENGE_STATEMENT.md fica como
   está.
b. Crie SCIENCE, ASSETS e AI_USAGE nos dois idiomas. Em AI_USAGE, registre
   desde já que o código é gerado com Claude Code e revisado por mim.
c. Monorepo pnpm conforme a seção 9 do brief. Licença MIT para o código.
d. README.md em inglês e README.pt-BR.md: o que é, desafio, como rodar, dados
   da NASA usados e por quê, rótulos, declaração de IA, créditos, licença.
e. Repositório PÚBLICO na minha conta pessoal. Confirme o dono comigo e então:
   gh repo create mars-to-go --public --source=. --remote=origin --push
f. Publicação:
   - GitHub Pages para o jogo (endereço principal).
   - Railway para a API e um espelho do jogo.
   - GitHub Actions: typecheck, lint, testes, publicação, e a tarefa agendada
     que grava o retrato do DONKI.
   Me entregue os endereços.
Pronto quando: o endereço principal mostra "Mars to Go", troca entre português
e inglês, e a API responde em /health.

FASE 2 — SIMULAÇÃO
packages/sim com testes, a partir do SIM_MODEL aprovado. As três partidas de
exemplo passam. Constantes só em science.ts, cada uma com a ficha completa
(regra 16 do CLAUDE.md).

FASE 3 — O SOL JOGÁVEL
Previsão com pergunta, distribuição das 10 células com "a conta aberta", noite,
diário do sol. Três medidores com palavras. Selo de origem em todo número e a
ficha do dado a um toque, com "Quero entender melhor". Mobile first.

FASE 4 — CLIMA ESPACIAL REAL
Catálogo de 8 a 12 eventos reais montado por script; rota /space-weather com
cache; retrato diário; a cadeia de três camadas com o selo certo em cada caso;
tabela declarada de classe do evento para risco no jogo; "Hoje no espaço".
Crise de tempestade solar com relógio de dez segundos e modo assistido.

PAUSA PARA TESTE
Avise quando a fase 4 estiver publicada. Uma criança de 8 anos vai jogar. Eu
trago o que ela entendeu e onde travou, e ajustamos antes de seguir.

FASE 5 — OS CINCO TEMAS COMPLETOS
Escudo e exposição em três níveis; expedição com lugar real de Jezero;
perguntar à Terra com atraso; crise de silêncio de rádio com a mensagem
atrasada da Terra.

FASE 6 — FIM, RECOMEÇO E EMOÇÃO
"Voltamos todos"; a Terra no céu; "Quer jogar esta missão de novo com outro
plano?" e "Voltar ao sol em que tudo mudou"; salvar no aparelho com versão;
código da missão; insígnia; cartões de ciência do OSDR e leitura do RadLab como
paralelo declarado; avatar simples e base tocável, se houver folga.

FASE 7 — CIÊNCIA À VISTA E ACABAMENTO
Página "A ciência por trás" e arquivo público com todas as fichas, gerados da
mesma fonte das telas. Acessibilidade, contraste, desempenho, funcionamento sem
rede. Conferência completa do checklist, item por item.

FASE 8 — SUBMISSÃO
Preencha docs/en/SUBMISSION.md só com o que o jogo faz de fato. Me ajude a
montar o vídeo de até 30 segundos (narração, jogo rodando, código na tela) e os
slides de apoio. Liste para mim o que gravar.

IMAGENS
Siga docs/IMAGES.md. Me diga, no começo de cada fase, quais imagens da lista
você precisa que eu busque, e use espaços reservados até eu subir.

RELÓGIO
- Fase 0: teto de 90 minutos.
- Congelar funções às 15h de domingo.
- Submeter até as 21h de domingo; depois, só correções.
- Se eu disser "estamos atrasadas", aplique a ordem de corte da seção 10 do
  brief e me diga o que sai.

Comece pela Fase 0.
```

## 3. Bibliotecas para o Claude Code avaliar

| Necessidade | Candidatas |
| --- | --- |
| Aplicativo instalável e offline | vite-plugin-pwa |
| Idiomas | i18next com react-i18next |
| Testes da simulação | Vitest |
| Testes de interface | Playwright |
| Acessibilidade automática | axe-core, eslint-plugin-jsx-a11y |
| Diagramas na documentação | Mermaid (o GitHub renderiza) |
| Arte de licença livre | Kenney (CC0), registrada em ASSETS |
| Cena de abertura, se houver folga | Phaser (modelo oficial React + TypeScript) |
