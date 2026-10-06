from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Dispute, Contribution, AuditEvent, User
from ..auth import get_current_user

router = APIRouter(prefix="/disputes", tags=["Dispute Governance"])

class DisputeCreateRequest(BaseModel):
    project_id: str
    contribution_id: str
    contribution_title: str
    reason: str
    description: str
    evidence_ref: Optional[str] = None

class DisputeResolveRequest(BaseModel):
    status: str  # Decision, Resolved
    decision_note: str

@router.get("")
def get_disputes(project_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Dispute)
    if project_id:
        query = query.filter(Dispute.project_id == project_id)
    disputes = query.all()

    res = []
    for d in disputes:
        res.append({
            "id": d.id,
            "projectId": d.project_id,
            "contributionId": d.contribution_id,
            "contributionTitle": d.contribution_title,
            "raisedBy": d.raised_by,
            "reason": d.reason,
            "description": d.description,
            "evidenceRef": d.evidence_ref,
            "status": d.status,
            "decisionNote": d.decision_note,
            "createdAt": d.created_at.isoformat()
        })
    return res

@router.post("/create")
def create_dispute(req: DisputeCreateRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    did = f"DISP-{100 + db.query(Dispute).count() + 1}"
    dispute = Dispute(
        id=did,
        project_id=req.project_id,
        contribution_id=req.contribution_id,
        contribution_title=req.contribution_title,
        raised_by=user.full_name if user else "Research Contributor",
        reason=req.reason,
        description=req.description,
        evidence_ref=req.evidence_ref or "Dispute evidence document",
        status="Submitted"
    )
    db.add(dispute)

    # Audit log
    audit = AuditEvent(
        id=f"LOG-{1000 + db.query(AuditEvent).count() + 1}",
        timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        actor_name=user.full_name if user else "Research Contributor",
        actor_role=user.role if user else "student",
        action=f"Raised Contribution Dispute #{did} on '{req.contribution_title}'",
        project_id=req.project_id,
        evidence=f"Reason: {req.reason}",
        event_type="Governance",
        validator="Expert Review Board",
        credit="Under Dispute",
        payout_share="Frozen in Escrow",
        status="Under Dispute",
        hash="disp0091"
    )
    db.add(audit)
    db.commit()

    return {"message": "Dispute raised successfully", "id": did, "dispute": dispute}

@router.post("/{dispute_id}/resolve")
def resolve_dispute(dispute_id: str, req: DisputeResolveRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    dispute = db.query(Dispute).filter(Dispute.id == dispute_id).first()
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute record not found")

    dispute.status = req.status
    dispute.decision_note = req.decision_note

    # Audit log
    audit = AuditEvent(
        id=f"LOG-{1000 + db.query(AuditEvent).count() + 1}",
        timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        actor_name=user.full_name if user else "Dr. Meera Rao",
        actor_role="Expert Reviewer",
        action=f"Resolved Contribution Dispute #{dispute_id}",
        project_id=dispute.project_id,
        evidence=f"Board Decision: {req.decision_note}",
        event_type="Governance",
        validator=user.full_name if user else "Expert Board",
        credit="Resolved",
        payout_share="Unfrozen",
        status="Resolved",
        hash="disp0092"
    )
    db.add(audit)
    db.commit()

    return {
        "message": "Dispute resolved successfully",
        "dispute": {
            "id": dispute.id,
            "status": dispute.status,
            "decisionNote": dispute.decision_note
        }
    }
