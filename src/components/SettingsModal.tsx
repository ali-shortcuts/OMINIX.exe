import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Sparkles, 
  Layers, 
  Cpu, 
  Zap, 
  Server, 
  Check, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Key, 
  ExternalLink,
  Shield,
  Heart,
  Sliders
} from 'lucide-react';
import { ProviderSettings, ProviderType } from '../types';
import { CreatorSupportSection } from './CreatorSupportSection';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ProviderSettings;
  onSave: (newSettings: ProviderSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [localSettings, setLocalSettings] = useState<ProviderSettings>(settings);
  const [activeTab, setActiveTab] = useState<'router' | 'gemini' | 'openrouter' | 'groq' | 'custom' | 'permissions' | 'creator'>('router');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-left"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">
                OMINIX AI Gateway & Provider Hub
              </h3>
              <p className="text-xs text-slate-400">
                Configure local fallback routing, API keys, execution policies, and support channels
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-4 bg-slate-950 border-b border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('router')}
            className={`py-3 px-3.5 border-b-2 font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'router'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Smart Router</span>
          </button>

          <button
            onClick={() => setActiveTab('gemini')}
            className={`py-3 px-3.5 border-b-2 font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'gemini'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Google Gemini</span>
          </button>

          <button
            onClick={() => setActiveTab('openrouter')}
            className={`py-3 px-3.5 border-b-2 font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'openrouter'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>OpenRouter</span>
          </button>

          <button
            onClick={() => setActiveTab('groq')}
            className={`py-3 px-3.5 border-b-2 font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'groq'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-rose-400" />
            <span>Groq</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`py-3 px-3.5 border-b-2 font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'custom'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>9Router / Local (Ollama)</span>
          </button>

          <button
            onClick={() => setActiveTab('permissions')}
            className={`py-3 px-3.5 border-b-2 font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'permissions'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Permissions</span>
          </button>

          <button
            onClick={() => setActiveTab('creator')}
            className={`py-3 px-3.5 border-b-2 font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'creator'
                ? 'border-pink-500 text-pink-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-500/30" />
            <span>Creator & Support</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* ===================== TAB 1: SMART ROUTER ===================== */}
          {activeTab === 'router' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white text-sm">Smart Multi-Provider Routing</h4>
                    <p className="text-xs text-slate-400">
                      Automatically route to backup providers if rate-limits or quota exhausted
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.smartAggregatorEnabled}
                      onChange={(e) => setLocalSettings({ ...localSettings, smartAggregatorEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <div className="text-xs font-semibold text-slate-300 mb-2">Default Active Provider:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'smart-aggregator', label: 'Smart Router', desc: 'Auto Fallback' },
                      { id: 'gemini', label: 'Google Gemini', desc: 'gemini-2.5-flash' },
                      { id: 'openrouter', label: 'OpenRouter', desc: 'Multi-model hub' },
                      { id: 'groq', label: 'Groq Cloud', desc: 'Low-latency' },
                      { id: 'custom', label: 'Local / Ollama', desc: 'Private offline' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setLocalSettings({ ...localSettings, activeProvider: p.id as ProviderType })}
                        className={`p-2.5 rounded-lg border text-left transition ${
                          localSettings.activeProvider === p.id
                            ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300 font-semibold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs">{p.label}</div>
                        <div className="text-[10px] text-slate-500">{p.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 2: GEMINI ===================== */}
          {activeTab === 'gemini' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white text-sm">Google Gemini Provider</h4>
                  <p className="text-xs text-slate-400">High-capacity reasoning and document context synthesis</p>
                </div>
                <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-mono">
                  @google/genai SDK
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Gemini API Key (Optional if configured in server environment)
                  </label>
                  <input
                    type="password"
                    value={localSettings.gemini.apiKey}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      gemini: { ...localSettings.gemini, apiKey: e.target.value }
                    })}
                    placeholder="AIzaSy... (leave empty to use server default)"
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Model Alias</label>
                  <input
                    type="text"
                    value={localSettings.gemini.model}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      gemini: { ...localSettings.gemini, model: e.target.value }
                    })}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 3: OPENROUTER ===================== */}
          {activeTab === 'openrouter' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white text-sm">OpenRouter Provider</h4>
                  <p className="text-xs text-slate-400">Access Claude, Llama 3.3, Mistral, DeepSeek, and 200+ models</p>
                </div>
                <a 
                  href="https://openrouter.ai/keys" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                >
                  Get Key <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">OpenRouter API Key</label>
                  <input
                    type="password"
                    value={localSettings.openrouter.apiKey}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      openrouter: { ...localSettings.openrouter, apiKey: e.target.value }
                    })}
                    placeholder="sk-or-v1-..."
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Model Identifier</label>
                  <input
                    type="text"
                    value={localSettings.openrouter.model}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      openrouter: { ...localSettings.openrouter, model: e.target.value }
                    })}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 4: GROQ ===================== */}
          {activeTab === 'groq' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div>
                <h4 className="font-semibold text-white text-sm">Groq High-Speed LPU</h4>
                <p className="text-xs text-slate-400">Ultra-fast tokens per second for real-time document drafting</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Groq API Key</label>
                  <input
                    type="password"
                    value={localSettings.groq.apiKey}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      groq: { ...localSettings.groq, apiKey: e.target.value }
                    })}
                    placeholder="gsk_..."
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Model</label>
                  <input
                    type="text"
                    value={localSettings.groq.model}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      groq: { ...localSettings.groq, model: e.target.value }
                    })}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 5: CUSTOM / LOCAL ===================== */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-semibold text-white text-sm">Local Models & 9Router Integration</h4>
                <p className="text-xs text-slate-400">
                  Connect to local Ollama (localhost:11434), LM Studio (localhost:1234), or 9Router proxy.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Base URL</label>
                    <input
                      type="text"
                      value={localSettings.nineRouter.baseUrl}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        nineRouter: { ...localSettings.nineRouter, baseUrl: e.target.value }
                      })}
                      placeholder="http://localhost:11434/v1"
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Model Name</label>
                    <input
                      type="text"
                      value={localSettings.nineRouter.model}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        nineRouter: { ...localSettings.nineRouter, model: e.target.value }
                      })}
                      placeholder="llama3:latest"
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 6: PERMISSIONS ===================== */}
          {activeTab === 'permissions' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div>
                <h4 className="font-semibold text-white text-sm">Agent Security & Permission Policy</h4>
                <p className="text-xs text-slate-400">
                  Enforce human-in-the-loop approvals before executing sensitive Office operations
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Auto-Approve Read Operations</div>
                    <div className="text-[11px] text-slate-400">Reading text, active selection, cell values</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.permissionPolicy?.autoApproveRead ?? true}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      permissionPolicy: {
                        ...localSettings.permissionPolicy,
                        autoApproveRead: e.target.checked
                      }
                    })}
                    className="w-4 h-4 text-indigo-600 rounded bg-slate-800 border-slate-700"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Auto-Approve Single Write Actions</div>
                    <div className="text-[11px] text-slate-400">Directly inserting single paragraph or single formula</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.permissionPolicy?.autoApproveWrite ?? true}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      permissionPolicy: {
                        ...localSettings.permissionPolicy,
                        autoApproveWrite: e.target.checked
                      }
                    })}
                    className="w-4 h-4 text-indigo-600 rounded bg-slate-800 border-slate-700"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-amber-400">Always Require Approval for Deletions</div>
                    <div className="text-[11px] text-slate-400">Deleting worksheets, slides, or large table ranges</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.permissionPolicy?.alwaysAskDelete ?? true}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      permissionPolicy: {
                        ...localSettings.permissionPolicy,
                        alwaysAskDelete: e.target.checked
                      }
                    })}
                    className="w-4 h-4 text-indigo-600 rounded bg-slate-800 border-slate-700"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-amber-400">Always Require Approval for Multi-Object Edits</div>
                    <div className="text-[11px] text-slate-400">Display confirmation dialog for operations affecting multiple sheets or tables</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.permissionPolicy?.alwaysAskMultiObject ?? true}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      permissionPolicy: {
                        ...localSettings.permissionPolicy,
                        alwaysAskMultiObject: e.target.checked
                      }
                    })}
                    className="w-4 h-4 text-indigo-600 rounded bg-slate-800 border-slate-700"
                  />
                </label>
              </div>
            </div>
          )}

          {/* ===================== TAB 7: CREATOR & SUPPORT ===================== */}
          {activeTab === 'creator' && (
            <div className="py-1">
              <CreatorSupportSection />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-400 flex items-center gap-1">
            {savedSuccess ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <Check className="w-4 h-4" /> Settings saved successfully!
              </span>
            ) : (
              <span>All settings are persisted to local encrypted storage</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
