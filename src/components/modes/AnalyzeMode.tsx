/**
 * COMPARA — Simplified Context-Aware Analyze Mode
 * Refactored modular grid architecture: clean approachable primary view
 * with context-aware drill-down metric inspector panels.
 */

import React, { useState } from 'react';
import { 
  TextAnalysis, 
  WritingGoal, 
  SentenceAnalysis 
} from '../../types/index.ts';
import { FormulaKey } from '../common/FormulaModal.tsx';
import { DEMO_DATASETS } from '../../engine/demoData.ts';
import { 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Eraser, 
  Copy, 
  Check, 
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  Clock,
  Wand2,
  X,
  ChevronRight,
  Target,
  BookOpen,
  BarChart2,
  Compass,
  Zap,
  Info
} from 'lucide-react';

export type MetricKey = 'score' | 'readability' | 'vocabulary' | 'sentences' | 'words' | 'tone';

interface AnalyzeModeProps {
  passageText: string;
  onChangeText: (text: string) => void;
  analysis: TextAnalysis;
  onOpenFormula: (key: FormulaKey) => void;
  selectedGoal: WritingGoal;
  longSentenceThreshold: number;
  onSwitchToImprove?: () => void;
  onSwitchToCompare?: () => void;
}

export const AnalyzeMode: React.FC<AnalyzeModeProps> = ({
  passageText,
  onChangeText,
  analysis,
  onOpenFormula,
  selectedGoal,
  longSentenceThreshold,
  onSwitchToImprove,
  onSwitchToCompare
}) => {
  // Context-aware selection: null means ultra-clean view; selecting a key reveals that metric's deep details
  const [selectedMetric, setSelectedMetric] = useState<MetricKey | null>(null);
  const [selectedSentence, setSelectedSentence] = useState<SentenceAnalysis | null>(null);
  const [dismissedIssues, setDismissedIssues] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<boolean>(false);

  const handleToggleMetric = (metric: MetricKey) => {
    setSelectedMetric(prev => (prev === metric ? null : metric));
    // When sentence metric is opened, select first long sentence or first sentence by default
    if (metric === 'sentences' && !selectedSentence && analysis.sentences.length > 0) {
      const firstLong = analysis.sentences.find(s => s.isLong);
      setSelectedSentence(firstLong || analysis.sentences[0]);
    }
  };

  const handleDismissIssue = (id: string) => {
    setDismissedIssues(prev => new Set([...prev, id]));
  };

  const handleClear = () => {
    onChangeText('');
    setSelectedSentence(null);
    setSelectedMetric(null);
  };

  const handleCopy = () => {
    if (!passageText) return;
    navigator.clipboard.writeText(passageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadSample = (sampleText: string) => {
    onChangeText(sampleText);
    setSelectedSentence(null);
  };

  const activeGrammarIssues = analysis.grammarIssues.filter(i => !dismissedIssues.has(i.id));

  // Writing Quality Score calculations
  const score = analysis.writingQuality.overall;
  let qualityBadge = '🌟 High Quality';
  let qualitySummary = 'Clear, engaging, and well-paced.';
  let scoreGradient = 'from-emerald-400 via-teal-300 to-cyan-400';
  let scoreBorder = 'border-emerald-400/50';

  if (score < 60) {
    qualityBadge = '✏️ Needs Polish';
    qualitySummary = 'Shorten long sentences and trim filler words.';
    scoreGradient = 'from-amber-400 via-orange-400 to-rose-400';
    scoreBorder = 'border-amber-400/50';
  } else if (score < 80) {
    qualityBadge = '👍 Solid & Clear';
    qualitySummary = 'Good flow with minor adjustments recommended.';
    scoreGradient = 'from-cyan-400 via-blue-400 to-indigo-400';
    scoreBorder = 'border-cyan-400/50';
  }

  // Estimated reading time (~200 words per minute)
  const readingTimeSec = Math.max(5, Math.round((analysis.wordCount / 200) * 60));

  // Total word issues (fillers + vague + repeated)
  const totalFillerCount = analysis.fillerWords.reduce((a, b) => a + b.count, 0);
  const totalVagueCount = analysis.vagueWords.reduce((a, b) => a + b.count, 0);
  const totalWordIssues = totalFillerCount + totalVagueCount;

  return (
    <div className="space-y-6">
      
      {/* 1. Clean, Approachable Header & Sample Quick-Start */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#1d123d]/90 via-[#131b3b]/90 to-[#0e2430]/90 border border-purple-500/40 relative overflow-hidden shadow-xl shadow-purple-950/60 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
              <span>Interactive Writing Workspace</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-heading text-white tracking-wide">
              Welcome to COMPARA 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Type or paste your text below. Click on any metric card to inspect deep analysis and tailored writing tips.
            </p>
          </div>

          {/* Quick 1-Click Samples for Instant Testing */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs font-bold text-purple-200">Try sample:</span>
            <button
              type="button"
              onClick={() => handleLoadSample(DEMO_DATASETS[0].passageA)}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 transition-all flex items-center gap-1"
            >
              <span>🎓 Academic</span>
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample(DEMO_DATASETS[1].passageA)}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/40 transition-all flex items-center gap-1"
            >
              <span>🔁 Repetitive</span>
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample(DEMO_DATASETS[2].passageA)}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/40 transition-all flex items-center gap-1"
            >
              <span>📏 Long Sents</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Focused Writing Area with Live Stats & Fast Actions */}
      <div className="rounded-3xl p-5 bg-[#120d2e]/90 border-2 border-purple-500/40 shadow-xl shadow-purple-950/50 backdrop-blur-xl flex flex-col space-y-3">
        
        {/* Editor Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-purple-900/40">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>✍️</span>
              <span>Your Draft</span>
            </span>
            <div className="flex items-center gap-1.5 text-xs font-mono text-purple-200 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-700/40">
              <span className="font-bold text-white">{analysis.wordCount}</span> words
              <span>•</span>
              <span className="font-bold text-white">{analysis.sentenceCount}</span> sentences
              <span>•</span>
              <span className="font-bold text-white">~{readingTimeSec}s</span> read
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {onSwitchToImprove && (
              <button
                type="button"
                onClick={onSwitchToImprove}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-300 hover:to-teal-400 transition-all shadow-md shadow-emerald-500/20"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>1-Click Polish</span>
              </button>
            )}

            {onSwitchToCompare && (
              <button
                type="button"
                onClick={onSwitchToCompare}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs hover:from-purple-400 hover:to-pink-400 transition-all shadow-md shadow-purple-500/20"
              >
                <span>Compare Passages</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1b1442] hover:bg-purple-900/60 text-purple-200 text-xs font-semibold border border-purple-500/40 transition-all"
              title="Copy text to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 text-xs font-semibold transition-all"
              title="Clear text"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Clean, comfortable writing textarea */}
        <div className="relative min-h-[200px]">
          <textarea
            value={passageText}
            onChange={e => onChangeText(e.target.value)}
            placeholder="Type or paste your text here to begin instant explainable analysis..."
            className="w-full min-h-[200px] bg-[#0c0822]/80 text-white placeholder-slate-400 font-sans text-sm sm:text-base leading-relaxed p-4 rounded-2xl border border-purple-500/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:outline-none resize-y selection:bg-pink-500/30 selection:text-pink-100"
            aria-label="Passage text editor"
          />
        </div>

        {/* Quick Sentence Flow Visualizer Strip */}
        {analysis.sentences.length > 0 && (
          <div className="pt-2 border-t border-purple-900/40 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-purple-300 font-medium">
              <span>Sentence flow:</span>
              <div className="flex items-center gap-1 overflow-x-auto max-w-md py-1">
                {analysis.sentences.map(s => {
                  let dotColor = 'bg-emerald-400';
                  if (s.wordCount > longSentenceThreshold + 6) dotColor = 'bg-rose-400';
                  else if (s.wordCount > longSentenceThreshold) dotColor = 'bg-amber-400';
                  else if (s.wordCount > 14) dotColor = 'bg-cyan-400';

                  return (
                    <button
                      key={s.index}
                      type="button"
                      onClick={() => {
                        setSelectedSentence(s);
                        setSelectedMetric('sentences');
                      }}
                      className={`h-2.5 rounded-full transition-all hover:scale-125 ${dotColor}`}
                      style={{ width: `${Math.min(36, Math.max(10, s.wordCount * 1.4))}px` }}
                      title={`Sentence #${s.index}: ${s.wordCount} words (Click to coach)`}
                    />
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleMetric('sentences')}
              className="text-cyan-300 hover:text-cyan-200 text-xs font-semibold flex items-center gap-1 hover:underline"
            >
              <span>Inspect sentence pacing</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 3. SIMPLIFIED CONTEXT-AWARE METRIC GRID SYSTEM */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-purple-300">
              Interactive Metric Grid
            </span>
            <span className="text-[11px] text-slate-400">
              (Click any card to reveal details & recommendations)
            </span>
          </div>
          {selectedMetric && (
            <button
              type="button"
              onClick={() => setSelectedMetric(null)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-700/40 transition-colors"
            >
              <X className="w-3 h-3 text-rose-400" />
              <span>Close Detailed View</span>
            </button>
          )}
        </div>

        {/* 6-Card Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Tile 1: Writing Score */}
          <button
            type="button"
            onClick={() => handleToggleMetric('score')}
            className={`p-3.5 rounded-2xl text-left transition-all relative overflow-hidden flex flex-col justify-between border ${
              selectedMetric === 'score'
                ? 'bg-gradient-to-br from-pink-950/90 to-purple-950/90 border-pink-400 ring-2 ring-pink-400/50 shadow-lg shadow-pink-950/60 scale-[1.02]'
                : 'card-pink hover:border-pink-400/70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs text-pink-200 font-bold mb-1">
                <span>💖 Score</span>
                <span className="text-[10px] opacity-75">{selectedMetric === 'score' ? 'Active' : 'Click'}</span>
              </div>
              <div className="text-2xl font-black text-white font-heading">{score} <span className="text-xs font-normal text-pink-300">/100</span></div>
              <div className="text-[11px] font-bold text-pink-200 mt-0.5">{qualityBadge}</div>
            </div>
            <div className="text-[10px] text-pink-300/80 mt-2 pt-1 border-t border-pink-700/30 flex items-center justify-between">
              <span>Overall Health</span>
              <ChevronRight className={`w-3 h-3 transition-transform ${selectedMetric === 'score' ? 'rotate-90 text-pink-300' : ''}`} />
            </div>
          </button>

          {/* Tile 2: Readability */}
          <button
            type="button"
            onClick={() => handleToggleMetric('readability')}
            className={`p-3.5 rounded-2xl text-left transition-all relative overflow-hidden flex flex-col justify-between border ${
              selectedMetric === 'readability'
                ? 'bg-gradient-to-br from-purple-950/90 to-indigo-950/90 border-purple-400 ring-2 ring-purple-400/50 shadow-lg shadow-purple-950/60 scale-[1.02]'
                : 'card-purple hover:border-purple-400/70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs text-purple-200 font-bold mb-1">
                <span>📖 Readability</span>
                <span className="text-[10px] opacity-75">{selectedMetric === 'readability' ? 'Active' : 'Click'}</span>
              </div>
              <div className="text-lg font-black text-white font-heading">{analysis.readabilityCategory}</div>
              <div className="text-[11px] font-medium text-purple-200 mt-0.5">Score: {analysis.readabilityScore}/100</div>
            </div>
            <div className="text-[10px] text-purple-300/80 mt-2 pt-1 border-t border-purple-700/30 flex items-center justify-between">
              <span>Cognitive Pacing</span>
              <ChevronRight className={`w-3 h-3 transition-transform ${selectedMetric === 'readability' ? 'rotate-90 text-purple-300' : ''}`} />
            </div>
          </button>

          {/* Tile 3: Vocabulary Variety */}
          <button
            type="button"
            onClick={() => handleToggleMetric('vocabulary')}
            className={`p-3.5 rounded-2xl text-left transition-all relative overflow-hidden flex flex-col justify-between border ${
              selectedMetric === 'vocabulary'
                ? 'bg-gradient-to-br from-emerald-950/90 to-teal-950/90 border-emerald-400 ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-950/60 scale-[1.02]'
                : 'card-emerald hover:border-emerald-400/70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs text-emerald-200 font-bold mb-1">
                <span>🎨 Vocabulary</span>
                <span className="text-[10px] opacity-75">{selectedMetric === 'vocabulary' ? 'Active' : 'Click'}</span>
              </div>
              <div className="text-2xl font-black text-white font-heading">{analysis.vocabularyDiversity}%</div>
              <div className="text-[11px] font-medium text-emerald-200 mt-0.5">{analysis.diversityCategory} Variety</div>
            </div>
            <div className="text-[10px] text-emerald-300/80 mt-2 pt-1 border-t border-emerald-700/30 flex items-center justify-between">
              <span>{analysis.uniqueMeaningfulWordsCount} unique words</span>
              <ChevronRight className={`w-3 h-3 transition-transform ${selectedMetric === 'vocabulary' ? 'rotate-90 text-emerald-300' : ''}`} />
            </div>
          </button>

          {/* Tile 4: Sentence Flow */}
          <button
            type="button"
            onClick={() => handleToggleMetric('sentences')}
            className={`p-3.5 rounded-2xl text-left transition-all relative overflow-hidden flex flex-col justify-between border ${
              selectedMetric === 'sentences'
                ? 'bg-gradient-to-br from-cyan-950/90 to-blue-950/90 border-cyan-400 ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-950/60 scale-[1.02]'
                : 'card-cyan hover:border-cyan-400/70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs text-cyan-200 font-bold mb-1">
                <span>⚡ Rhythm</span>
                <span className="text-[10px] opacity-75">{selectedMetric === 'sentences' ? 'Active' : 'Click'}</span>
              </div>
              <div className="text-2xl font-black text-white font-heading">{analysis.sentenceVariety.varietyScore} <span className="text-xs font-normal text-cyan-300">/100</span></div>
              <div className="text-[11px] font-medium text-cyan-200 mt-0.5">{analysis.longSentences.length} long sentences</div>
            </div>
            <div className="text-[10px] text-cyan-300/80 mt-2 pt-1 border-t border-cyan-700/30 flex items-center justify-between">
              <span>Sentence Coach</span>
              <ChevronRight className={`w-3 h-3 transition-transform ${selectedMetric === 'sentences' ? 'rotate-90 text-cyan-300' : ''}`} />
            </div>
          </button>

          {/* Tile 5: Word Health */}
          <button
            type="button"
            onClick={() => handleToggleMetric('words')}
            className={`p-3.5 rounded-2xl text-left transition-all relative overflow-hidden flex flex-col justify-between border ${
              selectedMetric === 'words'
                ? 'bg-gradient-to-br from-amber-950/90 to-orange-950/90 border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-950/60 scale-[1.02]'
                : 'card-amber hover:border-amber-400/70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs text-amber-200 font-bold mb-1">
                <span>🔍 Word Health</span>
                <span className="text-[10px] opacity-75">{selectedMetric === 'words' ? 'Active' : 'Click'}</span>
              </div>
              <div className="text-2xl font-black text-white font-heading">{totalWordIssues} <span className="text-xs font-normal text-amber-300">flags</span></div>
              <div className="text-[11px] font-medium text-amber-200 mt-0.5">{totalFillerCount} fillers • {totalVagueCount} vague</div>
            </div>
            <div className="text-[10px] text-amber-300/80 mt-2 pt-1 border-t border-amber-700/30 flex items-center justify-between">
              <span>Repeats & Fillers</span>
              <ChevronRight className={`w-3 h-3 transition-transform ${selectedMetric === 'words' ? 'rotate-90 text-amber-300' : ''}`} />
            </div>
          </button>

          {/* Tile 6: Tone & Style */}
          <button
            type="button"
            onClick={() => handleToggleMetric('tone')}
            className={`p-3.5 rounded-2xl text-left transition-all relative overflow-hidden flex flex-col justify-between border ${
              selectedMetric === 'tone'
                ? 'bg-gradient-to-br from-indigo-950/90 to-purple-950/90 border-indigo-400 ring-2 ring-indigo-400/50 shadow-lg shadow-indigo-950/60 scale-[1.02]'
                : 'card-indigo hover:border-indigo-400/70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs text-indigo-200 font-bold mb-1">
                <span>🎭 Tone</span>
                <span className="text-[10px] opacity-75">{selectedMetric === 'tone' ? 'Active' : 'Click'}</span>
              </div>
              <div className="text-lg font-black text-white font-heading truncate">{analysis.tone.primaryTone}</div>
              <div className="text-[11px] font-medium text-indigo-200 mt-0.5">{analysis.tone.confidence}% confidence</div>
            </div>
            <div className="text-[10px] text-indigo-300/80 mt-2 pt-1 border-t border-indigo-700/30 flex items-center justify-between">
              <span>Goal: {selectedGoal}</span>
              <ChevronRight className={`w-3 h-3 transition-transform ${selectedMetric === 'tone' ? 'rotate-90 text-indigo-300' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* 4. CONTEXT-AWARE DETAIL INSPECTOR (Revealed on click) */}
      <div className="rounded-3xl p-5 sm:p-6 bg-[#120d2e]/95 border border-purple-500/40 shadow-2xl shadow-purple-950/60 backdrop-blur-xl">
        
        {/* CASE A: No Metric Selected -> Clean, Approachable Top-Level Recommendations */}
        {selectedMetric === null && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-purple-900/40">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-pink-400" />
                  <span>Primary Writing Insights & Quick Wins</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any metric card above to drill down into its full educational breakdown.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Status: {qualityBadge}</span>
              </div>
            </div>

            {/* Top 3 High-Impact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              {analysis.topImprovements.slice(0, 3).map((imp, idx) => (
                <div 
                  key={imp.id}
                  className="p-4 rounded-2xl bg-gradient-to-br from-[#1a1242] to-[#120d2e] border border-purple-500/30 hover:border-pink-400/60 transition-all flex flex-col justify-between space-y-2.5 shadow-md shadow-purple-950/40"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white text-xs font-black shadow-sm">
                        {idx + 1}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/40">
                        {imp.impact} Impact
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{imp.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{imp.description}</p>
                  </div>

                  <div className="pt-2 border-t border-purple-800/40 text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                    <span>💡</span>
                    <span>Tip: {imp.actionPrompt}</span>
                  </div>
                </div>
              ))}
            </div>

            {analysis.topImprovements.length === 0 && (
              <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center text-sm text-emerald-300 font-semibold flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <span>Great job! No urgent clarity or rhythm improvements detected.</span>
              </div>
            )}
          </div>
        )}

        {/* CASE B: Writing Score Dimension Breakdown */}
        {selectedMetric === 'score' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-pink-900/40">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-400/40">
                  <BarChart2 className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">Educational Writing Quality Index</h3>
                  <p className="text-xs text-pink-200/80">Balanced mathematical composite from 0 to 100</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenFormula('writing_quality')}
                  className="px-3 py-1 rounded-xl bg-pink-500/20 text-pink-200 text-xs font-semibold hover:bg-pink-500/30 transition-all border border-pink-400/40 flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Explain Formula</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMetric(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#140e34] border border-purple-700/40">
                <div className="text-slate-400 text-[11px]">Clarity (20%)</div>
                <div className="text-lg font-black text-cyan-300 mt-1">{analysis.writingQuality.clarity}</div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${analysis.writingQuality.clarity}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#140e34] border border-purple-700/40">
                <div className="text-slate-400 text-[11px]">Readability (20%)</div>
                <div className="text-lg font-black text-purple-300 mt-1">{analysis.writingQuality.readability}</div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-purple-400" style={{ width: `${analysis.writingQuality.readability}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#140e34] border border-purple-700/40">
                <div className="text-slate-400 text-[11px]">Vocabulary (15%)</div>
                <div className="text-lg font-black text-emerald-300 mt-1">{analysis.writingQuality.vocabulary}</div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-400" style={{ width: `${analysis.writingQuality.vocabulary}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#140e34] border border-purple-700/40">
                <div className="text-slate-400 text-[11px]">Cadence (15%)</div>
                <div className="text-lg font-black text-sky-300 mt-1">{analysis.writingQuality.sentenceVariety}</div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-sky-400" style={{ width: `${analysis.writingQuality.sentenceVariety}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#140e34] border border-purple-700/40">
                <div className="text-slate-400 text-[11px]">Repetition (15%)</div>
                <div className="text-lg font-black text-amber-300 mt-1">{analysis.writingQuality.repetition}</div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: `${analysis.writingQuality.repetition}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#140e34] border border-purple-700/40">
                <div className="text-slate-400 text-[11px]">Structure (15%)</div>
                <div className="text-lg font-black text-pink-300 mt-1">{analysis.writingQuality.structure}</div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-pink-400" style={{ width: `${analysis.writingQuality.structure}%` }} />
                </div>
              </div>
            </div>

            <p className="text-xs text-purple-200/90 leading-relaxed pt-2">
              <strong>Pedagogical summary:</strong> {qualitySummary} This score evaluates your draft across six explainable dimensions without subjective bias.
            </p>
          </div>
        )}

        {/* CASE C: Readability Factors */}
        {selectedMetric === 'readability' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/40">
                  <BookOpen className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">Readability Diagnostic Breakdown</h3>
                  <p className="text-xs text-purple-200/80">Cognitive pacing & sentence accessibility model</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenFormula('readability')}
                  className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-200 text-xs font-semibold hover:bg-purple-500/30 transition-all border border-purple-400/40 flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Explain Formula</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMetric(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-[#140e34] border border-purple-700/40 space-y-1">
                <span className="text-purple-300 text-[11px] font-sans font-bold">Average Sentence Length</span>
                <div className="text-xl font-black text-white">{analysis.avgSentenceLength} words</div>
                <div className="text-[11px] text-slate-400 font-sans">Ideal range: 14 to 20 words</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#140e34] border border-purple-700/40 space-y-1">
                <span className="text-purple-300 text-[11px] font-sans font-bold">Average Word Length</span>
                <div className="text-xl font-black text-white">{analysis.avgWordLength} chars</div>
                <div className="text-[11px] text-slate-400 font-sans">Lower length means easier comprehension</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#140e34] border border-purple-700/40 space-y-1">
                <span className="text-purple-300 text-[11px] font-sans font-bold">Pacing Assessment</span>
                <div className="text-xl font-black text-emerald-300">{analysis.readabilityCategory}</div>
                <div className="text-[11px] text-slate-400 font-sans">Score: {analysis.readabilityScore} / 100</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0e0926] border border-purple-800/40 space-y-2">
              <div className="text-xs font-bold text-white">Specific Readability Factors:</div>
              <ul className="space-y-1.5 text-xs">
                {analysis.readabilityFactors.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300">
                    <span className="text-purple-400 font-bold">•</span>
                    <span><strong>{f.factor}:</strong> {f.impact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* CASE D: Vocabulary Variety Diagnostic */}
        {selectedMetric === 'vocabulary' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/40">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">Vocabulary Diversity & Lexical Richness</h3>
                  <p className="text-xs text-emerald-200/80">Unique content words evaluated with stop words excluded</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenFormula('vocab_diversity')}
                  className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-200 text-xs font-semibold hover:bg-emerald-500/30 transition-all border border-emerald-400/40 flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Explain Formula</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMetric(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-[#140e34] border border-emerald-700/40 space-y-1">
                <span className="text-emerald-300 text-[11px] font-sans font-bold">Vocabulary Ratio</span>
                <div className="text-2xl font-black text-emerald-300">{analysis.vocabularyDiversity}%</div>
                <div className="text-[11px] text-slate-400 font-sans">{analysis.diversityExplanation}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#140e34] border border-emerald-700/40 space-y-1">
                <span className="text-emerald-300 text-[11px] font-sans font-bold">Content Terms</span>
                <div className="text-2xl font-black text-white">{analysis.uniqueMeaningfulWordsCount}</div>
                <div className="text-[11px] text-slate-400 font-sans">Out of {analysis.meaningfulWordsCount} content words</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#140e34] border border-emerald-700/40 space-y-1">
                <span className="text-emerald-300 text-[11px] font-sans font-bold">Excluded Stop Words</span>
                <div className="text-2xl font-black text-cyan-300">{analysis.wordCount - analysis.meaningfulWordsCount}</div>
                <div className="text-[11px] text-slate-400 font-sans">Common grammatical connectors</div>
              </div>
            </div>

            {/* Top Content Words */}
            <div className="p-3.5 rounded-2xl bg-[#0e0926] border border-emerald-800/40 space-y-2">
              <div className="text-xs font-bold text-white">Most Frequent Meaningful Words:</div>
              <div className="flex flex-wrap gap-2">
                {analysis.wordFrequencies.slice(0, 10).map(wf => (
                  <span key={wf.word} className="px-2.5 py-1 rounded-lg bg-[#19113d] border border-emerald-500/30 text-xs font-mono text-emerald-200">
                    {wf.word} <strong className="text-emerald-400">({wf.count}x)</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CASE E: Sentence Flow & Sentence-by-Sentence Coach */}
        {selectedMetric === 'sentences' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-900/40">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  <Compass className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">Sentence Rhythm & Interactive Coach</h3>
                  <p className="text-xs text-cyan-200/80">Click any sentence to inspect its pacing and suggestions</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenFormula('sentence_variety')}
                  className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-200 text-xs font-semibold hover:bg-cyan-500/30 transition-all border border-cyan-400/40 flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Explain Formula</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMetric(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sentence Length Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#140e34] border border-cyan-700/40">
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Short (≤ 12 words)</span>
                  <span className="text-emerald-400 font-bold">{analysis.sentenceVariety.short} ({analysis.sentenceVariety.shortPercent}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400" style={{ width: `${analysis.sentenceVariety.shortPercent}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#140e34] border border-cyan-700/40">
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Medium (13–22 words)</span>
                  <span className="text-cyan-400 font-bold">{analysis.sentenceVariety.medium} ({analysis.sentenceVariety.mediumPercent}% )</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${analysis.sentenceVariety.mediumPercent}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#140e34] border border-cyan-700/40">
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Long (&gt; 22 words)</span>
                  <span className="text-rose-400 font-bold">{analysis.sentenceVariety.long} ({analysis.sentenceVariety.longPercent}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400" style={{ width: `${analysis.sentenceVariety.longPercent}%` }} />
                </div>
              </div>
            </div>

            {/* Clickable Sentence Numbers */}
            <div className="flex flex-wrap gap-2 pt-1 max-h-36 overflow-y-auto">
              {analysis.sentences.map(s => {
                const isSelected = selectedSentence?.index === s.index;
                return (
                  <button
                    key={s.index}
                    type="button"
                    onClick={() => setSelectedSentence(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 border-cyan-300 font-bold shadow-md shadow-cyan-500/30'
                        : s.isLong
                        ? 'bg-rose-500/20 border-rose-400/50 text-rose-200 hover:bg-rose-500/30'
                        : 'bg-[#18113c] border-purple-500/30 text-purple-200 hover:bg-purple-900/50'
                    }`}
                  >
                    Sentence {s.index} ({s.wordCount}w)
                  </button>
                );
              })}
            </div>

            {/* Selected Sentence Card */}
            {selectedSentence && (
              <div className="p-4 rounded-2xl bg-[#0f0a28] border-2 border-cyan-400/50 space-y-3 shadow-lg shadow-cyan-950/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 font-bold text-xs">
                      Sentence #{selectedSentence.index}
                    </span>
                    <span className="text-xs text-slate-300">
                      {selectedSentence.wordCount} words • {selectedSentence.classification}
                    </span>
                  </div>
                  {selectedSentence.isLong && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/50 text-rose-300">
                      ⚠️ Over {longSentenceThreshold} words
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-[#171038] border border-purple-500/30 text-white text-sm leading-relaxed font-serif">
                  "{selectedSentence.text}"
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-100 space-y-1">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <span>💡 Coaching Advice:</span>
                  </div>
                  <p className="leading-relaxed">
                    {selectedSentence.isLong
                      ? "This sentence is quite long. Consider breaking it into two shorter sentences around a conjunction (such as 'and', 'but', or 'because') for sharper clarity."
                      : selectedSentence.fillerWords.length > 0
                      ? `Try dropping soft filler qualifiers like "${selectedSentence.fillerWords.join(', ')}". Speaking directly sounds more authoritative.`
                      : "Crisp and well-paced. Great sentence structure!"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CASE F: Word Health (Repeated, Fillers & Vague Words) */}
        {selectedMetric === 'words' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/40">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  <SlidersHorizontal className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">Word Health & Repetition Diagnostics</h3>
                  <p className="text-xs text-amber-200/80">Identifies overused words, soft filler qualifiers, and vague descriptors</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMetric(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Repeated Words */}
              <div className="p-4 rounded-2xl card-purple space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-purple-700/30 text-xs font-bold text-purple-200">
                  <span>Repeated Words (3+ times)</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 text-[10px]">{analysis.repeatedWords.length} terms</span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {analysis.repeatedWords.length > 0 ? (
                    analysis.repeatedWords.map(rw => (
                      <div key={rw.word} className="flex justify-between items-center p-2 rounded-xl bg-[#130d32] border border-purple-500/30 text-xs">
                        <span className="text-white font-medium">"{rw.word}"</span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 font-bold text-[11px]">{rw.count}x</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-emerald-300 italic p-2">✓ No over-repeated content words!</div>
                  )}
                </div>
              </div>

              {/* Filler Words */}
              <div className="p-4 rounded-2xl card-amber space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-amber-700/30 text-xs font-bold text-amber-200">
                  <span>Filler Qualifiers</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 text-[10px]">{totalFillerCount} found</span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {analysis.fillerWords.length > 0 ? (
                    analysis.fillerWords.map(fw => (
                      <div key={fw.word} className="p-2 rounded-xl bg-[#1a1208] border border-amber-500/30 text-xs">
                        <div className="flex justify-between font-bold text-amber-300">
                          <span>"{fw.word}"</span>
                          <span>{fw.count}x</span>
                        </div>
                        <div className="text-[10px] text-amber-200/80 mt-0.5">
                          Try: {fw.suggestions.slice(0, 2).join(' or ')}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-emerald-300 italic p-2">✓ Zero filler words detected!</div>
                  )}
                </div>
              </div>

              {/* Vague Words */}
              <div className="p-4 rounded-2xl card-pink space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-pink-700/30 text-xs font-bold text-pink-200">
                  <span>Vague Descriptors</span>
                  <span className="px-2 py-0.5 rounded-full bg-pink-900/60 text-pink-300 text-[10px]">{totalVagueCount} found</span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {analysis.vagueWords.length > 0 ? (
                    analysis.vagueWords.map(vw => (
                      <div key={vw.word} className="p-2 rounded-xl bg-[#200d1c] border border-pink-500/30 text-xs">
                        <div className="flex justify-between font-bold text-pink-300">
                          <span>"{vw.word}"</span>
                          <span>{vw.count}x</span>
                        </div>
                        <div className="text-[10px] text-pink-200/80 mt-0.5">
                          Suggestion: {vw.suggestion}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-emerald-300 italic p-2">✓ No overly vague words!</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CASE G: Tone & Style Notices */}
        {selectedMetric === 'tone' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-900/40">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/40">
                  <Target className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">Tone & Heuristic Style Notices</h3>
                  <p className="text-xs text-indigo-200/80">Evaluates register alignment against selected goal ({selectedGoal})</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenFormula('tone')}
                  className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-200 text-xs font-semibold hover:bg-indigo-500/30 transition-all border border-indigo-400/40 flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Explain Tone</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMetric(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#140e34] border border-indigo-700/40 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-indigo-200 font-bold">Primary Tone:</span>
                <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 font-bold text-xs">
                  {analysis.tone.primaryTone} ({analysis.tone.confidence}% Confidence)
                </span>
              </div>
              <p className="text-xs text-slate-300">{analysis.tone.explanation}</p>
              {analysis.tone.influencingSignals.length > 0 && (
                <div className="text-[11px] text-indigo-300/90 pt-1">
                  Signals detected: {analysis.tone.influencingSignals.join(', ')}
                </div>
              )}
            </div>

            {/* Grammar Issues */}
            {activeGrammarIssues.length > 0 ? (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-white">Style & Mechanics Notices:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeGrammarIssues.map(issue => (
                    <div key={issue.id} className="p-3.5 rounded-xl bg-[#170e24] border border-amber-500/40 flex flex-col justify-between text-xs space-y-2">
                      <div>
                        <div className="font-bold text-amber-300">{issue.error}</div>
                        <div className="text-slate-300 text-[11px] mt-0.5">{issue.why}</div>
                        <div className="text-emerald-300 font-semibold mt-1.5 bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-500/30">
                          💡 Suggestion: {issue.suggestion}
                        </div>
                      </div>
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleDismissIssue(issue.id)}
                          className="px-2.5 py-0.5 rounded text-[10px] text-slate-300 hover:text-white bg-[#22163b] hover:bg-purple-900/50"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300 font-medium">
                ✓ No critical typing repetitions or confused word mechanics flagged!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
