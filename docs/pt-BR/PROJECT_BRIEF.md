# Mars to Go — Brief do projeto

> Chamada: **10 seconds to go.**
> Evento: NASA Space Apps Challenge 2026, Universal Event, 14 e 15 de novembro de 2026.
> Desafio: **Build a Junior Astronaut Mission Trainer.**
> Time: **Rochette**, mãe e filho. O nome vem da rocha da cratera Jezero amostrada pelo rover Perseverance (conferir em fonte da NASA).
> Prazo: "Submit for Judging" até domingo, 15 de novembro, 23h59 (horário de Brasília).
> Idiomas: o jogo é bilíngue desde o MVP, em português (idioma de criação) e inglês (universal). O código é em inglês. A documentação existe em inglês (padrão) e português. A página do projeto, a demo e os slides são só em inglês, por exigência do guia de submissão.
> Antes de qualquer decisão de design, conferir `docs/CHALLENGE_CHECKLIST.md`.

---

## 1. O que é

Mars to Go é um jogo de navegador, mobile first, em que crianças de 7 a 12 anos administram uma base tripulada em Marte, sol a sol, e descobrem que no espaço nenhuma escolha é grátis: a energia que protege a tripulação hoje é o oxigênio que falta amanhã.

**O problema que o desafio aponta:** o público quase nunca vê a lógica de decisão por trás de uma missão, só o resultado. O jogo existe para construir esse entendimento do que sobreviver nesses ambientes realmente exige.

### Proposta de valor

**Mars to Go faz uma criança sentir que cabe a ela trazer a tripulação de volta para casa, e descobrir que consegue, usando matemática, lógica e dados reais da NASA.**

Em inglês: *Mars to Go lets a child feel what it takes to bring a crew home from Mars, and discover that math, logic and real NASA data are how you do it.*

| Para quem | O que entrega |
| --- | --- |
| A criança | A experiência de ser capaz: toma a decisão do astronauta e vê a conta que a sustenta |
| A família | Um jogo que não explora a atenção da criança e a deixa falando de ciência |
| O mundo | O sonho de Marte ao alcance de um celular simples, sem download e sem conta |

### Impacto que defendemos

Manter vivo, em crianças e adolescentes, o sonho de conhecer o universo profundo. O jogo treina, de forma visível na tela:

| Habilidade | Onde aparece |
| --- | --- |
| Raciocínio lógico | Cadeia de dependências entre energia, ar, comida e escudo |
| Matemática | Contar e distribuir células; somar consumo; comparar reservas |
| Física e ciências | Luz solar, atmosfera, radiação, cultivo, atraso de rádio, cada um com dado real |
| Criatividade | Não há plano único que vence; estratégias diferentes funcionam |
| Autonomia | A criança decide sem a Terra quando o rádio atrasa |
| Coragem | Dez segundos para escolher e arcar com a consequência |

## 2. Público

- **7 a 12 anos**, como pede o desafio. Modo assistido pensado para 7 a 9.
- **Matemática:** contar, somar, comparar, multiplicar por números pequenos.
- **Linguagem:** frases curtas; termo científico explicado na hora, em uma frase.
- **Contexto:** celular de entrada, tela a partir de 360 px na vertical, rede instável, partidas de 5 a 8 minutos.

## 3. Princípios

1. **Nenhuma escolha é grátis.** Toda opção mostra o que custa.
2. **Mecânica antes de visual.** Simples e verdadeiro vale mais que bonito e vazio.
3. **Três recursos centrais.** Energia, ar e comida. O resto são ações e eventos.
4. **Errar ensina e não pune.** Recomeçar leva segundos.
5. **Destreza não bloqueia.** Todo relógio tem modo assistido.
6. **Dado com origem.** Todo número traz rótulo, fonte e data.
7. **Viciante do jeito certo.** Partida curta, vontade de tentar outra estratégia. Sem compras, sem prêmio aleatório, sem castigo por ausência.
8. **Sem conta e sem dados pessoais.**

## 4. O jogo

### 4.1 Visão geral

A tripulação pousou em Jezero e precisa manter a base por **7 sóis** até a janela de retorno. Cada sol é uma rodada de cerca de um minuto.

### 4.2 Os três recursos

