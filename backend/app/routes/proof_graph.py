from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Project, Contribution, Evidence, Validation, AuditEvent

router = APIRouter(prefix="/projects", tags=["Proof Graph"])

@router.get("/{project_id}/proof-graph")
def get_proof_graph(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    nodes = [
        {
            "id": "node-problem",
            "title": f"Research Problem Posted: {project.title}",
            "subtitle": f"Sponsor: {project.sponsor_name}",
            "category": "Problem",
            "icon": "💧",
            "color": "#2563eb",
            "details": {
                "owner": f"Sponsor: {project.sponsor_name}",
                "timestamp": "01 Oct 2026, 09:00 UTC",
                "evidence": f"Project Charter Proposal #{project.id}",
                "credit": "Project Initiator",
                "why": f"Defines core problem statement, funding ({project.funding}), and required domain skills."
            }
        },
        {
            "id": "node-charter",
            "title": "Project Charter Locked",
            "subtitle": "Multi-party Agreement",
            "category": "Governance",
            "icon": "🔒",
            "color": "#7c3aed",
            "details": {
                "owner": "All Project Stakeholders",
                "timestamp": "03 Oct 2026, 12:00 UTC",
                "evidence": f"Project Agreement #{project.id}-LOCKED",
                "credit": "Agreed Ruleset",
                "why": "Ensures milestones, IP rules, and AI scopes cannot be silently altered mid-project."
            }
        },
        {
            "id": "node-student-bhumikaa",
            "title": "Data Cleaning & Telemetry Pipeline",
            "subtitle": "Bhumikaa B (Lead Data Engineer)",
            "category": "Contribution",
            "icon": "📊",
            "color": "#059669",
            "details": {
                "owner": "Bhumikaa B (Lead Data Engineer)",
                "timestamp": "04 Oct 2026, 14:32 UTC",
                "evidence": "Git Commit #a91f82c • Cleaned 12,400 sensor records • Unit tests passed",
                "credit": "18% Milestone 1 Share",
                "validator": "Dr. Meera Rao (Domain Mentor)",
                "why": "Cleaned noisy telemetry, removed sensor drift outliers, and generated reproducible dataset."
            }
        },
        {
            "id": "node-ai-lit",
            "title": "Literature Synthesis (AI Assisted)",
            "subtitle": "Literature Scout Agent (Human Owner: Aarav Patel)",
            "category": "AI Action",
            "icon": "📚",
            "color": "#0284c7",
            "details": {
                "owner": "Human Owner: Aarav Patel",
                "timestamp": "04 Oct 2026, 16:15 UTC",
                "evidence": "Summary Report #LS-21 • Parsed 8 water research papers",
                "credit": "5% Team Credit (Attributed to Aarav)",
                "validator": "Aarav Patel (Human Owner)",
                "why": "AI agent literature extraction under human supervision. AI cannot receive independent credit."
            }
        },
        {
            "id": "node-expert-meera",
            "title": "Methodology Peer Review",
            "subtitle": "Dr. Meera Rao (Domain Mentor)",
            "category": "Validation",
            "icon": "🔬",
            "color": "#d97706",
            "details": {
                "owner": "Dr. Meera Rao (Domain Mentor)",
                "timestamp": "05 Oct 2026, 09:04 UTC",
                "evidence": "Expert Review Report #MR-09 • Outlier formula approved",
                "credit": "7% Milestone 1 Share",
                "validator": "AquaNova Research Board",
                "why": "Validated mathematical accuracy of telemetry cleaning pipeline prior to LSTM model training."
            }
        },
        {
            "id": "node-aarav-model",
            "title": "LSTM Neural Contamination Network",
            "subtitle": "Aarav Patel (Student Researcher)",
            "category": "Contribution",
            "icon": "🧠",
            "color": "#db2777",
            "details": {
                "owner": "Aarav Patel (Student Researcher)",
                "timestamp": "05 Oct 2026, 11:20 UTC",
                "evidence": "Git Commit #b40c991 • Model accuracy evaluation notebook",
                "credit": "22% Milestone 2 Share",
                "validator": "Dr. Meera Rao (Domain Mentor)",
                "why": "Trained LSTM neural network model for forecasting 48-hour urban water contamination risk."
            }
        },
        {
            "id": "node-reward",
            "title": "Milestone Escrow Released",
            "subtitle": "Payout: ₹40,000",
            "category": "Reward",
            "icon": "💰",
            "color": "#059669",
            "details": {
                "owner": "AquaNova Escrow Vault",
                "timestamp": "05 Oct 2026, 15:00 UTC",
                "evidence": "Milestone Payout Transaction #TX-99214",
                "credit": "Automated Milestone Payout",
                "why": "All Milestone 1 proof deliverables passed domain mentor validation and charter requirements."
            }
        }
    ]

    edges = [
        {"id": "e1-2", "source": "node-problem", "target": "node-charter", "label": "Governing Charter"},
        {"id": "e2-3", "source": "node-charter", "target": "node-student-bhumikaa", "label": "Scoped Work"},
        {"id": "e2-4", "source": "node-charter", "target": "node-ai-lit", "label": "Human-Owned AI"},
        {"id": "e3-5", "source": "node-student-bhumikaa", "target": "node-expert-meera", "label": "Expert Validation"},
        {"id": "e4-5", "source": "node-ai-lit", "target": "node-expert-meera", "label": "Review"},
        {"id": "e5-6", "source": "node-expert-meera", "target": "node-aarav-model", "label": "Validated Data Input"},
        {"id": "e5-7", "source": "node-expert-meera", "target": "node-reward", "label": "Escrow Payout"}
    ]

    return {"project_id": project_id, "nodes": nodes, "edges": edges}
