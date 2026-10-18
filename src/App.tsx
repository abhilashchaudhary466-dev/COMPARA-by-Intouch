/**
 * Nexus Write — Explainable Writing Intelligence
 * Master Application Component
 */

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { 
  AppMode, 
  WritingGoal, 
  SettingsState, 
  SourceCard, 
  VersionSnapshot,
  TextAnalysis,
  ComparisonAnalysis
} from './types/index.ts';
import { DEFAULT_STOP_WORDS } from './engine/stopWords.ts';
import { DEMO_DATASETS, DemoItem } from './engine/demoData.ts';
import { analyzePassage, comparePassages } from './engine/analyzer.ts';
import { HologramScene } from './components/scene/HologramScene.tsx';
import { Header } from './components/layout/Header.tsx';
import { AnalyzeMode } from './components/modes/AnalyzeMode.tsx';
import { CompareMode } from './components/modes/CompareMode.tsx';
import { ImproveMode } from './components/modes/ImproveMode.tsx';
import { InsightsMode } from './components/modes/InsightsMode.tsx';
import { ResearchMode } from './components/modes/ResearchMode.tsx';
import { CitationsMode } from './components/modes/CitationsMode.tsx';
import { HistoryMode } from './components/modes/HistoryMode.tsx';
import { HowItWorksMode } from './components/modes/HowItWorksMode.tsx';
import { FormulaModal, FormulaKey } from './components/common/FormulaModal.tsx';
import { SettingsModal } from './components/common/SettingsModal.tsx';
import { ReportModal } from './components/common/ReportModal.tsx';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

