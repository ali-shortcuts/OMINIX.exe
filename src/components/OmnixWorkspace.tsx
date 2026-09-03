import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Settings, 
  Layers, 
  Paperclip, 
  FileText, 
  CornerDownLeft, 
  Play, 
  X, 
  Check, 
  RefreshCw,
  TableProperties,
  Presentation,
  CheckCircle2,
  Trash2,
  Zap,
  Heart,
  SlidersHorizontal,
  Shield,
  Activity,
  ChevronDown
} from 'lucide-react';
import { 
  OfficeAppType, 
  Realm, 
  ChatMessage, 
  ProviderSettings, 
  SimulatedDocument, 
  AgentExecutionMode, 
  ContextExtractionMode, 
  PendingToolOperation 
} from '../types';

interface OmnixWorkspaceProps {
  isOpen: boolean;
  currentApp: OfficeAppType;
  activeRealm: Realm;
  messages: ChatMessage[];
  isLoading: boolean;
  settings: ProviderSettings;
  onUpdateSettings: (newSettings: ProviderSettings) => void;
  onSendMessage: (text: string) => void;
  onOpenRealms: () => void;
  onOpenSettings: () => void;
  onOpenCreator: () => void;
  onOpenDiagnostics: () => void;
  onOpenAuditTrail: () => void;
  onClose: () => void;
  selectedText: string;
  simulatedDoc: SimulatedDocument;
  onExecuteToolAction: (action: any) => void;
  onClearHistory: () => void;
}

