from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Project, User, MatchResult, ProjectMember, Notification, AuditEvent
from ..auth import get_current_user

router = APIRouter(prefix="/research", tags=["Research Problems"])

class ProjectCreateRequest(BaseModel):
    id: Optional[str] = None
    title: str
    sponsor_name: str
    sponsor_logo: Optional[str] = "🔬"
    funding: str
    funding_raw: Optional[float] = 0.0
    duration: str
    confidentiality: str = "Controlled Access"
    description: str
    skills_required: List[str] = []
    is_monetary: bool = True

class ApplyRequest(BaseModel):
    role_requested: Optional[str] = "Student Researcher"
    message: Optional[str] = ""

@router.get("/problems")
def get_problems(db: Session = Depends(get_db), current_user: Optional[User] = Depends(get_current_user)):
    projects = db.query(Project).all()
    results = []
    for p in projects:
        match_score = 72
        fit_scores = {
            "overall": 72,
            "skills": 75,
            "experience": 68,
            "learning": 80,
            "availability": 70,
            "domain": 71
        }
        fit_reasons = [
            "General Python programming skills match",
            "Research interest in data science",
            "Available for 6-week project commitment"
        ]
        missing_skills = ["Domain expertise required — see project skills"]

        # Pull real match data if available
        if current_user:
            m = db.query(MatchResult).filter(
                MatchResult.project_id == p.id,
                MatchResult.user_id == current_user.id
            ).first()
            if m:
                match_score = int(m.score)
                fit_scores = {
                    "overall": int(m.score),
                    "skills": int(m.skill_match),
                    "experience": int(m.experience_match),
                    "learning": int(m.interest_match),
                    "availability": int(m.availability_match),
                    "domain": int(m.domain_match)
                }
                fit_reasons = list(m.strengths or []) + ([m.explanation] if m.explanation else [])
                missing_skills = list(m.missing_skills or [])

        # Check if current user is already a member
        is_member = False
        user_role_in_project = None
        if current_user:
            membership = db.query(ProjectMember).filter(
                ProjectMember.project_id == p.id,
                ProjectMember.user_id == current_user.id
            ).first()
            if membership:
                is_member = True
                user_role_in_project = membership.role_in_project

        results.append({
            "id": p.id,
            "title": p.title,
            "sponsor": p.sponsor_name,
            "sponsor_name": p.sponsor_name,
            "sponsorLogo": p.sponsor_logo or "🔬",
            "funding": p.funding,
            "fundingRaw": p.funding_raw,
            "duration": p.duration,
            "confidentiality": p.confidentiality,
            "status": p.status,
            "isMonetary": p.is_monetary,
            "progress": p.progress,
            "description": p.description,
            "skillsRequired": p.skills_required or [],
            "matchScore": match_score,
            "fitScores": fit_scores,
            "fitReasons": fit_reasons,
            "missingSkills": missing_skills,
            "charterLocked": p.charter.locked if p.charter else False,
            "isMember": is_member,
            "userRoleInProject": user_role_in_project,
            "milestones": [
                {
                    "id": ms.id,
                    "title": ms.title,
                    "payout": ms.payout,
                    "status": ms.status,
                    "released": ms.released,
                    "contributionsCount": len(ms.contributions),
                    "distribution": ms.distribution or []
                } for ms in p.milestones
            ]
        })
    return results

