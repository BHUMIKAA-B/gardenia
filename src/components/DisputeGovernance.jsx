import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const DISPUTES = [
  {
    id: 'PW-D102',
    title: 'Contribution Attribution Dispute',
    project: 'PW-1042',
    filed: 'Oct 4, 2026',
    filer: 'Bhumikaa B',
    against: 'AI Agent (Lit Scout)',
    status: 'under_review',
    priority: 'medium',
    summary: 'AI agent credit attributed without explicit human owner confirmation. Evidence chain incomplete.',
    timeline: [
      { date: 'Oct 4', event: 'Dispute filed by Bhumikaa B', status: 'done' },
      { date: 'Oct 5', event: 'Evidence submitted', status: 'done' },
      { date: 'Oct 6', event: 'Under review by governance committee', status: 'current' },
      { date: 'TBD',   event: 'Decision issued', status: 'pending' },
    ],
    evidence: [
      { label: 'Git commit reference', value: 'git:a3f94bc' },
      { label: 'AI log entry', value: 'agent-log-2026-10-01' },
      { label: 'Charter clause', value: 'Section 4.2 — AI Attribution' },
    ],
  },
  {
    id: 'PW-D098',
    title: 'Credit Share Discrepancy',
    project: 'PW-0934',
    filed: 'Sep 28, 2026',
    filer: 'Aarav Patel',
    against: 'Project Admin',
    status: 'resolved',
    priority: 'low',
    summary: 'Resolved: Credit share adjusted from 15% to 18% based on validated contribution evidence.',
    timeline: [
      { date: 'Sep 28', event: 'Dispute filed', status: 'done' },
      { date: 'Oct 1',  event: 'Evidence reviewed', status: 'done' },
      { date: 'Oct 2',  event: 'Resolved — credit adjusted to 18%', status: 'done' },
    ],
    evidence: [],
  },
];

export default function DisputeGovernance() {
  const [cases, setCases] = useState(DISPUTES);
  const [selected, setSelected] = useState(DISPUTES[0]);
  const [decision, setDecision] = useState('');

  useEffect(() => {
    api.getDisputes?.().catch(() => {});
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Disputes</h1>
        <p className="page-subtitle">Review and resolve governance cases.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, height: 'calc(100vh - 260px)', minHeight: 500 }}>

        {/* Left: case list */}
        <div style={{ border: '1px solid var(--bg-border)', borderRadius: 'var(--r-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--bg-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Cases ({cases.length})</span>
            <button className="btn btn-primary btn-sm">New Case</button>
          </div>
          <div style={{ overflow: 'y-auto', flex: 1 }}>
            {cases.map(c => (
              <div
                key={c.id}
                onClick={() => setSelected(c)}
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--bg-border)',
                  cursor: 'pointer',
                  background: selected?.id === c.id ? 'var(--accent-subtle)' : 'transparent',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (selected?.id !== c.id) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                onMouseLeave={e => { if (selected?.id !== c.id) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{c.id}</span>
                  <span className={`badge ${c.status === 'resolved' ? 'badge-green' : c.status === 'under_review' ? 'badge-amber' : 'badge-gray'}`}>
                    {c.status === 'under_review' ? 'Review' : c.status === 'resolved' ? 'Resolved' : c.status}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: selected?.id === c.id ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.3 }}>{c.title}</p>
                <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 3 }}>{c.project} · {c.filed}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: case detail */}
        {selected ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--bg-border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--bg-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{selected.id}</span>
                <span className={`badge ${selected.status === 'resolved' ? 'badge-green' : 'badge-amber'}`}>
                  {selected.status === 'under_review' ? 'Under Review' : selected.status === 'resolved' ? 'Resolved' : selected.status}
                </span>
                <span className={`badge badge-gray`}>{selected.priority} priority</span>
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 8 }}>{selected.title}</h2>
              <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--text-muted)' }}>
                <span>Filed by <strong style={{ color: 'var(--text-secondary)' }}>{selected.filer}</strong></span>
                <span>Against <strong style={{ color: 'var(--text-secondary)' }}>{selected.against}</strong></span>
                <span>{selected.filed}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'auto' }}>
              {/* Summary + Evidence */}
              <div style={{ padding: '20px 24px', borderRight: '1px solid var(--bg-border)' }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 12 }}>Summary</p>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>{selected.summary}</p>

                {selected.evidence.length > 0 && (
                  <>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 12 }}>Evidence</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {selected.evidence.map(ev => (
                        <div key={ev.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--bg-border)' }}>
                          <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{ev.label}</span>
                          <span style={{ fontFamily: 'monospace', fontSize: 11.5, color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--bg-border)' }}>{ev.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Timeline + Decision */}
              <div style={{ padding: '20px 24px' }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 16 }}>Timeline</p>
                <div>
                  {selected.timeline.map((t, i) => (
                    <div key={i} className="timeline-item">
                      <div
                        className="timeline-dot"
                        style={{
                          borderColor: t.status === 'done' ? 'var(--green)' : t.status === 'current' ? 'var(--accent)' : 'var(--bg-border)',
                          background: t.status === 'done' ? 'rgba(34,197,94,0.15)' : t.status === 'current' ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
                        }}
                      />
                      <div>
                        <p style={{ fontSize: 13.5, color: t.status === 'pending' ? 'var(--text-muted)' : 'var(--text-primary)', fontWeight: t.status === 'current' ? 500 : 400 }}>
                          {t.event}
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{t.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {selected.status !== 'resolved' && (
                  <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--bg-border)' }}>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 12 }}>Issue Decision</p>
                    <textarea
                      className="textarea"
                      placeholder="Enter decision rationale…"
                      value={decision}
                      onChange={e => setDecision(e.target.value)}
                      style={{ marginBottom: 10 }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-primary btn-sm" disabled={!decision}>Resolve Case</button>
                      <button className="btn btn-secondary btn-sm">Request More Evidence</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>Select a case to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
