/**
 * Nexus Write — Explainable Writing Intelligence
 * Data Models & Type Definitions
 */

export type AppMode = 
  | 'analyze' 
  | 'compare' 
  | 'improve' 
  | 'insights' 
  | 'research' 
  | 'citations' 
  | 'history' 
  | 'how-it-works';

export type WritingGoal = 
  | 'academic' 
  | 'research' 
  | 'professional' 
  | 'email' 
  | 'essay' 
  | 'speech' 
  | 'creative' 
  | 'informal';

export type ReadabilityCategory = 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'NEEDS IMPROVEMENT';
export type DiversityCategory = 'HIGH' | 'MODERATE' | 'LOW';
export type ToneCategory = 'FORMAL' | 'INFORMAL' | 'ACADEMIC' | 'PROFESSIONAL' | 'PERSUASIVE' | 'NEUTRAL' | 'EMOTIONAL';

export interface WordFrequency {
  word: string;
  count: number;
  percentage: number;
}

export interface SentenceAnalysis {
  index: number;
  text: string;
  wordCount: number;
  charCount: number;
  isLong: boolean;
  classification: 'SHORT' | 'MEDIUM' | 'LONG';
  fillerWords: string[];
  vagueWords: string[];
  repeatedWords: string[];
  issues: string[];
  claimType?: 'CLAIM' | 'EVIDENCE' | 'OPINION' | 'EXAMPLE';
  hasSource?: boolean;
}

export interface GrammarIssue {
  id: string;
  error: string;
  why: string;
  suggestion: string;
  start: number;
  end: number;
  originalText: string;
  accepted?: boolean;
  ignored?: boolean;
}

export interface WritingQualityBreakdown {
  overall: number; // 0 - 100
  clarity: number;
  readability: number;
  vocabulary: number;
  sentenceVariety: number;
  repetition: number;
  structure: number;
}

export interface SentenceVarietyDistribution {
  short: number; // count <= 12 words
  medium: number; // count 13 - 22 words
  long: number; // count > 22 words
  shortPercent: number;
  mediumPercent: number;
  longPercent: number;
  varietyScore: number; // 0 - 100
  description: string;
}

export interface ToneAnalysis {
  primaryTone: ToneCategory;
  confidence: number; // 0 - 100 %
  influencingSignals: string[];
  explanation: string;
}

export interface TopImprovement {
  id: string;
  title: string;
  description: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'SENTENCES' | 'REPETITION' | 'VOCABULARY' | 'CLARITY' | 'GRAMMAR';
  actionPrompt: string;
}

export interface WritingFingerprint {
  vocabDiversity: number;
  avgSentenceLen: number;
  avgWordLen: number;
  repetitionRatio: number;
  punctuationDensity: number;
  sentenceVariation: number;
  hashVector: number[];
}

export interface TextAnalysis {
  rawText: string;
  wordCount: number;
  charCount: number;
  charCountNoSpaces: number;
  sentenceCount: number;
  paragraphCount: number;
  avgWordLength: number;
  avgSentenceLength: number;
  
  // Word & Vocabulary
  wordFrequencies: WordFrequency[];
  repeatedWords: WordFrequency[];
  uniqueWordsCount: number;
  meaningfulWordsCount: number;
  uniqueMeaningfulWordsCount: number;
  vocabularyDiversity: number; // percentage
  diversityCategory: DiversityCategory;
  diversityExplanation: string;
  
  // Style and word categories
  fillerWords: { word: string; count: number; suggestions: string[] }[];
  vagueWords: { word: string; count: number; suggestion: string }[];
  weakGenericWords: { word: string; count: number; advice: string }[];
  
  // Sentences
  sentences: SentenceAnalysis[];
  longSentences: SentenceAnalysis[];
  sentenceVariety: SentenceVarietyDistribution;
  
  // High-level evaluations
  readabilityCategory: ReadabilityCategory;
  readabilityScore: number;
  readabilityFactors: { factor: string; impact: string }[];
  
  writingQuality: WritingQualityBreakdown;
  grammarIssues: GrammarIssue[];
  tone: ToneAnalysis;
  
  // Fingerprint & Insights
  fingerprint: WritingFingerprint;
  insights: string[];
  topImprovements: TopImprovement[];
}

export interface ComparisonAnalysis {
  passageA: TextAnalysis;
  passageB: TextAnalysis;
  similarityPercentage: number; // 0 - 100
  similarityContributors: string[];
  differentiators: string[];
  meaningfulSharedWords: string[];
  excludedStopWords: string[];
  uniqueToA: string[];
  uniqueToB: string[];
  explanation: string;
  wordCountDifference: number;
  sentenceCountDifference: number;
}

export interface SourceCard {
  id: string;
  title: string;
  author: string;
  year: string;
  publisher?: string;
  url?: string;
  doi?: string;
  notes: string;
  keyPoints: string[];
  sourceType: 'USER_PROVIDED_SOURCE' | 'WEB_SOURCE' | 'GENERATED_NOTE';
  createdAt: number;
}

export interface VersionSnapshot {
  id: string;
  name: string;
  timestamp: number;
  rawText: string;
  passageBText?: string;
  qualityScore: number;
  wordCount: number;
  readabilityCategory: string;
  goal: WritingGoal;
  notes?: string;
}

export interface SettingsState {
  theme: 'CINEMATIC' | 'BALANCED' | 'MINIMAL';
  colorTheme?: 'rainbow' | 'sunset' | 'cyber' | 'berry';
  performance: 'CINEMATIC' | 'BALANCED' | 'PERFORMANCE';
  liveAnalysis: boolean;
  animations: boolean;
  reducedMotion: boolean;
  longSentenceThreshold: number; // default 20
  customStopWords: string[];
}
