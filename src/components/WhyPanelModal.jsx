import React from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';

export default function WhyPanelModal({ isOpen, onClose, project }) {
  if (!isOpen || !project) return null;
  const scores = project.fitScores || { overall: 92, skills: 90, experience: 85, learning: 89, availability: 90 };
  const reasons = project.fitReasons || [
    'Direct skill overlap — Python, ML matched from your contributions',
    'Experience band aligns with project complexity level',
    'Availability window fits project 8-week timeline',
    'Domain interest (water/environment) detected from past work',
  ];

  const dims = [
    { label: 'Skills Match', val: scores.skills || 90 },
    { label: 'Experience',   val: scores.experience || 85 },
    { label: 'Availability', val: scores.availability || 90 },
    { label: 'Learning Fit', val: scores.learning || 89 },
  ];

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
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block mb-1">
              Match Engine Breakdown
            </span>
            <h3 className="font-semibold text-base text-zinc-100">{project.title}</h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Overall score */}
        <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 flex items-center justify-between font-mono">
          <div>
            <div className="text-xs text-zinc-400">Match Confidence</div>
            <div className="text-[11px] text-zinc-500">4 evaluated dimensions</div>
          </div>
          <div className="text-2xl font-semibold text-indigo-400">{scores.overall || 92}%</div>
        </div>

        {/* Breakdown bars */}
        <div className="space-y-2">
          {dims.map(d => (
            <div key={d.label} className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-zinc-400">
                <span>{d.label}</span>
                <span className="text-zinc-200">{d.val}%</span>
              </div>
              <div className="h-1 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${d.val}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Reasons */}
        <div className="space-y-2 pt-2 border-t border-zinc-800">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Match Factors</div>
          <div className="space-y-1.5">
            {reasons.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-all border border-zinc-700"
        >
          Close Breakdown
        </button>
      </div>
    </div>
  );
}
