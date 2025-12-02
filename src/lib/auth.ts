// Auth.ts
import { API_ENDPOINTS } from '../config/api';

export type identificadorType = 'cpf' | 'telefone' | 'email';

export const cleanNumber = (value: string) => value.replace(/\D/g, '');

export async function queryUser({
  identificador,
  identificadorType,
  senha,
}: {
  identificador: string;
  identificadorType: identificadorType;
  senha: string;
}) {
  // Limpa CPF ou telefone apenas se necessário
  const value =
    identificadorType === 'cpf' || identificadorType === 'telefone'
      ? cleanNumber(identificador)
      : identificador;

  const body = {
    identificador: value,
    senha,
  };

  try {
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.token ? { token: data.token } : null;
  } catch (error) {
    console.error('Erro ao consultar usuário:', error);
    return null;
  }
}
