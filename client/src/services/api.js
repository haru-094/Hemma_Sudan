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

  // Curriculum & Translation
  getTopics: () => request('/topics'),
  getLesson: (id) => request(`/lessons/${id}`),
  createLesson: (payload) => request('/lessons', { method: 'POST', body: JSON.stringify(payload) }),
  generateArabicDraft: (payload) => request('/translate/draft', { method: 'POST', body: JSON.stringify(payload) }),
  updateArabicStatus: (lessonId, payload) => request(`/lessons/${lessonId}/arabic-status`, { method: 'PATCH', body: JSON.stringify(payload) }),

  // Submissions, Reviews & Multi-attempt History
  getSubmissions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/submissions${query ? `?${query}` : ''}`);
  },
  getSubmissionHistory: (topicId, learnerId) => request(`/submissions/history/${topicId}/${learnerId}`),
  createSubmission: (payload) => request('/submissions', { method: 'POST', body: JSON.stringify(payload) }),
  submitFeedback: (subId, payload) => request(`/submissions/${subId}/feedback`, { method: 'POST', body: JSON.stringify(payload) }),
  resolveEscalation: (subId, payload) => request(`/submissions/${subId}/resolve-escalation`, { method: 'POST', body: JSON.stringify(payload) }),

  // Teacher Hub Operations
  getTeacherMentors: () => request('/teacher/mentors'),
  toggleMentorTopic: (payload) => request('/teacher/mentors/toggle-topic', { method: 'POST', body: JSON.stringify(payload) }),
  resetAccount: (payload) => request('/teacher/reset-account', { method: 'POST', body: JSON.stringify(payload) }),
  getAuditLogs: () => request('/teacher/audit-logs'),

  // Offline Sync
  syncProgress: (payload) => request('/sync/progress', { method: 'POST', body: JSON.stringify(payload) }),
  getLearnerProgress: (learnerId) => request(`/sync/progress/${learnerId}`),
};
