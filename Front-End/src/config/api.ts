// Configuração da API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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
    TRANSACAO: `${API_BASE_URL}/banco/transacao`,
  },
};

export default API_BASE_URL;

