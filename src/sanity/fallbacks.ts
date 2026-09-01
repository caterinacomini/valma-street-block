import type {
  HomeContent,
  HowToArrive,
  PastEdition,
  ProgramItem,
  Regulation,
  SiteSettings,
} from "./types";

/**
 * What the site says when Sanity has nothing to say — either because a field is
 * empty or because the API cannot be reached. Kept apart from fetch.ts so that
 * scripts running outside Next can import them: fetch.ts reaches for
 * next/headers to tell a preview from the real thing, and next/headers throws
 * anywhere there is no request.
 */

export const FALLBACK_SITE_SETTINGS: SiteSettings = {
  title: "Valma Street Block",
  editionNumber: 11,
  heroImage: null,
  eventDate: "2027-04-10",
  rainDate: "2027-04-17",
  postponed: false,
  location: "Valmadrera (LC)",
  intro:
    "Un giorno di boulder in mezzo al paese. Muri, cornicioni e angoli di città diventano blocchi da chiudere. Poi si balla.",
  registrationUrl: undefined,
  registrationOpen: false,
  registrationLabel: undefined,
  registrationClosedLabel: undefined,
  instagramUrl: "https://www.instagram.com/valmastreetblock_/",
  facebookUrl: "https://www.facebook.com/ValmaStreetBlock/",
  contactEmail: "segreteria@caivalmadrera.it",
  organizers: "Organizzato da CAI Valmadrera e OSA Valmadrera",
  patronage:
    "Con il patrocinio dei Comuni di Valmadrera e Civate",
  photoCredit:
    "Fotografie di Clara Rusconi e Daniela Rusconi — Fotoclub G. Anghileri, Valmadrera",
};

export const FALLBACK_PROGRAM = [
  {
    _id: "fallback-1",
    title: "Ritiro pettorali",
    time: "10:30",
    endTime: undefined,
    description: "Consegna di pacco gara e pettorale. Da qui parte tutto.",
    location: "Parco via Leopardi",
    category: "ritrovo",
  },
  {
    _id: "fallback-2",
    title: "Via alla gara",
    time: "12:30",
    endTime: "18:00",
    description:
      "Cinque ore e mezza tra muri e cortili: si prova, si riprova, i giudici segnano.",
    location: "Centro Valmadrera",
    category: "gara",
  },
  {
    _id: "fallback-3",
    title: "Finali e premiazioni",
    time: "19:00",
    endTime: undefined,
    description: "I migliori tornano a scalare davanti a tutti, a vista. Poi i premi.",
    location: "Parco via Leopardi",
    category: "premiazioni",
  },
  {
    _id: "fallback-4",
    title: "DJ set",
    time: "21:00",
    endTime: undefined,
    description: "Si resta al parco fino a tardi.",
    location: "Parco via Leopardi",
    category: "festa",
  },
] satisfies ProgramItem[];

export const FALLBACK_PAST_EDITIONS = [
  {
    _id: "fallback-2026",
    year: 2026,
    editionNumber: 10,
    coverImage: null,
    gallery: [],
    highlights:
      "Decima edizione: oltre 470 climbers in gara, 33% donne, 130 volontari e 50 blocchi tra Valmadrera e Civate.",
    participantsCount: 470,
  },
  {
    _id: "fallback-2025",
    year: 2025,
    editionNumber: 9,
    coverImage: null,
    gallery: [],
    highlights:
      "Nona edizione ospitata a Civate: oltre 400 partecipanti e 40 blocchi tra le vie del paese.",
    participantsCount: 400,
  },
  {
    _id: "fallback-2024",
    year: 2024,
    editionNumber: 8,
    coverImage: null,
    gallery: [],
    highlights: "Ottava edizione tra le vie di Valmadrera.",
    participantsCount: 420,
  },
  {
    _id: "fallback-2023",
    year: 2023,
    editionNumber: 7,
    coverImage: null,
    gallery: [],
    highlights: "Settima edizione.",
    participantsCount: 400,
  },
  {
    _id: "fallback-2022",
    year: 2022,
    editionNumber: 6,
    coverImage: null,
    gallery: [],
    highlights: "Sesta edizione, il ritorno in piazza dopo la pausa.",
    participantsCount: 350,
  },
  {
    _id: "fallback-2019",
    year: 2019,
    editionNumber: 5,
    coverImage: null,
    gallery: [],
    highlights: "Quinta edizione.",
    participantsCount: 300,
  },
  {
    _id: "fallback-2018",
    year: 2018,
    editionNumber: 4,
    coverImage: null,
    gallery: [],
    highlights: "Quarta edizione.",
    participantsCount: 260,
  },
  {
    _id: "fallback-2017",
    year: 2017,
    editionNumber: 3,
    coverImage: null,
    gallery: [],
    highlights: "Terza edizione.",
    participantsCount: 220,
  },
  {
    _id: "fallback-2016",
    year: 2016,
    editionNumber: 2,
    coverImage: null,
    gallery: [],
    highlights: "Seconda edizione.",
    participantsCount: 180,
  },
  {
    _id: "fallback-2015",
    year: 2015,
    editionNumber: 1,
    coverImage: null,
    gallery: [],
    highlights:
      "La prima edizione, nata dall'idea di sette ragazzi di Valmadrera.",
    participantsCount: 120,
  },
] satisfies PastEdition[];

