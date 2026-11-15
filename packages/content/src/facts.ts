/**
 * "Real NASA fact of the sol" for mission 1, and the list of NASA sources the game uses.
 * Numbers in the texts come from packages/sim science.ts (listed in `scienceIds`) or from
 * the DONKI records in catalog.ts; photos and credits are copied from docs/en/ASSETS.md.
 * Sources checked on 2026-11-14.
 */
import type { ScienceId } from '@mars-to-go/sim';

export interface FactText {
  title: string;
  /** At most 2 short sentences, kid language. */
  body: string;
}

export interface SolFact {
  id: string;
  /** Mission the fact belongs to (default m1). No fact or photo repeats across missions. */
  mission?: 'm1' | 'm2';
  /** Sol this fact belongs to (1..7). */
  sol: number;
  /** One of the approved photo slugs in apps/web/public/images (see ASSETS); none when no real photo fits. */
  photo?: {
    slug: string;
    credit: string;
    mission: string;
    date: string;
    placeEn: string;
    placePt: string;
    enhancedColor: boolean;
    sourceUrl: string;
    recordId: string;
    /** What the photo really shows, so it is never mistaken for the fact's own event. */
    caption: { en: string; 'pt-BR': string };
  };
  /** Numbers shown in the text, by id (must exist in science.ts). */
  scienceIds: ScienceId[];
  sourceName: string;
  sourceUrl: string;
  text: { en: FactText; 'pt-BR': FactText };
}

const MRAD_ARTICLE = 'https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/';

