import React, { useState, useEffect } from 'react';
import { Lock, CheckCircle2, FileEdit, ArrowRight, X, Clock, FileText, Users } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PARTICIPANTS = [
  { label: 'Student: Bhumikaa B',            role: 'Lead Data Engineer',  initials: 'BB' },
  { label: 'Student: Aarav Patel',            role: 'ML Developer',        initials: 'AP' },
  { label: 'Mentor: Dr. Meera Rao',           role: 'Domain Mentor',       initials: 'MR' },
  { label: 'Sponsor: AquaNova Research Labs', role: 'Project Sponsor',     initials: 'AN' },
];

const CHARTER_SECTIONS = [
  { num: '01', title: 'Problem Statement & Scope',
    text: 'Clean and validate 12,400 water-quality sensor telemetry records and train an LSTM neural network model forecasting 48-hour contamination spikes for AquaNova Research Labs.' },
  { num: '02', title: 'Data Access & Confidentiality',
    text: 'Controlled access restricted to PW-1042 workspace. Sensor data telemetry cannot be exported or accessed by external AI agents without explicit permission checks.' },
  { num: '03', title: 'Credit Attribution & Authorship',
    text: 'Co-authorship awarded to researchers with >15% verified contribution credit share on the Proof Graph backed by inspectable evidence and mentor approval.' },
  { num: '04', title: 'AI Governance Rules',
    text: 'Principle: "AI can assist, but AI cannot own." Every AI assistant must have a named human owner. AI output credit is attributed to the human owner team.' },
];

export default function ProjectCharter({ onProceedToGraph }) {
  const { currentUser, addNotification } = useAuth();
  const [charterLocked, setCharterLocked] = useState(true);
  const [acceptedList, setAcceptedList] = useState([
    'Student: Bhumikaa B', 'Student: Aarav Patel',
    'Mentor: Dr. Meera Rao', 'Sponsor: AquaNova Research Labs',
  ]);
  const [amendments, setAmendments] = useState([]);
  const [isAmendmentModalOpen, setIsAmendmentModalOpen] = useState(false);
  const [fieldChanged, setFieldChanged] = useState('Data Access Scope');
  const [oldVal, setOldVal] = useState('PW-1042 sensor files only');
  const [newVal, setNewVal] = useState('Include satellite precipitation logs');
  const [reason, setReason] = useState('Required to train LSTM model against rainfall spikes');

  useEffect(() => {
    api.getProjectDetail('PW-1042').then(data => {
      if (data?.charter) {
        setCharterLocked(data.charter.locked);
        if (data.charter.accepted_by) setAcceptedList(data.charter.accepted_by);
        if (data.charter.amendments) setAmendments(data.charter.amendments);
      }
    });
  }, []);

  const handleAcceptCharter = (participantLabel) => {
    api.acceptCharter('PW-1042', participantLabel).then(res => {
      if (res) {
        setCharterLocked(res.locked);
        setAcceptedList(res.accepted_by || [...acceptedList, participantLabel]);
        addNotification({ title: 'Charter Signed', message: `${participantLabel} has digitally signed the Project Charter.` });
      }
    });
  };

  const handleCreateAmendment = (e) => {
    e.preventDefault();
    api.createAmendment('PW-1042', { field_changed: fieldChanged, old_value: oldVal, new_value: newVal, reason }).then(res => {
      const amendment = res?.amendment ?? {
        id: Date.now(), requested_by: currentUser?.full_name || 'Participant',
        field_changed: fieldChanged, old_value: oldVal, new_value: newVal,
        reason, status: 'Pending', created_at: new Date().toISOString(),
      };
      setAmendments(prev => [amendment, ...prev]);
      setIsAmendmentModalOpen(false);
      addNotification({ title: 'Charter Amendment Requested', message: `Proposed change for '${fieldChanged}' submitted for review.` });
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-100">Project Charter Status</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Locked & Verified
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">All 4 parties have digitally signed. Amendments require multi-party consensus.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAmendmentModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all flex items-center gap-1.5"
          >
            <FileEdit className="w-3.5 h-3.5" /> Amend Terms
          </button>
          <button
            onClick={onProceedToGraph}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5"
          >
            View Proof Graph <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Signatures */}
      <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-semibold text-zinc-200">Signatory Ledger</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">{acceptedList.length}/4 Signed</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PARTICIPANTS.map((item, idx) => {
            const name = item.label.split(': ')[1] || item.label;
            const isAccepted = acceptedList.some(a => a.includes(name));
            return (
              <div
                key={idx}
                className="p-3 rounded-lg border border-zinc-800/80 bg-zinc-900/60 flex flex-col justify-between"
              >
                <div>
                  <div className="w-7 h-7 rounded bg-zinc-800 text-zinc-300 text-xs font-mono font-medium flex items-center justify-center mb-2 border border-zinc-700/50">
                    {item.initials}
                  </div>
                  <div className="text-xs font-medium text-zinc-200 truncate">{name}</div>
                  <div className="text-[10px] text-zinc-500 mb-2 truncate">{item.role}</div>
                </div>
                {isAccepted ? (
                  <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 mt-1">
                    <CheckCircle2 className="w-3 h-3 shrink-0" /> Signed
                  </div>
                ) : (
                  <button
                    onClick={() => handleAcceptCharter(item.label)}
                    className="w-full py-1 text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded transition-all mt-1"
                  >
                    Sign
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Charter Terms */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
          Charter Articles
        </div>
        <div className="space-y-2">
          {CHARTER_SECTIONS.map(sec => (
            <div
              key={sec.num}
              className="p-4 rounded-xl border border-zinc-800 bg-zinc-900 flex items-start gap-4"
            >
              <span className="text-xs font-mono text-zinc-500 shrink-0 mt-0.5">{sec.num}</span>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-zinc-200">{sec.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{sec.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Amendments */}
      {amendments.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            Amendment Log
          </div>
          <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-zinc-800 text-zinc-400 font-mono text-[10px]">
                <tr>
                  <th className="p-3">Field</th>
                  <th className="p-3">Previous</th>
                  <th className="p-3">Proposed</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {amendments.map(a => (
                  <tr key={a.id}>
                    <td className="p-3 font-medium text-zinc-200">{a.field_changed}</td>
                    <td className="p-3 text-zinc-500 font-mono line-through">{a.old_value}</td>
                    <td className="p-3 text-indigo-400 font-mono">{a.new_value}</td>
                    <td className="p-3 text-zinc-400">{a.reason}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Amendment modal */}
      {isAmendmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 max-w-md w-full p-6 rounded-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">Propose Charter Amendment</h3>
              <button onClick={() => setIsAmendmentModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateAmendment} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Field to Amend</label>
                <input
                  type="text"
                  required
                  value={fieldChanged}
                  onChange={e => setFieldChanged(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Current Value</label>
                <input
                  type="text"
                  required
                  value={oldVal}
                  onChange={e => setOldVal(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Proposed Value</label>
                <input
                  type="text"
                  required
                  value={newVal}
                  onChange={e => setNewVal(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Reason</label>
                <textarea
                  rows={2}
                  required
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAmendmentModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
                >
                  Submit Amendment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
