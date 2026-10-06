from sqlalchemy import Column, Integer, String, Boolean, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="student")  # student, expert, sponsor, admin
    avatar = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    institution = Column(String, nullable=True)
    skills = Column(JSON, default=list)
    research_interests = Column(JSON, default=list)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    memberships = relationship("ProjectMember", back_populates="user")
    contributions = relationship("Contribution", back_populates="contributor")
    ai_agents = relationship("AIAgent", back_populates="owner")
    passport = relationship("ResearchPassport", back_populates="user", uselist=False)


class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)  # e.g., "PW-1042"
    title = Column(String, nullable=False)
    sponsor_name = Column(String, nullable=False)
    sponsor_logo = Column(String, nullable=True)
    sponsor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    funding = Column(String, nullable=False)
    funding_raw = Column(Float, default=0.0)
    duration = Column(String, nullable=False)
    confidentiality = Column(String, default="Controlled Access")
    status = Column(String, default="Recruiting")  # Recruiting, Active, Completed
    is_monetary = Column(Boolean, default=True)
    progress = Column(Integer, default=0)
    description = Column(Text, nullable=False)
    skills_required = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    members = relationship("ProjectMember", back_populates="project")
    charter = relationship("ProjectCharter", back_populates="project", uselist=False)
    milestones = relationship("Milestone", back_populates="project")
    contributions = relationship("Contribution", back_populates="project")
    ai_agents = relationship("AIAgent", back_populates="project")
    disputes = relationship("Dispute", back_populates="project")


class MatchResult(Base):
    __tablename__ = "match_results"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    score = Column(Float, nullable=False)
    skill_match = Column(Float, nullable=False)
    interest_match = Column(Float, nullable=False)
    experience_match = Column(Float, nullable=False)
    availability_match = Column(Float, nullable=False)
    domain_match = Column(Float, nullable=False)
    strengths = Column(JSON, default=list)
    missing_skills = Column(JSON, default=list)
    explanation = Column(Text, nullable=False)


class ProjectMember(Base):
    __tablename__ = "project_members"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    role_in_project = Column(String, nullable=False)  # Lead Data Engineer, Mentor, Sponsor
    status = Column(String, default="Active")
    joined_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="members")
    user = relationship("User", back_populates="memberships")


class ProjectCharter(Base):
    __tablename__ = "project_charters"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), unique=True, index=True)
    problem_statement = Column(Text, nullable=False)
    objectives = Column(JSON, default=list)
    scope = Column(Text, nullable=False)
    confidentiality_terms = Column(Text, nullable=False)
    authorship_rules = Column(Text, nullable=False)
    ai_usage_rules = Column(Text, nullable=False)
    dispute_rules = Column(Text, nullable=False)
    locked = Column(Boolean, default=False)
    locked_at = Column(DateTime, nullable=True)
    accepted_by = Column(JSON, default=list)

    project = relationship("Project", back_populates="charter")
    amendments = relationship("CharterAmendment", back_populates="charter")


class CharterAmendment(Base):
    __tablename__ = "charter_amendments"

    id = Column(Integer, primary_key=True, index=True)
    charter_id = Column(Integer, ForeignKey("project_charters.id"), index=True)
    requested_by = Column(String, nullable=False)
    field_changed = Column(String, nullable=False)
    old_value = Column(Text, nullable=False)
    new_value = Column(Text, nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(String, default="Pending")  # Pending, Approved, Rejected
    created_at = Column(DateTime, default=datetime.utcnow)

    charter = relationship("ProjectCharter", back_populates="amendments")


class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(String, primary_key=True, index=True)  # e.g., "PW-1042-M1"
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    title = Column(String, nullable=False)
    payout = Column(String, nullable=False)
    payout_raw = Column(Float, default=0.0)
    status = Column(String, default="Pending")  # Pending, In Progress, Verified
    released = Column(Boolean, default=False)
    distribution = Column(JSON, default=list)

    project = relationship("Project", back_populates="milestones")
    contributions = relationship("Contribution", back_populates="milestone")
    rewards = relationship("Reward", back_populates="milestone")


class Contribution(Base):
    __tablename__ = "contributions"

    id = Column(String, primary_key=True, index=True)  # e.g., "CON-1001"
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    contribution_type = Column(String, nullable=False)  # Data, Code, Literature Review, Experiment, Mentoring
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    milestone_id = Column(String, ForeignKey("milestones.id"), nullable=True)
    contributor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    contributor_name = Column(String, nullable=False)
    contributor_role = Column(String, nullable=False)
    is_ai_assisted = Column(Boolean, default=False)
    ai_agent_id = Column(String, nullable=True)
    effort_hours = Column(Float, default=0.0)
    status = Column(String, default="Submitted")  # Draft, Submitted, Under Review, Validated, Rejected, Disputed
    credit_percentage = Column(Float, default=0.0)
    payout_share = Column(String, default="N/A")
    validator_name = Column(String, nullable=True)
    hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="contributions")
    milestone = relationship("Milestone", back_populates="contributions")
    contributor = relationship("User", back_populates="contributions")
    evidences = relationship("Evidence", back_populates="contribution")
    validations = relationship("Validation", back_populates="contribution")


