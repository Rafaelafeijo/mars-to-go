# ADRs iniciais — Mars to Go

Formato: contexto, decisão, consequências. Todas aceitas em 14 de novembro de 2026. O Claude Code deve separar cada uma em seu próprio arquivo (`0001-….md`) e seguir o mesmo formato para as próximas.

## ADR-0001 — O núcleo é a gestão da base, sol a sol

**Contexto.** O desafio pede que crianças administrem um posto avançado e vivam as consequências das escolhas ao longo de uma missão simulada.
**Decisão.** O jogo é uma missão de 7 sóis numa base em Jezero. A viagem e o pouso são só ambientação.
**Consequências.** Tudo o que não muda uma reserva da base é secundário.

## ADR-0002 — Três recursos centrais e um orçamento de 10 células

**Contexto.** O desafio pede cinco temas de decisão, mas alerta que dois ou três recursos centrais funcionam melhor que cinco ou seis.
**Decisão.** Recursos: energia (10 células por sol), ar e comida. Os cinco temas viram lugares onde gastar: Suporte à Vida, Estufa, Escudo, Expedição, Perguntar à Terra.
**Consequências.** A matemática cabe em contagem e soma. Nenhuma distribuição enche tudo, o que garante que não exista escolha grátis.

## ADR-0003 — Todo número tem rótulo: medido, cenário ou simplificação

**Contexto.** O jogo mistura dados reais com uma base que não existe. O desafio pede fontes creditadas e proíbe apresentar dado estático como ao vivo.
**Decisão.** Nenhuma constante fora do arquivo único de ciência. Cada uma tem rótulo, fonte, lugar e data, e o rótulo aparece na interface, com "ao vivo" ou "arquivo".
**Consequências.** Trabalho extra por número; em troca, a ciência é rastreável pelos jurados.

## ADR-0004 — DONKI em três camadas: ao vivo, retrato diário e arquivo

**Contexto.** O desafio destaca ligar a decisão de blindagem ao clima espacial real. Chamadas diretas do navegador podem falhar e expor chave.
**Decisão.** Três camadas, da mais fresca à mais segura: a API do projeto consulta o DONKI e guarda em cache; uma tarefa agendada grava um retrato diário dentro do site; um catálogo curado de eventos reais vai embutido. O jogo usa a mais fresca que responder e mostra qual é. A conversão de classe do evento em risco no jogo é uma tabela declarada como simplificação.
**Consequências.** O jogo funciona offline e com o DONKI fora do ar. O back-end passa a ter função real.

## ADR-0005 — Radiação sem dose inventada

**Contexto.** Blindagem contra radiação é tema obrigatório, mas não temos modelo defensável de dose em Marte.
**Decisão.** O jogo mostra exposição da tripulação em três níveis (baixa, média, alta), movida por eventos reais do DONKI e pelo uso do Escudo. Leituras reais de dose aparecem só como cartões informativos do RadLab, rotuladas como medidas na Estação Espacial.
**Consequências.** Nenhum número de dose marciana é fabricado. A criança aprende a troca (escudo custa energia) sem falsa precisão.

## ADR-0006 — Um local real: cratera Jezero

**Contexto.** O desafio sugere dados de missões de superfície para o local escolhido.
**Decisão.** A base fica em Jezero. Imagens e distâncias dos pontos de expedição vêm do Mars Trek e de fotos de rovers. Modelos de terreno de alta resolução ficam fora do MVP.
**Consequências.** Preparo de dados leve. O mapa serve à decisão de expedição, não é um sistema de rotas.

## ADR-0007 — Monorepo TypeScript com pnpm; Python só para preparar dados

**Contexto.** Front, API e simulação compartilham tipos e constantes.
**Decisão.** pnpm workspaces com apps/web, apps/api, packages/sim, packages/content, packages/ui. Python apenas em tools/data.
**Consequências.** Uma linguagem em produção.

## ADR-0008 — Interface em React; sem motor de jogo no início

**Contexto.** O jogo é de decisão por turnos, precisa de acessibilidade e idiomas, e o prazo é de um fim de semana.
**Decisão.** React + Vite, com animação em CSS e SVG. Um motor como o Phaser só entra para a cena de abertura, se houver folga, registrado em novo ADR.
**Consequências.** Menos peças para montar e depurar. Menos espetáculo visual.

## ADR-0009 — A simulação é um pacote puro e testado

**Contexto.** A validade depende de contas corretas e auditáveis.
**Decisão.** packages/sim não importa nada de interface. Cada conta mostrada na tela tem teste. Teste antes da tela.
**Consequências.** A interface só exibe o que a simulação calcula.

