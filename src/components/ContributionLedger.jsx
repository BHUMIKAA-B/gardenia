import React, { useState, useEffect } from 'react';
import { GitCommit, Download, Search, Plus, FileText, CheckCircle2, Clock, User, X } from 'lucide-react';
import { api } from '../services/api';
import { SEED_LEDGER } from '../data/seedData';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';
import { useToast } from '../context/ToastContext';

export default function ContributionLedger({ onOpenProofModal }) {
  const { user, addNotification } = useAuth();
  const { pushEvent } = useActivity();
  const { addToast }  = useToast();
  const [ledgerEvents, setLedgerEvents] = useState(SEED_LEDGER);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Form state
  const [cTitle, setCTitle] = useState('');
  const [cDesc, setCDesc] = useState('');
  const [cType, setCType] = useState('Data Analysis');
  const [cEffort, setCEffort] = useState('12');
  const [cIsAI, setCIsAI] = useState(false);
  const [cEvidenceTitle, setCEvidenceTitle] = useState('');
  const [cEvidenceType, setCEvidenceType] = useState('Git Commit');
  const [cEvidenceRef, setCEvidenceRef] = useState('github.com/aquanova/pw-1042/commit/a91f82c');

  useEffect(() => {
    api.getLedger("PW-1042").then(data => {
      if (data && data.length > 0) {
        setLedgerEvents(data);
      }
    });
  }, []);

  const handleSubmitContribution = (e) => {
    e.preventDefault();
    const contribData = {
      title: cTitle,
      description: cDesc,
      contribution_type: cType,
      project_id: "PW-1042",
      milestone_id: "PW-1042-M1",
      effort_hours: parseFloat(cEffort) || 10.0,
      is_ai_assisted: cIsAI,
      ai_agent_id: cIsAI ? "AI-101" : null,
      evidence_title: cEvidenceTitle || "Dataset Validation Report",
      evidence_type: cEvidenceType,
      evidence_ref: cEvidenceRef
    };

    api.createContribution(contribData).then(res => {
      const newLog = {
        id: res?.id || `LOG-${1000 + ledgerEvents.length + 1}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
        contributor: user?.name || 'Bhumikaa B',
        role: user?.role || 'Student',
        action: cTitle,
        projectId: 'PW-1042',
        evidence: `${cEvidenceTitle || 'Attachment'} • Commit #a91f82c`,
        type: cIsAI ? 'AI Assistant' : 'Human',
        validator: 'Pending Validation (Dr. Meera Rao)',
        credit: '15%',
        payoutShare: 'In Escrow',
        status: 'Submitted',
        hash: 'a91f82c4'
      };

      setLedgerEvents(prev => [newLog, ...prev]);
      setIsSubmitModalOpen(false);
      setCTitle(''); setCDesc('');

      pushEvent({ type: 'upload', icon: '📊', actor: user?.name || 'Bhumikaa B', action: `submitted contribution: ${cTitle}`, project: 'PW-1042', color: 'blue' });
      addToast({ type: 'success', title: 'Contribution Submitted', message: `"${cTitle}" logged to audit trail.` });
      addNotification({ title: 'Contribution Submitted', message: `Contribution '${cTitle}' logged to audit trail.` });
    });
  };

  const filteredEvents = ledgerEvents.filter(e => {
    const matchesSearch = e.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.contributor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.evidence.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || e.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-zinc-400" />
            Contribution Ledger
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">Tamper-evident record of actions, validated evidence, and credit allocation</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={api.getExportLedgerUrl('PW-1042')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </a>
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Submit Contribution
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search contributor, action, hash…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 placeholder:text-zinc-500"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {['All', 'Human', 'AI Assistant', 'Governance', 'Security Alert'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all ${
                filterType === t
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Event List */}
      <div className="space-y-2">
        {filteredEvents.map(event => (
          <button
            key={event.id}
            onClick={() => onOpenProofModal && onOpenProofModal(event)}
            className="w-full text-left p-4 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                    {event.action}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    event.status === 'Verified' || event.status === 'Validated'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : event.status === 'Locked'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {event.status}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                  <FileText className="w-3 h-3 text-zinc-500 shrink-0" />
                  <span className="truncate">{event.evidence}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
                  <span className="font-medium text-zinc-300">{event.contributor}</span>
                  <span className="text-zinc-500">·</span>
                  <span>{event.role}</span>
                  <span className="text-zinc-500">·</span>
                  <span>Validated by <span className="text-emerald-400">{event.validator}</span></span>
                  <span className="text-zinc-500">·</span>
                  <span className="font-mono text-zinc-400">{event.timestamp}</span>
                </div>
              </div>

              <div className="text-right shrink-0 space-y-1 font-mono">
                {event.credit !== 'N/A' && (
                  <div className="text-sm font-semibold text-amber-400">{event.credit}</div>
                )}
                {event.payoutShare !== 'N/A' && (
                  <div className="text-[11px] text-emerald-400">{event.payoutShare}</div>
                )}
                <div className="text-[10px] text-zinc-400">{event.hash}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Submit Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 max-w-lg w-full p-6 rounded-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">Submit Contribution Evidence</h3>
              <button onClick={() => setIsSubmitModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitContribution} className="space-y-3">
              {[
                { label: 'Contribution Title', value: cTitle, setter: setCTitle, placeholder: 'e.g., Validated 12,400 water-quality records' },
                { label: 'Evidence Title',     value: cEvidenceTitle, setter: setCEvidenceTitle, placeholder: 'e.g., Dataset Validation Report' },
                { label: 'Evidence Ref / Git Commit', value: cEvidenceRef, setter: setCEvidenceRef, placeholder: 'github.com/org/repo/commit/abc' },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">{f.label} *</label>
                  <input
                    type="text"
                    required
                    value={f.value}
                    onChange={e => f.setter(e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Type</label>
                  <select
                    value={cType}
                    onChange={e => setCType(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                  >
                    <option value="Data Analysis">Data Analysis & Cleaning</option>
                    <option value="Code">ML Model Code</option>
                    <option value="Literature Review">Literature Review</option>
                    <option value="Experiment">Field Experiment</option>
                    <option value="Mentoring">Mentoring & Review</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Effort Hours</label>
                  <input
                    type="number"
                    value={cEffort}
                    onChange={e => setCEffort(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Work Description *</label>
                <textarea
                  rows={2}
                  required
                  value={cDesc}
                  onChange={e => setCDesc(e.target.value)}
                  placeholder="Describe methodology or validation metrics…"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 resize-none"
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
                  Submit & Log Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
