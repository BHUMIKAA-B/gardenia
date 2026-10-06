import React, { useState, useEffect } from 'react';
import { UserCheck, Shield, Sparkles, CheckCircle2, UserX, ArrowRight, Lock } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const INITIAL_REPLACEMENTS = [
  {
    id: "REP-101",
    project_id: "PW-1042",
    project_title: "AI-Assisted Urban Water Quality Prediction",
    requester_name: "Bhumikaa B",
    requester_role: "Student Researcher",
    reason: "Academic exam schedule constraint for upcoming 4 weeks.",
    required_skills: ["Python", "Machine Learning", "Data Analysis", "Time-Series Modeling"],
    progress_pct: 62,
    last_milestone: "Milestone 1 — Data Validation",
    status: "Approved",
    approved_candidate_id: 3,
    approved_candidate_name: "Aarav Patel",
    candidates: [
      { id: 1, user_id: 3, user_name: "Aarav Patel", match_score: 94.0, status: "Approved" }
    ]
  }
];

export default function ReplacementView({ onStartHandover }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [replacements, setReplacements] = useState(INITIAL_REPLACEMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [reason, setReason] = useState("Academic exam schedule constraint for upcoming 4 weeks.");
  const [skills, setSkills] = useState("Python, Machine Learning, Data Analysis, Time-Series Modeling");
  const [progress, setProgress] = useState("62");

  useEffect(() => {
    api.getReplacements().then(data => {
      if (data && Array.isArray(data) && data.length > 0) setReplacements(data);
    });
  }, []);

  const handleCreateRequest = (e) => {
    e.preventDefault();
    const skillsList = skills.split(',').map(s => s.trim()).filter(Boolean);

    const newRep = {
      id: `REP-${Date.now()}`,
      project_id: "PW-1042",
      project_title: "AI-Assisted Urban Water Quality Prediction",
      requester_name: user?.name || "Bhumikaa B",
      requester_role: user?.role || "Student",
      reason: reason,
      required_skills: skillsList,
      progress_pct: parseInt(progress) || 60,
      last_milestone: "Milestone 1 — Data Validation",
      status: "Candidate Invited",
      approved_candidate_name: null,
      candidates: [
        { id: 1, user_id: 3, user_name: "Aarav Patel", match_score: 94.0, status: "Invited" }
      ]
    };

    setReplacements(prev => [newRep, ...prev]);
    setIsModalOpen(false);
    addToast({ title: 'Replacement Requested', message: 'Private replacement workflow initiated and matching candidates notified.' });

    api.createReplacementRequest({
      project_id: "PW-1042",
      reason: reason,
      required_skills: skillsList,
      progress_pct: parseInt(progress) || 60,
      last_milestone: "Milestone 1 — Data Validation"
    });
  };

  const handleApproveCandidate = (repId, candId, candName) => {
    setReplacements(prev => prev.map(r => r.id === repId ? { ...r, status: "Approved", approved_candidate_name: candName } : r));
    api.approveReplacement(repId, candId).then(() => {
      addToast({ title: "Replacement Approved ✓", message: `${candName} approved as replacement researcher.` });
      onStartHandover && onStartHandover();
    });
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Lock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            Private Researcher Replacement & Continuity
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Skill-matched replacement invitations & authority sign-off
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary btn-sm shrink-0"
        >
          Request Replacement
        </button>
      </div>

      {/* Replacement Requests List */}
      <div className="space-y-3">
        {replacements.map(rep => (
          <div key={rep.id} className="panel p-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{rep.project_title}</span>
                  <span className={`badge ${rep.status === 'Approved' ? 'badge-green' : 'badge-amber'}`}>
                    {rep.status}
                  </span>
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Requester: <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{rep.requester_name}</span> ({rep.requester_role})
                </div>
              </div>

              <div className="text-right shrink-0 font-mono text-[11px]">
                <div className="font-semibold text-indigo-500">{rep.progress_pct}% Project Progress</div>
                <div className="mt-0.5" style={{ color: 'var(--text-muted)' }}>{rep.last_milestone}</div>
              </div>
            </div>

            <div className="p-3 rounded-lg border text-xs" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--bg-border)', color: 'var(--text-secondary)' }}>
              <span className="font-mono text-[10px] uppercase block mb-0.5" style={{ color: 'var(--text-muted)' }}>Reason for replacement</span>
              <p>{rep.reason}</p>
            </div>

            {/* Required Skills */}
            <div className="flex flex-wrap gap-1.5">
              {rep.required_skills.map(s => (
                <span key={s} className="badge badge-gray font-mono">
                  {s} ✓
                </span>
              ))}
            </div>

            {/* Skill Matched Candidates */}
            <div className="pt-3 border-t space-y-2" style={{ borderColor: 'var(--bg-border)' }}>
              <div className="text-[10px] font-mono uppercase flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Private Skill-Matched Candidate Invitations
              </div>

              {rep.candidates?.map(cand => (
                <div key={cand.user_name} className="p-3 rounded-lg border flex items-center justify-between text-xs font-mono" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--bg-border)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded font-semibold flex items-center justify-center border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--bg-border)', color: 'var(--accent)' }}>
                      {cand.user_name[0]}
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{cand.user_name}</div>
                      <div className="text-[10px] text-emerald-500 font-bold">{cand.match_score}% Skill Match</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {rep.status === 'Approved' ? (
                      <button
                        onClick={onStartHandover}
                        className="btn btn-primary btn-sm"
                      >
                        Launch AI Handover <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApproveCandidate(rep.id, cand.user_id, cand.user_name)}
                        className="btn btn-secondary btn-sm text-emerald-600"
                      >
                        Approve Candidate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Request Private Researcher Replacement</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}>×</button>
            </div>

            <form onSubmit={handleCreateRequest} className="modal-body space-y-3">
              <div>
                <label className="form-label">Reason for Replacement *</label>
                <textarea
                  rows={2}
                  required
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="textarea"
                />
              </div>

              <div>
                <label className="form-label">Required Skills (comma separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="form-label">Current Progress %</label>
                <input
                  type="number"
                  value={progress}
                  onChange={e => setProgress(e.target.value)}
                  className="input"
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Submit Private Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
