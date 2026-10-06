import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { ActivityProvider } from './context/ActivityContext';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Navbar';
import ResearchDiscovery from './components/ResearchDiscovery';
import ProofGraph from './components/ProofGraph';
import ContributionLedger from './components/ContributionLedger';
import AIControlRoom from './components/AIControlRoom';
import ResearchPassport from './components/ResearchPassport';
import SponsorDashboard from './components/SponsorDashboard';
import DisputeGovernance from './components/DisputeGovernance';
import RewardModel from './components/RewardModel';
import ProjectCharter from './components/ProjectCharter';
import PitchModeModal from './components/PitchModeModal';
import WhyPanelModal from './components/WhyPanelModal';
import ProofNodeModal from './components/ProofNodeModal';
import DeniedAccessModal from './components/DeniedAccessModal';

/* ── Workspace page: tabs for Team / Charter / Contributions ── */
const PROJECT_TABS = [
  { id: 'overview',       label: 'Overview'       },
  { id: 'charter',        label: 'Charter'        },
  { id: 'contributions',  label: 'Contributions'  },
];

function WorkspacePage({ onOpenProofModal }) {
  const [tab, setTab] = useState('overview');

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="badge badge-green">
                <span className="status-dot status-dot-green" />
                Active
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>PW-1042</span>
            </div>
            <h1 className="page-title">AI-Assisted Urban Water Quality Prediction</h1>
            <p className="page-subtitle">AquaNova Research Labs · 6 weeks · ₹1,00,000</p>
          </div>
          <span className="badge badge-indigo">🔒 Charter Locked</span>
        </div>

        {/* Tab bar */}
        <div className="tab-bar" style={{ marginTop: 24 }}>
          {PROJECT_TABS.map(t => (
            <button
              key={t.id}
              className={`tab-item${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div key={tab} className="page-enter">
        {tab === 'overview'      && <ProjectOverview />}
        {tab === 'charter'       && <ProjectCharter onProceedToGraph={() => {}} />}
        {tab === 'contributions' && <ContributionLedger onOpenProofModal={onOpenProofModal} />}
      </div>
    </div>
  );
}

function ProjectOverview() {
  const members = [
    { name: 'Bhumikaa B', role: 'Data Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bhumikaa' },
    { name: 'Aarav Patel', role: 'ML Developer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aarav' },
    { name: 'Dr. Meera Rao', role: 'Mentor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meera' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32 }}>
      {/* Left column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Objective */}
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 10 }}>Objective</p>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Clean and validate 12,400 water-quality sensor telemetry records and train an LSTM neural
            network model forecasting 48-hour contamination spikes for AquaNova Research Labs.
          </p>
        </div>

        {/* Milestone progress */}
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 12 }}>Milestones</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'M1 — Data Pipeline', pct: 100, status: 'Released' },
              { label: 'M2 — Prediction Model', pct: 55, status: 'In Progress' },
              { label: 'M3 — Final Report', pct: 0, status: 'Upcoming' },
            ].map(m => (
              <div key={m.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>{m.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.pct}%</span>
                    <span className={`badge ${m.status === 'Released' ? 'badge-green' : m.status === 'In Progress' ? 'badge-indigo' : 'badge-gray'}`}>
                      {m.status}
                    </span>
                  </div>
                </div>
                <div className="progress-track">
                  <div
                    className={`progress-fill${m.status === 'Released' ? ' progress-fill-green' : ''}`}
                    style={{ width: `${m.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent contribution */}
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 12 }}>Latest Contribution</p>
          <div className="panel-sm" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>LSTM Model Architecture Design</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>Aarav Patel · Oct 6, 2026</p>
              </div>
              <span className="badge badge-amber">Pending Validation</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 16 }}>
              <span>Evidence: Git commit · Model notebook</span>
              <span>22% credit share</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Team */}
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 12 }}>Team</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {members.map(m => (
              <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--bg-border)' }}>
                <img src={m.avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                <div>
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{m.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[
            { label: 'Total Contributions', value: '27' },
            { label: 'Verified Records', value: '12,400' },
            { label: 'Total Credit Attributed', value: '37%' },
            { label: 'Escrow Balance', value: '₹22,000' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--bg-border)', fontSize: 13 }}>
              <span style={{ color: 'var(--text-muted)' }}>{s.label}</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Home page (authenticated) ── */
function HomePage({ onNavigate }) {
  const { user } = useAuth();
  const greeting = user?.name?.split(' ')[0] || 'Researcher';

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Good morning, {greeting}</h1>
        <p className="page-subtitle">Here's what's happening with your research.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
        {[
          { label: 'Active Projects', value: '1', sub: 'PW-1042 in progress' },
          { label: 'Contributions', value: '27', sub: '12,400 records validated' },
          { label: 'Credit Share', value: '37%', sub: 'Across 3 milestones' },
        ].map(s => (
          <div key={s.label} className="stat">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 16 }}>Continue Working</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[
            { label: 'View my project', sub: 'AI-Assisted Urban Water Quality Prediction · PW-1042', tab: 'workspace' },
            { label: 'Proof Graph', sub: 'Inspect the contribution attribution network', tab: 'proof' },
            { label: 'AI Control', sub: 'Monitor Literature Scout agent scope', tab: 'ai' },
            { label: 'Research Passport', sub: 'Your verified research identity', tab: 'passport' },
          ].map(item => (
            <div
              key={item.tab}
              onClick={() => onNavigate(item.tab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: '1px solid var(--bg-border)',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.paddingLeft = '6px'}
              onMouseLeave={e => e.currentTarget.style.paddingLeft = '0'}
            >
              <div>
                <p style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{item.label}</p>
                <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{item.sub}</p>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: 18, userSelect: 'none' }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Toast renderer ─── */
function ToastRenderer() {
  const { toasts } = useToast?.() || { toasts: [] };
  if (!toasts?.length) return null;
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 100, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--bg-border)',
          borderRadius: 'var(--r-md)',
          padding: '12px 16px',
          maxWidth: 340,
          animation: 'fadeIn 0.2s ease-out',
          boxShadow: 'var(--shadow-md)',
        }}>
          <p style={{ fontSize: 13.5, color: 'var(--text-primary)', fontWeight: 500 }}>{t.title}</p>
          {t.message && <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 3 }}>{t.message}</p>}
        </div>
      ))}
    </div>
  );
}

