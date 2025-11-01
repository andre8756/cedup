import { useState } from 'react';
import { User, Lock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { queryUser } from '../../lib/auth';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // remove formatação só ao enviar
  const clean = (value: string) => value.replace(/\D/g, '');

  const getIdentifierType = (value: string) => {
    if (value.includes('@')) return 'email';
    const digits = clean(value);
    if (digits.length === 11 && value.includes('.')) return 'cpf';
    if (digits.length === 11) return 'telefone';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const identifierType = getIdentifierType(identifier);
      if (!identifierType) {
        setMessage({ type: 'error', text: 'Formato de identificador inválido.' });
        setLoading(false);
        return;
      }

      const result = await queryUser({
        identifier,
        identifierType,
        senha,
      });

      if (!result?.token) {
        setMessage({ type: 'error', text: 'Credenciais inválidas.' });
      } else {
        localStorage.setItem('token', result.token);
        setMessage({ type: 'success', text: 'Login realizado! Redirecionando...' });
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao fazer login. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-side">
          <div className="brand">
            <LogIn size={36} />
          </div>
          <h1>Bem-vindo de volta!</h1>
          <p>Faça login para acessar todos os recursos da plataforma.</p>
          <div className="feature-list">
            <div className="feature"><div className="dot" /> Segurança garantida</div>
            <div className="feature"><div className="dot" /> Acesso rápido e fácil</div>
            <div className="feature"><div className="dot" /> Interface moderna</div>
          </div>
        </div>

        <div className="login-main">
          <div className="login-header">
            <h1>Login</h1>
            <p>Insira suas credenciais para continuar</p>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label>CPF, E-mail ou Telefone</label>
              <div className="input-container">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="input"
                  placeholder="Digite seu CPF, email ou telefone"
                  required
                />
                <User className="icon" />
              </div>
            </div>

            <div className="field">
              <label>Senha</label>
              <div className="input-container">
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="input"
                  placeholder="Sua senha"
                  required
                />
                <Lock className="icon" />
              </div>
            </div>

            {message.text && (
              <p className={`message ${message.type}`}>{message.text}</p>
            )}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <p className="meta">
              Não possui conta?{' '}
              <button type="button" onClick={() => navigate('/cadastro')}>
                Cadastre-se
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
