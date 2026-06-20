import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/password', data),
};

// Expenses
export const expenseAPI = {
  getAll: (params) => API.get('/expenses', { params }),
  getOne: (id) => API.get(`/expenses/${id}`),
  create: (data) => API.post('/expenses', data),
  update: (id, data) => API.put(`/expenses/${id}`, data),
  delete: (id) => API.delete(`/expenses/${id}`),
  getStats: () => API.get('/expenses/stats'),
};

// Income
export const incomeAPI = {
  getAll: (params) => API.get('/income', { params }),
  getOne: (id) => API.get(`/income/${id}`),
  create: (data) => API.post('/income', data),
  update: (id, data) => API.put(`/income/${id}`, data),
  delete: (id) => API.delete(`/income/${id}`),
  getStats: () => API.get('/income/stats'),
};

// Dashboard
export const dashboardAPI = {
  getSummary: () => API.get('/dashboard/summary'),
};

export default API;
