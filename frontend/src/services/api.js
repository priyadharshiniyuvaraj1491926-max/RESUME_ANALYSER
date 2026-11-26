import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

// ── Attach token to every request ──
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('resumeiq_token') ||
    sessionStorage.getItem('resumeiq_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Handle 401 globally ──
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('resumeiq_token');
      localStorage.removeItem('resumeiq_user');
      sessionStorage.removeItem('resumeiq_token');
      sessionStorage.removeItem('resumeiq_user');
      // Avoid redirect loop on auth pages
      const path = window.location.pathname;
      if (!path.startsWith('/signin') && !path.startsWith('/signup')) {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(err);
  }
);

// ── Convenience helpers ──
export const setToken = (token, remember = false) => {
  const store = remember ? localStorage : sessionStorage;
  store.setItem('resumeiq_token', token);
};

export const clearToken = () => {
  localStorage.removeItem('resumeiq_token');
  localStorage.removeItem('resumeiq_user');
  sessionStorage.removeItem('resumeiq_token');
  sessionStorage.removeItem('resumeiq_user');
};

export const getStoredUser = () => {
  try {
    const raw =
      localStorage.getItem('resumeiq_user') ||
      sessionStorage.getItem('resumeiq_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const storeUser = (user, remember = false) => {
  const store = remember ? localStorage : sessionStorage;
  store.setItem('resumeiq_user', JSON.stringify(user));
};

export default api;
