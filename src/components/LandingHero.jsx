import React, { useEffect, useState } from 'react';
import {
  ArrowRight, Search, Lock, FileCheck2, ShieldCheck, Award,
  Sparkles, Presentation, Play, Zap, ChevronRight, Activity
} from 'lucide-react';
import LiveActivityPanel from './LiveActivityPanel';
import { useAuth } from '../context/AuthContext';

/* ─── Proof flow nodes ─── */
const PROOF_NODES = [
  { icon: '🔬', label: 'Research Problem',  color: '#60a5fa', desc: 'AquaNova posts water-quality challenge' },
  { icon: '🤝', label: 'Verified Match',    color: '#818cf8', desc: '92% fit — Bhumikaa B matched' },
  { icon: '🔒', label: 'Charter Locked',    color: '#22d3ee', desc: 'All 4 parties signed digitally' },
  { icon: '📊', label: 'Contribution',      color: '#f97316', desc: '12,400 records cleaned & committed' },
  { icon: '🔍', label: 'Evidence',          color: '#10b981', desc: 'Report hashed, timestamped' },
  { icon: '✅', label: 'Validation',        color: '#14b8a6', desc: 'Dr. Meera Rao signed off' },
  { icon: '🏆', label: 'Credit & Reward',   color: '#f59e0b', desc: '18% share · ₹18,000 released' },
];

/* ─── Problem cards ─── */
const PROBLEMS = [
  { icon: '📄', title: 'Evidence Gap', desc: 'Self-reported contributions have no inspectable proof trail or verifiable audit history.', color: '#f87171' },
  { icon: '🏷️', title: 'Attribution Gap', desc: 'Credit disputes arise mid-project when AI blurs the line between human and machine work.', color: '#fbbf24' },
  { icon: '🔗', title: 'Trust Gap', desc: 'Sponsors cannot verify what research actually happened or whether claims are legitimate.', color: '#a78bfa' },
];

/* ─── Journey steps ─── */
const JOURNEY = [
  { n: '01', label: 'Problem',    color: '#60a5fa', icon: Search     },
  { n: '02', label: 'Match',      color: '#818cf8', icon: Sparkles   },
  { n: '03', label: 'Charter',    color: '#22d3ee', icon: Lock       },
  { n: '04', label: 'Evidence',   color: '#f97316', icon: FileCheck2 },
  { n: '05', label: 'Validate',   color: '#10b981', icon: ShieldCheck},
  { n: '06', label: 'Passport',   color: '#f59e0b', icon: Award      },
];

/* ─── Stats strip ─── */
const STATS = [
  { val: '12,400+', label: 'Records Validated',   color: '#22d3ee' },
  { val: '92%',     label: 'Explainable Fit',      color: '#818cf8' },
  { val: '100%',    label: 'Human Attribution',    color: '#34d399' },
  { val: '₹1L',     label: 'Research Escrow',      color: '#fbbf24' },
];

