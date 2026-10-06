export const SEED_PROJECTS = [
  {
    id: "PW-1042",
    title: "Urban Water Quality Contamination Prediction",
    sponsor: "AquaNova Research Labs",
    sponsorLogo: "💧",
    funding: "₹1,00,000",
    fundingRaw: 100000,
    duration: "6 weeks",
    confidentiality: "Controlled Access",
    status: "Recruiting",
    isMonetary: true,
    progress: 35,
    description: "Build machine learning models to forecast urban water contamination risk using historical sensor telemetry, rainfall patterns, and chemical indicators.",
    skillsRequired: ["Python", "Machine Learning", "Data Analysis", "Time-Series", "Environmental Science"],
    fitScores: {
      overall: 92,
      skills: 96,
      experience: 88,
      learning: 91,
      availability: 90
    },
    fitReasons: [
      "Demonstrated Python & Pandas data cleaning experience in previous coursework",
      "Completed time-series modeling experiments (LSTM / ARIMA)",
      "Strong domain interest in environmental data analysis",
      "Sufficient weekly time commitment available"
    ],
    charterLocked: true,
    charterAcceptedBy: ["Student: Bhumikaa B", "Student: Aarav Patel", "Mentor: Dr. Meera Rao", "Sponsor: AquaNova Research Labs"],
    milestones: [
      {
        id: "M1",
        title: "Milestone 1: Data Cleaning & Preprocessing Pipeline",
        payout: "₹40,000",
        status: "Verified",
        released: true,
        contributionsCount: 4,
        distribution: [
          { name: "Bhumikaa B", percent: 18, role: "Lead Data Engineer" },
          { name: "Aarav Patel", percent: 12, role: "Research Student" },
          { name: "Dr. Meera Rao", percent: 7, role: "Domain Mentor" },
          { name: "Literature Assistant (AI)", percent: 5, owner: "Aarav Patel", role: "AI Assistant" }
        ]
      },
      {
        id: "M2",
        title: "Milestone 2: Prediction Model & Field Validation",
        payout: "₹35,000",
        status: "In Progress",
        released: false,
        contributionsCount: 3,
        distribution: [
          { name: "Aarav Patel", percent: 22, role: "Lead ML Developer" },
          { name: "Bhumikaa B", percent: 15, role: "Data Pipeline" },
          { name: "Dr. Meera Rao", percent: 8, role: "Domain Reviewer" }
        ]
      },
      {
        id: "M3",
        title: "Milestone 3: Final Deliverable & Report",
        payout: "₹25,000",
        status: "Pending",
        released: false,
        contributionsCount: 0,
        distribution: []
      }
    ]
  },
  {
    id: "PW-1088",
    title: "Privacy-Preserving Genomic Data Sharing",
    sponsor: "BioHelix Research Institute",
    sponsorLogo: "🧬",
    funding: "₹2,50,000",
    fundingRaw: 250000,
    duration: "10 weeks",
    confidentiality: "Strictly Confidential",
    status: "Active",
    isMonetary: true,
    progress: 60,
    description: "Developing zero-knowledge privacy protocols for sharing genomic research datasets across participating health institutions without exposing raw data.",
    skillsRequired: ["Cryptography", "Python", "Rust", "Genomics"],
    fitScores: {
      overall: 84,
      skills: 82,
      experience: 86,
      learning: 89,
      availability: 80
    },
    fitReasons: [
      "Background in Python programming and security fundamentals",
      "High academic performance in distributed systems",
      "Assigned domain mentor for cryptography guidance"
    ],
    charterLocked: true,
    charterAcceptedBy: ["Student: Rohan V", "Mentor: Prof. K. Sharma", "Sponsor: BioHelix Institute"],
    milestones: []
  },
  {
    id: "PW-1092",
    title: "Open Coastal Flood Risk & Mapping Framework",
    sponsor: "Global Earth Foundation",
    sponsorLogo: "🌍",
    funding: "Non-Monetary (Open Research Challenge)",
    fundingRaw: 0,
    duration: "8 weeks",
    confidentiality: "Public Domain",
    status: "Recruiting",
    isMonetary: false,
    progress: 10,
    description: "Building an open geospatial map dashboard to help coastal communities assess sea-level flood risk using open satellite observations.",
    skillsRequired: ["GIS", "Python", "React", "Remote Sensing"],
    fitScores: {
      overall: 95,
      skills: 98,
      experience: 92,
      learning: 94,
      availability: 95
    },
    fitReasons: [
      "Direct match in GIS and geospatial data tools",
      "Active open-source contributor portfolio",
      "Eligible for Research Passport distinction"
    ],
    charterLocked: false,
    charterAcceptedBy: ["Sponsor: Global Earth Foundation"],
    milestones: []
  }
];

