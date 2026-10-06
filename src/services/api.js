const API_BASE = "http://127.0.0.1:8001/api";

const getHeaders = () => {
  const token = localStorage.getItem("pw_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      return await res.json();
    } catch (e) {
      console.warn("Backend API offline, using fallback auth", e);
      return null;
    }
  },
  getMe: async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Research Problems
  getProblems: async () => {
    try {
      const res = await fetch(`${API_BASE}/research/problems`, { headers: getHeaders() });
      if (!res.ok) throw new Error("Failed to fetch research problems");
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  createProblem: async (problemData) => {
    try {
      const res = await fetch(`${API_BASE}/research/create`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(problemData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  getProblemDetail: async (problemId) => {
    try {
      const res = await fetch(`${API_BASE}/research/problems/${problemId}`, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  applyToResearch: async (problemId, roleRequested = "Student Researcher", message = "") => {
    try {
      const res = await fetch(`${API_BASE}/research/problems/${problemId}/apply`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ role_requested: roleRequested, message: message })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Explainable Matching
  getMatch: async (projectId, userId) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}/match/${userId}`, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Project & Charter
  getProjectDetail: async (projectId) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}`, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  acceptCharter: async (projectId, participantLabel) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}/charter/accept`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ participant_label: participantLabel })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  createAmendment: async (projectId, amendmentData) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}/charter/amendments`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(amendmentData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Contributions & Evidence
  getContributions: async (projectId) => {
    try {
      const url = projectId ? `${API_BASE}/contributions?project_id=${projectId}` : `${API_BASE}/contributions`;
      const res = await fetch(url, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  createContribution: async (contribData) => {
    try {
      const res = await fetch(`${API_BASE}/contributions`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(contribData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  validateContribution: async (contribId, valData) => {
    try {
      const res = await fetch(`${API_BASE}/contributions/${contribId}/validate`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(valData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Proof Graph
  getProofGraph: async (projectId = "PW-1042") => {
    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}/proof-graph`, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Contribution Ledger
  getLedger: async (projectId) => {
    try {
      const url = projectId ? `${API_BASE}/ledger?project_id=${projectId}` : `${API_BASE}/ledger`;
      const res = await fetch(url, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  getExportLedgerUrl: (projectId) => {
    return projectId ? `${API_BASE}/ledger/export?project_id=${projectId}` : `${API_BASE}/ledger/export`;
  },

  // AI Governance
  getAIAgents: async (projectId) => {
    try {
      const url = projectId ? `${API_BASE}/ai/agents?project_id=${projectId}` : `${API_BASE}/ai/agents`;
      const res = await fetch(url, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  checkAIAccess: async (agentId, targetProjectId, action = "READ_PROJECT_FILES") => {
    try {
      const res = await fetch(`${API_BASE}/ai/check-access`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          agent_id: agentId,
          target_project_id: targetProjectId,
          action: action
        })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Research Passport
  getPassport: async (userIdOrKey) => {
    try {
      const res = await fetch(`${API_BASE}/passport/${userIdOrKey}`, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Rewards
  getRewards: async (projectId) => {
    try {
      const url = projectId ? `${API_BASE}/rewards?project_id=${projectId}` : `${API_BASE}/rewards`;
      const res = await fetch(url, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  releaseReward: async (rewardId) => {
    try {
      const res = await fetch(`${API_BASE}/rewards/${rewardId}/release`, {
        method: "POST",
        headers: getHeaders()
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Disputes
  getDisputes: async (projectId) => {
    try {
      const url = projectId ? `${API_BASE}/disputes?project_id=${projectId}` : `${API_BASE}/disputes`;
      const res = await fetch(url, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  createDispute: async (disputeData) => {
    try {
      const res = await fetch(`${API_BASE}/disputes/create`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(disputeData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  resolveDispute: async (disputeId, resolveData) => {
    try {
      const res = await fetch(`${API_BASE}/disputes/${disputeId}/resolve`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(resolveData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Admin & Analytics
  getAdminAnalytics: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/analytics`, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  getAuditLogs: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/audit-logs`, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // NEW FEATURES — 1. Messages / Private Research Chat
  getConversations: async () => {
    try {
      const res = await fetch(`${API_BASE}/messages/conversations`, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  getConversationMessages: async (conversationId) => {
    try {
      const res = await fetch(`${API_BASE}/messages/conversations/${conversationId}`, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  sendMessage: async (conversationId, messageData) => {
    try {
      const res = await fetch(`${API_BASE}/messages/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(messageData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // NEW FEATURES — 2. Notifications Center
  getNotifications: async (category = "All") => {
    try {
      const url = category && category !== "All" ? `${API_BASE}/notifications?category=${category}` : `${API_BASE}/notifications`;
      const res = await fetch(url, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  markNotificationRead: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: "PATCH",
        headers: getHeaders()
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  markAllNotificationsRead: async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications/read-all`, {
        method: "POST",
        headers: getHeaders()
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // NEW FEATURES — 3. Hierarchical Work Updates
  getWorkUpdates: async (projectId = "PW-1042", updateType = "All") => {
    try {
      const url = `${API_BASE}/work-updates?project_id=${projectId}&update_type=${updateType}`;
      const res = await fetch(url, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  createWorkUpdate: async (updateData) => {
    try {
      const res = await fetch(`${API_BASE}/work-updates`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(updateData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  reviewWorkUpdate: async (id, reviewData) => {
    try {
      const res = await fetch(`${API_BASE}/work-updates/${id}/review`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(reviewData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // NEW FEATURES — 4. Private Replacement Workflow
  getReplacements: async () => {
    try {
      const res = await fetch(`${API_BASE}/replacements`, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  createReplacementRequest: async (repData) => {
    try {
      const res = await fetch(`${API_BASE}/replacements`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(repData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  acceptReplacement: async (replacementId) => {
    try {
      const res = await fetch(`${API_BASE}/replacements/${replacementId}/accept`, {
        method: "POST",
        headers: getHeaders()
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  approveReplacement: async (replacementId, candidateId) => {
    try {
      const res = await fetch(`${API_BASE}/replacements/${replacementId}/approve?candidate_id=${candidateId}`, {
        method: "POST",
        headers: getHeaders()
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // NEW FEATURES — 5. AI-Assisted Project Handover
  getHandover: async (projectId = "PW-1042") => {
    try {
      const res = await fetch(`${API_BASE}/handover/${projectId}`, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  generateHandover: async (projectId = "PW-1042", replacementId = "REP-101") => {
    try {
      const res = await fetch(`${API_BASE}/handover/generate`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ project_id: projectId, replacement_id: replacementId })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  }
};
