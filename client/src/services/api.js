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

  // Offline Sync
  syncProgress: (payload) => request('/sync/progress', { method: 'POST', body: JSON.stringify(payload) }),
  getLearnerProgress: (learnerId) => request(`/sync/progress/${learnerId}`),
};

