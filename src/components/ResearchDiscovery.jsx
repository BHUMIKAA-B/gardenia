import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { api } from '../services/api';
import { SEED_PROJECTS } from '../data/seedData';

const FILTERS = ['All', 'Machine Learning', 'NLP', 'Climate', 'Bioinformatics'];

export default function ResearchDiscovery({ onSelectProject, onOpenWhyMatch }) {
  const [projects, setProjects] = useState(SEED_PROJECTS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    api.getProjects().then(data => { if (data?.length) setProjects(data); });
  }, []);

  const filtered = projects.filter(p => {
    const matchSearch = !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.sponsor?.toLowerCase().includes(search.toLowerCase()) ||
      p.sponsor_name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || p.tags?.includes(filter) || p.domain === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Research</h1>
        <p className="page-subtitle">Discover research opportunities matched to your expertise.</p>
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        <div className="search-wrap">
          <Search />
          <input
            className="input"
            placeholder="Search by title, sponsor, domain…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filter-pill${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 16 }}>
        {filtered.length} {filtered.length === 1 ? 'opportunity' : 'opportunities'}
        {filter !== 'All' && ` · filtered by ${filter}`}
      </p>

      {/* Results list */}
      <div style={{ border: '1px solid var(--bg-border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No research opportunities match your search.</p>
          </div>
        ) : (
          filtered.map((p, i) => (
            <ResearchItem
              key={p.id || i}
              project={p}
              onSelect={() => onSelectProject(p)}
              onWhyMatch={() => onOpenWhyMatch(p)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ResearchItem({ project, onSelect, onWhyMatch }) {
  const sponsor = project.sponsor_name || project.sponsor || 'Sponsor';
  const match = project.matchScore || project.match_score || 92;
  const tags = project.tags || ['Machine Learning', 'Python'];
  const duration = project.duration_weeks ? `${project.duration_weeks} weeks` : '6 weeks';
  const budget = project.budget || '₹1,00,000';

  return (
    <div className="research-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sponsor}</span>
            {match >= 85 && (
              <span className="badge badge-indigo" style={{ fontSize: 11 }}>
                {match}% match
              </span>
            )}
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.4 }}>
            {project.title}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {tags.slice(0, 3).map(tag => (
              <span key={tag} className="badge badge-gray">{tag}</span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, flexShrink: 0 }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{budget}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{duration}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={e => { e.stopPropagation(); onWhyMatch(); }}
            >
              Why match?
            </button>
            <button className="btn btn-primary btn-sm" onClick={onSelect}>
              View →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
