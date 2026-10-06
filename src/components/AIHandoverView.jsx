import React, { useState, useEffect } from 'react';
import { Bot, ShieldCheck, CheckCircle2, ArrowRight, FileText, Cpu, Clock, AlertTriangle, RefreshCw, Check, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

const INITIAL_HANDOVER = {
  id: "HO-101",
  project_id: "PW-1042",
  project_title: "AI-Assisted Urban Water Quality Prediction",
  progress: 62,
  replacement_id: "REP-101",
  requester_name: "Bhumikaa B",
  replacement_name: "Aarav Patel",
  status: "Completed",
  completed_tasks: [
    "Dataset cleaning & validation (12,400 sensor records)",
    "Missing-value analysis & timestamp normalization",
    "Literature Scout AI paper summarization (34 papers)",
    "Project Charter signing and role assignment",
    "Baseline LSTM model architecture definition",
    "Initial telemetry data ingestion pipeline"
  ],
  pending_tasks: [
    "Temporal feature engineering (rainfall/spikes)",
    "Train 48-hour LSTM forecasting model",
    "Comparative benchmark evaluation report"
  ],
  key_findings: [
    "12,400 telemetry records cleaned & validated from primary water sensors.",
    "7% timestamp inconsistencies resolved via linear interpolation.",
    "Strong seasonal contamination correlation detected in historical logs (p < 0.01)."
  ],
  known_issues: "Sensor anomaly noise in sector B telemetry logs requiring time-series clipping.",
  expert_guidance: "Dr. Meera Rao recommended time-based validation split over random cross-validation.",
  authorized_artifacts: [
    { title: "Dataset Validation Report", ref: "SHA: a91f82c4", verified: true, source_id: "CON-1001" },
    { title: "Literature Scout AI Summaries", ref: "34 paper summaries", verified: true, source_id: "CON-1002" },
    { title: "LSTM Neural Net Baseline Model", ref: "Git commit #b3e1cc78", verified: true, source_id: "CON-1003" },
    { title: "Project Charter & Scoped Boundary", ref: "Multi-party Signed", verified: true, source_id: "PW-CHARTER" }
  ],
  ai_summary: "AI Handover Assistant gathered 4 authorized evidence artifacts, 6 completed milestones, and 3 pending tasks for seamless research continuity on Urban Water Quality Prediction.",
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
  const { addToast } = useToast();
  const [handover, setHandover] = useState(INITIAL_HANDOVER);
  const [handoverState, setHandoverState] = useState('Generated'); // Not Started, Generating..., Generated, Needs Review, Approved, Failed
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api.getHandover("PW-1042").then(data => {
      if (!isMounted) return;
      if (data && data.id) {
        setHandover(data);
        setHandoverState('Generated');
      } else if (data === null) {
        // Access denied or null
        setErrorMsg("Unable to retrieve handover session. Access control active.");
      }
    }).catch(err => {
      if (isMounted) {
        setHandoverState('Failed');
        setErrorMsg("Backend connection timeout or access check restriction.");
      }
    });

    return () => { isMounted = false; };
  }, []);

  const handleGenerate = async () => {
    setHandoverState('Generating...');
    setErrorMsg(null);
    try {
      const res = await api.generateHandover("PW-1042", "REP-101");
      if (res && res.success) {
        setHandover(prev => ({ ...prev, ...res }));
        setHandoverState('Generated');
        addToast({ title: 'AI Handover Generated ✓', message: 'Structured continuity brief generated and audit event logged.' });
      } else if (res && res.status === 403) {
        setHandoverState('Failed');
        setErrorMsg("403 Forbidden: You do not have permission to generate handover for this project.");
      } else {
        setHandoverState('Failed');
        setErrorMsg(res?.detail || "Unable to generate handover. Backend AI provider error.");
      }
    } catch (e) {
      setHandoverState('Failed');
      setErrorMsg("Unable to connect to AI Handover service. Please retry.");
    }
  };

  const handleApproveHandover = () => {
    setHandoverState('Approved');
    addToast({ title: 'Handover Accepted ✓', message: 'You have formally reviewed and accepted the project handover brief.' });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-indigo">
              <Bot className="w-3.5 h-3.5 text-purple-400" /> AI-Assisted Project Handover
            </span>
            <span className={`badge ${handoverState === 'Approved' ? 'badge-green' : handoverState === 'Failed' ? 'badge-red' : 'badge-cyan'}`}>
              {handoverState}
            </span>
          </div>
          <h2 className="text-xl font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
            PROJECT HANDOVER — Continuity Brief
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Automated onboarding brief generated from authorized project evidence & audit logs
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleGenerate}
            disabled={handoverState === 'Generating...'}
            className="btn btn-secondary btn-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${handoverState === 'Generating...' ? 'animate-spin' : ''}`} />
            {handoverState === 'Generating...' ? 'Generating...' : 'Regenerate Brief'}
          </button>

          <button
            onClick={onProceedToWorkspace}
            className="btn btn-primary btn-sm"
          >
            Continue Project <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="stat">
          <div className="stat-value">{handover.progress || 62}%</div>
          <div className="stat-label">Overall Progress</div>
        </div>
        <div className="stat">
          <div className="stat-value text-emerald-500">{handover.completed_tasks?.length || 6}</div>
          <div className="stat-label">Completed Tasks</div>
        </div>
        <div className="stat">
          <div className="stat-value text-amber-500">{handover.pending_tasks?.length || 3}</div>
          <div className="stat-label">Open Tasks</div>
        </div>
        <div className="stat">
          <div className="stat-value text-indigo-400">{handover.authorized_artifacts?.length || 14}</div>
          <div className="stat-label">Evidence Artifacts</div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="panel p-4">
        <div className="flex items-center justify-between text-xs font-mono">
          {TIMELINE_STEPS.map((s, idx) => (
            <React.Fragment key={s.step}>
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  s.done || handoverState === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {s.step}
                </span>
                <span style={{ color: s.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s.label}</span>
              </div>
              {idx < TIMELINE_STEPS.length - 1 && <div className="h-px flex-1 mx-3" style={{ background: 'var(--bg-border)' }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Error state alert */}
      {handoverState === 'Failed' && (
        <div className="panel p-4 border-red-500/30 bg-red-500/10 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-semibold text-red-300">Unable to generate handover</h4>
            <p className="text-red-200/80 mt-1">{errorMsg || "AI provider or access restriction error."}</p>
            <button className="btn btn-danger btn-sm mt-3" onClick={handleGenerate}>
              <RefreshCw className="w-3 h-3" /> Retry Generation
            </button>
          </div>
        </div>
      )}

      {/* Handover Brief Card */}
      <div className="panel p-6 space-y-6">
        {/* Identity & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--bg-border)' }}>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider block mb-1" style={{ color: 'var(--purple)' }}>
              Continuity Transfer
            </span>
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              {handover.requester_name} → {handover.replacement_name}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Project: <strong style={{ color: 'var(--text-primary)' }}>{handover.project_id}</strong> · {handover.project_title || "Urban Water Quality Prediction"}
            </p>
          </div>
          <span className="badge badge-indigo text-xs">
            "AI can assist, but AI cannot own"
          </span>
        </div>

        {/* AI Summary */}
        <div className="p-4 rounded-lg border font-mono text-xs space-y-1.5" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--bg-border)' }}>
          <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--purple)' }}>
            <Sparkles className="w-3.5 h-3.5" /> AI Handover Executive Brief
          </div>
          <p className="leading-relaxed" style={{ color: 'var(--text-primary)' }}>{handover.ai_summary}</p>
        </div>

        {/* Completed Work & Open Tasks (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Completed Work */}
          <div className="p-4 rounded-lg border space-y-3" style={{ background: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
            <div className="font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--green)' }}>
              <CheckCircle2 className="w-4 h-4" /> Completed Work ({handover.completed_tasks?.length})
            </div>
            <div className="space-y-2">
              {handover.completed_tasks?.map((task, i) => (
                <div key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="text-emerald-500 font-mono font-bold">✓</span>
                  <span>{task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Work */}
          <div className="p-4 rounded-lg border space-y-3" style={{ background: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
            <div className="font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--amber)' }}>
              <Clock className="w-4 h-4" /> Open Tasks ({handover.pending_tasks?.length})
            </div>
            <div className="space-y-2">
              {handover.pending_tasks?.map((task, i) => (
                <div key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="text-amber-500 font-mono font-bold">→</span>
                  <span>{task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Findings & Known Issues */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Verified Findings & Known Issues
          </h4>

          <div className="p-4 rounded-lg border space-y-2 text-xs font-mono" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--bg-border)' }}>
            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>Important Verified Findings:</div>
            <ul className="space-y-1 pl-2" style={{ color: 'var(--text-secondary)' }}>
              {handover.key_findings?.map((f, i) => (
                <li key={i}>• {f} <span className="text-xs text-indigo-400 font-sans">[Source: #CON-100{i+1}]</span></li>
              ))}
            </ul>
          </div>

          {/* Known issues & expert guidance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg border space-y-1.5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
              <div className="font-semibold text-amber-500 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Known Issues / Blockers
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>{handover.known_issues}</p>
            </div>

            <div className="p-4 rounded-lg border space-y-1.5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
              <div className="font-semibold text-indigo-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Expert & Mentor Guidance
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>"{handover.expert_guidance}"</p>
            </div>
          </div>
        </div>

        {/* Authorized Evidence Artifacts & Sources */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Authorized Source Evidence ({handover.authorized_artifacts?.length})
            </h4>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Scoped & Verified Access</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {handover.authorized_artifacts?.map(art => (
              <div
                key={art.title}
                className="p-3 rounded-lg border flex items-center justify-between hover:border-indigo-500/50 transition-all cursor-pointer"
                style={{ background: 'var(--bg-elevated)', borderColor: 'var(--bg-border)' }}
                onClick={() => onOpenProofModal && onOpenProofModal({ title: art.title, category: "Evidence", details: { evidence: art.ref, why: "Verified evidence artifact transferred during AI Handover." } })}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{art.title}</div>
                    <div className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>{art.ref}</div>
                  </div>
                </div>

                <button
                  className="btn btn-ghost btn-sm text-xs shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenProofModal) onOpenProofModal({ title: art.title, category: "Evidence", details: { evidence: art.ref, why: "Verified evidence artifact transferred during AI Handover." } });
                  }}
                >
                  Open Evidence →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Next Recommended Step */}
        <div className="p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ background: 'var(--accent-subtle)', borderColor: 'var(--accent-border)' }}>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
              Recommended Continuation Step
            </span>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {handover.next_recommended_action}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {handoverState !== 'Approved' && (
              <button className="btn btn-secondary btn-sm" onClick={handleApproveHandover}>
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Accept Handover
              </button>
            )}
            <button className="btn btn-primary btn-sm" onClick={onProceedToWorkspace}>
              Continue Project →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