export default function LandingHero({ onExplore, onSeeHowItWorks, onOpenPitchMode }) {
  const { user } = useAuth();
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setActive(s => (s + 1) % PROOF_NODES.length), 1800);
    return () => clearInterval(id);
  }, [running]);

  const step = PROOF_NODES[active];

  return (
    <div className="space-y-20">

      {/* ══════════════════════════════════════
          SECTION 1 — HERO
          ══════════════════════════════════════ */}
      <section
        className="relative overflow-hidden rounded-3xl border border-white/7 min-h-[520px] flex items-center"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.15) 0%, transparent 60%), linear-gradient(180deg, #0c1220 0%, #080e1a 100%)',
        }}
      >
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
        {/* Glow orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/12 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full px-8 sm:px-12 lg:px-16 py-16">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* ── Left: Text ── */}
            <div className="space-y-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/12 border border-indigo-500/20 text-indigo-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                Hackathon Prototype · Gardenia 2K26
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.02] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Research where every
                </h1>
                <h1 className="text-5xl sm:text-6xl font-black leading-[1.02] tracking-tight gradient-text" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  contribution has a proof.
                </h1>
              </div>

              <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                A trust layer for collaborative research — connecting problems to verified people, tamper-evident evidence, and transparent credit.
              </p>

              {/* Welcome chip */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 border border-white/8 text-sm">
                <img src={user?.avatar} alt="" className="w-6 h-6 rounded-lg" />
                <span className="text-slate-400">Welcome back,</span>
                <span className="text-white font-bold">{user?.name?.split(' ')[0]}</span>
                <span className="text-xs text-indigo-400 font-semibold capitalize bg-indigo-500/15 px-2 py-0.5 rounded-lg">
                  {user?.roleType}
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <button onClick={onExplore} className="btn-primary">
                  Explore Research <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={onSeeHowItWorks} className="btn-ghost">
                  View Proof Graph
                </button>
                <button
                  onClick={onOpenPitchMode}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: 'rgba(245,158,11,0.12)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    color: '#fbbf24',
                  }}
                >
                  <Presentation className="w-4 h-4" /> Pitch Mode
                </button>
              </div>
            </div>

            {/* ── Right: Animated Proof Flow ── */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span className="section-label">Trust Architecture — Live Flow</span>
                {!running && (
                  <button
                    onClick={() => setRunning(true)}
                    className="ml-auto flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    <Play className="w-3 h-3 fill-current" /> Resume
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                {PROOF_NODES.map((node, i) => {
                  const isActive = active === i;
                  const isPast   = active > i;
                  return (
                    <div key={i}>
                      <button
                        onClick={() => { setActive(i); setRunning(false); }}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left"
                        style={isActive ? {
                          background: `linear-gradient(135deg, ${node.color}14, ${node.color}06)`,
                          borderColor: `${node.color}35`,
                          boxShadow: `0 0 20px ${node.color}12`,
                        } : {
                          background: isPast ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.02)',
                          borderColor: 'rgba(255,255,255,0.06)',
                          opacity: isPast ? 0.55 : 0.85,
                        }}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 transition-all"
                          style={isActive ? {
                            background: `${node.color}20`,
                            border: `1px solid ${node.color}35`,
                          } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                        >
                          {isPast && !isActive ? '✓' : node.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm" style={{ color: isActive ? node.color : (isPast ? '#4b5563' : '#94a3b8') }}>
                            {node.label}
                          </div>
                          {isActive && (
                            <div className="text-[11px] mt-0.5" style={{ color: `${node.color}bb` }}>
                              {node.desc}
                            </div>
                          )}
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ background: node.color }} />
                        )}
                      </button>
                      {i < PROOF_NODES.length - 1 && (
                        <div className="flex justify-center py-0.5">
                          <div className="w-px h-2.5 transition-colors duration-300" style={{ background: active > i ? `${PROOF_NODES[i].color}35` : 'rgba(255,255,255,0.05)' }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — STATS STRIP
          ══════════════════════════════════════ */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div
            key={s.label}
            className="p-6 rounded-2xl text-center hover-lift"
            style={{ background: `${s.color}0a`, border: `1px solid ${s.color}18` }}
          >
            <div className="stat-value text-2xl" style={{ color: s.color }}>{s.val}</div>
            <div className="text-xs text-slate-500 mt-2 font-medium">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — THE PROBLEM
          ══════════════════════════════════════ */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Narrative */}
        <div className="space-y-5">
          <div className="section-label">Why ProofWeave Exists</div>
          <h2 className="text-3xl font-extrabold text-white leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            The research collaboration gap is a trust problem.
          </h2>
          <p className="text-slate-400 leading-relaxed text-[15px]">
            Research teams work hard. Sponsors invest. Mentors guide. But when it's time to assign credit or release funding, there's no tamper-evident trail — just claims.
          </p>
          <p className="text-slate-400 leading-relaxed text-[15px]">
            ProofWeave fills this gap with a cryptographically-anchored proof layer — every action, every validation, every payout traced back to its source.
          </p>
          <button onClick={onExplore} className="btn-ghost inline-flex">
            See How It Works <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Problem cards */}
        <div className="space-y-4">
          {PROBLEMS.map((p, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-5 rounded-2xl hover-lift transition-all"
              style={{ background: `${p.color}08`, border: `1px solid ${p.color}18` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ background: `${p.color}15`, border: `1px solid ${p.color}25` }}
              >
                {p.icon}
              </div>
              <div>
                <div className="font-bold text-sm mb-1" style={{ color: p.color }}>{p.title}</div>
                <p className="text-slate-400 text-[13px] leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 4 — HOW IT WORKS
          ══════════════════════════════════════ */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <div className="section-label">End-to-End Trust Pipeline</div>
          <h2 className="text-2xl font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            From research problem to verified passport
          </h2>
          <p className="text-slate-500 text-sm">Every step is recorded, verifiable, and immutable</p>
        </div>

        {/* Journey nodes — horizontal on desktop, vertical on mobile */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-0 overflow-x-auto pb-2">
          {JOURNEY.map((item, i) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-2 flex-1 min-w-[80px] text-center group hover-lift cursor-default">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
                    style={{ background: `${item.color}14`, border: `1px solid ${item.color}28` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div className="text-[9px] font-black tracking-widest uppercase" style={{ color: `${item.color}80` }}>{item.n}</div>
                  <div className="text-xs font-semibold text-slate-300">{item.label}</div>
                </div>
                {i < JOURNEY.length - 1 && (
                  <div className="hidden sm:block h-px flex-1 mx-2" style={{ background: `linear-gradient(90deg, ${item.color}40, ${JOURNEY[i+1].color}40)` }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 5 — LIVE ACTIVITY
          ══════════════════════════════════════ */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="section-label">Live Research Operations</div>
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Activity Feed
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <Activity className="w-3.5 h-3.5" />
            Live
          </div>
        </div>
        <LiveActivityPanel />
      </section>

      {/* ══════════════════════════════════════
          SECTION 6 — FINAL CTA
          ══════════════════════════════════════ */}
      <section
        className="relative overflow-hidden rounded-3xl border border-indigo-500/20 p-12 sm:p-16 text-center space-y-6"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(124,58,237,0.08), rgba(8,14,26,0.95))' }}
      >
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-32 bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="relative space-y-4">
          <div className="section-label text-indigo-400">The ProofWeave Promise</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white max-w-2xl mx-auto leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            "Research should not only show the result.<br />It should show{' '}
            <span className="gradient-text">who made it possible.</span>"
          </h2>
          <p className="text-slate-400 max-w-md mx-auto text-[15px]">
            Every contribution backed by proof. Every reward backed by verification. Every career backed by evidence.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button onClick={onExplore} className="btn-primary">
              Explore Research <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={onOpenPitchMode} className="btn-ghost inline-flex">
              <Presentation className="w-4 h-4" /> Open Pitch Mode
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