export const SOL_FACTS: SolFact[] = [
  {
    id: 'sol1-air',
    sol: 1,
    photo: {
      slug: 'moxie',
      credit: 'NASA/JPL-Caltech',
      mission: 'Mars 2020 · MOXIE (installed in the rover)',
      date: 'released 2021-01-19',
      placeEn: 'Earth, before launch',
      placePt: 'Terra, antes do lançamento',
      enhancedColor: false,
      sourceUrl: 'https://science.nasa.gov/photojournal/moxie-all-tucked-in',
      recordId: 'PIA24203',
      caption: {
        en: 'MOXIE being installed in the rover Perseverance, on Earth, before launch.',
        'pt-BR': 'O MOXIE sendo instalado no rover Perseverance, na Terra, antes do lançamento.',
      },
    },
    scienceIds: ['MARS_CO2_PERCENT', 'MOXIE_TOTAL_O2_G'],
    sourceName: 'NASA/JPL, "NASA\'s Oxygen-Generating Experiment MOXIE Completes Mars Mission" (2023-09-06)',
    sourceUrl: 'https://www.jpl.nasa.gov/news/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/',
    text: {
      en: {
        title: 'Air made from Mars air',
        body: 'Mars air is 95.1% carbon dioxide, so nobody can breathe it. On Mars, NASA\'s MOXIE made 122 g of oxygen from that air, and your Life Support does the same with power.',
      },
      'pt-BR': {
        title: 'Ar feito com o ar de Marte',
        body: 'O ar de Marte tem 95,1% de gás carbônico, então ninguém consegue respirá-lo. Em Marte, o MOXIE da NASA fez 122 g de oxigênio com esse ar, e o seu Suporte à Vida faz o mesmo com energia.',
      },
    },
  },
  {
    id: 'sol2-greenhouse',
    sol: 2,
    photo: {
      slug: 'iss-lettuce',
      credit: 'NASA',
      mission: 'ISS · Advanced Plant Habitat (Plant Habitat-07)',
      date: '2024-12-27',
      placeEn: 'International Space Station (parallel)',
      placePt: 'Estação Espacial Internacional (paralelo)',
      enhancedColor: false,
      sourceUrl: 'https://images.nasa.gov/details/iss072e404269',
      recordId: 'iss072e404269',
      caption: {
        en: 'Plants growing on the ISS in the Advanced Plant Habitat, 2024.',
        'pt-BR': 'Plantas crescendo na ISS, na Advanced Plant Habitat, em 2024.',
      },
    },
    scienceIds: ['VEGGIE_LETTUCE_DAYS', 'GREENHOUSE_DELAY_SOLS'],
    sourceName: 'NASA Veggie fact sheet (VEG-01, ISS)',
    sourceUrl: 'https://www.nasa.gov/wp-content/uploads/2019/04/veggie_fact_sheet_508.pdf',
    text: {
      en: {
        title: 'Lettuce in space',
        body: 'On the ISS, lettuce grew for 33 days in NASA\'s Veggie chamber before it was eaten. The game squeezes that wait into 2 sols, but the rule is real: plant today, eat later.',
      },
      'pt-BR': {
        title: 'Alface no espaço',
        body: 'Na ISS, uma alface cresceu por 33 dias na câmara Veggie da NASA antes de ser comida. O jogo encurta essa espera para 2 sóis, mas a regra é real: plantar hoje, comer depois.',
      },
    },
  },
  {
    id: 'sol3-flare',
    sol: 3,
    photo: {
      slug: 'sun-flare-x87',
      credit: 'NASA/SDO',
      mission: 'SDO · AIA (171, 131, 193, 304 Å composite)',
      date: '2024-05-14 (X8.7 flare)',
      placeEn: 'The Sun (seen from Earth orbit)',
      placePt: 'O Sol (visto da órbita da Terra)',
      enhancedColor: true,
      sourceUrl: 'https://svs.gsfc.nasa.gov/14592',
      recordId: 'SVS 14592',
      caption: {
        en: 'A solar flare seen by NASA\'s SDO, 2024-05-14. Not the M1.3 flare of this sol.',
        'pt-BR': 'Uma erupção solar vista pelo SDO da NASA, 14/05/2024. Não é a erupção M1.3 deste sol.',
      },
    },
    scienceIds: [],
    sourceName: 'NASA CCMC DONKI — Solar flare 2024-05-10T00:10:00-FLR-001',
    sourceUrl: 'https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/30665/-1',
    text: {
      en: {
        title: 'A real flare today',
        body: 'Today\'s forecast is a real M1.3 solar flare, recorded by NASA\'s DONKI on May 10, 2024. Mars has no global magnetic field to block space particles, so the shield is the crew\'s protection.',
      },
      'pt-BR': {
        title: 'Uma erupção real hoje',
        body: 'A previsão de hoje é uma erupção solar real M1.3, registrada pelo DONKI da NASA em 10 de maio de 2024. Marte não tem um campo magnético global para barrar as partículas do espaço, então o escudo é a proteção da tripulação.',
      },
    },
  },
  {
    id: 'sol4-cold',
    sol: 4,
    photo: {
      slug: 'jezero-panorama',
      credit: 'NASA/JPL-Caltech/ASU/MSSS',
      mission: 'Mars 2020 Perseverance · Mastcam-Z',
      date: '2022-06-12 to 06-20',
      placeEn: 'Jezero Crater, Mars',
      placePt: 'Cratera Jezero, Marte',
      enhancedColor: true,
      sourceUrl: 'https://science.nasa.gov/photojournal/detailed-panorama-of-mars-jezero-crater-delta/',
      recordId: 'PIA24921',
      caption: {
        en: 'Jezero Crater, where our base stands, seen by the rover Perseverance.',
        'pt-BR': 'A Cratera Jezero, onde fica a nossa base, vista pelo rover Perseverance.',
      },
    },
    scienceIds: ['MARS_DAY_TEMP_MIN_C', 'MARS_DAY_TEMP_MAX_C', 'HEATING_CELLS'],
    sourceName: 'NASA Mars Fact Sheet (NSSDCA): diurnal temperature range, Viking 1 Lander site',
    sourceUrl: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html',
    text: {
      en: {
        title: 'Colder than a freezer',
        body: 'Where NASA\'s Viking 1 lander stood, Mars went from −89 °C to −31 °C in a single day. That is why heating always takes 3 of your cells, before you place any.',
      },
      'pt-BR': {
        title: 'Mais frio que um freezer',
        body: 'Onde a sonda Viking 1 da NASA pousou, Marte foi de −89 °C a −31 °C num só dia. É por isso que o aquecimento sempre leva 3 das suas células, antes de você distribuir qualquer uma.',
      },
    },
  },
  {
    id: 'sol5-cme',
    sol: 5,
    photo: {
      slug: 'jezero-orbital',
      credit: 'NASA/JPL-Caltech/MSSS/JHU-APL',
      mission: 'MRO · CTX + CRISM',
      date: 'released 2019-05-15',
      placeEn: 'Jezero Crater, Mars (from orbit)',
      placePt: 'Cratera Jezero, Marte (vista da órbita)',
      enhancedColor: true,
      sourceUrl: 'https://science.nasa.gov/photojournal/jezero-crater-mars-2020s-landing-site/',
      recordId: 'PIA23239',
      caption: {
        en: 'Jezero Crater seen from orbit by NASA\'s Mars Reconnaissance Orbiter, colors showing minerals.',
        'pt-BR': 'A Cratera Jezero vista da órbita pela sonda Mars Reconnaissance Orbiter da NASA, com cores que mostram minerais.',
      },
    },
    scienceIds: [],
    sourceName: 'NASA CCMC DONKI — CME 2024-05-11T01:36:00-CME-001 and WSA-ENLIL/30726/1',
    sourceUrl: 'https://ccmc.gsfc.nasa.gov/DONKI/view/WSA-ENLIL/30726/-1',
    text: {
      en: {
        title: 'A Sun cloud heads to Mars',
        body: 'On May 11, 2024, the Sun threw a huge cloud of particles, and NASA\'s WSA-ENLIL model forecast it would reach Mars on May 13. It is a forecast by a computer model, not a measurement, so the game treats it as a warning: raise the shield.',
      },
      'pt-BR': {
        title: 'Uma nuvem do Sol rumo a Marte',
        body: 'Em 11 de maio de 2024, o Sol lançou uma nuvem enorme de partículas, e o modelo WSA-ENLIL da NASA previu que ela chegaria a Marte em 13 de maio. É uma previsão de um modelo de computador, não uma medição, então o jogo a trata como um aviso: reforce o escudo.',
      },
    },
  },
  {
    id: 'sol6-radio',
    sol: 6,
    photo: {
      slug: 'earth-from-mars',
      credit: 'NASA/JPL-Caltech/MSSS/TAMU',
      mission: 'MSL Curiosity · Mastcam (left)',
      date: '2014-01-31 (sol 529)',
      placeEn: 'Gale Crater, Mars',
      placePt: 'Cratera Gale, Marte',
      enhancedColor: false,
      sourceUrl: 'https://science.nasa.gov/photojournal/bright-evening-star-seen-from-mars-is-earth/',
      recordId: 'PIA17936',
      caption: {
        en: 'Earth, the brightest dot in the evening sky of Mars, seen by the rover Curiosity.',
        'pt-BR': 'A Terra, o ponto mais brilhante no céu do anoitecer em Marte, vista pelo rover Curiosity.',
      },
    },
    scienceIds: ['RADIO_DELAY_MIN_MINUTES', 'RADIO_DELAY_MAX_MINUTES'],
    sourceName: 'NASA, "Space Communications: 7 Things You Need to Know" (2020-10-06)',
    sourceUrl: 'https://www.nasa.gov/centers-and-facilities/goddard/space-communications-7-things-you-need-to-know/',
    text: {
      en: {
        title: 'Earth is far away',
        body: 'A radio message from Mars takes about 4 to 24 minutes to reach Earth, one way. That is why Ask Earth answers only tonight, too late for today\'s plan.',
      },
      'pt-BR': {
        title: 'A Terra está longe',
        body: 'Uma mensagem de rádio de Marte leva de cerca de 4 a 24 minutos para chegar à Terra, só a ida. É por isso que Perguntar à Terra só responde à noite, tarde demais para o plano de hoje.',
      },
    },
  },
  {
    id: 'sol7-storm',
    sol: 7,
    photo: {
      slug: 'gale-sunset',
      credit: 'NASA/JPL-Caltech/MSSS/Texas A&M Univ.',
      mission: 'MSL Curiosity · Mastcam',
      date: '2015-04-15 (sol 956)',
      placeEn: 'Gale Crater, Mars',
      placePt: 'Cratera Gale, Marte',
      enhancedColor: false,
      sourceUrl: 'https://science.nasa.gov/photojournal/sunset-in-mars-gale-crater',
      recordId: 'PIA19400',
      caption: {
        en: 'Sunset in Gale Crater, where Curiosity measured the storm, seen by Curiosity in 2015.',
        'pt-BR': 'Pôr do sol na Cratera Gale, onde o Curiosity mediu a tempestade, visto pelo Curiosity em 2015.',
      },
    },
    scienceIds: ['MAY_2024_DOSE_UGY', 'MAY_2024_CHEST_XRAYS'],
    sourceName: 'NASA/JPL, "NASA Watches Mars Light Up During Epic Solar Storm" (2024-06-10)',
    sourceUrl: MRAD_ARTICLE,
    text: {
      en: {
        title: 'A storm measured on Mars',
        body: 'On May 20, 2024, a solar storm hit Mars, and the RAD instrument on the rover Curiosity measured it in Gale Crater. An astronaut next to Curiosity would have received 8,100 micrograys, about 30 chest X-rays: that is why the shield matters.',
      },
      'pt-BR': {
        title: 'Uma tempestade medida em Marte',
        body: 'Em 20 de maio de 2024, uma tempestade solar atingiu Marte, e o instrumento RAD do rover Curiosity a mediu na Cratera Gale. Um astronauta ao lado do Curiosity teria recebido 8.100 micrograys, cerca de 30 radiografias do tórax: é por isso que o escudo importa.',
      },
    },
  },
];

