import axios from 'axios';
import Cookies from 'js-cookie';
import API_BASE_URL from './api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Attach Authorization header automatically if a token exists in cookies
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers = config.headers ?? {};
    // ensure Authorization doesn't overwrite other headers
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
    // Dev-only debug: log when we attach a token
    try {
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        // eslint-disable-next-line no-console
        console.debug('[apiClient] attaching Authorization header, token present:', token ? 'yes' : 'no');
      }
    } catch (e) { /* ignore */ }
  }
  return config;
});

// Global response handler for axios: clear token and optionally redirect on 401/403
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const status = error?.response?.status;
      const originalRequest = error?.config;
      if (status === 401 || status === 403) {
        // If this occurred immediately after login, try a single retry (race condition can happen)
        try {
          const recent = (window as any).__RECENT_LOGIN_AT__ || 0;
          const now = Date.now();
          if (now - recent < 5000 && originalRequest && !originalRequest.__isRetry) {
            // mark as retry to avoid loops
            originalRequest.__isRetry = true;
            // eslint-disable-next-line no-console
            console.warn('[apiClient] retrying failed request immediately-after-login');
            return axiosInstance(originalRequest);
          }
        } catch (e) { /* ignore */ }

        // Remove stored token and force a reload to login page
        try { Cookies.remove('token'); } catch (e) { /* ignore */ }
        if (typeof window !== 'undefined') {
          // eslint-disable-next-line no-console
          console.warn('[apiClient] unauthorized response, clearing token and redirecting');
          window.location.href = '/login';
        }
      }
    } catch (e) {}
    return Promise.reject(error);
  }
);

// Small fetch wrapper that uses the same API_BASE_URL + cookie token
export async function apiFetch(input: RequestInfo, init?: RequestInit) {
  const token = Cookies.get('token');
  const url = typeof input === 'string' && input.startsWith('/') ? `${API_BASE_URL}${input}` : input;

  const headers = {
    ...(init?.headers instanceof Headers ? Object.fromEntries(init.headers as any) : (init?.headers ?? {})),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const merged: RequestInit = {
    ...init,
    // include credentials so httpOnly cookies (if used by server) are sent
    credentials: 'include',
    headers,
  };

  // Dev debug: log attempts
  try {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      // eslint-disable-next-line no-console
      console.debug('[apiFetch] fetch', url, merged);
    }
  } catch (e) { /* ignore */ }

  let resp = await fetch(url, merged);

  try {
    const recent = (typeof window !== 'undefined' ? (window as any).__RECENT_LOGIN_AT__ : 0) || 0;
    const now = Date.now();

    const headersObj = merged.headers instanceof Headers ? Object.fromEntries(merged.headers as any) : (merged.headers ?? {});
    const isRetry = headersObj && (headersObj as any)['x-retry'] === '1';

    if ((resp.status === 401 || resp.status === 403) && now - recent < 5000 && !isRetry) {
      try {
        (merged.headers as any)['x-retry'] = '1';
      } catch {}
      await new Promise((r) => setTimeout(r, 350));
      const retryResp = await fetch(url, merged);
      if (retryResp.status !== 401 && retryResp.status !== 403) return retryResp;
      resp = retryResp;
    }

    if (resp.status === 401 || resp.status === 403) {
      try { Cookies.remove('token'); } catch (e) { /* ignore */ }
      if (typeof window !== 'undefined') {
        try { window.location.href = '/login'; } catch (e) { /* ignore */ }
      }
    }
  } catch (e) {}

  return resp;
}

export default axiosInstance;
