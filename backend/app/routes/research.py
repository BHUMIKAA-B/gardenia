from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Project, User, MatchResult
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

@router.get("/problems")
def get_problems(db: Session = Depends(get_db), current_user: Optional[User] = Depends(get_current_user)):
    projects = db.query(Project).all()
    results = []
    for p in projects:
        # Calculate or query match result for current user
        match_score = 92
        fit_scores = {
            "overall": 92,
            "skills": 96,
            "experience": 88,
            "learning": 91,
            "availability": 90
        }
        fit_reasons = [
            "Demonstrated Python & Pandas data cleaning experience",
            "Completed time-series modeling experiments",
            "Strong domain interest in environmental data analysis",
            "Sufficient weekly time commitment available"
        ]

        if current_user:
            m = db.query(MatchResult).filter(MatchResult.project_id == p.id, MatchResult.user_id == current_user.id).first()
            if m:
                match_score = int(m.score)
                fit_scores = {
                    "overall": int(m.score),
                    "skills": int(m.skill_match),
                    "experience": int(m.experience_match),
                    "learning": int(m.interest_match),
                    "availability": int(m.availability_match)
                }
                fit_reasons = m.strengths + ([m.explanation] if m.explanation else [])

        results.append({
            "id": p.id,
            "title": p.title,
            "sponsor": p.sponsor_name,
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
            "fitScores": fit_scores,
            "fitReasons": fit_reasons,
            "charterLocked": p.charter.locked if p.charter else False,
            "milestones": [
                {
                    "id": m.id,
                    "title": m.title,
                    "payout": m.payout,
                    "status": m.status,
                    "released": m.released,
                    "contributionsCount": len(m.contributions),
                    "distribution": m.distribution or []
                } for m in p.milestones
            ]
        })
    return results

@router.post("/create")
def create_problem(req: ProjectCreateRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
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
    db.commit()
    db.refresh(project)
    return {"message": "Research problem created", "id": project.id, "project": project}
