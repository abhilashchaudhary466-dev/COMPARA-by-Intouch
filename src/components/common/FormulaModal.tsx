/**
 * Nexus Write — Explainable Formulas Modal
 * Transparent mathematical and algorithmic explanation for every metric.
 */

import React from 'react';
import { X, Calculator, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export type FormulaKey = 
  | 'vocab_diversity' 
  | 'similarity' 
  | 'readability' 
  | 'writing_quality' 
  | 'sentence_variety' 
  | 'tone';

interface FormulaModalProps {
  formulaKey: FormulaKey | null;
  onClose: () => void;
}

export const FormulaModal: React.FC<FormulaModalProps> = ({ formulaKey, onClose }) => {
  if (!formulaKey) return null;

  const contentMap: Record<FormulaKey, {
    title: string;
    subtitle: string;
    mathFormula: string;
    steps: string[];
    pythonSnippet: string;
    disclaimer: string;
  }> = {
    vocab_diversity: {
      title: 'Vocabulary Diversity Calculation',
      subtitle: 'Measure of lexical richness excluding common functional stop words.',
      mathFormula: 'Vocabulary Diversity (%) = ( |Unique Meaningful Words| / |Total Meaningful Words| ) × 100',
      steps: [
        'Filter out standard English stop words (e.g. the, is, at, which) to focus purely on content words.',
        'Convert all remaining words to lowercase and strip non-alphanumeric punctuation.',
        'Use a Python Set (set()) to find the count of distinct unique words.',
        'Divide unique meaningful count by total meaningful count and multiply by 100.',
        'Classify: High (≥ 75%), Moderate (50%–74%), Low (< 50%).'
      ],
      pythonSnippet: `meaningful_words = [w for w in words if w not in STOP_WORDS]
unique_meaningful = set(meaningful_words)
diversity_pct = round((len(unique_meaningful) / len(meaningful_words)) * 100, 1)`,
      disclaimer: 'This represents lexical variety and does not indicate academic depth or intellectual complexity.'
    },
    similarity: {
      title: 'Educational Similarity Estimate',
      subtitle: 'Jaccard-like set overlap of meaningful vocabulary between two passages.',
      mathFormula: 'Similarity (%) = ( |Meaningful A ∩ Meaningful B| / |Meaningful A ∪ Meaningful B| ) × 100',
      steps: [
        'Extract unique meaningful terms from Passage A (Set A) excluding stop words.',
        'Extract unique meaningful terms from Passage B (Set B) excluding stop words.',
        'Compute the Set Intersection (A ∩ B) representing common meaningful vocabulary.',
        'Compute the Set Union (A ∪ B) representing the entire combined unique vocabulary pool.',
        'Divide intersection size by union size and multiply by 100.'
      ],
      pythonSnippet: `shared = set_a.intersection(set_b)
combined = set_a.union(set_b)
similarity_pct = round((len(shared) / len(combined)) * 100, 1)`,
      disclaimer: 'CRITICAL: This is an educational similarity estimate based purely on common vocabulary. It is NOT plagiarism detection and CANNOT determine authorship, copying, or copyright infringement.'
    },
    readability: {
      title: 'Educational Readability Heuristic',
      subtitle: 'Transparent cognitive-pacing model based on sentence length and lexical density.',
      mathFormula: 'Readability Score = 100 − (Sentence Length Penalty + Word Length Penalty + Run-on Penalty)',
      steps: [
        'Base score starts at 100 points.',
        'If Average Sentence Length > 24 words, deduct 25 points; if 19–24 words, deduct 10 points.',
        'If Average Word Length > 6.0 letters (polysyllabic density), deduct 15 points.',
        'If more than 35% of sentences exceed the threshold (default 20 words), deduct 20 points.',
        'Resulting score is bounded between 25 and 100 and mapped into Excellent, Good, Moderate, or Needs Improvement.'
      ],
      pythonSnippet: `score = 100
if avg_sentence_len > 24: score -= 25
if avg_word_len > 6.0: score -= 15
if long_sentence_ratio > 0.35: score -= 20
score = max(25, min(100, score))`,
      disclaimer: 'This formula is a simplified student guide designed for clarity. It does not replace professional formulas like Flesch-Kincaid or Dale-Chall.'
    },
    writing_quality: {
      title: 'Writing Quality Score',
      subtitle: 'Multifactor balanced pedagogical index from 0 to 100.',
      mathFormula: 'Overall = (Clarity × 0.20) + (Readability × 0.20) + (Vocab × 0.15) + (Variety × 0.15) + (Repetition × 0.15) + (Structure × 0.15)',
      steps: [
        'Clarity (20%): Evaluates absence of vague descriptors and unnecessary filler words.',
        'Readability (20%): Evaluates sentence accessibility and cognitive pacing.',
        'Vocabulary (15%): Reflects meaningful vocabulary diversity percentage.',
        'Sentence Variety (15%): Measures balance across short, medium, and long structures.',
        'Repetition (15%): Penalizes overused content keywords that make prose cyclical.',
        'Structure (15%): Evaluates paragraph segmentation and overall composition length.'
      ],
      pythonSnippet: `overall = round(
    clarity * 0.20 + readability * 0.20 + vocabulary * 0.15 +
    sentence_variety * 0.15 + repetition * 0.15 + structure * 0.15
)`,
      disclaimer: 'Educational writing quality score is a diagnostic learning guide, not an objective evaluation of human literary merit or student grade.'
    },
    sentence_variety: {
      title: 'Sentence Variety & Rhythm Distribution',
      subtitle: 'Analysis of sentence-length variation to prevent rhythmic monotony.',
      mathFormula: 'Variety Score = Max(30, 100 − Dev(Short, Med, Long)) × (Active Buckets / 3)',
      steps: [
        'Categorize each sentence: Short (≤ 12 words), Medium (13–22 words), Long (> 22 words).',
        'Calculate percentage distribution across the 3 categories.',
        'Calculate variance against an ideal dynamic rhythm distribution.',
        'Prose that mixes all 3 lengths keeps reader engagement high and achieves higher cadence scores.'
      ],
      pythonSnippet: `categories_present = sum(1 for count in [short, med, long] if count > 0)
variety_score = min(100, categories_present * 30 + 10)`,
      disclaimer: 'Some genres (like technical protocols) legitimately require uniform sentence lengths.'
    },
    tone: {
      title: 'Tone Heuristic Classification',
      subtitle: 'Transparent keyword and syntactic signal matching without opaque black-box AI.',
      mathFormula: 'Tone = ArgMax(Academic, Formal, Persuasive, Emotional, Informal Signals)',
      steps: [
        'Scan text against curated open lexicons for academic discourse (e.g. empirical, methodology, corroborate).',
        'Check for formal transitional markers (e.g. furthermore, moreover, consequently).',
        'Check for persuasive urgencies (e.g. imperative, crucial, undeniable).',
        'Check for informal slang or contractions (e.g. kinda, gonna, cool, contracted verbs).',
        'Assign dominant tone category with a transparent list of contributing keywords.'
      ],
      pythonSnippet: `if len(acad_matches) >= 2: primary = "ACADEMIC"
elif len(form_matches) >= 1: primary = "FORMAL"
elif len(pers_matches) >= 2: primary = "PERSUASIVE"
else: primary = "NEUTRAL"`,
      disclaimer: 'Tone heuristic provides an approximate stylistic estimate and is not a psychological or intent detector.'
    }
  };

  const item = contentMap[formulaKey];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0b1329] border border-cyan-500/40 rounded-xl p-6 shadow-2xl shadow-cyan-950/50 text-slate-100 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="formula-title"
      >
        <div className="flex items-start justify-between pb-4 border-b border-cyan-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-cyan-400 font-mono">Explainable Formula</div>
              <h3 id="formula-title" className="text-lg font-bold text-white font-heading">{item.title}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            aria-label="Close formula modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-300">{item.subtitle}</p>

        {/* Mathematical Expression Box */}
        <div className="mt-4 p-4 rounded-lg bg-[#070d1e] border border-cyan-500/30 font-mono text-sm text-cyan-300 overflow-x-auto">
          {item.mathFormula}
        </div>

        {/* Transparent Steps */}
        <div className="mt-5 space-y-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Algorithmic Procedure</h4>
          <ol className="space-y-2 text-sm text-slate-300">
            {item.steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 text-xs font-mono font-bold text-cyan-400 bg-cyan-950 border border-cyan-800 rounded-full shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Python Reference Implementation */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Python Implementation</h4>
            <span className="text-[11px] font-mono text-emerald-400">Educational Code</span>
          </div>
          <pre className="p-3.5 rounded-lg bg-[#050811] border border-slate-800 text-xs text-emerald-300 font-mono overflow-x-auto">
            <code>{item.pythonSnippet}</code>
          </pre>
        </div>

        {/* Educational Safety Disclaimer */}
        <div className="mt-5 p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/90 leading-relaxed">
            {item.disclaimer}
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-300 bg-cyan-950/70 border border-cyan-700/50 rounded-lg hover:bg-cyan-900/60 transition-colors"
          >
            Close Explanation
          </button>
        </div>
      </div>
    </div>
  );
};