export const OmnixWorkspace: React.FC<OmnixWorkspaceProps> = ({
  isOpen,
  currentApp,
  activeRealm,
  messages,
  isLoading,
  settings,
  onUpdateSettings,
  onSendMessage,
  onOpenRealms,
  onOpenSettings,
  onOpenCreator,
  onOpenDiagnostics,
  onOpenAuditTrail,
  onClose,
  selectedText,
  simulatedDoc,
  onExecuteToolAction,
  onClearHistory,
}) => {
  const [inputText, setInputText] = useState('');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showContextDropdown, setShowContextDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const appTitleMap: Record<OfficeAppType, { label: string; icon: any; color: string }> = {
    word: { label: 'Word Document', icon: <FileText className="w-3.5 h-3.5 text-blue-400" />, color: 'text-blue-400' },
    excel: { label: 'Excel Workbook', icon: <TableProperties className="w-3.5 h-3.5 text-emerald-400" />, color: 'text-emerald-400' },
    powerpoint: { label: 'PowerPoint Deck', icon: <Presentation className="w-3.5 h-3.5 text-amber-400" />, color: 'text-amber-400' },
  };

  const agentModeLabels: Record<AgentExecutionMode, { label: string; desc: string; color: string }> = {
    'chat': { label: 'Chat Mode', desc: 'Standard conversation', color: 'bg-slate-800 text-slate-300' },
    'assisted': { label: 'Assisted Mode', desc: 'Context-aware suggestions', color: 'bg-blue-900/60 text-blue-300 border-blue-500/30' },
    'agent': { label: 'Agent Mode', desc: 'Full automated tool execution', color: 'bg-indigo-900/60 text-indigo-300 border-indigo-500/30' },
    'safe-agent': { label: 'Safe Agent', desc: 'Read & format tools only', color: 'bg-emerald-900/60 text-emerald-300 border-emerald-500/30' },
    'expert-workflow': { label: 'Expert Workflow', desc: 'Multi-step planned routines', color: 'bg-purple-900/60 text-purple-300 border-purple-500/30' },
  };

  const contextModeLabels: Record<ContextExtractionMode, string> = {
    'selection': 'Selection Only',
    'current-object': currentApp === 'excel' ? 'Active Sheet' : currentApp === 'powerpoint' ? 'Active Slide' : 'Active Paragraph',
    'current-document': currentApp === 'excel' ? 'Full Workbook' : currentApp === 'powerpoint' ? 'Full Presentation' : 'Full Document',
    'current-application': 'Host Metadata',
    'custom': 'Custom Context',
  };

  return (
    <aside 
      className="w-96 md:w-[420px] flex-shrink-0 bg-slate-900 border-l border-slate-800 flex flex-col h-full z-20 shadow-2xl text-left"
      aria-label="OMINIX Workspace"
    >
      {/* 1. Taskpane Header */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-xs tracking-wide">OMINIX</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-950 border border-indigo-500/30 text-indigo-300 font-medium">
                v1.0.0
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              {appTitleMap[currentApp].icon}
              <span>{appTitleMap[currentApp].label}</span>
            </div>
          </div>
        </div>

        {/* Header Navigation Icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenRealms}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            title="Switch Persona / Realm"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenAuditTrail}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            title="Audit Trail & Security Logs"
          >
            <Shield className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenDiagnostics}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 rounded-lg transition"
            title="Run System Diagnostics"
          >
            <Activity className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            title="Providers & Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenCreator}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-pink-400 rounded-lg transition"
            title="Creator & Support (Powered by Mr Ali)"
          >
            <Heart className="w-4 h-4 text-pink-400 fill-pink-500/20" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
            title="Close Task Pane"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Mode & Context Configuration Bar */}
      <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs">
        {/* Agent Mode Selector */}
        <div className="relative">
          <button
            onClick={() => setShowModeDropdown(!showModeDropdown)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-semibold border transition ${
              agentModeLabels[settings.activeAgentMode].color
            }`}
          >
            <Zap className="w-3 h-3 text-indigo-400" />
            <span>{agentModeLabels[settings.activeAgentMode].label}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {showModeDropdown && (
            <div className="absolute left-0 top-full mt-1 w-52 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-30 py-1 text-xs">
              {(Object.keys(agentModeLabels) as AgentExecutionMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    onUpdateSettings({ ...settings, activeAgentMode: mode });
                    setShowModeDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 flex flex-col transition ${
                    settings.activeAgentMode === mode ? 'bg-indigo-950/50 text-indigo-300' : 'text-slate-300'
                  }`}
                >
                  <span className="font-semibold">{agentModeLabels[mode].label}</span>
                  <span className="text-[10px] text-slate-400">{agentModeLabels[mode].desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Context Selector */}
        <div className="relative">
          <button
            onClick={() => setShowContextDropdown(!showContextDropdown)}
            className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-medium bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700 transition"
          >
            <Paperclip className="w-3 h-3 text-slate-400" />
            <span>{contextModeLabels[settings.activeContextMode]}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {showContextDropdown && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-30 py-1 text-xs">
              {(Object.keys(contextModeLabels) as ContextExtractionMode[]).map((ctx) => (
                <button
                  key={ctx}
                  onClick={() => {
                    onUpdateSettings({ ...settings, activeContextMode: ctx });
                    setShowContextDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 transition ${
                    settings.activeContextMode === ctx ? 'bg-indigo-950/50 text-indigo-300 font-semibold' : 'text-slate-300'
                  }`}
                >
                  {contextModeLabels[ctx]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Persona / Active Realm Banner */}
      <div className="px-3 py-2 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-slate-400">Persona:</span>
          <button 
            onClick={onOpenRealms}
            className="font-semibold text-indigo-300 hover:underline"
          >
            {activeRealm.name}
          </button>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <span>Provider:</span>
          <span className="font-mono text-slate-200 uppercase bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
            {settings.smartAggregatorEnabled && settings.activeProvider === 'smart-aggregator' 
              ? 'Router' 
              : settings.activeProvider}
          </span>
        </div>
      </div>

      {/* 4. Chat & Tool Step Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950/70 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-xs">
              <h4 className="font-semibold text-slate-200 text-sm">OMINIX Office Intelligence</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Seamless local agent bridge for Word, Excel, and PowerPoint. Choose a prompt or type below.
              </p>
            </div>

            {/* Quick Realm Action Chips */}
            <div className="w-full space-y-1.5 pt-2">
              <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider text-left">
                Suggested Actions:
              </div>
              {activeRealm.quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => onSendMessage(action.promptTemplate)}
                  className="w-full text-left p-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition flex items-center justify-between group"
                >
                  <span className="truncate">{action.label}</span>
                  <CornerDownLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1 px-1">
                {msg.role === 'user' ? (
                  <>
                    <span>You</span>
                    <span>&bull;</span>
                    <span>{msg.timestamp}</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-indigo-400" />
                    <span>OMINIX</span>
                    {msg.providerUsed && (
                      <span className="text-[9px] bg-slate-800 px-1 rounded text-slate-400 font-mono">
                        {msg.providerUsed}
                      </span>
                    )}
                    <span>&bull;</span>
                    <span>{msg.timestamp}</span>
                  </>
                )}
              </div>

              <div
                className={`p-3 rounded-xl max-w-[90%] text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                {/* Agent Tool Progress Steps */}
                {msg.toolProgress && msg.toolProgress.length > 0 && (
                  <div className="mb-2.5 pb-2.5 border-b border-slate-800/80 space-y-1.5">
                    <div className="text-[10px] uppercase font-semibold text-indigo-400 font-mono flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>Agent Tool Execution:</span>
                    </div>
                    {msg.toolProgress.map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300 bg-slate-900/80 p-1.5 rounded">
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        ) : step.status === 'pending-approval' ? (
                          <Shield className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        ) : (
                          <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin flex-shrink-0" />
                        )}
                        <span className="truncate">{step.step}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                {/* Suggested Action Button (Insert to Word, Excel, or PowerPoint) */}
                {msg.suggestedAction && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => onExecuteToolAction(msg.suggestedAction)}
                      className="w-full py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{msg.suggestedAction.label}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            <span>OMINIX reasoning and extracting Office context...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 5. Selected Context Badge */}
      {selectedText && (
        <div className="px-3 py-1.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <Paperclip className="w-3 h-3 text-indigo-400 flex-shrink-0" />
            <span className="text-slate-400">Selection:</span>
            <span className="truncate text-slate-300 font-mono italic">"{selectedText.slice(0, 35)}..."</span>
          </div>
          <span className="text-[10px] text-indigo-300 font-medium whitespace-nowrap bg-indigo-950/80 px-1.5 rounded">
            Attached
          </span>
        </div>
      )}

      {/* 6. Input Form & Controls */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative">
            <textarea
              id="workspace-prompt-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={`Ask OMINIX or command changes in ${currentApp}...`}
              rows={2}
              className="w-full p-2.5 pr-9 bg-slate-900 border border-slate-700/80 focus:border-indigo-500 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none resize-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="absolute right-2 bottom-2.5 p-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white rounded-lg transition"
              title="Send to OMINIX"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onClearHistory}
                className="hover:text-rose-400 transition flex items-center gap-1"
                title="Clear conversation history"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear History</span>
              </button>
            </div>

            <span className="text-[10px] text-slate-500 font-mono">
              Press Enter to send &bull; Shift+Enter for newline
            </span>
          </div>
        </form>

        {/* 7. Compact Creator Attribution Bar */}
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <button
            id="workspace-creator-badge-btn"
            onClick={onOpenCreator}
            className="flex items-center gap-1.5 hover:text-pink-300 text-slate-400 transition"
            title="Creator & Support — Powered by Mr Ali"
          >
            <Heart className="w-3 h-3 text-pink-400 fill-pink-500/30" />
            <span>Powered by <strong className="text-slate-200 font-semibold">Mr Ali</strong></span>
          </button>

          <button
            onClick={onOpenCreator}
            className="text-indigo-400 hover:text-indigo-300 font-medium transition text-[10px]"
          >
            Official Channels &rarr;
          </button>
        </div>
      </div>
    </aside>
  );
};