class Evidence(Base):
    __tablename__ = "evidences"

    id = Column(String, primary_key=True, index=True)  # e.g., "EVI-801"
    contribution_id = Column(String, ForeignKey("contributions.id"), index=True)
    uploaded_by = Column(String, nullable=False)
    title = Column(String, nullable=False)
    evidence_type = Column(String, nullable=False)  # Git Commit, Dataset, Review Report, Test Logs
    description = Column(Text, nullable=True)
    location_ref = Column(String, nullable=False)
    hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    contribution = relationship("Contribution", back_populates="evidences")


class Validation(Base):
    __tablename__ = "validations"

    id = Column(Integer, primary_key=True, index=True)
    contribution_id = Column(String, ForeignKey("contributions.id"), index=True)
    validator_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    validator_name = Column(String, nullable=False)
    status = Column(String, nullable=False)  # Approved, Rejected, Needs Revision
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    contribution = relationship("Contribution", back_populates="validations")


class AIAgent(Base):
    __tablename__ = "ai_agents"

    id = Column(String, primary_key=True, index=True)  # e.g., "AI-101"
    name = Column(String, nullable=False)
    avatar = Column(String, default="🤖")
    human_owner_id = Column(Integer, ForeignKey("users.id"), index=True)
    human_owner_name = Column(String, nullable=False)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    scope = Column(Text, nullable=False)
    allowed_data = Column(JSON, default=list)
    allowed_actions = Column(JSON, default=list)
    blocked_actions = Column(JSON, default=list)
    status = Column(String, default="Active & Scoped")
    actions_completed = Column(Integer, default=0)

    owner = relationship("User", back_populates="ai_agents")
    project = relationship("Project", back_populates="ai_agents")


class AIActionLog(Base):
    __tablename__ = "ai_action_logs"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(String, ForeignKey("ai_agents.id"), index=True)
    agent_name = Column(String, nullable=False)
    human_owner = Column(String, nullable=False)
    requested_project_id = Column(String, nullable=False)
    target_resource = Column(String, nullable=False)
    action = Column(String, nullable=False)
    is_allowed = Column(Boolean, default=True)
    denial_reason = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(String, primary_key=True, index=True)  # e.g. "LOG-1001"
    timestamp = Column(String, nullable=False)
    actor_name = Column(String, nullable=False)
    actor_role = Column(String, nullable=False)
    action = Column(String, nullable=False)
    project_id = Column(String, index=True, nullable=True)
    evidence = Column(Text, nullable=False)
    event_type = Column(String, nullable=False)  # Human, AI Assistant, Governance, Security Alert
    validator = Column(String, nullable=True)
    credit = Column(String, default="N/A")
    payout_share = Column(String, default="N/A")
    status = Column(String, nullable=False)
    hash = Column(String, nullable=False)


class ResearchPassport(Base):
    __tablename__ = "research_passports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, index=True)
    passport_id = Column(String, unique=True, nullable=False)
    credibility_score = Column(Integer, default=85)
    verified_contributions = Column(Integer, default=0)
    projects_count = Column(Integer, default=0)
    expert_reviews = Column(Integer, default=0)
    ai_assisted_works = Column(Integer, default=0)
    peer_validations = Column(Integer, default=0)
    categories = Column(JSON, default=dict)
    skills = Column(JSON, default=list)
    verified_proof_artifacts = Column(JSON, default=list)

    user = relationship("User", back_populates="passport")


class Reward(Base):
    __tablename__ = "rewards"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    milestone_id = Column(String, ForeignKey("milestones.id"), index=True)
    title = Column(String, nullable=False)
    amount = Column(String, nullable=False)
    recipient_name = Column(String, nullable=False)
    credit_share = Column(String, nullable=False)
    status = Column(String, default="Pending")  # Pending, Approved, Released
    released_at = Column(DateTime, nullable=True)

    milestone = relationship("Milestone", back_populates="rewards")


class Dispute(Base):
    __tablename__ = "disputes"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True)
    contribution_id = Column(String, ForeignKey("contributions.id"), index=True)
    contribution_title = Column(String, nullable=False)
    raised_by = Column(String, nullable=False)
    reason = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    evidence_ref = Column(String, nullable=True)
    status = Column(String, default="Submitted")  # Submitted, Under Review, Evidence Review, Decision, Resolved
    decision_note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="disputes")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String, default="info")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
