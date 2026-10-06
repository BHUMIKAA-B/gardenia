# PROOFWEAVE REST API Specification

## Base URL
`http://127.0.0.1:8000/api`

## Endpoints Summary

### Authentication
- `POST /api/auth/login`: Authenticate user and return JWT bearer token.
- `POST /api/auth/register`: Register new student, expert, or sponsor user.
- `GET /api/auth/me`: Fetch current logged-in user details.

### Research Problems
- `GET /api/research/problems`: List all sponsored research challenges.
- `POST /api/research/create`: Create a new research challenge (Sponsor/Admin).

### Matching Engine
- `GET /api/projects/{id}/match/{user_id}`: Get 5-factor explainable match score breakdown.

### Projects & Charter
- `GET /api/projects/{id}`: Fetch project details, team members, and charter.
- `POST /api/projects/{id}/charter/accept`: Digitally sign project charter.
- `POST /api/projects/{id}/charter/amendments`: Propose charter amendment.

### Contributions & Evidence
- `GET /api/contributions`: List contributions for a project.
- `POST /api/contributions`: Submit new contribution with evidence references.
- `POST /api/contributions/{id}/validate`: Validate contribution and set credit share.

### Proof Graph & Ledger
- `GET /api/projects/{id}/proof-graph`: Fetch React Flow graph nodes and edges.
- `GET /api/ledger`: Fetch tamper-evident audit events.
- `GET /api/ledger/export`: Download ledger as CSV file.

### AI Governance
- `GET /api/ai/agents`: List active AI agents and assigned scopes.
- `POST /api/ai/check-access`: Perform project scope check (returns `ACCESS DENIED` if scope violated).

### Research Passport
- `GET /api/passport/{user_id_or_key}`: Fetch evidence-backed research passport profile.

### Rewards & Escrow
- `GET /api/rewards`: List milestone reward allocations.
- `POST /api/rewards/{id}/release`: Release milestone escrow payout.

### Dispute Governance
- `GET /api/disputes`: List project disputes.
- `POST /api/disputes/create`: Raise new contribution dispute.
- `POST /api/disputes/{id}/resolve`: Record expert board dispute resolution.

### Admin & Analytics
- `GET /api/admin/analytics`: Platform analytics and metrics.
- `GET /api/admin/audit-logs`: Audit event log stream.