| Recurso | O que é | Como muda |
| --- | --- | --- |
| **Energia** | 10 células por sol, o orçamento do dia | Menos células quando há poeira; nunca sobra para tudo |
| **Ar** | Reserva de oxigênio da tripulação | Sobe com células em Suporte à Vida; desce todo sol e em expedições |
| **Comida** | Reserva de alimento | Sobe devagar com células na Estufa (plantar hoje, colher sóis depois); desce todo sol |

### 4.3 Onde gastar as células (os cinco temas do desafio)

| Decisão | Tema do desafio | Ganho | Custo |
| --- | --- | --- | --- |
| **Suporte à Vida** | Life support | Produz ar hoje | Células que não vão para o resto |
| **Estufa** | Food production | Comida daqui a alguns sóis | Não ajuda hoje |
| **Escudo** | Radiation shielding | Protege a tripulação nesta noite | Células gastas mesmo se a tempestade não vier |
| **Expedição científica** | Trocar reserva por ciência | Uma descoberta em um local real de Jezero | Gasta ar; sem escudo lá fora |
| **Perguntar à Terra** | Communication delay | Um conselho do controle de missão | A resposta demora; em crise chega tarde demais |

A distribuição das células é o **power budgeting** que o desafio pede. Não existe combinação que encha tudo.

### 4.4 Um sol, passo a passo

1. **Previsão do sol.** Clima espacial (evento real do DONKI) e poeira. A criança responde a uma pergunta: "o que você acha que vai acontecer se…?".
2. **Distribuir as 10 células.** Arrastando ou tocando. A "conta aberta" mostra o efeito de cada célula.
3. **Ação opcional:** expedição científica ou perguntar à Terra.
4. **Crise** (em alguns sóis): dez segundos para decidir.
5. **Noite.** O sol roda e as consequências aparecem.
6. **Diário do sol.** Previsão contra resultado, a conta, a fonte do dado e "e se você tivesse…?".

### 4.5 Crises de dez segundos

| Crise | Gatilho | Decisão | Tema |
| --- | --- | --- | --- |
| Tempestade solar | Evento real do DONKI | Recolher a expedição ou seguir; desviar células para o Escudo | Radiação |
| Poeira | Cenário declarado | O que desligar com metade da energia | Energia |
| Falha na estufa | Cenário declarado | Salvar a colheita ou o ar | Comida e ar |
| Silêncio de rádio | Atraso real de comunicação | Decidir sem a Terra | Comunicação |

No modo assistido o relógio para enquanto a criança lê. Depois da crise chega a mensagem atrasada da Terra dizendo que viu e confia nela.

### 4.6 Fim da missão

- **Voltamos todos:** a tripulação chega à janela de retorno. Resultado em margem de sóis e descobertas feitas.
- **Retorno antecipado:** uma reserva zerou. O diário mostra em que sol a decisão que custou caro foi tomada.
- **Jogar de novo:** ao fim de toda missão o jogo pergunta "Quer jogar esta missão de novo com outro plano?". Depois de um retorno antecipado, oferece também "Voltar ao sol em que tudo mudou".
- **A Terra no céu:** a cena final mostra a Terra como um ponto de luz no céu de Marte, a partir de uma foto real feita por um rover.

### 4.7 Rejogabilidade

- Os eventos de cada partida são sorteados de um catálogo curado de eventos reais do DONKI.
- **Modo "Hoje no espaço":** a partida usa o clima espacial real dos últimos dias, buscado ao vivo, com a data na tela.
- Ao terminar, o jogo sugere uma estratégia diferente para tentar.

### 4.8 Salvar sem conta

- O progresso é gravado no próprio aparelho a cada sol, com número de versão para não quebrar em atualizações.
- Um **código da carreira** curto guarda missões abertas, insígnias, descobertas e a missão em andamento; digitado em outro aparelho, restaura tudo. Não contém dado pessoal (ADR-0022).
- Apagar o progresso é uma opção visível. A tela de ajustes avisa que, sem o código, apagar os dados do navegador apaga o progresso.

### 4.8.1 A jornada (ADR-0021)

