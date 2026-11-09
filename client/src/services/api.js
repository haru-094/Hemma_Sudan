const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    throw err;
  }
}

export const api = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getUsers: () => request('/auth/users'),

  // Curriculum
  getTopics: () => request('/topics'),
  getLesson: (id) => request(`/lessons/${id}`),
  createLesson: (payload) => request('/lessons', { method: 'POST', body: JSON.stringify(payload) }),

  // Submissions & Reviews
  getSubmissions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/submissions${query ? `?${query}` : ''}`);
  },
  createSubmission: (payload) => request('/submissions', { method: 'POST', body: JSON.stringify(payload) }),
  submitFeedback: (subId, payload) => request(`/submissions/${subId}/feedback`, { method: 'POST', body: JSON.stringify(payload) }),
  resolveEscalation: (subId, payload) => request(`/submissions/${subId}/resolve-escalation`, { method: 'POST', body: JSON.stringify(payload) }),

  // Teacher Hub Operations (FR-8.1, FR-8.2, FR-8.3, FR-13.1, NFR-13)
  getTeacherMentors: () => request('/teacher/mentors'),
  toggleMentorTopic: (payload) => request('/teacher/mentors/toggle-topic', { method: 'POST', body: JSON.stringify(payload) }),
  resetAccount: (payload) => request('/teacher/reset-account', { method: 'POST', body: JSON.stringify(payload) }),
  getAuditLogs: () => request('/teacher/audit-logs'),

  // Offline Sync
  syncProgress: (payload) => request('/sync/progress', { method: 'POST', body: JSON.stringify(payload) }),
  getLearnerProgress: (learnerId) => request(`/sync/progress/${learnerId}`),
};
