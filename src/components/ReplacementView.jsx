import React, { useState, useEffect } from 'react';
import { UserCheck, Shield, Sparkles, CheckCircle2, UserX, ArrowRight, Lock } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
  const { user, addNotification } = useAuth();
  const [replacements, setReplacements] = useState(INITIAL_REPLACEMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [reason, setReason] = useState("Academic exam schedule constraint for upcoming 4 weeks.");
  const [skills, setSkills] = useState("Python, Machine Learning, Data Analysis, Time-Series Modeling");
  const [progress, setProgress] = useState("62");

  useEffect(() => {
    api.getReplacements().then(data => {
      if (data && data.length > 0) setReplacements(data);
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
      addNotification({ title: "Replacement Approved", message: `${candName} approved as replacement researcher.` });
      onStartHandover && onStartHandover();
    });
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-zinc-400" />
            Private Researcher Replacement & Continuity
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Skill-matched replacement invitations & authority sign-off
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-600 hover:bg-amber-500 text-white transition-all shrink-0"
        >
          Request Replacement
        </button>
      </div>

      {/* Replacement Requests List */}
      <div className="space-y-3">
        {replacements.map(rep => (
          <div key={rep.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-100">{rep.project_title}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    rep.status === 'Approved'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {rep.status}
                  </span>
                </div>
                <div className="text-xs text-zinc-400">
                  Requester: <span className="text-zinc-200 font-medium">{rep.requester_name}</span> ({rep.requester_role})
                </div>
              </div>

              <div className="text-right shrink-0 font-mono text-[11px]">
                <div className="text-indigo-400">{rep.progress_pct}% Project Progress</div>
                <div className="text-zinc-500 mt-0.5">{rep.last_milestone}</div>
              </div>
            </div>

            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs text-zinc-300">
              <span className="font-mono text-[10px] text-zinc-500 uppercase block mb-0.5">Reason</span>
              <p>{rep.reason}</p>
            </div>

            {/* Required Skills */}
            <div className="flex flex-wrap gap-1">
              {rep.required_skills.map(s => (
                <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800 font-mono">
                  {s} ✓
                </span>
              ))}
            </div>

            {/* Skill Matched Candidates */}
            <div className="pt-2 border-t border-zinc-800/80 space-y-2">
              <div className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Private Skill-Matched Candidate Invitations
              </div>

              {rep.candidates?.map(cand => (
                <div key={cand.user_name} className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-zinc-800 text-indigo-400 font-semibold flex items-center justify-center border border-zinc-700">
                      {cand.user_name[0]}
                    </div>
                    <div>
                      <div className="text-zinc-200 font-medium">{cand.user_name}</div>
                      <div className="text-[10px] text-emerald-400">{cand.match_score}% Skill Match</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {rep.status === 'Approved' ? (
                      <button
                        onClick={onStartHandover}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-medium flex items-center gap-1"
                      >
                        Launch AI Handover <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApproveCandidate(rep.id, cand.user_id, cand.user_name)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-medium"
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
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 max-w-md w-full p-6 rounded-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">Request Private Researcher Replacement</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">×</button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Reason for Replacement *</label>
                <textarea
                  rows={2}
                  required
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Required Skills (comma separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Current Progress %</label>
                <input
                  type="number"
                  value={progress}
                  onChange={e => setProgress(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium"
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