O jogo é uma carreira de missões de 7 sóis, com as mesmas regras e listas de eventos diferentes: missão 1 "Primeiros sóis" (guiada, Sol calmo); missão 2 "A tempestade de maio" (o evento real de 20/05/2024); missão 3 "Céu de poeira"; "Me surpreenda"; "Hoje no espaço". Zerar = parede de insígnias completa (as três missões com todos de volta, uma missão de referência e todas as descobertas), com o título de comandante e uma cena final. Na missão 1 os destinos abrem aos poucos (ADR-0019).

### 4.9 Explorar e personalizar

- **Explorar a base:** a tela da base é um cenário tocável. Cada módulo (suporte à vida, estufa, escudo, antena, painéis) abre o que faz, quanto consome e o dado real por trás.
- **Explorar o ambiente:** os pontos de expedição são lugares reais de Jezero, com foto real e ficha.
- **Avatar:** a criança escolhe cor do traje e um emblema, e um codinome de uma lista pronta. Nada digitado, nada pessoal. Entra no MVP só na versão simples; fica depois das mecânicas centrais.

### 4.10 Abertura: a descida

Cena curta, não jogável, que ambienta a chegada a Marte com os números reais do pouso do Perseverance. Pode ser pulada. É a primeira coisa a simplificar se faltar tempo.

### 4.11 Os três momentos que carregam a emoção

| Momento | Onde | O que acontece |
| --- | --- | --- |
| "Você decide" | Crise com silêncio de rádio | A Terra não responde a tempo; a criança escolhe sozinha |
| A Terra no céu | Cena final | A Terra como ponto de luz, em foto real |
| "Voltamos todos" | Fim da missão | A vitória é a equipe inteira de volta |

## 5. Avaliação da partida (sem estrelas)

| Elemento | O que mostra |
| --- | --- |
| Margem em sóis | "Sobrou ar e comida para N sóis além do necessário" |
| Medidores | Energia, ar, comida, com palavras: crítico, apertado, seguro, folgado |
| Exposição da tripulação | Baixa, média ou alta, em palavra e ícone |
| Veredito do controle de missão | Retorno antecipado, no limite, com margem, missão de referência |
| Insígnia | Uma por missão concluída, com faixas "previsão certeira" e "sem assistência" |
| Descobertas | Cartões de ciência reais coletados nas expedições |

Nada é comunicado só por cor.

## 6. Dados

A lógica científica e matemática é definida e validada **antes** das telas: primeiro o mapa de dados e o modelo da simulação, depois a interface.

### 6.1 Três rótulos, sempre visíveis

| Rótulo | Significado | Na tela |
| --- | --- | --- |
| **Medido** | Observação real, com instrumento, lugar e data | "Medido · DONKI · 10 mai 2024" |
| **Cenário** | Parâmetro assumido para a base do jogo | "Cenário do jogo" |
| **Simplificação** | O que o modelo arredonda ou ignora | "Simplificado" |

Dado ao vivo mostra "ao vivo" e a data da consulta. Dado de arquivo mostra "arquivo" e a data do evento. Nunca o contrário. Todo dado mostra também **onde** foi medido: Marte, Estação Espacial, Sol, Terra ou Lua.

### 6.2 Fontes e uso

| Fonte | O que traz | Onde entra | Prioridade |
| --- | --- | --- | --- |
| **DONKI** (CCMC/NASA) | Erupções solares, ejeções de massa coronal, partículas energéticas, tempestades geomagnéticas | Previsão do sol, crise de tempestade solar, modo "Hoje no espaço" | 1 |
| **RadLab** (OSDR) | Taxas de dose medidas por dosímetros na Estação Espacial | Cartão "quanto um escudo importa", rotulado como medido na Estação, não em Marte | 2 |
| **OSDR** | Achados reais de saúde de astronautas (osso, músculo, sono, imunidade) | Cartões de ciência no diário e nas descobertas | 2 |
| **Mars Trek** | Imagem e terreno reais de Marte | Local da base e pontos de expedição em Jezero, com distâncias medidas na ferramenta | 2 |
| **MOXIE** (Perseverance) | Oxigênio produzido a partir do ar de Marte | Referência do Suporte à Vida, com o escalonamento declarado como cenário | 2 |
| **CSA** (parceira) | Material sobre produção de alimentos fora da Terra | Fatos da Estufa | 3 |
| **Fotos de rovers** (NASA) | Imagens reais da superfície e do céu | Fundos, descobertas, a Terra no céu | 3 |

