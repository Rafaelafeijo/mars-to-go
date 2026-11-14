# Checklist do desafio e da submissão

Conferir este arquivo **antes de planejar cada fatia e antes de cada commit que muda o jogo**. Fonte: `docs/CHALLENGE_STATEMENT.md` (texto oficial) e o Project Submission Guide de 13 de novembro de 2026. Se um item não puder ser cumprido, registrar o motivo em `docs/adr/`.

## A. A pergunta que decide tudo

> Uma criança de 7 a 12 anos sai do jogo entendendo uma restrição real de sobreviver no espaço profundo, e não só tendo se divertido?

Se a resposta para a fatia em andamento for "não", ela não está pronta.

## B. Exigências do objetivo

- [ ] **B1. É um jogo ou app interativo que funciona** (protótipo jogável, não vídeo nem slides).
- [ ] **B2. Público de 7 a 12 anos.** Texto e matemática cabem nessa faixa.
- [ ] **B3. O jogador administra um posto avançado** lunar ou marciano (o nosso: base em Jezero, Marte).
- [ ] **B4. Decisões reais sobre os cinco temas:**
  - [ ] suporte à vida
  - [ ] blindagem contra radiação
  - [ ] orçamento de energia
  - [ ] produção de alimentos
  - [ ] atraso de comunicação
- [ ] **B5. As consequências aparecem ao longo de uma missão simulada** (as escolhas de um sol afetam os seguintes).
- [ ] **B6. Nenhuma escolha é grátis.** Cada opção custa algo visível.
- [ ] **B7. A mecânica de troca fica clara** o bastante para a criança explicar com as próprias palavras ("economizei energia hoje e faltou oxigênio amanhã").
- [ ] **B8. Dados abertos reais da NASA sustentam a simulação**, no lugar de números inventados.

## C. Armadilhas que o texto manda evitar

- [ ] **C1. Não existe escolha "segura" sem custo.**
- [ ] **C2. Acabamento visual não substitui mecânica correta.** Um jogo simples que ensina uma restrição real vale mais que um bonito que não ensina.
- [ ] **C3. Dois ou três recursos centrais**, não cinco ou seis ao mesmo tempo.
- [ ] **C4. Não é abstrato demais** (fatos soltos) **nem técnico demais** para a idade.
- [ ] **C5. Não é só educativo** (perde a atenção) **nem só entretenimento** (perde a precisão).
- [ ] **C6. Dado estático nunca é apresentado como ao vivo.**

## D. Público e acesso

- [ ] **D1. Linguagem simples.** Termo científico inevitável (dose de radiação, sol, microgravidade) é explicado ali mesmo, em uma frase.
- [ ] **D2. Roda no navegador, sem download e sem conta.**
- [ ] **D3. Pode servir também a irmãos mais velhos, pais ou sala de aula** (opcional).

## E. Dados reais

- [ ] **E1. Pelo menos um dado ou recurso da NASA é usado** (condição para prêmio global).
- [ ] **E2. As fontes são creditadas dentro do jogo**, para a criança saber que é ciência real.
- [ ] **E3. Cada dado mostra se é ao vivo ou de arquivo, com a data.**
- [ ] **E4. Conjunto curado embutido como alternativa** quando a chamada ao vivo falhar.
- [ ] **E5. Fontes sugeridas pelo desafio, em ordem de prioridade para nós:**
  - [ ] DONKI (clima espacial: erupções, ejeções, partículas) — radiação e comunicação
  - [ ] RadLab / OSDR (dosimetria real na Estação Espacial) — blindagem
  - [ ] OSDR (achados reais de saúde de astronautas) — cartões de ciência
  - [ ] Mars Trek (imagem e terreno reais) — local da base
  - [ ] NASA Open APIs (chave gratuita)
  - [ ] CSA: material sobre produção de alimentos na Lua (parceiro) — só princípios gerais da estufa, sempre como paralelo declarado (ver seção K)

## F. O que faz a solução se destacar