const STORAGE_KEY_SETTINGS = 'nexus_write_settings';
const STORAGE_KEY_VERSIONS = 'nexus_write_versions';
const STORAGE_KEY_SOURCES = 'nexus_write_sources';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('analyze');
  const [selectedGoal, setSelectedGoal] = useState<WritingGoal>('academic');

  // Text state initialized with DEMO 1 for an immediate impressive experience
  const [passageA, setPassageA] = useState<string>(DEMO_DATASETS[0].passageA);
  const [passageB, setPassageB] = useState<string>(DEMO_DATASETS[0].passageB || '');

  // HUD Zen / Cinema mode toggle
  const [hudVisible, setHudVisible] = useState<boolean>(true);

  // Modals state
  const [formulaModalKey, setFormulaModalKey] = useState<FormulaKey | null>(null);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [reportOpen, setReportOpen] = useState<boolean>(false);

  // Settings State with LocalStorage
  const [settings, setSettings] = useState<SettingsState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      theme: 'CINEMATIC',
      colorTheme: 'rainbow',
      performance: 'CINEMATIC',
      liveAnalysis: true,
      animations: true,
      reducedMotion: false,
      longSentenceThreshold: 20,
      customStopWords: [...DEFAULT_STOP_WORDS]
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Sources State with LocalStorage
  const [sources, setSources] = useState<SourceCard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SOURCES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'default-src-1',
        title: 'Open Science and Empirical Reproducibility',
        author: 'Merton, R. K. & Popper, K.',
        year: '2022',
        url: 'https://example.org/reproducibility-studies',
        notes: 'Pivotal reference for verification methodology and hypothesis confirmation.',
        keyPoints: [
          'Peer replication prevents unverified assumptions from persisting.',
          'Data transparency correlates with citation endurance.'
        ],
        sourceType: 'USER_PROVIDED_SOURCE',
        createdAt: Date.now() - 86400000
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SOURCES, JSON.stringify(sources));
    } catch {}
  }, [sources]);

  // Version Snapshots State with LocalStorage
  const [versions, setVersions] = useState<VersionSnapshot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VERSIONS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'snapshot-initial',
        name: 'Initial Research Draft',
        timestamp: Date.now() - 3600000,
        rawText: DEMO_DATASETS[0].passageA,
        qualityScore: 82,
        wordCount: 78,
        readabilityCategory: 'GOOD',
        goal: 'academic'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VERSIONS, JSON.stringify(versions));
    } catch {}
  }, [versions]);

  // Debounced text for analysis
  const [debouncedPassageA, setDebouncedPassageA] = useState(passageA);
  const [debouncedPassageB, setDebouncedPassageB] = useState(passageB);

  useEffect(() => {
    if (!settings.liveAnalysis) return;
    const timer = setTimeout(() => {
      setDebouncedPassageA(passageA);
      setDebouncedPassageB(passageB);
    }, 250);
    return () => clearTimeout(timer);
  }, [passageA, passageB, settings.liveAnalysis]);

  // Analyze Passage A
  const analysis: TextAnalysis = useMemo(() => {
    return analyzePassage(
      settings.liveAnalysis ? debouncedPassageA : passageA,
      settings.longSentenceThreshold,
      settings.customStopWords,
      selectedGoal
    );
  }, [debouncedPassageA, passageA, settings.longSentenceThreshold, settings.customStopWords, settings.liveAnalysis, selectedGoal]);

  // Compare Passage A and B
  const comparison: ComparisonAnalysis = useMemo(() => {
    return comparePassages(
      settings.liveAnalysis ? debouncedPassageA : passageA,
      settings.liveAnalysis ? debouncedPassageB : passageB,
      settings.longSentenceThreshold,
      settings.customStopWords
    );
  }, [debouncedPassageA, passageA, debouncedPassageB, passageB, settings.longSentenceThreshold, settings.customStopWords, settings.liveAnalysis]);

  // Actions
  const handleLoadDemo = (demo: DemoItem) => {
    setPassageA(demo.passageA);
    setPassageB(demo.passageB || '');
    setDebouncedPassageA(demo.passageA);
    setDebouncedPassageB(demo.passageB || '');
    setSelectedGoal(demo.idealGoal);
  };

  const handleSaveCurrentVersion = (customName?: string) => {
    const newVersion: VersionSnapshot = {
      id: `ver-${Date.now()}`,
      name: customName || `Revision Snapshot #${versions.length + 1}`,
      timestamp: Date.now(),
      rawText: passageA,
      passageBText: passageB,
      qualityScore: analysis.writingQuality.overall,
      wordCount: analysis.wordCount,
      readabilityCategory: analysis.readabilityCategory,
      goal: selectedGoal
    };
    setVersions([newVersion, ...versions]);
  };

  const handleRestoreVersion = (ver: VersionSnapshot) => {
    setPassageA(ver.rawText);
    setDebouncedPassageA(ver.rawText);
    if (ver.passageBText) {
      setPassageB(ver.passageBText);
      setDebouncedPassageB(ver.passageBText);
    }
    setSelectedGoal(ver.goal);
    setCurrentMode('analyze');
  };

  const handleDeleteVersion = (id: string) => {
    setVersions(versions.filter(v => v.id !== id));
  };

  const handleRenameVersion = (id: string, newName: string) => {
    setVersions(versions.map(v => v.id === id ? { ...v, name: newName } : v));
  };

  const handleAddSource = (newSource: SourceCard) => {
    setSources([newSource, ...sources]);
  };

  const handleDeleteSource = (id: string) => {
    setSources(sources.filter(s => s.id !== id));
  };

  const handleUpdateSentenceClaim = (
    sentenceIndex: number, 
    claimType: 'CLAIM' | 'EVIDENCE' | 'OPINION' | 'EXAMPLE' | undefined, 
    hasSource: boolean
  ) => {
    // Local override on sentence analysis state
    const sent = analysis.sentences.find(s => s.index === sentenceIndex);
    if (sent) {
      sent.claimType = claimType;
      sent.hasSource = hasSource;
    }
    // trigger state update
    setPassageA(prev => prev);
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all custom stop words, sources, and snapshot history?')) {
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
      localStorage.removeItem(STORAGE_KEY_VERSIONS);
      localStorage.removeItem(STORAGE_KEY_SOURCES);
      setVersions([]);
      setSources([]);
      setSettings({
        theme: 'CINEMATIC',
        performance: 'CINEMATIC',
        liveAnalysis: true,
        animations: true,
        reducedMotion: false,
        longSentenceThreshold: 20,
        customStopWords: [...DEFAULT_STOP_WORDS]
      });
      setSettingsOpen(false);
    }
  };

  const activeColorTheme = settings.colorTheme || 'rainbow';

  return (
    <div className={`relative min-h-screen bg-[#070514] theme-${activeColorTheme} text-slate-100 flex flex-col font-sans selection:bg-pink-500/30 selection:text-pink-200 transition-colors duration-500`}>
      {/* 1. Continuously Animated Three.js 3D Hologram Background */}
      <HologramScene
        qualityScore={analysis.writingQuality.overall}
        vocabDiversity={analysis.vocabularyDiversity}
        similarityPercentage={comparison.similarityPercentage}
        performanceMode={settings.performance}
        reducedMotion={settings.reducedMotion}
      />

      {/* 2. Top Holographic Header */}
      <Header
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        onLoadDemo={handleLoadDemo}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenReport={() => setReportOpen(true)}
        selectedGoal={selectedGoal}
        onSelectGoal={setSelectedGoal}
        colorTheme={activeColorTheme}
        onSelectColorTheme={(newTheme) => setSettings(prev => ({ ...prev, colorTheme: newTheme }))}
      />

      {/* 3. Main Workspace Area */}
      <main className={`relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-opacity duration-300 ${
        hudVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        {currentMode === 'analyze' && (
          <AnalyzeMode
            passageText={passageA}
            onChangeText={setPassageA}
            analysis={analysis}
            onOpenFormula={setFormulaModalKey}
            selectedGoal={selectedGoal}
            longSentenceThreshold={settings.longSentenceThreshold}
            onSwitchToImprove={() => setCurrentMode('improve')}
            onSwitchToCompare={() => setCurrentMode('compare')}
          />
        )}

        {currentMode === 'compare' && (
          <CompareMode
            textA={passageA}
            textB={passageB}
            onChangeTextA={setPassageA}
            onChangeTextB={setPassageB}
            comparison={comparison}
            onOpenFormula={setFormulaModalKey}
          />
        )}

        {currentMode === 'improve' && (
          <ImproveMode
            currentText={passageA}
            onApplyImprovement={setPassageA}
            longSentenceThreshold={settings.longSentenceThreshold}
          />
        )}

        {currentMode === 'insights' && (
          <InsightsMode
            analysis={analysis}
            selectedGoal={selectedGoal}
            onOpenFormula={setFormulaModalKey}
          />
        )}

        {currentMode === 'research' && (
          <ResearchMode
            sources={sources}
            onAddSource={handleAddSource}
            onDeleteSource={handleDeleteSource}
            sentences={analysis.sentences}
            onUpdateSentenceClaim={handleUpdateSentenceClaim}
          />
        )}

        {currentMode === 'citations' && (
          <CitationsMode
            passageText={passageA}
          />
        )}

        {currentMode === 'history' && (
          <HistoryMode
            versions={versions}
            onSaveCurrentVersion={handleSaveCurrentVersion}
            onRestoreVersion={handleRestoreVersion}
            onDeleteVersion={handleDeleteVersion}
            onRenameVersion={handleRenameVersion}
          />
        )}

        {currentMode === 'how-it-works' && (
          <HowItWorksMode />
        )}
      </main>

      {/* 4. Bottom Control Dock & Zen / Cinema Toggle (Zero Viewport Occlusion) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setHudVisible(!hudVisible)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0b1329]/90 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold shadow-lg shadow-cyan-950/60 backdrop-blur-md hover:bg-cyan-950/90 transition-all"
          title="Toggle HUD (Zen 3D Mode)"
        >
          {hudVisible ? <EyeOff className="w-3.5 h-3.5 text-cyan-400" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{hudVisible ? 'Cinema 3D Mode' : 'Show HUD'}</span>
        </button>

        {hudVisible && (
          <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#070c1a]/85 border border-slate-800 text-xs font-mono text-slate-400 backdrop-blur-md">
            <span>Score: <strong className="text-cyan-300">{analysis.writingQuality.overall}/100</strong></span>
            <span>•</span>
            <span>Vocab: <strong className="text-emerald-300">{analysis.vocabularyDiversity}%</strong></span>
            <span>•</span>
            <span>Readability: <strong className="text-purple-300">{analysis.readabilityCategory}</strong></span>
          </div>
        )}
      </div>

      {/* 5. Modals */}
      <FormulaModal
        formulaKey={formulaModalKey}
        onClose={() => setFormulaModalKey(null)}
      />

      <SettingsModal
        settings={settings}
        onUpdateSettings={setSettings}
        onClearAllData={handleClearAllData}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <ReportModal
        analysis={analysis}
        comparison={passageB ? comparison : null}
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
      />
    </div>
  );
}
