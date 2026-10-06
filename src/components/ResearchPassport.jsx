import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EVIDENCE = [
  {
    id: 'E-001',
    title: 'Dataset Validation Pipeline',
    project: 'PW-1042',
    type: 'Code + Dataset',
    records: '12,400 records',
    validatedBy: 'Dr. Meera Rao',
    date: 'Sep 28, 2026',
    credit: '18%',
    reward: '₹18,000',
    status: 'verified',
    proof: 'git:a3f94bc',
  },
  {
    id: 'E-002',
    title: 'Literature Review Summary',
    project: 'PW-1042',
    type: 'Report',
    records: '47 papers reviewed',
    validatedBy: 'Dr. Meera Rao',
    date: 'Oct 1, 2026',
    credit: '12%',
    reward: '₹12,000',
    status: 'verified',
    proof: 'doc:d8e21f0',
  },
  {
    id: 'E-003',
    title: 'ML Feature Engineering',
    project: 'PW-1042',
    type: 'Notebook',
    records: '23 features',
    validatedBy: 'Pending',
    date: 'Oct 5, 2026',
    credit: '7%',
    reward: '₹7,000',
    status: 'pending',
    proof: 'git:c1b33d4',
  },
];

export default function ResearchPassport({ onOpenProofModal }) {
  const { user } = useAuth();
  const [passport, setPassport] = useState(null);

  useEffect(() => {
    api.getResearchPassport?.(user?.email).catch(() => {});
  }, [user]);

  const name = user?.name || 'Bhumikaa B';
  const role = user?.role || 'Student Researcher / Data Engineer';
  const avatar = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;

  return (
    <div>
      {/* Identity header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, paddingBottom: 32, borderBottom: '1px solid var(--bg-border)', marginBottom: 40 }}>
        <img
          src={avatar}
          alt={name}
          style={{ width: 56, height: 56, borderRadius: '50%', flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>{name}</h1>
            <span className="badge badge-green">Verified</span>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 6 }}>{role}</p>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Research Passport · Issued by ProofWeave · Gardenia 2K26</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button className="btn btn-secondary btn-sm">Export PDF</button>
          <button className="btn btn-secondary btn-sm">Share Link</button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 48 }}>
        {[
          { label: 'Verified Contributions', value: '4' },
          { label: 'Total Credit Share', value: '37%' },
          { label: 'Validated Records', value: '12,400' },
          { label: 'Milestones Completed', value: '2' },
        ].map(s => (
          <div key={s.label} className="stat">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Evidence timeline */}
      <div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 24 }}>
          Verified Contributions
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--bg-border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          {EVIDENCE.map((ev, i) => (
            <div
              key={ev.id}
              style={{
                padding: '20px 24px',
                borderBottom: i < EVIDENCE.length - 1 ? '1px solid var(--bg-border)' : 'none',
                cursor: 'pointer',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              onClick={() => onOpenProofModal?.({ ...ev, title: ev.title, category: 'Evidence', details: { owner: name, evidence: ev.proof, credit: ev.credit, validator: ev.validatedBy } })}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{ev.title}</p>
                    <span className={`badge ${ev.status === 'verified' ? 'badge-green' : ev.status === 'pending' ? 'badge-amber' : 'badge-gray'}`}>
                      {ev.status === 'verified' ? 'Verified' : ev.status === 'pending' ? 'Pending' : ev.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 24, fontSize: 12.5, color: 'var(--text-muted)' }}>
                    <span>{ev.project}</span>
                    <span>{ev.type}</span>
                    <span>{ev.records}</span>
                    <span>Validated by {ev.validatedBy}</span>
                    <span>{ev.date}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--amber)' }}>{ev.credit}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ev.reward}</p>
                </div>
              </div>

              {/* Proof reference */}
              <div style={{ marginTop: 10 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--bg-border)' }}>
                  {ev.proof}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