### 6.3 Como o DONKI entra

- **Usar o clima espacial real é viável**, com três camadas, da mais fresca à mais segura:
  1. A API do nosso servidor consulta o DONKI, guarda em cache e entrega ao jogo ("ao vivo").
  2. Uma tarefa agendada no GitHub grava um retrato do DONKI dentro do próprio site, uma ou mais vezes por dia ("atualizado em" com a data).
  3. O catálogo curado embutido ("arquivo").
- O jogo usa a camada mais fresca que responder e mostra qual é.
- O Sol pode estar calmo no fim de semana. Por isso a missão sempre tem eventos do catálogo, e o clima real aparece como "Hoje no espaço"; se houver evento recente, ele entra na partida.
- Limite a declarar: o DONKI registra o que saiu do Sol. Se um evento atinge Marte depende da direção. Verificar se as análises do DONKI trazem previsão de chegada a Marte; se trouxerem, usar.
- O catálogo curado tem de 8 a 12 eventos reais, de intensidades diferentes, com identificador, data e classe.
- Uma tabela simples e declarada converte a classe do evento em risco no jogo (baixo, médio, alto). Essa conversão é rotulada como simplificação: um registro de evento solar não é uma dose em Marte.

### 6.4 A ficha de cada dado (visível em toda tela)

Todo número na tela tem um selo. Um toque abre a ficha:

| Campo | Pergunta que responde |
| --- | --- |
| Fonte | De onde veio? Link e identificador do registro |
| Lugar e data | Onde e quando foi medido? |
| Tratamento | O que fizemos com ele? (filtrar, arredondar, converter, agrupar) |
| Uso no jogo | Que regra ou conta ele alimenta? |
| Simplificação | O que deixamos de fora, e por quê? |
| Paralelo | Se não é de Marte: por que serve e o que é diferente lá? |
| Quero entender melhor | Explicação em linguagem de criança, com exemplo do dia a dia e onde isso vale fora do jogo |

Exemplos de comparação do dia a dia: células de energia como a bateria do celular; reserva de ar como uma garrafa de água numa trilha; escudo como protetor solar; atraso de rádio como mandar uma carta em vez de ligar.

As fichas, a página "A ciência por trás" e um arquivo público para os jurados saem todos do mesmo lugar (`science.ts` e o catálogo), para nunca divergirem.

### 6.5 Marte de verdade e paralelos

O MVP se passa em Marte. Os desafios próprios do planeta aparecem no jogo, cada um com fonte a conferir antes de entrar:

| Desafio de Marte | Efeito no jogo |
| --- | --- |
| Atmosfera rarefeita, quase toda de CO₂ | Ar precisa ser produzido; o Suporte à Vida custa energia |
| Menos luz solar que na Terra | Só 10 células por sol |
| Tempestades de poeira | Dias com menos células |
| Frio intenso | Parte da energia é fixa para aquecer o habitat |
| Solo que não serve direto para plantio | A Estufa é fechada e demora a render |
| Sem campo magnético global e ar fino | Radiação chega à superfície; o Escudo importa |
| Distância da Terra | Atraso de rádio; decidir sozinho |

**Material lunar da CSA.** O conjunto fala de produção de alimentos na Lua e em áreas remotas. Usar números lunares numa base marciana seria erro, e adaptar tudo seria esforço demais para o MVP. Decisão: aproveitar só os princípios gerais de cultivo em ambiente fechado (água reciclada, luz artificial, tempo de crescimento), apresentados como paralelo e com a diferença dita na ficha (gravidade, luz, duração do dia, poeira). Se a justificativa não puder ser conferida numa fonte, o dado fica fora.

**Estação Espacial.** Leituras do RadLab e achados do OSDR são de órbita baixa. Entram como paralelo, com a ficha explicando que em Marte a exposição é diferente.

### 6.6 Regras de honestidade com os dados

- Medição da Estação Espacial não é apresentada como medição em Marte.
- O pico de produção do MOXIE não é capacidade contínua; o equipamento da base é cenário.
- A foto do terreno não revela todos os obstáculos.
- Nenhum número sem linha na ficha de constantes.

