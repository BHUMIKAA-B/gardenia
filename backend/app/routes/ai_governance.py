from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import AIAgent, AIActionLog, AuditEvent, User, Project

router = APIRouter(prefix="/ai", tags=["AI Governance"])

class AICheckAccessRequest(BaseModel):
    agent_id: str
    target_project_id: str
    action: str = "READ_PROJECT_FILES"

@router.get("/agents")
def get_ai_agents(project_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(AIAgent)
    if project_id:
        query = query.filter(AIAgent.project_id == project_id)
    agents = query.all()

    res = []
    for a in agents:
        res.append({
            "id": a.id,
            "name": a.name,
            "avatar": a.avatar,
            "humanOwner": a.human_owner_name,
            "humanOwnerId": a.human_owner_id,
            "project": a.project_id,
            "scope": a.scope,
            "allowedData": a.allowed_data or [],
            "allowedActions": a.allowed_actions or [],
            "blockedActions": a.blocked_actions or [],
            "status": a.status,
            "actionsCompleted": a.actions_completed
        })
    return res

@router.post("/check-access")
def check_ai_access(req: AICheckAccessRequest, db: Session = Depends(get_db)):
    agent = db.query(AIAgent).filter(AIAgent.id == req.agent_id).first()
    if not agent:
        # Default fallback demo agent
        agent_name = "Literature Scout Agent"
        human_owner = "Aarav Patel"
        agent_project = "PW-1042"
    else:
        agent_name = agent.name
        human_owner = agent.human_owner_name
        agent_project = agent.project_id

    # REAL BACKEND SCOPE CHECK
    is_allowed = (agent_project == req.target_project_id)

    if not is_allowed:
        reason = f"Project scope violation: Agent assigned to {agent_project} is denied access to project {req.target_project_id}"
        
        # Log AI action attempt
        log = AIActionLog(
            agent_id=req.agent_id,
            agent_name=agent_name,
            human_owner=human_owner,
            requested_project_id=req.target_project_id,
            target_resource=f"Confidential Files of {req.target_project_id}",
            action=req.action,
            is_allowed=False,
            denial_reason=reason
        )
        db.add(log)

        # Log Security Audit Event
        audit = AuditEvent(
            id=f"LOG-{1000 + db.query(AuditEvent).count() + 1}",
            timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
            actor_name=f"{agent_name} (AI)",
            actor_role=f"AI Assistant (Owner: {human_owner})",
            action=f"Restricted Access Blocked: Attempted cross-project read on {req.target_project_id}",
            project_id=req.target_project_id,
            evidence=f"Attempted unauthorized access on {req.target_project_id} private repository",
            event_type="Security Alert",
            validator="AI Scope Sentinel Rule #88",
            credit="N/A",
            payout_share="N/A",
            status="Blocked & Logged",
            hash="ff008821"
        )
        db.add(audit)
        db.commit()

        return {
            "allowed": False,
            "status": "ACCESS DENIED",
            "agent": agent_name,
            "human_owner": human_owner,
            "requested_project": req.target_project_id,
            "assigned_project": agent_project,
            "reason": reason,
            "action_recorded": True,
            "audit_id": audit.id
        }

    # If allowed
    if agent:
        agent.actions_completed += 1
        db.commit()

    return {
        "allowed": True,
        "status": "ACCESS GRANTED",
        "agent": agent_name,
        "human_owner": human_owner,
        "project": agent_project,
        "reason": "Request within permitted project scope boundaries."
    }
