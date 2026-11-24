const rawApiBase = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
// Resilient normalization: handles with or without protocol, with or without trailing '/api' or slashes
const normalizedBase = rawApiBase.startsWith('http') ? rawApiBase : `https://${rawApiBase}`;
const API_BASE = normalizedBase.replace(/\/+$/, '').endsWith('/api')
  ? normalizedBase.replace(/\/+$/, '')
  : `${normalizedBase.replace(/\/+$/, '')}/api`;

function getAuthHeader() {
  try {
    const saved = localStorage.getItem('hemma_user');
    if (saved) {
      const user = JSON.parse(saved);
      if (user && user.token) {
        return { Authorization: `Bearer ${user.token}` };
      }
    }
  } catch {
    // Ignore parse error
  }
  return {};
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    },
  };

  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `Request failed with status ${res.status}`);
    err.status = res.status;
    err.errorCode = data.errorCode;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  // System Configuration (e.g. DEMO_MODE)
  getConfig: () => request('/config'),
  resetDemoState: () => request('/demo/reset', { method: 'POST' }),

  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getUsers: () => request('/auth/users'),

  // Curriculum & Translation
  getTopics: () => request('/topics'),
  getLesson: (id) => request(`/lessons/${id}`),
  createLesson: (payload) => request('/lessons', { method: 'POST', body: JSON.stringify(payload) }),
  generateArabicDraft: (payload) => request('/translate/draft', { method: 'POST', body: JSON.stringify(payload) }),
  updateArabicStatus: (lessonId, payload) => request(`/lessons/${lessonId}/arabic-status`, { method: 'PATCH', body: JSON.stringify(payload) }),

  // Submissions, Reviews & Multi-attempt History
  validateGithubRepo: (payload) => request('/submissions/validate-github', { method: 'POST', body: JSON.stringify(payload) }),
  getSubmissions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/submissions${query ? `?${query}` : ''}`);
  },
  getSubmissionHistory: (topicId, learnerId) => request(`/submissions/history/${topicId}/${learnerId}`),
  createSubmission: (payload) => request('/submissions', { method: 'POST', body: JSON.stringify(payload) }),
  submitFeedback: (subId, payload) => request(`/submissions/${subId}/feedback`, { method: 'POST', body: JSON.stringify(payload) }),
  resolveEscalation: (subId, payload) => request(`/submissions/${subId}/resolve-escalation`, { method: 'POST', body: JSON.stringify(payload) }),
  requestTeacherReview: (subId, payload) => request(`/submissions/${subId}/request-teacher`, { method: 'POST', body: JSON.stringify(payload) }),
  assignReviewer: (subId, payload) => request(`/submissions/${subId}/assign`, { method: 'POST', body: JSON.stringify(payload) }),

  // Data Privacy & Retention
  updateConsent: (payload) => request('/auth/consent', { method: 'POST', body: JSON.stringify(payload) }),
  purgeDemoData: (payload) => request('/teacher/purge-demo-data', { method: 'POST', body: JSON.stringify(payload) }),

  // Teacher Hub Operations
  getTeacherMentors: () => request('/teacher/mentors'),
  toggleMentorTopic: (payload) => request('/teacher/mentors/toggle-topic', { method: 'POST', body: JSON.stringify(payload) }),
  resetAccount: (payload) => request('/teacher/reset-account', { method: 'POST', body: JSON.stringify(payload) }),
  getAuditLogs: () => request('/teacher/audit-logs'),

  // Offline Sync
  syncProgress: (payload, options = {}) => request('/sync/progress', { method: 'POST', body: JSON.stringify(payload), ...options }),
  getLearnerProgress: (learnerId) => request(`/sync/progress/${learnerId}`),
};
