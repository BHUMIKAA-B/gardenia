from sqlalchemy.orm import Session
from .models import (
    User, Project, ProjectMember, ProjectCharter, Milestone,
    Contribution, Evidence, Validation, AIAgent, AuditEvent,
    ResearchPassport, Reward, Dispute, MatchResult
)
from .auth import hash_password

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).first():
        return

    print("Seeding database with demo data...")

    # 1. Users
    user_admin = User(
        email="admin@proofweave.ai",
        hashed_password=hash_password("admin123"),
        full_name="ProofWeave Admin",
        role="admin",
        avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        bio="Lead Governance & Platform Admin",
        institution="ProofWeave Foundation",
        skills=["Platform Governance", "Audit Review", "Security"],
        research_interests=["Trust Systems", "Research Integrity"],
        is_verified=True
    )
    
    user_bhumikaa = User(
        email="bhumikaa@proofweave.ai",
        hashed_password=hash_password("bhumikaa123"),
        full_name="Bhumikaa B",
        role="student",
        avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        bio="Student Researcher & Lead Data Engineer specializing in environmental ML models.",
        institution="GCU Tech Institute",
        skills=["Python", "Machine Learning", "Data Analysis", "Time-Series Modeling", "SQL", "Pandas"],
        research_interests=["Water Quality Prediction", "Environmental Data Pipelines", "Predictive Analytics"],
        is_verified=True
    )

    user_aarav = User(
        email="aarav@proofweave.ai",
        hashed_password=hash_password("aarav123"),
        full_name="Aarav Patel",
        role="student",
        avatar="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        bio="Student Researcher focused on Neural Networks and Time-Series forecast architectures.",
        institution="GCU Tech Institute",
        skills=["Python", "PyTorch", "LSTM", "Time-Series Modeling", "Machine Learning"],
        research_interests=["Neural Time-Series Forecasting", "AI Literature Extraction"],
        is_verified=True
    )

    user_meera = User(
        email="meera@proofweave.ai",
        hashed_password=hash_password("meera123"),
        full_name="Dr. Meera Rao",
        role="expert",
        avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        bio="Senior Hydrology & Environmental Data Scientist with 15+ years experience.",
        institution="AquaNova Research Labs",
        skills=["Environmental Research", "Hydrology", "Peer Review", "Data Validation"],
        research_interests=["Urban Water Quality", "Sensors Validation", "Research Governance"],
        is_verified=True
    )

    user_sponsor = User(
        email="sponsor@aquanova.ai",
        hashed_password=hash_password("sponsor123"),
        full_name="AquaNova Research Director",
        role="sponsor",
        avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        bio="AquaNova Research Labs Lead Program Director.",
        institution="AquaNova Labs",
        skills=["Research Management", "Sponsorship", "Resource Allocation"],
        research_interests=["Urban Sustainability", "Clean Water Technology"],
        is_verified=True
    )

    db.add_all([user_admin, user_bhumikaa, user_aarav, user_meera, user_sponsor])
    db.commit()

    # Refresh IDs
    db.refresh(user_bhumikaa)
    db.refresh(user_aarav)
    db.refresh(user_meera)
    db.refresh(user_sponsor)

    # 2. Projects
    p1 = Project(
        id="PW-1042",
        title="AI-Assisted Urban Water Quality Prediction",
        sponsor_name="AquaNova Research Labs",
        sponsor_logo="💧",
        sponsor_id=user_sponsor.id,
        funding="₹1,00,000",
        funding_raw=100000.0,
        duration="6 weeks",
        confidentiality="Controlled Access",
        status="Recruiting",
        is_monetary=True,
        progress=35,
        description="Build machine learning models to forecast urban water contamination risk using historical sensor telemetry, rainfall patterns, and chemical indicators.",
        skills_required=["Machine Learning", "Python", "Data Analysis", "Time-Series Modeling", "Environmental Research"]
    )

    p2 = Project(
        id="PW-1088",
        title="Privacy-Preserving Genomic Data Sharing",
        sponsor_name="BioHelix Research Institute",
        sponsor_logo="🧬",
        sponsor_id=user_sponsor.id,
        funding="₹2,50,000",
        funding_raw=250000.0,
        duration="10 weeks",
        confidentiality="Strictly Confidential",
        status="Active",
        is_monetary=True,
        progress=60,
        description="Developing zero-knowledge privacy protocols for sharing genomic research datasets across participating health institutions without exposing raw data.",
        skills_required=["Cryptography", "Python", "Rust", "Genomics"]
    )

    p3 = Project(
        id="PW-1092",
        title="Open Coastal Flood Risk & Mapping Framework",
        sponsor_name="Global Earth Foundation",
        sponsor_logo="🌍",
        sponsor_id=user_sponsor.id,
        funding="Non-Monetary (Open Research Challenge)",
        funding_raw=0.0,
        duration="8 weeks",
        confidentiality="Public Domain",
        status="Recruiting",
        is_monetary=False,
        progress=10,
        description="Building an open geospatial map dashboard to help coastal communities assess sea-level flood risk using open satellite observations.",
        skills_required=["GIS", "Python", "React", "Remote Sensing"]
    )

    db.add_all([p1, p2, p3])
    db.commit()

    # 3. Match Explanations
    m1 = MatchResult(
        project_id="PW-1042",
        user_id=user_bhumikaa.id,
        score=92.0,
        skill_match=94.0,
        interest_match=91.0,
        experience_match=89.0,
        availability_match=93.0,
        domain_match=90.0,
        strengths=["Machine Learning", "Python", "Data Analysis", "Time-Series Modeling"],
        missing_skills=["Environmental Research"],
        explanation="Strong match because the researcher has Machine Learning, Python and Time-Series Modeling experience. Environmental Research is the main skill gap."
    )
    db.add(m1)

    # 4. Project Members
    pm1 = ProjectMember(project_id="PW-1042", user_id=user_bhumikaa.id, role_in_project="Lead Data Engineer", status="Active")
    pm2 = ProjectMember(project_id="PW-1042", user_id=user_aarav.id, role_in_project="ML Developer", status="Active")
    pm3 = ProjectMember(project_id="PW-1042", user_id=user_meera.id, role_in_project="Domain Mentor", status="Active")
    db.add_all([pm1, pm2, pm3])

    # 5. Project Charter
    charter = ProjectCharter(
        project_id="PW-1042",
        problem_statement="Collaborative research lacks a unified trust layer for attribution, evidence, access control, and fair credit in urban water contamination prediction.",
        objectives=[
            "Clean and validate 12,400 water quality sensor telemetry records.",
            "Train an LSTM neural network model forecasting 48-hour contamination spikes.",
            "Deliver an open, verifiable dataset validation report & commit log."
        ],
        scope="PW-1042 Workspace only. Strictly restricted from cross-project data access.",
        confidentiality_terms="Controlled access to AquaNova sensor telemetry. No public distribution without approval.",
        authorship_rules="Co-authorship awarded based on verified contribution credit (>15%).",
        ai_usage_rules="AI agents must have named human owners. AI cannot hold independent credit.",
        dispute_rules="Disputes handled via Expert Review Board.",
        locked=True,
        accepted_by=["Student: Bhumikaa B", "Student: Aarav Patel", "Mentor: Dr. Meera Rao", "Sponsor: AquaNova Research Labs"]
    )
    db.add(charter)

    # 6. Milestones
    m_1 = Milestone(
        id="PW-1042-M1",
        project_id="PW-1042",
        title="Milestone 1: Data Cleaning & Preprocessing Pipeline",
        payout="₹40,000",
        payout_raw=40000.0,
        status="Verified",
        released=True,
        distribution=[
            {"name": "Bhumikaa B", "percent": 18, "role": "Lead Data Engineer"},
            {"name": "Aarav Patel", "percent": 12, "role": "Research Student"},
            {"name": "Dr. Meera Rao", "percent": 7, "role": "Domain Mentor"},
            {"name": "Literature Scout Agent (AI)", "percent": 5, "owner": "Aarav Patel", "role": "AI Assistant"}
        ]
    )

    m_2 = Milestone(
        id="PW-1042-M2",
        project_id="PW-1042",
        title="Milestone 2: Prediction Model & Field Validation",
        payout="₹35,000",
        payout_raw=35000.0,
        status="In Progress",
        released=False,
        distribution=[
            {"name": "Aarav Patel", "percent": 22, "role": "Lead ML Developer"},
            {"name": "Bhumikaa B", "percent": 15, "role": "Data Pipeline"},
            {"name": "Dr. Meera Rao", "percent": 8, "role": "Domain Reviewer"}
        ]
    )

    m_3 = Milestone(
        id="PW-1042-M3",
        project_id="PW-1042",
        title="Milestone 3: Final Deliverable & Report",
        payout="₹25,000",
        payout_raw=25000.0,
        status="Pending",
        released=False,
        distribution=[]
    )

    db.add_all([m_1, m_2, m_3])
    db.commit()

    # 7. Contributions & Evidence
    c1 = Contribution(
        id="CON-1001",
        title="Validated 12,400 water-quality records",
        description="Cleaned sensor telemetry, removed noisy outlier spikes, handled missing timestamps, and built unit-tested dataset pipeline.",
        contribution_type="Data Analysis",
        project_id="PW-1042",
        milestone_id="PW-1042-M1",
        contributor_id=user_bhumikaa.id,
        contributor_name="Bhumikaa B",
        contributor_role="Student Researcher",
        is_ai_assisted=False,
        effort_hours=24.0,
        status="Validated",
        credit_percentage=18.0,
        payout_share="₹18,000",
        validator_name="Dr. Meera Rao",
        hash="a91f82c4"
    )

    c2 = Contribution(
        id="CON-1002",
        title="Literature Summary: Water Contamination Forecasting Models",
        description="Extracted methodology parameters from 8 published water research papers to guide model feature selection.",
        contribution_type="Literature Review",
        project_id="PW-1042",
        milestone_id="PW-1042-M1",
        contributor_id=user_aarav.id,
        contributor_name="Literature Scout Agent (AI)",
        contributor_role="AI Assistant (Human Owner: Aarav Patel)",
        is_ai_assisted=True,
        ai_agent_id="AI-101",
        effort_hours=4.0,
        status="Validated",
        credit_percentage=5.0,
        payout_share="Attributed to Team",
        validator_name="Aarav Patel",
        hash="3a9211cd"
    )

    c3 = Contribution(
        id="CON-1003",
        title="Methodology Validation & Outlier Formula Review",
        description="Domain mentor peer review confirming mathematical accuracy of outlier detection formula for contamination telemetry.",
        contribution_type="Mentoring",
        project_id="PW-1042",
        milestone_id="PW-1042-M1",
        contributor_id=user_meera.id,
        contributor_name="Dr. Meera Rao",
        contributor_role="Domain Mentor",
        is_ai_assisted=False,
        effort_hours=8.0,
        status="Validated",
        credit_percentage=7.0,
        payout_share="₹7,000",
        validator_name="AquaNova Research Board",
        hash="91ccef02"
    )

    db.add_all([c1, c2, c3])
    db.commit()

    e1 = Evidence(
        id="EVI-801",
        contribution_id="CON-1001",
        uploaded_by="Bhumikaa B",
        title="Dataset Validation Report",
        evidence_type="Report PDF",
        description="Comprehensive 12-page statistical validation of 12,400 water telemetry records.",
        location_ref="reports/dataset_validation_pw1042.pdf",
        hash="sha256-a91f82c40001"
    )
    e2 = Evidence(
        id="EVI-802",
        contribution_id="CON-1001",
        uploaded_by="Bhumikaa B",
        title="Git Commit #A91F",
        evidence_type="Git Commit",
        description="Git commit containing data processing pipeline script and 14 passing pytest assertions.",
        location_ref="github.com/aquanova/pw-1042/commit/a91f82c",
        hash="sha256-a91f82c40002"
    )

    db.add_all([e1, e2])

    v1 = Validation(
        contribution_id="CON-1001",
        validator_id=user_meera.id,
        validator_name="Dr. Meera Rao",
        status="Approved",
        comment="Data pipeline verified. Outlier threshold matches hydrological safety parameters."
    )
    db.add(v1)

    # 8. AI Agents
    ai1 = AIAgent(
        id="AI-101",
        name="Literature Scout Agent",
        avatar="📚",
        human_owner_id=user_aarav.id,
        human_owner_name="Aarav Patel",
        project_id="PW-1042",
        scope="Project literature folder & public research paper APIs for PW-1042",
        allowed_data=["Approved Research PDFs", "Public Research Repositories"],
        allowed_actions=["Summarize research papers", "Extract methodology parameters", "Compile reference citations"],
        blocked_actions=["Access other projects", "Modify code without human review", "Initiate financial transactions"],
        status="Active & Scoped",
        actions_completed=14
    )

    ai2 = AIAgent(
        id="AI-102",
        name="Data Quality Assistant",
        avatar="🔍",
        human_owner_id=user_bhumikaa.id,
        human_owner_name="Bhumikaa B",
        project_id="PW-1042",
        scope="Water Sensor CSV files in PW-1042 workspace",
        allowed_data=["Water Sensor Telemetry CSVs"],
        allowed_actions=["Identify data outliers", "Flag missing timestamps", "Generate summary statistics"],
        blocked_actions=["Edit raw source files without git commit", "Read sponsor private credentials"],
        status="Active & Scoped",
        actions_completed=22
    )

    db.add_all([ai1, ai2])

    # 9. Audit Events
    log1 = AuditEvent(
        id="LOG-1001",
        timestamp="2026-10-04 14:32 UTC",
        actor_name="Bhumikaa B",
        actor_role="Student Researcher",
        action="Validated 12,400 water-quality records",
        project_id="PW-1042",
        evidence="Dataset Validation Report + Git Commit #A91F",
        event_type="Human",
        validator="Dr. Meera Rao",
        credit="18%",
        payout_share="₹18,000",
        status="Verified",
        hash="a91f82c4"
    )

    log2 = AuditEvent(
        id="LOG-1002",
        timestamp="2026-10-04 16:15 UTC",
        actor_name="Literature Scout Agent (AI)",
        actor_role="AI Assistant (Human Owner: Aarav Patel)",
        action="Literature Summary: Parsed 8 water research papers",
        project_id="PW-1042",
        evidence="Summary Report #LS-21 • Reference citations extracted",
        event_type="AI Assistant",
        validator="Aarav Patel (Human Owner)",
        credit="5%",
        payout_share="Attributed to Team",
        status="Verified",
        hash="3a9211cd"
    )

    log3 = AuditEvent(
        id="LOG-1003",
        timestamp="2026-10-05 09:04 UTC",
        actor_name="Dr. Meera Rao",
        actor_role="Domain Mentor",
        action="Methodology Peer Review & Outlier Formula Validation",
        project_id="PW-1042",
        evidence="Review Report #MR-09 • Signed Verification",
        event_type="Human",
        validator="AquaNova Research Board",
        credit="7%",
        payout_share="₹7,000",
        status="Verified",
        hash="91ccef02"
    )

    log4 = AuditEvent(
        id="LOG-1004",
        timestamp="2026-10-05 14:10 UTC",
        actor_name="PROJECT CHARTER ENGINE",
        actor_role="Governance Engine",
        action="Project Charter Signed & Locked by All Participants",
        project_id="PW-1042",
        evidence="Multi-party cryptographic digital acceptance log",
        event_type="Governance",
        validator="All 4 Project Stakeholders",
        credit="N/A",
        payout_share="N/A",
        status="Locked",
        hash="001199ee"
    )

    log5 = AuditEvent(
        id="LOG-1005",
        timestamp="2026-10-05 14:15 UTC",
        actor_name="AI SCOPE SENTINEL",
        actor_role="Security Governance",
        action="Restricted Access Blocked (Literature Scout Agent AI -> PW-1088)",
        project_id="PW-1088",
        evidence="Attempted unauthorized cross-project file access on confidential genomic repository",
        event_type="Security Alert",
        validator="Project Scope Rule #88",
        credit="N/A",
        payout_share="N/A",
        status="ACCESS DENIED (Logged)",
        hash="ff008821"
    )

    db.add_all([log1, log2, log3, log4, log5])

    # 10. Research Passports
    rp_bhumikaa = ResearchPassport(
        user_id=user_bhumikaa.id,
        passport_id="RP-2026-8842",
        credibility_score=92,
        verified_contributions=18,
        projects_count=4,
        expert_reviews=7,
        ai_assisted_works=5,
        peer_validations=9,
        categories={
            "research": 88,
            "engineering": 96,
            "experimentation": 91,
            "documentation": 85,
            "review": 78,
            "mentorship": 72
        },
        skills=["Python", "Machine Learning", "Data Analysis", "SQL", "Pandas", "Time-Series Modeling"],
        verified_proof_artifacts=[
            {
                "id": "ART-801",
                "project": "PW-1042 Urban Water Quality",
                "title": "Sensor Data Cleaning & Preprocessing Script (12,400 records)",
                "type": "Git Commit & Unit Tests",
                "hash": "commit #a91f82c",
                "date": "04 Oct 2026",
                "validator": "Dr. Meera Rao (Domain Mentor)",
                "creditShare": "18%",
                "status": "Verified"
            }
        ]
    )

    rp_aarav = ResearchPassport(
        user_id=user_aarav.id,
        passport_id="RP-2026-3910",
        credibility_score=88,
        verified_contributions=14,
        projects_count=3,
        expert_reviews=5,
        ai_assisted_works=8,
        peer_validations=7,
        categories={
            "research": 94,
            "engineering": 86,
            "experimentation": 92,
            "documentation": 88,
            "review": 74,
            "mentorship": 68
        },
        skills=["Python", "PyTorch", "LSTM", "Time-Series", "Scikit-Learn"],
        verified_proof_artifacts=[
            {
                "id": "ART-805",
                "project": "PW-1042 Urban Water Quality",
                "title": "LSTM Contamination Prediction Model Implementation",
                "type": "Git Commit & Model File",
                "hash": "commit #b40c991",
                "date": "05 Oct 2026",
                "validator": "Dr. Meera Rao (Domain Mentor)",
                "creditShare": "22%",
                "status": "Verified"
            }
        ]
    )

    db.add_all([rp_bhumikaa, rp_aarav])

    # 11. Rewards
    r1 = Reward(
        id="REW-901",
        project_id="PW-1042",
        milestone_id="PW-1042-M1",
        title="Milestone 1 Data Pipeline Payout",
        amount="₹18,000",
        recipient_name="Bhumikaa B",
        credit_share="18%",
        status="Released"
    )
    r2 = Reward(
        id="REW-902",
        project_id="PW-1042",
        milestone_id="PW-1042-M1",
        title="Milestone 1 Mentor Allocation",
        amount="₹7,000",
        recipient_name="Dr. Meera Rao",
        credit_share="7%",
        status="Released"
    )
    db.add_all([r1, r2])

    # 12. Dispute
    disp = Dispute(
        id="DISP-101",
        project_id="PW-1042",
        contribution_id="CON-1001",
        contribution_title="Validated 12,400 water-quality records",
        raised_by="External Peer Reviewer",
        reason="Attribution Weight Disagreement",
        description="Query regarding credit share split between automated data cleaning script and manual domain outlier verification.",
        status="Resolved",
        decision_note="Reviewed by Dr. Meera Rao. 18% credit share confirmed for Bhumikaa B based on unit test coverage & script design."
    )
    db.add(disp)

    db.commit()
    print("Database seeded successfully!")
