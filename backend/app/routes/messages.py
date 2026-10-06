from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from ..database import get_db
from ..models import Conversation, ConversationParticipant, Message, ProjectMember, User
from ..auth import get_current_user

router = APIRouter(prefix="/messages", tags=["Messages"])

class MessageCreate(BaseModel):
    text: str
    attachment_ref: Optional[str] = None
    evidence_id: Optional[str] = None

class ConversationCreate(BaseModel):
    project_id: Optional[str] = "PW-1042"
    title: str
    participant_user_ids: List[int]

@router.get("/conversations")
def get_conversations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Find conversations where current user is a participant
    participant_entry = db.query(ConversationParticipant).filter(ConversationParticipant.user_id == current_user.id).all()
    conv_ids = [p.conversation_id for p in participant_entry]

    conversations = db.query(Conversation).filter(Conversation.id.in_(conv_ids)).order_by(Conversation.updated_at.desc()).all()
    
    result = []
    for c in conversations:
        last_msg = db.query(Message).filter(Message.conversation_id == c.id).order_by(Message.created_at.desc()).first()
        unread_count = db.query(Message).filter(
            Message.conversation_id == c.id,
            Message.sender_id != current_user.id,
            Message.is_read == False
        ).count()
        parts = db.query(ConversationParticipant).filter(ConversationParticipant.conversation_id == c.id).all()
        
        result.append({
            "id": c.id,
            "project_id": c.project_id,
            "project_title": c.project_title or "Urban Water Quality Prediction",
            "title": c.title,
            "updated_at": c.updated_at.isoformat() if c.updated_at else None,
            "last_message": last_msg.text if last_msg else "No messages yet",
            "last_message_time": last_msg.created_at.strftime("%H:%M") if last_msg else "",
            "unread_count": unread_count,
            "participants": [{"id": p.user_id, "name": p.user_name, "role": p.user_role} for p in parts]
        })
    return result

@router.get("/conversations/{conversation_id}")
def get_conversation_messages(conversation_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    part = db.query(ConversationParticipant).filter(
        ConversationParticipant.conversation_id == conversation_id,
        ConversationParticipant.user_id == current_user.id
    ).first()
    if not part:
        raise HTTPException(status_code=403, detail="403 Forbidden: You are not authorized to view this private research chat.")

    messages = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at.asc()).all()

    # Mark unread messages as read
    db.query(Message).filter(
        Message.conversation_id == conversation_id,
        Message.sender_id != current_user.id,
        Message.is_read == False
    ).update({"is_read": True})
    db.commit()

    return [{
        "id": m.id,
        "conversation_id": m.conversation_id,
        "sender_id": m.sender_id,
        "sender_name": m.sender_name,
        "sender_role": m.sender_role,
        "text": m.text,
        "attachment_ref": m.attachment_ref,
        "evidence_id": m.evidence_id,
        "is_read": m.is_read,
        "timestamp": m.created_at.strftime("%I:%M %p")
    } for m in messages]

@router.post("/conversations/{conversation_id}/messages")
def send_message(conversation_id: str, msg_in: MessageCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    part = db.query(ConversationParticipant).filter(
        ConversationParticipant.conversation_id == conversation_id,
        ConversationParticipant.user_id == current_user.id
    ).first()
    if not part:
        raise HTTPException(status_code=403, detail="403 Forbidden: Access denied to research project chat.")

    new_msg = Message(
        id=f"MSG-{int(datetime.utcnow().timestamp() * 1000)}",
        conversation_id=conversation_id,
        sender_id=current_user.id,
        sender_name=current_user.full_name,
        sender_role=current_user.role,
        text=msg_in.text,
        attachment_ref=msg_in.attachment_ref,
        evidence_id=msg_in.evidence_id,
        is_read=False,
        created_at=datetime.utcnow()
    )
    db.add(new_msg)

    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if conv:
        conv.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(new_msg)

    return {
        "id": new_msg.id,
        "conversation_id": new_msg.conversation_id,
        "sender_id": new_msg.sender_id,
        "sender_name": new_msg.sender_name,
        "sender_role": new_msg.sender_role,
        "text": new_msg.text,
        "attachment_ref": new_msg.attachment_ref,
        "evidence_id": new_msg.evidence_id,
        "timestamp": new_msg.created_at.strftime("%I:%M %p")
    }
