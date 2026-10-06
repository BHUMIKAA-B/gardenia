import React from 'react';
import { X, Lock, CheckCircle2 } from 'lucide-react';

export default function DeniedAccessModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-red-500/30 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block">Scope Violation</span>
              <h3 className="font-semibold text-sm text-zinc-100">Access Request Denied</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-300 font-mono">
          {data.reason}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          {[
            { label: 'Agent',      value: data.agent,            color: 'text-zinc-200' },
            { label: 'Human Owner', value: data.human_owner,    color: 'text-zinc-400' },
            { label: 'Assigned',   value: data.assigned_project, color: 'text-indigo-400' },
            { label: 'Attempted',  value: data.requested_project, color: 'text-red-400' },
          ].map(f => (
            <div key={f.label} className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
              <div className="text-[10px] text-zinc-500 mb-0.5">{f.label}</div>
              <div className={`font-semibold ${f.color}`}>{f.value}</div>
            </div>
          ))}
        </div>

        {data.action_recorded && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Audit Entry logged: ID {data.audit_id}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 transition-all"
        >
          Close Notification
        </button>
      </div>
    </div>
  );
}
