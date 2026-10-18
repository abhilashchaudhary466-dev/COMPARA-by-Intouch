/**
 * Nexus Write — Version History Mode
 * Writing timeline snapshots, score progression, version comparison, and restoration.
 */

import React, { useState } from 'react';
import { 
  VersionSnapshot, 
  WritingGoal 
} from '../../types/index.ts';
import { 
  History, 
  Plus, 
  Trash2, 
  RotateCcw, 
  ArrowRight, 
  TrendingUp, 
  Edit2, 
  Check, 
  GitCompare 
} from 'lucide-react';

interface HistoryModeProps {
  versions: VersionSnapshot[];
  onSaveCurrentVersion: (customName?: string) => void;
  onRestoreVersion: (version: VersionSnapshot) => void;
  onDeleteVersion: (id: string) => void;
  onRenameVersion: (id: string, newName: string) => void;
}

export const HistoryMode: React.FC<HistoryModeProps> = ({
  versions,
  onSaveCurrentVersion,
  onRestoreVersion,
  onDeleteVersion,
  onRenameVersion
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [comparedPair, setComparedPair] = useState<[VersionSnapshot | null, VersionSnapshot | null]>([null, null]);

  const handleStartRename = (v: VersionSnapshot) => {
    setEditingId(v.id);
    setEditName(v.name);
  };

  const handleSaveRename = (id: string) => {
    if (editName.trim()) {
      onRenameVersion(id, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="holo-card rounded-xl p-5 border border-cyan-500/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                VERSION TIMELINE
              </span>
            </div>
            <h2 className="text-2xl font-extrabold font-heading text-white">
              Writing Evolution Snapshots
            </h2>
            <p className="text-xs text-slate-300">
              Preserve revision checkpoints, observe score trajectories, and compare historical iterations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSaveCurrentVersion()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-950 border border-cyan-500/60 text-cyan-300 font-mono font-bold text-xs uppercase tracking-wider hover:bg-cyan-900 transition-colors shadow-lg shadow-cyan-950/50"
          >
            <Plus className="w-4 h-4" />
            Snapshot Current State
          </button>
        </div>
      </div>

      {/* Timeline Progression Line */}
      {versions.length > 1 && (
        <div className="holo-card rounded-xl p-5 border border-cyan-500/30 space-y-3 font-mono">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-cyan-300">
            <TrendingUp className="w-4 h-4" />
            <span>Score Evolution Trajectory</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {versions.map((ver, idx) => (
              <React.Fragment key={ver.id}>
                <div className="p-2.5 rounded-lg bg-[#070d1e] border border-cyan-900/60 min-w-[130px] shrink-0 text-center">
                  <div className="text-[10px] text-slate-400 truncate">{ver.name}</div>
                  <div className="text-xl font-extrabold text-cyan-300">{ver.qualityScore} <span className="text-[10px] font-normal text-slate-500">/100</span></div>
                  <div className="text-[10px] text-slate-500">{ver.wordCount} words</div>
                </div>
                {idx < versions.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-cyan-500/60 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Snapshot Cards List */}
      <div className="space-y-3">
        {versions.length > 0 ? (
          versions.map((v, i) => (
            <div 
              key={v.id} 
              className="holo-card rounded-xl p-4 border border-slate-800 hover:border-cyan-500/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 flex items-center justify-center font-bold text-xs">
                    V{versions.length - i}
                  </span>

                  {editingId === v.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="bg-[#050811] border border-cyan-500 rounded px-2 py-0.5 text-xs text-white"
                      />
                      <button 
                        onClick={() => handleSaveRename(v.id)}
                        className="text-emerald-400 hover:text-emerald-300 p-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{v.name}</span>
                      <button 
                        onClick={() => handleStartRename(v)}
                        className="text-slate-500 hover:text-slate-300"
                        title="Rename version"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <span className="text-[10px] text-slate-500">
                    {new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="text-slate-400 text-xs line-clamp-2 font-sans pl-9">
                  "{v.rawText}"
                </div>
              </div>

              {/* Version Telemetry & Actions */}
              <div className="flex items-center gap-4 shrink-0 pl-9 md:pl-0">
                <div className="text-right">
                  <div className="text-cyan-300 font-extrabold text-sm">{v.qualityScore} / 100</div>
                  <div className="text-[10px] text-slate-500">{v.wordCount} words • {v.readabilityCategory}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onRestoreVersion(v)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-700/50 text-cyan-300 hover:bg-cyan-900 transition-colors"
                    title="Load this version into the editor"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore</span>
                  </button>

                  <button
                    onClick={() => onDeleteVersion(v.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    title="Delete snapshot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 rounded-xl holo-card border border-dashed border-slate-800 text-center font-mono text-xs text-slate-500">
            No snapshots captured yet. Click "Snapshot Current State" to benchmark your revisions.
          </div>
        )}
      </div>
    </div>
  );
};
