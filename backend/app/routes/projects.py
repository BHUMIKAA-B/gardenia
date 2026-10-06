from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Project, ProjectMember, ProjectCharter, CharterAmendment, User, AuditEvent
from ..auth import get_current_user

router = APIRouter(prefix="/projects", tags=["Projects & Charter"])

class CharterAcceptRequest(BaseModel):
    participant_label: str  # e.g., "Student: Bhumikaa B"

class CharterAmendmentRequest(BaseModel):
    field_changed: str
    old_value: str
    new_value: str
    reason: str

class AddMemberRequest(BaseModel):
    user_id: int
    role_in_project: str

@router.get("/{project_id}")
def get_project_detail(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    members = db.query(ProjectMember).filter(ProjectMember.project_id == project_id).all()
    member_list = []
    for m in members:
        user = db.query(User).filter(User.id == m.user_id).first()
        member_list.append({
            "id": m.id,
            "user_id": m.user_id,
            "name": user.full_name if user else "Participant",
            "role": m.role_in_project,
            "user_role": user.role if user else "student",
            "avatar": user.avatar if user else None,
            "skills": user.skills if user else []
        })

    charter_data = None
    if project.charter:
        charter_data = {
            "id": project.charter.id,
            "problem_statement": project.charter.problem_statement,
            "objectives": project.charter.objectives or [],
            "scope": project.charter.scope,
            "confidentiality_terms": project.charter.confidentiality_terms,
            "authorship_rules": project.charter.authorship_rules,
            "ai_usage_rules": project.charter.ai_usage_rules,
            "dispute_rules": project.charter.dispute_rules,
            "locked": project.charter.locked,
            "accepted_by": project.charter.accepted_by or [],
            "amendments": [
                {
                    "id": a.id,
                    "requested_by": a.requested_by,
                    "field_changed": a.field_changed,
                    "old_value": a.old_value,
                    "new_value": a.new_value,
                    "reason": a.reason,
                    "status": a.status,
                    "created_at": a.created_at.isoformat()
                } for a in project.charter.amendments
            ]
        }

    return {
        "id": project.id,
        "title": project.title,
        "sponsor": project.sponsor_name,
        "funding": project.funding,
        "duration": project.duration,
        "confidentiality": project.confidentiality,
        "status": project.status,
        "progress": project.progress,
        "description": project.description,
        "skillsRequired": project.skills_required or [],
        "team": member_list,
        "charter": charter_data
    }

@router.post("/{project_id}/charter/accept")
def accept_charter(project_id: str, req: CharterAcceptRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project or not project.charter:
        raise HTTPException(status_code=404, detail="Project or Charter not found")

    accepted = list(project.charter.accepted_by or [])
    label = req.participant_label
    if label not in accepted:
        accepted.append(label)
        project.charter.accepted_by = accepted

    # Check if all participants accepted -> LOCK CHARTER
    required_count = len(project.members) + 1  # team + sponsor
    if len(accepted) >= max(3, required_count):
        project.charter.locked = True
        project.charter.locked_at = datetime.utcnow()

        # Add audit event
        audit = AuditEvent(
            id=f"LOG-{1000 + db.query(AuditEvent).count() + 1}",
            timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
            actor_name="PROJECT CHARTER ENGINE",
            actor_role="Governance Engine",
            action="Project Charter Signed & Locked by All Participants",
            project_id=project_id,
            evidence="Multi-party digital acceptance signature log",
            event_type="Governance",
            validator="All Stakeholders",
            status="Locked",
            hash="001199ee"
        )
        db.add(audit)

    db.commit()
    return {
        "message": f"Charter accepted by {label}",
        "locked": project.charter.locked,
        "accepted_by": project.charter.accepted_by
    }

@router.post("/{project_id}/charter/amendments")
def create_amendment(project_id: str, req: CharterAmendmentRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project or not project.charter:
        raise HTTPException(status_code=404, detail="Charter not found")

    amendment = CharterAmendment(
        charter_id=project.charter.id,
        requested_by=user.full_name if user else "Participant",
        field_changed=req.field_changed,
        old_value=req.old_value,
        new_value=req.new_value,
        reason=req.reason,
        status="Pending"
    )
    db.add(amendment)
    db.commit()
    db.refresh(amendment)
    return {"message": "Charter amendment requested", "amendment": amendment}

@router.post("/{project_id}/team")
def add_team_member(project_id: str, req: AddMemberRequest, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    member = ProjectMember(
        project_id=project_id,
        user_id=req.user_id,
        role_in_project=req.role_in_project,
        status="Active"
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return {"message": "Team member added", "member": member}