const NTRS = (id: string) => `https://ntrs.nasa.gov/citations/${id}`;
const fact2 = (f: Omit<SolFact, 'mission' | 'scienceIds'>): SolFact => ({ ...f, mission: 'm2', scienceIds: [] });

/** Mission 2 facts: base design and real NASA studies, each read in full on 2026-11-14/15. */
export const SOL_FACTS_M2: SolFact[] = [
  fact2({
    id: 'm2-suits',
    sol: 1,
    photo: {
      slug: "spacesuit-materials",
      credit: "NASA/JPL-Caltech/MSSS",
      mission: "Mars 2020 Perseverance · WATSON (SHERLOC)",
      date: "released 2025-03-26",
      placeEn: "Jezero Crater, Mars (on the rover)",
      placePt: "Cratera Jezero, Marte (no rover)",
      enhancedColor: false,
      sourceUrl: "https://science.nasa.gov/photojournal/perseverance-and-sherlocs-calibration-target",
      recordId: "PIA26520",
      caption: {
            en: "The spacesuit material samples riding on the Perseverance rover, photographed on Mars by its WATSON camera.",
            'pt-BR': "As amostras de material de traje espacial que viajam no rover Perseverance, fotografadas em Marte pela câmera WATSON."
      }
    },
    sourceName: 'NASA/JPL PIA24033, "Spacesuit Materials on Perseverance\'s SHERLOC Calibration Target"',
    sourceUrl: 'https://www.jpl.nasa.gov/images/pia24033-spacesuit-materials-on-perseverances-sherloc-calibration-target/',
    text: {
      en: { title: 'Spacesuit pieces already on Mars', body: 'The rover Perseverance carries the first spacesuit materials ever sent to Mars, including a piece of helmet visor. Scientists watch how they hold up in the strong radiation on the surface.' },
      'pt-BR': { title: 'Pedaços de traje espacial já estão em Marte', body: 'O rover Perseverance leva os primeiros materiais de traje espacial enviados a Marte, incluindo um pedaço de viseira de capacete. Os cientistas observam como eles aguentam a radiação forte da superfície.' },
    },
  }),
  fact2({
    id: 'm2-oxygen-tanks',
    sol: 2,
    photo: {
      slug: "ox-storage",
      credit: "NASA/Ben Smegelsky",
      mission: "Kennedy Space Center · Launch Pad 39B",
      date: "2019-11-08",
      placeEn: "Kennedy Space Center, Florida (Earth)",
      placePt: "Kennedy Space Center, Flórida (Terra)",
      enhancedColor: false,
      sourceUrl: "https://images.nasa.gov/details/KSC-20191108-PH-JBS01_0049",
      recordId: "KSC-20191108-PH-JBS01_0049",
      caption: {
            en: "On Earth: a giant tank that keeps rocket liquid oxygen super cold at Kennedy Space Center, Florida. Not on Mars.",
            'pt-BR': "Na Terra: um tanque gigante que guarda oxigênio líquido de foguete bem gelado no Kennedy Space Center, Flórida. Não é em Marte."
      }
    },
    sourceName: 'NASA Glenn, "Liquefaction and Storage of In-Situ Oxygen on the Surface of Mars" (NTRS 20160004210)',
    sourceUrl: NTRS('20160004210'),
    text: {
      en: { title: 'Oxygen kept in tanks', body: 'NASA engineers studied how to cool oxygen made on Mars until it becomes a liquid and keep it for up to two years in tanks. Your air tank works the same way: it stores what the machine makes.' },
      'pt-BR': { title: 'Oxigênio guardado em tanques', body: 'Engenheiros da NASA estudaram como resfriar o oxigênio feito em Marte até ele virar líquido e guardá-lo por até dois anos em tanques. O seu tanque de ar funciona igual: guarda o que a máquina faz.' },
    },
  }),
  fact2({
    id: 'm2-power',
    sol: 3,
    photo: {
      slug: "kilopower",
      credit: "NASA",
      mission: "NASA Glenn Research Center",
      date: "2016-11-09",
      placeEn: "NASA Glenn Research Center, Cleveland, Ohio (Earth)",
      placePt: "NASA Glenn Research Center, Cleveland, Ohio (Terra)",
      enhancedColor: false,
      sourceUrl: "https://images.nasa.gov/details/GRC-2015-C-06315",
      recordId: "GRC-2015-C-06315",
      caption: {
            en: "On Earth, at NASA Glenn in Ohio: a test unit of the engine that would turn a small nuclear reactor's heat into electricity (no reactor in the photo).",
            'pt-BR': "Na Terra, na NASA Glenn em Ohio: uma unidade de teste do motor que transformaria o calor de um pequeno reator nuclear em eletricidade (não há reator na foto)."
      }
    },
    sourceName: 'NASA, Human Exploration of Mars Design Reference Architecture 5.0 (NASA-SP-2009-566)',
    sourceUrl: 'https://www.nasa.gov/pdf/373665main_NASA-SP-2009-566.pdf',
    text: {
      en: { title: 'Power for a real Mars base', body: 'In NASA\'s plan for a crewed Mars mission, a small nuclear power plant of 30 kilowatts sits about 1 km from the base. Power is what makes air, warmth and food possible.' },
      'pt-BR': { title: 'Energia para uma base de verdade', body: 'No plano da NASA para uma missão tripulada a Marte, uma pequena usina nuclear de 30 quilowatts fica a cerca de 1 km da base. É a energia que torna possíveis o ar, o calor e a comida.' },
    },
  }),
  fact2({
    id: 'm2-rochette',
    sol: 4,
    photo: {
      slug: 'rochette',
      credit: 'NASA/JPL-Caltech',
      mission: 'Mars 2020 Perseverance · Hazcam',
      date: '2021-09-07 (sol 196)',
      placeEn: 'Jezero Crater, Mars',
      placePt: 'Cratera Jezero, Marte',
      enhancedColor: false,
      sourceUrl: 'https://science.nasa.gov/photojournal/rochette-after-perseverance-sampling',
      recordId: 'PIA24840',
      caption: { en: 'The rock Rochette after Perseverance drilled its samples (contrast enhanced).', 'pt-BR': 'A rocha Rochette depois que o Perseverance perfurou as amostras (contraste realçado).' },
    },
    sourceName: 'NASA Photojournal PIA24840, "Rochette After Perseverance Sampling"',
    sourceUrl: 'https://science.nasa.gov/photojournal/rochette-after-perseverance-sampling',
    text: {
      en: { title: 'Holes in a Mars rock', body: 'This is the rock Rochette in Jezero, after Perseverance drilled rock cores out of it in 2021. Your rover\'s sample is like these: a small piece of Mars to study on Earth.' },
      'pt-BR': { title: 'Furos numa rocha de Marte', body: 'Esta é a rocha Rochette, em Jezero, depois que o Perseverance tirou núcleos de rocha dela em 2021. A amostra do seu rover é como essas: um pedacinho de Marte para estudar na Terra.' },
    },
  }),
  fact2({
    id: 'm2-walk',
    sol: 5,
    photo: {
      slug: "lunar-eva",
      credit: "NASA",
      mission: "Apollo 15 · lunar surface",
      date: "1971-07-31 to 08-02",
      placeEn: "The Moon, Hadley-Apennine",
      placePt: "Lua, Hadley-Apennine",
      enhancedColor: false,
      sourceUrl: "https://images.nasa.gov/details/as15-88-11901",
      recordId: "AS15-88-11901",
      caption: {
            en: "The Apollo 15 lunar rover parked alone on the Moon in 1971; it let astronauts travel farther from their lander.",
            'pt-BR': "O jipe lunar da Apollo 15 estacionado sozinho na Lua em 1971; ele deixava os astronautas irem mais longe do módulo de pouso."
      }
    },
    sourceName: 'NASA, "Exploration EVA Testing and Analogs" (NTRS 20210000827) — Moon planning',
    sourceUrl: NTRS('20210000827'),
    text: {
      en: { title: 'How far can you walk? (a Moon parallel)', body: 'For the Moon, NASA plans walks of about 2 km, because the suit must still have air to walk back. On Mars the same rule would apply; that is why your astronaut gets a warning at the edge.' },
      'pt-BR': { title: 'Até onde dá para andar? (um paralelo com a Lua)', body: 'Para a Lua, a NASA planeja caminhadas de cerca de 2 km, porque o traje ainda precisa ter ar para a volta. Em Marte valeria a mesma regra; é por isso que o seu astronauta recebe um aviso na borda.' },
    },
  }),
  fact2({
    id: 'm2-kodiak',
    sol: 6,
    photo: {
      slug: 'kodiak',
      credit: 'NASA/JPL-Caltech/ASU/MSSS',
      mission: 'Mars 2020 Perseverance · Mastcam-Z',
      date: '2021-04-18',
      placeEn: 'Jezero Crater, Mars',
      placePt: 'Cratera Jezero, Marte',
      enhancedColor: true,
      sourceUrl: 'https://science.nasa.gov/photojournal/perseverance-captures-image-of-kodiak',
      recordId: 'PIA24802',
      caption: { en: 'Kodiak, a hill in Jezero Crater, seen by Perseverance (enhanced color).', 'pt-BR': 'Kodiak, um morro na Cratera Jezero, visto pelo Perseverance (cor realçada).' },
    },
    sourceName: 'NASA Photojournal PIA24802, "Perseverance Captures Image of Kodiak"',
    sourceUrl: 'https://science.nasa.gov/photojournal/perseverance-captures-image-of-kodiak',
    text: {
      en: { title: 'A hill near your base', body: 'Kodiak is a real hill in Jezero Crater, photographed by Perseverance from far away. Scientists study its layers, like pages of a book, to read Mars\'s past.' },
      'pt-BR': { title: 'Um morro perto da sua base', body: 'Kodiak é um morro de verdade na Cratera Jezero, fotografado de longe pelo Perseverance. Os cientistas estudam as suas camadas, como páginas de um livro, para ler o passado de Marte.' },
    },
  }),
  fact2({
    id: 'm2-co2-suits',
    sol: 7,
    photo: {
      slug: "suit-backpack",
      credit: "NASA",
      mission: "Apollo spacesuit (NASA Johnson record)",
      date: "1968",
      placeEn: "Earth",
      placePt: "Terra",
      enhancedColor: false,
      sourceUrl: "https://images.nasa.gov/details/S68-34582",
      recordId: "S68-34582",
      caption: {
            en: "Inside an Apollo spacesuit backpack, photographed on Earth in 1968 with its cover removed: the gear that gives air and cleans it.",
            'pt-BR': "O interior de uma mochila de traje espacial da Apollo, fotografada na Terra em 1968 sem a tampa: o equipamento que dá ar e o limpa."
      }
    },
    // Read in full on 2026-11-15: CO2 brief OCHMO-TB-004 Rev B pp. 10–11 (flow path, why CO2 must go),
    // ECLSS brief OCHMO-TB-002 Rev A p. 18 ("pure O2 atmosphere", LiOH or METOX cartridge, humidity).
    sourceName: 'NASA-STD-3001 Technical Briefs: Carbon Dioxide (OCHMO-TB-004, pp. 10–11) and ECLSS (OCHMO-TB-002, p. 18)',
    sourceUrl: 'https://www.nasa.gov/wp-content/uploads/2023/03/co2-technical-brief-ochmo.pdf',
    text: {
      en: { title: 'How astronauts breathe in a suit', body: 'A fan in the backpack blows pure oxygen into the helmet from behind the head; it flows over the face and down through the suit. The used gas goes back to the backpack, which takes out the carbon dioxide (it causes headaches and tiredness if it builds up) and the extra wetness, and sends the oxygen around again.' },
      'pt-BR': { title: 'Como os astronautas respiram no traje', body: 'Um ventilador na mochila sopra oxigênio puro dentro do capacete, por trás da cabeça; ele passa pelo rosto e desce pelo traje. O gás usado volta para a mochila, que tira o gás carbônico (ele dá dor de cabeça e cansaço se acumular) e a umidade, e manda o oxigênio de volta.' },
    },
  }),
];

