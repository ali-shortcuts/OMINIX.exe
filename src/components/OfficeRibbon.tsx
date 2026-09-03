import React from 'react';
import { 
  Sparkles, 
  Settings, 
  Play, 
  Layers, 
  FileText, 
  TableProperties, 
  Presentation, 
  Download, 
  CheckCircle, 
  HelpCircle, 
  ChevronDown, 
  Heart,
  MessageSquare,
  Shield,
  Activity,
  Maximize2,
  MousePointerClick,
  FileSearch
} from 'lucide-react';
import { OfficeAppType, Realm, ProviderType } from '../types';

interface OfficeRibbonProps {
  currentApp: OfficeAppType;
  onSelectApp: (app: OfficeAppType) => void;
  activeRealm: Realm;
  activeProvider: ProviderType;
  onOpenWorkspace: () => void;
  onOpenRealms: () => void;
  onOpenSettings: () => void;
  onOpenInstaller: () => void;
  onOpenCreator: () => void;
  onOpenDiagnostics: () => void;
  onOpenAuditTrail: () => void;
  onQuickAction: (prompt: string) => void;
  isInsideRealOffice: boolean;
}

export const OfficeRibbon: React.FC<OfficeRibbonProps> = ({
  currentApp,
  onSelectApp,
  activeRealm,
  activeProvider,
  onOpenWorkspace,
  onOpenRealms,
  onOpenSettings,
  onOpenInstaller,
  onOpenCreator,
  onOpenDiagnostics,
  onOpenAuditTrail,
  onQuickAction,
  isInsideRealOffice,
}) => {
  const [activeTab, setActiveTab] = React.useState<'ominix' | 'home' | 'insert' | 'view'>('ominix');

  const appIcons = {
    word: <FileText className="w-4 h-4 text-blue-400" />,
    excel: <TableProperties className="w-4 h-4 text-emerald-400" />,
    powerpoint: <Presentation className="w-4 h-4 text-amber-400" />,
  };

  const appNames = {
    word: 'Microsoft Word',
    excel: 'Microsoft Excel',
    powerpoint: 'Microsoft PowerPoint',
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 select-none text-left">
      {/* 1. Office Title Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-semibold">
            {appIcons[currentApp]}
            <span>{appNames[currentApp]}</span>
          </div>
          
          <span className="text-slate-500 font-mono">|</span>
          <span className="text-slate-300 font-medium">Document1 — OMINIX Active</span>

          {isInsideRealOffice ? (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              <CheckCircle className="w-3 h-3" />
              <span>Office.js Bridge Connected</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
              <span>Interactive Host Simulation</span>
            </span>
          )}
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* Creator Attribution */}
          <button
            id="header-creator-btn"
            onClick={onOpenCreator}
            className="flex items-center gap-1.5 bg-gradient-to-r from-purple-950/80 to-indigo-950/80 hover:from-purple-900 hover:to-indigo-900 border border-purple-500/40 text-purple-200 px-2.5 py-1 rounded text-xs transition shadow-sm"
            title="Creator & Support — Powered by Mr Ali"
          >
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-500/40" />
            <span className="font-semibold text-[11px]">Powered by Mr Ali</span>
          </button>

          {/* Installer Button */}
          <button
            id="header-installer-btn"
            onClick={onOpenInstaller}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded text-xs transition shadow-sm"
            title="Download OMINIX-Setup.exe & Office Add-in Manifests"
          >
            <Download className="w-3.5 h-3.5" />
            <span>OMINIX-Setup.exe</span>
          </button>

          {/* Host Switcher (Simulation Mode) */}
          <div className="flex items-center bg-slate-900 rounded p-0.5 border border-slate-800">
            <button
              onClick={() => onSelectApp('word')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                currentApp === 'word' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Word
            </button>
            <button
              onClick={() => onSelectApp('excel')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                currentApp === 'excel' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Excel
            </button>
            <button
              onClick={() => onSelectApp('powerpoint')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                currentApp === 'powerpoint' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              PowerPoint
            </button>
          </div>
        </div>
      </div>

      {/* 2. Ribbon Tabs Bar */}
      <div className="flex items-center px-2 bg-slate-900 border-b border-slate-800/80 text-xs">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-3 py-1.5 font-medium transition border-b-2 ${
            activeTab === 'home'
              ? 'border-blue-500 text-white bg-slate-800/50'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('insert')}
          className={`px-3 py-1.5 font-medium transition border-b-2 ${
            activeTab === 'insert'
              ? 'border-blue-500 text-white bg-slate-800/50'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Insert
        </button>
        <button
          onClick={() => setActiveTab('view')}
          className={`px-3 py-1.5 font-medium transition border-b-2 ${
            activeTab === 'view'
              ? 'border-blue-500 text-white bg-slate-800/50'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          View
        </button>
        <button
          id="ribbon-tab-ominix"
          onClick={() => setActiveTab('ominix')}
          className={`px-3 py-1.5 font-bold transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'ominix'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-950/40'
              : 'border-transparent text-indigo-300 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>OMINIX</span>
        </button>
      </div>

      {/* 3. Ribbon Command Surface */}
      <div className="p-2 flex items-center gap-3 overflow-x-auto">
        {activeTab === 'ominix' ? (
          <>
            {/* Command Group 1: Workspace */}
            <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
              <button
                id="ribbon-open-workspace-btn"
                onClick={onOpenWorkspace}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg font-semibold transition shadow-md text-xs"
              >
                <Maximize2 className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-bold">Open Workspace</div>
                  <div className="text-[10px] text-indigo-200 font-normal">Side Task Pane</div>
                </div>
              </button>

              <button
                id="ribbon-new-session-btn"
                onClick={() => {
                  onOpenWorkspace();
                  onQuickAction('Hello OMINIX, start a new session for this document.');
                }}
                className="flex flex-col items-center justify-center p-2 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition text-[11px]"
              >
                <MessageSquare className="w-4 h-4 mb-0.5 text-indigo-400" />
                <span>New Session</span>
              </button>
            </div>

            {/* Command Group 2: AI Commands */}
            <div className="flex items-center gap-1.5 border-r border-slate-800 pr-3">
              <button
                id="ribbon-ask-ominix-btn"
                onClick={() => {
                  onOpenWorkspace();
                  onQuickAction(`How can I optimize this ${currentApp} document?`);
                }}
                className="flex flex-col items-center justify-center px-2.5 py-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition text-[11px]"
              >
                <Sparkles className="w-4 h-4 mb-0.5 text-indigo-400" />
                <span>Ask OMINIX</span>
              </button>

              <button
                id="ribbon-analyze-selection-btn"
                onClick={() => {
                  onOpenWorkspace();
                  onQuickAction(`Analyze the currently selected content in this ${currentApp} document and suggest improvements.`);
                }}
                className="flex flex-col items-center justify-center px-2.5 py-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition text-[11px]"
              >
                <MousePointerClick className="w-4 h-4 mb-0.5 text-amber-400" />
                <span>Analyze Selection</span>
              </button>

              <button
                id="ribbon-run-agent-btn"
                onClick={() => {
                  onOpenWorkspace();
                  onQuickAction(`Run automated agent workflow to audit and polish this ${currentApp} document.`);
                }}
                className="flex flex-col items-center justify-center px-2.5 py-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition text-[11px]"
              >
                <Play className="w-4 h-4 mb-0.5 text-emerald-400" />
                <span>Run Agent</span>
              </button>
            </div>

            {/* Command Group 3: Context Controls */}
            <div className="flex items-center gap-1.5 border-r border-slate-800 pr-3">
              <button
                id="ribbon-use-selection-btn"
                onClick={() => {
                  onOpenWorkspace();
                  onQuickAction('Please focus strictly on my current selection.');
                }}
                className="flex flex-col items-center justify-center px-2.5 py-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition text-[11px]"
              >
                <FileSearch className="w-4 h-4 mb-0.5 text-cyan-400" />
                <span>Use Selection</span>
              </button>

              <button
                id="ribbon-use-document-btn"
                onClick={() => {
                  onOpenWorkspace();
                  onQuickAction('Extract context from the entire active document.');
                }}
                className="flex flex-col items-center justify-center px-2.5 py-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition text-[11px]"
              >
                <FileText className="w-4 h-4 mb-0.5 text-blue-400" />
                <span>Full Document</span>
              </button>

              <button
                id="ribbon-open-realms-btn"
                onClick={onOpenRealms}
                className="flex flex-col items-center justify-center px-2.5 py-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition text-[11px]"
              >
                <Layers className="w-4 h-4 mb-0.5 text-purple-400" />
                <span>Personas / Realms</span>
              </button>
            </div>

            {/* Command Group 4: Settings & Diagnostics */}
            <div className="flex items-center gap-1.5 border-r border-slate-800 pr-3">
              <button
                id="ribbon-diagnostics-btn"
                onClick={onOpenDiagnostics}
                className="flex flex-col items-center justify-center px-2.5 py-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition text-[11px]"
                title="Run system diagnostics"
              >
                <Activity className="w-4 h-4 mb-0.5 text-emerald-400" />
                <span>Diagnostics</span>
              </button>

              <button
                id="ribbon-audit-trail-btn"
                onClick={onOpenAuditTrail}
                className="flex flex-col items-center justify-center px-2.5 py-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition text-[11px]"
                title="View agent execution audit log"
              >
                <Shield className="w-4 h-4 mb-0.5 text-indigo-400" />
                <span>Audit Trail</span>
              </button>

              <button
                id="ribbon-settings-btn"
                onClick={onOpenSettings}
                className="flex flex-col items-center justify-center px-2.5 py-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition text-[11px]"
                title="Configure AI Providers, Models, and Permissions"
              >
                <Settings className="w-4 h-4 mb-0.5 text-slate-400" />
                <span>Providers & Settings</span>
              </button>
            </div>

            {/* Command Group 5: Creator Attribution */}
            <div className="flex items-center">
              <button
                id="ribbon-creator-card-btn"
                onClick={onOpenCreator}
                className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 hover:border-pink-500/50 border border-slate-700 text-white px-3 py-2 rounded-lg font-medium transition shadow-sm text-xs"
              >
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white">Creator & Support</div>
                  <div className="text-[10px] text-pink-400 font-medium">Powered by Mr Ali</div>
                </div>
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 py-2 text-slate-400 text-xs">
            <span>Standard Microsoft Office Ribbon surface ({activeTab.toUpperCase()}). Click</span>
            <button
              onClick={() => setActiveTab('ominix')}
              className="text-indigo-400 hover:underline font-semibold"
            >
              OMINIX
            </button>
            <span>to access AI commands, agent workflows, and models.</span>
          </div>
        )}
      </div>
    </header>
  );
};