/* ─── Main App Content ─── */
function MainAppContent() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [isPitchOpen, setIsPitchOpen] = useState(false);
  const [whyProject, setWhyProject] = useState(null);
  const [proofNode, setProofNode] = useState(null);
  const [deniedData, setDeniedData] = useState(null);

  if (!isAuthenticated) return <LoginPage />;

  const handleTab = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0 });
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':      return <HomePage onNavigate={handleTab} />;
      case 'discover':  return <ResearchDiscovery onSelectProject={() => handleTab('workspace')} onOpenWhyMatch={p => setWhyProject(p)} />;
      case 'workspace': return <WorkspacePage onOpenProofModal={n => setProofNode(n)} />;
      case 'proof':     return <ProofGraph onOpenProofModal={n => setProofNode(n)} />;
      case 'ai':        return <AIControlRoom onTriggerDeniedAccess={d => setDeniedData(d)} />;
      case 'passport':  return <ResearchPassport onOpenProofModal={a => setProofNode(a)} />;
      case 'sponsor':   return <SponsorDashboard />;
      case 'dispute':   return <DisputeGovernance />;
      case 'reward':    return <RewardModel />;
      default:          return null;
    }
  };

  const isGraph = activeTab === 'proof';

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={handleTab} onOpenPitchMode={() => setIsPitchOpen(true)} />

      <main className="main-content">
        {/* Global App Header Bar */}
        <header className="app-header">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span style={{ color: 'var(--text-secondary)' }}>ProofWeave Network</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </header>

        {isGraph ? (
          <div key="proof" className="page-enter">{renderPage()}</div>
        ) : (
          <div className="page-container">
            <div key={activeTab} className="page-enter">
              {renderPage()}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          borderTop: '1px solid var(--bg-border)',
          padding: '12px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-surface)',
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text-secondary)' }}>ProofWeave</strong> · Gardenia 2K26
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="status-dot status-dot-green" />
            Backend connected
          </span>
        </div>
      </main>

      {/* Modals */}
      <PitchModeModal isOpen={isPitchOpen} onClose={() => setIsPitchOpen(false)} onNavigateTab={handleTab} />
      <WhyPanelModal isOpen={!!whyProject} onClose={() => setWhyProject(null)} project={whyProject} />
      <ProofNodeModal isOpen={!!proofNode} onClose={() => setProofNode(null)} node={proofNode} />
      <DeniedAccessModal isOpen={!!deniedData} onClose={() => setDeniedData(null)} data={deniedData} />

      <ToastRenderer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ActivityProvider>
          <ToastProvider>
            <MainAppContent />
          </ToastProvider>
        </ActivityProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
