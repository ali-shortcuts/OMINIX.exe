import React from 'react';
import { 
  X, 
  Sparkles, 
  FileText, 
  TableProperties, 
  Presentation, 
  Code2, 
  Bot, 
  Check, 
  ArrowRight 
} from 'lucide-react';
import { Realm, OfficeAppType } from '../types';

interface RealmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  realms: Realm[];
  activeRealm: Realm;
  onSelectRealm: (realm: Realm) => void;
  currentApp: OfficeAppType;
}

export const RealmsModal: React.FC<RealmsModalProps> = ({
  isOpen,
  onClose,
  realms,
  activeRealm,
  onSelectRealm,
  currentApp,
}) => {
  if (!isOpen) return null;

  const iconMap: Record<string, any> = {
    FileText: <FileText className="w-5 h-5" />,
    TableProperties: <TableProperties className="w-5 h-5" />,
    Presentation: <Presentation className="w-5 h-5" />,
    Code2: <Code2 className="w-5 h-5" />,
    Bot: <Bot className="w-5 h-5" />,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden text-left"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">
                OMINIX Specialized Personas & Realms
              </h3>
              <p className="text-xs text-slate-400">
                Choose an expert AI persona tuned for Word editorial, Excel modeling, or PowerPoint decks
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

        {/* Realms Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {realms.map((realm) => {
            const isSelected = activeRealm.id === realm.id;
            const isRecommended = realm.recommendedApp === currentApp || realm.recommendedApp === 'all';

            return (
              <div
                key={realm.id}
                onClick={() => {
                  onSelectRealm(realm);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500/40'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-lg bg-gradient-to-br ${realm.color} text-white shadow-sm flex-shrink-0`}>
                    {iconMap[realm.icon] || <Bot className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-100 text-sm">{realm.name}</h4>
                      {isRecommended && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                          Recommended for {currentApp.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-medium text-indigo-300">{realm.title}</div>
                    <p className="text-xs text-slate-400 leading-relaxed">{realm.description}</p>
                  </div>
                </div>

                <div className="flex-shrink-0 pt-1">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Active Persona: <strong className="text-slate-200">{activeRealm.name}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
