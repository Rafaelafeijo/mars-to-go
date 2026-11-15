/**
 * Data cards (ADR-0014, CLAUDE.md rule 16). One source for screens, the science page
 * and the public JSON. Numbers come from packages/sim science.ts by id, so a card and
 * the number it explains cannot drift. A card with status 'pending' is hidden (ADR-0024).
 */
import type { Place, ScienceId, ScienceLabel } from '@mars-to-go/sim';

export interface CardText {
  /** Short title, ≤ 5 words. */
  title: string;
  /** One sentence: what this is. */
  what: string;
  /** How it was treated: filtered, rounded, converted, grouped. */
  processing: string;
  /** Which rule or math it feeds in the game. */
  gameUse: string;
  /** What was simplified, and why. */
  simplified: string;
  /** Only when not measured on Mars: why it works for Mars, and what differs there. */
  parallel?: string;
  /** "I want to understand more": kid language, an everyday example, where it applies outside the game. */
  learnMore: string;
}

export interface CardPhoto {
  /** File slug in apps/web/public/images (<slug>-{480,960,1600}.webp). */
  slug: string;
  credit: string;
  mission: string;
  date: string;
  place: Place;
  enhancedColor: boolean;
  sourceUrl: string;
  recordId: string;
}

export interface DataCard {
  id: string;
  /** The label of the number the child sees. */
  label: ScienceLabel;
  place: Place;
  /** Date shown on the badge: ISO date of the measurement or event; null for game rules. */
  date: string | null;
  /** Short source for the badge, e.g. "DONKI", "NASA/JPL", "Game rule". */
  badgeSource: string;
  sourceName: string;
  sourceUrl: string;
  recordId: string | null;
  /** Game numbers this card explains (from science.ts). */
  numbers: ScienceId[];
  /** Measured facts behind it (from science.ts), listed with their own sources. */
  facts: ScienceId[];
  photo?: CardPhoto;
  status: 'complete' | 'pending';
  text: { en: CardText; 'pt-BR': CardText };
}

const SIM_MODEL = 'https://github.com/Rafaelafeijo/mars-to-go/blob/main/docs/en/SIM_MODEL.md';

