import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const PROJECTS = [
  {
    id: 'PW-1042',
    title: 'AI-Assisted Urban Water Quality Prediction',
    progress: 55,
    contributors: 3,
    verifiedWork: '12,400 records validated',
    nextDecision: 'Approve Milestone 2 ($22,000 escrow)',
    status: 'active',
    milestone: 'M2 — Prediction Model',
  },
  {
    id: 'PW-0934',
    title: 'NLP-Driven Climate Policy Analysis',
    progress: 100,
    contributors: 4,
    verifiedWork: '8 research papers + 3 datasets',
    nextDecision: 'Final credit distribution',
    status: 'completed',
    milestone: 'M3 — Completed',
  },
];

export default function SponsorDashboard() {
  const [projects, setProjects] = useState(PROJECTS);

  useEffect(() => {
    api.getSponsorDashboard?.().catch(() => {});
  }, []);

  return (
    <div>
      <div className="page-header">
        <div style={{ marginBottom: 6 }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            AquaNova Research Labs
          </p>
        </div>
        <h1 className="page-title">Research Portfolio</h1>
        <p className="page-subtitle">Monitor active projects, verified contributions, and escrow decisions.</p>
      </div>

      {/* At-a-glance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 48 }}>
        {[
          { label: 'Active Projects',        value: '1' },
          { label: 'Verified Contributions', value: '27' },
          { label: 'Escrow Released',        value: '₹40,000' },
          { label: 'Pending Decision',       value: '₹22,000' },
        ].map(s => (
          <div key={s.label} className="stat">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Project table */}
      <div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 16 }}>
          Projects
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Progress</th>
                <th>Verified Work</th>
                <th>Next Decision</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id}>
                  <td>
                    <p style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 14 }}>{p.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{p.id} · {p.milestone}</p>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
                      <div className="progress-track" style={{ flex: 1 }}>
                        <div
                          className={`progress-fill${p.progress === 100 ? ' progress-fill-green' : ''}`}
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>{p.progress}%</span>
                    </div>
                  </td>
                  <td style={{ maxWidth: 200 }}>{p.verifiedWork}</td>
                  <td style={{ maxWidth: 200, color: 'var(--text-primary)', fontSize: 13 }}>
                    {p.nextDecision}
                  </td>
                  <td>
                    <span className={`badge ${p.status === 'active' ? 'badge-green' : 'badge-gray'}`}>
                      {p.status === 'active' && <span className="status-dot status-dot-green" />}
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision queue */}
      <div style={{ marginTop: 40 }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 16 }}>
          Pending Decisions
        </p>
        <div style={{ border: '1px solid var(--bg-border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          {[
            {
              id: 'DEC-01',
              type: 'Milestone Release',
              description: 'Release Milestone 2 escrow for AI-Assisted Urban Water Quality Prediction.',
              amount: '₹22,000',
              deadline: 'Oct 10, 2026',
            },
          ].map((d, i) => (
            <div key={d.id} style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <p style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>{d.type}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>{d.description}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Deadline: {d.deadline}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--amber)' }}>{d.amount}</span>
                <button className="btn btn-primary btn-sm">Approve Release</button>
                <button className="btn btn-secondary btn-sm">Review Evidence</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
