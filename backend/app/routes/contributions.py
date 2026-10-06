import hashlib
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Contribution, Evidence, Validation, Project, User, AuditEvent, ResearchPassport, Reward
from ..auth import get_current_user

router = APIRouter(prefix="/contributions", tags=["Contributions & Evidence"])

class ContributionCreateRequest(BaseModel):
    title: str
    description: str
    contribution_type: str
    project_id: str
    milestone_id: Optional[str] = "PW-1042-M1"
    effort_hours: float = 10.0
    is_ai_assisted: bool = False
    ai_agent_id: Optional[str] = None
    evidence_title: Optional[str] = None
    evidence_type: Optional[str] = "Git Commit"
    evidence_ref: Optional[str] = None

class ValidationRequest(BaseModel):
    status: str  # Approved, Rejected, Needs Revision
    comment: Optional[str] = "Contribution verified by domain mentor."
    credit_percentage: float = 18.0
    payout_share: Optional[str] = "₹18,000"

@router.get("")
def get_contributions(project_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Contribution)
    if project_id:
        query = query.filter(Contribution.project_id == project_id)
    contributions = query.all()

    res = []
    for c in contributions:
        evidences = [
            {
                "id": e.id,
                "title": e.title,
                "type": e.evidence_type,
                "description": e.description,
                "location_ref": e.location_ref,
                "hash": e.hash
            } for e in c.evidences
        ]
        res.append({
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "type": c.contribution_type,
            "projectId": c.project_id,
            "milestoneId": c.milestone_id,
            "contributor": c.contributor_name,
            "role": c.contributor_role,
            "isAiAssisted": c.is_ai_assisted,
            "aiAgentId": c.ai_agent_id,
            "effortHours": c.effort_hours,
            "status": c.status,
            "creditPercentage": c.credit_percentage,
            "payoutShare": c.payout_share,
            "validator": c.validator_name,
            "hash": c.hash,
            "createdAt": c.created_at.isoformat(),
            "evidences": evidences
        })
    return res

@router.post("")
def create_contribution(req: ContributionCreateRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    cid = f"CON-{1000 + db.query(Contribution).count() + 1}"
    c_hash = hashlib.sha256(f"{cid}-{req.title}-{user.full_name if user else 'User'}".encode()).hexdigest()[:8]

    contrib = Contribution(
        id=cid,
        title=req.title,
        description=req.description,
        contribution_type=req.contribution_type,
        project_id=req.project_id,
        milestone_id=req.milestone_id,
        contributor_id=user.id if user else None,
        contributor_name=user.full_name if user else "Contributor",
        contributor_role=user.role.title() if user else "Student",
        is_ai_assisted=req.is_ai_assisted,
        ai_agent_id=req.ai_agent_id,
        effort_hours=req.effort_hours,
        status="Submitted",
        credit_percentage=15.0,
        payout_share="In Escrow",
        hash=c_hash
    )
    db.add(contrib)
    db.commit()
    db.refresh(contrib)

    # Attach evidence if provided
    if req.evidence_title:
        eid = f"EVI-{800 + db.query(Evidence).count() + 1}"
        e_hash = hashlib.sha256(f"{eid}-{req.evidence_title}".encode()).hexdigest()[:12]
        ev = Evidence(
            id=eid,
            contribution_id=cid,
            uploaded_by=user.full_name if user else "Contributor",
            title=req.evidence_title,
            evidence_type=req.evidence_type or "Git Commit",
            description=f"Evidence for contribution {cid}",
            location_ref=req.evidence_ref or f"commit #{e_hash[:7]}",
            hash=e_hash
        )
        db.add(ev)
        db.commit()

    # Log Audit Event
    audit = AuditEvent(
        id=f"LOG-{1000 + db.query(AuditEvent).count() + 1}",
        timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        actor_name=user.full_name if user else "Contributor",
        actor_role=user.role if user else "Student",
        action=req.title,
        project_id=req.project_id,
        evidence=f"{req.evidence_title or 'Attachment'} • Commit #{c_hash}",
        event_type="Human" if not req.is_ai_assisted else "AI Assistant",
        validator="Pending",
        credit="Pending",
        payout_share="In Escrow",
        status="Submitted",
        hash=c_hash
    )
    db.add(audit)
    db.commit()

    return {"message": "Contribution submitted successfully", "id": cid, "contribution": contrib}

@router.post("/{contribution_id}/validate")
def validate_contribution(contribution_id: str, req: ValidationRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    contrib = db.query(Contribution).filter(Contribution.id == contribution_id).first()
    if not contrib:
        raise HTTPException(status_code=404, detail="Contribution not found")

    contrib.status = "Validated" if req.status == "Approved" else req.status
    contrib.credit_percentage = req.credit_percentage
    contrib.payout_share = req.payout_share or "₹18,000"
    contrib.validator_name = user.full_name if user else "Dr. Meera Rao"

    val = Validation(
        contribution_id=contribution_id,
        validator_id=user.id if user else None,
        validator_name=user.full_name if user else "Dr. Meera Rao",
        status=req.status,
        comment=req.comment
    )
    db.add(val)

    # Log Audit Event
    audit = AuditEvent(
        id=f"LOG-{1000 + db.query(AuditEvent).count() + 1}",
        timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        actor_name=user.full_name if user else "Dr. Meera Rao",
        actor_role="Domain Mentor",
        action=f"Validated Contribution: {contrib.title}",
        project_id=contrib.project_id,
        evidence=f"Peer Review by {user.full_name if user else 'Domain Mentor'} • Comment: {req.comment}",
        event_type="Human",
        validator=user.full_name if user else "Dr. Meera Rao",
        credit=f"{req.credit_percentage}%",
        payout_share=req.payout_share or "₹18,000",
        status="Verified",
        hash=contrib.hash
    )
    db.add(audit)

    # Update research passport if contributor is a user
    if contrib.contributor_id:
        passport = db.query(ResearchPassport).filter(ResearchPassport.user_id == contrib.contributor_id).first()
        if passport:
            passport.verified_contributions += 1
            artifacts = list(passport.verified_proof_artifacts or [])
            artifacts.append({
                "id": f"ART-{len(artifacts)+801}",
                "project": contrib.project_id,
                "title": contrib.title,
                "type": "Git Commit & Verification",
                "hash": f"commit #{contrib.hash}",
                "date": datetime.utcnow().strftime("%d %b %Y"),
                "validator": user.full_name if user else "Dr. Meera Rao",
                "creditShare": f"{req.credit_percentage}%",
                "status": "Verified"
            })
            passport.verified_proof_artifacts = artifacts

    db.commit()
    return {"message": "Contribution validated successfully", "status": contrib.status, "credit": contrib.credit_percentage}