### 6.7 Ficha de constantes (ponto de partida; conferir cada uma na fonte)

| Constante | Valor | Rótulo | Situação |
| --- | --- | --- | --- |
| Duração da missão no jogo | 7 sóis | Cenário | Definido |
| Células de energia por sol | 10 | Cenário | Definido |
| Atmosfera de Marte | 95,1% de CO₂ | Medido | Conferido (Mars Fact Sheet) |
| Oxigênio do MOXIE | 122 g no total; até 12 g/h; 16 operações | Medido | Conferido (JPL, 06/09/2023) |
| Oxigênio respirado | 0,895 kg por pessoa por dia (cerca de 1,3 t por ano para quatro pessoas) | Medido | Conferido (BVAD, 2022); corrigido |
| Atraso de rádio Terra–Marte | Cerca de 4 a 24 minutos por trecho | Medido | Conferido (NASA); corrigido |
| Duração do sol | 24 h 39 min 35 s | Medido | Conferido |
| Gravidade em Marte | 3,73 m/s² | Medido | Conferido (Mars Fact Sheet); corrigido |
| Pouso do Perseverance | Entrada a cerca de 19.500 km/h; paraquedas perto de 11 km | Medido | Conferido (press kit); corrigido |
| Ar produzido por célula | 1 unidade de ar | Cenário | Declarado em SIM_MODEL |
| Ar gasto por expedição | 2 unidades de ar | Cenário | Declarado em SIM_MODEL |
| Tempo de colheita | 2 sóis | Simplificação | Declarado; fonte principal Veggie (33 dias na Estação) |
| Classe do evento solar → risco | Tabela de 0 a 3 | Simplificação | Declarada em SIM_MODEL §5 |

## 7. Visual e som

Decisão completa em ADR-0023 (14 de novembro de 2026).

- **Mundo ilustrado, foto real como prova.** Base, céu, horizonte, tripulação, módulos e interface são ilustração vetorial feita em código, com paleta e silhuetas tiradas das fotos reais de Jezero. A foto real aparece inteira e em destaque só nos momentos "isto é real" (fichas de dados, pontos de expedição, a Terra no céu), sempre com selo "foto real", crédito, missão e data. Uma foto real pode servir de textura de horizonte, escurecida e com degradê.
- **Edição.** Brilho, contraste e recorte são permitidos. Melhoria ou recriação por IA torna a imagem conteúdo gerado: marca-d'água visível, selo "ilustração" (nunca "foto real") e registro em AI_USAGE.
- **Linguagem visual própria:** fundo escuro com grão; uma cor quente de Marte como destaque; selos de dado em fonte monoespaçada, maiúsculas e espaçadas ("MEDIDO · DONKI · 20 MAI 2024"); números e vereditos em fonte pesada e larga, bem grandes; título "MARS TO GO" em letras de pontos, como painel de controle; Marte ou um módulo da base em malha de linhas girando devagar; linhas finas de grade entre blocos; medidores como cartões (ícone, número grande, etiqueta em pílula: crítico, apertado, seguro, folgado), nada só por cor; faixa de texto correndo para "Hoje no espaço"; idiomas em sigla no topo (PT, EN); link "pular para o conteúdo"; transições suaves entre momentos e do dia para a noite, desligadas com movimento reduzido. Fontes de licença aberta, registradas em ASSETS.
- **Para crianças:** botões de 44 px ou mais, cantos suaves, resposta visual a cada toque, um personagem simpático da tripulação, cor nos momentos de conquista. O minimalismo fica nas telas de decisão. Contraste de 4,5:1 em texto.
- **Tela inicial:** marca em texto; três entradas, "Jogar" (a carreira), "Como funciona" e "Me surpreenda"; uma palavra que alterna (hoje você é piloto, engenheira, cientista, agricultora de Marte); rodapé honesto (quem fez, uso de IA, de onde vêm os dados).
- **Abertura e gravação (depois da fase 4):** cena animada de 20 a 30 segundos, pulável, com as telas reais; gravação automática do jogo rodando para o vídeo da demo.
- Sem texto dentro de imagem. Sem logotipo, insígnia ou identificador de missão da NASA. Sem imagem de menores.
- **Som:** desligado por padrão, com botão para ligar; poucos efeitos, sempre com equivalente visual. Música só de licença livre, registrada em ASSETS; nenhuma trilha de filme.
- Toda imagem, som e fonte entra em `docs/ASSETS.md` com origem, crédito e licença.
- A lista de imagens e o fluxo de escolha estão em `docs/IMAGES.md`.