export const SEED_PASSPORTS = {
  bhumikaa: {
    name: "Bhumikaa B",
    role: "Student Researcher / Data Engineer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    passportId: "RP-2026-8842",
    credibilityScore: 92,
    verifiedContributions: 18,
    projectsCount: 4,
    expertReviews: 7,
    aiAssistedWorks: 5,
    peerValidations: 9,
    categories: {
      research: 88,
      engineering: 96,
      experimentation: 91,
      documentation: 85,
      review: 78,
      mentorship: 72
    },
    skills: ["Python", "Machine Learning", "Data Analysis", "SQL", "Pandas", "Computer Vision"],
    verifiedProofArtifacts: [
      {
        id: "ART-801",
        project: "PW-1042 Urban Water Quality",
        title: "Sensor Data Cleaning & Preprocessing Script (12,400 records)",
        type: "Git Commit & Unit Tests",
        hash: "commit #a91f82c",
        date: "04 Oct 2026",
        validator: "Dr. Meera Rao (Domain Mentor)",
        creditShare: "18%",
        status: "Verified"
      },
      {
        id: "ART-704",
        project: "PW-802 Crop Health Sentinel",
        title: "Crop Imagery Classification Model & Test Metrics",
        type: "Model Weights & Notebook",
        hash: "commit #e44129b",
        date: "14 Aug 2026",
        validator: "Prof. S. Nambiar",
        creditShare: "24%",
        status: "Verified"
      }
    ]
  },
  aarav: {
    name: "Aarav Patel",
    role: "Student Researcher / ML Developer",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    passportId: "RP-2026-3910",
    credibilityScore: 88,
    verifiedContributions: 14,
    projectsCount: 3,
    expertReviews: 5,
    aiAssistedWorks: 8,
    peerValidations: 7,
    categories: {
      research: 94,
      engineering: 86,
      experimentation: 92,
      documentation: 88,
      review: 74,
      mentorship: 68
    },
    skills: ["Python", "PyTorch", "LSTM", "Time-Series", "Scikit-Learn"],
    verifiedProofArtifacts: [
      {
        id: "ART-805",
        project: "PW-1042 Urban Water Quality",
        title: "LSTM Prediction Model Implementation",
        type: "Git Commit & Model File",
        hash: "commit #b40c991",
        date: "05 Oct 2026",
        validator: "Dr. Meera Rao (Domain Mentor)",
        creditShare: "22%",
        status: "Verified"
      }
    ]
  },
  meera: {
    name: "Dr. Meera Rao",
    role: "Domain Mentor / Senior Researcher",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    passportId: "RP-EXPERT-102",
    credibilityScore: 96,
    verifiedContributions: 42,
    projectsCount: 12,
    expertReviews: 34,
    aiAssistedWorks: 4,
    peerValidations: 29,
    categories: {
      research: 98,
      engineering: 78,
      experimentation: 94,
      documentation: 92,
      review: 99,
      mentorship: 96
    },
    skills: ["Environmental Science", "Hydrology", "Peer Review", "Research Governance"],
    verifiedProofArtifacts: [
      {
        id: "ART-REV-09",
        project: "PW-1042 Urban Water Quality",
        title: "Methodology Review & Outlier Formula Validation",
        type: "Expert Review Report",
        hash: "review #mr09918",
        date: "05 Oct 2026",
        validator: "AquaNova Research Board",
        creditShare: "7%",
        status: "Verified"
      }
    ]
  }
};

