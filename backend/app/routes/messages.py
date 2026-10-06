from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from collections import Counter
from ..database import get_db
from ..models import Conversation, ConversationParticipant, Message, ProjectMember, User, Notification, Project
from ..auth import get_current_user

router = APIRouter(prefix="/messages", tags=["Messages"])

class MessageCreate(BaseModel):
    text: str
    attachment_ref: Optional[str] = None
    evidence_id: Optional[str] = None

class ConversationCreate(BaseModel):
    project_id: Optional[str] = "PW-1042"
    title: Optional[str] = None
    participant_user_ids: List[int]

@router.get("/unread-count")
def get_unread_count(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    participant_entries = db.query(ConversationParticipant).filter(ConversationParticipant.user_id == current_user.id).all()
    conv_ids = [p.conversation_id for p in participant_entries]

    if not conv_ids:
        return {"unread_count": 0}

    total_unread = db.query(Message).filter(
        Message.conversation_id.in_(conv_ids),
        Message.sender_id != current_user.id,
        Message.is_read == False
    ).count()

    return {"unread_count": total_unread}

@router.get("/conversations")
def get_conversations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # --- AUTO-ESTABLISH CONVERSATIONS ---
    # Fetch user's active projects
    my_projects = db.query(ProjectMember).filter(
        ProjectMember.user_id == current_user.id,
        ProjectMember.status == "Active"
    ).all()

    for pm in my_projects:
        project_id = pm.project_id
        my_role = pm.role_in_project.lower()

        # Find other members in this project
        other_members = db.query(ProjectMember).filter(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id != current_user.id,
            ProjectMember.status == "Active"
        ).all()

        for om in other_members:
            other_role = om.role_in_project.lower()
            other_user_id = om.user_id

            # Determine if this pair should have a conversation
            should_have_conv = False
            title = ""
            if (my_role == "student" and other_role == "mentor") or (my_role == "mentor" and other_role == "student"):
                should_have_conv = True
                title = f"{project_id}: Student ↔ Mentor Discussion"
            elif (my_role == "mentor" and other_role == "expert") or (my_role == "expert" and other_role == "mentor"):
                should_have_conv = True
                title = f"{project_id}: Mentor ↔ Expert Sync"

            if should_have_conv:
                # Check if a conversation between these two already exists
                # We need a conversation where BOTH are participants and NO ONE ELSE is.
                # Find all conversations current_user is in
                my_convs = db.query(ConversationParticipant.conversation_id).filter(
                    ConversationParticipant.user_id == current_user.id
                )

                # Find which of these the other_user is in
                shared_convs = db.query(ConversationParticipant.conversation_id).filter(
                    ConversationParticipant.conversation_id.in_(my_convs),
                    ConversationParticipant.user_id == other_user_id
                )

                # Filter down to ones with EXACTLY 2 participants
                # and matching project_id
                conv = db.query(Conversation).filter(
                    Conversation.id.in_(shared_convs),
                    Conversation.project_id == project_id
                ).first()

                if conv:
                    # Check participant count
                    p_count = db.query(ConversationParticipant).filter(ConversationParticipant.conversation_id == conv.id).count()
                    if p_count != 2:
                        conv = None # Not a strict 1-on-1

                if not conv:
                    # Create the conversation
                    new_id = f"CONV-{project_id}-{current_user.id}-{other_user_id}"
                    proj = db.query(Project).filter(Project.id == project_id).first()
                    
                    new_conv = Conversation(
                        id=new_id,
                        project_id=project_id,
                        project_title=proj.title if proj else "Research Project",
                        title=title,
                        created_at=datetime.utcnow(),
                        updated_at=datetime.utcnow()
                    )
                    db.add(new_conv)
                    
                    # Add me
                    cp1 = ConversationParticipant(
                        conversation_id=new_id,
                        user_id=current_user.id,
                        user_name=current_user.full_name,
                        user_role=current_user.role.capitalize() if current_user.role else "Researcher"
                    )
                    # Add them
                    other_u = db.query(User).filter(User.id == other_user_id).first()
                    cp2 = ConversationParticipant(
                        conversation_id=new_id,
                        user_id=other_user_id,
                        user_name=other_u.full_name if other_u else "Unknown",
                        user_role=other_u.role.capitalize() if (other_u and other_u.role) else "Researcher"
                    )
                    db.add_all([cp1, cp2])
                    db.commit()
    # --- END AUTO-ESTABLISH ---

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
            "last_message_time": last_msg.created_at.strftime("%I:%M %p") if last_msg else "",
            "unread_count": unread_count,
            "participants": [{"id": p.user_id, "name": p.user_name, "role": p.user_role} for p in parts]
        })
    return result

