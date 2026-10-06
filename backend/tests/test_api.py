import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_login_demo():
    res = client.post("/api/auth/login", json={"email": "bhumikaa@proofweave.ai", "password": "bhumikaa123"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "bhumikaa@proofweave.ai"

def test_research_problems():
    res = client.get("/api/research/problems")
    assert res.status_code == 200
    problems = res.json()
    assert len(problems) >= 3
    assert problems[0]["id"] == "PW-1042"

def test_explainable_matching():
    res = client.get("/api/projects/PW-1042/match/2")
    assert res.status_code == 200
    match = res.json()
    assert "score" in match
    assert match["score"] >= 80
    assert "explanation" in match

def test_charter_locking():
    res = client.post("/api/projects/PW-1042/charter/accept", json={"participant_label": "Student: Bhumikaa B"})
    assert res.status_code == 200
    assert "locked" in res.json()

def test_ai_permission_check_denied():
    # Attempt cross-project access for Literature Scout Agent on PW-1088
    res = client.post("/api/ai/check-access", json={
        "agent_id": "AI-101",
        "target_project_id": "PW-1088",
        "action": "READ_CONFIDENTIAL_FILES"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["allowed"] is False
    assert data["status"] == "ACCESS DENIED"
    assert "scope violation" in data["reason"].lower()

def test_ai_permission_check_allowed():
    # Attempt access within PW-1042 scope
    res = client.post("/api/ai/check-access", json={
        "agent_id": "AI-101",
        "target_project_id": "PW-1042",
        "action": "READ_LITERATURE"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["allowed"] is True
    assert data["status"] == "ACCESS GRANTED"

def test_contribution_creation_and_validation():
    # Create contribution
    c_res = client.post("/api/contributions", json={
        "title": "Unit Test Water Pipeline Model",
        "description": "Validation test contribution",
        "contribution_type": "Code",
        "project_id": "PW-1042",
        "milestone_id": "PW-1042-M1",
        "evidence_title": "Test Commit #001",
        "evidence_type": "Git Commit"
    })
    assert c_res.status_code == 200
    cid = c_res.json()["id"]

    # Validate contribution
    v_res = client.post(f"/api/contributions/{cid}/validate", json={
        "status": "Approved",
        "comment": "Unit test approved by mentor",
        "credit_percentage": 20.0,
        "payout_share": "₹20,000"
    })
    assert v_res.status_code == 200
    assert v_res.json()["status"] == "Validated"

def test_proof_graph():
    res = client.get("/api/projects/PW-1042/proof-graph")
    assert res.status_code == 200
    graph = res.json()
    assert "nodes" in graph
    assert len(graph["nodes"]) >= 5

def test_ledger_export():
    res = client.get("/api/ledger/export")
    assert res.status_code == 200
    assert "Log ID,Timestamp" in res.text

def test_dispute_workflow():
    d_res = client.post("/api/disputes/create", json={
        "project_id": "PW-1042",
        "contribution_id": "CON-1001",
        "contribution_title": "Validated 12,400 water-quality records",
        "reason": "Test Dispute Reason",
        "description": "Test dispute description"
    })
    assert d_res.status_code == 200
    did = d_res.json()["id"]

    r_res = client.post(f"/api/disputes/{did}/resolve", json={
        "status": "Resolved",
        "decision_note": "Dispute resolved in test"
    })
    assert r_res.status_code == 200
    assert r_res.json()["dispute"]["status"] == "Resolved"
