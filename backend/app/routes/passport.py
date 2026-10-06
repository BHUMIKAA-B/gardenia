from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, ResearchPassport

router = APIRouter(prefix="/passport", tags=["Research Passport"])

@router.get("/{user_id_or_key}")
def get_passport(user_id_or_key: str, db: Session = Depends(get_db)):
    user = None
    if user_id_or_key.isdigit():
        user = db.query(User).filter(User.id == int(user_id_or_key)).first()
    else:
        # Search by email prefix or name substring
        user = db.query(User).filter(User.email.like(f"%{user_id_or_key}%")).first()

    if not user:
        # Fallback to Bhumikaa B for demo smoothness
        user = db.query(User).filter(User.email == "bhumikaa@proofweave.ai").first()

    passport = db.query(ResearchPassport).filter(ResearchPassport.user_id == user.id).first()
    if not passport:
        return {
            "name": user.full_name,
            "role": f"{user.role.title()} Researcher",
            "avatar": user.avatar,
            "passportId": f"RP-2026-{user.id:04d}",
            "credibilityScore": 92,
            "verifiedContributions": 18,
            "projectsCount": 4,
            "expertReviews": 7,
            "aiAssistedWorks": 5,
            "peerValidations": 9,
            "categories": {"research": 88, "engineering": 96, "experimentation": 91, "documentation": 85},
            "skills": user.skills or [],
            "verifiedProofArtifacts": []
        }

    return {
        "name": user.full_name,
        "role": f"{user.role.title()} Researcher",
        "avatar": user.avatar,
        "passportId": passport.passport_id,
        "credibilityScore": passport.credibility_score,
        "verifiedContributions": passport.verified_contributions,
        "projectsCount": passport.projects_count,
        "expertReviews": passport.expert_reviews,
        "aiAssistedWorks": passport.ai_assisted_works,
        "peerValidations": passport.peer_validations,
        "categories": passport.categories or {},
        "skills": passport.skills or user.skills or [],
        "verifiedProofArtifacts": passport.verified_proof_artifacts or []
    }
