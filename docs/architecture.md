# PROOFWEAVE Architecture Specification

## Overview
PROOFWEAVE is a trust layer for collaborative research. It replaces unverified resume claims with an auditable proof ecosystem connecting research problems, verified people, explainable matching, project charters, evidence, proof graphs, contribution credit, and milestone escrow rewards.

```
Research Problem
       ↓
Verified People
       ↓
Explainable Matching (35% Skill, 25% Interest, 20% Experience, 10% Availability, 10% Domain)
       ↓
Team Formation & Capability Matrix
       ↓
Project Charter Agreement (🔒 Charter Lock)
       ↓
Controlled Collaboration & Evidence Logging
       ↓
Expert Mentor Peer Validation
       ↓
Interactive Proof Graph
       ↓
Transparent Contribution Ledger
       ↓
Traceable Milestone Escrow Payout
       ↓
Evidence-Backed Research Passport
```

## Tech Stack
- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Lucide React Icons, React Flow (custom graph visualization)
- **Backend**: Python 3.13, FastAPI, Pydantic v2, SQLAlchemy 2.0, PyJWT, SQLite / PostgreSQL
- **Security & Authorization**: OAuth2 Bearer JWT authentication, Role-Based Access Control (RBAC), AI Scoped Access Enforcement Engine
- **Audit & Ledger**: Tamper-Evident SHA-256 fingerprint audit events with CSV export

## Core Modules
1. **Authentication & RBAC**: Roles (`student`, `expert`, `sponsor`, `admin`).
2. **Research Problem Discovery**: Sponsored challenges with budget, timeline, and domain tags.
3. **Explainable Matching Engine**: 5-factor scoring formula with missing skill gap identification.
4. **Project Charter Engine**: Stakeholder digital signatures, locked state, and amendment governance.
5. **Contribution & Evidence Management**: Artifact submission with Git commit hashes, dataset validation reports, and mentor peer reviews.
6. **Proof Graph**: Interactive graph visualization mapping nodes from problem to milestone payout.
7. **AI Control Room**: Human-owned AI governance ("AI can assist, but AI cannot own") with real backend project scope checks blocking unauthorized cross-project access.
8. **Research Passport**: Verified portfolio replacing self-reported resumes.
9. **Reward & Escrow System**: Milestone payout authorization linked to verified contribution credit.
10. **Dispute Governance**: Multi-stage dispute resolution workflow (Submitted → Under Review → Board Decision → Resolved).
11. **Pitch Mode**: Guided 13-step hackathon pitch deck sequence.