- [ ] **F1. A escolha no jogo se liga a uma consequência do mundo real**: a decisão de blindagem usa o clima espacial real do DONKI, com a data na tela. Cadeia de queda: API ao vivo → retrato diário gravado no site → catálogo de arquivo.
- [ ] **F2. Rejogabilidade:** eventos variam a cada partida; falhar ensina e não pune.
  - [ ] Ao fim de cada missão, concluída ou não, o jogo pergunta: "Quer jogar esta missão de novo com outro plano?"
  - [ ] Depois de um retorno antecipado, oferece também "Voltar ao sol em que tudo mudou".
  - [ ] O progresso fica salvo no aparelho, sem conta. Um "código da missão" permite continuar em outro aparelho.
- [ ] **F3. Origem e viabilidade científica verificáveis em toda tela**, não só no README (ver seção J).

## G. Submissão (Project Submission Guide)

- [ ] **G1. Prazo:** "Submit for Judging" antes de domingo, 15 de novembro, 23h59, no horário local de quem criou o time (Universal Event). Salvar com frequência; só a última versão salva é julgada.
- [ ] **G2. Todos os campos obrigatórios preenchidos**, em inglês:
  - [ ] Project Name
  - [ ] High-Level Project Summary
  - [ ] Link to Project Demo
  - [ ] Link to Final Project
  - [ ] Detailed Project Description
  - [ ] Use of Super Intelligence (SI)
  - [ ] NASA Data
  - [ ] Space Agency Partner Data and Other References
- [ ] **G3. Demo:** vídeo de até 30 segundos **ou** até 7 slides (contando título e introdução). Passar do limite tira o projeto do julgamento global.
  - [ ] Formato principal: vídeo com narração e imagens do jogo rodando.
  - [ ] Slides de apoio em paralelo, ligados na descrição detalhada.
  - [ ] "Show me the code": o vídeo e os slides mostram um trecho real do código (a ficha de constantes com rótulo e um teste passando) e o endereço do repositório.
- [ ] **G4. Idioma:** página do projeto e materiais ligados em inglês (exigência do guia). Vídeo pode ser falado em outra língua, com legendas em inglês. Slides em inglês. No repositório, o inglês é o padrão e o português aparece como tradução identificada.
- [ ] **G5. Links públicos**, sem senha, permissão ou cadastro. Testar em janela anônima.
  - [ ] O link do projeto final aponta para o endereço principal do jogo (GitHub Pages); o endereço no Railway fica como espelho.
  - [ ] O jogo funciona inteiro mesmo se a API estiver inacessível.
- [ ] **G6. Slides (se for o formato):** nome do time, nomes dos membros, desafio escolhido.
- [ ] **G7. Nenhuma imagem, vídeo, áudio ou semelhança de menores de 18 anos** na demo, no projeto, no avatar ou na página do time.
- [ ] **G8. Uso de IA declarado**, dizendo onde e como. Imagem e vídeo gerados: marca-d'água visível. Áudio, código e dados gerados: declarados em texto e metadados. Nada de marca, logotipo, bandeira ou identificador de missão da NASA em conteúdo gerado.
- [ ] **G9. Tudo o que foi usado é listado** (código, texto, imagens, mesmo abertos). Material com copyright só com permissão.
- [ ] **G10. Caixas "Terms and Conditions" e "Confirm All Work is Original"** marcadas com verdade.
- [ ] **G11. Todos os membros confirmados no mesmo evento** (Universal Event).
- [ ] **G12. Site novo:** pedir classificação no FortiGuard Web Filter para reduzir risco de bloqueio na rede dos jurados (opcional, recomendado).
- [ ] **G13. Imagens na página do projeto:** JPG, PNG ou GIF de até 10 MB.

## H. Regras de participação que nos afetam

- [ ] **H1. Menor de 18 anos:** registrado por pai, mãe ou responsável e acompanhado o tempo todo.
- [ ] **H2. Menor não usa foto própria** como avatar nem na página do time. Retrato recriado por IA a partir da foto dele continua sendo a semelhança dele: usar um avatar que não o represente (foguete, rocha, planeta).
- [ ] **H3. Um time, um desafio.** No máximo seis pessoas.
- [ ] **H4. O trabalho no desafio acontece dentro do período do evento.**

## I. Critérios de julgamento