## ADR-0010 — Sem conta, sem banco, progresso no aparelho

**Contexto.** O desafio valoriza jogar sem download e sem conta; o público é de crianças.
**Decisão.** Nenhum dado pessoal. Progresso em armazenamento local. A API não tem banco.
**Consequências.** Sem sincronização entre aparelhos.

## ADR-0011 — GitHub Pages como endereço principal; Railway para a API e o espelho

**Contexto.** A submissão exige links públicos sem cadastro.
**Decisão.** O jogo, que é um site estático, é publicado no GitHub Pages como endereço principal. O Railway hospeda a API ao vivo e um espelho do jogo, com comandos filtrados por pacote e caminhos observados por serviço. O jogo funciona inteiro sem a API.
**Consequências.** Dois destinos de publicação para manter. Menor risco de os jurados encontrarem o endereço bloqueado por filtro de rede.

## ADR-0012 — Jogo e documentação bilíngues; código em inglês

**Contexto.** O jogo é criado em português e precisa alcançar o mundo. O guia de submissão exige inglês na página do projeto e nos materiais ligados.
**Decisão.** Interface em português e inglês completos desde o MVP. Código, comentários e commits em inglês. Documentação em `docs/en/` (padrão) e `docs/pt-BR/`. Página do projeto, demo e slides só em inglês.
**Consequências.** Todo texto novo nasce nos dois idiomas. O espanhol fica para depois do evento.

## ADR-0013 — Acessibilidade e modo assistido são requisito

**Contexto.** Relógios de dez segundos excluem parte das crianças de 7 a 9 anos.
**Decisão.** WCAG 2.2 AA nas telas de decisão. Todo relógio tem modo assistido com o mesmo aprendizado. Som opcional.
**Consequências.** Cada componente passa por uma lista de verificação.

## ADR-0014 — Toda tela mostra a trilha do dado

**Contexto.** O desafio pede fontes creditadas dentro do jogo e ciência rastreável pelos jurados. A criança que quer saber mais precisa encontrar a resposta ali.
**Decisão.** Cada dado tem uma ficha com fonte, lugar e data, tratamento, uso no jogo, simplificação, paralelo e uma explicação em linguagem de criança com exemplo do dia a dia. As fichas das telas, a página "A ciência por trás" e um arquivo público saem da mesma fonte. Tela sem ficha não é aceita.
**Consequências.** Cada dado novo custa uma ficha completa nos dois idiomas. A validade deixa de depender do README.

## ADR-0015 — Marte primeiro; paralelos só com justificativa

**Contexto.** Parte dos dados sugeridos pelo desafio é da Estação Espacial, da Lua ou do Sol.
**Decisão.** Todo dado mostra onde foi medido. O que não é de Marte entra como paralelo, com a justificativa científica registrada e a diferença dita na ficha. O material lunar da CSA fornece apenas princípios gerais de cultivo em ambiente fechado.
**Consequências.** Alguns dados interessantes ficam de fora por falta de justificativa conferida.

## ADR-0016 — Validar antes de desenhar telas

**Contexto.** Refazer telas por erro de modelo custa caro num fim de semana.
**Decisão.** A primeira fase produz a arquitetura com diagramas, o mapa de dados e o modelo da simulação, com teto de 90 minutos, e só termina com a aprovação da Rafaela. Cada fase seguinte também termina com validação, commit e marca no repositório.
**Consequências.** As primeiras telas aparecem mais tarde, sobre base já validada.

## ADR-0017 — Salvar sem conta: aparelho e código da missão

**Contexto.** O desafio valoriza jogar sem conta; a criança precisa poder parar e voltar.
**Decisão.** O estado é gravado no aparelho a cada sol, com versão. Um código curto, sem dado pessoal, permite continuar em outro aparelho. Ao fim de cada missão o jogo pergunta se a criança quer jogar de novo com outro plano.
**Consequências.** Sem servidor de contas. O código precisa caber na tela e ser fácil de digitar.

## ADR-0018 — Avatar e exploração da base em versão simples

**Contexto.** Personalização e exploração aumentam o envolvimento e contam no critério Creativity, mas não ensinam a troca central.
**Decisão.** Avatar com cor de traje, emblema e codinome de lista pronta. Base como cenário tocável que abre as fichas. Ambos entram depois das mecânicas centrais e são os primeiros a sair se faltar tempo.
**Consequências.** Nenhum texto digitado pela criança, portanto nenhum dado pessoal.
