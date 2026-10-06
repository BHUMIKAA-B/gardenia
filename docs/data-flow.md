# PROOFWEAVE Data Flow Specification

## 1. Problem & Matching Flow
1. Sponsor publishes research problem `PW-1042` with skills, budget, and duration.
2. User profile skills & interests are evaluated against project requirements via `GET /api/projects/{id}/match/{user_id}`.
3. Matching service returns 5-factor breakdown score (e.g., 92% Fit) and identifies skill gaps.

## 2. Charter Lock Flow
1. Sponsor defines objectives, scope, IP rules, AI data access, and dispute rules.
2. Each participant calls `POST /api/projects/{id}/charter/accept`.
3. When all stakeholders sign, `charter.locked` transitions to `True` (🔒 CHARTER LOCKED).
4. Editing normal fields is disabled; amendments require `POST /api/projects/{id}/charter/amendments`.

## 3. Contribution & Evidence Validation Flow
1. Contributor submits work item via `POST /api/contributions` with title, type, effort hours, and evidence reference (Git commit hash `#A91F`).
2. Mentor inspects report and calls `POST /api/contributions/{id}/validate` with status `Approved` and credit percentage (18%).
3. Backend updates DB, appends SHA-256 audit event to `AuditEvent` table, and updates contributor's `ResearchPassport`.

## 4. AI Permission Enforcement Flow
1. AI agent `AI-101` attempts file access via `POST /api/ai/check-access`.
2. Permission engine checks agent's assigned project (`PW-1042`) against requested project (`PW-1088`).
3. If project mismatch occurs, endpoint returns `allowed: false` (`ACCESS DENIED`), reason `Project scope violation`, and writes security audit event to `AuditEvent`.
