import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Plus, FileText, Clock, User, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const INITIAL_UPDATES = [
  {
    id: "UPD-101",
    project_id: "PW-1042",
    author_name: "Bhumikaa B",
    author_role: "Student",
    update_type: "Daily",
    date: "06 Oct 2026",
    summary: "Validated missing values in water quality dataset and completed 12,400 record review.",
    work_completed: "Reviewed 12,400 records, applied linear interpolation on missing sensor readings.",
    challenges: "7% records contained inconsistent timestamps in sector B.",
    next_steps: "Complete timestamp normalization and begin temporal feature generation.",
    evidence_ref: "Dataset Validation Report #a91f82c4",
    effort_hours: 5.0,
    milestone_progress: 55,
    status: "Reviewed",
    reviewer_name: "Dr. Meera Rao",
    reviewer_comment: "Approved. Please document the timestamp normalization methodology."
  },
  {
    id: "UPD-102",
    project_id: "PW-1042",
    author_name: "Dr. Meera Rao",
    author_role: "Mentor",
    update_type: "Weekly",
    date: "05 Oct 2026 (Week 2)",
    summary: "Milestone 1 Data Cleaning completed with verified evidence. Moving to forecasting model.",
    work_completed: "Data validation pipeline verified, outlier formula confirmed by domain board.",
    challenges: "Sector B sensor noise handled via clipping.",
    next_steps: "Begin LSTM forecast model architecture design.",
    evidence_ref: "Milestone 1 Deliverable Package",
    effort_hours: 12.0,
    milestone_progress: 100,
    status: "Approved",
    reviewer_name="AquaNova Research Board",
    reviewer_comment="Milestone 1 Verified & Escrow Released."
  }
];

export default function WorkUpdatesView({ onRequestReplacement }) {
  const { user } = useAuth();
  const [updates, setUpdates] = useState(INITIAL_UPDATES);
  const [activeTab, setActiveTab] = useState("Daily");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Form state
  const [summary, setSummary] = useState("");
  const [workCompleted, setWorkCompleted] = useState("");
  const [challenges, setChallenges] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [evidenceRef, setEvidenceRef] = useState("Dataset Validation Report #a91f82c4");
  const [hours, setHours] = useState("5");

  useEffect(() => {
    api.getWorkUpdates("PW-1042", activeTab).then(data => {
      if (data && data.length > 0) setUpdates(data);
    });
  }, [activeTab]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUp = {
      id: `UPD-${Date.now()}`,
      project_id: "PW-1042",
      author_name: user?.name || "Bhumikaa B",
      author_role: user?.role === 'expert' ? 'Mentor' : 'Student',
      update_type: activeTab,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      summary: summary,
      work_completed: workCompleted,
      challenges: challenges,
      next_steps: nextSteps,
      evidence_ref: evidenceRef,
      effort_hours: parseFloat(hours) || 4.0,
      milestone_progress: 60,
      status: "Submitted",
      reviewer_name: null,
      reviewer_comment: null
    };

    setUpdates(prev => [newUp, ...prev]);
    setIsSubmitModalOpen(false);
    setSummary(""); setWorkCompleted(""); setChallenges(""); setNextSteps("");

    api.createWorkUpdate({
      project_id: "PW-1042",
      update_type: activeTab,
      date: newUp.date,
      summary: summary,
      work_completed: workCompleted,
      challenges: challenges,
      next_steps: nextSteps,
      evidence_ref: evidenceRef,
      effort_hours: parseFloat(hours) || 4.0,
      milestone_progress: 60
    });
  };

  const handleReview = (id, comment, status) => {
    setUpdates(prev => prev.map(u => u.id === id ? { ...u, status, reviewer_name: user?.name || "Dr. Meera Rao", reviewer_comment: comment } : u));
    api.reviewWorkUpdate(id, { comment, status });
  };

  const filtered = updates.filter(u => activeTab === "All" || u.update_type === activeTab);

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-400" />
            Hierarchical Research Work Updates
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Student Daily Updates → Mentor Weekly Reports → Expert Reviews → Sponsor Outputs
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRequestReplacement}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-all"
          >
            Request Replacement
          </button>
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Submit {activeTab} Update
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5">
        {["Daily", "Weekly", "Final"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              activeTab === tab
                ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab} Updates
          </button>
        ))}
      </div>

      {/* Updates List */}
      <div className="space-y-3">
        {filtered.map(up => (
          <div key={up.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-100">{up.author_name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {up.author_role} · {up.update_type}
                  </span>
                </div>
                <div className="text-xs text-zinc-300 font-medium">{up.summary}</div>
              </div>

              <div className="text-right shrink-0 font-mono text-[11px]">
                <div className="text-zinc-400">{up.date}</div>
                <div className="text-indigo-400 mt-0.5">{up.effort_hours}h effort</div>
              </div>
            </div>

            {/* Detailed sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-zinc-800/80">
              <div className="space-y-1 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Work Completed</div>
                <div className="text-zinc-300">{up.work_completed}</div>
              </div>
              <div className="space-y-1 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Next Steps & Challenges</div>
                <div className="text-zinc-300">{up.next_steps || "Proceed to temporal feature generation."}</div>
              </div>
            </div>

            {/* Evidence & Reviewer */}
            <div className="flex items-center justify-between text-xs pt-1 font-mono text-zinc-400">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-zinc-500" />
                <span>{up.evidence_ref}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] ${
                  up.status === 'Approved' || up.status === 'Reviewed'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {up.status}
                </span>
                {user?.role === 'expert' && up.status === 'Submitted' && (
                  <button
                    onClick={() => handleReview(up.id, "Reviewed & verified by domain mentor.", "Reviewed")}
                    className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-2 py-0.5 rounded"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 max-w-lg w-full p-6 rounded-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">Submit {activeTab} Research Update</h3>
              <button onClick={() => setIsSubmitModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">×</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Executive Summary *</label>
                <input
                  type="text"
                  required
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  placeholder="Key milestone or daily progress summary"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Work Completed *</label>
                <textarea
                  rows={2}
                  required
                  value={workCompleted}
                  onChange={e => setWorkCompleted(e.target.value)}
                  placeholder="Detail tasks, records validated, or code committed…"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Challenges</label>
                  <input
                    type="text"
                    value={challenges}
                    onChange={e => setChallenges(e.target.value)}
                    placeholder="e.g. Timestamp noise"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Effort Hours</label>
                  <input
                    type="number"
                    value={hours}
                    onChange={e => setHours(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Evidence Artifact Reference</label>
                <input
                  type="text"
                  value={evidenceRef}
                  onChange={e => setEvidenceRef(e.target.value)}
                  placeholder="Dataset Validation Report #a91f82c4"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
                >
                  Submit Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
