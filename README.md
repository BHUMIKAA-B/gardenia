# PROOFWEAVE

> **Tagline:** "Research where every contribution has a proof."  
> **Core Positioning:** "A trust layer for collaborative research."

ProofWeave connects research problems, verified people, explainable matching, team formation, project charters, evidence, validation, proof graphs, transparent credit, and milestone rewards into an evidence-backed Research Passport.

---

## Central Problem Solved
"Collaborative research lacks a unified trust layer for attribution, evidence, access control, accountability, and fair credit."

## Central Product Principle
- Every action is scoped.
- Every contribution has evidence.
- Every AI action has a human owner.
- Every reward is traceable to verified contribution.

---

## Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 (Vanilla CSS + modern gradients & elevated cards)
- **Icons**: Lucide React Icons
- **Graph & Visualization**: React Flow / Custom Canvas Proof Graph

### Backend
- **Framework**: Python 3.13 + FastAPI
- **ORM & DB**: SQLAlchemy 2.0 + SQLite (`proofweave.db`)
- **Authentication**: PyJWT (HS256) + SHA-256 salted password hashing
- **Testing**: Pytest & FastAPI TestClient

---

## Quick Start / Local Running Instructions

### 1. Prerequisites
- Node.js 18+
- Python 3.10+

### 2. Running the Backend Server
```bash
# Start FastAPI backend on http://127.0.0.1:8000
python -m uvicorn backend.app.main:app --port 8000 --host 127.0.0.1
```

The database `proofweave.db` will automatically initialize and seed with the demo project (`PW-1042`), Bhumikaa B, Aarav Patel, Dr. Meera Rao, and Literature Scout Agent.

### 3. Running Backend Unit Tests
```bash
python -m pytest backend/tests/test_api.py
```

### 4. Running the Frontend App
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Key Features & End-to-End Workflows

1. **Research Discovery (`/research` / `discover`)**:
   - Lists sponsored challenges (`PW-1042` AquaNova Urban Water Quality Prediction).
   - Interactive **Explainable Match Score (92%)** modal breaking down Skill Match (35%), Research Interest (25%), Experience (20%), Availability (10%), Domain Match (10%).

2. **Team Formation & Skill Matrix**:
   - Multi-role team view (Student, Expert, Sponsor, AI Agent).
   - Real-time capability coverage matrix (ML 100%, Data Analysis 100%, Mentorship 100%, AI 100%).

3. **Project Charter Engine**:
   - Digital signature workflow.
   - **🔒 CHARTER LOCKED** status when all stakeholders accept.
   - Formal charter amendment workflow with old/new values and approval tracking.

4. **Contribution & Evidence Tracking**:
   - Submit contributions attached to Git commit hashes (`#A91F`) or validation reports.
   - Expert mentor review workflow setting verified credit percentage (18%).

5. **Interactive Proof Graph**:
   - Visual attribution pipeline: `PROBLEM → CHARTER → CONTRIBUTOR → ACTION → EVIDENCE → VALIDATION → CREDIT → REWARD`.
   - Node detail inspection drawer showing WHO, WHAT, WHEN, EVIDENCE, VALIDATED BY, CREDIT, REWARD.

6. **AI Control Room & Real Permission Check**:
   - AI governance dashboard for *Literature Scout Agent* (Human Owner: Aarav Patel).
   - **Test Restricted Access** button executing `POST /api/ai/check-access` attempting to access restricted project `PW-1088`.
   - Backend returns `ACCESS DENIED` (`"Project scope violation"`) and writes an immutable audit event.

7. **Contribution Ledger**:
   - Transparent table with search, filters, and **Export Ledger (CSV)** download.

8. **Research Passport (`/passport`)**:
   - Evidence-backed research profile replacing unverified resume claims with inspectable proof artifacts.

9. **Sponsor Portal & Reward Flow**:
   - Milestone progress bars (M1 100%, M2 70%, M3 30%).
   - Prototype escrow release workflow (`Pending → Validated → Approved → Released`).

10. **Dispute Governance (`/dispute`)**:
    - Contribution dispute creation and expert board resolution recording.

11. **Pitch Mode (`/pitch`)**:
    - Step-by-step 13-stage guided demo mode for judges.

---

## Demo Credentials

| Role | Name | Email | Password |
|---|---|---|---|
| **Student (Lead Data)** | Bhumikaa B | `bhumikaa@proofweave.ai` | `bhumikaa123` |
| **Student (ML Dev)** | Aarav Patel | `aarav@proofweave.ai` | `aarav123` |
| **Domain Mentor** | Dr. Meera Rao | `meera@proofweave.ai` | `meera123` |
| **Sponsor** | AquaNova Director | `sponsor@aquanova.ai` | `sponsor123` |
| **Admin** | ProofWeave Admin | `admin@proofweave.ai` | `admin123` |

---

## Documentation Links
- [Architecture Overview](docs/architecture.md)
- [Data Flow Diagram](docs/data-flow.md)
- [API Reference](docs/api.md)
- [Security & Governance](docs/security.md)
- [Demo Script](docs/demo.md)