export const SEED_LEDGER = [
  {
    id: "LOG-1001",
    timestamp: "2026-10-04 14:32 UTC",
    contributor: "Bhumikaa B",
    role: "Student",
    action: "Data Preprocessing & Cleaning Pipeline",
    evidence: "Commit #a91f82c • Cleaned 12,400 sensor records • Unit tests passed",
    type: "Human",
    validator: "Dr. Meera Rao",
    credit: "18%",
    payoutShare: "₹18,000",
    status: "Verified",
    hash: "a91f82c4"
  },
  {
    id: "LOG-1002",
    timestamp: "2026-10-04 16:15 UTC",
    contributor: "Literature Assistant (AI)",
    role: "AI Assistant (Owner: Aarav Patel)",
    action: "Literature Summary: Parsed 8 water research papers",
    evidence: "Summary Report #LS-21 • Reference citations extracted",
    type: "AI Assistant",
    validator: "Aarav Patel (Owner)",
    credit: "5%",
    payoutShare: "Attributed to Team",
    status: "Verified",
    hash: "3a9211cd"
  },
  {
    id: "LOG-1003",
    timestamp: "2026-10-05 09:04 UTC",
    contributor: "Dr. Meera Rao",
    role: "Domain Mentor",
    action: "Methodology Validation & Outlier Formula Review",
    evidence: "Review Report #MR-09 • Signed Verification",
    type: "Human",
    validator: "AquaNova Research Board",
    credit: "7%",
    payoutShare: "₹7,000",
    status: "Verified",
    hash: "91ccef02"
  },
  {
    id: "LOG-1004",
    timestamp: "2026-10-05 11:20 UTC",
    contributor: "Aarav Patel",
    role: "Student",
    action: "LSTM Contamination Prediction Network Training",
    evidence: "Commit #b40c991 • Model Accuracy Evaluation",
    type: "Human",
    validator: "Dr. Meera Rao",
    credit: "22%",
    payoutShare: "In Escrow",
    status: "Verified",
    hash: "74ba88ef"
  },
  {
    id: "LOG-1005",
    timestamp: "2026-10-05 14:10 UTC",
    contributor: "PROJECT CHARTER ENGINE",
    role: "Governance",
    action: "Project Charter Signed & Locked by All Participants",
    evidence: "Multi-party acceptance log",
    type: "Governance",
    validator: "All 4 Participants",
    credit: "N/A",
    payoutShare: "N/A",
    status: "Locked",
    hash: "001199ee"
  },
  {
    id: "LOG-1006",
    timestamp: "2026-10-05 14:15 UTC",
    contributor: "SECURITY SYSTEM",
    role: "Security Sentinel",
    action: "Restricted Access Blocked (Literature Assistant AI)",
    evidence: "Attempted cross-project read on PW-1088 private files",
    type: "Security Alert",
    validator: "Project Scope Rule #88",
    credit: "N/A",
    payoutShare: "N/A",
    status: "Blocked & Logged",
    hash: "ff008821"
  }
];

