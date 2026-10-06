from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from ..database import get_db
from ..models import WorkUpdate, ProjectMember, User, AuditEvent, Notification
from ..auth import get_current_user

router = APIRouter(prefix="/work-updates", tags=["Work Updates"])

class WorkUpdateCreate(BaseModel):
    project_id: str = "PW-1042"
    update_type: str  # Daily, Weekly, Final
    date: str
    summary: str
    work_completed: str
    challenges: Optional[str] = None
    next_steps: Optional[str] = None
    evidence_ref: Optional[str] = None
    effort_hours: float = 4.0
    milestone_progress: int = 55

class WorkUpdateReview(BaseModel):
    comment: str
    status: str = "Reviewed"  # Reviewed, Approved, Flagged

@router.get("")
def get_work_updates(
    project_id: Optional[str] = "PW-1042",
    update_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(WorkUpdate).filter(WorkUpdate.project_id == project_id)
    if update_type and update_type != "All":
        query = query.filter(WorkUpdate.update_type == update_type)
    
    updates = query.order_by(WorkUpdate.created_at.desc()).all()
    return [{
        "id": u.id,
        "project_id": u.project_id,
        "author_id": u.author_id,
        "author_name": u.author_name,
        "author_role": u.author_role,
        "update_type": u.update_type,
        "date": u.date,
        "summary": u.summary,
        "work_completed": u.work_completed,
        "challenges": u.challenges,
        "next_steps": u.next_steps,
        "evidence_ref": u.evidence_ref,
        "effort_hours": u.effort_hours,
        "milestone_progress": u.milestone_progress,
        "status": u.status,
        "reviewer_name": u.reviewer_name,
        "reviewer_comment": u.reviewer_comment,
        "created_at": u.created_at.isoformat()
    } for u in updates]

@router.post("")
def create_work_update(
    up_in: WorkUpdateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_id = f"UPD-{int(datetime.utcnow().timestamp() * 1000)}"
    new_update = WorkUpdate(
        id=new_id,
        project_id=up_in.project_id,
        author_id=current_user.id,
        author_name=current_user.full_name,
        author_role=current_user.role.capitalize(),
        update_type=up_in.update_type,
        date=up_in.date,
        summary=up_in.summary,
        work_completed=up_in.work_completed,
        challenges=up_in.challenges,
        next_steps=up_in.next_steps,
        evidence_ref=up_in.evidence_ref,
        effort_hours=up_in.effort_hours,
        milestone_progress=up_in.milestone_progress,
        status="Submitted",
        created_at=datetime.utcnow()
    )
    db.add(new_update)

    # Add audit log
    audit = AuditEvent(
        id=f"LOG-{int(datetime.utcnow().timestamp() * 1000)}",
        timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        actor_name=current_user.full_name,
        actor_role=current_user.role.capitalize(),
        action=f"submitted {up_in.update_type.lower()} work update",
        project_id=up_in.project_id,
        evidence=up_in.evidence_ref or "Work Summary Log",
        event_type="Human",
        validator="Pending Review",
        status="Submitted",
        hash="sha256::" + hex(hash(new_id))[2:10]
    )
    db.add(audit)

    # Trigger targeted notification to mentor/expert/sponsor depending on role
    if current_user.role == "student":
        # notify mentor (Dr. Meera Rao)
        mentor = db.query(User).filter(User.role == "expert").first()
        if mentor:
            db.add(Notification(
                user_id=mentor.id,
                title="Daily Student Update Submitted",
                message=f"{current_user.full_name} submitted a daily work update for PW-1042.",
                category="Work Update",
                related_project_id=up_in.project_id
            ))
    elif current_user.role == "expert":
        # notify sponsor
        sponsor = db.query(User).filter(User.role == "sponsor").first()
        if sponsor:
            db.add(Notification(
                user_id=sponsor.id,
                title="Weekly Research Report Submitted",
                message=f"{current_user.full_name} submitted a weekly consolidated project report for PW-1042.",
                category="Work Update",
                related_project_id=up_in.project_id
            ))

    db.commit()
    db.refresh(new_update)
    return {"success": True, "id": new_update.id}

@router.post("/{update_id}/review")
def review_work_update(
    update_id: str,
    rev_in: WorkUpdateReview,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    update = db.query(WorkUpdate).filter(WorkUpdate.id == update_id).first()
    if not update:
        raise HTTPException(status_code=404, detail="Work update not found")

    update.reviewer_name = current_user.full_name
    update.reviewer_comment = rev_in.comment
    update.status = rev_in.status
    db.commit()

    return {"success": True, "id": update_id, "status": update.status}
