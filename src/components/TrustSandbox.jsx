import React, { useState } from 'react';
import { ShieldCheck, Play, Lock, Unlock } from 'lucide-react';

const PERMISSIONS_MATRIX = [
  { role: 'Student (Bhumikaa)',      project: 'PW-1042',      action: 'Read Project Dataset',       result: 'ALLOWED', reason: 'Accepted Project Charter & Scoped Member'  },
  { role: 'Student (Bhumikaa)',      project: 'PW-1042',      action: 'Read Sponsor Private File',  result: 'DENIED',  reason: 'Sponsor Private Encryption Scope'          },
  { role: 'AI Agent (Lit Scout)',    project: 'PW-1042',      action: 'Summarize Project PDFs',      result: 'ALLOWED', reason: 'Human Owner (Aarav Patel) Scoped Consent'  },
  { role: 'AI Agent (Lit Scout)',    project: 'PW-1088',      action: 'Read BioHelix Genomic Data', result: 'DENIED',  reason: 'Cross-Project Scope Boundary Violation'    },
  { role: 'Admin / Auditor',         project: 'All Projects', action: 'View Audit Ledger',          result: 'ALLOWED', reason: 'System Governance Audit Permission'         },
];

export default function TrustSandbox() {
  const [selectedRole,    setSelectedRole]    = useState('Student (Bhumikaa B)');
  const [selectedProject, setSelectedProject] = useState('PW-1042');
  const [selectedAction,  setSelectedAction]  = useState('Read Dataset');
  const [lastResult,      setLastResult]      = useState(null);

  const handleSimulate = () => {
    let allowed = true;
    let reason  = 'Permission granted under scoped charter role.';
    if (selectedRole.includes('AI') && selectedProject !== 'PW-1042') {
      allowed = false;
      reason  = 'ACCESS DENIED: Agent scope restricted to Project PW-1042.';
    } else if (selectedAction.includes('Private') && !selectedRole.includes('Sponsor')) {
      allowed = false;
      reason  = 'ACCESS DENIED: Sponsor private file requires executive decryption key.';
    }
    setLastResult({ role: selectedRole, project: selectedProject, action: selectedAction, allowed, reason });
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-zinc-400" />
          Access Control Simulator
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">Test policy rules, agent boundaries, and data access permissions</p>
      </div>

      {/* Simulator form */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-mono text-zinc-400 block mb-1">Actor Role</label>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
            >
              <option value="Student (Bhumikaa B)">Student (Bhumikaa B)</option>
              <option value="AI Agent (Literature Scout)">AI Agent (Literature Scout)</option>
              <option value="Sponsor (AquaNova)">Sponsor (AquaNova)</option>
              <option value="Admin Auditor">Admin Auditor</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-mono text-zinc-400 block mb-1">Target Project</label>
            <select
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
            >
              <option value="PW-1042">PW-1042 (Urban Water Quality)</option>
              <option value="PW-1088">PW-1088 (BioHelix Restricted)</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-mono text-zinc-400 block mb-1">Attempted Action</label>
            <select
              value={selectedAction}
              onChange={e => setSelectedAction(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
            >
              <option value="Read Project Dataset">Read Project Dataset</option>
              <option value="Summarize Literature">Summarize Literature</option>
              <option value="Access Sponsor Private Key">Access Sponsor Private Key</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSimulate}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          Test Access Request
        </button>

        {lastResult && (
          <div
            className={`p-3 rounded-lg border text-xs font-mono flex items-center justify-between ${
              lastResult.allowed
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-red-500/30 bg-red-500/10 text-red-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {lastResult.allowed ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>{lastResult.allowed ? 'PERMISSION GRANTED' : 'ACCESS DENIED'} — {lastResult.reason}</span>
            </div>
          </div>
        )}
      </div>

      {/* Preset matrix */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900 space-y-3">
        <div className="text-xs font-semibold text-zinc-200">System Policy Matrix</div>
        <div className="rounded-lg border border-zinc-800 overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="border-b border-zinc-800 text-zinc-400 font-mono text-[10px]">
              <tr>
                <th className="p-2.5">Role</th>
                <th className="p-2.5">Project</th>
                <th className="p-2.5">Action</th>
                <th className="p-2.5">Result</th>
                <th className="p-2.5">Reasoning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {PERMISSIONS_MATRIX.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-2.5 font-medium">{item.role}</td>
                  <td className="p-2.5 font-mono text-zinc-400">{item.project}</td>
                  <td className="p-2.5">{item.action}</td>
                  <td className="p-2.5 font-mono">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      item.result === 'ALLOWED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {item.result}
                    </span>
                  </td>
                  <td className="p-2.5 text-zinc-400 text-[11px]">{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
