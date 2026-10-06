# PROOFWEAVE Security & Governance Architecture

## 1. Authentication & Session Management
- **JWT Tokens**: Signed using HS256 algorithm with configurable expiration.
- **Password Hashing**: SHA-256 with server-side secret key salting (`hash_password`).
- **Demo Fallbacks**: Secure demo credential support for hackathon evaluation without plain text password storage.

## 2. Role-Based Access Control (RBAC)
- **Roles**: `student`, `expert`, `sponsor`, `admin`.
- **Backend Validation**: Authorization rules enforced on API endpoints via FastAPI dependencies (`get_current_user`, `require_role`).
- **Project Isolation**: Workspace data access scoped to confirmed `ProjectMember` records.

## 3. AI Permission Engine & Scope Control
- **Principle**: "Every AI action has a human owner. AI can assist, but AI cannot own."
- **Scope Verification**: Every AI request passes through:
  `AI Request → Agent Identity → Human Owner → Assigned Project → Permission Policy → Scope Check → Execution / Denial → Audit Event`
- **Denied Access Behavior**: If an AI agent attempts cross-project access (e.g., `AI-101` assigned to `PW-1042` requesting files from `PW-1088`), the backend returns `403 / ACCESS DENIED` with reason `"Project scope violation"` and logs a security audit event in `AuditEvent`.

## 4. Charter Locking & Audit Ledger
- **Charter Lock**: Multi-party agreement signature threshold freezes charter terms.
- **Tamper-Evident Ledger**: Every contribution, validation, AI action, and payout generates a SHA-256 fingerprint audit log.