## 8. Metas de qualidade

| Diferencial | Meta |
| --- | --- |
| Mobile first | Jogável na vertical a partir de 360 px, com um polegar; alvos de 44 px |
| Acesso | Navegador, sem download, sem conta |
| Performance | Primeira tela em menos de 3 s em 4G comum |
| Offline | Depois da primeira visita, joga sem rede com o catálogo de arquivo |
| Acessibilidade | WCAG 2.2 AA nas telas de decisão; leitor de tela; movimento reduzido; modo assistido |
| Contraste | 4,5:1 em texto, 3:1 em componentes; tema de alto contraste |
| Idiomas | Português e inglês completos desde o MVP |
| Privacidade | Nenhum dado pessoal; progresso só no aparelho |

## 9. Arquitetura

```
mars-to-go/
  apps/
    web/        React + Vite + TypeScript, instalável (PWA)
    api/        TypeScript: /health e /space-weather (DONKI com cache e arquivo)
  packages/
    sim/        regras do jogo e constantes em TypeScript puro, com testes
    content/    textos em en e pt-BR; catálogo de eventos; fichas de dados; cartões de ciência
    ui/         componentes e tokens de design
  tools/
    data/       scripts Python para montar o catálogo e preparar imagens
  docs/
    en/  pt-BR/   a mesma documentação nos dois idiomas
      PROJECT_BRIEF  CHALLENGE_CHECKLIST  ARCHITECTURE  DATA_MAP  SIM_MODEL
      SCIENCE  ASSETS  AI_USAGE  IMAGES  SUBMISSION  adr/
    CHALLENGE_STATEMENT.md   texto oficial, só em inglês
  CLAUDE.md
  README.md  README.pt-BR.md
```

### Publicação

| Parte | Onde | Por quê |
| --- | --- | --- |
| Jogo (site estático) | **GitHub Pages**, endereço principal na submissão | Domínio conhecido, mesmo lugar do repositório, sem servidor para cair |
| Retrato diário do DONKI | Tarefa agendada no GitHub Actions, gravando um arquivo no site | Clima espacial recente sem depender de servidor |
| API ao vivo e espelho do jogo | **Railway**, conta pessoal | Consulta ao vivo com cache; segundo endereço se o primeiro falhar |

O Railway não é bloqueado nos Estados Unidos, mas há relatos recentes de endereços da plataforma marcados pelo filtro FortiGuard, o mesmo que o guia de submissão cita como risco para os jurados. Por isso o jogo precisa funcionar inteiro sem a API, e o endereço principal não é o do Railway.

## 10. Escopo e ordem de construção

Cada linha termina com algo jogável e publicado.

| Ordem | Entrega | Quando (sugestão) |
| --- | --- | --- |
| 0 | **Desenho e validação, antes de qualquer tela:** arquitetura com diagramas, mapa de dados, modelo da simulação. Aprovação da Rafaela | Sábado, até 13h30 (teto de 90 minutos) |
| 1 | Repositório, esqueleto, publicação (GitHub Pages e Railway), português e inglês | Sábado, começo da tarde |
| 2 | Simulação testada: 7 sóis, 10 células, ar, comida | Sábado, tarde |
| 3 | Tela do sol jogável com a "conta aberta", o diário e as fichas de dados | Sábado, fim da tarde |
| 4 | DONKI: catálogo de arquivo, rota da API, rótulos; crise de tempestade solar | Sábado, noite |
| 5 | Teste com o testador de 8 anos; ajustes | Sábado, noite |
| 6 | Escudo, expedição, perguntar à Terra, silêncio de rádio | Domingo, manhã |
| 7 | Fim da missão, jogar de novo, código da missão, a Terra no céu, insígnia, cartões de ciência (OSDR, RadLab), avatar simples | Domingo, meio do dia |
| 8 | Página "The science behind", acessibilidade, alto contraste | Domingo, começo da tarde |
| 9 | Abertura da descida | Só se houver folga |
| 10 | Vídeo com narração e código na tela, slides de apoio, página do projeto, submissão | Domingo, a partir das 17h |

