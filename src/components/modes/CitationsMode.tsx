/**
 * Nexus Write — Citations Mode
 * Citation Checker (missing elements & in-text consistency)
 * and Citation Generator for APA, MLA, Chicago, and IEEE formats.
 */

import React, { useState } from 'react';
import { 
  Quote, 
  Check, 
  AlertTriangle, 
  Copy, 
  Sparkles, 
  ShieldAlert, 
  BookMarked,
  FileSearch,
  ExternalLink
} from 'lucide-react';

interface CitationsModeProps {
  passageText: string;
}

export type CitationStyle = 'APA' | 'MLA' | 'CHICAGO' | 'IEEE';

export const CitationsMode: React.FC<CitationsModeProps> = ({ passageText }) => {
  // Generator Form State
  const [author, setAuthor] = useState('Vaswani, A., Shazeer, N., Parmar, N.');
  const [title, setTitle] = useState('Attention Is All You Need');
  const [year, setYear] = useState('2017');
  const [publisher, setPublisher] = useState('Advances in Neural Information Processing Systems');
  const [doi, setDoi] = useState('10.48550/arXiv.1706.03762');
  const [selectedStyle, setSelectedStyle] = useState<CitationStyle>('APA');
  const [copied, setCopied] = useState(false);

  // Checker State
  const [rawReference, setRawReference] = useState(
    'Smith, J. (2021). The Future of Artificial Intelligence. Journal of Science.'
  );

  // Generate citation based on style
  const generateFormattedCitation = (): string => {
    const a = author.trim() || 'Author';
    const t = title.trim() || 'Title of Work';
    const y = year.trim() || 'n.d.';
    const p = publisher.trim() || 'Publisher';
    const d = doi.trim();

    switch (selectedStyle) {
      case 'APA':
        return `${a} (${y}). ${t}. ${p}.${d ? ` https://doi.org/${d}` : ''}`;
      case 'MLA':
        return `${a}. "${t}." ${p}, ${y}.${d ? ` doi:${d}` : ''}`;
      case 'CHICAGO':
        return `${a}. ${y}. "${t}." ${p}.${d ? ` https://doi.org/${d}` : ''}`;
      case 'IEEE':
        return `${a}, "${t}," ${p}, ${y}.${d ? ` doi: ${d}` : ''}`;
      default:
        return '';
    }
  };

  // Basic diagnostic inspection of raw pasted reference
  const inspectReference = (ref: string) => {
    const issues: { item: string; missing: boolean; detail: string }[] = [];

    // Check year (4 digits e.g. 19xx or 20xx)
    const hasYear = /\b(19|20)\d{2}\b/.test(ref);
    issues.push({
      item: 'Publication Year',
      missing: !hasYear,
      detail: hasYear ? 'Detected 4-digit publication year.' : 'No recognizable 4-digit publication year (e.g. 2021).'
    });

    // Check author (looks for capitalized words followed by comma or initials)
    const hasAuthor = /^[A-Z][a-zA-Z]+,?\s+[A-Z]/.test(ref);
    issues.push({
      item: 'Author Attribution',
      missing: !hasAuthor,
      detail: hasAuthor ? 'Author name pattern detected.' : 'Could not confidently identify author name prefix.'
    });

    // Check title / quotes / period
    const hasTitle = ref.includes('.') && ref.length > 25;
    issues.push({
      item: 'Work Title',
      missing: !hasTitle,
      detail: hasTitle ? 'Plausible title clause found.' : 'Reference is unusually brief or missing title punctuation.'
    });

    // Check DOI or URL
    const hasDoiOrUrl = /(doi\.org|http:\/\/|https:\/\/|10\.\d{4,9}\/)/i.test(ref);
    issues.push({
      item: 'Digital Identifier (DOI / URL)',
      missing: !hasDoiOrUrl,
      detail: hasDoiOrUrl ? 'Digital identifier or URL present.' : 'Missing DOI or permanent web URL (recommended for digital papers).'
    });

    // In-text citation consistency: checks if author or year appears in current passage
    const yearMatch = ref.match(/\b(19|20)\d{2}\b/);
    const yearFoundInPassage = yearMatch ? passageText.includes(yearMatch[0]) : false;

    return {
      issues,
      yearFoundInPassage,
      yearMatch: yearMatch ? yearMatch[0] : null
    };
  };

  const checkResult = inspectReference(rawReference);

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(generateFormattedCitation());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="holo-card rounded-xl p-5 border border-cyan-500/40">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
            BIBLIOGRAPHIC INTEGRITY
          </span>
        </div>
        <h2 className="text-2xl font-extrabold font-heading text-white">
          Citation Checker & Formatter
        </h2>
        <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
          Format academic references in APA 7th, MLA 9th, Chicago 17th, and IEEE styles. 
          Audit pasted references for missing authors, dates, or digital object identifiers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CITATION GENERATOR */}
        <div className="holo-card rounded-xl p-5 border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
              CITATION GENERATOR
            </h3>
            
            {/* Style Selector */}
            <div className="flex gap-1 font-mono text-xs">
              {(['APA', 'MLA', 'CHICAGO', 'IEEE'] as CitationStyle[]).map(style => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    selectedStyle === style 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400' 
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Author(s)</label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full bg-[#050811] border border-slate-800 rounded p-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Title of Work</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-[#050811] border border-slate-800 rounded p-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Year</label>
                <input
                  type="text"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className="w-full bg-[#050811] border border-slate-800 rounded p-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">DOI / URL</label>
                <input
                  type="text"
                  value={doi}
                  onChange={e => setDoi(e.target.value)}
                  className="w-full bg-[#050811] border border-slate-800 rounded p-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Publisher or Journal Name</label>
              <input
                type="text"
                value={publisher}
                onChange={e => setPublisher(e.target.value)}
                className="w-full bg-[#050811] border border-slate-800 rounded p-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Formatted Output Box */}
          <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold uppercase">{selectedStyle} Formatted Output:</span>
              <button
                type="button"
                onClick={handleCopyCitation}
                className="flex items-center gap-1 text-slate-300 hover:text-cyan-300"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <textarea
              readOnly
              rows={3}
              value={generateFormattedCitation()}
              className="w-full p-3 rounded-lg bg-[#050811] border border-cyan-900/60 font-mono text-xs text-cyan-200 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* CITATION CHECKER */}
        <div className="holo-card rounded-xl p-5 border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
              REFERENCE ELEMENT AUDITOR
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Heuristic Validation</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <label className="block text-slate-400">Paste Full Reference Entry to Audit:</label>
            <textarea
              rows={3}
              value={rawReference}
              onChange={e => setRawReference(e.target.value)}
              className="w-full bg-[#050811] border border-slate-800 rounded p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
              placeholder="e.g., Turing, A. M. (1950). Computing Machinery and Intelligence. Mind, 59(236), 433-460."
            />
          </div>

          {/* Inspection Results Checklist */}
          <div className="space-y-2 pt-2 border-t border-slate-800 font-mono text-xs">
            <div className="text-slate-400 text-[11px] font-bold uppercase">Element Diagnostics:</div>
            {checkResult.issues.map((iss, i) => (
              <div 
                key={i} 
                className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${
                  iss.missing 
                    ? 'bg-amber-950/20 border-amber-900/50 text-amber-300' 
                    : 'bg-[#070d1e] border-slate-800 text-slate-300'
                }`}
              >
                {iss.missing ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">{iss.item}</div>
                  <div className="text-[11px] opacity-80">{iss.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* In-Text Consistency Check */}
          <div className="p-3 rounded-lg bg-[#070d1e] border border-slate-800 font-mono text-xs space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-bold">In-Text Citation Consistency:</div>
            {checkResult.yearMatch ? (
              <div className="text-slate-300 flex items-center gap-1.5">
                {checkResult.yearFoundInPassage ? (
                  <span className="text-emerald-400">✓ In-text year "{checkResult.yearMatch}" is cited inside your passage text.</span>
                ) : (
                  <span className="text-amber-300">⚠ Year "{checkResult.yearMatch}" was not found cited in your active passage text.</span>
                )}
              </div>
            ) : (
              <div className="text-slate-500">Provide a year in your reference to verify in-text consistency.</div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Citation checker provides heuristic structural guidance, not certified bibliographic validation.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
