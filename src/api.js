const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
      throw new Error(errData.message || errData.error || `Lá»—i HTTP: ${res.status}`);
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
  updateProcedure: (id, data) => fetchApi(`/procedures/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProcedure: (id) => fetchApi(`/procedures/${id}`, { method: 'DELETE' }),

  // Forms
  getForms: () => fetchApi('/forms'),
  createForm: (data) => fetchApi('/forms', { method: 'POST', body: JSON.stringify(data) }),
  deleteForm: (id) => fetchApi(`/forms/${id}`, { method: 'DELETE' }),

  // Applications
  getApplications: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/applications${query ? `?${query}` : ''}`);
  },
  trackApplication: (code) => fetchApi(`/applications/${code}`),
  getApplication: (id) => fetchApi(`/applications/${id}`),
  submitApplication: (data) => fetchApi('/applications', { method: 'POST', body: JSON.stringify(data) }),
  uploadFile: async file => {
    const token = localStorage.getItem('tbu_token');
    const body = new FormData();
    body.append('file', file);
    const response = await fetch(`${API_BASE}/uploads`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || `Lỗi tải tệp: ${response.status}`);
    return result;
  },
  updateApplicationStatus: (id, data) => fetchApi(`/applications/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
  addApplicationNote: (id, text, isInternal = true) => fetchApi(`/applications/${id}/notes`, { method: 'POST', body: JSON.stringify({ text, isInternal }) }),

  // Statistics
  getDashboardStats: () => fetchApi('/stats'),
  getFaqs: () => fetchApi('/faqs'),
  getNews: () => fetchApi('/news'),
  getUsers: () => fetchApi('/users'),
};
