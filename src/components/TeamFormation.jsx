import React from 'react';
import { Users, CheckCircle2, Bot, HelpCircle } from 'lucide-react';

const TEAM_MEMBERS = [
  {
    name: 'Bhumikaa B',
    role: 'Lead Data Engineer',
    initials: 'BB',
    type: 'Student',
    status: 'Active',
    credit: '18%',
    skills: ['Python', 'Data Pipelines', 'Pandas', 'Time-Series'],
    contributions: 12,
    fitScore: 92,
  },
  {
    name: 'Aarav Patel',
    role: 'ML Developer',
    initials: 'AP',
    type: 'Student',
    status: 'Active',
    credit: '12%',
    skills: ['TensorFlow', 'LSTM', 'Python', 'Research'],
    contributions: 8,
    fitScore: 89,
  },
  {
    name: 'Dr. Meera Rao',
    role: 'Domain Mentor',
    initials: 'MR',
    type: 'Expert',
    status: 'Active',
    credit: '7%',
    skills: ['Environmental Science', 'Validation', 'Mentorship'],
    contributions: 7,
    fitScore: 95,
  },
  {
    name: 'Literature Scout',
    role: 'AI Research Agent',
    initials: 'AI',
    type: 'AI Agent',
    status: 'Scoped',
    credit: '—',
    skills: ['Paper Summarization', 'Literature Search'],
    contributions: 34,
    fitScore: null,
    humanOwner: 'Aarav Patel',
  },
];

export default function TeamFormation({ onProceedToCharter, onOpenWhyMatch }) {
  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-zinc-400" />
            Project Roster & Match Quality
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">Verified contributors and scoped AI autonomous agents</p>
        </div>
        <button
          onClick={onProceedToCharter}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
        >
          Review Project Charter →
        </button>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 gap-3">
        {TEAM_MEMBERS.map((member) => {
          const isAI = member.type === 'AI Agent';
          return (
            <div
              key={member.name}
              className="p-4 rounded-xl border border-zinc-800 bg-zinc-900 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg font-mono text-xs font-semibold flex items-center justify-center border ${
                    isAI
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      : 'bg-zinc-800 text-zinc-200 border-zinc-700'
                  }`}>
                    {member.initials}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
                      {member.name}
                      {member.fitScore && (
                        <button
                          onClick={() => onOpenWhyMatch && onOpenWhyMatch(member)}
                          className="text-[10px] font-mono text-indigo-400 hover:underline flex items-center gap-0.5"
                        >
                          ({member.fitScore}% Match)
                          <HelpCircle className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400">{member.role}</div>
                    {isAI && member.humanOwner && (
                      <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                        Human Owner: {member.humanOwner}
                      </div>
                    )}
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  isAI
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}>
                  {member.type}
                </span>
              </div>

              {/* Skills pills */}
              <div className="flex flex-wrap gap-1">
                {member.skills.map(skill => (
                  <span
                    key={skill}
                    className="text-[10px] px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Footer info */}
              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/60 font-mono">
                <span>{member.contributions} contributions</span>
                {!isAI && <span className="text-indigo-400">{member.credit} credit share</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