export const FALLBACK_REGULATION: Regulation = {
  title: "Regolamento",
  faq: [
    {
      title: "Generale",
      items: [
        {
          question: "Cos'è il Valma Street Block?",
          answer:
            "Una gara di arrampicata urbana: per un giorno muri, cornicioni e angoli di Valmadrera diventano blocchi da scalare. Nasce nel 2015 dall'idea di sette ragazzi del paese ed è organizzata da CAI Valmadrera e OSA Valmadrera.",
        },
        {
          question: "Come funziona la gara?",
          answer:
            "Circa 50 blocchi sparsi per il paese: passaggi brevi ma intensi. Un giudice valuta l'effettivo completamento di ogni blocco. I migliori accedono alle finali serali.",
        },
        {
          question: "Devo essere un climber esperto?",
          answer:
            "No. Ci sono una categoria competitiva e una amatoriale: si contano anche i blocchi chiusi dai non competitivi. L'idea è scalare tutti insieme, a qualsiasi livello.",
        },
        {
          question: "E se piove?",
          answer:
            "In caso di maltempo l'evento viene recuperato nella data di riserva comunicata dall'organizzazione. Controlla i canali social per gli aggiornamenti.",
        },
      ],
    },
    {
      title: "Iscrizioni",
      items: [
        {
          question: "Quanto costa e come mi iscrivo?",
          answer:
            "L'iscrizione si fa online tramite la piattaforma Kronoman. Le quote delle ultime edizioni erano di 20€ per gli adulti e 15€ per i minorenni; il giorno stesso, se restano posti, 25€.",
        },
        {
          question: "L'iscrizione è rimborsabile?",
          answer:
            "No, la quota di iscrizione non è rimborsabile. L'iscrizione è valida quando il pagamento è andato a buon fine e il modulo firmato è stato caricato.",
        },
        {
          question: "Cosa comprende il pacco gara?",
          answer:
            "Braccialetto identificativo, mappa dei blocchi, pettorale, maglietta dell'evento, buoni per pasto e bevanda e i gadget dei partner.",
        },
        {
          question: "Posso partecipare se sono minorenne?",
          answer:
            "Sì, ma i minorenni devono essere accompagnati da un genitore o da chi ne fa le veci.",
        },
      ],
    },
    {
      title: "Sicurezza",
      items: [
        {
          question: "Come sono protetti i blocchi?",
          answer:
            "I passaggi più esposti sono protetti da materassi e crash pad posizionati dall'organizzazione. Sugli altri blocchi è consigliato usare un proprio crash pad.",
        },
        {
          question: "Posso noleggiare un crash pad?",
          answer:
            "Sì, nelle scorse edizioni il noleggio era disponibile tramite Brazz direttamente in loco.",
        },
        {
          question: "Serve un'assicurazione?",
          answer:
            "I soci CAI sono già coperti. Chi non è socio può acquistare l'assicurazione infortuni giornaliera al momento dell'iscrizione (8,40€ nelle ultime edizioni).",
        },
      ],
    },
  ],
  pdfUrl: null,
  updatedAt: undefined,
};

export const FALLBACK_HOME: HomeContent = {
  introHeading: "Le vie di Valmadrera diventano una palestra a cielo aperto.",
  introText:
    "Nato dall'idea di sette ragazzi di Valmadrera, oggi è uno degli appuntamenti di arrampicata urbana più sentiti del nord Italia.",
  claim: "100% in strada",
  claimText:
    "Nessuna parete artificiale: si scala sui muri, sulle pietre e nei cortili del paese.",
  introPhotos: [],
  /* Left empty on purpose: the first number reads the last edition's
     participant count, which this module has no access to. The page fills it. */
  stats: [],
  closingHeading: "Bagai, pronti a scalare il paese?",
  closingText:
    "50 blocchi tra muri, cornicioni e vicoli. Competitivi o meno, si scala tutti insieme.",
  closingImage: null,
};

export const FALLBACK_HOW_TO_ARRIVE: HowToArrive = {
  /* Deliberately does not repeat the address: with the map gone the address
     carries the section at display size, and saying "parco di via Leopardi"
     in both places read as a stutter. */
  intro:
    "Punto di partenza di tutte le stazioni di gara sparse per il paese.",
  address: "Parco di via Leopardi, Valmadrera (LC)",
  carInfo:
    "Da Lecco: SS36 direzione Colico, uscita Valmadrera. Parcheggi segnalati nei pressi del centro.",
  publicTransportInfo:
    "Conserva i biglietti e mostrali all'iscrizione: l'organizzazione ti riserva un piccolo riconoscimento.",
  mapEmbedUrl: "https://maps.google.com/?q=Valmadrera+LC",
};
