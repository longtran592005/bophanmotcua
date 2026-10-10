const API_BASE = 'http://localhost:5000/api';

export async function fetchApi(endpoint, options = {}) {
  try {
    const token = localStorage.getItem('tbu_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Lỗi HTTP: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  login: (emailOrCode, password) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify({ emailOrCode, password }) }),
  register: (data) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => fetchApi('/auth/me'),

  // Procedures
  getProcedures: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/procedures${query ? `?${query}` : ''}`);
  },
  getProcedure: (codeOrId) => fetchApi(`/procedures/${codeOrId}`),
  createProcedure: (data) => fetchApi('/procedures', { method: 'POST', body: JSON.stringify(data) }),
  updateProcedure: (code, data) => fetchApi(`/procedures/${code}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProcedure: (code) => fetchApi(`/procedures/${code}`, { method: 'DELETE' }),

  // Forms
  getForms: () => fetchApi('/forms'),
  createForm: (data) => fetchApi('/forms', { method: 'POST', body: JSON.stringify(data) }),
  deleteForm: (code) => fetchApi(`/forms/${code}`, { method: 'DELETE' }),

  // Applications
  getApplications: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/applications${query ? `?${query}` : ''}`);
  },
  trackApplication: (code) => fetchApi(`/applications/${code}`),
  submitApplication: (data) => fetchApi('/applications', { method: 'POST', body: JSON.stringify(data) }),
  updateApplicationStatus: (code, data) => fetchApi(`/applications/${code}/status`, { method: 'PUT', body: JSON.stringify(data) }),
  addApplicationNote: (code, text) => fetchApi(`/applications/${code}/notes`, { method: 'POST', body: JSON.stringify({ text }) }),

  // FAQs, News, Stats, Settings
  getFaqs: () => fetchApi('/faqs'),
  getNews: () => fetchApi('/news'),
  getStats: () => fetchApi('/stats'),
  getSettings: () => fetchApi('/settings'),
  updateSettings: (data) => fetchApi('/settings', { method: 'POST', body: JSON.stringify(data) }),

  // AI Chat
  sendChatMessage: (message) => fetchApi('/ai/chat', { method: 'POST', body: JSON.stringify({ message }) }),
};