export const CARDS: DataCard[] = [
  {
    id: 'cells',
    label: 'scenario',
    place: 'game',
    date: null,
    badgeSource: 'Game rule',
    sourceName: 'Mars to Go game rule (SIM_MODEL §2)',
    sourceUrl: `${SIM_MODEL}#2-constants`,
    recordId: null,
    numbers: ['CELLS_PER_SOL'],
    facts: ['MARS_SUNLIGHT_RATIO_TO_EARTH', 'MARS_SOLAR_IRRADIANCE'],
    status: 'complete',
    text: {
      en: {
        title: '10 power cells a sol',
        what: 'Each sol the base gets 10 power cells from its solar panels.',
        processing: 'The number 10 is chosen for the game. The real fact behind it: sunlight on Mars is about 43% of what reaches Earth.',
        gameUse: 'Every decision spends cells from the same 10. Three always go to heating, so you place 7.',
        simplified: 'Real bases measure power in watts and store it in batteries. Here a cell is used the same sol or lost.',
        learnMore:
          'Think of a phone battery that charges only with sunlight, and Mars gives it less than half the light we get on Earth. So every bit of power must be planned. Families do the same with a monthly allowance: you cannot spend the same coin twice.',
      },
      'pt-BR': {
        title: '10 células por sol',
        what: 'A cada sol a base recebe 10 células de energia dos painéis solares.',
        processing: 'O número 10 foi escolhido para o jogo. O fato real por trás: a luz do Sol em Marte é cerca de 43% da que chega à Terra.',
        gameUse: 'Toda decisão gasta células das mesmas 10. Três vão sempre para o aquecimento, então você distribui 7.',
        simplified: 'Bases de verdade medem energia em watts e guardam em baterias. Aqui a célula é usada no mesmo sol ou se perde.',
        learnMore:
          'Pense numa bateria de celular que só carrega com luz do Sol, e Marte dá menos da metade da luz que recebemos na Terra. Por isso cada pedacinho de energia precisa ser planejado. É como a mesada: a mesma moeda não pode ser gasta duas vezes.',
      },
    },
  },
  {
    id: 'lifeSupport',
    label: 'scenario',
    place: 'game',
    date: null,
    badgeSource: 'Game rule',
    sourceName: 'Mars to Go game rule (SIM_MODEL §2), based on MOXIE results (NASA/JPL)',
    sourceUrl: `${SIM_MODEL}#2-constants`,
    recordId: null,
    numbers: ['AIR_PER_LIFE_SUPPORT_CELL'],
    facts: ['MOXIE_TOTAL_O2_G', 'MOXIE_MAX_RATE_G_PER_H', 'MOXIE_RUNS', 'MARS_CO2_PERCENT'],
    photo: {
      slug: 'moxie',
      credit: 'NASA/JPL-Caltech',
      mission: 'Mars 2020 · MOXIE',
      date: '2021-01-19',
      place: 'Earth',
      enhancedColor: false,
      sourceUrl: 'https://science.nasa.gov/photojournal/moxie-all-tucked-in',
      recordId: 'PIA24203',
    },
    status: 'complete',
    text: {
      en: {
        title: 'Making air from Mars air',
        what: 'Life Support turns power into oxygen for the crew: 1 cell makes 1 unit of air tonight.',
        processing: 'The rate is a game value. The real proof: MOXIE, on the rover Perseverance in Jezero, made 122 g of oxygen from Mars air in 16 runs.',
        gameUse: 'Air goes up by 1 for each cell in Life Support, before the crew breathes at night.',
        simplified: "MOXIE's best rate is not something a machine keeps up all the time. Our base's machine is imagined, bigger, and steady.",
        learnMore:
          "Mars air is almost all carbon dioxide, the gas we breathe out. A machine can split it and keep the oxygen, but that takes power, like a blender that only works plugged in. MOXIE, a machine the size of a toaster, did it on Mars: enough oxygen for a small dog for about 10 hours. The photo shows MOXIE on Earth, before launch.",
      },
      'pt-BR': {
        title: 'Fazer ar com o ar de Marte',
        what: 'O Suporte à Vida transforma energia em oxigênio para a tripulação: 1 célula faz 1 unidade de ar nesta noite.',
        processing: 'A taxa é um valor do jogo. A prova real: o MOXIE, no rover Perseverance em Jezero, fez 122 g de oxigênio com o ar de Marte em 16 operações.',
        gameUse: 'O ar sobe 1 para cada célula no Suporte à Vida, antes de a tripulação respirar à noite.',
        simplified: 'A melhor taxa do MOXIE não é algo que uma máquina mantém o tempo todo. A máquina da nossa base é imaginada, maior e constante.',
        learnMore:
          'O ar de Marte é quase todo gás carbônico, o gás que a gente solta ao respirar. Uma máquina consegue separar e guardar o oxigênio, mas isso gasta energia, como um liquidificador que só funciona na tomada. O MOXIE, do tamanho de uma torradeira, fez isso em Marte: oxigênio para um cachorro pequeno por cerca de 10 horas. A foto mostra o MOXIE na Terra, antes do lançamento.',
      },
    },
  },
  {
    id: 'heating',
    label: 'scenario',
    place: 'game',
    date: null,
    badgeSource: 'Game rule',
    sourceName: 'Mars to Go game rule (SIM_MODEL §2), based on the NASA Mars Fact Sheet',
    sourceUrl: `${SIM_MODEL}#2-constants`,
    recordId: null,
    numbers: ['HEATING_CELLS'],
    facts: ['MARS_AVG_TEMP_C'],
    status: 'complete',
    text: {
      en: {
        title: 'Heating: 3 cells, always',
        what: 'Every sol, 3 of the base\'s power cells go to heating, before you place any.',
        processing: 'The number 3 is chosen for the game. The real fact behind it: the average temperature on Mars is about −59 °C.',
        gameUse: 'Heating is fixed: free cells = the sol\'s cells − 3. That leaves 7 on a normal sol and 3 on a dust sol.',
        simplified: 'A real habitat needs more heat at night and less by day. Here heating costs the same every sol, so you can focus on the other choices.',
        learnMore:
          'Mars is colder than any freezer at home: in one day it can go from about −89 °C to −31 °C. Heating is like rent in a family budget: it is paid first, and you plan with what is left. Homes in very cold places on Earth do the same in winter.',
      },
      'pt-BR': {
        title: 'Aquecimento: 3 células, sempre',
        what: 'A cada sol, 3 das células de energia da base vão para o aquecimento, antes de você distribuir qualquer uma.',
        processing: 'O número 3 foi escolhido para o jogo. O fato real por trás: a temperatura média em Marte é de cerca de −59 °C.',
        gameUse: 'O aquecimento é fixo: células livres = células do sol − 3. Sobram 7 num sol normal e 3 num sol de poeira.',
        simplified: 'Um habitat de verdade precisa de mais calor à noite e menos de dia. Aqui o aquecimento custa o mesmo todo sol, para você focar nas outras escolhas.',
        learnMore:
          'Marte é mais frio que qualquer freezer de casa: num só dia pode ir de cerca de −89 °C a −31 °C. O aquecimento é como o aluguel no orçamento da família: é pago primeiro, e você planeja com o que sobra. Casas em lugares muito frios da Terra fazem o mesmo no inverno.',
      },
    },
  },
  {
    id: 'dust',
    label: 'scenario',
    place: 'game',
    date: null,
    badgeSource: 'Game rule',
    sourceName: 'Mars to Go game rule (SIM_MODEL §2), based on NASA Science, "On Mars, Light Is Energy" (2018-06-13)',
    sourceUrl: `${SIM_MODEL}#2-constants`,
    recordId: null,
    numbers: ['CELLS_DUST_SOL'],
    facts: ['DUST_TAU_2018', 'OPPORTUNITY_ENERGY_WH_2018'],
    status: 'complete',
    text: {
      en: {
        title: 'Dust: only 6 cells',
        what: 'On a dust sol the solar panels make only 6 cells instead of 10.',
        processing: 'The number 6 is chosen for the game. The real fact: on June 10, 2018, a dust storm made the sky reach a tau of 10.5, and the rover Opportunity got only 21 Wh of energy, its lowest ever.',
        gameUse: 'Heating still takes 3, so only 3 cells are free that sol. A dust crisis can drop the cells to 6 after you placed them, and you must remove 4.',
        simplified: 'A real storm can last for weeks and dims the sky slowly. Here dust comes one sol at a time, and the drop is always the same.',
        learnMore:
          'Tau is a number for how much dust blocks the sky: the bigger it is, the darker the day. A watt-hour (Wh) is a way to measure an amount of energy. It is like a solar calculator in the shade: no light, no power. Opportunity got so little power that it went to sleep. On Earth, solar panels on roofs also make less on cloudy days.',
      },
      'pt-BR': {
        title: 'Poeira: só 6 células',
        what: 'Num sol de poeira os painéis solares fazem só 6 células em vez de 10.',
        processing: 'O número 6 foi escolhido para o jogo. O fato real: em 10 de junho de 2018, uma tempestade de poeira fez o céu chegar a um tau de 10,5, e o rover Opportunity recebeu só 21 Wh de energia, o menor valor da sua história.',
        gameUse: 'O aquecimento continua levando 3, então só 3 células ficam livres nesse sol. Uma crise de poeira pode baixar as células para 6 depois que você já distribuiu, e você precisa tirar 4.',
        simplified: 'Uma tempestade de verdade pode durar semanas e escurece o céu aos poucos. Aqui a poeira vem um sol de cada vez, e a queda é sempre a mesma.',
        learnMore:
          'Tau é um número que diz quanto a poeira tapa o céu: quanto maior, mais escuro o dia. Um watt-hora (Wh) é um jeito de medir uma quantidade de energia. É como uma calculadora solar na sombra: sem luz, sem energia. O Opportunity recebeu tão pouca energia que entrou em modo de sono. Na Terra, painéis solares nos telhados também produzem menos em dias nublados.',
      },
    },
  },
  {
    id: 'air',
    label: 'scenario',
    place: 'game',
    date: null,
    badgeSource: 'Game rule',
    sourceName: 'Mars to Go game rule (SIM_MODEL §2), based on NASA BVAD (NASA/TP-2015-218570/REV2)',
    sourceUrl: `${SIM_MODEL}#2-constants`,
    recordId: null,
    numbers: ['AIR_START', 'AIR_USE_PER_SOL'],
    facts: ['CREW_O2_KG_PER_DAY', 'MARS_CO2_PERCENT'],
    status: 'complete',
    text: {
      en: {
        title: 'Air for the crew',
        what: 'The base starts with 10 units of air, and the crew of 4 breathes 5 units every sol.',
        processing: 'Air units are game units, not kilograms. The real fact behind them: each crew member uses about 0.895 kg of oxygen a day (NASA).',
        gameUse: 'At night, air goes up with Life Support, then the crew breathes 5. If air drops below 0, the crew returns early.',
        simplified: 'Real crews count kilograms of oxygen and keep spare tanks. Here air is a few round units so the math fits in your head: 10 units last only 2 sols without Life Support.',
        learnMore:
          'Mars air is 95.1% carbon dioxide, so nobody can breathe it: every breath must be brought or made. Each astronaut breathes almost 1 kg of oxygen a day, about the weight of a big bottle of water; for our crew over 7 sols that is about 25 kg. It is like water on a hike: you carry some, and you need a spring on the way. Submarines and space stations also make their own air.',
      },
      'pt-BR': {
        title: 'Ar para a tripulação',
        what: 'A base começa com 10 unidades de ar, e a tripulação de 4 pessoas respira 5 unidades a cada sol.',
        processing: 'Unidades de ar são unidades do jogo, não quilos. O fato real por trás: cada tripulante usa cerca de 0,895 kg de oxigênio por dia (NASA).',
        gameUse: 'À noite, o ar sobe com o Suporte à Vida, depois a tripulação respira 5. Se o ar ficar abaixo de 0, a tripulação volta mais cedo.',
        simplified: 'Tripulações de verdade contam quilos de oxigênio e levam tanques reserva. Aqui o ar é poucas unidades redondas para a conta caber na cabeça: 10 unidades duram só 2 sóis sem Suporte à Vida.',
        learnMore:
          'O ar de Marte tem 95,1% de gás carbônico, então ninguém consegue respirá-lo: cada respiração precisa ser trazida ou fabricada. Cada astronauta respira quase 1 kg de oxigênio por dia, mais ou menos o peso de uma garrafa grande de água; para a nossa tripulação em 7 sóis, são cerca de 25 kg. É como a água numa trilha: você leva um pouco e precisa de uma fonte no caminho. Submarinos e estações espaciais também fabricam o próprio ar.',
      },
    },
  },
  {
    id: 'food',
    label: 'scenario',
    place: 'game',
    date: null,
    badgeSource: 'Game rule',
    sourceName: 'Mars to Go game rule (SIM_MODEL §2)',
    sourceUrl: `${SIM_MODEL}#2-constants`,
    recordId: null,
    numbers: ['FOOD_START', 'FOOD_USE_PER_SOL'],
    facts: [],
    status: 'complete',
    text: {
      en: {
        title: 'Food from Earth',
        what: 'The base starts with 6 units of food, and the crew eats 2 units every sol.',
        processing: 'Both numbers are chosen for the game. Food units are game units, not kilograms or meals.',
        gameUse: 'At night, after the harvest, the crew eats 2. Without the greenhouse, 6 units last only 3 sols. If food drops below 0, the crew returns early.',
        simplified: 'Real crews plan every meal. Here food is one simple number, so you can see when it will run out.',
        learnMore:
          'Food from Earth is like a lunchbox on a long trip: once it is empty, there is no shop on the way. That is why the greenhouse matters, even if it pays late. Ships, research stations and space missions all plan food this way: count what you have, and count how fast it goes.',
      },
      'pt-BR': {
        title: 'Comida da Terra',
        what: 'A base começa com 6 unidades de comida, e a tripulação come 2 unidades a cada sol.',
        processing: 'Os dois números foram escolhidos para o jogo. Unidades de comida são unidades do jogo, não quilos nem refeições.',
        gameUse: 'À noite, depois da colheita, a tripulação come 2. Sem a estufa, 6 unidades duram só 3 sóis. Se a comida ficar abaixo de 0, a tripulação volta mais cedo.',
        simplified: 'Tripulações de verdade planejam cada refeição. Aqui a comida é um número simples, para você ver quando ela vai acabar.',
        learnMore:
          'A comida da Terra é como a lancheira numa viagem longa: quando acaba, não tem lanchonete no caminho. Por isso a estufa importa, mesmo pagando tarde. Navios, estações de pesquisa e missões espaciais planejam a comida assim: contar o que se tem e contar a rapidez com que acaba.',
      },
    },
  },
  {
    id: 'greenhouse',
    label: 'simplification',
    place: 'game',
    date: null,
    badgeSource: 'Game rule',
    sourceName: 'Mars to Go game rule (SIM_MODEL §2), based on the NASA Veggie fact sheet (VEG-01, ISS)',
    sourceUrl: `${SIM_MODEL}#2-constants`,
    recordId: null,
    numbers: ['FOOD_PER_GREENHOUSE_CELL', 'GREENHOUSE_DELAY_SOLS'],
    facts: ['VEGGIE_LETTUCE_DAYS'],
    photo: {
      slug: 'iss-lettuce',
      credit: 'NASA',
      mission: 'ISS · Advanced Plant Habitat (Plant Habitat-07)',
      date: '2024-12-27',
      place: 'ISS',
      enhancedColor: false,
      sourceUrl: 'https://images.nasa.gov/details/iss072e404269',
      recordId: 'iss072e404269',
    },
    status: 'complete',
    text: {
      en: {
        title: 'Plant today, eat later',
        what: 'Each cell in the Greenhouse plants 2 units of food, ready 2 sols later.',
        processing: 'The 2-sol wait is squeezed so you can see it in a 7-sol mission. The real fact: on the ISS, red romaine lettuce grew for 33 days in NASA\'s Veggie chamber.',
        gameUse: 'Plant tonight, harvest on the night 2 sols later. Plantings on sols 6 and 7 never pay inside the mission.',
        simplified: 'Real crops take weeks, not 2 sols. We kept the rule that matters: plant today, eat later.',
        parallel:
          'Measured on the ISS, not on Mars. It works for Mars because both are closed chambers with lamps, water and controlled air, far from Earth. On Mars it differs: sunlight is about 43% of Earth\'s, gravity is 0.38 of Earth\'s (not floating like on the ISS), and the soil has perchlorate salts, harmful to most life (NASA).',
        learnMore:
          'A greenhouse is a closed room where plants get light, water and warm air. It is like a piggy bank: what you put in today comes back later, a bit bigger. Farmers on Earth also plant weeks before they harvest, and some farms grow lettuce indoors under lamps. The photo shows plants growing on the ISS in 2024, in a chamber called the Advanced Plant Habitat.',
      },
      'pt-BR': {
        title: 'Plantar hoje, comer depois',
        what: 'Cada célula na Estufa planta 2 unidades de comida, prontas 2 sóis depois.',
        processing: 'A espera de 2 sóis foi encurtada para você vê-la numa missão de 7 sóis. O fato real: na ISS, uma alface romana roxa cresceu por 33 dias na câmara Veggie da NASA.',
        gameUse: 'Plante nesta noite, colha na noite de 2 sóis depois. O que for plantado nos sóis 6 e 7 nunca dá colheita dentro da missão.',
        simplified: 'Plantas de verdade levam semanas, não 2 sóis. Mantivemos a regra que importa: plantar hoje, comer depois.',
        parallel:
          'Medido na ISS, não em Marte. Serve para Marte porque as duas são câmaras fechadas com lâmpadas, água e ar controlado, longe da Terra. Em Marte é diferente: a luz do Sol é cerca de 43% da que chega à Terra, a gravidade é 0,38 da da Terra (não se flutua como na ISS), e o solo tem sais de perclorato, que fazem mal à maioria dos seres vivos (NASA).',
        learnMore:
          'Uma estufa é uma sala fechada onde as plantas recebem luz, água e ar quentinho. É como um cofrinho: o que você guarda hoje volta depois, um pouco maior. Agricultores na Terra também plantam semanas antes de colher, e algumas fazendas cultivam alface dentro de prédios, sob lâmpadas. A foto mostra plantas crescendo na ISS em 2024, numa câmara chamada Advanced Plant Habitat.',
      },
    },
  },
  {
    id: 'shield',
    label: 'simplification',
    place: 'game',
    date: null,
    badgeSource: 'Game rule',
    sourceName: 'Mars to Go game rule (SIM_MODEL §2, §4), based on NASA PIA17600 "Radiation Measurements on Mars" (2013-12-09)',
    sourceUrl: `${SIM_MODEL}#2-constants`,
    recordId: null,
    numbers: ['SHIELD_BLOCK_PER_CELL'],
    facts: ['MARS_BACKGROUND_DOSE_UGY_PER_DAY'],
    status: 'complete',
    text: {
      en: {
        title: 'The radiation shield',
        what: 'Each cell in the Shield blocks 1 point of radiation risk tonight.',
        processing: 'The rule is a game value. The real fact: even on calm days, the rover Curiosity measured about 210 micrograys of radiation a day in Gale Crater. That number is not in any game formula.',
        gameUse: 'If the event really reaches Mars, exposure goes up by risk minus shield, never below 0. A shield cell is spent even if the event does not reach Mars.',
        simplified: 'Real shielding is walls, water and soil, and it does not cut risk in neat steps. Exposure is a word (low, medium, high), never a dose.',
        learnMore:
          'Radiation here means tiny, very fast bits from space. A microgray is a unit scientists use for how much radiation a body takes in. Earth has an invisible bubble, its magnetic field, that blocks many of them; Mars lost its bubble. The shield is like sunscreen: you put it on before going out, even if clouds come and you did not need it. At the dentist, the heavy apron you wear for an X-ray is a shield too.',
      },
      'pt-BR': {
        title: 'O escudo contra radiação',
        what: 'Cada célula no Escudo bloqueia 1 ponto de risco de radiação nesta noite.',
        processing: 'A regra é um valor do jogo. O fato real: mesmo em dias calmos, o rover Curiosity mediu cerca de 210 micrograys de radiação por dia na Cratera Gale. Esse número não entra em nenhuma conta do jogo.',
        gameUse: 'Se o evento chega mesmo a Marte, a exposição sobe o risco menos o escudo, nunca abaixo de 0. A célula do escudo é gasta mesmo que o evento não chegue a Marte.',
        simplified: 'Proteção de verdade é feita de paredes, água e solo, e não corta o risco em degraus certinhos. Exposição é uma palavra (baixa, média, alta), nunca uma dose.',
        learnMore:
          'Radiação aqui quer dizer pedacinhos minúsculos e muito rápidos vindos do espaço. Microgray é uma unidade que os cientistas usam para dizer quanta radiação um corpo recebe. A Terra tem uma bolha invisível, o campo magnético, que bloqueia boa parte deles; Marte perdeu a sua bolha. O escudo é como o protetor solar: você passa antes de sair, mesmo que o tempo feche e você nem precise. No dentista, o avental pesado que você usa no raio X também é um escudo.',
      },
    },
  },
  {
    id: 'exposure',
    label: 'simplification',
    place: 'game',
    date: null,
    badgeSource: 'Game rule',
    sourceName: 'Mars to Go game rule (SIM_MODEL §2, §7)',
    sourceUrl: `${SIM_MODEL}#7-end-conditions`,
    recordId: null,
    numbers: ['EXPOSURE_LOW_MAX', 'EXPOSURE_MEDIUM_MAX', 'DOSE_LIMIT'],
    facts: [],
    status: 'complete',
    text: {
      en: {
        title: 'Radiation dose and its limit',
        what: 'The dose counts how much radiation the crew took during the mission. It has a limit of 2 points: above it, the mission doctor sends the crew home.',
        processing: 'The game counts points: 0 to 1 is low, 2 is medium (the limit), above 2 is high and ends the mission. The real fact behind the idea: NASA limits each astronaut\'s radiation over a whole career to 600 millisieverts (NASA-STD-3001, Volume 1, section 4.8.2), so that the extra cancer risk stays below 3%.',
        gameUse: 'Points come from radiation that gets past the shield and from rover trips (1 each). Over the limit: early return, and mission 2 stays locked until you finish this mission within the limit.',
        simplified: 'Game points are not millisieverts: no real dose is computed. A real limit covers a whole career, not one week.',
        learnMore:
          'A millisievert is a unit for how much radiation harms a body. Think of a day at the beach: the sun is fine for a while, but there is a point where you must go inside, or you get burned. Space agencies set that point for astronauts with real measurements; our game uses the same idea with small numbers.',
      },
      'pt-BR': {
        title: 'Dose de radiação e o seu limite',
        what: 'A dose conta quanta radiação a tripulação recebeu na missão. Ela tem um limite de 2 pontos: acima dele, o médico da missão manda a tripulação para casa.',
        processing: 'O jogo conta pontos: de 0 a 1 é baixa, 2 é média (o limite), acima de 2 é alta e encerra a missão. O fato real por trás da ideia: a NASA limita a radiação de cada astronauta na carreira inteira a 600 milisieverts (NASA-STD-3001, Volume 1, seção 4.8.2), para que o risco extra de câncer fique abaixo de 3%.',
        gameUse: 'Os pontos vêm da radiação que passa pelo escudo e das saídas do rover (1 cada). Acima do limite: retorno antecipado, e a missão 2 fica bloqueada até você terminar esta missão dentro do limite.',
        simplified: 'Pontos do jogo não são milisieverts: nenhuma dose real é calculada. Um limite de verdade vale para a carreira inteira, não para uma semana.',
        learnMore:
          'Milisievert é uma unidade para dizer quanto a radiação faz mal ao corpo. Pense num dia de praia: o sol faz bem por um tempo, mas há uma hora em que é preciso entrar, senão você se queima. As agências espaciais definem essa hora para os astronautas com medições de verdade; nosso jogo usa a mesma ideia com números pequenos.',
      },
    },
  },
  {
    id: 'radiationDamage',
    label: 'simplification',
    place: 'game',
    date: null,
    badgeSource: 'Game rule',
    sourceName: 'NASA Scientific Visualization Studio 31248 (solar energetic particles and spacecraft)',
    sourceUrl: 'https://svs.gsfc.nasa.gov/31248',
    recordId: null,
    numbers: ['RADIATION_DAMAGE_CELLS_PER_POINT', 'RADIATION_DAMAGE_MAX_CELLS'],
    facts: [],
    status: 'complete',
    text: {
      en: {
        title: 'Radiation damages machines',
        what: 'When radiation gets past the shield, it also damages the base\'s electronics: 1 cell fewer the next sol for each point that got through, at most 2.',
        processing: 'The real fact: NASA explains that energetic particles from solar events can "damage critical electronics" and "degrade solar arrays" on spacecraft. The numbers 1 and 2 are game values.',
        gameUse: 'The lost cells show in red in the cell bar and in the forecast at the start of the next sol. They come back the sol after.',
        simplified: 'Real damage can last longer or be repaired; it is not 1 cell per point. The rule only shows that radiation hurts machines too, not only people.',
        learnMore:
          'Electronics are tiny paths that carry electricity; a fast particle can cut or confuse them, like a stone hitting a window. Satellites around Earth are built with metal layers to slow particles down, and sometimes they still need a restart after a solar storm.',
      },
      'pt-BR': {
        title: 'A radiação estraga as máquinas',
        what: 'Quando a radiação passa pelo escudo, ela também danifica os eletrônicos da base: 1 célula a menos no sol seguinte para cada ponto que passou, no máximo 2.',
        processing: 'O fato real: a NASA explica que partículas energéticas de eventos solares podem "danificar eletrônicos essenciais" e "degradar painéis solares" das naves. Os números 1 e 2 são valores do jogo.',
        gameUse: 'As células perdidas aparecem em vermelho na barra de células e na previsão do início do sol seguinte. Elas voltam no sol depois.',
        simplified: 'Um dano real pode durar mais ou ser consertado; não é 1 célula por ponto. A regra só mostra que a radiação faz mal às máquinas também, não só às pessoas.',
        learnMore:
          'Eletrônicos são caminhos minúsculos que levam eletricidade; uma partícula rápida pode cortar ou confundir esses caminhos, como uma pedra batendo numa janela. Os satélites em volta da Terra têm camadas de metal para frear as partículas e, mesmo assim, às vezes precisam ser reiniciados depois de uma tempestade solar.',
      },
    },
  },
  {
    id: 'samples',
    label: 'scenario',
    place: 'game',
    date: null,
    badgeSource: 'Game rule',
    sourceName: 'NASA Science, Mars Rock Samples (Perseverance)',
    sourceUrl: 'https://science.nasa.gov/mission/mars-2020-perseverance/mars-rock-samples/',
    recordId: null,
    numbers: ['SAMPLES_GOAL'],
    facts: [],
    status: 'complete',
    text: {
      en: {
        title: 'Rock samples for Earth',
        what: 'A successful mission brings at least 1 rock sample home. Only the rover can collect it.',
        processing: 'The real fact: the rover Perseverance drills rock cores in Jezero Crater and seals them in tubes; it carried 43 tubes, 38 of them for samples, so that a future mission can bring them to Earth.',
        gameUse: 'Each rover trip brings 1 sample from a real Jezero site. It costs 2 cells, 2 air (space suits) and 1 radiation point.',
        simplified: 'In the game the crew carries the sample on its own rocket; for Perseverance, the return to Earth is a separate future mission.',
        learnMore:
          'A rock core is a small cylinder of rock, like the piece you get when you push a straw into a cake. Scientists on Earth have better machines than any rover, so they want the rocks here to look for signs of ancient life.',
      },
      'pt-BR': {
        title: 'Amostras de rocha para a Terra',
        what: 'Uma missão bem-sucedida leva pelo menos 1 amostra de rocha para casa. Só o rover consegue coletar.',
        processing: 'O fato real: o rover Perseverance perfura núcleos de rocha na Cratera Jezero e os fecha em tubos; ele levou 43 tubos, 38 deles para amostras, para que uma missão futura as traga para a Terra.',
        gameUse: 'Cada saída do rover traz 1 amostra de um lugar real de Jezero. Custa 2 células, 2 de ar (trajes espaciais) e 1 ponto de radiação.',
        simplified: 'No jogo a tripulação leva a amostra no próprio foguete; no caso do Perseverance, a volta para a Terra é outra missão, no futuro.',
        learnMore:
          'Um núcleo de rocha é um pequeno cilindro de rocha, como o pedaço que sai quando você enfia um canudo num bolo. Os cientistas na Terra têm máquinas melhores que as de qualquer rover, então querem as rochas aqui para procurar sinais de vida antiga.',
      },
    },
  },
  {
    id: 'riskTable',
    label: 'simplification',
    place: 'game',
    date: null,
    badgeSource: 'Game rule',
    sourceName: 'NASA/JPL, "NASA Watches Mars Light Up During Epic Solar Storm" (2024-06-10)',
    sourceUrl: 'https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/',
    recordId: null,
    numbers: [],
    facts: [],
    status: 'complete',
    text: {
      en: {
        title: 'From Sun event to risk',
        what: 'Each real event from the Sun becomes a risk number from 0 to 3, so you can plan.',
        processing: 'No event or a C flare → 0. An M flare → 1. An X flare, or a CME that NASA\'s WSA-ENLIL model forecasts will arrive at Mars → 2. A particle event measured at Mars → 3.',
        gameUse: 'The risk shows in the forecast of each sol. At night, if the event reaches Mars, exposure goes up by risk minus shield.',
        simplified: 'Real scientists use much more detail, and a risk number is not a dose. NASA explains why the top level needs proof at Mars: the flare\'s light arrives first, the particles follow in tens of minutes, and "Only the most energetic can reach the surface to be measured by RAD."',
        learnMore:
          'A flare is a giant flash on the Sun; a CME is a cloud of particles the Sun throws into space. WSA-ENLIL is a NASA computer model that guesses where that cloud will go, and RAD is an instrument on the rover Curiosity that measures radiation. The table is like a rain forecast with levels: none, light, medium, storm. Weather services on Earth also turn lots of data into simple alert levels.',
      },
      'pt-BR': {
        title: 'Do evento solar ao risco',
        what: 'Cada evento real do Sol vira um número de risco de 0 a 3, para você poder planejar.',
        processing: 'Nenhum evento ou erupção C → 0. Erupção M → 1. Erupção X, ou uma CME que o modelo WSA-ENLIL da NASA prevê que chegará a Marte → 2. Evento de partículas medido em Marte → 3.',
        gameUse: 'O risco aparece na previsão de cada sol. À noite, se o evento chega a Marte, a exposição sobe o risco menos o escudo.',
        simplified: 'Cientistas de verdade usam muito mais detalhes, e um número de risco não é uma dose. A NASA explica por que o nível mais alto precisa de prova em Marte: a luz da erupção chega primeiro, as partículas vêm dezenas de minutos depois, e só as mais energéticas conseguem chegar ao solo para serem medidas pelo RAD.',
        learnMore:
          'Uma erupção solar é um clarão gigante no Sol; uma CME é uma nuvem de partículas que o Sol joga no espaço. O WSA-ENLIL é um modelo de computador da NASA que tenta adivinhar para onde essa nuvem vai, e o RAD é um instrumento do rover Curiosity que mede radiação. A tabela é como uma previsão de chuva por níveis: nada, fraca, média, tempestade. Os serviços de meteorologia na Terra também transformam muitos dados em níveis simples de alerta.',
      },
    },
  },
  {
    id: 'expedition',
    label: 'scenario',
    place: 'game',
    date: null,
    badgeSource: 'Game rule',
    sourceName: 'Mars to Go game rule (SIM_MODEL §2); delta distance from NASA/JPL PIA24485 (2021-03-05)',
    sourceUrl: `${SIM_MODEL}#2-constants`,
    recordId: null,
    numbers: ['EXPEDITION_CELLS', 'EXPEDITION_AIR', 'EXPEDITION_EXPOSURE'],
    facts: ['JEZERO_DELTA_DISTANCE_KM'],
    status: 'complete',
    text: {
      en: {
        title: 'Going out to explore',
        what: 'An expedition takes the crew out of the base to explore: it costs 2 cells, 2 units of air and 1 exposure point.',
        processing: 'The costs are game values, the same whatever the site. The only real distance shown: the old river delta is about 2.3 km west of where Perseverance landed.',
        gameUse: 'The 2 cells come from the sol\'s free cells; at night the suits use 2 air and the crew gets 1 exposure point. You bring back a discovery card. At most 1 expedition per sol.',
        simplified: 'Real trips cost more when they go farther or over rough ground. Here the cost is fixed, because we do not have a real distance for every site.',
        learnMore:
          'A delta is the fan of sand and rock a river leaves where it flows into a lake. Going out is like a hike: you carry your own water bottle, and outside there is no roof to protect you. Scientists on Earth plan field trips the same way: what to bring, how long to stay, and what they hope to learn.',
      },
      'pt-BR': {
        title: 'Sair para explorar',
        what: 'Uma expedição leva a tripulação para fora da base para explorar: custa 2 células, 2 unidades de ar e 1 ponto de exposição.',
        processing: 'Os custos são valores do jogo, iguais para qualquer lugar. A única distância real mostrada: o antigo delta do rio fica a cerca de 2,3 km a oeste de onde o Perseverance pousou.',
        gameUse: 'As 2 células saem das células livres do sol; à noite os trajes usam 2 de ar e a tripulação ganha 1 ponto de exposição. Você traz um cartão de descoberta. No máximo 1 expedição por sol.',
        simplified: 'Viagens de verdade custam mais quando vão mais longe ou por terreno difícil. Aqui o custo é fixo, porque não temos uma distância real para cada lugar.',
        learnMore:
          'Um delta é o leque de areia e pedras que um rio deixa onde deságua num lago. Sair é como uma trilha: você leva sua própria garrafa de água, e lá fora não há teto para proteger você. Cientistas na Terra planejam trabalhos de campo do mesmo jeito: o que levar, quanto tempo ficar e o que esperam aprender.',
      },
    },
  },
  {
    id: 'askEarth',
    label: 'scenario',
    place: 'game',
    date: null,
    badgeSource: 'Game rule',
    sourceName: 'Mars to Go game rule (SIM_MODEL §4), based on NASA, "Space Communications: 7 Things You Need to Know" (2020-10-06)',
    sourceUrl: `${SIM_MODEL}#4-one-sol`,
    recordId: null,
    numbers: ['ASK_EARTH_CELLS', 'RADIO_ROUND_TRIP_MIN_MINUTES'],
    facts: ['RADIO_DELAY_MIN_MINUTES', 'RADIO_DELAY_MAX_MINUTES'],
    status: 'complete',
    text: {
      en: {
        title: 'Asking Earth',
        what: 'Ask Earth spends 1 cell to send a question about tomorrow\'s space weather.',
        processing: 'A radio signal from Mars to Earth takes about 4 minutes when the planets are closest and about 24 minutes when they are farthest, one way. There and back takes at least 8 minutes.',
        gameUse: 'Today\'s question is about tomorrow. The answer arrives tonight, after your plan is locked, so it helps only tomorrow\'s plan. On sol 7 it is useless: there is no tomorrow in the mission.',
        simplified: 'The answer is a forecast by a NASA model, not a certainty, and the game squeezes the wait into one night. In a 10-second crisis the button is off: the answer would take at least 8 minutes.',
        learnMore:
          'Talking to Earth is like a voice message, not a phone call: you send it and wait for the reply. Radio waves are as fast as light, but Mars is very far away. Rovers on Mars work like this every day: teams on Earth send a plan, and the rover carries it out on its own.',
      },
      'pt-BR': {
        title: 'Perguntar à Terra',
        what: 'Perguntar à Terra gasta 1 célula para mandar uma pergunta sobre o clima espacial de amanhã.',
        processing: 'Um sinal de rádio de Marte até a Terra leva cerca de 4 minutos quando os planetas estão mais perto e cerca de 24 minutos quando estão mais longe, só a ida. Ida e volta levam pelo menos 8 minutos.',
        gameUse: 'A pergunta de hoje é sobre amanhã. A resposta chega nesta noite, depois que o plano foi fechado, então só ajuda o plano de amanhã. No sol 7 não adianta: não existe amanhã na missão.',
        simplified: 'A resposta é uma previsão feita por um modelo da NASA, não uma certeza, e o jogo encurta a espera para uma noite. Numa crise de 10 segundos o botão fica desligado: a resposta levaria pelo menos 8 minutos.',
        learnMore:
          'Falar com a Terra é como um áudio no celular, não uma ligação: você manda e espera a resposta. As ondas de rádio são rápidas como a luz, mas Marte fica muito longe. Os rovers em Marte funcionam assim todo dia: equipes na Terra mandam um plano, e o rover o cumpre sozinho.',
      },
    },
  },
  {
    id: 'sol',
    label: 'scenario',
    place: 'game',
    date: null,
    badgeSource: 'Game rule',
    sourceName: 'Mars to Go game rule (SIM_MODEL §2, §12), based on the NASA Mars Fact Sheet',
    sourceUrl: `${SIM_MODEL}#12-sol-and-day-wording-rules`,
    recordId: null,
    numbers: ['MISSION_SOLS'],
    facts: ['SOL_LENGTH_HOURS', 'SOL_EXTRA_MINUTES'],
    status: 'complete',
    text: {
      en: {
        title: 'A day on Mars: sol',
        what: 'On Mars, a day has a name: sol. It lasts 40 minutes longer than ours.',
        processing: 'A sol is 24.6597 hours: 24 h 39 min 35 s. We round the extra time to 40 minutes.',
        gameUse: 'One sol is one round. Your mission lasts 7 sols.',
        simplified: 'A real Mars mission would last much longer. Seven sols are enough to see your plan work, or not.',
        learnMore:
          'Mars spins a little slower than Earth, so its day is a bit longer. A watch brought from Earth would fall 40 minutes behind every sol, like a clock you must fix every morning. On Earth, calendars need fixes too, like leap years, because days and years are not round numbers.',
      },
      'pt-BR': {
        title: 'Um dia em Marte: sol',
        what: 'Em Marte, o dia tem um nome: sol. Ele dura 40 minutos a mais que o nosso.',
        processing: 'Um sol tem 24,6597 horas: 24 h 39 min 35 s. Arredondamos o tempo a mais para 40 minutos.',
        gameUse: 'Um sol é uma rodada. Sua missão dura 7 sóis.',
        simplified: 'Uma missão de verdade a Marte duraria muito mais. Sete sóis bastam para ver seu plano dar certo, ou não.',
        learnMore:
          'Marte gira um pouco mais devagar que a Terra, então o dia lá é um pouco mais longo. Um relógio trazido da Terra ficaria 40 minutos atrasado a cada sol, como um relógio que você precisa acertar toda manhã. Na Terra, os calendários também precisam de ajustes, como os anos bissextos, porque dias e anos não são números redondos.',
      },
    },
  },
  {
    id: 'evt-flr-2024-05-10',
    label: 'measured',
    place: 'Sun',
    date: '2024-05-10',
    badgeSource: 'DONKI',
    sourceName: 'NASA CCMC DONKI — Solar flare',
    sourceUrl: 'https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/30665/-1',
    recordId: '2024-05-10T00:10:00-FLR-001',
    numbers: [],
    facts: [],
    status: 'complete',
    text: {
      en: {
        title: 'Solar flare M1.3',
        what: 'A real solar flare of class M1.3, at its brightest on May 10, 2024, at 00:13 UTC.',
        processing: 'Recorded in NASA\'s DONKI database and seen by the GOES satellites in Earth orbit. We keep its class and turn it into a game risk.',
        gameUse: 'Risk 1. There is no evidence it reached Mars, so in the game it does not raise exposure.',
        simplified: 'Scientists measure flares in great detail; we use only the letter and number of the class.',
        parallel:
          'Seen from Earth\'s side, not from Mars. Earth and Mars share the same Sun, but whether a flare reaches Mars depends on which way it points.',
        learnMore:
          'A flare is a giant flash on the Sun. Scientists sort flares by letters, C, M and X, from weaker to stronger. UTC is the world clock scientists use. A flare is like a flashlight: if it points at your friend, it does not light you up. Satellites watch the Sun every day because strong flares can disturb radio signals on Earth.',
      },
      'pt-BR': {
        title: 'Erupção solar M1.3',
        what: 'Uma erupção solar real de classe M1.3, no seu ponto mais forte em 10 de maio de 2024, às 00:13 UTC.',
        processing: 'Registrada no banco de dados DONKI da NASA e vista pelos satélites GOES, na órbita da Terra. Guardamos a classe e a transformamos num risco do jogo.',
        gameUse: 'Risco 1. Não há prova de que ela chegou a Marte, então no jogo ela não aumenta a exposição.',
        simplified: 'Cientistas medem erupções com muitos detalhes; nós usamos só a letra e o número da classe.',
        parallel:
          'Vista do lado da Terra, não de Marte. A Terra e Marte têm o mesmo Sol, mas se uma erupção chega a Marte depende da direção para onde ela aponta.',
        learnMore:
          'Uma erupção solar é um clarão gigante no Sol. Os cientistas classificam as erupções por letras, C, M e X, da mais fraca para a mais forte. UTC é o relógio mundial que os cientistas usam. Uma erupção é como uma lanterna: se aponta para o seu amigo, não ilumina você. Satélites vigiam o Sol todo dia porque erupções fortes podem atrapalhar sinais de rádio na Terra.',
      },
    },
  },
  {
    id: 'evt-cme-2024-05-11',
    label: 'measured',
    place: 'Sun',
    date: '2024-05-11',
    badgeSource: 'DONKI',
    sourceName: 'NASA CCMC DONKI — Coronal mass ejection and WSA-ENLIL model run',
    sourceUrl: 'https://ccmc.gsfc.nasa.gov/DONKI/view/CME/30719/-1',
    recordId: '2024-05-11T01:36:00-CME-001 · WSA-ENLIL/30726/1',
    numbers: [],
    facts: [],
    status: 'complete',
    text: {
      en: {
        title: 'A Sun cloud heads to Mars',
        what: 'A real coronal mass ejection (CME) that left the Sun on May 11, 2024, at 01:36 UTC.',
        processing: 'From NASA\'s DONKI database. NASA\'s WSA-ENLIL model, given a speed of 1,263 km/s, forecast it would arrive at Mars on May 13, 2024, at 17:42 UTC, and not as a glancing blow (one that only grazes the planet).',
        gameUse: 'Risk 2, and it reaches Mars: if your shield is smaller than 2, exposure goes up tonight.',
        simplified: 'In the game it arrives the same night; in reality the trip took more than two days. The arrival is a forecast by a model, not a measurement.',
        parallel:
          'The CME was seen from near Earth, but the forecast is about Mars itself: the model follows the cloud through the solar system.',
        learnMore:
          'A CME is a huge cloud of particles the Sun throws into space. Scientists use a computer model to guess which planets it will hit, like a weather forecast for space. A forecast can be wrong, like rain that never comes. On Earth, the same kind of forecast warns satellite and power-grid teams.',
      },
      'pt-BR': {
        title: 'Uma nuvem do Sol rumo a Marte',
        what: 'Uma ejeção de massa coronal (CME) real, que saiu do Sol em 11 de maio de 2024, às 01:36 UTC.',
        processing: 'Do banco de dados DONKI da NASA. O modelo WSA-ENLIL da NASA, usando uma velocidade de 1.263 km/s, previu a chegada a Marte em 13 de maio de 2024, às 17:42 UTC, e não de raspão.',
        gameUse: 'Risco 2, e chega a Marte: se o seu escudo for menor que 2, a exposição sobe nesta noite.',
        simplified: 'No jogo ela chega na mesma noite; na realidade a viagem levou mais de dois dias. A chegada é uma previsão de um modelo, não uma medição.',
        parallel:
          'A CME foi vista de perto da Terra, mas a previsão é sobre o próprio Marte: o modelo acompanha a nuvem pelo Sistema Solar.',
        learnMore:
          'Uma CME é uma nuvem enorme de partículas que o Sol joga no espaço. Os cientistas usam um modelo de computador para adivinhar em quais planetas ela vai bater, como uma previsão do tempo para o espaço. Uma previsão pode errar, como a chuva que não vem. Na Terra, o mesmo tipo de previsão avisa as equipes de satélites e de redes de energia elétrica.',
      },
    },
  },
  {
    id: 'deltaSite',
    label: 'scenario',
    place: 'game',
    date: null,
    badgeSource: 'Game rule',
    sourceName: 'NASA/JPL, "NASA\'s Perseverance Rover Arrives at Delta for New Science Campaign"; distance from PIA24485',
    sourceUrl: 'https://www.jpl.nasa.gov/news/nasas-perseverance-rover-arrives-at-delta-for-new-science-campaign/',
    recordId: 'PIA24485',
    numbers: ['EXPEDITION_FAR_AIR', 'EXPEDITION_FAR_EXPOSURE'],
    facts: [],
    status: 'complete',
    text: {
      en: {
        title: 'The far trip: the delta front',
        what: 'The delta front is about 2.3 km from the landing site. A trip there costs 3 air for the suits and 2 radiation points, instead of 2 and 1 for a near rock.',
        processing: 'The real facts: NASA chose Jezero because orbital images showed a delta, "clear evidence that a large lake once filled the crater", and the fine rocks at the delta\'s base are the mission\'s best bet for finding preserved signs of ancient life. The 2.3 km comes from NASA/JPL PIA24485. The numbers 3 and 2 are game values.',
        gameUse: 'Mission 2 asks for the sample from the delta front. You choose the site when you send the rover.',
        simplified: 'A real trip of 2.3 km is planned over days, with many stops. The game turns distance into more air and more time outside.',
        learnMore: 'A delta is the fan of mud and sand a river leaves where it flows into a lake, like the mouth of a river on Earth. Mud is good at keeping tiny traces safe for a very long time.',
      },
      'pt-BR': {
        title: 'A viagem longa: a frente do delta',
        what: 'A frente do delta fica a cerca de 2,3 km do local de pouso. Uma ida até lá custa 3 de ar para os trajes e 2 pontos de radiação, em vez de 2 e 1 de uma rocha perto.',
        processing: 'Os fatos reais: a NASA escolheu Jezero porque imagens de órbita mostraram um delta, "prova clara de que um grande lago já encheu a cratera", e as rochas finas da base do delta são a melhor aposta da missão para achar sinais preservados de vida antiga. Os 2,3 km vêm da NASA/JPL PIA24485. Os números 3 e 2 são valores do jogo.',
        gameUse: 'A missão 2 pede a amostra da frente do delta. Você escolhe o lugar quando manda o rover.',
        simplified: 'Uma viagem real de 2,3 km é planejada em vários dias, com muitas paradas. O jogo transforma a distância em mais ar e mais tempo lá fora.',
        learnMore: 'Um delta é o leque de lama e areia que um rio deixa onde ele entra num lago, como a foz de um rio na Terra. A lama é boa para guardar marcas minúsculas por muito, muito tempo.',
      },
    },
  },
  {
    id: 'crisis',
    label: 'scenario',
    place: 'game',
    date: null,
    badgeSource: 'Game rule',
    sourceName: 'NASA/JPL, "NASA Watches Mars Light Up During Epic Solar Storm" (2024-06-10)',
    sourceUrl: 'https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/',
    recordId: 'NASA release 2024-080',
    numbers: ['CRISIS_SECONDS', 'CRISIS_SECONDS_CADET', 'CRISIS_SHIELD_SWAP_CELLS'],
    facts: [],
    status: 'complete',
    text: {
      en: {
        title: 'The 10-second crisis',
        what: 'When a fast solar storm reaches Mars, you have 10 seconds: see the risk against your Shield and move cells into it from the machine you choose, or call the rover back.',
        processing: 'The real fact: on May 20, 2024, NASA says the flare\'s light arrived first and the charged particles reached Mars "in just tens of minutes". There is little time to react.',
        gameUse: 'Each cell moved to the Shield blocks 1 more risk point, and costs what it was doing: 1 air, 2 food later, or Earth\'s answer. If the Shield already covers the risk, nothing needs to change. Calling the rover back avoids the radiation outside, but the suits\' air is already spent and no sample comes home. When time runs out, what you moved stays. At the Cadet level you get 30 seconds instead of 10. (The older list screens move 2 cells from the Air machine.)',
        simplified: 'Real crews would have minutes, not seconds, and rules written in advance. The 10 seconds are a game rule to feel the hurry.',
        learnMore:
          'Light is the fastest thing there is, so the flash arrives before the particles, like lightning before thunder. Astronauts on the space station also move to the most shielded part of the station when a solar storm warning comes.',
      },
      'pt-BR': {
        title: 'A crise de 10 segundos',
        what: 'Quando uma tempestade solar rápida chega a Marte, você tem 10 segundos: veja o risco contra o seu Escudo e passe células para ele da máquina que escolher, ou chame o rover de volta.',
        processing: 'O fato real: em 20 de maio de 2024, a NASA conta que a luz da erupção chegou primeiro e as partículas carregadas chegaram a Marte "em apenas dezenas de minutos". Há pouco tempo para reagir.',
        gameUse: 'Cada célula passada para o Escudo bloqueia mais 1 ponto de risco e custa o que ela fazia: 1 de ar, 2 de comida depois, ou a resposta da Terra. Se o Escudo já cobre o risco, nada precisa mudar. Chamar o rover de volta evita a radiação lá fora, mas o ar dos trajes já foi gasto e nenhuma amostra volta. Quando o tempo acaba, o que você passou fica. No nível Cadete você tem 30 segundos em vez de 10. (As telas antigas em lista passam 2 células da Máquina de ar.)',
        simplified: 'Uma tripulação de verdade teria minutos, não segundos, e regras escritas antes. Os 10 segundos são uma regra do jogo para sentir a pressa.',
        learnMore:
          'A luz é a coisa mais rápida que existe, então o clarão chega antes das partículas, como o relâmpago antes do trovão. Os astronautas da estação espacial também vão para a parte mais protegida da estação quando chega um aviso de tempestade solar.',
      },
    },
  },
  {
    id: 'evt-flr-2024-05-14',
    label: 'measured',
    place: 'Sun',
    date: '2024-05-14',
    badgeSource: 'DONKI',
    sourceName: 'NASA CCMC DONKI — Solar flare',
    sourceUrl: 'https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/30849/-1',
    recordId: '2024-05-14T16:46:00-FLR-001',
    numbers: [],
    facts: [],
    status: 'complete',
    text: {
      en: {
        title: 'Solar flare X8.7',
        what: 'A real solar flare of class X8.7, at its brightest on May 14, 2024, at 16:51 UTC.',
        processing: 'Recorded in NASA\'s DONKI database and seen by the GOES satellites in Earth orbit. We keep its class and turn it into a game risk: an X flare is risk 2.',
        gameUse: 'Risk 2. There is no evidence it reached Mars, so in the game it does not raise the dose. The Antenna answers "Earth does not know".',
        simplified: 'Scientists measure flares in great detail; we use only the letter and number of the class.',
        parallel:
          'Seen from Earth\'s side, not from Mars. Earth and Mars share the same Sun, but whether a flare reaches Mars depends on which way it points.',
        learnMore:
          'X is the strongest flare class. This one was one of the biggest of the year. A flare is like a flashlight: if it points at your friend, it does not light you up.',
      },
      'pt-BR': {
        title: 'Erupção solar X8.7',
        what: 'Uma erupção solar real de classe X8.7, no seu ponto mais forte em 14 de maio de 2024, às 16:51 UTC.',
        processing: 'Registrada no banco de dados DONKI da NASA e vista pelos satélites GOES, na órbita da Terra. Guardamos a classe e a transformamos num risco do jogo: uma erupção X é risco 2.',
        gameUse: 'Risco 2. Não há prova de que ela chegou a Marte, então no jogo ela não aumenta a dose. A Antena responde "a Terra não sabe".',
        simplified: 'Cientistas medem erupções com muitos detalhes; nós usamos só a letra e o número da classe.',
        parallel:
          'Vista do lado da Terra, não de Marte. A Terra e Marte têm o mesmo Sol, mas se uma erupção chega a Marte depende da direção para onde ela aponta.',
        learnMore:
          'X é a classe mais forte de erupção. Esta foi uma das maiores do ano. Uma erupção é como uma lanterna: se aponta para o seu amigo, não ilumina você.',
      },
    },
  },
  {
    id: 'evt-cme-2024-05-13',
    label: 'measured',
    place: 'Sun',
    date: '2024-05-13',
    badgeSource: 'DONKI',
    sourceName: 'NASA CCMC DONKI — Coronal mass ejection and WSA-ENLIL model run',
    sourceUrl: 'https://ccmc.gsfc.nasa.gov/DONKI/view/CME/30814/-1',
    recordId: '2024-05-13T09:12:00-CME-001 · WSA-ENLIL/30822/1',
    numbers: [],
    facts: [],
    status: 'complete',
    text: {
      en: {
        title: 'A fast cloud heads to Mars',
        what: 'A real coronal mass ejection (CME) that left the Sun on May 13, 2024, at 09:12 UTC, seen as a full halo by three coronagraphs.',
        processing: 'From NASA\'s DONKI database. NASA\'s WSA-ENLIL model, given a speed of 1,456 km/s, forecast it would arrive at Mars on May 16, 2024, at 18:09 UTC, and not as a glancing blow.',
        gameUse: 'Risk 2, and it reaches Mars: what the shield does not block raises the dose and damages cells for the next sol.',
        simplified: 'In the game it arrives the same night; in reality the trip took about three days. The arrival is a forecast by a model, not a measurement.',
        parallel:
          'The CME was seen from near Earth, but the forecast is about Mars itself: the model follows the cloud through the solar system.',
        learnMore:
          'A coronagraph is a camera that covers the bright Sun with a disk, to see the clouds it throws out, like covering a lamp with your hand to see the room. A "halo" means the cloud spreads all around the Sun as seen from us.',
      },
      'pt-BR': {
        title: 'Uma nuvem rápida rumo a Marte',
        what: 'Uma ejeção de massa coronal (CME) real, que saiu do Sol em 13 de maio de 2024, às 09:12 UTC, vista como um halo completo por três coronógrafos.',
        processing: 'Do banco de dados DONKI da NASA. O modelo WSA-ENLIL da NASA, usando uma velocidade de 1.456 km/s, previu a chegada a Marte em 16 de maio de 2024, às 18:09 UTC, e não de raspão.',
        gameUse: 'Risco 2, e chega a Marte: o que o escudo não bloqueia aumenta a dose e estraga células para o sol seguinte.',
        simplified: 'No jogo ela chega na mesma noite; na realidade a viagem levou cerca de três dias. A chegada é uma previsão de um modelo, não uma medição.',
        parallel:
          'A CME foi vista de perto da Terra, mas a previsão é sobre o próprio Marte: o modelo acompanha a nuvem pelo Sistema Solar.',
        learnMore:
          'Um coronógrafo é uma câmera que cobre o Sol brilhante com um disco, para ver as nuvens que ele lança, como tapar uma lâmpada com a mão para enxergar a sala. "Halo" quer dizer que a nuvem se espalha em volta de todo o Sol, visto daqui.',
      },
    },
  },
  {
    id: 'evt-cme-2024-05-14',
    label: 'measured',
    place: 'Sun',
    date: '2024-05-14',
    badgeSource: 'DONKI',
    sourceName: 'NASA CCMC DONKI — Coronal mass ejection and WSA-ENLIL model run',
    sourceUrl: 'https://ccmc.gsfc.nasa.gov/DONKI/view/CME/30873/-1',
    recordId: '2024-05-14T17:30:00-CME-001 · WSA-ENLIL/30872/1',
    numbers: [],
    facts: [],
    status: 'complete',
    text: {
      en: {
        title: 'One more cloud for Mars',
        what: 'A real coronal mass ejection (CME) that left the Sun on May 14, 2024, at 17:30 UTC, right after the X8.7 flare.',
        processing: 'From NASA\'s DONKI database. NASA\'s WSA-ENLIL model, given a speed of 1,199 km/s, forecast it would arrive at Mars on May 17, 2024, at 15:08 UTC, and not as a glancing blow.',
        gameUse: 'Risk 2, and it reaches Mars: what the shield does not block raises the dose and damages cells for the next sol.',
        simplified: 'In the game it arrives the same night; in reality the trip took about three days. The arrival is a forecast by a model, not a measurement.',
        parallel:
          'The CME was seen from near Earth, but the forecast is about Mars itself: the model follows the cloud through the solar system.',
        learnMore:
          'In May 2024 one very active spot on the Sun threw out cloud after cloud, like a volcano that keeps erupting. Mars and Earth both got hit in the same weeks.',
      },
      'pt-BR': {
        title: 'Mais uma nuvem para Marte',
        what: 'Uma ejeção de massa coronal (CME) real, que saiu do Sol em 14 de maio de 2024, às 17:30 UTC, logo depois da erupção X8.7.',
        processing: 'Do banco de dados DONKI da NASA. O modelo WSA-ENLIL da NASA, usando uma velocidade de 1.199 km/s, previu a chegada a Marte em 17 de maio de 2024, às 15:08 UTC, e não de raspão.',
        gameUse: 'Risco 2, e chega a Marte: o que o escudo não bloqueia aumenta a dose e estraga células para o sol seguinte.',
        simplified: 'No jogo ela chega na mesma noite; na realidade a viagem levou cerca de três dias. A chegada é uma previsão de um modelo, não uma medição.',
        parallel:
          'A CME foi vista de perto da Terra, mas a previsão é sobre o próprio Marte: o modelo acompanha a nuvem pelo Sistema Solar.',
        learnMore:
          'Em maio de 2024 uma mancha muito ativa no Sol lançou nuvem atrás de nuvem, como um vulcão que não para de entrar em erupção. Marte e a Terra foram atingidos nas mesmas semanas.',
      },
    },
  },
  {
    id: 'evt-cme-2024-05-16',
    label: 'measured',
    place: 'Sun',
    date: '2024-05-16',
    badgeSource: 'DONKI',
    sourceName: 'NASA CCMC DONKI — Coronal mass ejection and WSA-ENLIL model run',
    sourceUrl: 'https://ccmc.gsfc.nasa.gov/DONKI/view/CME/30936/-1',
    recordId: '2024-05-16T13:38:00-CME-001 · WSA-ENLIL/30963/1',
    numbers: [],
    facts: [],
    status: 'complete',
    text: {
      en: {
        title: 'A third cloud for Mars',
        what: 'A real coronal mass ejection (CME) that left the Sun on May 16, 2024, at 13:38 UTC.',
        processing: 'From NASA\'s DONKI database. NASA\'s WSA-ENLIL model, given a speed of 1,452 km/s, forecast it would arrive at Mars on May 19, 2024, at 09:15 UTC.',
        gameUse: 'Risk 2, it reaches Mars, and it is fast (over 1,000 km/s): the 10-second crisis comes with it.',
        simplified: 'In the game it arrives the same night; in reality the trip took about three days. The arrival is a forecast by a model, not a measurement.',
        parallel: 'The CME was seen from near Earth, but the forecast is about Mars itself: the model follows the cloud through the solar system.',
        learnMore: '1,452 km/s means it could cross Brazil from north to south in about 3 seconds. Even so, it takes days to cross the space between the Sun and Mars.',
      },
      'pt-BR': {
        title: 'Uma terceira nuvem para Marte',
        what: 'Uma ejeção de massa coronal (CME) real, que saiu do Sol em 16 de maio de 2024, às 13:38 UTC.',
        processing: 'Do banco de dados DONKI da NASA. O modelo WSA-ENLIL da NASA, usando uma velocidade de 1.452 km/s, previu a chegada a Marte em 19 de maio de 2024, às 09:15 UTC.',
        gameUse: 'Risco 2, chega a Marte e é rápida (mais de 1.000 km/s): a crise de 10 segundos vem junto.',
        simplified: 'No jogo ela chega na mesma noite; na realidade a viagem levou cerca de três dias. A chegada é uma previsão de um modelo, não uma medição.',
        parallel: 'A CME foi vista de perto da Terra, mas a previsão é sobre o próprio Marte: o modelo acompanha a nuvem pelo Sistema Solar.',
        learnMore: '1.452 km/s quer dizer que ela atravessaria o Brasil de norte a sul em uns 3 segundos. Mesmo assim, leva dias para cruzar o espaço entre o Sol e Marte.',
      },
    },
  },
  {
    id: 'evt-cme-2024-05-14-psyche',
    label: 'measured',
    place: 'Sun',
    date: '2024-05-14',
    badgeSource: 'DONKI',
    sourceName: 'NASA CCMC DONKI — Coronal mass ejection and WSA-ENLIL model runs',
    sourceUrl: 'https://ccmc.gsfc.nasa.gov/DONKI/view/CME/30883/-1',
    recordId: '2024-05-14T17:48:00-CME-001',
    numbers: [],
    facts: [],
    status: 'complete',
    text: {
      en: {
        title: 'A cloud that misses Mars',
        what: 'A real coronal mass ejection (CME) that left the Sun on May 14, 2024, at 17:48 UTC, at 1,292 km/s.',
        processing: 'From NASA\'s DONKI database. NASA\'s WSA-ENLIL model runs for it forecast a hit on the spacecraft Psyche, not on Mars.',
        gameUse: 'A false alarm: it shows in the forecast as "maybe", but it does not reach Mars. Shield cells spent on it are wasted. The Antenna can tell you the day before.',
        simplified: 'The model\'s answer is a forecast, not a measurement at Mars.',
        parallel: 'The CME was seen from near Earth; the model follows it through the solar system and says where it goes.',
        learnMore: 'Psyche is a NASA spacecraft flying to a metal asteroid. Clouds from the Sun go in many directions, like water from a garden sprinkler: some hit one planet, some hit nothing.',
      },
      'pt-BR': {
        title: 'Uma nuvem que erra Marte',
        what: 'Uma ejeção de massa coronal (CME) real, que saiu do Sol em 14 de maio de 2024, às 17:48 UTC, a 1.292 km/s.',
        processing: 'Do banco de dados DONKI da NASA. As rodadas do modelo WSA-ENLIL da NASA para ela previram que atingiria a nave Psyche, não Marte.',
        gameUse: 'Um alarme falso: aparece na previsão como "talvez", mas não chega a Marte. Células de escudo gastas nela são desperdiçadas. A Antena pode avisar no dia anterior.',
        simplified: 'A resposta do modelo é uma previsão, não uma medição em Marte.',
        parallel: 'A CME foi vista de perto da Terra; o modelo a acompanha pelo Sistema Solar e diz para onde ela vai.',
        learnMore: 'Psyche é uma nave da NASA a caminho de um asteroide de metal. As nuvens do Sol vão para muitos lados, como a água de um irrigador de jardim: umas atingem um planeta, outras não atingem nada.',
      },
    },
  },
  {
    id: 'evt-cme-2024-05-15-psyche',
    label: 'measured',
    place: 'Sun',
    date: '2024-05-15',
    badgeSource: 'DONKI',
    sourceName: 'NASA CCMC DONKI — Coronal mass ejection and WSA-ENLIL model runs',
    sourceUrl: 'https://ccmc.gsfc.nasa.gov/DONKI/view/CME/30948/-1',
    recordId: '2024-05-15T14:53:00-CME-001',
    numbers: [],
    facts: [],
    status: 'complete',
    text: {
      en: {
        title: 'Another cloud that misses Mars',
        what: 'A real coronal mass ejection (CME) that left the Sun on May 15, 2024, at 14:53 UTC, at 1,570 km/s.',
        processing: 'From NASA\'s DONKI database. NASA\'s WSA-ENLIL model runs for it forecast a hit on the spacecraft Psyche, not on Mars.',
        gameUse: 'A false alarm: fast, but not toward Mars. Shield cells spent on it are wasted. The Antenna can tell you the day before.',
        simplified: 'The model\'s answer is a forecast, not a measurement at Mars.',
        parallel: 'The CME was seen from near Earth; the model follows it through the solar system and says where it goes.',
        learnMore: 'Being fast does not mean coming at you: a fast ball thrown to the other side of the field never reaches you.',
      },
      'pt-BR': {
        title: 'Outra nuvem que erra Marte',
        what: 'Uma ejeção de massa coronal (CME) real, que saiu do Sol em 15 de maio de 2024, às 14:53 UTC, a 1.570 km/s.',
        processing: 'Do banco de dados DONKI da NASA. As rodadas do modelo WSA-ENLIL da NASA para ela previram que atingiria a nave Psyche, não Marte.',
        gameUse: 'Um alarme falso: rápida, mas não na direção de Marte. Células de escudo gastas nela são desperdiçadas. A Antena pode avisar no dia anterior.',
        simplified: 'A resposta do modelo é uma previsão, não uma medição em Marte.',
        parallel: 'A CME foi vista de perto da Terra; o modelo a acompanha pelo Sistema Solar e diz para onde ela vai.',
        learnMore: 'Ser rápida não quer dizer vir na sua direção: uma bola rápida jogada para o outro lado do campo nunca chega até você.',
      },
    },
  },
  {
    id: 'evt-may-2024',
    label: 'measured',
    place: 'Mars',
    date: '2024-05-20',
    badgeSource: 'NASA/JPL',
    sourceName: 'NASA/JPL, "NASA Watches Mars Light Up During Epic Solar Storm" (2024-06-10)',
    sourceUrl: 'https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/',
    recordId: 'NASA release 2024-080',
    numbers: [],
    facts: ['MAY_2024_DOSE_UGY', 'MAY_2024_CHEST_XRAYS'],
    status: 'complete',
    text: {
      en: {
        title: 'The May 2024 storm',
        what: 'On May 20, 2024, a real storm from the Sun reached Mars, after a solar flare later estimated to be an X12.',
        processing: 'Measured by RAD on the rover Curiosity, in Gale Crater (NASA Curiosity mission page: "Curiosity explores Gale Crater", https://science.nasa.gov/mission/msl-curiosity/). NASA: an astronaut standing next to Curiosity would have received 8,100 micrograys, equal to 30 chest X-rays.',
        gameUse: 'Risk 3, the top level, in mission 2 "The May storm". It is the proof that this event reached Mars.',
        simplified: 'The game does not put the dose in any formula: it turns the event into risk 3. Gale Crater is far from our base in Jezero.',
        learnMore:
          'X is the strongest class of flare. NASA says the flare\'s light arrived first and the particles reached Mars in just tens of minutes; it was the biggest surge RAD had measured since the rover landed 12 years before. 30 chest X-rays is like 30 X-rays at the doctor, all at once. Hospitals count radiation carefully for the same reason, and that is why the shield matters.',
      },
      'pt-BR': {
        title: 'A tempestade de maio de 2024',
        what: 'Em 20 de maio de 2024, uma tempestade real vinda do Sol chegou a Marte, depois de uma erupção solar que mais tarde foi estimada como X12.',
        processing: 'Medida pelo RAD no rover Curiosity, na Cratera Gale (página da missão Curiosity da NASA: "Curiosity explores Gale Crater", https://science.nasa.gov/mission/msl-curiosity/). NASA: um astronauta ao lado do Curiosity teria recebido 8.100 micrograys, o mesmo que 30 radiografias do tórax.',
        gameUse: 'Risco 3, o nível mais alto, na missão 2 "A tempestade de maio". É a prova de que esse evento chegou a Marte.',
        simplified: 'O jogo não usa a dose em nenhuma conta: transforma o evento em risco 3. A Cratera Gale fica longe da nossa base em Jezero.',
        learnMore:
          'X é a classe mais forte de erupção. A NASA conta que a luz da erupção chegou primeiro e as partículas chegaram a Marte em apenas dezenas de minutos; foi o maior pico que o RAD mediu desde que o rover pousou, 12 anos antes. 30 radiografias do tórax é como fazer 30 raios X no médico de uma vez. Hospitais contam a radiação com cuidado pelo mesmo motivo, e é por isso que o escudo importa.',
      },
    },
  },
  {
    id: 'photo-jezero-panorama',
    label: 'measured',
    place: 'Mars',
    date: '2022-06-12',
    badgeSource: 'NASA/JPL-Caltech/ASU/MSSS',
    sourceName: 'NASA Photojournal PIA24921 — Detailed Panorama of Mars\' Jezero Crater Delta',
    sourceUrl: 'https://science.nasa.gov/photojournal/detailed-panorama-of-mars-jezero-crater-delta/',
    recordId: 'PIA24921',
    numbers: [],
    facts: [],
    photo: {
      slug: 'jezero-panorama',
      credit: 'NASA/JPL-Caltech/ASU/MSSS',
      mission: 'Mars 2020 Perseverance · Mastcam-Z',
      date: '2022-06-12',
      place: 'Mars',
      enhancedColor: true,
      sourceUrl: 'https://science.nasa.gov/photojournal/detailed-panorama-of-mars-jezero-crater-delta/',
      recordId: 'PIA24921',
    },
    status: 'complete',
    text: {
      en: {
        title: 'Jezero, our base',
        what: 'A real photo of Jezero Crater, where our base stands, taken by the rover Perseverance with its Mastcam-Z camera.',
        processing: 'A mosaic of 1,118 photos taken from June 12 to 20, 2022. It is in enhanced color: NASA processed the colors to show more contrast. We cropped the right part and resized it.',
        gameUse: 'It is the horizon of the home screen.',
        simplified: 'The colors are not what your eyes would see; NASA also has a natural-color version. Besides the crop and size, we changed nothing.',
        learnMore:
          'Scientists think that, billions of years ago, a river flowed into a lake here and left rocks and sand in a fan shape: a delta. It is like the fan of mud a garden hose leaves when it runs into a puddle. Many big rivers on Earth build deltas where they meet a lake or the sea. Where there was water, there may have been life, and that is why Perseverance went there.',
      },
      'pt-BR': {
        title: 'Jezero, nossa base',
        what: 'Uma foto real da Cratera Jezero, onde fica a nossa base, tirada pelo rover Perseverance com a câmera Mastcam-Z.',
        processing: 'Um mosaico de 1.118 fotos tiradas de 12 a 20 de junho de 2022. Está em cores realçadas: a NASA processou as cores para mostrar mais contraste. Recortamos a parte da direita e mudamos o tamanho.',
        gameUse: 'É o horizonte da tela inicial.',
        simplified: 'As cores não são as que seus olhos veriam; a NASA também tem uma versão em cores naturais. Além do recorte e do tamanho, não mudamos nada.',
        learnMore:
          'Os cientistas acham que, bilhões de anos atrás, um rio desaguava num lago aqui e deixou pedras e areia em forma de leque: um delta. É como o leque de lama que a mangueira do jardim deixa quando escorre numa poça. Muitos rios grandes da Terra formam deltas onde encontram um lago ou o mar. Onde houve água, pode ter havido vida, e é por isso que o Perseverance foi para lá.',
      },
    },
  },
  {
    id: 'photo-earth-from-mars',
    label: 'measured',
    place: 'Mars',
    date: '2014-01-31',
    badgeSource: 'NASA/JPL-Caltech/MSSS/TAMU',
    sourceName: 'NASA Photojournal PIA17936 — Bright \'Evening Star\' Seen from Mars Is Earth',
    sourceUrl: 'https://science.nasa.gov/photojournal/bright-evening-star-seen-from-mars-is-earth/',
    recordId: 'PIA17936',
    numbers: [],
    facts: [],
    photo: {
      slug: 'earth-from-mars',
      credit: 'NASA/JPL-Caltech/MSSS/TAMU',
      mission: 'MSL Curiosity · Mastcam',
      date: '2014-01-31',
      place: 'Mars',
      enhancedColor: false,
      sourceUrl: 'https://science.nasa.gov/photojournal/bright-evening-star-seen-from-mars-is-earth/',
      recordId: 'PIA17936',
    },
    status: 'complete',
    text: {
      en: {
        title: 'Earth seen from Mars',
        what: 'A real photo from Mars: Earth is the brightest dot in the evening sky.',
        processing: 'Taken by the left camera of Curiosity\'s Mastcam in Gale Crater, about 80 minutes after sunset on January 31, 2014. NASA processed it to remove marks left by cosmic rays; we only resized it.',
        gameUse: 'It appears at the end of the mission: Earth in the sky, where the crew goes home.',
        simplified: 'Nothing is simplified: this is how Earth looked from Gale Crater that evening, only smaller on your screen.',
        learnMore:
          'From Mars, Earth looks like a bright star, the way Venus looks from Earth at dusk; our Moon is just below it in the photo. Cosmic rays are fast particles from space that leave tiny white marks on camera pictures. It is like seeing a city from a plane at night: everyone is there, in a small light. Astronomers on Earth see other planets the same way, as bright dots in the sky.',
      },
      'pt-BR': {
        title: 'A Terra vista de Marte',
        what: 'Uma foto real tirada em Marte: a Terra é o ponto mais brilhante no céu do anoitecer.',
        processing: 'Tirada pela câmera esquerda da Mastcam do Curiosity, na Cratera Gale, cerca de 80 minutos depois do pôr do sol, em 31 de janeiro de 2014. A NASA processou a foto para tirar marcas deixadas por raios cósmicos; nós só mudamos o tamanho.',
        gameUse: 'Aparece no fim da missão: a Terra no céu, para onde a tripulação volta.',
        simplified: 'Nada foi simplificado: era assim que a Terra aparecia na Cratera Gale naquela noite, só que menor na sua tela.',
        learnMore:
          'De Marte, a Terra parece uma estrela brilhante, como Vênus vista da Terra ao entardecer; a nossa Lua aparece logo abaixo dela na foto. Raios cósmicos são partículas rápidas do espaço que deixam pontinhos brancos nas fotos das câmeras. É como ver uma cidade do avião à noite: todo mundo está lá, numa luzinha. Astrônomos na Terra veem os outros planetas do mesmo jeito, como pontos brilhantes no céu.',
      },
    },
  },
];

export function cardById(id: string): DataCard | undefined {
  return CARDS.find((c) => c.id === id && c.status === 'complete');
}

/** The card that explains a science id (as a number or a fact), if complete. */
export function cardForScience(id: ScienceId): DataCard | undefined {
  return CARDS.find((c) => c.status === 'complete' && (c.numbers.includes(id) || c.facts.includes(id)));
}
