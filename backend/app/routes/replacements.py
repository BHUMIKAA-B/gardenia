from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from ..database import get_db
from ..models import ReplacementRequest, ReplacementCandidate, User, Project, ProjectMember, Notification, AuditEvent
from ..auth import get_current_user

router = APIRouter(prefix="/replacements", tags=["Replacements"])

class ReplacementCreate(BaseModel):
    project_id: str = "PW-1042"
    reason: str
    required_skills: List[str]
    progress_pct: int = 62
    last_milestone: str = "Data Validation"

@router.get("")
def get_replacement_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    requests = db.query(ReplacementRequest).order_by(ReplacementRequest.created_at.desc()).all()
    result = []
    for r in requests:
        candidates = db.query(ReplacementCandidate).filter(ReplacementCandidate.replacement_id == r.id).all()
        result.append({
            "id": r.id,
            "project_id": r.project_id,
            "project_title": r.project_title,
            "requester_id": r.requester_id,
            "requester_name": r.requester_name,
            "requester_role": r.requester_role,
            "reason": r.reason,
            "required_skills": r.required_skills,
            "progress_pct": r.progress_pct,
            "last_milestone": r.last_milestone,
            "status": r.status,
            "approved_candidate_id": r.approved_candidate_id,
            "approved_candidate_name": r.approved_candidate_name,
            "created_at": r.created_at.isoformat(),
            "candidates": [{
                "id": c.id,
                "user_id": c.user_id,
                "user_name": c.user_name,
                "match_score": c.match_score,
                "status": c.status,
                "invited_at": c.invited_at.isoformat()
            } for c in candidates]
        })
    return result

@router.post("")
def create_replacement_request(
    req_in: ReplacementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == req_in.project_id).first()
    project_title = project.title if project else "AI-Assisted Urban Water Quality Prediction"

    rep_id = f"REP-{int(datetime.utcnow().timestamp() * 1000)}"
    new_req = ReplacementRequest(
        id=rep_id,
        project_id=req_in.project_id,
        project_title=project_title,
        requester_id=current_user.id,
        requester_name=current_user.full_name,
        requester_role=current_user.role.capitalize(),
        reason=req_in.reason,
        required_skills=req_in.required_skills,
        progress_pct=req_in.progress_pct,
        last_milestone=req_in.last_milestone,
        status="Candidate Invited",
        created_at=datetime.utcnow()
    )
    db.add(new_req)

    # Automatically find skill-matched candidate (e.g. Aarav Patel)
    candidates = db.query(User).filter(User.id != current_user.id).all()
    for cand in candidates:
        # compute match
        matched_skills = set(req_in.required_skills).intersection(set(cand.skills or []))
        score = min(98.0, 75.0 + len(matched_skills) * 8.0)
        
        cand_entry = ReplacementCandidate(
            replacement_id=rep_id,
            user_id=cand.id,
            user_name=cand.full_name,
            match_score=score,
            status="Invited",
            invited_at=datetime.utcnow()
        )
        db.add(cand_entry)

        # Notify matching candidate privately
        db.add(Notification(
            user_id=cand.id,
            title="Private Research Opportunity Invitation",
            message=f"A research project requires a replacement researcher with your skills ({score:.0f}% match).",
            category="Replacement",
            related_project_id=req_in.project_id,
            action_link="/replacement"
        ))

    # Audit log
    db.add(AuditEvent(
        id=f"LOG-{int(datetime.utcnow().timestamp() * 1000)}",
        timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        actor_name=current_user.full_name,
        actor_role=current_user.role.capitalize(),
        action="requested private researcher replacement",
        project_id=req_in.project_id,
        evidence=f"Reason: {req_in.reason} • Progress {req_in.progress_pct}%",
        event_type="Governance",
        validator="System Matcher",
        status="Requested",
        hash="sha256::" + hex(hash(rep_id))[2:10]
    ))

    db.commit()
    db.refresh(new_req)
    return {"success": True, "id": new_req.id}

@router.post("/{replacement_id}/accept")
def accept_replacement_invitation(
    replacement_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cand = db.query(ReplacementCandidate).filter(
        ReplacementCandidate.replacement_id == replacement_id,
        ReplacementCandidate.user_id == current_user.id
    ).first()
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate invitation not found")
    
    cand.status = "Accepted"
    
    # Notify project authority (Mentor Dr. Meera Rao)
    mentor = db.query(User).filter(User.role == "expert").first()
    if mentor:
        db.add(Notification(
            user_id=mentor.id,
            title="Replacement Candidate Accepted Invitation",
            message=f"{current_user.full_name} accepted the invitation to replace the researcher on PW-1042.",
            category="Replacement",
            related_project_id="PW-1042"
        ))

    db.commit()
    return {"success": True}

@router.post("/{replacement_id}/approve")
def approve_replacement(
    replacement_id: str,
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    req = db.query(ReplacementRequest).filter(ReplacementRequest.id == replacement_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Replacement request not found")

    cand_user = db.query(User).filter(User.id == candidate_id).first()
    if not cand_user:
        raise HTTPException(status_code=404, detail="Candidate user not found")

    req.status = "Approved"
    req.approved_candidate_id = cand_user.id
    req.approved_candidate_name = cand_user.full_name

    # Add to Project Members
    existing_mem = db.query(ProjectMember).filter(
        ProjectMember.project_id == req.project_id,
        ProjectMember.user_id == cand_user.id
    ).first()
    if not existing_mem:
        db.add(ProjectMember(
            project_id=req.project_id,
            user_id=cand_user.id,
            role_in_project=cand_user.role.capitalize(),
            status="Active"
        ))

    # Audit Log
    db.add(AuditEvent(
        id=f"LOG-{int(datetime.utcnow().timestamp() * 1000)}",
        timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        actor_name=current_user.full_name,
        actor_role=current_user.role.capitalize(),
        action=f"approved replacement: {cand_user.full_name}",
        project_id=req.project_id,
        evidence="Project Authority Approval Sign-off",
        event_type="Governance",
        validator=current_user.full_name,
        status="Approved",
        hash="sha256::" + hex(hash(replacement_id))[2:10]
    ))

    # Notify new member
    db.add(Notification(
        user_id=cand_user.id,
        title="Project Access Granted — AI Handover Ready",
        message=f"You are approved as replacement researcher for {req.project_title}. AI Handover Assistant ready.",
        category="AI Handover",
        related_project_id=req.project_id
    ))

    db.commit()
    return {"success": True, "approved_candidate": cand_user.full_name}
