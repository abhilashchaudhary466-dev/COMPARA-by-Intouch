/**
 * Nexus Write — How It Works & Python Logic Viewer
 * Interactive pipeline flow, clickable Python educational concepts explorer,
 * and complete beginner-friendly Python source code viewer with copy functionality.
 */

import React, { useState } from 'react';
import { PYTHON_ENGINE_SOURCE } from '../../engine/pythonCode.ts';
import { 
  Code2, 
  Copy, 
  Check, 
  ArrowRight, 
  Terminal, 
  BookOpen, 
  Braces, 
  ListTree, 
  Layers, 
  HelpCircle,
  FileCode,
  Download
} from 'lucide-react';

export const HowItWorksMode: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<string>('SETS');

  const pipelineSteps = [
    { name: '1. INPUT TEXT', desc: 'Raw character stream from student' },
    { name: '2. CLEAN', desc: 'Strip whitespace & normalize spacing' },
    { name: '3. TOKENIZE', desc: 'Extract words and split sentences via regex' },
    { name: '4. COUNT', desc: 'Count elements & calculate length metrics' },
    { name: '5. FREQUENCY', desc: 'Build dictionary of word occurrences' },
    { name: '6. SET OPERATIONS', desc: 'Compute unique vocab & stop word intersection' },
    { name: '7. CALCULATIONS', desc: 'Run diversity %, similarity %, variety formulas' },
    { name: '8. CLASSIFICATION', desc: 'Map numbers to pedagogical categories' },
    { name: '9. VISUAL REPORT', desc: 'Render 3D hologram & telemetry cards' },
  ];

  const concepts: Record<string, {
    title: string;
    icon: string;
    explanation: string;
    pythonExample: string;
    whyItMatters: string;
  }> = {
    STRINGS: {
      title: 'Python Strings (str)',
      icon: '🔤',
      explanation: 'Strings represent sequences of characters. In writing analysis, text begins as a raw string that requires normalization, case-folding, and pattern matching.',
      pythonExample: `# Convert to lowercase and strip whitespace
text = "  Hello World!  "
cleaned = text.strip().lower()  # "hello world!"`,
      whyItMatters: 'Ensures "Technology" and "technology" are treated as the exact same term.'
    },
    LISTS: {
      title: 'Python Lists (list)',
      icon: '📋',
      explanation: 'Lists are ordered, mutable collections. They preserve the natural sequential word order of sentences and paragraphs.',
      pythonExample: `# Storing ordered word tokens
words = ["science", "relies", "upon", "rigorous", "evidence"]
word_count = len(words)  # 5`,
      whyItMatters: 'Allows measuring sentence length and tracking sequential phrasing patterns.'
    },
    SETS: {
      title: 'Python Sets (set)',
      icon: '⭕',
      explanation: 'Sets are unordered collections of unique elements with lightning-fast O(1) membership lookups and powerful mathematical operations.',
      pythonExample: `# Set intersection for meaningful overlap
passage_a_words = {"energy", "solar", "grid", "storage"}
passage_b_words = {"power", "solar", "battery", "grid"}
shared = passage_a_words.intersection(passage_b_words)  # {"solar", "grid"}`,
      whyItMatters: 'Powers both the stop-word filtering and the educational similarity calculation.'
    },
    DICTIONARIES: {
      title: 'Python Dictionaries (dict)',
      icon: '📖',
      explanation: 'Dictionaries store key-value pairs. They are the ideal data structure for frequency counting and mapping words to advice.',
      pythonExample: `# Counting word occurrences
freq = {}
for word in words:
    freq[word] = freq.get(word, 0) + 1`,
      whyItMatters: 'Instantly identifies repeated terms like "important" or "basically".'
    },
    LOOPS: {
      title: 'Python For & While Loops',
      icon: '🔄',
      explanation: 'Loops iterate over collections such as lists of sentences or dictionary items without repetitive boilerplate code.',
      pythonExample: `# Iterating through each sentence
for idx, sentence in enumerate(sentences, start=1):
    if len(sentence.split()) > 20:
        print(f"Sentence {idx} exceeds target threshold")`,
      whyItMatters: 'Enables scanning thousands of words in milliseconds.'
    },
    FUNCTIONS: {
      title: 'Python Functions (def)',
      icon: '⚙️',
      explanation: 'Functions encapsulate reusable tasks with clear inputs (parameters) and outputs (return values), keeping code modular.',
      pythonExample: `def calculate_average_word_length(words: list) -> float:
    if not words:
        return 0.0
    return round(sum(len(w) for w in words) / len(words), 2)`,
      whyItMatters: 'Makes algorithms testable, explainable, and reproducible by students.'
    },
    CONDITIONS: {
      title: 'Conditional Logic (if / elif / else)',
      icon: '🔀',
      explanation: 'Branching logic maps numerical metrics into pedagogical categories such as High, Moderate, or Needs Improvement.',
      pythonExample: `if diversity_pct >= 75:
    category = "HIGH"
elif diversity_pct >= 50:
    category = "MODERATE"
else:
    category = "LOW"`,
      whyItMatters: 'Translates raw mathematical ratios into intuitive student feedback.'
    },
    PERCENTAGES: {
      title: 'Percentage & Arithmetic Calculations',
      icon: '➗',
      explanation: 'Basic arithmetic formulas convert raw counts into standardized ratios while safeguarding against division by zero.',
      pythonExample: `# Vocabulary diversity percentage formula
meaningful_total = len(meaningful_words)
if meaningful_total > 0:
    diversity_pct = round((len(unique_words) / meaningful_total) * 100, 1)`,
      whyItMatters: 'Standardizes metrics so short and long passages can be compared fairly.'
    }
  };

  const activeConceptData = concepts[selectedConcept];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(PYTHON_ENGINE_SOURCE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadPython = () => {
    const blob = new Blob([PYTHON_ENGINE_SOURCE], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'compara_engine.py';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="holo-card rounded-xl p-5 border border-cyan-500/40">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
            PEDAGOGICAL ARCHITECTURE
          </span>
        </div>
        <h2 className="text-2xl font-extrabold font-heading text-white">
          How It Works & Python Engine
        </h2>
        <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
          COMPARA is built on transparent, explainable Python text processing. 
          No black boxes, no opaque AI hallucinations — every metric is calculated using clear foundational computer science concepts.
        </p>
      </div>

      {/* Visual Educational Pipeline */}
      <div className="holo-card rounded-xl p-5 border border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ListTree className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
              9-STAGE TEXT PROCESSING PIPELINE
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Deterministic Flow</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2 font-mono text-xs">
          {pipelineSteps.map((step, idx) => (
            <div 
              key={idx}
              className="p-3 rounded-lg bg-[#070d1e] border border-cyan-950 flex flex-col justify-between"
            >
              <div>
                <div className="text-cyan-400 font-bold text-[11px] mb-1">{step.name}</div>
                <div className="text-[10px] text-slate-400 leading-tight">{step.desc}</div>
              </div>
              <div className="text-[9px] text-slate-600 mt-2 font-bold">STAGE 0{idx + 1}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Clickable Python Concepts Explorer */}
      <div className="holo-card rounded-xl p-5 border border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
              REQUIRED PYTHON CONCEPTS EXPLORER
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Click any concept to learn</span>
        </div>

        {/* Concept Buttons */}
        <div className="flex flex-wrap gap-2">
          {Object.keys(concepts).map(key => {
            const isSelected = selectedConcept === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedConcept(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                  isSelected
                    ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{concepts[key].icon}</span>
                <span>{key}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Concept Deep Dive */}
        {activeConceptData && (
          <div className="p-4 rounded-xl bg-[#060c1d] border border-cyan-500/30 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-lg">{activeConceptData.icon}</span>
              <h4 className="text-sm font-bold text-white font-heading">{activeConceptData.title}</h4>
            </div>

            <p className="text-slate-300 font-sans text-sm leading-relaxed">
              {activeConceptData.explanation}
            </p>

            <div>
              <div className="text-[11px] text-cyan-400 font-bold uppercase mb-1">Python Code Pattern:</div>
              <pre className="p-3 rounded-lg bg-[#030610] border border-slate-800 text-emerald-300 text-xs overflow-x-auto">
                <code>{activeConceptData.pythonExample}</code>
              </pre>
            </div>

            <div className="p-2.5 rounded bg-cyan-950/40 border border-cyan-900/50 text-[11px] text-cyan-200">
              <span className="font-bold">Why it matters in Nexus Write: </span>
              {activeConceptData.whyItMatters}
            </div>
          </div>
        )}
      </div>

      {/* Authoritative Python Code Viewer */}
      <div className="holo-card rounded-xl p-5 border border-cyan-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                PYTHON TEXT-ANALYSIS ENGINE SOURCE CODE
              </h3>
              <span className="text-[10px] font-mono text-slate-500">
                Clean, educational, runnable reference implementation
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-700/50 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-900 transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied!' : 'COPY CODE'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPython}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-medium hover:border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>DOWNLOAD .PY</span>
            </button>
          </div>
        </div>

        {/* Source Code Container */}
        <div className="relative">
          <pre className="p-4 rounded-xl bg-[#040813] border border-cyan-950/80 font-mono text-xs text-slate-300 leading-relaxed max-h-[500px] overflow-y-auto select-all">
            <code>{PYTHON_ENGINE_SOURCE}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
