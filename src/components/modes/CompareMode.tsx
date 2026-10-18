/**
 * Nexus Write — Compare Mode
 * Educational side-by-side passage comparison, interactive similarity heatmap,
 * transparent stop-word breakdown, and explainable vocabulary overlap.
 */

import React, { useState } from 'react';
import { 
  ComparisonAnalysis 
} from '../../types/index.ts';
import { FormulaKey } from '../common/FormulaModal.tsx';
import { 
  GitCompare, 
  HelpCircle, 
  ShieldAlert, 
  Layers, 
  Check, 
  Filter, 
  Sparkles, 
  Eye, 
  ArrowRight,
  TrendingUp,
  MinusCircle,
  PlusCircle
} from 'lucide-react';

interface CompareModeProps {
  textA: string;
  textB: string;
  onChangeTextA: (val: string) => void;
  onChangeTextB: (val: string) => void;
  comparison: ComparisonAnalysis;
  onOpenFormula: (key: FormulaKey) => void;
}

export const CompareMode: React.FC<CompareModeProps> = ({
  textA,
  textB,
  onChangeTextA,
  onChangeTextB,
  comparison,
  onOpenFormula
}) => {
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'heatmap' | 'breakdown' | 'fingerprints'>('heatmap');

  const { passageA, passageB, similarityPercentage } = comparison;

  // Render passage with interactive highlight on shared/unique terms
  const renderHighlightedPassage = (text: string, isPassageA: boolean) => {
    if (!text) return <span className="text-slate-500 italic">No text provided.</span>;

    const words = text.split(/(\s+)/);
    const sharedSet = new Set(comparison.meaningfulSharedWords.map(w => w.toLowerCase()));
    const uniqueSet = new Set(
      (isPassageA ? comparison.uniqueToA : comparison.uniqueToB).map(w => w.toLowerCase())
    );

    return words.map((token, i) => {
      const cleanWord = token.toLowerCase().replace(/[^a-z0-9']/g, '');
      const isShared = sharedSet.has(cleanWord);
      const isUnique = uniqueSet.has(cleanWord);
      const isSelected = highlightedWord && cleanWord === highlightedWord.toLowerCase();

      if (isShared) {
        return (
          <span
            key={i}
            onClick={() => setHighlightedWord(isSelected ? null : cleanWord)}
            className={`cursor-pointer px-0.5 rounded transition-colors ${
              isSelected
                ? 'bg-amber-400 text-black font-bold ring-2 ring-amber-300'
                : 'bg-cyan-500/25 text-cyan-200 hover:bg-cyan-500/40 border-b border-cyan-400/50'
            }`}
            title={`Shared word: "${cleanWord}" (Click to isolate)`}
          >
            {token}
          </span>
        );
      }

      if (isUnique) {
        return (
          <span
            key={i}
            className="text-slate-200"
          >
            {token}
          </span>
        );
      }

      return <span key={i} className="text-slate-400">{token}</span>;
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Educational Similarity Gauge with Vibrant Holographic Styling */}
      <div className="holo-card rounded-2xl p-5 border border-purple-500/50 bg-gradient-to-br from-[#120d2b]/95 via-[#0d1527]/90 to-[#1e0a24]/90 relative overflow-hidden shadow-2xl shadow-purple-950/60">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 uppercase">
                Educational Similarity & Vocabulary Overlap
              </span>
              <button 
                onClick={() => onOpenFormula('similarity')}
                className="text-slate-400 hover:text-cyan-400 p-0.5"
                title="How was this calculated?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Comparative Analysis Studio
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Calculated using explainable set intersection of content vocabulary. 
              Common functional stop words are strictly excluded.
            </p>
          </div>

          {/* Holographic Circular Vibrant Gauge */}
          <div className="flex items-center gap-6">
            <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-cyan-950/80 via-purple-950/80 to-pink-950/80 border-2 border-purple-400/60 shadow-xl shadow-purple-950/80 p-1">
              <div 
                className="absolute inset-0 rounded-full border-2 border-pink-400 transition-all duration-1000 shadow-md shadow-pink-500/40"
                style={{
                  clipPath: `polygon(50% 50%, -50% -50%, ${similarityPercentage}% 0%, 100% 100%)`
                }}
              />
              <div className="text-center z-10 font-mono">
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-pink-200 to-amber-300">{similarityPercentage}%</div>
                <div className="text-[9px] uppercase tracking-wider text-pink-300 font-bold">OVERLAP</div>
              </div>
            </div>

            <div className="hidden sm:flex flex-col gap-1.5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-blue-950/40 border border-cyan-500/40">
                <span className="text-slate-400">Shared Meaningful: </span>
                <span className="text-cyan-300 font-bold">{comparison.meaningfulSharedWords.length} words</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-purple-950/60 to-pink-950/40 border border-pink-500/40">
                <span className="text-slate-400">Excluded Stop Words: </span>
                <span className="text-pink-300 font-bold">{comparison.excludedStopWords.length} words</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Educational Disclaimer */}
        <div className="mt-4 p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-2.5 text-xs text-amber-200">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>IMPORTANT:</strong> This tool uses simple explainable rules and cannot determine whether text was copied. 
            High vocabulary overlap naturally occurs when two passages discuss the exact same subject matter.
          </span>
        </div>
      </div>

      {/* Side-by-Side Dual Text Editors with Radiant Cyan & Magenta Personas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PASSAGE A (Electric Cyan) */}
        <div className="holo-card rounded-2xl p-4 border border-cyan-500/40 bg-gradient-to-b from-[#09152b]/90 to-[#070d1e]/90 flex flex-col space-y-3 shadow-lg shadow-cyan-950/40">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-900/50">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-mono text-xs font-bold">
                PASSAGE A
              </span>
              <span className="text-xs font-mono text-slate-400">
                {passageA.wordCount} words • {passageA.sentenceCount} sents
              </span>
            </div>
            <span className="text-[11px] font-mono text-cyan-300 font-semibold">
              Vocab: {passageA.vocabularyDiversity}%
            </span>
          </div>

          <textarea
            value={textA}
            onChange={e => onChangeTextA(e.target.value)}
            placeholder="Enter Passage A..."
            className="w-full min-h-[220px] bg-transparent text-slate-100 placeholder-slate-500 font-sans text-sm leading-relaxed p-2 focus:outline-none resize-y selection:bg-cyan-500/30 selection:text-cyan-200"
            aria-label="Passage A input"
          />

          <div className="pt-2 border-t border-cyan-950 flex justify-between text-[11px] font-mono text-slate-400">
            <span>Avg Sentence: <strong className="text-cyan-200">{passageA.avgSentenceLength} words</strong></span>
            <span>Tone: <strong className="text-cyan-300">{passageA.tone.primaryTone}</strong></span>
          </div>
        </div>

        {/* PASSAGE B (Electric Pink/Magenta) */}
        <div className="holo-card rounded-2xl p-4 border border-pink-500/40 bg-gradient-to-b from-[#210926]/90 to-[#070d1e]/90 flex flex-col space-y-3 shadow-lg shadow-pink-950/40">
          <div className="flex items-center justify-between pb-2 border-b border-pink-900/50">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-pink-500 to-rose-600 text-white font-mono text-xs font-bold">
                PASSAGE B
              </span>
              <span className="text-xs font-mono text-slate-400">
                {passageB.wordCount} words • {passageB.sentenceCount} sents
              </span>
            </div>
            <span className="text-[11px] font-mono text-pink-300 font-semibold">
              Vocab: {passageB.vocabularyDiversity}%
            </span>
          </div>

          <textarea
            value={textB}
            onChange={e => onChangeTextB(e.target.value)}
            placeholder="Enter Passage B..."
            className="w-full min-h-[220px] bg-transparent text-slate-100 placeholder-slate-500 font-sans text-sm leading-relaxed p-2 focus:outline-none resize-y selection:bg-pink-500/30 selection:text-pink-200"
            aria-label="Passage B input"
          />

          <div className="pt-2 border-t border-pink-950 flex justify-between text-[11px] font-mono text-slate-400">
            <span>Avg Sentence: <strong className="text-pink-200">{passageB.avgSentenceLength} words</strong></span>
            <span>Tone: <strong className="text-pink-300">{passageB.tone.primaryTone}</strong></span>
          </div>
        </div>
      </div>

      {/* Tabs: Interactive Similarity Heatmap vs Explainable Breakdown */}
      <div className="holo-card rounded-xl p-5 border border-cyan-500/30 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-white font-heading">
              Comparative Inspection Studio
            </h3>
            {highlightedWord && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-400 text-black text-xs font-mono font-bold">
                Isolated: "{highlightedWord}"
                <button 
                  onClick={() => setHighlightedWord(null)}
                  className="hover:opacity-70 ml-1"
                >
                  ×
                </button>
              </span>
            )}
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('heatmap')}
              className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                activeTab === 'heatmap' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive Heatmap
            </button>
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                activeTab === 'breakdown' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-white'
              }`}
            >
              Why Is Similarity This High?
            </button>
          </div>
        </div>

        {/* View 1: Interactive Heatmap */}
        {activeTab === 'heatmap' && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-[#070d1e] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-cyan-500/30 border border-cyan-400/60" />
                  <span className="text-cyan-200">Shared Content Words (Click to filter)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-slate-800" />
                  <span className="text-slate-400">Unique Vocabulary</span>
                </span>
              </div>
              <span className="text-slate-500">
                Click any highlighted word in either passage or the tags below
              </span>
            </div>

            {/* Clickable Shared Words Tag Cloud */}
            <div>
              <div className="text-xs font-mono uppercase text-cyan-400 mb-2 font-bold">
                MEANINGFUL SHARED WORDS ({comparison.meaningfulSharedWords.length})
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
                {comparison.meaningfulSharedWords.map(word => {
                  const isSelected = highlightedWord?.toLowerCase() === word.toLowerCase();
                  return (
                    <button
                      key={word}
                      onClick={() => setHighlightedWord(isSelected ? null : word)}
                      className={`px-2 py-0.5 rounded text-xs font-mono transition-all border ${
                        isSelected
                          ? 'bg-amber-400 text-black font-bold border-amber-300'
                          : 'bg-cyan-950/60 border-cyan-800/50 text-cyan-300 hover:bg-cyan-900/60'
                      }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Side-by-Side Highlighted Texts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#060c1d] border border-cyan-900/40 text-sm leading-relaxed max-h-60 overflow-y-auto">
                <div className="text-[10px] uppercase font-mono text-cyan-400 mb-2 font-bold">Passage A Overlap View</div>
                {renderHighlightedPassage(textA, true)}
              </div>
              <div className="p-4 rounded-xl bg-[#060c1d] border border-purple-900/40 text-sm leading-relaxed max-h-60 overflow-y-auto">
                <div className="text-[10px] uppercase font-mono text-purple-400 mb-2 font-bold">Passage B Overlap View</div>
                {renderHighlightedPassage(textB, false)}
              </div>
            </div>

            {/* Excluded Stop Words Disclosure */}
            <div className="p-3 rounded-lg bg-[#070d1e] border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-mono font-bold uppercase text-slate-300">
                  EXCLUDED COMMON STOP WORDS ({comparison.excludedStopWords.length})
                </span>
                <span className="text-[11px] font-mono text-slate-500">(Removed before overlap calculation)</span>
              </div>
              <div className="flex flex-wrap gap-1 text-[11px] font-mono text-slate-400 max-h-20 overflow-y-auto">
                {comparison.excludedStopWords.map(w => (
                  <span key={w} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* View 2: "Why is the similarity this high?" Transparent Factors */}
        {activeTab === 'breakdown' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Positive Contributors */}
              <div className="p-4 rounded-xl bg-[#070d1e] border border-emerald-900/50 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                  <PlusCircle className="w-4 h-4" />
                  <span>SIMILARITY CONTRIBUTORS (+)</span>
                </div>
                <div className="space-y-2 text-xs font-mono text-slate-300">
                  {comparison.similarityContributors.map((c, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">+</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Differentiators */}
              <div className="p-4 rounded-xl bg-[#070d1e] border border-sky-900/50 space-y-3">
                <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-bold uppercase">
                  <MinusCircle className="w-4 h-4" />
                  <span>DIFFERENTIATING FACTORS (−)</span>
                </div>
                <div className="space-y-2 text-xs font-mono text-slate-300">
                  {comparison.differentiators.map((d, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-sky-400 font-bold">−</span>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#050811] border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed">
              <span className="text-cyan-400 font-bold">Summary Explanation: </span>
              {comparison.explanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
