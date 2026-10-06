import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Shield, Award, Clock, DollarSign, BookOpen, Users, Cpu, FileCheck, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ResearchDetailView({ problemId, onBack, onOpenProject, onOpenWhyMatch }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getProblemDetail(problemId).then(data => {
      if (!isMounted) return;
      if (data) {
        setProblem(data);
        if (data.isMember) {
          setApplied(true);
          setApplicationStatus(data.userRoleInProject || 'Member');
        }
      }
      setLoading(false);
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [problemId]);

  const handleApply = async () => {
    if (applying || applied) return;
    setApplying(true);
    try {
      const res = await api.applyToResearch(problemId, user?.role === 'expert' ? 'Mentor' : 'Student Researcher');
      setApplying(false);
      if (res && res.success) {
        setApplied(true);
        setApplicationStatus('Pending Review');
        addToast({ title: 'Application Submitted ✓', message: `Your application to join ${problem.title} has been logged.` });
      } else if (res && res.already_member) {
        setApplied(true);
        setApplicationStatus(res.role || 'Member');
        addToast({ title: 'Already Joined', message: 'You are already a participant in this research.' });
      } else {
        addToast({ title: 'Application Note', message: res?.message || 'Unable to submit application at this time.' });
      }
    } catch (e) {
      setApplying(false);
      addToast({ title: 'Error', message: 'Failed to submit application. Please try again.' });
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p style={{ color: 'var(--text-muted)' }}>Loading research problem details...</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="p-8 text-center space-y-4">
        <p style={{ color: 'var(--text-muted)' }}>Research problem not found.</p>
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back to Research List
        </button>
      </div>
    );
  }

  const isSponsor = user?.role === 'sponsor' || problem.sponsor_name === user?.name;
  const isMember = problem.isMember || applied;
  const match = problem.matchScore || 92;
  const fitScores = problem.fitScores || { skills: 94, domain: 88, experience: 76, overall: match };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button className="btn btn-ghost btn-sm text-xs" onClick={onBack}>
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Opportunities
        </button>
      </div>

      {/* Header Banner */}
      <div className="panel p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge badge-indigo">
                {problem.sponsorLogo || '🔬'} {problem.sponsor || problem.sponsor_name}
              </span>
              <span className={`badge ${problem.status === 'Recruiting' ? 'badge-green' : 'badge-gray'}`}>
                {problem.status}
              </span>
              {problem.confidentiality && (
                <span className="badge badge-cyan">
                  <Shield className="w-3 h-3" /> {problem.confidentiality}
                </span>
              )}
            </div>

            <h1 className="text-xl md:text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              {problem.title}
            </h1>

            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              ID: <span className="font-mono">{problem.id}</span> · Scoped Multi-Party Research Project
            </p>
          </div>

          {/* Fit score badge & CTAs */}
          <div className="flex flex-col items-end gap-3 shrink-0">
            <div
              className="p-3 rounded-xl text-center border cursor-pointer hover:border-indigo-500/50 transition-all"
              style={{ background: 'var(--accent-subtle)', borderColor: 'var(--accent-border)' }}
              onClick={() => onOpenWhyMatch && onOpenWhyMatch(problem)}
            >
              <div className="text-2xl font-bold font-mono" style={{ color: 'var(--accent)' }}>
                {match}%
              </div>
              <div className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                Research Fit Match
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isMember ? (
                <button className="btn btn-primary" onClick={() => onOpenProject(problem.id)}>
                  Open Project Workspace →
                </button>
              ) : isSponsor ? (
                <button className="btn btn-secondary">
                  Manage Research Problem
                </button>
              ) : (
                <button
                  className={`btn ${applied ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={handleApply}
                  disabled={applying || applied}
                >
                  {applying ? (
                    'Submitting...'
                  ) : applied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {applicationStatus || 'Applied ✓'}
                    </>
                  ) : (
                    'Apply / Join Research'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description & Objective */}
          <div className="panel p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-xs" style={{ color: 'var(--text-muted)' }}>
              Research Overview & Objectives
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              {problem.description}
            </p>
          </div>

          {/* Key Parameters */}
          <div className="panel p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-xs" style={{ color: 'var(--text-muted)' }}>
              Research Parameters
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
                <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> Duration
                </div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {problem.duration || '6 weeks'}
                </div>
              </div>

              <div className="p-3 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
                <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Budget / Reward
                </div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {problem.funding || '₹1,00,000'}
                </div>
              </div>

              <div className="p-3 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
                <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                  <Shield className="w-3.5 h-3.5 text-cyan-400" /> Confidentiality
                </div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {problem.confidentiality || 'Controlled Access'}
                </div>
              </div>
            </div>
          </div>

          {/* AI Policy & Expected Deliverables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="panel p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--purple)' }}>
                <Cpu className="w-4 h-4" /> AI Governance Policy
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                "AI can assist, but AI cannot own." All AI Scout suggestions and neural network design code must be backed by verifiable human evidence in the Proof Graph.
              </p>
            </div>

            <div className="panel p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--green)' }}>
                <FileCheck className="w-4 h-4" /> Expected Deliverables
              </div>
              <ul className="text-xs space-y-1.5" style={{ color: 'var(--text-secondary)' }}>
                <li>• Cleaned & validated telemetry dataset</li>
                <li>• 48-hour LSTM neural forecast model</li>
                <li>• Peer-reviewed research report & Proof Graph</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar Column (1 col) */}
        <div className="space-y-6">
          {/* Required Skills */}
          <div className="panel p-5 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Required Skills & Expertise
            </h4>
            <div className="flex flex-wrap gap-2">
              {(problem.skillsRequired || ['Machine Learning', 'Python', 'LSTM', 'Data Engineering']).map(skill => (
                <span key={skill} className="badge badge-indigo">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Calculated Research Fit Breakdown */}
          <div className="panel p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Calculated Research Fit
              </h4>
              <span className="text-xs font-bold font-mono" style={{ color: 'var(--accent)' }}>
                {match}%
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between mb-1" style={{ color: 'var(--text-secondary)' }}>
                  <span>Skill Match</span>
                  <span>{fitScores.skills}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${fitScores.skills}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1" style={{ color: 'var(--text-secondary)' }}>
                  <span>Domain Match</span>
                  <span>{fitScores.domain}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${fitScores.domain}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1" style={{ color: 'var(--text-secondary)' }}>
                  <span>Experience Match</span>
                  <span>{fitScores.experience}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${fitScores.experience}%` }} />
                </div>
              </div>
            </div>

            {problem.fitReasons?.length > 0 && (
              <div className="pt-3 border-t text-xs space-y-1" style={{ borderColor: 'var(--bg-border)' }}>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Matched Strengths:</span>
                <ul className="space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  {problem.fitReasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-emerald-500 font-mono">✓</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
