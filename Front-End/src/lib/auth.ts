// Auth.ts
import { API_ENDPOINTS } from '../config/api';

export type IdentifierType = 'cpf' | 'telefone' | 'email';

export const cleanNumber = (value: string) => value.replace(/\D/g, '');

export async function queryUser({
  identifier,
  identifierType,
  senha,
}: {
  identifier: string;
  identifierType: IdentifierType;
  senha: string;
}) {
  // Limpa CPF ou telefone apenas se necessário
  const value =
    identifierType === 'cpf' || identifierType === 'telefone'
      ? cleanNumber(identifier)
      : identifier;

  const body = {
    identifier: value,
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
