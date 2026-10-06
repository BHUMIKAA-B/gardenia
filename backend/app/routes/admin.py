from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Project, Contribution, AuditEvent, AIAgent, Dispute
from ..auth import require_role

router = APIRouter(prefix="/admin", tags=["Admin & Governance"])

@router.get("/users")
def get_admin_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    res = []
    for u in users:
        res.append({
            "id": u.id,
            "email": u.email,
            "fullName": u.full_name,
            "role": u.role,
            "institution": u.institution,
            "isVerified": u.is_verified,
            "createdAt": u.created_at.isoformat()
        })
    return res

@router.get("/analytics")
def get_admin_analytics(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_projects = db.query(Project).count()
    total_contributions = db.query(Contribution).count()
    validated_contributions = db.query(Contribution).filter(Contribution.status == "Validated").count()
    total_ai_agents = db.query(AIAgent).count()
    total_disputes = db.query(Dispute).count()
    total_audit_events = db.query(AuditEvent).count()

    validation_rate = round((validated_contributions / total_contributions * 100), 1) if total_contributions > 0 else 100.0

    return {
        "metrics": {
            "totalUsers": total_users,
            "totalProjects": total_projects,
            "totalContributions": total_contributions,
            "validatedContributions": validated_contributions,
            "validationRate": f"{validation_rate}%",
            "activeAiAgents": total_ai_agents,
            "openDisputes": total_disputes,
            "auditEventsCount": total_audit_events
        },
        "contributionDistribution": [
            {"name": "Bhumikaa B", "percentage": 40, "role": "Student Data Lead"},
            {"name": "Aarav Patel", "percentage": 30, "role": "Student ML Dev"},
            {"name": "Dr. Meera Rao", "percentage": 20, "role": "Domain Mentor"},
            {"name": "Literature Scout Agent", "percentage": 10, "role": "AI Assistant (Human-Owned)"}
        ]
    }

@router.get("/audit-logs")
def get_admin_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(AuditEvent).order_by(AuditEvent.id.desc()).all()
    res = []
    for l in logs:
        res.append({
            "id": l.id,
            "timestamp": l.timestamp,
            "actor": l.actor_name,
            "role": l.actor_role,
            "action": l.action,
            "projectId": l.project_id,
            "evidence": l.evidence,
            "eventType": l.event_type,
            "validator": l.validator,
            "status": l.status,
            "hash": l.hash
        })
    return res
