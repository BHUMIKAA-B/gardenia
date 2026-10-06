import React from 'react';
import { DollarSign, ShieldCheck, CheckCircle2 } from 'lucide-react';

const REWARD_CHAIN = [
  {
    id: 'RC-001',
    contributor:    'Bhumikaa B',
    contribution:   'Dataset Validation — 12,400 records cleaned',
    evidenceLabel:  'Dataset Validation Report · SHA: a91f82c4',
    validator:      'Dr. Meera Rao',
    credit:         '18%',
    reward:         '₹18,000',
    milestone:      'M1 — Data Pipeline',
    status:         'Released',
    date:           'Oct 5, 2026',
    proofHash:      'sha256::d4e3...7a1b',
  },
  {
    id: 'RC-002',
    contributor:    'Aarav Patel',
    contribution:   'Literature Scout AI — 34 paper summaries',
    evidenceLabel:  'AI Output Log · Human Owner: Aarav Patel',
    validator:      'Dr. Meera Rao',
    credit:         '12%',
    reward:         '₹12,000',
    milestone:      'M1 — Data Pipeline',
    status:         'Released',
    date:           'Oct 5, 2026',
    proofHash:      'sha256::f2c8...3d9a',
  },
  {
    id: 'RC-003',
    contributor:    'Dr. Meera Rao',
    contribution:   'Expert Validation Sign-off — Milestone 1',
    evidenceLabel:  'Mentor Validation Report · Signed digitally',
    validator:      'System Audit',
    credit:         '7%',
    reward:         '₹7,000',
    milestone:      'M1 — Data Pipeline',
    status:         'Released',
    date:           'Oct 5, 2026',
    proofHash:      'sha256::91ab...4fc2',
  },
  {
    id: 'RC-004',
    contributor:    'Aarav Patel',
    contribution:   'LSTM Model Architecture Design',
    evidenceLabel:  'Git commit · Model notebook · Benchmark logs',
    validator:      'Pending — Dr. Meera Rao',
    credit:         '22%',
    reward:         '₹22,000',
    milestone:      'M2 — Prediction Model',
    status:         'In Escrow',
    date:           'Oct 6, 2026',
    proofHash:      'sha256::b3e1...cc78',
  },
];

const SUMMARY_STATS = [
  { val: '37%',     label: 'Credit Attributed' },
  { val: '₹37,000', label: 'Escrow Released' },
  { val: '₹22,000', label: 'Pending Escrow' },
  { val: '4',       label: 'Verified Logs' },
];

export default function RewardModel() {
  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-zinc-400" />
          Rewards & Contribution Ledger
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">Automated distribution tied to verified proof-graph achievements</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SUMMARY_STATS.map(s => (
          <div key={s.label} className="p-3 rounded-xl border border-zinc-800 bg-zinc-900">
            <div className="text-sm font-mono font-semibold text-zinc-100">{s.val}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Reward Chain List */}
      <div className="space-y-2">
        {REWARD_CHAIN.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-zinc-800 bg-zinc-900 space-y-2"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-100">{item.contribution}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    item.status === 'Released'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-zinc-500 shrink-0" />
                  <span className="truncate">{item.evidenceLabel}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
                  <span className="text-zinc-300 font-medium">{item.contributor}</span>
                  <span className="text-zinc-500">·</span>
                  <span>Validated by <span className="text-emerald-400">{item.validator}</span></span>
                  <span className="text-zinc-500">·</span>
                  <span className="font-mono text-zinc-400">{item.date}</span>
                </div>
              </div>

              <div className="text-right shrink-0 font-mono space-y-0.5">
                <div className="text-xs font-semibold text-zinc-100">{item.reward}</div>
                <div className="text-[10px] text-indigo-400">{item.credit} credit</div>
                <div className="text-[10px] text-zinc-400">{item.proofHash}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
