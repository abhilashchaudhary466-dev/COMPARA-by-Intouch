/**
 * Nexus Write — Improve Mode
 * Rule-based explainable text enhancements, side-by-side before/after comparison,
 * diff audit log, and animated Writing Evolution metrics.
 */

import React, { useState } from 'react';
import { 
  ImprovementAction, 
  improveWritingRuleBased, 
  ImprovementResult 
} from '../../engine/analyzer.ts';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  Wand2, 
  CheckCircle2, 
  Diff, 
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';

interface ImproveModeProps {
  currentText: string;
  onApplyImprovement: (newText: string) => void;
  longSentenceThreshold: number;
}

export const ImproveMode: React.FC<ImproveModeProps> = ({
  currentText,
  onApplyImprovement,
  longSentenceThreshold
}) => {
  const [selectedActions, setSelectedActions] = useState<ImprovementAction[]>([
    'fix_grammar',
    'make_concise',
    'make_clearer',
    'improve_vocab'
  ]);

  const [applied, setApplied] = useState(false);

  const availableActions: { id: ImprovementAction; label: string; desc: string }[] = [
    { id: 'fix_grammar', label: 'Fix Grammar & Mechanics', desc: 'Resolve duplicate words, punctuation repeats, and confused pairs.' },
    { id: 'make_clearer', label: 'Make Clearer', desc: 'Clarify vague descriptors with specific contextual terminology.' },
    { id: 'make_concise', label: 'Make More Concise', desc: 'Trim empty filler qualifiers (very, really, basically, just).' },
    { id: 'make_formal', label: 'Make More Formal', desc: 'Upgrade informal colloquial expressions into academic registers.' },
    { id: 'simplify', label: 'Simplify Phrasing', desc: 'Unpack overly convoluted clause splices for clearer cadence.' },
    { id: 'improve_vocab', label: 'Improve Vocabulary', desc: 'Substitute generic words (good, bad, big, thing) with precise terms.' },
    { id: 'reduce_repetition', label: 'Reduce Repetition', desc: 'Vary repeated adjacent vocabulary.' },
    { id: 'improve_flow', label: 'Improve Sentence Flow', desc: 'Refactor awkward run-on splices with proper punctuation.' }
  ];

  const toggleAction = (actionId: ImprovementAction) => {
    setSelectedActions(prev => 
      prev.includes(actionId) ? prev.filter(a => a !== actionId) : [...prev, actionId]
    );
  };

  // Run transparent rule-based improvement
  const result: ImprovementResult = improveWritingRuleBased(
    currentText, 
    selectedActions, 
    longSentenceThreshold
  );

  const handleApply = () => {
    onApplyImprovement(result.improved);
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  const origQ = result.originalAnalysis.writingQuality.overall;
  const impQ = result.improvedAnalysis.writingQuality.overall;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="holo-card rounded-2xl p-5 border border-emerald-500/50 bg-gradient-to-br from-[#0a1f18]/95 via-[#0e162b]/90 to-[#1e0a24]/90 relative overflow-hidden shadow-2xl shadow-emerald-950/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 uppercase">
                Interactive Text Polisher
              </span>
            </div>
            <h2 className="text-2xl font-extrabold font-heading text-white">
              Improve My Writing
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Choose which transformations to apply. COMPARA keeps your meaning intact and explains every improvement.
            </p>
          </div>

          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-xl shadow-emerald-500/30"
          >
            {applied ? <Check className="w-4 h-4 text-black" /> : <Sparkles className="w-4 h-4 text-black" />}
            {applied ? 'Applied to Editor!' : 'Accept & Apply to Editor'}
          </button>
        </div>
      </div>

      {/* Action Selection Pills */}
      <div className="holo-card rounded-2xl p-4 border border-purple-500/30 bg-[#0e0c24]/90">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-900/40">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Select Focus Areas ({selectedActions.length} active)</span>
          </div>
          <span className="text-[11px] font-mono text-purple-300">
            Click to toggle transformations
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {availableActions.map(action => {
            const isActive = selectedActions.includes(action.id);
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => toggleAction(action.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'border-emerald-400 bg-gradient-to-br from-emerald-950/80 to-teal-950/60 text-emerald-200 shadow-md shadow-emerald-950/60'
                    : 'border-slate-800 bg-[#070a1a]/70 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                  <span>{action.label}</span>
                  {isActive && <Check className="w-3 h-3 text-emerald-400" />}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                  {action.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Original vs Improved */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ORIGINAL (Warm Purple / Slate) */}
        <div className="holo-card rounded-2xl p-4 border border-purple-500/30 bg-gradient-to-b from-[#130d29]/90 to-[#070d1e]/90 flex flex-col space-y-3 shadow-md shadow-purple-950/30">
          <div className="flex items-center justify-between pb-2 border-b border-purple-900/40">
            <span className="px-2.5 py-0.5 rounded-md bg-purple-950 border border-purple-700/60 text-purple-300 font-mono text-xs font-bold uppercase">
              ORIGINAL DRAFT
            </span>
            <span className="text-xs font-mono text-purple-300">
              Quality: {origQ} / 100 • {result.originalAnalysis.wordCount} words
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#050616] text-slate-300 font-sans text-sm leading-relaxed min-h-[200px] max-h-[360px] overflow-y-auto whitespace-pre-wrap">
            {result.original || <span className="text-slate-600 italic">No text to improve. Enter text in Analyze mode.</span>}
          </div>
        </div>

        {/* SUGGESTED IMPROVED VERSION (Radiant Emerald) */}
        <div className="holo-card rounded-2xl p-4 border border-emerald-500/50 bg-gradient-to-b from-[#06241a]/90 to-[#070d1e]/90 flex flex-col space-y-3 shadow-xl shadow-emerald-950/40">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-900/40">
            <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-mono text-xs font-bold uppercase">
              SUGGESTED REVISION
            </span>
            <span className="text-xs font-mono text-emerald-300 font-bold">
              Quality: {impQ} / 100 (+{Math.max(0, impQ - origQ)}) • {result.improvedAnalysis.wordCount} words
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#040f10] text-emerald-100 font-sans text-sm leading-relaxed min-h-[200px] max-h-[360px] overflow-y-auto whitespace-pre-wrap border border-emerald-900/40">
            {result.improved || <span className="text-slate-600 italic">No improved text generated.</span>}
          </div>
        </div>
      </div>

      {/* WRITING EVOLUTION TELEMETRY (Before vs After Comparison) */}
      <div className="holo-card rounded-2xl p-5 border border-cyan-500/40 bg-gradient-to-br from-[#071324]/90 via-[#100c29]/90 to-[#07191d]/90 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-emerald-400 uppercase">
              WRITING EVOLUTION METRICS
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Before vs After comparison
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Quality Evolution */}
          <div className="p-3 rounded-xl bg-gradient-to-b from-purple-950/50 to-[#070d1e] border border-purple-500/40 font-mono text-center">
            <div className="text-[10px] text-purple-300 uppercase font-semibold">Writing Quality</div>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="text-slate-400 text-sm font-bold">{origQ}</span>
              <ArrowRight className="w-3 h-3 text-purple-400" />
              <span className="text-purple-300 text-lg font-black">{impQ}</span>
            </div>
          </div>

          {/* Word Count Evolution */}
          <div className="p-3 rounded-xl bg-gradient-to-b from-cyan-950/50 to-[#070d1e] border border-cyan-500/40 font-mono text-center">
            <div className="text-[10px] text-cyan-300 uppercase font-semibold">Word Count</div>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="text-slate-400 text-sm font-bold">{result.originalAnalysis.wordCount}</span>
              <ArrowRight className="w-3 h-3 text-cyan-400" />
              <span className="text-cyan-300 text-lg font-black">{result.improvedAnalysis.wordCount}</span>
            </div>
          </div>

          {/* Readability Score */}
          <div className="p-3 rounded-xl bg-gradient-to-b from-pink-950/50 to-[#070d1e] border border-pink-500/40 font-mono text-center">
            <div className="text-[10px] text-pink-300 uppercase font-semibold">Readability</div>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="text-slate-400 text-sm font-bold">{result.originalAnalysis.readabilityScore}</span>
              <ArrowRight className="w-3 h-3 text-pink-400" />
              <span className="text-pink-300 text-lg font-black">{result.improvedAnalysis.readabilityScore}</span>
            </div>
          </div>

          {/* Vocabulary Diversity */}
          <div className="p-3 rounded-xl bg-gradient-to-b from-emerald-950/50 to-[#070d1e] border border-emerald-500/40 font-mono text-center">
            <div className="text-[10px] text-emerald-300 uppercase font-semibold">Vocab Diversity</div>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="text-slate-400 text-sm font-bold">{result.originalAnalysis.vocabularyDiversity}%</span>
              <ArrowRight className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-300 text-lg font-black">{result.improvedAnalysis.vocabularyDiversity}%</span>
            </div>
          </div>

          {/* Long Sentences Count */}
          <div className="p-3 rounded-xl bg-gradient-to-b from-amber-950/50 to-[#070d1e] border border-amber-500/40 font-mono text-center">
            <div className="text-[10px] text-amber-300 uppercase font-semibold">Long Sentences</div>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="text-slate-400 text-sm font-bold">{result.originalAnalysis.longSentences.length}</span>
              <ArrowRight className="w-3 h-3 text-amber-400" />
              <span className="text-amber-300 text-lg font-black">{result.improvedAnalysis.longSentences.length}</span>
            </div>
          </div>

          {/* Filler Words */}
          <div className="p-3 rounded-xl bg-gradient-to-b from-sky-950/50 to-[#070d1e] border border-sky-500/40 font-mono text-center">
            <div className="text-[10px] text-sky-300 uppercase font-semibold">Fillers Flagged</div>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="text-slate-400 text-sm font-bold">{result.originalAnalysis.fillerWords.reduce((a, b) => a + b.count, 0)}</span>
              <ArrowRight className="w-3 h-3 text-sky-400" />
              <span className="text-sky-300 text-lg font-black">{result.improvedAnalysis.fillerWords.reduce((a, b) => a + b.count, 0)}</span>
            </div>
          </div>
        </div>

        {/* Change Audit Log */}
        {result.changesApplied.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
            <div className="text-xs font-mono font-bold text-slate-300 uppercase">
              Transformations Applied ({result.changesApplied.length})
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
              {result.changesApplied.map((chg, idx) => (
                <div key={idx} className="p-2.5 rounded bg-[#070d1e] border border-cyan-950 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-cyan-300 font-bold">{chg.action}: </span>
                    <span className="text-slate-400">{chg.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-[11px] text-slate-500 font-mono italic">
          Note: Writing quality scores are educational guidelines. A higher score does not automatically signify literary superiority.
        </div>
      </div>
    </div>
  );
};
