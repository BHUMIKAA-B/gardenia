from sqlalchemy.orm import Session
from .models import (
    User, Project, ProjectMember, ProjectCharter, Milestone,
    Contribution, Evidence, Validation, AIAgent, AuditEvent,
    ResearchPassport, Reward, Dispute, MatchResult,
    Conversation, ConversationParticipant, Message, WorkUpdate,
    ReplacementRequest, ReplacementCandidate, HandoverSession, Notification
)
from .auth import hash_password

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).first():
        return

    print("Seeding database with demo data...")

    # 1. Users
    user_admin = User(
        email="admin@proofweave.io",
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
        email="bhumikaa@proofweave.io",
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
        email="aarav@proofweave.io",
        hashed_password=hash_password("aarav123"),
        full_name="Aarav Patel",
        role="mentor",
        avatar="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        bio="Mentor focused on Neural Networks and Time-Series forecast architectures.",
        institution="GCU Tech Institute",
        skills=["Python", "PyTorch", "LSTM", "Time-Series Modeling", "Machine Learning", "Mentoring"],
        research_interests=["Neural Time-Series Forecasting", "AI Literature Extraction"],
        is_verified=True
    )

    user_meera = User(
        email="meera@proofweave.io",
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
        email="sponsor@aquanova.io",
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
    pm1 = ProjectMember(project_id="PW-1042", user_id=user_bhumikaa.id, role_in_project="Student", status="Active")
    pm2 = ProjectMember(project_id="PW-1042", user_id=user_aarav.id, role_in_project="Mentor", status="Active")
    pm3 = ProjectMember(project_id="PW-1042", user_id=user_meera.id, role_in_project="Expert", status="Active")
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
        accepted_by=["Student: Bhumikaa B", "Mentor: Aarav Patel", "Expert: Dr. Meera Rao", "Sponsor: AquaNova Research Labs"]
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
            {"name": "Aarav Patel", "percent": 22, "role": "Mentor"},
            {"name": "Bhumikaa B", "percent": 15, "role": "Student"},
            {"name": "Dr. Meera Rao", "percent": 8, "role": "Expert"}
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
        contributor_role="Expert",
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

    db.add(ai1)

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
    db.add(log1)

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
    db.add(rp_bhumikaa)

    # 11. Rewards & Disputes
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
    db.add(r1)

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

    # 12. Chat Conversations & Messages
    # Conversation 1: Student ↔ Mentor (Bhumikaa B & Aarav Patel)
    conv1 = Conversation(
        id="CONV-101",
        project_id="PW-1042",
        project_title="AI-Assisted Urban Water Quality Prediction",
        title="PW-1042: Student ↔ Mentor Discussion"
    )
    # Conversation 2: Mentor ↔ Expert (Aarav Patel & Dr. Meera Rao)
    conv2 = Conversation(
        id="CONV-102",
        project_id="PW-1042",
        project_title="AI-Assisted Urban Water Quality Prediction",
        title="PW-1042: Mentor ↔ Expert Sync"
    )
    # Conversation 3: Expert ↔ Sponsor (Dr. Meera Rao & AquaNova Director)
    conv3 = Conversation(
        id="CONV-103",
        project_id="PW-1042",
        project_title="AI-Assisted Urban Water Quality Prediction",
        title="PW-1042: Expert ↔ Sponsor Sync"
    )
    db.add_all([conv1, conv2, conv3])
    db.commit()

    # Participants for CONV-101 (Student ↔ Mentor)
    cp1 = ConversationParticipant(conversation_id="CONV-101", user_id=user_bhumikaa.id, user_name="Bhumikaa B", user_role="Student")
    cp2 = ConversationParticipant(conversation_id="CONV-101", user_id=user_aarav.id, user_name="Aarav Patel", user_role="Mentor")
    
    # Participants for CONV-102 (Mentor ↔ Expert)
    cp3 = ConversationParticipant(conversation_id="CONV-102", user_id=user_aarav.id, user_name="Aarav Patel", user_role="Mentor")
    cp4 = ConversationParticipant(conversation_id="CONV-102", user_id=user_meera.id, user_name="Dr. Meera Rao", user_role="Expert")

    # Participants for CONV-103 (Expert ↔ Sponsor)
    cp5 = ConversationParticipant(conversation_id="CONV-103", user_id=user_meera.id, user_name="Dr. Meera Rao", user_role="Expert")
    cp6 = ConversationParticipant(conversation_id="CONV-103", user_id=user_sponsor.id, user_name="AquaNova Research Director", user_role="Sponsor")

    db.add_all([cp1, cp2, cp3, cp4, cp5, cp6])

    # Messages for CONV-101
    msg1 = Message(
        id="MSG-101",
        conversation_id="CONV-101",
        sender_id=user_bhumikaa.id,
        sender_name="Bhumikaa B",
        sender_role="Student",
        text="Hello Dr. Meera, I have completed validating the 12,400 water telemetry records. Attached the validation report.",
        attachment_ref="Dataset Validation Report #EV-1024",
        is_read=True
    )
    msg2 = Message(
        id="MSG-102",
        conversation_id="CONV-101",
        sender_id=user_aarav.id,
        sender_name="Aarav Patel",
        sender_role="Mentor",
        text="Great work Bhumikaa! Please review the 7% timestamp inconsistencies in sector B before feature engineering.",
        is_read=True
    )

    # Messages for CONV-102 (Mentor ↔ Expert)
    msg3 = Message(
        id="MSG-201",
        conversation_id="CONV-102",
        sender_id=user_aarav.id,
        sender_name="Aarav Patel",
        sender_role="Mentor",
        text="Dr. Meera, the student has completed the dataset validation. Could you review the evidence?",
        attachment_ref="Dataset Validation Report #EV-1024",
        is_read=True
    )
    msg4 = Message(
        id="MSG-202",
        conversation_id="CONV-102",
        sender_id=user_meera.id,
        sender_name="Dr. Meera Rao",
        sender_role="Expert",
        text="Will review the evidence.",
        is_read=True
    )

    # Messages for CONV-103 (Expert ↔ Sponsor)
    msg5 = Message(
        id="MSG-301",
        conversation_id="CONV-103",
        sender_id=user_meera.id,
        sender_name="Dr. Meera Rao",
        sender_role="Expert",
        text="Director, Milestone 1 telemetry dataset validation is complete.",
        attachment_ref="Milestone 1 Validation Audit #LOG-1001",
        is_read=True
    )

    db.add_all([msg1, msg2, msg3, msg4, msg5])

    # 13. Work Updates
    up1 = WorkUpdate(
        id="UPD-101",
        project_id="PW-1042",
        author_id=user_bhumikaa.id,
        author_name="Bhumikaa B",
        author_role="Student",
        update_type="Daily",
        date="2026-10-06",
        summary="Validated missing values in water quality dataset and completed 12,400 record review.",
        work_completed="Reviewed 12,400 records, applied linear interpolation on missing sensor readings.",
        challenges="7% records contained inconsistent timestamps in sector B.",
        next_steps="Complete timestamp normalization and begin temporal feature generation.",
        evidence_ref="Dataset Validation Report #a91f82c4",
        effort_hours=5.0,
        milestone_progress=55,
        status="Reviewed",
        reviewer_name="Dr. Meera Rao",
        reviewer_comment="Approved. Please document the timestamp normalization methodology."
    )
    db.add(up1)

    # 14. Replacement Request & Candidates
    rep1 = ReplacementRequest(
        id="REP-101",
        project_id="PW-1042",
        project_title="AI-Assisted Urban Water Quality Prediction",
        requester_id=user_bhumikaa.id,
        requester_name="Bhumikaa B",
        requester_role="Student",
        reason="Academic exam schedule constraint for upcoming 4 weeks.",
        required_skills=["Python", "Machine Learning", "Data Analysis", "Time-Series Modeling"],
        progress_pct=62,
        last_milestone="Milestone 1 — Data Validation",
        status="Approved",
        approved_candidate_id=user_aarav.id,
        approved_candidate_name="Aarav Patel"
    )
    db.add(rep1)

    cand1 = ReplacementCandidate(
        replacement_id="REP-101",
        user_id=user_aarav.id,
        user_name="Aarav Patel",
        match_score=94.0,
        status="Approved"
    )
    db.add(cand1)

    # 15. Handover Session
    ho1 = HandoverSession(
        id="HO-101",
        project_id="PW-1042",
        replacement_id="REP-101",
        requester_name="Bhumikaa B",
        replacement_name="Aarav Patel",
        status="Completed",
        completed_tasks=[
          "Dataset cleaning & validation (12,400 sensor records)",
          "Missing-value analysis & timestamp normalization",
          "Literature Scout AI paper summarization (34 papers)"
        ],
        pending_tasks=[
          "Temporal feature engineering (rainfall/spikes)",
          "Train 48-hour LSTM forecasting model",
          "Comparative benchmark evaluation report"
        ],
        key_findings=[
          "12,400 telemetry records cleaned & validated.",
          "7% timestamp inconsistencies resolved via linear interpolation.",
          "Strong seasonal contamination correlation detected in historical logs."
        ],
        known_issues="Sensor anomaly noise in sector B telemetry logs requiring time-series clipping.",
        expert_guidance="Dr. Meera Rao recommended time-based validation split over random cross-validation.",
        authorized_artifacts=[
          {"title": "Dataset Validation Report", "ref": "SHA: a91f82c4", "verified": True},
          {"title": "Literature Scout AI Summaries", "ref": "34 paper summaries", "verified": True},
          {"title": "LSTM Neural Net Baseline Model", "ref": "Git commit #b3e1cc78", "verified": True}
        ],
        ai_summary="AI Handover Assistant gathered 4 authorized evidence artifacts, 3 completed milestones, and 3 pending tasks for seamless research continuity.",
        next_recommended_action="Begin temporal feature engineering and inspect Dataset Validation Report #a91f82c4."
    )
    db.add(ho1)

    # 16. Notifications
    n1 = Notification(
        user_id=user_bhumikaa.id,
        title="New Research Problem Posted",
        message="AquaNova Research Labs posted 'AI-Assisted Urban Water Quality Prediction' (92% skill match).",
        category="Research Problem",
        related_project_id="PW-1042",
        is_read=True
    )
    n2 = Notification(
        user_id=user_aarav.id,
        title="Project Access Granted — AI Handover Ready",
        message="You are approved as replacement researcher for PW-1042. AI Handover Assistant onboarding brief is ready.",
        category="AI Handover",
        related_project_id="PW-1042",
        is_read=False
    )
    db.add_all([n1, n2])

    db.commit()
    print("Database seeded successfully with workflow data!")