export interface NasaSource {
  id: string;
  name: string;
  what: { en: string; 'pt-BR': string };
  whereInGame: { en: string; 'pt-BR': string };
  url: string;
  mode: 'live' | 'archive';
}

/** Every NASA source the game really uses (no Mars Trek: the orbital photo is PIA23239). */
export const NASA_SOURCES: NasaSource[] = [
  {
    id: 'donki',
    name: 'NASA CCMC DONKI (Space Weather Database Of Notifications, Knowledge, Information)',
    what: {
      en: 'Real solar flares, coronal mass ejections (CMEs) and particle events, plus NASA\'s WSA-ENLIL model forecasts of when a CME reaches Mars.',
      'pt-BR': 'Erupções solares, ejeções de massa coronal (CMEs) e eventos de partículas reais, mais as previsões do modelo WSA-ENLIL da NASA de quando uma CME chega a Marte.',
    },
    whereInGame: {
      en: 'The forecast of each sol (M1.3 flare of 2024-05-10, CME of 2024-05-11 forecast to reach Mars on 2024-05-13) and the Antenna\'s answer, from a bundled archive catalog; and "The Sun this week" on the home screen, from a DONKI copy saved twice a day and shown with its date (not live).',
      'pt-BR': 'A previsão de cada sol (erupção M1.3 de 10/05/2024, CME de 11/05/2024 prevista para chegar a Marte em 13/05/2024) e a resposta da Antena, de um catálogo de arquivo dentro do jogo; e "O Sol nesta semana" na tela inicial, de uma cópia do DONKI salva duas vezes por dia e mostrada com a sua data (não é ao vivo).',
    },
    url: 'https://ccmc.gsfc.nasa.gov/DONKI/',
    mode: 'archive',
  },
  {
    id: 'curiosity-rad',
    name: 'Curiosity RAD (NASA/JPL, "NASA Watches Mars Light Up During Epic Solar Storm", 2024-06-10)',
    what: {
      en: 'Radiation measured on the surface of Mars by RAD on the rover Curiosity, in Gale Crater: 8,100 micrograys, about 30 chest X-rays, during the storm of May 20, 2024; and about 210 micrograys a day on calm days (NASA PIA17600).',
      'pt-BR': 'Radiação medida na superfície de Marte pelo RAD do rover Curiosity, na Cratera Gale: 8.100 micrograys, cerca de 30 radiografias do tórax, na tempestade de 20 de maio de 2024; e cerca de 210 micrograys por dia em dias calmos (NASA PIA17600).',
    },
    whereInGame: {
      en: 'The fact of sol 7, the May 2024 storm card, mission 2 "The May storm" (risk 3), and the Shield card.',
      'pt-BR': 'O fato do sol 7, o cartão da tempestade de maio de 2024, a missão 2 "A tempestade de maio" (risco 3) e o cartão do Escudo.',
    },
    url: MRAD_ARTICLE,
    mode: 'archive',
  },
  {
    id: 'moxie',
    name: 'MOXIE (NASA/JPL, Mars 2020 Perseverance)',
    what: {
      en: 'A machine on the rover Perseverance that made 122 g of oxygen from Mars air in 16 runs, up to 12 g an hour (2021–2023).',
      'pt-BR': 'Uma máquina no rover Perseverance que fez 122 g de oxigênio com o ar de Marte em 16 operações, até 12 g por hora (2021–2023).',
    },
    whereInGame: {
      en: 'The fact of sol 1 and the Life Support card: proof that power can turn Mars air into oxygen.',
      'pt-BR': 'O fato do sol 1 e o cartão do Suporte à Vida: a prova de que energia pode transformar o ar de Marte em oxigênio.',
    },
    url: 'https://www.jpl.nasa.gov/news/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/',
    mode: 'archive',
  },
  {
    id: 'mars-fact-sheet',
    name: 'NASA Mars Fact Sheet (NSSDCA)',
    what: {
      en: 'Measured facts about Mars: air 95.1% carbon dioxide, sunlight 0.431 of Earth\'s, average −59 °C, daily range −89 to −31 °C, gravity 3.73 m/s², a sol of 24.6597 hours.',
      'pt-BR': 'Fatos medidos sobre Marte: ar com 95,1% de gás carbônico, luz do Sol 0,431 da da Terra, média de −59 °C, variação diária de −89 a −31 °C, gravidade de 3,73 m/s², um sol de 24,6597 horas.',
    },
    whereInGame: {
      en: 'The thermometer and the fact of sol 4 (heating takes 3 cells), and the cards for power cells, air, heating and the sol.',
      'pt-BR': 'O termômetro e o fato do sol 4 (o aquecimento leva 3 células), e os cartões de células de energia, ar, aquecimento e sol.',
    },
    url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html',
    mode: 'archive',
  },
  {
    id: 'mars-facts',
    name: 'NASA Science, Mars Facts',
    what: {
      en: 'Mars has no global magnetic field today, so space particles reach its surface more easily than on Earth.',
      'pt-BR': 'Marte não tem campo magnético global hoje, então as partículas do espaço chegam à superfície com mais facilidade que na Terra.',
    },
    whereInGame: {
      en: 'The fact of sol 3 and the Shield card: why the base needs a shield.',
      'pt-BR': 'O fato do sol 3 e o cartão do Escudo: por que a base precisa de um escudo.',
    },
    url: 'https://science.nasa.gov/mars/facts/',
    mode: 'archive',
  },
  {
    id: 'bvad',
    name: 'NASA BVAD (Baseline Values and Assumptions Document, NASA/TP-2015-218570/REV2)',
    what: {
      en: 'How much oxygen a crew member uses: about 0.895 kg a day.',
      'pt-BR': 'Quanto oxigênio um tripulante usa: cerca de 0,895 kg por dia.',
    },
    whereInGame: {
      en: 'The Air card: why the crew of 4 needs new air every sol.',
      'pt-BR': 'O cartão do Ar: por que a tripulação de 4 pessoas precisa de ar novo a cada sol.',
    },
    url: 'https://ntrs.nasa.gov/citations/20210024855',
    mode: 'archive',
  },
  {
    id: 'veggie',
    name: 'NASA Veggie (Vegetable Production System, ISS)',
    what: {
      en: 'Red romaine lettuce grew for 33 days in the Veggie chamber on the ISS.',
      'pt-BR': 'Uma alface romana roxa cresceu por 33 dias na câmara Veggie, na ISS.',
    },
    whereInGame: {
      en: 'The fact of sol 2 and the Greenhouse card: the game squeezes the wait into 2 sols.',
      'pt-BR': 'O fato do sol 2 e o cartão da Estufa: o jogo encurta a espera para 2 sóis.',
    },
    url: 'https://www.nasa.gov/wp-content/uploads/2019/04/veggie_fact_sheet_508.pdf',
    mode: 'archive',
  },
  {
    id: 'space-comms',
    name: 'NASA, "Space Communications: 7 Things You Need to Know" (2020-10-06)',
    what: {
      en: 'A radio signal between Mars and Earth takes about 4 minutes at the closest and about 24 minutes at the farthest, one way.',
      'pt-BR': 'Um sinal de rádio entre Marte e a Terra leva cerca de 4 minutos quando estão mais perto e cerca de 24 minutos quando estão mais longe, só a ida.',
    },
    whereInGame: {
      en: 'The fact of sol 6 and the Ask Earth card: why the answer comes only at night, and is off during a 10-second crisis.',
      'pt-BR': 'O fato do sol 6 e o cartão Perguntar à Terra: por que a resposta só chega à noite e fica desligada numa crise de 10 segundos.',
    },
    url: 'https://www.nasa.gov/centers-and-facilities/goddard/space-communications-7-things-you-need-to-know/',
    mode: 'archive',
  },
  {
    id: 'opportunity-dust',
    name: 'NASA Science, "On Mars, Light Is Energy" (2018-06-13)',
    what: {
      en: 'In the 2018 dust storm the sky reached a tau of 10.5 and the rover Opportunity got only 21 Wh of energy, its lowest ever.',
      'pt-BR': 'Na tempestade de poeira de 2018 o céu chegou a um tau de 10,5 e o rover Opportunity recebeu só 21 Wh de energia, o menor valor da sua história.',
    },
    whereInGame: {
      en: 'The Dust card: why a dust sol gives only 6 cells.',
      'pt-BR': 'O cartão da Poeira: por que um sol de poeira dá só 6 células.',
    },
    url: 'https://science.nasa.gov/resource/on-mars-light-is-energy/',
    mode: 'archive',
  },
  {
    id: 'photojournal',
    name: 'NASA Photojournal (JPL)',
    what: {
      en: 'Real photos from Mars and of MOXIE: Jezero Crater, its delta, Kodiak, Rochette, Jezero from orbit, a sunset and Earth seen from Gale Crater. Also the 2.3 km distance to the Jezero delta (PIA24485).',
      'pt-BR': 'Fotos reais de Marte e do MOXIE: a Cratera Jezero, o seu delta, Kodiak, Rochette, Jezero vista da órbita, um pôr do sol e a Terra vista da Cratera Gale. Também a distância de 2,3 km até o delta de Jezero (PIA24485).',
    },
    whereInGame: {
      en: 'Home screen horizon, the facts of the sol, expedition sites and map, the end of the mission, each with a REAL PHOTO badge.',
      'pt-BR': 'Horizonte da tela inicial, os fatos do sol, os lugares e o mapa da expedição, o fim da missão, cada um com o selo FOTO REAL.',
    },
    url: 'https://science.nasa.gov/photojournal/',
    mode: 'archive',
  },
  {
    id: 'nasa-studies',
    name: 'NASA technical studies (NTRS 20160004210, 20210000827; NASA-SP-2009-566; NASA-STD-3001 technical briefs OCHMO-TB-002 and OCHMO-TB-004; PIA24033)',
    what: {
      en: 'How a real Mars base would work: oxygen stored as a liquid in tanks, a 30-kilowatt power plant, how astronauts breathe inside a suit, how far they may walk (Moon planning), and spacesuit materials already on Mars.',
      'pt-BR': 'Como uma base de verdade em Marte funcionaria: oxigênio guardado como líquido em tanques, uma usina de 30 quilowatts, como os astronautas respiram dentro do traje, até onde podem andar (planejamento da Lua) e materiais de traje que já estão em Marte.',
    },
    whereInGame: {
      en: 'The facts of mission 2, the air tank and the walking-limit warning.',
      'pt-BR': 'Os fatos da missão 2, o tanque de ar e o aviso de limite ao andar.',
    },
    url: 'https://ntrs.nasa.gov/',
    mode: 'archive',
  },
  {
    id: 'mars-sky',
    name: 'NASA Science, "What Do Sunrises and Sunsets Look Like on Mars?"',
    what: {
      en: 'By day the Mars sky is yellow to orange from the dust; at sunset it turns blue near the Sun. From Mars the Sun looks about two-thirds the size we see from Earth.',
      'pt-BR': 'De dia o céu de Marte é amarelo a laranja por causa da poeira; no pôr do sol ele fica azul perto do Sol. De Marte, o Sol parece ter cerca de dois terços do tamanho que vemos da Terra.',
    },
    whereInGame: {
      en: 'The "Look at the sky" view in the 3D base: the sky colors and the sky fact.',
      'pt-BR': 'A vista "Olhar o céu" na base 3D: as cores do céu e o fato do céu.',
    },
    url: 'https://science.nasa.gov/solar-system/planets/mars/what-does-a-sunrise-sunset-look-like-on-mars/',
    mode: 'archive',
  },
  {
    id: 'images-nasa',
    name: 'NASA Image and Video Library (images.nasa.gov)',
    what: {
      en: 'A real photo of plants growing on the ISS in the Advanced Plant Habitat (iss072e404269, 2024-12-27).',
      'pt-BR': 'Uma foto real de plantas crescendo na ISS, na Advanced Plant Habitat (iss072e404269, 27/12/2024).',
    },
    whereInGame: {
      en: 'The Greenhouse card and the fact of sol 2.',
      'pt-BR': 'O cartão da Estufa e o fato do sol 2.',
    },
    url: 'https://images.nasa.gov/details/iss072e404269',
    mode: 'archive',
  },
  {
    id: 'svs',
    name: 'NASA Scientific Visualization Studio (SVS 14592, SDO)',
    what: {
      en: 'A real image of the X8.7 solar flare of May 14, 2024, seen by NASA\'s Solar Dynamics Observatory, in enhanced color.',
      'pt-BR': 'Uma imagem real da erupção solar X8.7 de 14 de maio de 2024, vista pelo Solar Dynamics Observatory da NASA, em cores realçadas.',
    },
    whereInGame: {
      en: 'Solar event cards, the crisis screen and the fact of sol 3 (shown as a flare picture, not as the event of the sol).',
      'pt-BR': 'Cartões de eventos solares, a tela de crise e o fato do sol 3 (mostrada como imagem de uma erupção, não como o evento do sol).',
    },
    url: 'https://svs.gsfc.nasa.gov/14592',
    mode: 'archive',
  },
];
