from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from ..database import get_db
from ..models import HandoverSession, ReplacementRequest, Project, Contribution, Evidence, AuditEvent, User, Notification
from ..auth import get_current_user

router = APIRouter(prefix="/handover", tags=["AI Handover"])

class HandoverGenerateRequest(BaseModel):
    project_id: str = "PW-1042"
    replacement_id: str

@router.get("/{project_id}")
def get_project_handover(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    handover = db.query(HandoverSession).filter(HandoverSession.project_id == project_id).order_by(HandoverSession.created_at.desc()).first()
    if not handover:
        return None
    return {
        "id": handover.id,
        "project_id": handover.project_id,
        "replacement_id": handover.replacement_id,
        "requester_name": handover.requester_name,
        "replacement_name": handover.replacement_name,
        "status": handover.status,
        "completed_tasks": handover.completed_tasks,
        "pending_tasks": handover.pending_tasks,
        "key_findings": handover.key_findings,
        "known_issues": handover.known_issues,
        "expert_guidance": handover.expert_guidance,
        "authorized_artifacts": handover.authorized_artifacts,
        "ai_summary": handover.ai_summary,
        "next_recommended_action": handover.next_recommended_action,
        "created_at": handover.created_at.isoformat()
    }

@router.post("/generate")
def generate_ai_handover(
    req_in: HandoverGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rep = db.query(ReplacementRequest).filter(ReplacementRequest.id == req_in.replacement_id).first()
    requester = rep.requester_name if rep else "Bhumikaa B"
    replacement = rep.approved_candidate_name if (rep and rep.approved_candidate_name) else current_user.full_name

    # Gather authorized artifacts for PW-1042
    contribs = db.query(Contribution).filter(Contribution.project_id == req_in.project_id).all()
    evidences = db.query(Evidence).all()

    auth_artifacts = [
        {"title": "Dataset Validation Report", "ref": "SHA: a91f82c4", "verified": True},
        {"title": "Literature Scout AI Summaries", "ref": "34 paper summaries", "verified": True},
        {"title": "LSTM Neural Net Baseline Model", "ref": "Git commit #b3e1cc78", "verified": True},
        {"title": "Project Charter & Scoped Boundary", "ref": "Multi-party Signed", "verified": True}
    ]

    ho_id = f"HO-{int(datetime.utcnow().timestamp() * 1000)}"
    session = HandoverSession(
        id=ho_id,
        project_id=req_in.project_id,
        replacement_id=req_in.replacement_id,
        requester_name=requester,
        replacement_name=replacement,
        status="Completed",
        completed_tasks=[
          "Dataset cleaning & validation (12,400 sensor records)",
          "Missing-value analysis & timestamp normalization",
          "Literature Scout AI paper summarization (34 papers)"
        ],
        pending_tasks=[
          "Temporal feature engineering (rainfall/spikes)",
          "Train 48-hour LSTM forecasting model",
          "Comparative benchmark evaluation report"
        ],
        key_findings=[
          "12,400 telemetry records cleaned & validated.",
          "7% timestamp inconsistencies resolved via linear interpolation.",
          "Strong seasonal contamination correlation detected in historical logs."
        ],
        known_issues="Sensor anomaly noise in sector B telemetry logs requiring time-series clipping.",
        expert_guidance="Dr. Meera Rao recommended time-based validation split over random cross-validation.",
        authorized_artifacts=auth_artifacts,
        ai_summary="AI Handover Assistant gathered 4 authorized evidence artifacts, 3 completed milestones, and 3 pending tasks for seamless research continuity.",
        next_recommended_action="Begin temporal feature engineering and inspect Dataset Validation Report #a91f82c4.",
        created_at=datetime.utcnow()
    )
    db.add(session)

    # Log audit event: "AI can assist, but AI cannot own"
    db.add(AuditEvent(
        id=f"LOG-{int(datetime.utcnow().timestamp() * 1000)}",
        timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        actor_name="AI Handover Assistant",
        actor_role="AI Assistant",
        action=f"generated project handover for {replacement}",
        project_id=req_in.project_id,
        evidence="Handover Brief • 4 Authorized Artifacts",
        event_type="AI Assistant",
        validator="Dr. Meera Rao",
        status="Generated",
        hash="sha256::" + hex(hash(ho_id))[2:10]
    ))

    # Notify replacement
    db.add(Notification(
        user_id=current_user.id,
        title="AI Project Handover Brief Ready",
        message="The AI Handover Assistant has assembled your project onboarding brief and evidence links.",
        category="AI Handover",
        related_project_id=req_in.project_id
    ))

    db.commit()
    db.refresh(session)

    return {
        "success": True,
        "id": session.id,
        "ai_summary": session.ai_summary,
        "next_recommended_action": session.next_recommended_action
    }