export const SEED_AI_AGENTS = [
  {
    id: "AI-101",
    name: "Literature Assistant",
    avatar: "📚",
    humanOwner: "Aarav Patel",
    project: "PW-1042 Urban Water Quality",
    scope: "Project literature folder & public research paper APIs",
    allowedData: ["Approved Research PDFs", "Public Research Repositories"],
    allowedActions: ["Summarize research papers", "Extract methodology parameters", "Compile reference citations"],
    blockedActions: ["Access other projects", "Modify code without human review", "Initiate financial transactions"],
    status: "Active & Scoped",
    actionsCompleted: 14
  },
  {
    id: "AI-102",
    name: "Data Quality Assistant",
    avatar: "🔍",
    humanOwner: "Bhumikaa B",
    project: "PW-1042 Urban Water Quality",
    scope: "Project sensor CSV files",
    allowedData: ["Water Sensor Telemetry CSVs"],
    allowedActions: ["Identify data outliers", "Flag missing timestamps", "Generate summary statistics"],
    blockedActions: ["Edit raw source files without git commit", "Read sponsor private credentials"],
    status: "Active & Scoped",
    actionsCompleted: 22
  },
  {
    id: "AI-103",
    name: "Experiment Assistant",
    avatar: "🧪",
    humanOwner: "Aarav Patel",
    project: "PW-1042 Urban Water Quality",
    scope: "Model training notebook & config files",
    allowedData: ["Model Hyperparameter Configs", "Execution Logs"],
    allowedActions: ["Suggest parameter tuning", "Format results charts", "Draft experiment logs"],
    blockedActions: ["Submit final release without human approval", "Alter project charter terms"],
    status: "Active & Scoped",
    actionsCompleted: 9
  },
  {
    id: "AI-104",
    name: "Review Sentinel",
    avatar: "🛡️",
    humanOwner: "Dr. Meera Rao",
    project: "PW-1042 Urban Water Quality",
    scope: "Student git diffs & paper citations",
    allowedData: ["Submission Code Diffs", "Public Reference Indices"],
    allowedActions: ["Check citation sources", "Highlight unreferenced code snippets", "Format review checklists"],
    blockedActions: ["Approve milestones independently", "Modify contributor credit shares"],
    status: "Active & Scoped",
    actionsCompleted: 31
  }
];

export const PROOF_GRAPH_NODES = [
  {
    id: "node-problem",
    title: "Research Problem Posted",
    subtitle: "AquaNova Research Labs",
    category: "Problem",
    icon: "💧",
    color: "#2563eb",
    details: {
      owner: "Sponsor: AquaNova Research Labs",
      timestamp: "01 Oct 2026, 09:00 UTC",
      evidence: "Project Charter Proposal #PW-1042",
      credit: "Project Initiator",
      why: "Defines the core problem statement, budget (₹1,00,000), and expected milestones."
    }
  },
  {
    id: "node-charter",
    title: "Project Charter Locked",
    subtitle: "Signed by 4 Participants",
    category: "Governance",
    icon: "🔒",
    color: "#7c3aed",
    details: {
      owner: "All Project Stakeholders",
      timestamp: "03 Oct 2026, 12:00 UTC",
      evidence: "Project Agreement #PW-1042-LOCKED",
      credit: "Agreed Ruleset",
      why: "Ensures rules, milestones, and credit attribution cannot be silently altered mid-project."
    }
  },
  {
    id: "node-student-bhumikaa",
    title: "Data Cleaning Pipeline",
    subtitle: "Bhumikaa B (Student)",
    category: "Contribution",
    icon: "📊",
    color: "#059669",
    details: {
      owner: "Bhumikaa B (Lead Data Engineer)",
      timestamp: "04 Oct 2026, 14:32 UTC",
      evidence: "Git Commit #a91f82c • Cleaned 12,400 records • Unit tests passed",
      credit: "18% Milestone 1 Share",
      validator: "Dr. Meera Rao (Domain Mentor)",
      why: "Removed noise from sensor logs, fixed missing timestamps, and standardized data format."
    }
  },
  {
    id: "node-ai-lit",
    title: "Literature Synthesis",
    subtitle: "Literature Assistant (AI)",
    category: "AI Action",
    icon: "📚",
    color: "#0284c7",
    details: {
      owner: "Human Owner: Aarav Patel",
      timestamp: "04 Oct 2026, 16:15 UTC",
      evidence: "Summary Report #LS-21 • Parsed 8 research papers",
      credit: "5% Team Credit (Attributed to Aarav)",
      validator: "Aarav Patel (Human Owner)",
      why: "AI assisted paper analysis under human supervision. AI cannot hold independent credit."
    }
  },
  {
    id: "node-expert-meera",
    title: "Methodology Peer Review",
    subtitle: "Dr. Meera Rao (Mentor)",
    category: "Validation",
    icon: "🔬",
    color: "#d97706",
    details: {
      owner: "Dr. Meera Rao (Domain Mentor)",
      timestamp: "05 Oct 2026, 09:04 UTC",
      evidence: "Expert Review Report #MR-09 • Outlier formula approved",
      credit: "7% Milestone 1 Share",
      validator: "AquaNova Research Board",
      why: "Validated mathematical accuracy of data cleaning pipeline prior to model training."
    }
  },
  {
    id: "node-aarav-model",
    title: "LSTM Prediction Network",
    subtitle: "Aarav Patel (Student)",
    category: "Contribution",
    icon: "🧠",
    color: "#db2777",
    details: {
      owner: "Aarav Patel (Student Researcher)",
      timestamp: "05 Oct 2026, 11:20 UTC",
      evidence: "Git Commit #b40c991 • Model accuracy evaluation notebook",
      credit: "22% Milestone 2 Share",
      validator: "Dr. Meera Rao (Domain Mentor)",
      why: "Trained LSTM neural network model for forecasting 48-hour water contamination risk."
    }
  },
  {
    id: "node-reward",
    title: "Milestone Escrow Released",
    subtitle: "Payout: ₹40,000",
    category: "Reward",
    icon: "💰",
    color: "#059669",
    details: {
      owner: "AquaNova Escrow Vault",
      timestamp: "05 Oct 2026, 15:00 UTC",
      evidence: "Milestone Payout Transaction #TX-99214",
      credit: "Fair Automated Payout",
      why: "All Milestone 1 proof deliverables passed domain mentor validation and charter requirements."
    }
  }
];

