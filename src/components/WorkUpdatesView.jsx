import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Plus, FileText, Clock, User, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

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
    reviewer_name: "AquaNova Research Board",
    reviewer_comment: "Milestone 1 Verified & Escrow Released."
  }
];

export default function WorkUpdatesView({ onRequestReplacement }) {
  const { user } = useAuth();
  const { addToast } = useToast();
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
      if (data && Array.isArray(data) && data.length > 0) setUpdates(data);
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
    addToast({ title: `${activeTab} Update Submitted ✓`, message: 'Your research work update has been logged and notified to reviewers.' });
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
    addToast({ title: 'Update Reviewed ✓', message: `Work update ${id} marked as ${status}.` });
    api.reviewWorkUpdate(id, { comment, status });
  };

  const filtered = updates.filter(u => activeTab === "All" || u.update_type === activeTab);

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Calendar className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            Hierarchical Research Work Updates
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Student Daily Updates → Mentor Weekly Reports → Expert Reviews → Sponsor Outputs
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRequestReplacement}
            className="btn btn-secondary btn-sm text-amber-500"
          >
            Request Replacement
          </button>
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="btn btn-primary btn-sm"
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
            className={`filter-pill${activeTab === tab ? ' active' : ''}`}
          >
            {tab} Updates
          </button>
        ))}
      </div>

      {/* Updates List */}
      <div className="space-y-3">
        {filtered.map(up => (
          <div key={up.id} className="panel p-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{up.author_name}</span>
                  <span className="badge badge-gray font-mono text-[10px]">
                    {up.author_role} · {up.update_type}
                  </span>
                </div>
                <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{up.summary}</div>
              </div>

              <div className="text-right shrink-0 font-mono text-[11px]">
                <div style={{ color: 'var(--text-muted)' }}>{up.date}</div>
                <div className="text-indigo-500 mt-0.5">{up.effort_hours}h effort</div>
              </div>
            </div>

            {/* Detailed sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t" style={{ borderColor: 'var(--bg-border)' }}>
              <div className="space-y-1 p-2.5 rounded-lg border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--bg-border)' }}>
                <div className="text-[10px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>Work Completed</div>
                <div style={{ color: 'var(--text-secondary)' }}>{up.work_completed}</div>
              </div>
              <div className="space-y-1 p-2.5 rounded-lg border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--bg-border)' }}>
                <div className="text-[10px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>Next Steps & Challenges</div>
                <div style={{ color: 'var(--text-secondary)' }}>{up.next_steps || "Proceed to temporal feature generation."}</div>
              </div>
            </div>

            {/* Evidence & Reviewer */}
            <div className="flex items-center justify-between text-xs pt-1 font-mono" style={{ color: 'var(--text-muted)' }}>
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>{up.evidence_ref}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${up.status === 'Approved' || up.status === 'Reviewed' ? 'badge-green' : 'badge-amber'}`}>
                  {up.status}
                </span>
                {up.status === 'Submitted' && (
                  <button
                    onClick={() => handleReview(up.id, "Reviewed & verified by domain mentor.", "Reviewed")}
                    className="btn btn-secondary btn-sm"
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
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Submit {activeTab} Research Update</h3>
              <button onClick={() => setIsSubmitModalOpen(false)} style={{ color: 'var(--text-muted)' }}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body space-y-3">
              <div>
                <label className="form-label">Executive Summary *</label>
                <input
                  type="text"
                  required
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  placeholder="Key milestone or daily progress summary"
                  className="input"
                />
              </div>

              <div>
                <label className="form-label">Work Completed *</label>
                <textarea
                  rows={2}
                  required
                  value={workCompleted}
                  onChange={e => setWorkCompleted(e.target.value)}
                  placeholder="Detail tasks, records validated, or code committed…"
                  className="textarea"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Challenges</label>
                  <input
                    type="text"
                    value={challenges}
                    onChange={e => setChallenges(e.target.value)}
                    placeholder="e.g. Timestamp noise"
                    className="input"
                  />
                </div>
                <div>
                  <label className="form-label">Effort Hours</label>
                  <input
                    type="number"
                    value={hours}
                    onChange={e => setHours(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Evidence Artifact Reference</label>
                <input
                  type="text"
                  value={evidenceRef}
                  onChange={e => setEvidenceRef(e.target.value)}
                  placeholder="Dataset Validation Report #a91f82c4"
                  className="input"
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
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
