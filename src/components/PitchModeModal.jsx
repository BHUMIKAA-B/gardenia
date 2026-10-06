import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Presentation, Search, GitGraph, Bot, Award, LayoutDashboard } from 'lucide-react';

const SLIDES = [
  {
    id: 'problem',
    title: 'The Problem',
    content: [
      'Self-reported CVs have zero inspectable evidence',
      'AI contributions blur across project boundaries',
      'Credit disputes happen mid-project with no audit trail',
      'Sponsors have no visibility into who actually did what',
    ],
  },
  {
    id: 'solution',
    title: 'The Verixa Solution',
    content: [
      'Every research action is scoped, logged, and timestamped',
      'Every AI contribution has a named human owner',
      'Every reward is traceable to verified evidence',
      'Every contributor earns a tamper-evident Research Passport',
    ],
  },
  {
    id: 'flow',
    title: 'Trust Architecture Flow',
    content: [
      '1. Sponsor posts Research Problem',
      '2. Explainable Fit Matching (92% score)',
      '3. Project Charter locked with digital signatures',
      '4. Contributions with Git commits & datasets as evidence',
      '5. Expert mentor validation',
      '6. Transparent credit + Research Passport credential',
    ],
  },
  {
    id: 'ai',
    title: 'AI Governance',
    content: [
      'AI agents are scoped strictly to assigned projects',
      'Cross-project access is blocked & logged immediately',
      'AI = tool, Human = owner — always attributed correctly',
      'Live Scope Sentinel enforcement demo available',
    ],
  },
  {
    id: 'demo',
    title: 'Live Demo Workspaces',
    tabs: [
      { label: 'Research Discovery', tab: 'discover', icon: Search     },
      { label: 'Proof Graph',        tab: 'proof',    icon: GitGraph    },
      { label: 'AI Control Room',    tab: 'ai',       icon: Bot         },
      { label: 'Research Passport',  tab: 'passport', icon: Award       },
      { label: 'Sponsor Dashboard',  tab: 'sponsor',  icon: LayoutDashboard },
    ],
  },
];

export default function PitchModeModal({ isOpen, onClose, onNavigateTab }) {
  const [slide, setSlide] = useState(0);
  if (!isOpen) return null;

  const current = SLIDES[slide];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-xl w-full p-6 space-y-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Presentation className="w-4 h-4 text-zinc-400" />
            <h3 className="text-sm font-semibold text-zinc-100">Pitch Presentation</h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex items-center gap-1.5 justify-center">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSlide(i)}
              className={`h-1 rounded-full transition-all ${
                i === slide ? 'w-6 bg-indigo-500' : 'w-2 bg-zinc-800 hover:bg-zinc-700'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-100">{current.title}</h2>

          {current.content && (
            <div className="space-y-2">
              {current.content.map((line, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                  <span className="font-mono text-zinc-500 text-[11px] shrink-0 mt-0.5">0{i + 1}</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          )}

          {current.tabs && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {current.tabs.map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.tab}
                    onClick={() => { onNavigateTab(t.tab); onClose(); }}
                    className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all text-left space-y-1"
                  >
                    <Icon className="w-4 h-4 text-indigo-400" />
                    <div className="text-xs font-medium text-zinc-200">{t.label}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <button
            onClick={() => setSlide(s => Math.max(0, s - 1))}
            disabled={slide === 0}
            className="px-3 py-1.5 rounded-lg border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 disabled:opacity-30"
          >
            Previous
          </button>
          <span className="text-[11px] font-mono text-zinc-500">{slide + 1} / {SLIDES.length}</span>
          {slide < SLIDES.length - 1 ? (
            <button
              onClick={() => setSlide(s => s + 1)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
            >
              Start Demo Workspace
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