export const JUDGE_QUESTIONS = [
  {
    q: "How is Verixa different from LinkedIn or standard job portals?",
    a: "LinkedIn lists unverified self-reported resumes. Verixa does not rely on claims. We connect research problems to verified skills, lock terms in a Project Charter, and track contributions on a Proof Graph where every work item is backed by inspectable code commits, datasets, and expert reviews."
  },
  {
    q: "Why would students build their profile on Verixa?",
    a: "Because certificates only show course attendance, not actual work capability. Verixa builds a 'Research Passport'—a portfolio backed by real verified contributions that graduate admissions or industry R&D teams can directly audit."
  },
  {
    q: "How do you prevent AI agents from taking credit or leaking data?",
    a: "Every AI assistant MUST have a named human owner, strict workspace data boundaries, and audit logs. The platform rule is: 'AI can assist. AI cannot own.' If an AI agent attempts to access files outside its project scope, the system instantly blocks the action and logs a security alert."
  },
  {
    q: "How do you protect students and sponsors from broken promises or scope changes?",
    a: "Before work begins, all parties sign the Project Charter. Once signed, terms are locked. Any change requires a formal Charter Amendment agreed upon by affected participants. Payments sit in milestone escrow released upon expert verification."
  },
  {
    q: "How is contribution credit determined?",
    a: "Verixa uses a transparent, explainable formula combining Evidence Quality (30%), Impact (30%), Mentor Validation (20%), and Milestone Completion (20%). Every participant can inspect the 'Why?' panel to see exact calculations."
  },
  {
    q: "Does this platform support non-paid academic research?",
    a: "Yes. Not all research involves funding. Verixa supports non-monetary projects where rewards consist of verified Research Passport credentials, co-authorship eligibility, and domain mentor reviews."
  },
  {
    q: "How do you protect confidential sponsor data?",
    a: "Access control is strictly role-based and project-scoped. Students and AI assistants can only access permitted project folders. In our Trust Sandbox, users can test how unauthorized requests are blocked."
  },
  {
    q: "Why is Verixa better than using Slack + GitHub + Google Drive separately?",
    a: "Separate tools lead to lost attribution, scope creep, and payment friction. Verixa unifies matching, project governance, evidence tracking, AI safety, and escrow payouts into one seamless research workspace."
  }
];
