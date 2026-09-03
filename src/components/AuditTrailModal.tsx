import React from 'react';
import { X, Shield, FileText, CheckCircle2, AlertCircle, Clock, Search, Trash2 } from 'lucide-react';
import { AuditEvent } from '../types';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditLogs: AuditEvent[];
  onClearLogs: () => void;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  isOpen,
  onClose,
  auditLogs,
  onClearLogs,
}) => {
  const [filter, setFilter] = React.useState('');

  if (!isOpen) return null;

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.operation.toLowerCase().includes(filter.toLowerCase()) ||
      log.tool.toLowerCase().includes(filter.toLowerCase()) ||
      log.target.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden text-left"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">
                OMINIX Audit Trail & Security Log
              </h3>
              <p className="text-xs text-slate-400">
                Detailed record of all agent tool actions, document writes, and user approvals
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {auditLogs.length > 0 && (
              <button
                onClick={onClearLogs}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-800 transition"
                title="Clear audit history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search by operation, tool name, or target range..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filteredLogs.length} events
          </span>
        </div>

        {/* Log Entries */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              No audit events recorded yet. Perform agent tool actions to inspect logs.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-lg p-3 text-xs space-y-1.5 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-slate-800 text-slate-300">
                      {log.host}
                    </span>
                    <span className="font-semibold text-slate-200">{log.operation}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{log.timestamp}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-slate-400">
                  <div>
                    <span className="text-slate-500">Tool: </span>
                    <span className="font-mono text-indigo-300">{log.tool}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Target: </span>
                    <span className="font-mono text-slate-300">{log.target}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Approval: </span>
                    <span className={
                      log.approvalStatus === 'user-approved'
                        ? 'text-emerald-400 font-medium'
                        : log.approvalStatus === 'auto-approved'
                        ? 'text-blue-400'
                        : 'text-rose-400'
                    }>
                      {log.approvalStatus}
                    </span>
                  </div>
                </div>

                {log.details && (
                  <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800/80 font-mono">
                    {log.details}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>OMINIX local encryption active &bull; Stored locally</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
