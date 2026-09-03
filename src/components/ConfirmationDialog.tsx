import React from 'react';
import { AlertTriangle, Check, X, ShieldAlert, Layers } from 'lucide-react';
import { PendingToolOperation } from '../types';

interface ConfirmationDialogProps {
  pendingOperation: PendingToolOperation | null;
  onApprove: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  pendingOperation,
  onApprove,
  onCancel,
}) => {
  if (!pendingOperation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden text-left"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-dialog-title"
      >
        {/* Header */}
        <div className="p-4 bg-amber-950/40 border-b border-amber-600/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 id="confirmation-dialog-title" className="font-semibold text-white text-sm">
                Action Approval Required
              </h3>
              <p className="text-xs text-amber-200/80">
                Permission policy requires your confirmation before proceeding
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {pendingOperation.approvalTier === 'STRICT_CONFIRM' ? (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                STRICT CONFIRM
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {pendingOperation.approvalTier || 'CONFIRM'}
              </span>
            )}
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium uppercase bg-slate-800 text-slate-300 border border-slate-700">
              {pendingOperation.permissionCategory}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
              <span>Tool: <span className="text-indigo-300 font-semibold">{pendingOperation.toolName}</span> ({pendingOperation.host.toUpperCase()})</span>
              {pendingOperation.scope && (
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">
                  Scope: {pendingOperation.scope}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-slate-200">
              {pendingOperation.title}
            </p>
          </div>

          {pendingOperation.actionPreview && (
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
              <span className="text-emerald-400 font-semibold">+{pendingOperation.actionPreview.addedCount ?? 1} Added</span>
              <span className="text-sky-400 font-semibold">~{pendingOperation.actionPreview.modifiedCount ?? 0} Modified</span>
              <span className="text-rose-400 font-semibold">-{pendingOperation.actionPreview.deletedCount ?? 0} Deleted</span>
              <span className="ml-auto text-[10px] text-slate-400 font-mono uppercase">
                Risk: {pendingOperation.actionPreview.riskLevel}
              </span>
            </div>
          )}

          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 space-y-2">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              OMINIX is ready to make the following changes:
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {pendingOperation.summaryChanges.map((change, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[11px] text-slate-400">
            You can modify approval policies in <span className="text-slate-300 font-medium">Settings &rarr; Permissions</span>.
          </p>
        </div>

        {/* Actions */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-end gap-2.5">
          <button
            id="confirmation-cancel-btn"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            Cancel Operation
          </button>
          <button
            id="confirmation-approve-btn"
            onClick={onApprove}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-sm flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            Approve & Execute
          </button>
        </div>
      </div>
    </div>
  );
};
