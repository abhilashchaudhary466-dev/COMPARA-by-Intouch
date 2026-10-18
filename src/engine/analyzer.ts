/**
 * Nexus Write — Authoritative Analysis Engine (TypeScript Mirror of Python Engine)
 * Pure explainable rules, deterministic metrics, and pedagogical clarity.
 */

import {
  DEFAULT_STOP_WORDS,
  FILLER_WORDS_DICT,
  VAGUE_WORDS_DICT,
  WEAK_GENERIC_WORDS,
  CONFUSED_WORDS,
  TONE_LEXICON
} from './stopWords.ts';
import {
  TextAnalysis,
  ComparisonAnalysis,
  SentenceAnalysis,
  GrammarIssue,
  TopImprovement,
  WritingGoal,
  WritingFingerprint,
  ToneCategory,
  DiversityCategory,
  ReadabilityCategory
} from '../types/index.ts';

// ---------------------------------------------------------------------------
// 1. Text Cleaning & Tokenization
// ---------------------------------------------------------------------------

export function cleanText(text: string): string {
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ');
}

export function tokenizeWords(text: string): string[] {
  if (!text) return [];
  const matches = text.toLowerCase().match(/\b[a-zA-Z0-9']+\b/g);
  return matches || [];
}

export function splitSentences(text: string): string[] {
  if (!text || !text.trim()) return [];
  // Split on punctuation (. ! ?) followed by whitespace, or paragraph line breaks
  const raw = text.trim().split(/(?<=[.!?])\s+|\n+/);
  return raw.map(s => s.trim()).filter(s => s.length > 0);
}

export function countWords(words: string[]): number {
  return words.length;
}

export function countSentences(sentences: string[]): number {
  return sentences.length;
}

export function countParagraphs(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.split(/\n+/).filter(p => p.trim().length > 0).length;
}

export function calculateAverageWordLength(words: string[]): number {
  if (!words.length) return 0;
  const totalLetters = words.reduce((acc, w) => acc + w.length, 0);
  return Number((totalLetters / words.length).toFixed(2));
}

export function calculateAverageSentenceLength(words: string[], sentences: string[]): number {
  if (!sentences.length) return 0;
  return Number((words.length / sentences.length).toFixed(2));
}

// ---------------------------------------------------------------------------
// 2. Frequency Analysis & Repetition
// ---------------------------------------------------------------------------

export function countWordFrequency(words: string[]): Record<string, number> {
  const freqs: Record<string, number> = {};
  for (const word of words) {
    freqs[word] = (freqs[word] || 0) + 1;
  }
  return freqs;
}

export function findRepeatedWords(
  freqs: Record<string, number>,
  totalWords: number,
  stopWords: Set<string>,
  threshold: number = 3
) {
  const repeated: { word: string; count: number; percentage: number }[] = [];
  for (const [word, count] of Object.entries(freqs)) {
    if (count >= threshold && !stopWords.has(word) && word.length > 2) {
      const percentage = Number(((count / (totalWords || 1)) * 100).toFixed(1));
      repeated.push({ word, count, percentage });
    }
  }
  return repeated.sort((a, b) => b.count - a.count);
}

// ---------------------------------------------------------------------------
// 3. Style & Lexical Analyzers
// ---------------------------------------------------------------------------

export function findFillerWords(words: string[]) {
  const counts: Record<string, number> = {};
  for (const w of words) {
    if (FILLER_WORDS_DICT[w]) {
      counts[w] = (counts[w] || 0) + 1;
    }
  }
  return Object.entries(counts).map(([word, count]) => ({
    word,
    count,
    suggestions: FILLER_WORDS_DICT[word] || ['Consider removing']
  }));
}

export function findVagueWords(words: string[]) {
  const counts: Record<string, number> = {};
  for (const w of words) {
    if (VAGUE_WORDS_DICT[w]) {
      counts[w] = (counts[w] || 0) + 1;
    }
  }
  return Object.entries(counts).map(([word, count]) => ({
    word,
    count,
    suggestion: VAGUE_WORDS_DICT[word] || 'Consider a more precise term'
  }));
}

export function findWeakGenericWords(words: string[]) {
  const counts: Record<string, number> = {};
  for (const w of words) {
    if (WEAK_GENERIC_WORDS[w]) {
      counts[w] = (counts[w] || 0) + 1;
    }
  }
  return Object.entries(counts).map(([word, count]) => ({
    word,
    count,
    advice: WEAK_GENERIC_WORDS[word] || 'Clarify the specific significance'
  }));
}

// ---------------------------------------------------------------------------
// 4. Sentence Level & Variety Analysis
// ---------------------------------------------------------------------------

export function analyzeSentenceList(
  sentences: string[],
  longSentenceThreshold: number,
  stopWords: Set<string>
): SentenceAnalysis[] {
  return sentences.map((sentText, index) => {
    const sWords = tokenizeWords(sentText);
    const wordCount = sWords.length;
    const isLong = wordCount > longSentenceThreshold;
    
    let classification: 'SHORT' | 'MEDIUM' | 'LONG' = 'MEDIUM';
    if (wordCount <= 12) classification = 'SHORT';
    else if (wordCount > 22) classification = 'LONG';

    const fillers = sWords.filter(w => !!FILLER_WORDS_DICT[w]);
    const vagues = sWords.filter(w => !!VAGUE_WORDS_DICT[w]);
    
    // Repeated words inside this single sentence
    const localFreq: Record<string, number> = {};
    for (const w of sWords) {
      if (!stopWords.has(w) && w.length > 2) {
        localFreq[w] = (localFreq[w] || 0) + 1;
      }
    }
    const repeatsInSentence = Object.entries(localFreq)
      .filter(([_, count]) => count >= 2)
      .map(([word]) => word);

    const issues: string[] = [];
    if (isLong) issues.push(`Sentence exceeds ${longSentenceThreshold} words (${wordCount} words)`);
    if (fillers.length > 0) issues.push(`Contains filler words: ${fillers.join(', ')}`);
    if (vagues.length > 0) issues.push(`Contains vague words: ${vagues.join(', ')}`);
    if (repeatsInSentence.length > 0) issues.push(`Repeats "${repeatsInSentence.join(', ')}" within same sentence`);

    return {
      index: index + 1,
      text: sentText,
      wordCount,
      charCount: sentText.length,
      isLong,
      classification,
      fillerWords: Array.from(new Set(fillers)),
      vagueWords: Array.from(new Set(vagues)),
      repeatedWords: repeatsInSentence,
      issues
    };
  });
}

export function calculateSentenceVariation(sentences: SentenceAnalysis[]) {
  if (!sentences.length) {
    return {
      short: 0,
      medium: 0,
      long: 0,
      shortPercent: 0,
      mediumPercent: 0,
      longPercent: 0,
      varietyScore: 0,
      description: 'Add text to evaluate sentence rhythm and length distribution.'
    };
  }

  const short = sentences.filter(s => s.classification === 'SHORT').length;
  const medium = sentences.filter(s => s.classification === 'MEDIUM').length;
  const long = sentences.filter(s => s.classification === 'LONG').length;
  const total = sentences.length;

  const shortPercent = Number(((short / total) * 100).toFixed(1));
  const mediumPercent = Number(((medium / total) * 100).toFixed(1));
  const longPercent = Number(((long / total) * 100).toFixed(1));

  // Balanced distribution gives higher variety score
  const nonZeroBuckets = [short, medium, long].filter(count => count > 0).length;
  const idealBalance = 100 - (Math.abs(shortPercent - 33.3) + Math.abs(mediumPercent - 33.3) + Math.abs(longPercent - 33.3)) / 2;
  const varietyScore = Math.max(30, Math.min(100, Math.round(idealBalance * (nonZeroBuckets / 3))));

  let description = 'Excellent rhythmic variation with a strong balance of short, medium, and long structures.';
  if (nonZeroBuckets === 1) {
    description = 'Monotonous sentence lengths. Introducing shorter impact sentences will improve cadence.';
  } else if (varietyScore < 60) {
    description = 'Moderate variety. Mix concise punchy lines with moderate explanatory clauses.';
  }

  return {
    short,
    medium,
    long,
    shortPercent,
    mediumPercent,
    longPercent,
    varietyScore,
    description
  };
}

// ---------------------------------------------------------------------------
// 5. Vocabulary Diversity
// ---------------------------------------------------------------------------

export function calculateVocabularyDiversity(words: string[], stopWords: Set<string>) {
  const meaningfulWords = words.filter(w => !stopWords.has(w) && w.length > 1);
  if (!meaningfulWords.length) {
    return {
      uniqueMeaningfulCount: 0,
      meaningfulWordsCount: 0,
      diversityPercentage: 0,
      category: 'LOW' as DiversityCategory,
      explanation: 'No meaningful content words found to evaluate.'
    };
  }

  const uniqueSet = new Set(meaningfulWords);
  const diversityPercentage = Number(((uniqueSet.size / meaningfulWords.length) * 100).toFixed(1));

  let category: DiversityCategory = 'MODERATE';
  if (diversityPercentage >= 75) category = 'HIGH';
  else if (diversityPercentage < 50) category = 'LOW';

  const explanation = `Vocabulary diversity is ${category.toLowerCase()} because ${diversityPercentage}% of meaningful words are unique (${uniqueSet.size} unique out of ${meaningfulWords.length} meaningful words).`;

  return {
    uniqueMeaningfulCount: uniqueSet.size,
    meaningfulWordsCount: meaningfulWords.length,
    diversityPercentage,
    category,
    explanation
  };
}

// ---------------------------------------------------------------------------
// 6. Readability & Writing Quality (Explainable Formulas)
// ---------------------------------------------------------------------------

export function calculateReadability(
  avgSentenceLen: number,
  avgWordLen: number,
  longSentenceRatio: number
) {
  let score = 100;
  const factors: { factor: string; impact: string }[] = [];

  if (avgSentenceLen > 24) {
    score -= 25;
    factors.push({ factor: 'Average Sentence Length (>24 words)', impact: '-25 pts (dense clauses)' });
  } else if (avgSentenceLen > 18) {
    score -= 10;
    factors.push({ factor: 'Average Sentence Length (19-24 words)', impact: '-10 pts (moderate length)' });
  } else {
    factors.push({ factor: 'Average Sentence Length (<18 words)', impact: 'Optimal flow (+0 penalty)' });
  }

  if (avgWordLen > 6.0) {
    score -= 15;
    factors.push({ factor: 'Average Word Length (>6.0 letters)', impact: '-15 pts (heavy polysyllabic vocabulary)' });
  } else {
    factors.push({ factor: 'Average Word Length (balanced)', impact: 'Clear phrasing (+0 penalty)' });
  }

  if (longSentenceRatio > 0.35) {
    score -= 20;
    factors.push({ factor: 'Run-on Risk (>35% long sentences)', impact: '-20 pts (risk of reader cognitive overload)' });
  } else if (longSentenceRatio > 0.20) {
    score -= 10;
    factors.push({ factor: 'Long Sentences (20-35%)', impact: '-10 pts' });
  }

  score = Math.max(25, Math.min(100, Math.round(score)));

  let category: ReadabilityCategory = 'NEEDS IMPROVEMENT';
  if (score >= 82) category = 'EXCELLENT';
  else if (score >= 68) category = 'GOOD';
  else if (score >= 50) category = 'MODERATE';

  return {
    score,
    category,
    factors
  };
}

export function calculateWritingQuality(
  clarity: number,
  readability: number,
  vocabulary: number,
  sentenceVariety: number,
  repetition: number,
  structure: number
) {
  const overall = Math.round(
    clarity * 0.20 +
    readability * 0.20 +
    vocabulary * 0.15 +
    sentenceVariety * 0.15 +
    repetition * 0.15 +
    structure * 0.15
  );

  return {
    overall: Math.max(10, Math.min(100, overall)),
    clarity: Math.max(10, Math.min(100, clarity)),
    readability: Math.max(10, Math.min(100, readability)),
    vocabulary: Math.max(10, Math.min(100, vocabulary)),
    sentenceVariety: Math.max(10, Math.min(100, sentenceVariety)),
    repetition: Math.max(10, Math.min(100, repetition)),
    structure: Math.max(10, Math.min(100, structure))
  };
}

// ---------------------------------------------------------------------------
// 7. Grammar, Mechanics & Confused Words Heuristic Checker
// ---------------------------------------------------------------------------

export function findGrammarAndStyleIssues(rawText: string): GrammarIssue[] {
  const issues: GrammarIssue[] = [];
  if (!rawText || !rawText.trim()) return issues;

  // 1. Confused Words detection
  for (const rule of CONFUSED_WORDS) {
    const match = rawText.match(rule.contextRegex);
    if (match && match.index !== undefined) {
      issues.push({
        id: `confused-${rule.errorWord}-${match.index}`,
        error: `Potentially confused word: "${rule.errorWord}"`,
        why: rule.explanation,
        suggestion: `Replace with "${rule.correctWord}"`,
        start: match.index,
        end: match.index + match[0].length,
        originalText: match[0]
      });
    }
  }

  // 2. Duplicate consecutive words ("the the", "in in")
  const dupRegex = /\b([a-zA-Z]+)\s+\1\b/gi;
  let dupMatch: RegExpExecArray | null;
  while ((dupMatch = dupRegex.exec(rawText)) !== null) {
    issues.push({
      id: `dup-${dupMatch.index}`,
      error: `Accidental word repetition: "${dupMatch[0]}"`,
      why: 'The exact same word is repeated consecutively, likely a typographical error.',
      suggestion: `Remove the duplicate: "${dupMatch[1]}"`,
      start: dupMatch.index,
      end: dupMatch.index + dupMatch[0].length,
      originalText: dupMatch[0]
    });
  }

  // 3. Repeated punctuation (e.g. "??" or "!!" or ",,")
  const punctRegex = /([!?.,;:]){2,}/g;
  let punctMatch: RegExpExecArray | null;
  while ((punctMatch = punctRegex.exec(rawText)) !== null) {
    if (punctMatch[0] !== '...') { // allow ellipsis
      issues.push({
        id: `punct-${punctMatch.index}`,
        error: `Repeated punctuation: "${punctMatch[0]}"`,
        why: 'Multiple consecutive punctuation marks look informal or unedited in formal writing.',
        suggestion: `Use a single mark: "${punctMatch[1]}"`,
        start: punctMatch.index,
        end: punctMatch.index + punctMatch[0].length,
        originalText: punctMatch[0]
      });
    }
  }

  // 4. Missing capitalization at start of sentences
  const sentenceCapRegex = /(?:^|[.!?]\s+)([a-z])/g;
  let capMatch: RegExpExecArray | null;
  while ((capMatch = sentenceCapRegex.exec(rawText)) !== null) {
    const charIndex = capMatch.index + capMatch[0].length - 1;
    issues.push({
      id: `cap-${charIndex}`,
      error: `Uncapitalized sentence start: "${capMatch[1]}"`,
      why: 'Sentences must begin with a capital letter.',
      suggestion: `Capitalize to "${capMatch[1].toUpperCase()}"`,
      start: charIndex,
      end: charIndex + 1,
      originalText: capMatch[1]
    });
  }

  return issues;
}

// ---------------------------------------------------------------------------
// 8. Tone Heuristic Analyzer
// ---------------------------------------------------------------------------

export function analyzeTone(rawText: string, words: string[]): {
  primaryTone: ToneCategory;
  confidence: number;
  influencingSignals: string[];
  explanation: string;
} {
  const wordSet = new Set(words);
  const signals: string[] = [];

  const acadMatches = TONE_LEXICON.academic.filter(w => wordSet.has(w));
  const formMatches = TONE_LEXICON.formal.filter(w => wordSet.has(w));
  const infMatches = TONE_LEXICON.informal.filter(w => wordSet.has(w));
  const persMatches = TONE_LEXICON.persuasive.filter(w => wordSet.has(w));
  const emotMatches = TONE_LEXICON.emotional.filter(w => wordSet.has(w));

  let primary: ToneCategory = 'NEUTRAL';
  let confidence = 65;

  if (acadMatches.length >= 2) {
    primary = 'ACADEMIC';
    confidence = Math.min(95, 75 + acadMatches.length * 5);
    signals.push(`Academic methodology vocabulary detected: ${acadMatches.slice(0, 4).join(', ')}`);
  } else if (formMatches.length >= 2 || (formMatches.length >= 1 && acadMatches.length >= 1)) {
    primary = 'FORMAL';
    confidence = 80;
    signals.push(`Formal transition discourse markers found: ${formMatches.join(', ')}`);
  } else if (persMatches.length >= 2) {
    primary = 'PERSUASIVE';
    confidence = 78;
    signals.push(`Strong persuasive modal vocabulary present: ${persMatches.join(', ')}`);
  } else if (emotMatches.length >= 2) {
    primary = 'EMOTIONAL';
    confidence = 75;
    signals.push(`Evocative emotional descriptors identified: ${emotMatches.join(', ')}`);
  } else if (infMatches.length >= 1 || /('m|'ve|'re|'ll|n't|gonna|wanna)/i.test(rawText)) {
    primary = 'INFORMAL';
    confidence = 72;
    signals.push('Informal markers and contractions observed.');
  } else {
    signals.push('Evenly distributed informational vocabulary with minimal polarized markers.');
  }

  const explanation = `Heuristic evaluation classified tone as ${primary} (approx. ${confidence}% confidence) based on keyword distribution and grammatical markers.`;

  return {
    primaryTone: primary,
    confidence,
    influencingSignals: signals,
    explanation
  };
}

// ---------------------------------------------------------------------------
// 9. Writing Fingerprint Generation
// ---------------------------------------------------------------------------

export function calculateWritingFingerprint(
  vocabDiversity: number,
  avgSentenceLen: number,
  avgWordLen: number,
  repeatedWordsCount: number,
  totalWords: number,
  variationScore: number,
  rawText: string
): WritingFingerprint {
  const repetitionRatio = Number(((repeatedWordsCount / (totalWords || 1)) * 100).toFixed(1));
  const punctuationCount = (rawText.match(/[,.;:!?'"()-]/g) || []).length;
  const punctuationDensity = Number(((punctuationCount / (totalWords || 1)) * 100).toFixed(1));

  // Synthesize 8-point geometric vector for visual fingerprint polygon
  const vector = [
    Math.min(100, vocabDiversity),
    Math.min(100, Math.round(avgSentenceLen * 4)),
    Math.min(100, Math.round(avgWordLen * 14)),
    Math.min(100, variationScore),
    Math.min(100, Math.round(100 - repetitionRatio * 3)),
    Math.min(100, Math.round(punctuationDensity * 4)),
    Math.min(100, Math.round((avgSentenceLen + avgWordLen * 5))),
    Math.min(100, Math.round((vocabDiversity + variationScore) / 2))
  ];

  return {
    vocabDiversity,
    avgSentenceLen,
    avgWordLen,
    repetitionRatio,
    punctuationDensity,
    sentenceVariation: variationScore,
    hashVector: vector
  };
}

// ---------------------------------------------------------------------------
// 10. Top 3 Goal-Based Improvements & Insights
// ---------------------------------------------------------------------------

export function generateTopImprovements(
  longCount: number,
  repeatedCount: number,
  fillerCount: number,
  vagueCount: number,
  grammarIssuesCount: number,
  diversityPct: number,
  goal: WritingGoal
): TopImprovement[] {
  const list: TopImprovement[] = [];

  if (grammarIssuesCount > 0) {
    list.push({
      id: 'fix-grammar',
      title: `Resolve ${grammarIssuesCount} style & mechanics notice${grammarIssuesCount > 1 ? 's' : ''}`,
      description: 'Clean up punctuation, capitalization, or commonly confused word pairs.',
      impact: 'HIGH',
      category: 'GRAMMAR',
      actionPrompt: 'Review the flagged grammar and style warnings in the editor.'
    });
  }

  if (longCount > 0) {
    list.push({
      id: 'shorten-long',
      title: `Break down ${longCount} long sentence${longCount > 1 ? 's' : ''}`,
      description: `Sentences over threshold can exhaust reader attention. Splitting complex thoughts clarifies flow.`,
      impact: goal === 'speech' || goal === 'professional' ? 'HIGH' : 'MEDIUM',
      category: 'SENTENCES',
      actionPrompt: 'Click on long sentences in the breakdown to split into two independent thoughts.'
    });
  }

  if (repeatedCount > 2) {
    list.push({
      id: 'reduce-repetition',
      title: `Diversify ${repeatedCount} heavily repeated words`,
      description: 'Frequently repeated content words make prose feel cyclical and repetitive.',
      impact: 'MEDIUM',
      category: 'REPETITION',
      actionPrompt: 'Use precise synonyms or combine related clauses.'
    });
  }

  if (fillerCount > 0) {
    list.push({
      id: 'trim-fillers',
      title: `Trim ${fillerCount} filler word${fillerCount > 1 ? 's' : ''}`,
      description: 'Removing words like "really", "very", and "basically" tightens authority.',
      impact: goal === 'academic' || goal === 'research' ? 'HIGH' : 'LOW',
      category: 'CLARITY',
      actionPrompt: 'Eliminate soft qualifiers for a more direct, confident tone.'
    });
  }

  if (diversityPct < 55) {
    list.push({
      id: 'elevate-vocab',
      title: 'Expand vocabulary variety',
      description: 'Over half of meaningful words are repeated. Introduce richer terminology.',
      impact: 'MEDIUM',
      category: 'VOCABULARY',
      actionPrompt: 'Consult the vague word suggestions to elevate generic descriptors.'
    });
  }

  // Return top 3 ranked
  return list.slice(0, 3);
}

export function generateInsightsList(
  diversityPct: number,
  longCount: number,
  repeatedWords: { word: string; count: number }[],
  fillersCount: number,
  readabilityCategory: string,
  primaryTone: string
): string[] {
  const insights: string[] = [];

  if (diversityPct >= 75) {
    insights.push(`Vocabulary diversity is high (${diversityPct}%), showing expressive lexical command.`);
  } else if (diversityPct >= 50) {
    insights.push(`Vocabulary diversity is moderate (${diversityPct}%); consider substituting recurring words with synonyms.`);
  } else {
    insights.push(`Vocabulary diversity is low (${diversityPct}%); content relies heavily on a narrow set of keywords.`);
  }

  if (longCount === 0) {
    insights.push('Sentence pacing is crisp: zero sentences exceed the configured length limit.');
  } else {
    insights.push(`${longCount} sentence${longCount > 1 ? 's exceed' : ' exceeds'} the configured threshold.`);
  }

  if (repeatedWords.length > 0) {
    const top = repeatedWords[0];
    insights.push(`The word "${top.word}" appears ${top.count} times. Verify whether this deliberate thematic repetition serves your argument.`);
  }

  if (fillersCount > 0) {
    insights.push(`Identified ${fillersCount} filler qualifiers. Trimming these will sharpen academic credibility.`);
  }

  insights.push(`Estimated reading accessibility aligns with "${readabilityCategory}" with an overall tone heuristic of "${primaryTone}".`);

  return insights;
}

// ---------------------------------------------------------------------------
// 11. Complete Single Passage Analysis Pipeline
// ---------------------------------------------------------------------------

export function analyzePassage(
  text: string,
  threshold: number = 20,
  customStopWords?: string[],
  goal: WritingGoal = 'essay'
): TextAnalysis {
  const rawText = text || '';
  const cleaned = cleanText(rawText);
  const words = tokenizeWords(cleaned);
  const rawSentences = splitSentences(cleaned);

  const stopWordsSet = new Set(customStopWords && customStopWords.length > 0 ? customStopWords : DEFAULT_STOP_WORDS);

  const wCount = countWords(words);
  const sCount = countSentences(rawSentences);
  const pCount = countParagraphs(cleaned);
  const avgWLen = calculateAverageWordLength(words);
  const avgSLen = calculateAverageSentenceLength(words, rawSentences);

  const freqs = countWordFrequency(words);
  const repeatedWords = findRepeatedWords(freqs, wCount, stopWordsSet, 3);
  const fillerWords = findFillerWords(words);
  const vagueWords = findVagueWords(words);
  const weakGenericWords = findWeakGenericWords(words);

  const analyzedSentences = analyzeSentenceList(rawSentences, threshold, stopWordsSet);
  const longSentences = analyzedSentences.filter(s => s.isLong);
  const sentenceVariety = calculateSentenceVariation(analyzedSentences);

  const diversity = calculateVocabularyDiversity(words, stopWordsSet);

  const longRatio = sCount > 0 ? longSentences.length / sCount : 0;
  const readability = calculateReadability(avgSLen, avgWLen, longRatio);

  const grammarIssues = findGrammarAndStyleIssues(rawText);
  const tone = analyzeTone(rawText, words);

  // Quality breakdown calculation
  const clarityScore = Math.max(30, 100 - fillerWords.reduce((a, b) => a + b.count, 0) * 4 - vagueWords.reduce((a, b) => a + b.count, 0) * 3);
  const repetitionScore = Math.max(30, 100 - repeatedWords.length * 8);
  const structureScore = pCount > 1 ? 85 : (wCount > 80 ? 60 : 75);
  
  const writingQuality = calculateWritingQuality(
    clarityScore,
    readability.score,
    Math.round(diversity.diversityPercentage),
    sentenceVariety.varietyScore,
    repetitionScore,
    structureScore
  );

  const fingerprint = calculateWritingFingerprint(
    diversity.diversityPercentage,
    avgSLen,
    avgWLen,
    repeatedWords.length,
    wCount,
    sentenceVariety.varietyScore,
    rawText
  );

  const topImprovements = generateTopImprovements(
    longSentences.length,
    repeatedWords.length,
    fillerWords.length,
    vagueWords.length,
    grammarIssues.length,
    diversity.diversityPercentage,
    goal
  );

  const insights = generateInsightsList(
    diversity.diversityPercentage,
    longSentences.length,
    repeatedWords,
    fillerWords.length,
    readability.category,
    tone.primaryTone
  );

  // Map word frequencies to top array
  const sortedFrequencies = Object.entries(freqs)
    .filter(([w]) => !stopWordsSet.has(w) && w.length > 2)
    .map(([word, count]) => ({
      word,
      count,
      percentage: Number(((count / (wCount || 1)) * 100).toFixed(1))
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  return {
    rawText,
    wordCount: wCount,
    charCount: rawText.length,
    charCountNoSpaces: rawText.replace(/\s+/g, '').length,
    sentenceCount: sCount,
    paragraphCount: pCount,
    avgWordLength: avgWLen,
    avgSentenceLength: avgSLen,

    wordFrequencies: sortedFrequencies,
    repeatedWords,
    uniqueWordsCount: new Set(words).size,
    meaningfulWordsCount: diversity.meaningfulWordsCount,
    uniqueMeaningfulWordsCount: diversity.uniqueMeaningfulCount,
    vocabularyDiversity: diversity.diversityPercentage,
    diversityCategory: diversity.category,
    diversityExplanation: diversity.explanation,

    fillerWords,
    vagueWords,
    weakGenericWords,

    sentences: analyzedSentences,
    longSentences,
    sentenceVariety,

    readabilityCategory: readability.category,
    readabilityScore: readability.score,
    readabilityFactors: readability.factors,

    writingQuality,
    grammarIssues,
    tone,

    fingerprint,
    insights,
    topImprovements
  };
}

// ---------------------------------------------------------------------------
// 12. Comparison Analysis (Set Operations & Similarity Breakdown)
// ---------------------------------------------------------------------------

export function comparePassages(
  textA: string,
  textB: string,
  threshold: number = 20,
  customStopWords?: string[]
): ComparisonAnalysis {
  const passageA = analyzePassage(textA, threshold, customStopWords);
  const passageB = analyzePassage(textB, threshold, customStopWords);

  const stopWordsSet = new Set(customStopWords && customStopWords.length > 0 ? customStopWords : DEFAULT_STOP_WORDS);

  const wordsA = tokenizeWords(textA);
  const wordsB = tokenizeWords(textB);

  const meaningfulA = new Set(wordsA.filter(w => !stopWordsSet.has(w) && w.length > 2));
  const meaningfulB = new Set(wordsB.filter(w => !stopWordsSet.has(w) && w.length > 2));

  // Shared meaningful words (Set intersection)
  const shared = new Set<string>();
  for (const w of meaningfulA) {
    if (meaningfulB.has(w)) {
      shared.add(w);
    }
  }

  // Union of meaningful words
  const union = new Set<string>([...meaningfulA, ...meaningfulB]);

  let similarityPct = 0;
  if (union.size > 0) {
    similarityPct = Number(((shared.size / union.size) * 100).toFixed(1));
  }

  const meaningfulSharedWords = Array.from(shared).sort();
  const uniqueToA = Array.from(meaningfulA).filter(w => !shared.has(w)).sort();
  const uniqueToB = Array.from(meaningfulB).filter(w => !shared.has(w)).sort();

  // Excluded stop words that appeared in either text
  const allRawWords = new Set([...wordsA, ...wordsB]);
  const excludedStopWords = Array.from(stopWordsSet).filter(w => allRawWords.has(w)).sort();

  // Explanation contributors
  const similarityContributors: string[] = [];
  const differentiators: string[] = [];

  if (meaningfulSharedWords.length > 0) {
    similarityContributors.push(
      `Shared ${meaningfulSharedWords.length} meaningful terms: ${meaningfulSharedWords.slice(0, 6).join(', ')}${meaningfulSharedWords.length > 6 ? '...' : ''}`
    );
  }
  if (Math.abs(passageA.avgSentenceLength - passageB.avgSentenceLength) < 4) {
    similarityContributors.push('Similar sentence length pacing and clause structure.');
  }
  if (passageA.tone.primaryTone === passageB.tone.primaryTone) {
    similarityContributors.push(`Both passages share a "${passageA.tone.primaryTone}" tone.`);
  }

  if (uniqueToA.length > 0) {
    differentiators.push(`Passage A contains ${uniqueToA.length} distinct terms (e.g., ${uniqueToA.slice(0, 4).join(', ')})`);
  }
  if (uniqueToB.length > 0) {
    differentiators.push(`Passage B contains ${uniqueToB.length} distinct terms (e.g., ${uniqueToB.slice(0, 4).join(', ')})`);
  }
  if (Math.abs(passageA.wordCount - passageB.wordCount) > 20) {
    differentiators.push(`Significant length divergence (${Math.abs(passageA.wordCount - passageB.wordCount)} words difference)`);
  }

  const explanation = `Educational similarity estimate is ${similarityPct}% calculated using Jaccard meaningful vocabulary overlap (${meaningfulSharedWords.length} shared terms out of ${union.size} total distinct vocabulary). Stop words are fully excluded.`;

  return {
    passageA,
    passageB,
    similarityPercentage: similarityPct,
    similarityContributors,
    differentiators,
    meaningfulSharedWords,
    excludedStopWords,
    uniqueToA,
    uniqueToB,
    explanation,
    wordCountDifference: Math.abs(passageA.wordCount - passageB.wordCount),
    sentenceCountDifference: Math.abs(passageA.sentenceCount - passageB.sentenceCount)
  };
}

// ---------------------------------------------------------------------------
// 13. Explainable Rule-Based Text Improvement
// ---------------------------------------------------------------------------

export type ImprovementAction = 
  | 'fix_grammar'
  | 'make_clearer'
  | 'make_concise'
  | 'make_formal'
  | 'simplify'
  | 'improve_vocab'
  | 'reduce_repetition'
  | 'improve_flow';

export interface ImprovementResult {
  original: string;
  improved: string;
  changesApplied: { action: string; description: string }[];
  originalAnalysis: TextAnalysis;
  improvedAnalysis: TextAnalysis;
}

export function improveWritingRuleBased(
  originalText: string,
  actions: ImprovementAction[],
  threshold: number = 20
): ImprovementResult {
  let improved = originalText;
  const changesApplied: { action: string; description: string }[] = [];

  if (!originalText || !originalText.trim()) {
    const emptyAnalysis = analyzePassage('', threshold);
    return {
      original: '',
      improved: '',
      changesApplied: [],
      originalAnalysis: emptyAnalysis,
      improvedAnalysis: emptyAnalysis
    };
  }

  const actionsSet = new Set(actions);

  // 1. Fix Grammar & Mechanics
  if (actionsSet.has('fix_grammar')) {
    let grammarFixCount = 0;
    // Replace duplicate words: "the the" -> "the"
    improved = improved.replace(/\b([a-zA-Z]+)\s+\1\b/gi, (match, word) => {
      grammarFixCount++;
      return word;
    });

    // Fix repeated punctuation: "??" -> "?"
    improved = improved.replace(/([!?.,;:]){2,}/g, (match, p) => {
      if (match === '...') return match;
      grammarFixCount++;
      return p;
    });

    // Fix confused words
    for (const rule of CONFUSED_WORDS) {
      if (rule.contextRegex.test(improved)) {
        improved = improved.replace(rule.contextRegex, (match, error) => {
          grammarFixCount++;
          return match.replace(error, rule.correctWord);
        });
      }
    }

    // Capitalize sentence starts
    improved = improved.replace(/(^|[.!?]\s+)([a-z])/g, (match, prefix, char) => {
      grammarFixCount++;
      return prefix + char.toUpperCase();
    });

    if (grammarFixCount > 0) {
      changesApplied.push({
        action: 'Fix Grammar & Mechanics',
        description: `Corrected ${grammarFixCount} capitalization, punctuation, and confused word instances.`
      });
    }
  }

  // 2. Make More Concise / Clearer (Remove or replace filler words)
  if (actionsSet.has('make_concise') || actionsSet.has('make_clearer')) {
    let fillerTrimCount = 0;
    // Filter out common fillers like 'very', 'really', 'basically', 'actually'
    improved = improved.replace(/\b(basically|actually|literally|sorta|kindof)\s*,?\s*/gi, () => {
      fillerTrimCount++;
      return '';
    });
    improved = improved.replace(/\b(very|really|quite|just)\s+([a-z]+)/gi, (match, filler, nextWord) => {
      fillerTrimCount++;
      // If "very good" -> "exceptional", "really important" -> "crucial"
      if (filler.toLowerCase() === 'very' && nextWord.toLowerCase() === 'good') return 'effective';
      if (filler.toLowerCase() === 'really' && nextWord.toLowerCase() === 'important') return 'critical';
      return nextWord;
    });

    if (fillerTrimCount > 0) {
      changesApplied.push({
        action: 'Conciseness & Clarity',
        description: `Eliminated ${fillerTrimCount} weak filler qualifiers to tighten sentence impact.`
      });
    }
  }

  // 3. Make More Formal
  if (actionsSet.has('make_formal')) {
    let formalCount = 0;
    const informalMap: Record<string, string> = {
      "gonna": "going to",
      "wanna": "want to",
      "kinda": "somewhat",
      "cool": "advantageous",
      "awesome": "notable",
      "stuff": "materials",
      "things": "elements",
      "a lot of": "numerous",
      "lots of": "substantial"
    };

    for (const [informal, formal] of Object.entries(informalMap)) {
      const reg = new RegExp(`\\b${informal}\\b`, 'gi');
      if (reg.test(improved)) {
        improved = improved.replace(reg, () => {
          formalCount++;
          return formal;
        });
      }
    }

    if (formalCount > 0) {
      changesApplied.push({
        action: 'Formal Tone Elevation',
        description: `Upgraded ${formalCount} colloquial terms into formal register equivalents.`
      });
    }
  }

  // 4. Improve Vocabulary (Replace vague words)
  if (actionsSet.has('improve_vocab')) {
    let vocabCount = 0;
    improved = improved.replace(/\bgood\b/gi, () => { vocabCount++; return 'beneficial'; });
    improved = improved.replace(/\bbad\b/gi, () => { vocabCount++; return 'suboptimal'; });
    improved = improved.replace(/\bbig\b/gi, () => { vocabCount++; return 'substantial'; });
    improved = improved.replace(/\bsmall\b/gi, () => { vocabCount++; return 'compact'; });
    improved = improved.replace(/\bthing\b/gi, () => { vocabCount++; return 'factor'; });

    if (vocabCount > 0) {
      changesApplied.push({
        action: 'Vocabulary Elevation',
        description: `Replaced ${vocabCount} vague/generic words with precise descriptors.`
      });
    }
  }

  // 5. Simplify or Improve Sentence Flow (Splits long run-ons containing 'and also' or 'however')
  if (actionsSet.has('simplify') || actionsSet.has('improve_flow')) {
    let splitCount = 0;
    // Replace conjunction splices with period + capital letter
    improved = improved.replace(/, and furthermore /gi, () => { splitCount++; return '. Furthermore, '; });
    improved = improved.replace(/, and therefore /gi, () => { splitCount++; return '. Therefore, '; });
    improved = improved.replace(/; however, /gi, () => { splitCount++; return '. However, '; });

    if (splitCount > 0) {
      changesApplied.push({
        action: 'Sentence Pacing & Flow',
        description: `Divided ${splitCount} compound run-ons into cleaner, well-paced sentences.`
      });
    }
  }

  // Clean extra spaces
  improved = cleanText(improved);

  const originalAnalysis = analyzePassage(originalText, threshold);
  const improvedAnalysis = analyzePassage(improved, threshold);

  return {
    original: originalText,
    improved,
    changesApplied,
    originalAnalysis,
    improvedAnalysis
  };
}
