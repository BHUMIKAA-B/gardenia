import React, { useState, useEffect } from 'react';
import { Play, Pause, ZoomIn, ZoomOut, RotateCcw, Search } from 'lucide-react';
import { api } from '../services/api';
import { PROOF_GRAPH_NODES } from '../data/seedData';

const NODE_COLORS = {
  Problem:      { border: '#6366f1', glow: 'rgba(99,102,241,0.3)'   },
  Governance:   { border: '#8b5cf6', glow: 'rgba(139,92,246,0.3)'   },
  Contribution: { border: '#f97316', glow: 'rgba(249,115,22,0.3)'   },
  'AI Action':  { border: '#06b6d4', glow: 'rgba(6,182,212,0.3)'    },
  Validation:   { border: '#22c55e', glow: 'rgba(34,197,94,0.3)'    },
  Reward:       { border: '#f59e0b', glow: 'rgba(245,158,11,0.3)'   },
  Person:       { border: '#94a3b8', glow: 'rgba(148,163,184,0.3)'  },
  Evidence:     { border: '#22d3ee', glow: 'rgba(34,211,238,0.3)'   },
};

const GRAPH_LAYOUT = [
  { id: 'node-problem',          x: 42, y:  4  },
  { id: 'node-charter',          x: 42, y: 18  },
  { id: 'node-student-bhumikaa', x: 16, y: 35  },
  { id: 'node-ai-lit',           x: 68, y: 35  },
  { id: 'node-expert-meera',     x: 16, y: 57  },
  { id: 'node-aarav-model',      x: 68, y: 57  },
  { id: 'node-reward',           x: 42, y: 77  },
];

const EDGES = [
  { from: 'node-problem',         to: 'node-charter',          label: 'defines'     },
  { from: 'node-charter',         to: 'node-student-bhumikaa', label: 'assigns'     },
  { from: 'node-charter',         to: 'node-ai-lit',           label: 'assigns'     },
  { from: 'node-student-bhumikaa',to: 'node-expert-meera',     label: 'validated by'},
  { from: 'node-ai-lit',          to: 'node-aarav-model',      label: 'supports'    },
  { from: 'node-expert-meera',    to: 'node-reward',           label: 'unlocks'     },
  { from: 'node-aarav-model',     to: 'node-reward',           label: 'contributes' },
];

const FILTERS = ['All', 'Problem', 'Governance', 'Contribution', 'AI Action', 'Validation', 'Reward'];
const FLOW_SEQ = ['node-problem','node-charter','node-student-bhumikaa','node-ai-lit','node-expert-meera','node-aarav-model','node-reward'];

const CW = 820, CH = 600;

