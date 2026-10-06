import React, { useState, useEffect } from 'react';
import { Bot, ShieldCheck, CheckCircle2, ArrowRight, FileText, Cpu, ExternalLink } from 'lucide-react';
import { api } from '../services/api';

const INITIAL_HANDOVER = {
  id: "HO-101",
  project_id: "PW-1042",
  replacement_id: "REP-101",
  requester_name: "Bhumikaa B",
  replacement_name: "Aarav Patel",
  status: "Completed",
  completed_tasks: [
    "Dataset cleaning & validation (12,400 sensor records)",
    "Missing-value analysis & timestamp normalization",
    "Literature Scout AI paper summarization (34 papers)"
  ],
  pending_tasks: [
    "Temporal feature engineering (rainfall/spikes)",
    "Train 48-hour LSTM forecasting model",
    "Comparative benchmark evaluation report"
  ],
  key_findings: [
    "12,400 telemetry records cleaned & validated.",
    "7% timestamp inconsistencies resolved via linear interpolation.",
    "Strong seasonal contamination correlation detected in historical logs."
  ],
  known_issues: "Sensor anomaly noise in sector B telemetry logs requiring time-series clipping.",
  expert_guidance: "Dr. Meera Rao recommended time-based validation split over random cross-validation.",
  authorized_artifacts: [
    { title: "Dataset Validation Report", ref: "SHA: a91f82c4", verified: true },
    { title: "Literature Scout AI Summaries", ref: "34 paper summaries", verified: true },
    { title: "LSTM Neural Net Baseline Model", ref: "Git commit #b3e1cc78", verified: true },
    { title: "Project Charter & Scoped Boundary", ref: "Multi-party Signed", verified: true }
  ],
  ai_summary: "AI Handover Assistant gathered 4 authorized evidence artifacts, 3 completed milestones, and 3 pending tasks for seamless research continuity.",
  next_recommended_action: "Begin temporal feature engineering and inspect Dataset Validation Report #a91f82c4."
};

const TIMELINE_STEPS = [
  { step: "01", label: "Access Granted", done: true },
  { step: "02", label: "Artifacts Collected", done: true },
  { step: "03", label: "AI Analysis", done: true },
  { step: "04", label: "Handover Brief", done: true },
  { step: "05", label: "Researcher Review", done: false }
];

export default function AIHandoverView({ onProceedToWorkspace, onOpenProofModal }) {
  const [handover, setHandover] = useState(INITIAL_HANDOVER);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState(null);

  useEffect(() => {
    api.getHandover("PW-1042").then(data => {
      if (data && data.id) setHandover(data);
    });
  }, []);

  const handleRegenerate = () => {
    setIsGenerating(true);
    api.generateHandover("PW-1042", "REP-101").then(res => {
      setIsGenerating(false);
      if (res && res.id) {
        setHandover(prev => ({ ...prev, ...res }));
      }
    });
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Bot className="w-4 h-4 text-purple-400" />
            AI-Assisted Project Handover Assistant
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Automated onboarding brief generated from authorized project evidence & audit logs
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5 text-purple-400" /> {isGenerating ? 'Analyzing…' : 'Refresh AI Summary'}
          </button>
          <button
            onClick={onProceedToWorkspace}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5"
          >
            Open Project Workspace <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="flex items-center justify-between text-xs font-mono">
          {TIMELINE_STEPS.map((s, idx) => (
            <React.Fragment key={s.step}>
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  s.done ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {s.step}
                </span>
                <span className={s.done ? 'text-zinc-200' : 'text-zinc-500'}>{s.label}</span>
              </div>
              {idx < TIMELINE_STEPS.length - 1 && <div className="h-px bg-zinc-800 flex-1 mx-3" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Handover Brief Card */}
      <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900 space-y-4">
        {/* Identity & Status */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block mb-0.5">
              Continuity Transfer
            </span>
            <h4 className="text-sm font-semibold text-zinc-100">
              {handover.requester_name} → {handover.replacement_name}
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">Project PW-1042 · Urban Water Quality Prediction</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
            "AI can assist, but AI cannot own"
          </span>
        </div>

        {/* AI Executive Summary */}
        <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs space-y-1 font-mono">
          <div className="text-[10px] text-purple-400 uppercase font-bold flex items-center gap-1">
            <Bot className="w-3 h-3" /> AI Handover Assistant Brief
          </div>
          <p className="text-zinc-300 leading-relaxed">{handover.ai_summary}</p>
        </div>

        {/* Two-column tasks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Completed */}
          <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 space-y-2">
            <div className="text-[10px] font-mono text-emerald-400 uppercase font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Completed Milestones ({handover.completed_tasks?.length})
            </div>
            <div className="space-y-1">
              {handover.completed_tasks?.map((t, i) => (
                <div key={i} className="text-zinc-300 flex items-start gap-1.5 text-[11px]">
                  <span className="text-emerald-400 font-mono">✓</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending */}
          <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 space-y-2">
            <div className="text-[10px] font-mono text-amber-400 uppercase font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" /> Pending Work ({handover.pending_tasks?.length})
            </div>
            <div className="space-y-1">
              {handover.pending_tasks?.map((t, i) => (
                <div key={i} className="text-zinc-300 flex items-start gap-1.5 text-[11px]">
                  <span className="text-amber-400 font-mono">→</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Findings & Expert Guidance */}
        <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2 text-xs">
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Expert Guidance & Observations</div>
          <div className="text-zinc-300 font-mono text-[11px] leading-relaxed">
            "{handover.expert_guidance}"
          </div>
          <div className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/60 font-mono">
            Known Issue: {handover.known_issues}
          </div>
        </div>

        {/* Authorized Evidence Artifacts */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-zinc-200">Authorized Evidence Artifacts ({handover.authorized_artifacts?.length})</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {handover.authorized_artifacts?.map(art => (
              <button
                key={art.title}
                onClick={() => onOpenProofModal && onOpenProofModal({ title: art.title, category: "Evidence", details: { evidence: art.ref, why: "Verified evidence artifact transferred during AI Handover." } })}
                className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:border-zinc-700 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-zinc-200 group-hover:text-white truncate">{art.title}</div>
                    <div className="text-[10px] font-mono text-zinc-500">{art.ref}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Verified
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Next Recommended Action */}
        <div className="p-3 rounded-lg border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-between text-xs font-mono text-indigo-300">
          <div>
            <span className="text-[10px] text-zinc-400 block">Recommended Next Action</span>
            <span className="font-semibold text-zinc-100">{handover.next_recommended_action}</span>
          </div>
          <button
            onClick={onProceedToWorkspace}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium flex items-center gap-1 shrink-0"
          >
            Start Work <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
