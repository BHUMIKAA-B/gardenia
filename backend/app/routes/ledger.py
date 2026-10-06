from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..models import AuditEvent, Project

router = APIRouter(prefix="/ledger", tags=["Contribution Ledger"])

@router.get("")
def get_ledger(project_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(AuditEvent)
    if project_id:
        query = query.filter(AuditEvent.project_id == project_id)
    events = query.order_by(AuditEvent.id.desc()).all()

    res = []
    for e in events:
        res.append({
            "id": e.id,
            "timestamp": e.timestamp,
            "contributor": e.actor_name,
            "role": e.actor_role,
            "action": e.action,
            "projectId": e.project_id or "N/A",
            "evidence": e.evidence,
            "type": e.event_type,
            "validator": e.validator or "N/A",
            "credit": e.credit or "N/A",
            "payoutShare": e.payout_share or "N/A",
            "status": e.status,
            "hash": e.hash
        })
    return res

@router.get("/export")
def export_ledger_csv(project_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(AuditEvent)
    if project_id:
        query = query.filter(AuditEvent.project_id == project_id)
    events = query.all()

    csv_rows = ["Log ID,Timestamp,Contributor,Role,Action,Project,Evidence,Type,Validator,Credit,Payout Share,Status,Hash"]
    for e in events:
        row = f'"{e.id}","{e.timestamp}","{e.actor_name}","{e.actor_role}","{e.action}","{e.project_id or "N/A"}","{e.evidence}","{e.event_type}","{e.validator or "N/A"}","{e.credit}","{e.payout_share}","{e.status}","{e.hash}"'
        csv_rows.append(row)

    csv_content = "\n".join(csv_rows)
    return Response(content=csv_content, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=proofweave_ledger.csv"})
