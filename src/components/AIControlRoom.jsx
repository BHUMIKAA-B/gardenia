import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const POLICY = {
  allowed: ['Research papers within PW-1042', 'Project literature summaries', 'Dataset metadata'],
  restricted: ['Other project data', 'Private sponsor files', 'Cross-project access', 'Confidential records'],
};

const TIMELINE = [
  { step: 'Request received',   detail: 'Summarise PDFs for PW-1042' },
  { step: 'Policy check',       detail: 'Scope: PW-1042 ✓' },
  { step: 'Human owner check',  detail: 'Owner: Aarav Patel ✓' },
  { step: 'Scope enforcement',  detail: 'Cross-project blocked ✗' },
  { step: 'Execute / Deny',     detail: 'Within scope: execute' },
];

export default function AIControlRoom({ onTriggerDeniedAccess }) {
  const [agents, setAgents] = useState([]);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const { addNotification } = useAuth?.() || {};

  useEffect(() => {
    api.getAIAgents?.('PW-1042').catch(() => {});
  }, []);

  const handleTest = () => {
    setTesting(true);
    setTimeout(() => {
      const result = { allowed: false, reason: 'Cross-project scope boundary violation. Agent is restricted to PW-1042 only.' };
      setTestResult(result);
      setTesting(false);
      onTriggerDeniedAccess?.({ agentName: 'Literature Scout', reason: result.reason, action: 'Access BioHelix Genomic Data — PW-1088' });
      addNotification?.({ title: 'Access Denied', message: 'Literature Scout blocked from cross-project access. Logged to audit ledger.' });
    }, 1200);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">AI Control</h1>
        <p className="page-subtitle">Govern AI agent scope, permissions, and audit activity.</p>
      </div>

      {/* Agent header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 20, borderBottom: '1px solid var(--bg-border)', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cyan)', animation: 'pulse-dot 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 11.5, color: 'var(--cyan)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active Agent</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Literature Scout</h2>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 4 }}>
              AI research assistant · Owner: <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Aarav Patel</strong> · Project: PW-1042
            </p>
          </div>
          <span className="badge badge-cyan">Scoped & Active</span>
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>

          {/* Left: Permission policy */}
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 16 }}>
              Permission Policy
            </p>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12.5, color: 'var(--green)', fontWeight: 500, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>✓</span> Allowed
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {POLICY.allowed.map(item => (
                  <div key={item} style={{ fontSize: 13.5, color: 'var(--text-secondary)', paddingLeft: 16, borderLeft: '2px solid rgba(34,197,94,0.25)' }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p style={{ fontSize: 12.5, color: 'var(--red)', fontWeight: 500, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>✗</span> Restricted
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {POLICY.restricted.map(item => (
                  <div key={item} style={{ fontSize: 13.5, color: 'var(--text-secondary)', paddingLeft: 16, borderLeft: '2px solid rgba(239,68,68,0.25)' }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Action timeline */}
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 16 }}>
              Request Pipeline
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {TIMELINE.map((t, i) => (
                <div key={i} className="timeline-item">
                  <div className={`timeline-dot ${i < 4 ? 'timeline-dot-active' : ''}`}
                    style={i < 4 ? { borderColor: 'var(--accent)', background: 'var(--accent-subtle)' } : {}}
                  />
                  <div>
                    <p style={{ fontSize: 13.5, color: 'var(--text-primary)', fontWeight: 500 }}>{t.step}</p>
                    <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{t.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Test button */}
            <div style={{ marginTop: 24 }}>
              <button
                className={`btn ${testing ? 'btn-secondary' : 'btn-primary'}`}
                onClick={handleTest}
                disabled={testing}
              >
                {testing ? 'Running test…' : 'Test Restricted Access'}
              </button>

              {testResult && (
                <div style={{
                  marginTop: 14,
                  padding: '12px 16px',
                  background: testResult.allowed ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
                  border: `1px solid ${testResult.allowed ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                  borderRadius: 'var(--r-md)',
                  animation: 'fadeIn 0.2s ease-out',
                }}>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: testResult.allowed ? 'var(--green)' : 'var(--red)', marginBottom: 4 }}>
                    {testResult.allowed ? '✓ Access Granted' : '✗ Access Denied'}
                  </p>
                  <p style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{testResult.reason}</p>
                  <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 6 }}>Event recorded in audit ledger.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Audit principle */}
      <div style={{ paddingTop: 24, borderTop: '1px solid var(--bg-border)' }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 12 }}>Governing Principle</p>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 560 }}>
          AI agents in ProofWeave operate under the principle: <em style={{ color: 'var(--text-primary)' }}>AI can assist, but AI cannot own.</em> Every AI action is attributed to a named human owner. Cross-project access is blocked and logged immediately.
        </p>
      </div>
    </div>
  );
}
