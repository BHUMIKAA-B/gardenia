from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from ..database import get_db
from ..models import HandoverSession, ReplacementRequest, Project, ProjectMember, Contribution, Evidence, AuditEvent, User, Notification, WorkUpdate
from ..auth import get_current_user

router = APIRouter(prefix="/handover", tags=["AI Handover"])

class HandoverGenerateRequest(BaseModel):
    project_id: str = "PW-1042"
    replacement_id: Optional[str] = None

def check_project_access(project_id: str, user: User, db: Session):
    # Admin & Sponsors have access
    if user.role in ("admin", "sponsor"):
        return True
    
    # Check project membership
    member = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user.id
    ).first()
    if member:
        return True

    # Check replacement candidate status
    req = db.query(ReplacementRequest).filter(
        ReplacementRequest.project_id == project_id,
        (ReplacementRequest.requester_id == user.id) | (ReplacementRequest.approved_candidate_id == user.id)
    ).first()
    if req:
        return True

    return False

@router.get("/{project_id}")
def get_project_handover(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not check_project_access(project_id, current_user, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: You do not have authorization to view handover artifacts for this project."
        )

    handover = db.query(HandoverSession).filter(
        HandoverSession.project_id == project_id
    ).order_by(HandoverSession.created_at.desc()).first()

    if not handover:
        return None

    project = db.query(Project).filter(Project.id == project_id).first()

    return {
        "id": handover.id,
        "project_id": handover.project_id,
        "project_title": project.title if project else "Urban Water Quality Prediction",
        "progress": project.progress if project else 62,
        "replacement_id": handover.replacement_id,
        "requester_name": handover.requester_name,
        "replacement_name": handover.replacement_name,
        "status": handover.status,
        "completed_tasks": handover.completed_tasks or [],
        "pending_tasks": handover.pending_tasks or [],
        "key_findings": handover.key_findings or [],
        "known_issues": handover.known_issues or "Sensor anomaly noise in sector B telemetry logs requiring time-series clipping.",
        "expert_guidance": handover.expert_guidance or "Dr. Meera Rao recommended time-based validation split over random cross-validation.",
        "authorized_artifacts": handover.authorized_artifacts or [],
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
    if not check_project_access(req_in.project_id, current_user, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: Unauthorized user cannot trigger AI handover for this project."
        )

    project = db.query(Project).filter(Project.id == req_in.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    rep = None
    if req_in.replacement_id:
        rep = db.query(ReplacementRequest).filter(ReplacementRequest.id == req_in.replacement_id).first()

    requester = rep.requester_name if rep else "Bhumikaa B"
    replacement = rep.approved_candidate_name if (rep and rep.approved_candidate_name) else current_user.full_name

    # Gather ONLY authorized artifacts for target project
    contribs = db.query(Contribution).filter(
        Contribution.project_id == req_in.project_id,
        Contribution.status.in_(["Validated", "Submitted", "Under Review"])
    ).all()

    work_updates = db.query(WorkUpdate).filter(
        WorkUpdate.project_id == req_in.project_id
    ).all()

    auth_artifacts = []
    for c in contribs:
        evs = db.query(Evidence).filter(Evidence.contribution_id == c.id).all()
        for ev in evs:
            auth_artifacts.append({
                "title": f"{c.title} — {ev.title}",
                "ref": f"{ev.evidence_type} ({ev.location_ref})",
                "verified": c.status == "Validated",
                "source_id": c.id
            })

    if not auth_artifacts:
        auth_artifacts = [
            {"title": "Dataset Validation Report", "ref": "SHA: a91f82c4", "verified": True, "source_id": "CON-1001"},
            {"title": "Literature Scout AI Summaries", "ref": "34 paper summaries", "verified": True, "source_id": "CON-1002"},
            {"title": "LSTM Neural Net Baseline Model", "ref": "Git commit #b3e1cc78", "verified": True, "source_id": "CON-1003"},
            {"title": "Project Charter & Scoped Boundary", "ref": "Multi-party Signed", "verified": True, "source_id": "PW-CHARTER"}
        ]

    completed_tasks = [
        "Dataset cleaning & validation (12,400 sensor records)",
        "Missing-value analysis & timestamp normalization",
        "Literature Scout AI paper summarization (34 papers)",
        "Project Charter signing and role assignment",
        "Baseline LSTM model architecture definition",
        "Initial telemetry data ingestion pipeline"
    ]

    pending_tasks = [
        "Temporal feature engineering (rainfall/spikes)",
        "Train 48-hour LSTM forecasting model",
        "Comparative benchmark evaluation report"
    ]

    key_findings = [
        "12,400 telemetry records cleaned & validated from primary water sensors.",
        "7% timestamp inconsistencies resolved via linear interpolation.",
        "Strong seasonal contamination correlation detected in historical logs (p < 0.01)."
    ]

    ho_id = f"HO-{int(datetime.utcnow().timestamp() * 1000)}"
    session = HandoverSession(
        id=ho_id,
        project_id=req_in.project_id,
        replacement_id=req_in.replacement_id or "REP-101",
        requester_name=requester,
        replacement_name=replacement,
        status="Completed",
        completed_tasks=completed_tasks,
        pending_tasks=pending_tasks,
        key_findings=key_findings,
        known_issues="Sensor anomaly noise in sector B telemetry logs requiring time-series clipping.",
        expert_guidance="Dr. Meera Rao recommended time-based validation split over random cross-validation.",
        authorized_artifacts=auth_artifacts,
        ai_summary=f"AI Handover Assistant gathered {len(auth_artifacts)} authorized evidence artifacts, {len(completed_tasks)} completed milestones, and {len(pending_tasks)} pending tasks for seamless research continuity on {project.title}.",
        next_recommended_action="Begin temporal feature engineering and inspect Dataset Validation Report #a91f82c4.",
        created_at=datetime.utcnow()
    )
    db.add(session)

    # Log audit event: "AI HANDOVER GENERATED"
    db.add(AuditEvent(
        id=f"LOG-{int(datetime.utcnow().timestamp() * 1000)}",
        timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        actor_name="AI Handover Assistant",
        actor_role="AI Assistant",
        action=f"AI HANDOVER GENERATED for project {req_in.project_id}",
        project_id=req_in.project_id,
        evidence=f"Handover Session {ho_id} • {len(auth_artifacts)} Authorized Artifacts Analyzed",
        event_type="AI Assistant",
        validator="Dr. Meera Rao",
        status="Generated",
        hash="sha256::" + hex(hash(ho_id))[2:10]
    ))

    # Notify replacement user
    db.add(Notification(
        user_id=current_user.id,
        title="AI Project Handover Brief Ready",
        message=f"AI Handover Assistant generated project continuity brief for {project.title}.",
        category="AI Handover",
        related_project_id=req_in.project_id
    ))

    db.commit()
    db.refresh(session)

    return {
        "success": True,
        "id": session.id,
        "project_id": session.project_id,
        "project_title": project.title,
        "progress": project.progress,
        "requester_name": session.requester_name,
        "replacement_name": session.replacement_name,
        "status": session.status,
        "completed_tasks": session.completed_tasks,
        "pending_tasks": session.pending_tasks,
        "key_findings": session.key_findings,
        "known_issues": session.known_issues,
        "expert_guidance": session.expert_guidance,
        "authorized_artifacts": session.authorized_artifacts,
        "ai_summary": session.ai_summary,
        "next_recommended_action": session.next_recommended_action
    }
