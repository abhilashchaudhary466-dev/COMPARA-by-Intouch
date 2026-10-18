/**
 * Nexus Write — Comprehensive Report Generator Modal
 * Generates transparent diagnostic reports exportable as Plain Text or JSON, with Print view.
 */

import React, { useState } from 'react';
import { X, FileText, Copy, Download, Printer, Check, ShieldAlert } from 'lucide-react';
import { TextAnalysis, ComparisonAnalysis } from '../../types/index.ts';

interface ReportModalProps {
  analysis: TextAnalysis;
  comparison?: ComparisonAnalysis | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  analysis,
  comparison,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const disclaimerText = 
    "DISCLAIMER: COMPARA is an educational writing-analysis and comparison tool. " +
    "Similarity results use simple explainable rules and should NOT be interpreted as professional plagiarism detection. " +
    "Writing-quality scores are simplified educational indicators, not professional academic evaluations.";

  const generatePlainTextReport = (): string => {
    let report = `=============================================================================
COMPARA — EXPLAINABLE WRITING & COMPARISON INTELLIGENCE REPORT
Generated on: ${new Date().toLocaleString()}
=============================================================================

1. TEXT METRICS & STRUCTURAL SUMMARY
-----------------------------------------------------------------------------
- Word Count:              ${analysis.wordCount}
- Character Count:         ${analysis.charCount} (without spaces: ${analysis.charCountNoSpaces})
- Sentence Count:          ${analysis.sentenceCount}
- Paragraph Count:         ${analysis.paragraphCount}
- Average Word Length:     ${analysis.avgWordLength} characters
- Average Sentence Length: ${analysis.avgSentenceLength} words

2. EDUCATIONAL WRITING QUALITY INDEX (0-100)
-----------------------------------------------------------------------------
Overall Quality Score: ${analysis.writingQuality.overall} / 100
- Clarity:            ${analysis.writingQuality.clarity} / 100
- Readability:        ${analysis.writingQuality.readability} / 100
- Vocabulary Variety: ${analysis.writingQuality.vocabulary} / 100
- Sentence Cadence:   ${analysis.writingQuality.sentenceVariety} / 100
- Repetition Control: ${analysis.writingQuality.repetition} / 100
- Structure:          ${analysis.writingQuality.structure} / 100

3. VOCABULARY DIVERSITY
-----------------------------------------------------------------------------
- Diversity Classification: ${analysis.diversityCategory} (${analysis.vocabularyDiversity}%)
- Meaningful Words Count:   ${analysis.meaningfulWordsCount}
- Unique Meaningful Terms:  ${analysis.uniqueMeaningfulWordsCount}
- Explanation:              ${analysis.diversityExplanation}

4. READABILITY HEURISTIC
-----------------------------------------------------------------------------
- Category: ${analysis.readabilityCategory} (Score: ${analysis.readabilityScore}/100)
${analysis.readabilityFactors.map(f => `  * ${f.factor}: ${f.impact}`).join('\n')}

5. REPETITION & STYLE SIGNALS
-----------------------------------------------------------------------------
- Heavily Repeated Words:
${analysis.repeatedWords.length ? analysis.repeatedWords.map(w => `  * "${w.word}" — ${w.count} times (${w.percentage}% of total)`).join('\n') : '  * None detected above threshold'}
- Filler Words Flagged: ${analysis.fillerWords.reduce((a, b) => a + b.count, 0)} occurrences
${analysis.fillerWords.map(f => `  * "${f.word}" (${f.count}x): ${f.suggestions.join(', ')}`).join('\n')}
- Vague Descriptors: ${analysis.vagueWords.reduce((a, b) => a + b.count, 0)} occurrences
${analysis.vagueWords.map(v => `  * "${v.word}" (${v.count}x): ${v.suggestion}`).join('\n')}

6. SENTENCE VARIETY & LONG SENTENCES
-----------------------------------------------------------------------------
- Long Sentences (> threshold): ${analysis.longSentences.length}
${analysis.longSentences.map(s => `  * Sentence #${s.index} (${s.wordCount} words): "${s.text}"`).join('\n')}
- Distribution: Short: ${analysis.sentenceVariety.short} (${analysis.sentenceVariety.shortPercent}%), Medium: ${analysis.sentenceVariety.medium} (${analysis.sentenceVariety.mediumPercent}%), Long: ${analysis.sentenceVariety.long} (${analysis.sentenceVariety.longPercent}%)
- Sentence Variety Score: ${analysis.sentenceVariety.varietyScore} / 100
- Assessment: ${analysis.sentenceVariety.description}

7. ESTIMATED TONE
-----------------------------------------------------------------------------
- Primary Tone: ${analysis.tone.primaryTone} (${analysis.tone.confidence}% heuristic confidence)
${analysis.tone.influencingSignals.map(s => `  * ${s}`).join('\n')}
`;

    if (comparison) {
      report += `
8. EDUCATIONAL PASSAGE COMPARISON & SIMILARITY
-----------------------------------------------------------------------------
- Educational Similarity Estimate: ${comparison.similarityPercentage}%
  (Meaningful vocabulary overlap; does NOT determine whether text was copied)
- Passage A Words: ${comparison.passageA.wordCount} | Passage B Words: ${comparison.passageB.wordCount}
- Meaningful Shared Words (${comparison.meaningfulSharedWords.length}):
  ${comparison.meaningfulSharedWords.join(', ')}
- Excluded Stop Words (${comparison.excludedStopWords.length}):
  ${comparison.excludedStopWords.slice(0, 15).join(', ')}...
- Primary Overlap Contributors:
${comparison.similarityContributors.map(c => `  + ${c}`).join('\n')}
- Distinct Elements:
${comparison.differentiators.map(d => `  - ${d}`).join('\n')}
`;
    }

    report += `
9. TOP ACTIONABLE RECOMMENDATIONS
-----------------------------------------------------------------------------
${analysis.topImprovements.map((imp, idx) => `${idx + 1}. [${imp.impact} IMPACT] ${imp.title}: ${imp.description}`).join('\n')}

=============================================================================
${disclaimerText}
=============================================================================
`;

    return report;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePlainTextReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const text = generatePlainTextReport();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compara_report_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const data = {
      analysis,
      comparison: comparison || null,
      disclaimer: disclaimerText,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compara_data_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-[#0b1329] border border-cyan-500/40 rounded-xl p-6 shadow-2xl shadow-cyan-950/70 text-slate-100 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-heading"
      >
        <div className="flex items-center justify-between pb-4 border-b border-cyan-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-cyan-400 font-mono">Dossier Generator</div>
              <h3 id="report-heading" className="text-lg font-bold text-white font-heading">Complete Analysis Report</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            aria-label="Close report"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-slate-800/70 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 text-xs font-mono font-medium hover:bg-cyan-900 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard' : 'Copy Report'}
            </button>
            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-medium hover:border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              Download TXT
            </button>
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-medium hover:border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              Download JSON
            </button>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-medium hover:border-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            Print Clean Report
          </button>
        </div>

        {/* Scrollable Report Content */}
        <div className="mt-4 flex-1 overflow-y-auto pr-2">
          <pre className="p-4 rounded-xl bg-[#050811] border border-cyan-950 text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap select-all">
            {generatePlainTextReport()}
          </pre>
        </div>

        {/* Disclaimer footer */}
        <div className="mt-4 p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200/90 shrink-0">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>{disclaimerText}</span>
        </div>
      </div>
    </div>
  );
};