@router.get("/problems/{project_id}")
def get_problem_detail(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Research problem not found")

    match_score = 72
    fit_scores = {"overall": 72, "skills": 75, "experience": 68, "learning": 80, "availability": 70, "domain": 71}
    fit_reasons = []
    missing_skills = []

    is_member = False
    user_role_in_project = None

    if current_user:
        m = db.query(MatchResult).filter(
            MatchResult.project_id == p.id,
            MatchResult.user_id == current_user.id
        ).first()
        if m:
            match_score = int(m.score)
            fit_scores = {
                "overall": int(m.score),
                "skills": int(m.skill_match),
                "experience": int(m.experience_match),
                "learning": int(m.interest_match),
                "availability": int(m.availability_match),
                "domain": int(m.domain_match)
            }
            fit_reasons = list(m.strengths or []) + ([m.explanation] if m.explanation else [])
            missing_skills = list(m.missing_skills or [])

        membership = db.query(ProjectMember).filter(
            ProjectMember.project_id == p.id,
            ProjectMember.user_id == current_user.id
        ).first()
        if membership:
            is_member = True
            user_role_in_project = membership.role_in_project

    members = db.query(ProjectMember).filter(ProjectMember.project_id == p.id).all()
    team = []
    for mem in members:
        u = db.query(User).filter(User.id == mem.user_id).first()
        team.append({
            "name": u.full_name if u else "Researcher",
            "role": mem.role_in_project,
            "avatar": u.avatar if u else None
        })

    return {
        "id": p.id,
        "title": p.title,
        "sponsor": p.sponsor_name,
        "sponsorLogo": p.sponsor_logo or "🔬",
        "funding": p.funding,
        "duration": p.duration,
        "confidentiality": p.confidentiality,
        "status": p.status,
        "progress": p.progress,
        "description": p.description,
        "skillsRequired": p.skills_required or [],
        "matchScore": match_score,
        "fitScores": fit_scores,
        "fitReasons": fit_reasons,
        "missingSkills": missing_skills,
        "charterLocked": p.charter.locked if p.charter else False,
        "isMember": is_member,
        "userRoleInProject": user_role_in_project,
        "team": team,
        "milestones": [
            {
                "id": ms.id,
                "title": ms.title,
                "payout": ms.payout,
                "status": ms.status,
                "released": ms.released
            } for ms in p.milestones
        ]
    }

@router.post("/problems/{project_id}/apply")
def apply_to_research(
    project_id: str,
    req: ApplyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Research problem not found")

    # Check if already a member
    existing = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == current_user.id
    ).first()
    if existing:
        return {
            "success": False,
            "message": "You are already a member of this project.",
            "already_member": True,
            "role": existing.role_in_project
        }

    # Add as project member (pending approval)
    member = ProjectMember(
        project_id=project_id,
        user_id=current_user.id,
        role_in_project=req.role_requested or "Student Researcher",
        status="Pending"
    )
    db.add(member)

    # Audit event
    db.add(AuditEvent(
        id=f"LOG-APP-{int(datetime.utcnow().timestamp() * 1000)}",
        timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        action=f"Applied to join research project {project_id}",
        project_id=project_id,
        evidence=f"Application role: {req.role_requested}",
        event_type="Application",
        validator="Sponsor / Mentor",
        status="Pending Review",
        hash=hex(hash(f"{current_user.id}-{project_id}"))[2:10]
    ))

    # Notify the sponsor / project lead
    sponsor_members = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id
    ).all()
    for sm in sponsor_members:
        u = db.query(User).filter(User.id == sm.user_id).first()
        if u and u.role in ("sponsor", "expert"):
            db.add(Notification(
                user_id=u.id,
                title="New Research Application",
                message=f"{current_user.full_name} applied to join {p.title} as {req.role_requested}.",
                category="Research Application",
                notification_type="info",
                related_project_id=project_id
            ))

    db.commit()

    return {
        "success": True,
        "message": f"Application submitted successfully for {p.title}.",
        "status": "Pending Review",
        "project_id": project_id,
        "role": req.role_requested
    }

@router.post("/create")
def create_problem(
    req: ProjectCreateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    proj_id = req.id or f"PW-{1000 + db.query(Project).count() + 1}"
    existing = db.query(Project).filter(Project.id == proj_id).first()
    if existing:
        proj_id = f"PW-{1000 + db.query(Project).count() + 10}"

    project = Project(
        id=proj_id,
        title=req.title,
        sponsor_name=req.sponsor_name,
        sponsor_logo=req.sponsor_logo,
        sponsor_id=user.id if user else None,
        funding=req.funding,
        funding_raw=req.funding_raw or 0.0,
        duration=req.duration,
        confidentiality=req.confidentiality,
        status="Recruiting",
        is_monetary=req.is_monetary,
        progress=0,
        description=req.description,
        skills_required=req.skills_required
    )
    db.add(project)

    # Notify all students about new research problem
    students = db.query(User).filter(User.role == "student").all()
    for s in students:
        db.add(Notification(
            user_id=s.id,
            title="New Research Opportunity",
            message=f"{req.sponsor_name} published: {req.title}",
            category="Research",
            notification_type="info",
            related_project_id=proj_id
        ))

    db.commit()
    db.refresh(project)
    return {"message": "Research problem created and researchers notified", "id": project.id}
