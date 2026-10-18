/**
 * Nexus Write — Insights Mode
 * AI-Style transparent insights generated purely from calculated data,
 * Top 3 ranked improvements, Writing Quality breakdown, and Writing Fingerprint visualization.
 */

import React from 'react';
import { 
  TextAnalysis, 
  WritingGoal 
} from '../../types/index.ts';
import { FormulaKey } from '../common/FormulaModal.tsx';
import { 
  Lightbulb, 
  Target, 
  BarChart, 
  Fingerprint, 
  ShieldAlert, 
  ArrowUpRight, 
  CheckCircle2, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface InsightsModeProps {
  analysis: TextAnalysis;
  selectedGoal: WritingGoal;
  onOpenFormula: (key: FormulaKey) => void;
}

export const InsightsMode: React.FC<InsightsModeProps> = ({
  analysis,
  selectedGoal,
  onOpenFormula
}) => {
  const { writingQuality, topImprovements, insights, fingerprint } = analysis;

  // Render SVG radar / polygon for the Educational Writing Fingerprint
  const renderFingerprintSVG = () => {
    const center = 100;
    const maxRadius = 75;
    const pointsCount = 8;
    const angleStep = (Math.PI * 2) / pointsCount;

    const coords = fingerprint.hashVector.map((val, i) => {
      const radius = (val / 100) * maxRadius;
      const angle = i * angleStep - Math.PI / 2;
      return {
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle)
      };
    });

    const polygonPoints = coords.map(c => `${c.x},${c.y}`).join(' ');
    const dotColors = ['#22d3ee', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f43f5e', '#8b5cf6'];

    return (
      <svg viewBox="0 0 200 200" className="w-52 h-52 sm:w-60 sm:h-60 mx-auto filter drop-shadow-[0_0_16px_rgba(236,72,153,0.3)]">
        <defs>
          <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
          </radialGradient>
        </defs>

        {/* Background Concentric Radar Rings */}
        <circle cx={center} cy={center} r={maxRadius * 0.33} fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx={center} cy={center} r={maxRadius * 0.66} fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx={center} cy={center} r={maxRadius} fill="none" stroke="#64748b" strokeWidth="1.5" />

        {/* Radial Axis Lines */}
        {Array.from({ length: pointsCount }).map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x2 = center + maxRadius * Math.cos(angle);
          const y2 = center + maxRadius * Math.sin(angle);
          return <line key={i} x1={center} y1={center} x2={x2} y2={y2} stroke="#334155" strokeWidth="1" />;
        })}

        {/* Dynamic Stylistic Vibrant Polygon */}
        <polygon 
          points={polygonPoints} 
          fill="url(#radarGrad)" 
          stroke="#f43f5e" 
          strokeWidth="2.5" 
          className="transition-all duration-700"
        />

        {/* Multi-Colored Data Vertices */}
        {coords.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r="4" fill={dotColors[i % dotColors.length]} stroke="#0a0826" strokeWidth="1.5" />
        ))}
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Section: AI-Style Heuristic Insights */}
      <div className="holo-card rounded-2xl p-5 border border-purple-500/40 bg-gradient-to-br from-[#120d2b]/95 via-[#0d1627]/90 to-[#190a24]/90 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <h2 className="text-xs font-mono font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 uppercase">
              AI-Style Transparent Insights
            </h2>
          </div>
          <span className="text-[11px] font-mono text-purple-300">
            Strictly derived from real mathematical metrics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.map((insight, idx) => {
            const cardThemes = [
              'border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 to-blue-950/20 text-cyan-100',
              'border-pink-500/40 bg-gradient-to-r from-pink-950/40 to-purple-950/20 text-pink-100',
              'border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 to-teal-950/20 text-emerald-100',
              'border-amber-500/40 bg-gradient-to-r from-amber-950/40 to-orange-950/20 text-amber-100',
            ];
            const theme = cardThemes[idx % cardThemes.length];

            return (
              <div 
                key={idx} 
                className={`p-3.5 rounded-xl border ${theme} flex items-start gap-3 text-xs font-mono leading-relaxed shadow-md`}
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-black/60 border border-white/20 text-white text-[10px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{insight}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Middle Grid: Top 3 Improvements vs Educational Writing Quality Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top 3 Prioritized Improvements (7 Cols) */}
        <div className="lg:col-span-7 holo-card rounded-xl p-5 border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-mono font-bold tracking-wider text-amber-300 uppercase">
                TOP 3 PRIORITIZED IMPROVEMENTS
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Calibrated for: <strong className="text-white uppercase">{selectedGoal}</strong>
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Rather than overwhelming you with dozens of conflicting warnings, Nexus Write isolates 
            the 3 highest-impact refinements to focus your editing energy.
          </p>

          <div className="space-y-3">
            {topImprovements.length > 0 ? (
              topImprovements.map((imp, idx) => (
                <div 
                  key={imp.id}
                  className="p-4 rounded-xl bg-[#070d1e] border border-slate-800 hover:border-cyan-600/50 transition-colors space-y-2 font-mono text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-100 text-sm">{imp.title}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      imp.impact === 'HIGH' 
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-600/50' 
                        : 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/50'
                    }`}>
                      {imp.impact} IMPACT
                    </span>
                  </div>

                  <p className="text-slate-400 text-xs pl-8 font-sans leading-normal">
                    {imp.description}
                  </p>

                  <div className="pl-8 pt-1 text-[11px] text-cyan-300 flex items-center gap-1">
                    <span>💡 Action:</span>
                    <span className="text-slate-300">{imp.actionPrompt}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 rounded-xl bg-[#070d1e] border border-slate-800 text-center font-mono text-xs text-emerald-400">
                ✓ No critical warnings detected! Prose meets primary balance thresholds.
              </div>
            )}
          </div>
        </div>

        {/* Writing Quality Breakdown (5 Cols) */}
        <div className="lg:col-span-5 holo-card rounded-xl p-5 border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400">Multifactor Index</span>
              <h3 className="text-sm font-bold text-white font-heading">Writing Quality Breakdown</h3>
            </div>
            <button 
              onClick={() => onOpenFormula('writing_quality')}
              className="text-slate-400 hover:text-cyan-400"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3.5 rounded-lg bg-[#070d1e] border border-cyan-950 flex items-center justify-between font-mono">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Educational Score</div>
              <div className="text-3xl font-extrabold text-cyan-300">{writingQuality.overall} <span className="text-sm font-normal text-slate-500">/ 100</span></div>
            </div>
            <div className="text-right text-[11px] text-slate-400">
              Diagnostic Guide
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {[
              { label: 'Clarity', val: writingQuality.clarity, weight: '20%', barClass: 'bg-gradient-to-r from-cyan-400 to-blue-500', textClass: 'text-cyan-300' },
              { label: 'Readability', val: writingQuality.readability, weight: '20%', barClass: 'bg-gradient-to-r from-purple-400 to-pink-500', textClass: 'text-purple-300' },
              { label: 'Vocabulary Variety', val: writingQuality.vocabulary, weight: '15%', barClass: 'bg-gradient-to-r from-emerald-400 to-teal-400', textClass: 'text-emerald-300' },
              { label: 'Sentence Variety', val: writingQuality.sentenceVariety, weight: '15%', barClass: 'bg-gradient-to-r from-sky-400 to-cyan-300', textClass: 'text-sky-300' },
              { label: 'Repetition Control', val: writingQuality.repetition, weight: '15%', barClass: 'bg-gradient-to-r from-amber-400 to-orange-500', textClass: 'text-amber-300' },
              { label: 'Structural Cohesion', val: writingQuality.structure, weight: '15%', barClass: 'bg-gradient-to-r from-fuchsia-400 to-rose-500', textClass: 'text-pink-300' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                  <span>{item.label} <span className="text-slate-500">({item.weight})</span></span>
                  <span className={`font-bold ${item.textClass}`}>{item.val}%</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full ${item.barClass} transition-all duration-700 shadow-sm`} 
                    style={{ width: `${item.val}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 font-mono leading-relaxed pt-2 border-t border-slate-800">
            Educational Writing Quality is a simplified student indicator, not a formal academic review or grading evaluation.
          </p>
        </div>
      </div>

      {/* Lower Section: Educational Writing Fingerprint Visualization */}
      <div className="holo-card rounded-xl p-5 border border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
              EDUCATIONAL WRITING FINGERPRINT
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Geometric Radar Map of Text Statistics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Radar Visualization */}
          <div className="md:col-span-5 flex justify-center">
            {renderFingerprintSVG()}
          </div>

          {/* Statistical Dimensions Legend */}
          <div className="md:col-span-7 space-y-3 font-mono text-xs">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded bg-[#070d1e] border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Vocab Richness</div>
                <div className="text-cyan-300 font-bold">{fingerprint.vocabDiversity}%</div>
              </div>
              <div className="p-2.5 rounded bg-[#070d1e] border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Avg Sentence Length</div>
                <div className="text-cyan-300 font-bold">{fingerprint.avgSentenceLen} words</div>
              </div>
              <div className="p-2.5 rounded bg-[#070d1e] border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Avg Word Length</div>
                <div className="text-cyan-300 font-bold">{fingerprint.avgWordLen} chars</div>
              </div>
              <div className="p-2.5 rounded bg-[#070d1e] border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Sentence Variation</div>
                <div className="text-cyan-300 font-bold">{fingerprint.sentenceVariation}/100</div>
              </div>
              <div className="p-2.5 rounded bg-[#070d1e] border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Repetition Ratio</div>
                <div className="text-purple-300 font-bold">{fingerprint.repetitionRatio}%</div>
              </div>
              <div className="p-2.5 rounded bg-[#070d1e] border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Punctuation Density</div>
                <div className="text-purple-300 font-bold">{fingerprint.punctuationDensity}%</div>
              </div>
            </div>

            {/* Mandatory Authorship Disclaimer */}
            <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>CRITICAL NOTICE:</strong> This fingerprint is ONLY an educational visualization of writing statistics. 
                It does not identify authors and should NEVER be used for authorship verification, biometric identification, or integrity forensics.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
