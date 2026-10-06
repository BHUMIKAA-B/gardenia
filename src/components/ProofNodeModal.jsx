import React from 'react';
import { X, User, Clock, FileText, ShieldCheck, Award } from 'lucide-react';

export default function ProofNodeModal({ isOpen, onClose, node }) {
  if (!isOpen || !node) return null;
  const details = node.details || {};

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
              {node.category} · Node Details
            </span>
            <h3 className="font-semibold text-base text-zinc-100 leading-snug">{node.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 p-1 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {node.subtitle && <p className="text-xs text-zinc-400 leading-relaxed">{node.subtitle}</p>}

        {/* Details List */}
        <div className="space-y-2 pt-2 border-t border-zinc-800 text-xs">
          {[
            { icon: User,       key: 'owner',     label: 'Owner' },
            { icon: Clock,      key: 'timestamp', label: 'Timestamp' },
            { icon: FileText,   key: 'evidence',  label: 'Evidence Ref', mono: true },
            { icon: ShieldCheck,key: 'validator', label: 'Validator' },
            { icon: Award,      key: 'credit',    label: 'Credit Share' },
          ].map(f => details[f.key] ? (
            <div key={f.key} className="flex items-center justify-between text-zinc-300">
              <span className="text-zinc-500 flex items-center gap-1.5 text-[11px]">
                <f.icon className="w-3.5 h-3.5 text-zinc-400" /> {f.label}
              </span>
              <span className={`font-mono text-right ${f.mono ? 'text-[11px] text-indigo-400' : 'text-zinc-200'}`}>
                {details[f.key]}
              </span>
            </div>
          ) : null)}

          {details.why && (
            <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 mt-3 space-y-1">
              <div className="text-[10px] font-mono text-zinc-500">Significance</div>
              <div className="text-xs text-zinc-300 leading-relaxed">{details.why}</div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-all border border-zinc-700"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
}
