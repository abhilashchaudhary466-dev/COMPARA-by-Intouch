/**
 * Nexus Write — Research Mode
 * Educational research workspace: Source Cards management, key-point notes,
 * and Sentence Claim Annotator (Claim vs Evidence vs Opinion vs Example).
 * Detects claims without attached sources to foster academic rigor.
 */

import React, { useState } from 'react';
import { 
  SourceCard, 
  SentenceAnalysis 
} from '../../types/index.ts';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Tag, 
  AlertCircle, 
  CheckCircle, 
  Link as LinkIcon, 
  FileText, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface ResearchModeProps {
  sources: SourceCard[];
  onAddSource: (source: SourceCard) => void;
  onDeleteSource: (id: string) => void;
  sentences: SentenceAnalysis[];
  onUpdateSentenceClaim: (sentenceIndex: number, claimType: 'CLAIM' | 'EVIDENCE' | 'OPINION' | 'EXAMPLE', hasSource: boolean) => void;
}

export const ResearchMode: React.FC<ResearchModeProps> = ({
  sources,
  onAddSource,
  onDeleteSource,
  sentences,
  onUpdateSentenceClaim
}) => {
  // New source form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [keyPointsInput, setKeyPointsInput] = useState('');
  const [sourceType, setSourceType] = useState<'USER_PROVIDED_SOURCE' | 'WEB_SOURCE' | 'GENERATED_NOTE'>('USER_PROVIDED_SOURCE');

  const handleCreateSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const newSource: SourceCard = {
      id: `source-${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      year: year.trim() || new Date().getFullYear().toString(),
      url: url.trim() || undefined,
      notes: notes.trim(),
      keyPoints: keyPointsInput
        .split('\n')
        .map(kp => kp.trim())
        .filter(kp => kp.length > 0),
      sourceType,
      createdAt: Date.now()
    };

    onAddSource(newSource);
    setTitle('');
    setAuthor('');
    setYear('');
    setUrl('');
    setNotes('');
    setKeyPointsInput('');
  };

  // Find sentences marked as CLAIM without attached sources
  const unsupportedClaims = sentences.filter(s => s.claimType === 'CLAIM' && !s.hasSource);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="holo-card rounded-xl p-5 border border-cyan-500/40">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
            SCHOLARLY WORKSPACE
          </span>
        </div>
        <h2 className="text-2xl font-extrabold font-heading text-white">
          Research Organization & Claim Alignment
        </h2>
        <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
          Catalog evidence sources, map key concepts, and categorize sentences into Claims, Evidence, Opinions, 
          and Examples to ensure all substantive claims are backed by citations.
        </p>
      </div>

      {/* Grid: Add Source Form (4 Cols) & Source Cards List (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Source Addition Form */}
        <div className="lg:col-span-5 holo-card rounded-xl p-5 border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
              ADD RESEARCH SOURCE
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Manual Entry</span>
          </div>

          <form onSubmit={handleCreateSource} className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Source Title *</label>
              <input
                type="text"
                required
                placeholder="e.g., Attention Is All You Need"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-[#050811] border border-slate-800 rounded-lg p-2 text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Author(s) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Vaswani et al."
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  className="w-full bg-[#050811] border border-slate-800 rounded-lg p-2 text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Year</label>
                <input
                  type="text"
                  placeholder="e.g., 2017"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className="w-full bg-[#050811] border border-slate-800 rounded-lg p-2 text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Source Classification</label>
              <select
                value={sourceType}
                onChange={e => setSourceType(e.target.value as any)}
                className="w-full bg-[#050811] border border-slate-800 rounded-lg p-2 text-slate-100 focus:border-cyan-500 focus:outline-none cursor-pointer"
              >
                <option value="USER_PROVIDED_SOURCE">USER-PROVIDED SOURCE</option>
                <option value="WEB_SOURCE">WEB SOURCE</option>
                <option value="GENERATED_NOTE">GENERATED NOTE</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">URL or DOI (optional)</label>
              <input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full bg-[#050811] border border-slate-800 rounded-lg p-2 text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Key Points (1 per line)</label>
              <textarea
                rows={2}
                placeholder="Introduces self-attention mechanism&#10;Eliminates recurrent connections"
                value={keyPointsInput}
                onChange={e => setKeyPointsInput(e.target.value)}
                className="w-full bg-[#050811] border border-slate-800 rounded-lg p-2 text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Research Notes</label>
              <textarea
                rows={2}
                placeholder="Relevant for Section 2 background literature review..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-[#050811] border border-slate-800 rounded-lg p-2 text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-mono font-bold hover:bg-cyan-900 transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Source Card
            </button>
          </form>
        </div>

        {/* Source Cards List */}
        <div className="lg:col-span-7 holo-card rounded-xl p-5 border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
              CATALOGED SOURCES ({sources.length})
            </h3>
            <span className="text-[11px] font-mono text-slate-500">Active Bibliography</span>
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {sources.length > 0 ? (
              sources.map(src => (
                <div key={src.id} className="p-4 rounded-xl bg-[#070d1e] border border-slate-800 space-y-2 font-mono text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{src.title}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                          {src.sourceType}
                        </span>
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        {src.author} ({src.year})
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteSource(src.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                      title="Delete source"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>{src.url}</span>
                    </a>
                  )}

                  {src.keyPoints.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Key Evidence Points:</div>
                      <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
                        {src.keyPoints.map((kp, i) => (
                          <li key={i}>{kp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {src.notes && (
                    <div className="text-slate-400 text-[11px] bg-[#050811] p-2 rounded border border-slate-800">
                      {src.notes}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-slate-800 text-center text-slate-500 text-xs font-mono">
                No sources added yet. Use the form on the left to catalog books, papers, or articles.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sentence Claim Annotator & Unsupported Claims Detector */}
      <div className="holo-card rounded-xl p-5 border border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400">Claim Alignment</span>
            <h3 className="text-sm font-bold text-white font-heading">Sentence Rhetorical Function</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {unsupportedClaims.length} Claims Without Attached Sources
          </span>
        </div>

        {/* Warning if unsupported claims exist */}
        {unsupportedClaims.length > 0 && (
          <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200 font-mono">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">ATTENTION: </span>
              {unsupportedClaims.length} substantive claim{unsupportedClaims.length > 1 ? 's are' : ' is'} marked without an attached citation. 
              In academic writing, assertions should be backed by documented empirical or literature sources.
            </div>
          </div>
        )}

        {/* Sentences List with Tag Selectors */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {sentences.map(sent => (
            <div key={sent.index} className="p-3 rounded-lg bg-[#070d1e] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-cyan-400 font-bold">#{sent.index}</span>
                  <span className="text-[11px] text-slate-500">{sent.wordCount} words</span>
                </div>
                <div className="text-slate-200 font-sans text-sm">{sent.text}</div>
              </div>

              {/* Tag Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={sent.claimType || 'NONE'}
                  onChange={e => {
                    const val = e.target.value === 'NONE' ? undefined : (e.target.value as any);
                    onUpdateSentenceClaim(sent.index, val, sent.hasSource || false);
                  }}
                  className="bg-[#050811] border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:border-cyan-500"
                >
                  <option value="NONE">Unclassified</option>
                  <option value="CLAIM">CLAIM</option>
                  <option value="EVIDENCE">EVIDENCE</option>
                  <option value="OPINION">OPINION</option>
                  <option value="EXAMPLE">EXAMPLE</option>
                </select>

                {sent.claimType === 'CLAIM' && (
                  <button
                    type="button"
                    onClick={() => onUpdateSentenceClaim(sent.index, sent.claimType!, !sent.hasSource)}
                    className={`px-2 py-1 rounded text-[11px] font-bold border transition-colors ${
                      sent.hasSource
                        ? 'bg-emerald-950 border-emerald-600/60 text-emerald-300'
                        : 'bg-red-950 border-red-600/60 text-red-300'
                    }`}
                  >
                    {sent.hasSource ? '✓ Source Attached' : '⚠ Missing Source'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-lg bg-[#050811] border border-slate-800 text-[11px] text-slate-400 font-mono flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>This is an educational organizational feature to foster academic diligence, not an automated fact-checking engine.</span>
        </div>
      </div>
    </div>
  );
};