| Critério | O que defendemos | Pergunta de conferência |
| --- | --- | --- |
| Impact | Manter vivo em crianças e adolescentes o sonho de conhecer o universo profundo, treinando raciocínio lógico, matemática, física, ciências, criatividade, autonomia e coragem | A fatia desenvolve alguma dessas habilidades de forma visível? |
| Creativity | Não há resposta única: a criança vê o impacto de cada escolha; pode explorar a base e o ambiente; avatar personalizável | Existem pelo menos dois planos diferentes que funcionam? |
| Validity | Lógica científica e matemática definida e validada antes das telas; dados reais de clima espacial, terreno e ambiente | Cada número tem ficha completa (seção J) e cada conta tem teste? |
| Relevance | Os cinco temas do desafio jogáveis; adesão item a item a este checklist | Os itens B1 a B8 estão todos marcados? |
| Presentation | Linguagem inspiradora e impacto real na formação de crianças, junto com a prova de adesão aos requisitos, do uso de dados e do método | A página do projeto e a demo mostram o jogo, os dados e o código? |

A maior parte da avaliação vem da página do projeto; a demo pesa no critério Presentation.

## J. Visibilidade dos dados, sempre

Todo dado que aparece no jogo responde a três perguntas, na própria tela: **de onde veio, como foi tratado e como o jogo usa.**

- [ ] **J1. Selo de origem em todo número**: rótulo (medido, cenário, simplificação), fonte, lugar e data.
- [ ] **J2. Um toque abre a ficha do dado** com:
  - [ ] Fonte, com link e identificador do registro original
  - [ ] Onde e quando foi medido
  - [ ] Como foi tratado (filtrado, arredondado, convertido, agrupado)
  - [ ] Como o jogo usa (qual regra, qual conta)
  - [ ] O que foi simplificado e por quê
- [ ] **J3. "Quero entender melhor"**: explicação mais longa, em linguagem de criança, com um exemplo prático do dia a dia (bateria do celular, mesada, garrafa de água, protetor solar) e onde isso se aplica fora do jogo.
- [ ] **J4. Mesma informação para os jurados**: página "A ciência por trás" e um arquivo público com todas as fichas, gerados do mesmo lugar que alimenta as telas.
- [ ] **J5. Nenhuma tela mostra dado sem ficha.** Dado novo só entra depois de a ficha estar completa.
- [ ] **J6. Validação antes das telas**: o mapa de dados e o modelo da simulação são revisados e aprovados antes de qualquer interface que dependa deles.

## K. Marte de verdade e paralelos declarados

O jogo se passa em Marte. Dado que não foi medido em Marte só entra como paralelo, e o paralelo aparece sempre.

- [ ] **K1. Todo dado traz o lugar da medição** (Marte, Estação Espacial, Sol, Terra, Lua).
- [ ] **K2. Paralelo declarado na ficha**: por que serve para a base marciana e o que é diferente em Marte.
- [ ] **K3. Paralelo só entra com justificativa científica** registrada em `docs/SCIENCE.md`, com fonte. Sem justificativa, o dado fica de fora.
- [ ] **K4. Material lunar da CSA**: usar apenas princípios gerais de cultivo em ambiente fechado. Não usar números lunares como se fossem marcianos.
- [ ] **K5. Os desafios próprios de Marte aparecem no jogo**, cada um com fonte conferida: atmosfera rarefeita de CO₂, menos luz solar que na Terra, tempestades de poeira, frio, solo que não serve direto para plantio, gravidade menor, atraso de rádio.
- [ ] **K6. Evento solar não é dose em Marte**: o DONKI registra o que saiu do Sol; se o evento atinge Marte depende da direção. O jogo diz isso.

## L. Idiomas

- [ ] **L1. O jogo é bilíngue desde o MVP**: português (idioma de criação) e inglês (universal).
- [ ] **L2. Código em inglês**: nomes, comentários, mensagens de commit.
- [ ] **L3. Documentação bilíngue**: `docs/en/` e `docs/pt-BR/`, com o inglês como padrão.
- [ ] **L4. README em inglês**, com `README.pt-BR.md` ao lado.
- [ ] **L5. Página do projeto, demo e slides em inglês.**
