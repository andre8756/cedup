type IdentifierType = 'cpf' | 'telefone' | 'email' | null;

export async function queryUser({
  identifier,
  identifierType,
  senha,
}: {
  identifier: string;
  identifierType: IdentifierType;
  senha: string;
}) {
  const clean = (v: string) => v.replace(/\D/g, '');
  let body: Record<string, string> = { senha };

  if (identifierType === 'cpf') body.cpf = clean(identifier);
  else if (identifierType === 'telefone') body.telefone = clean(identifier);
  else if (identifierType === 'email') body.email = identifier;

  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
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
