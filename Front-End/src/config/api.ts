// Configuração da API
import Cookie from "js-cookie";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
  },

  CONTA: {
    BASE: `${API_BASE_URL}/conta`,
    BANCO: (contaId: number) => `${API_BASE_URL}/conta/${contaId}/banco`,
  },

  BANCO: {
    TRANSACAO: `${API_BASE_URL}/conta/banco/transacao`,
  },
};

// ========================================
// 🔥 Adicionando o axios (sem mexer no resto)
// ========================================
import axios from "axios";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // permite enviar cookie se você usar
});

// 🔒 Enviar token automaticamente
api.interceptors.request.use((config) => {
  const token = Cookie.get("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ❗ Log de erro para debug
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("Erro na API:", err.response || err);
    return Promise.reject(err);
  }
);

export default api;
