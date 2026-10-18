/**
 * Nexus Write — Stop Word and Lexical Knowledge Base
 * Transparent, explainable dictionaries for rule-based analysis.
 */

export const DEFAULT_STOP_WORDS: string[] = [
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'and', 'or', 'but', 'if', 'because', 'as', 'until', 'while', 'of', 'at',
  'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out',
  'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
  'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
  'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now', 'this',
  'that', 'these', 'those', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs',
  'we', 'us', 'our', 'ours', 'you', 'your', 'yours', 'he', 'him', 'his', 'she', 'her'
];

export const FILLER_WORDS_DICT: Record<string, string[]> = {
  very: ['extremely', 'deeply', 'profoundly', 'or simply omit'],
  really: ['genuinely', 'substantially', 'truly', 'or simply omit'],
  basically: ['fundamentally', 'in essence', 'primarily', 'or omit'],
  actually: ['in fact', 'in reality', 'demonstrably', 'or omit'],
  just: ['simply', 'merely', 'solely', 'or omit'],
  quite: ['notably', 'considerably', 'rather'],
  perhaps: ['possibly', 'plausibly', 'it is feasible that'],
  maybe: ['potentially', 'conceivably'],
  literally: ['precisely', 'verifiably', 'or omit if used for emphasis'],
  sorta: ['somewhat', 'partially'],
  kindof: ['somewhat', 'in part'],
  somewhat: ['moderately', 'to a degree']
};

export const VAGUE_WORDS_DICT: Record<string, string> = {
  thing: 'specify the exact object, concept, factor, or mechanism',
  things: 'specify items, elements, principles, or components',
  stuff: 'specify materials, content, data, or equipment',
  good: 'consider specific descriptors like effective, beneficial, or exemplary',
  bad: 'consider deficient, adverse, harmful, or substandard',
  nice: 'consider courteous, elegant, refined, or pleasant',
  big: 'consider vast, substantial, comprehensive, or sizable',
  small: 'consider minute, minor, compact, or negligible',
  many: 'provide an estimate or specify numerous, diverse, or extensive',
  some: 'specify a subset, several, or particular instances',
  lots: 'consider an abundance of, extensive, or a large volume of',
  'a lot': 'consider substantially, significantly, or considerably'
};

export const WEAK_GENERIC_WORDS: Record<string, string> = {
  important: 'Explain WHY it is vital (e.g., critical, fundamental, indispensable).',
  interesting: 'Specify the intriguing mechanism or notable implication.',
  great: 'Replace with specific praise like impactful, superior, or pivotal.',
  deal: 'Specify arrangement, transaction, compromise, or proportion.',
  get: 'Use obtain, acquire, achieve, or develop.',
  got: 'Use received, procured, or derived.',
  make: 'Use construct, generate, formulate, or produce.'
};

export const CONFUSED_WORDS: {
  pair: [string, string];
  contextRegex: RegExp;
  errorWord: string;
  correctWord: string;
  explanation: string;
}[] = [
  {
    pair: ['their', 'there'],
    contextRegex: /\b(their)\s+(is|are|was|were|will|has|have)\b/i,
    errorWord: 'their',
    correctWord: 'there',
    explanation: "'Their' is possessive. Use 'there' to refer to a place or existence ('there is/are')."
  },
  {
    pair: ['there', 'their'],
    contextRegex: /\b(there)\s+(car|dog|house|work|opinion|book|paper|ideas|results)\b/i,
    errorWord: 'there',
    correctWord: 'their',
    explanation: "'There' indicates place. Use 'their' to denote ownership."
  },
  {
    pair: ['your', "you're"],
    contextRegex: /\b(your)\s+(going|welcome|doing|making|writing|thinking)\b/i,
    errorWord: 'your',
    correctWord: "you're",
    explanation: "'Your' is possessive. Use \"you're\" as a contraction for 'you are'."
  },
  {
    pair: ['its', "it's"],
    contextRegex: /\b(it's)\s+(surface|color|impact|purpose|conclusion|structure)\b/i,
    errorWord: "it's",
    correctWord: 'its',
    explanation: "\"It's\" is a contraction for 'it is'. Use 'its' for the possessive form."
  },
  {
    pair: ['effect', 'affect'],
    contextRegex: /\b(to|will|can|might|could)\s+(effect)\b/i,
    errorWord: 'effect',
    correctWord: 'affect',
    explanation: "Usually, 'affect' is a verb ('to influence') while 'effect' is a noun ('a result')."
  }
];

export const TONE_LEXICON = {
  academic: [
    'hypothesize', 'empirical', 'methodology', 'framework', 'paradigm', 'correlation',
    'implication', 'corroborate', 'substantiate', 'quantify', 'theoretical', 'discern'
  ],
  formal: [
    'furthermore', 'moreover', 'consequently', 'subsequently', 'nevertheless', 'accordingly',
    'demonstrates', 'illustrates', 'pertains', 'constitutes', 'wherein', 'hence'
  ],
  informal: [
    'yeah', 'gonna', 'wanna', 'kinda', 'awesome', 'cool', 'super', 'yep', 'nope',
    'ok', 'okay', 'stuff', 'guy', 'dude', 'tbh', 'imo', 'btw'
  ],
  persuasive: [
    'must', 'imperative', 'undeniable', 'crucial', 'essential', 'compelling',
    'paramount', 'decisive', 'evident', 'unquestionable', 'vital', 'urgent'
  ],
  emotional: [
    'heartbreaking', 'furious', 'ecstatic', 'terrifying', 'overwhelmed', 'devastating',
    'blissful', 'tragic', 'horrific', 'phenomenal', 'agonizing', 'inspiring'
  ]
};
