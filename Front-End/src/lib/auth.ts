// Small local auth stub to replace Supabase usage.
// This provides a minimal compatible interface for the Login page.

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
  // Example hardcoded users. You can replace this with calls to your API.
  const users = [
    {
      id: 1,
      titular: 'Usuário Teste',
      cpf: '00000000000',
      telefone: '00000000000',
      email: 'teste@teste.com',
      senha: '1234',
    },
  ];

  // Normalize inputs
  const clean = (v: string) => v.replace(/\D/g, '');

  let user = null;

  if (identifierType === 'cpf') {
    const cpf = clean(identifier);
    user = users.find((u) => u.cpf === cpf && u.senha === senha) ?? null;
  } else if (identifierType === 'telefone') {
    const telefone = clean(identifier);
    user = users.find((u) => u.telefone === telefone && u.senha === senha) ?? null;
  } else if (identifierType === 'email') {
    user = users.find((u) => u.email === identifier && u.senha === senha) ?? null;
  } else {
    // Fallback: try email or cpf/telefone
    user = users.find((u) => (u.email === identifier || u.cpf === clean(identifier) || u.telefone === clean(identifier)) && u.senha === senha) ?? null;
  }

  // Simulate async
  return new Promise<{ id: number; titular: string } | null>((resolve) => {
    setTimeout(() => resolve(user ? { id: user.id, titular: user.titular } : null), 300);
  });
}
