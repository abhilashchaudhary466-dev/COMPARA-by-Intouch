/**
 * Nexus Write — Futuristic Settings Modal
 * Configurable performance modes, custom stop words editor, and analysis thresholds.
 */

import React, { useState } from 'react';
import { X, Sliders, Shield, Zap, Sparkles, Trash2, Plus, RefreshCw, Check } from 'lucide-react';
import { SettingsState } from '../../types/index.ts';
import { DEFAULT_STOP_WORDS } from '../../engine/stopWords.ts';

interface SettingsModalProps {
  settings: SettingsState;
  onUpdateSettings: (newSettings: SettingsState) => void;
  onClearAllData: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClearAllData,
  isOpen,
  onClose
}) => {
  const [newStopWord, setNewStopWord] = useState('');
  const [copiedNotice, setCopiedNotice] = useState(false);

  if (!isOpen) return null;

  const handleAddStopWord = (e: React.FormEvent) => {
    e.preventDefault();
    const word = newStopWord.trim().toLowerCase();
    if (word && !settings.customStopWords.includes(word)) {
      onUpdateSettings({
        ...settings,
        customStopWords: [...settings.customStopWords, word]
      });
      setNewStopWord('');
    }
  };

  const handleRemoveStopWord = (wordToRemove: string) => {
    onUpdateSettings({
      ...settings,
      customStopWords: settings.customStopWords.filter(w => w !== wordToRemove)
    });
  };

  const handleResetStopWords = () => {
    onUpdateSettings({
      ...settings,
      customStopWords: [...DEFAULT_STOP_WORDS]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0b1329] border border-cyan-500/40 rounded-xl p-6 shadow-2xl shadow-cyan-950/60 text-slate-100 max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-heading"
      >
        <div className="flex items-center justify-between pb-4 border-b border-cyan-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-cyan-400 font-mono">Control Center</div>
              <h3 id="settings-heading" className="text-lg font-bold text-white font-heading">Engine & HUD Settings</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Performance Mode */}
          <div>
            <label className="block text-xs font-semibold text-cyan-300 uppercase tracking-wider font-mono mb-2">
              Visual Rendering Profile
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['CINEMATIC', 'BALANCED', 'PERFORMANCE'] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, performance: mode })}
                  className={`p-3 rounded-lg border text-xs font-mono font-medium transition-all text-center ${
                    settings.performance === mode
                      ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200 shadow-md shadow-cyan-950/50'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold mb-0.5">{mode}</div>
                  <div className="text-[10px] text-slate-400">
                    {mode === 'CINEMATIC' ? 'Full 3D & particles' : mode === 'BALANCED' ? 'Standard rate' : 'Low GPU footprint'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Long Sentence Threshold Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="sentence-thresh-slider" className="text-xs font-semibold text-cyan-300 uppercase tracking-wider font-mono">
                Long Sentence Threshold
              </label>
              <span className="font-mono text-sm text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                {settings.longSentenceThreshold} words
              </span>
            </div>
            <input
              id="sentence-thresh-slider"
              type="range"
              min={12}
              max={35}
              value={settings.longSentenceThreshold}
              onChange={e => onUpdateSettings({ ...settings, longSentenceThreshold: Number(e.target.value) })}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer h-2"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
              <span>12 (Punchy / Speech)</span>
              <span>20 (Standard Essay)</span>
              <span>35 (Dense Academic)</span>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-slate-200">Live Analysis</div>
                <div className="text-[11px] text-slate-400">Real-time debounced updates</div>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, liveAnalysis: !settings.liveAnalysis })}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.liveAnalysis ? 'bg-cyan-600' : 'bg-slate-700'
                }`}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    settings.liveAnalysis ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-slate-200">Reduced Motion</div>
                <div className="text-[11px] text-slate-400">Smooth steady transitions</div>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ ...settings, reducedMotion: !settings.reducedMotion })}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.reducedMotion ? 'bg-cyan-600' : 'bg-slate-700'
                }`}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    settings.reducedMotion ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Stop Words Configuration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="text-xs font-semibold text-cyan-300 uppercase tracking-wider font-mono">
                  Stop Words Knowledge Base
                </label>
                <div className="text-[11px] text-slate-400">
                  {settings.customStopWords.length} words excluded from vocabulary diversity and similarity scoring
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetStopWords}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 rounded border border-cyan-800/40 hover:bg-cyan-900/50"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Defaults
              </button>
            </div>

            <form onSubmit={handleAddStopWord} className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Add custom stop word (e.g., however, furthermore)..."
                value={newStopWord}
                onChange={e => setNewStopWord(e.target.value)}
                className="flex-1 bg-[#050811] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-600/50 text-cyan-300 text-xs font-mono font-medium flex items-center gap-1 hover:bg-cyan-900"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </form>

            <div className="max-h-36 overflow-y-auto p-2 rounded-lg bg-[#050811] border border-slate-800 flex flex-wrap gap-1.5">
              {settings.customStopWords.map(word => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300"
                >
                  {word}
                  <button
                    type="button"
                    onClick={() => handleRemoveStopWord(word)}
                    className="text-slate-500 hover:text-red-400 ml-0.5"
                    aria-label={`Remove stop word ${word}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Privacy & Clear Data */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>100% Client-Side Local Execution & Storage</span>
            </div>
            <button
              type="button"
              onClick={onClearAllData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/40 bg-red-950/20 text-red-300 hover:bg-red-900/30 text-xs font-mono font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All Data
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 border border-cyan-700/60 rounded-lg hover:bg-cyan-900 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
