from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Reward, Milestone, Project, AuditEvent, User
from ..auth import get_current_user

router = APIRouter(prefix="/rewards", tags=["Reward Management"])

class RewardStatusRequest(BaseModel):
    status: str  # Approved, Released

@router.get("")
def get_rewards(project_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Reward)
    if project_id:
        query = query.filter(Reward.project_id == project_id)
    rewards = query.all()

    res = []
    for r in rewards:
        res.append({
            "id": r.id,
            "projectId": r.project_id,
            "milestoneId": r.milestone_id,
            "title": r.title,
            "amount": r.amount,
            "recipient": r.recipient_name,
            "creditShare": r.credit_share,
            "status": r.status,
            "releasedAt": r.released_at.isoformat() if r.released_at else None
        })
    return res

@router.post("/{reward_id}/release")
def release_reward(reward_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if not reward:
        raise HTTPException(status_code=404, detail="Reward record not found")

    reward.status = "Released"
    reward.released_at = datetime.utcnow()

    # Log audit event
    audit = AuditEvent(
        id=f"LOG-{1000 + db.query(AuditEvent).count() + 1}",
        timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        actor_name=user.full_name if user else "Sponsor Director",
        actor_role="Sponsor",
        action=f"Released Milestone Escrow Payout ({reward.amount}) to {reward.recipient_name}",
        project_id=reward.project_id,
        evidence=f"Prototype Escrow Release #{reward.id}",
        event_type="Human",
        validator=user.full_name if user else "Sponsor",
        credit=reward.credit_share,
        payout_share=reward.amount,
        status="Released",
        hash="tx99214a"
    )
    db.add(audit)
    db.commit()

    return {"message": "Reward released successfully", "reward": reward}