@router.post("/conversations")
def create_or_get_conversation(conv_in: ConversationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_ids = list(set([current_user.id] + conv_in.participant_user_ids))
    
    participant_convs = db.query(ConversationParticipant.conversation_id).filter(
        ConversationParticipant.user_id.in_(user_ids)
    ).all()
    
    conv_counts = Counter([c[0] for c in participant_convs])
    existing_conv_id = None
    for cid, count in conv_counts.items():
        if count == len(user_ids):
            conv_obj = db.query(Conversation).filter(Conversation.id == cid).first()
            if conv_obj and (not conv_in.project_id or conv_obj.project_id == conv_in.project_id):
                existing_conv_id = cid
                break

    if existing_conv_id:
        conv = db.query(Conversation).filter(Conversation.id == existing_conv_id).first()
        return {"id": conv.id, "title": conv.title, "project_id": conv.project_id, "is_new": False}

    new_id = f"CONV-{int(datetime.utcnow().timestamp())}"
    proj = db.query(Project).filter(Project.id == conv_in.project_id).first() if conv_in.project_id else None
    new_conv = Conversation(
        id=new_id,
        project_id=conv_in.project_id,
        project_title=proj.title if proj else "Research Project",
        title=conv_in.title or f"{conv_in.project_id or 'Project'}: Research Chat",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(new_conv)
    
    for uid in user_ids:
        u = db.query(User).filter(User.id == uid).first()
        if u:
            cp = ConversationParticipant(
                conversation_id=new_id,
                user_id=u.id,
                user_name=u.full_name,
                user_role=u.role.capitalize() if u.role else "Researcher"
            )
            db.add(cp)
            
    db.commit()
    return {"id": new_id, "title": new_conv.title, "project_id": new_conv.project_id, "is_new": True}

@router.get("/conversations/{conversation_id}")
def get_conversation_messages(conversation_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    part = db.query(ConversationParticipant).filter(
        ConversationParticipant.conversation_id == conversation_id,
        ConversationParticipant.user_id == current_user.id
    ).first()
    if not part:
        raise HTTPException(status_code=403, detail="403 Forbidden: You are not authorized to view this private research chat.")

    messages = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at.asc()).all()

    # Mark unread messages sent by others as read
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

    now = datetime.utcnow()
    new_msg = Message(
        id=f"MSG-{int(now.timestamp() * 1000)}",
        conversation_id=conversation_id,
        sender_id=current_user.id,
        sender_name=current_user.full_name,
        sender_role=current_user.role.capitalize() if current_user.role else "Researcher",
        text=msg_in.text,
        attachment_ref=msg_in.attachment_ref,
        evidence_id=msg_in.evidence_id,
        is_read=False,
        created_at=now
    )
    db.add(new_msg)

    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if conv:
        conv.updated_at = now
    
    # Notify other participants in the conversation
    other_parts = db.query(ConversationParticipant).filter(
        ConversationParticipant.conversation_id == conversation_id,
        ConversationParticipant.user_id != current_user.id
    ).all()

    for p in other_parts:
        notif = Notification(
            user_id=p.user_id,
            title=f"New Message from {current_user.full_name}",
            message=msg_in.text[:120],
            notification_type="message",
            category="Message",
            related_project_id=conv.project_id if conv else "PW-1042",
            action_link=f"messages:{conversation_id}",
            is_read=False,
            created_at=now
        )
        db.add(notif)

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
        "is_read": False,
        "timestamp": new_msg.created_at.strftime("%I:%M %p")
    }