export default function ProofGraph({ onOpenProofModal }) {
  const [nodes, setNodes]         = useState(PROOF_GRAPH_NODES);
  const [filter, setFilter]       = useState('All');
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState(null);
  const [hovered, setHovered]     = useState(null);
  const [zoom, setZoom]           = useState(1);
  const [flowStep, setFlowStep]   = useState(-1);
  const [flowing, setFlowing]     = useState(false);

  useEffect(() => {
    api.getProofGraph('PW-1042').then(d => { if (d?.nodes?.length) setNodes(d.nodes); });
  }, []);

  useEffect(() => {
    if (!flowing) return;
    if (flowStep >= FLOW_SEQ.length - 1) { setFlowing(false); return; }
    const t = setTimeout(() => setFlowStep(s => s + 1), 900);
    return () => clearTimeout(t);
  }, [flowing, flowStep]);

  const nodeById   = Object.fromEntries(nodes.map(n => [n.id, n]));
  const layoutById = Object.fromEntries(GRAPH_LAYOUT.map(l => [l.id, l]));

  const filteredIds = nodes.filter(n => {
    const cat  = filter === 'All' || n.category === filter;
    const srch = !search || n.title?.toLowerCase().includes(search.toLowerCase());
    return cat && srch;
  }).map(n => n.id);

  const nx = id => (layoutById[id]?.x / 100) * CW + 72;
  const ny = id => (layoutById[id]?.y / 100) * CH + 40;

  const selectedNode = selected ? nodeById[selected] : null;

  return (
    <div className="graph-workspace">

      {/* Left: controls */}
      <div className="graph-controls">
        <div style={{ padding: '0 12px 12px' }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 500, marginBottom: 10 }}>Filter</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  textAlign: 'left',
                  padding: '6px 10px',
                  fontSize: 13,
                  color: filter === f ? 'var(--text-primary)' : 'var(--text-muted)',
                  background: filter === f ? 'var(--accent-subtle)' : 'transparent',
                  borderRadius: 'var(--r-sm)',
                  cursor: 'pointer',
                  border: 'none',
                  fontWeight: filter === f ? 500 : 400,
                  transition: 'all 0.12s',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="divider" style={{ margin: '8px 0' }} />

        {/* Legend */}
        <div style={{ padding: '8px 12px' }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 500, marginBottom: 10 }}>Legend</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Object.entries(NODE_COLORS).map(([cat, c]) => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: c.border, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center: SVG canvas */}
      <div className="graph-canvas">
        {/* Canvas toolbar */}
        <div style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--bg-surface)',
          border: '1px solid var(--bg-border)',
          borderRadius: 'var(--r-md)',
          padding: '6px 10px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { setFlowStep(0); setFlowing(true); }}
            style={{ padding: '4px 8px', fontSize: 12 }}
          >
            {flowing ? <Pause style={{ width: 13, height: 13 }} /> : <Play style={{ width: 13, height: 13 }} />}
            {flowing ? 'Pause Flow' : 'Simulate Proof Flow'}
          </button>
          <div style={{ width: 1, height: 14, background: 'var(--bg-border)' }} />
          <button className="btn btn-ghost btn-sm" onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} style={{ padding: 4 }}>
            <ZoomIn style={{ width: 14, height: 14 }} />
          </button>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 36, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setZoom(z => Math.max(0.6, z - 0.1))} style={{ padding: 4 }}>
            <ZoomOut style={{ width: 14, height: 14 }} />
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setZoom(1); setFlowStep(-1); setFlowing(false); }} style={{ padding: 4 }}>
            <RotateCcw style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* Search inside canvas */}
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, width: 200 }} className="search-wrap">
          <Search />
          <input
            type="text"
            className="input"
            placeholder="Search nodes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ fontSize: 12.5, padding: '6px 10px 6px 34px' }}
          />
        </div>

        {/* Canvas SVG */}
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'auto',
          }}
          onClick={() => setSelected(null)}
        >
          <svg
            width={CW + 144}
            height={CH + 80}
            viewBox={`0 0 ${CW + 144} ${CH + 80}`}
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out',
            }}
          >
            <defs>
              <pattern id="gridPattern" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="var(--graph-grid-color)" strokeWidth="0.8" opacity="0.3" />
              </pattern>
              <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--text-muted)" opacity="0.6" />
              </marker>
              <marker id="arr-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--accent)" />
              </marker>
            </defs>

            {/* Background grid */}
            <rect width="100%" height="100%" fill="url(#gridPattern)" />

            {/* Edges */}
            {EDGES.map(edge => {
              const fX = nx(edge.from);
              const fY = ny(edge.from);
              const tX = nx(edge.to);
              const tY = ny(edge.to);
              const isFlowEdge = flowStep >= 0 &&
                FLOW_SEQ.indexOf(edge.from) <= flowStep &&
                FLOW_SEQ.indexOf(edge.to) <= flowStep;

              const midX = (fX + tX) / 2;
              const midY = (fY + tY) / 2;

              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <line
                    x1={fX} y1={fY}
                    x2={tX} y2={tY}
                    stroke={isFlowEdge ? 'var(--accent)' : 'var(--bg-border)'}
                    strokeWidth={isFlowEdge ? 2 : 1}
                    strokeDasharray={isFlowEdge ? '6 4' : 'none'}
                    markerEnd={isFlowEdge ? 'url(#arr-active)' : 'url(#arr)'}
                    style={{
                      animation: isFlowEdge ? 'edgeFlow 0.8s linear infinite' : 'none',
                      transition: 'stroke 0.2s',
                    }}
                  />
                  <text
                    x={midX}
                    y={midY - 4}
                    textAnchor="middle"
                    style={{
                      fill: isFlowEdge ? 'var(--accent)' : 'var(--text-muted)',
                      fontSize: '9px',
                      fontFamily: 'SF Mono, Menlo, monospace',
                      userSelect: 'none',
                    }}
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map(node => {
              const layout = layoutById[node.id];
              if (!layout) return null;
              const isFiltered = filteredIds.includes(node.id);
              if (!isFiltered) return null;

              const clr = NODE_COLORS[node.category] || NODE_COLORS.Problem;
              const cx = (layout.x / 100) * CW + 72;
              const cy = (layout.y / 100) * CH + 40;
              const isSel = selected === node.id;
              const isFlowNode = flowStep >= 0 && FLOW_SEQ.indexOf(node.id) <= flowStep;
              const isCurr = FLOW_SEQ[flowStep] === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${cx - 68}, ${cy - 32})`}
                  onClick={e => { e.stopPropagation(); setSelected(node.id === selected ? null : node.id); }}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <defs>
                    <linearGradient id={`g-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={clr.border} stopOpacity="0.12" />
                      <stop offset="100%" stopColor={clr.border} stopOpacity="0.04" />
                    </linearGradient>
                  </defs>

                  {(isSel || isCurr) && (
                    <rect x="-3" y="-3" width="142" height="70" rx="11"
                      fill="none"
                      stroke={clr.border}
                      strokeWidth="1.5"
                      opacity="0.5"
                      style={{ filter: `drop-shadow(0 0 6px ${clr.glow})`, animation: isCurr ? 'nodePulse 1.5s ease-in-out infinite' : 'none' }}
                    />
                  )}

                  <rect x="0" y="0" width="136" height="64" rx="9"
                    fill={`url(#g-${node.id})`}
                    stroke={isSel || isFlowNode ? clr.border : 'var(--bg-border)'}
                    strokeWidth={isSel ? 1.5 : 1}
                    strokeOpacity={isSel ? 0.8 : isFlowNode ? 0.5 : 1}
                    style={{ transition: 'all 0.15s' }}
                  />

                  <text x="11" y="20" style={{ fontSize: '15px' }}>{node.icon}</text>

                  <rect x="32" y="8" width={node.category.length * 5.5 + 8} height="12" rx="3"
                    fill={clr.border} fillOpacity="0.15" />
                  <text x="36" y="18" style={{ fill: clr.border, fontSize: '7.5px', fontWeight: '600', fontFamily: 'Inter,sans-serif', letterSpacing: '0.04em' }}>
                    {node.category.toUpperCase()}
                  </text>

                  <text x="10" y="38" style={{ fill: 'var(--text-primary)', fontSize: '10px', fontWeight: '500', fontFamily: 'Inter,sans-serif' }}>
                    {node.title?.length > 22 ? node.title.slice(0, 22) + '…' : node.title}
                  </text>
                  <text x="10" y="52" style={{ fill: 'var(--text-muted)', fontSize: '8px', fontFamily: 'Inter,sans-serif' }}>
                    {node.subtitle?.length > 24 ? node.subtitle.slice(0, 24) + '…' : node.subtitle}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Right: inspector */}
      {selectedNode && (
        <div className="graph-inspector page-enter">
          <div style={{ padding: '20px 20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 500 }}>
                Node Inspector
              </span>
              <button
                onClick={() => setSelected(null)}
                style={{ fontSize: 18, color: 'var(--text-muted)', cursor: 'pointer', lineHeight: 1, background: 'none', border: 'none' }}
              >
                ×
              </button>
            </div>

            {/* Node identity */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: NODE_COLORS[selectedNode.category]?.border, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                {selectedNode.category}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 8 }}>
                {selectedNode.title}
              </h3>
              {selectedNode.subtitle && (
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selectedNode.subtitle}</p>
              )}
            </div>
          </div>

          <div className="divider" />

          {/* Details */}
          <div style={{ padding: '16px 20px' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 500, marginBottom: 14 }}>Evidence</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { key: 'owner',     label: 'Owner'     },
                { key: 'timestamp', label: 'Timestamp' },
                { key: 'evidence',  label: 'Evidence'  },
                { key: 'validator', label: 'Validated by' },
                { key: 'credit',    label: 'Credit'    },
              ].map(f => selectedNode.details?.[f.key] ? (
                <div key={f.key}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{f.label}</p>
                  <p style={{
                    fontSize: 13,
                    color: f.key === 'credit' ? 'var(--amber)' : f.key === 'validator' ? 'var(--green)' : 'var(--text-primary)',
                    fontFamily: f.key === 'evidence' ? 'monospace' : 'inherit',
                    fontWeight: f.key === 'credit' ? 600 : 400,
                  }}>
                    {selectedNode.details[f.key]}
                  </p>
                </div>
              ) : null)}

              {selectedNode.details?.why && (
                <div style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid var(--bg-border)' }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Why this matters</p>
                  <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selectedNode.details.why}</p>
                </div>
              )}
            </div>
          </div>

          <div className="divider" />

          <div style={{ padding: '16px 20px' }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => onOpenProofModal?.(selectedNode)}
            >
              Open Full Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
