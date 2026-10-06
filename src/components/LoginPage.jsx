import React, { useState } from 'react';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import { ArrowRight, ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState('');
  const [showDemoDropdown, setShowDemoDropdown] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (!result?.success) {
      setError('Invalid email or password.');
    }
    setLoading(false);
  };

  const handleDemoSelect = (cred) => {
    setSelectedDemo(cred.key);
    setShowDemoDropdown(false);
    setEmail(cred.email);
    setPassword(cred.password);
  };

  const handleDemoContinue = async () => {
    const cred = DEMO_CREDENTIALS.find(c => c.key === selectedDemo);
    if (!cred) return;
    setLoading(true);
    await login(cred.email, cred.password);
    setLoading(false);
  };

  const selectedCred = DEMO_CREDENTIALS.find(c => c.key === selectedDemo);
  const FLOW_STEPS = ['Problem', 'Contribution', 'Evidence', 'Validation', 'Credit'];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      position: 'relative',
    }}>
      {/* Top Right Theme Toggle */}
      <div style={{
        position: 'absolute',
        top: 24,
        right: 32,
        zIndex: 40,
      }}>
        <ThemeToggle />
      </div>

      {/* Left panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '64px 80px',
        borderRight: '1px solid var(--bg-border)',
        maxWidth: 620,
      }}>
        {/* Logo */}
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 64 }}>
          Proof<span style={{ color: 'var(--accent)' }}>Weave</span>
        </div>

        {/* Eyebrow */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 11.5,
          fontWeight: 500,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 24,
        }}>
          <span className="status-dot status-dot-green" style={{ animation: 'none', background: 'var(--accent)' }} />
          Gardenia 2K26
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 'clamp(32px, 4vw, 48px)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.1,
          letterSpacing: '-0.025em',
          marginBottom: 20,
        }}>
          Research where every<br />
          contribution has proof.
        </h1>

        <p style={{
          fontSize: 15,
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          maxWidth: 400,
          marginBottom: 48,
        }}>
          Connect sponsors, mentors, students, and autonomous AI agents in a verified research network.
        </p>

        {/* Proof flow line */}
        <div className="proof-flow" style={{ flexWrap: 'wrap', gap: '8px 0' }}>
          {FLOW_STEPS.map((step, idx) => (
            <React.Fragment key={step}>
              <div className="proof-node-sm">
                <div className="proof-node-dot" style={idx === 4 ? { background: 'var(--accent)', borderColor: 'var(--accent)' } : {}} />
                <span>{step}</span>
              </div>
              {idx < FLOW_STEPS.length - 1 && <div className="proof-connector" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right panel — login form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 40px',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Sign in</h2>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 4 }}>Enter your credentials or choose a demo role</p>
          </div>

          {error && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 'var(--r-sm)',
              background: 'var(--red-bg)',
              border: '1px solid var(--red-border)',
              color: 'var(--red)',
              fontSize: 13,
              marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@institution.edu"
                className="input"
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ justifyContent: 'center', width: '100%', padding: '10px 16px', marginTop: 8 }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
              <ArrowRight style={{ width: 15, height: 15 }} />
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0' }}>
            <div className="divider" style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>or quick demo</span>
            <div className="divider" style={{ flex: 1 }} />
          </div>

          {/* Demo role selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowDemoDropdown(!showDemoDropdown)}
                className="input"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <span style={{ color: selectedCred ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {selectedCred ? `${selectedCred.name} (${selectedCred.role})` : 'Select a demo persona…'}
                </span>
                <ChevronDown style={{ width: 15, height: 15, color: 'var(--text-muted)' }} />
              </button>

              {showDemoDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: 4,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--bg-border)',
                  borderRadius: 'var(--r-md)',
                  zIndex: 20,
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-md)',
                  animation: 'fadeIn 0.15s ease-out',
                }}>
                  {DEMO_CREDENTIALS.map(cred => (
                    <div
                      key={cred.key}
                      onClick={() => handleDemoSelect(cred)}
                      style={{
                        padding: '10px 14px',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--bg-border)',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <p style={{ fontSize: 13.5, color: 'var(--text-primary)', fontWeight: 500 }}>{cred.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{cred.role}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleDemoContinue}
              disabled={!selectedDemo || loading}
              className="btn btn-secondary"
              style={{ justifyContent: 'center', width: '100%', padding: '9px 16px', opacity: !selectedDemo ? 0.4 : 1 }}
            >
              {loading ? 'Entering…' : 'Continue as selected role'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
