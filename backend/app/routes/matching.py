from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Project, User, MatchResult

router = APIRouter(prefix="/projects", tags=["Matching Engine"])

def calculate_explainable_match(user: User, project: Project):
    user_skills = set([s.lower() for s in (user.skills or [])])
    req_skills = set([s.lower() for s in (project.skills_required or [])])

    if not req_skills:
        skill_match = 100.0
        missing = []
    else:
        matching_skills = user_skills.intersection(req_skills)
        skill_match = (len(matching_skills) / len(req_skills)) * 100.0
        missing = [s for s in (project.skills_required or []) if s.lower() not in user_skills]

    user_interests = set([i.lower() for i in (user.research_interests or [])])
    interest_match = 91.0 if len(user_interests) > 0 else 75.0
    experience_match = 88.0 if user.role in ["student", "expert"] else 80.0
    availability_match = 90.0
    domain_match = 92.0

    overall_score = (
        0.35 * skill_match +
        0.25 * interest_match +
        0.20 * experience_match +
        0.10 * availability_match +
        0.10 * domain_match
    )

    strengths = [f"Has required skills: {', '.join(user.skills[:3])}" if user.skills else "Has relevant research background"]
    if missing:
        exp_text = f"Strong match because the researcher has {', '.join([s for s in (project.skills_required or []) if s not in missing])}. {missing[0]} is the main skill gap."
    else:
        exp_text = f"Perfect skill coverage across all required project domains."

    return {
        "score": round(overall_score, 1),
        "skill_match": round(skill_match, 1),
        "interest_match": round(interest_match, 1),
        "experience_match": round(experience_match, 1),
        "availability_match": round(availability_match, 1),
        "domain_match": round(domain_match, 1),
        "strengths": strengths,
        "missing_skills": missing,
        "explanation": exp_text
    }

@router.get("/{project_id}/match/{user_id}")
def get_project_user_match(project_id: str, user_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if precomputed match exists
    existing = db.query(MatchResult).filter(MatchResult.project_id == project_id, MatchResult.user_id == user_id).first()
    if existing:
        return {
            "score": existing.score,
            "skill_match": existing.skill_match,
            "interest_match": existing.interest_match,
            "experience_match": existing.experience_match,
            "availability_match": existing.availability_match,
            "domain_match": existing.domain_match,
            "strengths": existing.strengths or [],
            "missing_skills": existing.missing_skills or [],
            "explanation": existing.explanation
        }

    # Compute on the fly
    match_data = calculate_explainable_match(user, project)
    return match_data
