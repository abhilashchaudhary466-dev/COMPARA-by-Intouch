/**
 * Nexus Write — Streamlined, Colorful & Easy-to-Use Header
 * Welcoming design, vibrant color palette switcher, quick sample picker, and friendly navigation.
 */

import React, { useState } from 'react';
import { 
  AppMode, 
  WritingGoal 
} from '../../types/index.ts';
import { DEMO_DATASETS, DemoItem } from '../../engine/demoData.ts';
import { 
  Sparkles, 
  FileText, 
  Settings, 
  ChevronDown,
  ShieldCheck,
  Zap,
  Palette,
  Check
} from 'lucide-react';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onLoadDemo: (demo: DemoItem) => void;
  onOpenSettings: () => void;
  onOpenReport: () => void;
  selectedGoal: WritingGoal;
  onSelectGoal: (goal: WritingGoal) => void;
  colorTheme?: 'rainbow' | 'sunset' | 'cyber' | 'berry';
  onSelectColorTheme?: (theme: 'rainbow' | 'sunset' | 'cyber' | 'berry') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  onLoadDemo,
  onOpenSettings,
  onOpenReport,
  selectedGoal,
  onSelectGoal,
  colorTheme = 'rainbow',
  onSelectColorTheme
}) => {
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const navItems: { mode: AppMode; label: string; icon: string; color: string; activeGradient: string }[] = [
    { 
      mode: 'analyze', 
      label: 'Analyze', 
      icon: '✍️', 
      color: 'text-cyan-300', 
      activeGradient: 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/40 ring-2 ring-cyan-300' 
    },
    { 
      mode: 'compare', 
      label: 'Compare', 
      icon: '⚖️', 
      color: 'text-pink-300', 
      activeGradient: 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold shadow-lg shadow-pink-500/40 ring-2 ring-pink-300' 
    },
    { 
      mode: 'improve', 
      label: 'Improve', 
      icon: '✨', 
      color: 'text-emerald-300', 
      activeGradient: 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/40 ring-2 ring-emerald-300' 
    },
    { 
      mode: 'insights', 
      label: 'Insights', 
      icon: '💡', 
      color: 'text-amber-300', 
      activeGradient: 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold shadow-lg shadow-amber-500/40 ring-2 ring-amber-300' 
    },
    { 
      mode: 'research', 
      label: 'Research', 
      icon: '📚', 
      color: 'text-indigo-300', 
      activeGradient: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/40 ring-2 ring-indigo-300' 
    },
    { 
      mode: 'citations', 
      label: 'Citations', 
      icon: '🏷️', 
      color: 'text-rose-300', 
      activeGradient: 'bg-gradient-to-r from-rose-500 to-red-500 text-white font-bold shadow-lg shadow-rose-500/40 ring-2 ring-rose-300' 
    },
    { 
      mode: 'history', 
      label: 'History', 
      icon: '🕒', 
      color: 'text-teal-300', 
      activeGradient: 'bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-bold shadow-lg shadow-teal-500/40 ring-2 ring-teal-300' 
    },
    { 
      mode: 'how-it-works', 
      label: 'How It Works', 
      icon: '🔬', 
      color: 'text-orange-300', 
      activeGradient: 'bg-gradient-to-r from-orange-400 to-amber-500 text-slate-950 font-bold shadow-lg shadow-orange-500/40 ring-2 ring-orange-300' 
    },
  ];

  const goals: { id: WritingGoal; label: string; emoji: string }[] = [
    { id: 'essay', label: 'School Essay', emoji: '📝' },
    { id: 'academic', label: 'Academic Paper', emoji: '🎓' },
    { id: 'research', label: 'Research Article', emoji: '🔬' },
    { id: 'professional', label: 'Report / Work', emoji: '💼' },
    { id: 'creative', label: 'Story / Creative', emoji: '📖' },
    { id: 'email', label: 'Email', emoji: '📧' },
    { id: 'speech', label: 'Speech', emoji: '🎤' },
    { id: 'informal', label: 'Casual', emoji: '💬' },
  ];

  const colorPalettes: { id: 'rainbow' | 'sunset' | 'cyber' | 'berry'; name: string; icon: string; preview: string }[] = [
    { id: 'rainbow', name: 'Rainbow Neon', icon: '🌈', preview: 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400' },
    { id: 'sunset', name: 'Sunset Glow', icon: '🌅', preview: 'bg-gradient-to-r from-rose-500 via-amber-500 to-orange-400' },
    { id: 'cyber', name: 'Cyber Aqua', icon: '🌊', preview: 'bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400' },
    { id: 'berry', name: 'Berry Violet', icon: '🍇', preview: 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-400' }
  ];

  return (
    <header className="relative z-20 border-b border-purple-500/30 bg-[#0d0924]/90 backdrop-blur-md">
      {/* Top Rainbow Accent Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-pink-500 via-purple-500 via-cyan-400 via-emerald-400 to-amber-400 shadow-sm shadow-purple-500/50" />

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-500/40">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 via-cyan-300 to-amber-300">
                  COMPARA
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border border-pink-400/40 shadow-sm shadow-pink-500/20">
                  ✨ Writing & Comparison
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Explainable writing analysis, side-by-side comparison & student coach
              </p>
            </div>
          </div>

          {/* Quick Helper Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            
            {/* Writing Goal Selector */}
            <div className="flex items-center gap-1.5 bg-[#171038] border border-purple-500/40 rounded-xl px-3 py-1.5 text-xs shadow-sm shadow-purple-950/40">
              <span className="text-purple-300 font-medium text-xs">Goal:</span>
              <select
                value={selectedGoal}
                onChange={e => onSelectGoal(e.target.value as WritingGoal)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer pr-1"
                aria-label="Select writing goal"
              >
                {goals.map(g => (
                  <option key={g.id} value={g.id} className="bg-[#171038] text-white">
                    {g.emoji} {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Sample Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 text-cyan-200 text-xs font-bold hover:bg-cyan-500/30 transition-all shadow-sm shadow-cyan-500/20"
                aria-expanded={demoMenuOpen}
              >
                <Zap className="w-3.5 h-3.5 text-cyan-300" />
                <span>Try a Sample</span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-cyan-300" />
              </button>

              {demoMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#140e36] border border-cyan-400/50 shadow-2xl shadow-cyan-950/90 p-2 z-50 text-xs"
                  onMouseLeave={() => setDemoMenuOpen(false)}
                >
                  <div className="px-2.5 py-1 text-[11px] font-bold text-cyan-300 border-b border-purple-800/40">
                    Click any sample to test:
                  </div>
                  <div className="space-y-1 mt-1">
                    {DEMO_DATASETS.map(demo => (
                      <button
                        key={demo.id}
                        type="button"
                        onClick={() => {
                          onLoadDemo(demo);
                          setDemoMenuOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-cyan-950/70 border border-transparent hover:border-cyan-500/30 transition-colors group flex flex-col gap-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-100 group-hover:text-cyan-300">{demo.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-900/60 border border-cyan-600/50 text-cyan-200">
                            {demo.badge}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-300 line-clamp-1">{demo.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Color Palette Switcher */}
            {onSelectColorTheme && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/50 text-pink-200 text-xs font-bold hover:bg-pink-500/30 transition-all shadow-sm shadow-pink-500/20"
                  title="Switch Color Theme"
                >
                  <Palette className="w-3.5 h-3.5 text-pink-300" />
                  <span className="hidden sm:inline">Theme</span>
                </button>

                {themeMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#140e36] border border-pink-400/50 shadow-2xl shadow-pink-950/90 p-2 z-50 text-xs"
                    onMouseLeave={() => setThemeMenuOpen(false)}
                  >
                    <div className="px-2 py-1 text-[11px] font-bold text-pink-300 border-b border-purple-800/40">
                      Pick Color Theme:
                    </div>
                    <div className="space-y-1 mt-1">
                      {colorPalettes.map(pal => (
                        <button
                          key={pal.id}
                          type="button"
                          onClick={() => {
                            onSelectColorTheme(pal.id);
                            setThemeMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                            colorTheme === pal.id 
                              ? 'bg-pink-500/20 border border-pink-400/60 text-white font-bold' 
                              : 'text-slate-300 hover:bg-purple-900/40'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{pal.icon}</span>
                            <span>{pal.name}</span>
                          </div>
                          <div className={`w-4 h-4 rounded-full ${pal.preview} shadow-sm`} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Summary Report Button */}
            <button
              type="button"
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171038] border border-purple-500/40 text-purple-200 hover:text-white hover:border-purple-400 text-xs font-bold transition-all shadow-sm shadow-purple-950/40"
            >
              <FileText className="w-3.5 h-3.5 text-purple-300" />
              <span>Report</span>
            </button>

            {/* Settings Button */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-[#171038] border border-purple-500/40 text-purple-200 hover:text-white hover:border-purple-400 transition-all shadow-sm shadow-purple-950/40"
              aria-label="Settings"
              title="Settings & Stop Words"
            >
              <Settings className="w-4 h-4 text-purple-300" />
            </button>
          </div>
        </div>

        {/* Friendly, Vibrant Colorful Navigation Tabs */}
        <nav className="mt-3.5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" aria-label="Main Navigation">
          {navItems.map(item => {
            const isActive = currentMode === item.mode;

            return (
              <button
                key={item.mode}
                type="button"
                onClick={() => onSelectMode(item.mode)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? item.activeGradient
                    : 'text-slate-300 bg-[#161036]/80 border border-purple-500/20 hover:border-purple-400/60 hover:text-white hover:bg-purple-950/50'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span className="font-semibold">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Cheerful & Friendly Student Safety Note */}
      <div className="bg-[#080517] border-t border-purple-900/30 px-4 py-1.5 text-center text-xs text-purple-200/80 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>
          🎓 Educational writing coach with transparent, explainable feedback. Designed to build better writing skills!
        </span>
      </div>
    </header>
  );
};