Cada linha é uma fase: termina com a validação da Rafaela, um commit e uma marca no repositório.

**Congelar funções às 15h de domingo.** Submeter até as 21h e usar o resto para corrigir.

### Ordem de corte

1. Abertura da descida vira uma imagem com uma frase.
2. Modo "Hoje no espaço" sai; fica o catálogo de arquivo.
3. Crises caem para duas: tempestade solar e silêncio de rádio.
4. Avatar e exploração da base saem.
5. Expedição vira uma única opção fixa.

Não se corta: a distribuição de células com custo visível, o diário com a conta, o DONKI com rótulo, a ficha de cada dado, os dois idiomas, jogar de novo.

## 11. A história por trás

O jogo é construído por uma mãe desenvolvedora com o filho de 8 anos, fã da NASA, como primeiro testador. Ela entra no pitch em uma ou duas frases, e o teste dele é evidência de uso:

- [ ] Tempo até entender a primeira distribuição de células sem ajuda
- [ ] Onde travou e o que mudou por causa disso
- [ ] O que fez na primeira crise
- [ ] Uma frase dele, com as palavras dele: `[a preencher]`
- [ ] Pediu para jogar de novo?

Sem nome completo, rosto, voz ou imagem dele em lugar nenhum da submissão, do repositório ou do jogo.

## 12. Riscos

| Risco | Resposta |
| --- | --- |
| Escopo maior que o tempo | Ordem de construção e de corte da seção 10 |
| Parecer quiz ou painel sem jogo | Toda decisão passa pela simulação e muda os sóis seguintes |
| Recursos demais na tela | Três medidores; o resto são ações |
| DONKI fora do ar | Catálogo de arquivo embutido, rotulado |
| Dado da Estação lido como dado de Marte | Rótulo de lugar em todo valor medido |
| Link bloqueado para os jurados | Endereço principal no GitHub Pages; Railway como espelho; teste em janela anônima; pedido de classificação no FortiGuard |
| Paralelo sem base científica | Sem justificativa conferida em fonte, o dado não entra |
| Tempo demais em desenho | Teto de 90 minutos para a fase 0 |
| Estourar 30 segundos ou 7 slides | Cronometrar antes de publicar |

## 13. Referências

### Desafio e regras

- Texto do desafio: `docs/CHALLENGE_STATEMENT.md`
- Participant FAQs — https://www.spaceappschallenge.org/resources/participant-faqs/
- Team Formation Guide — https://www.spaceappschallenge.org/resources/team-formation-guide/
- Project Submission Guide — https://www.spaceappschallenge.org/resources/project-submission-guide/

### Dados indicados pelo desafio

- NASA Open APIs — https://api.nasa.gov/
- DONKI — https://ccmc.gsfc.nasa.gov/tools/DONKI/
- DONKI, referência da API — https://ccmc.gsfc.nasa.gov/DONKI/api/
- OSDR — https://osdr.nasa.gov/bio/repo/ e https://science.nasa.gov/biological-physical/data/osdr/
- OSDR, busca — https://osdr.nasa.gov/osdr/data/search?term=KEYWORD
- RadLab — https://visualization.osdr.nasa.gov/radlab/gui/data-api/
- Mars Trek — https://trek.nasa.gov/mars/
- CSA, produção de alimentos — https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/
- CSA, recursos para jovens — https://www.asc-csa.gc.ca/eng/youth-educators/resources-stem-and-youth-organizations.asp

### Outras

- MOXIE (Science Advances) — https://pmc.ncbi.nlm.nih.gov/articles/PMC9432831
- Pouso do Perseverance — https://www.nasa.gov/image-article/perseverance-heat-shield-separates-2/
- NASA Image and Video Library — https://images.nasa.gov/
- Uso de imagens da NASA — https://www.nasa.gov/nasa-brand-center/images-and-media/
- Railway, monorepos — https://docs.railway.com/deploy/monorepo
- Railway, plugin para agentes — https://github.com/railwayapp/railway-skills
- Claude Code, plugins — https://code.claude.com/docs/en/discover-plugins.md
