import './Login.css';
import { useState } from 'react';
import { LogIn, Lock, Phone, Mail, User } from 'lucide-react';
import { queryUser } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const formatInput = (value: string) => {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length === 11 && !value.includes('.')) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    if (numbers.length === 11 && value.includes('(')) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    return value;
  };

  const getIdentifierType = (value: string) => {
    const clean = value.replace(/\D/g, '');

    if (clean.length === 11 && !value.includes('@')) {
      if (value.includes('.') && value.includes('-')) {
        return 'cpf';
      } else if (value.includes('(')) {
        return 'telefone';
      }
    }

    if (value.includes('@')) {
      return 'email';
    }

    return null;
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIdentifier(formatInput(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const identifierType = getIdentifierType(identifier);

      if (!identifierType && !identifier.includes('@')) {
        setMessage({ type: 'error', text: 'Digite um CPF, telefone ou e-mail válido.' });
        setLoading(false);
        return;
      }

      // Use local auth helper instead of Supabase
      const result = await queryUser({ identifier, identifierType, senha });

      if (!result) {
        setMessage({ type: 'error', text: 'Credenciais inválidas. Verifique seus dados.' });
      } else {
        setMessage({ type: 'success', text: `Bem-vindo, ${result.titular}! Redirecionando...` });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao fazer login. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-side">
            <div className="relative z-10">
              <div className="mb-8">
                <div className="brand">
                  <LogIn className="icon" />
                </div>
                <h1>Bem de volta!</h1>
                <p>
                  Acesse sua conta com CPF, e-mail ou telefone e continue de onde parou.
                </p>
              </div>

              <div className="feature-list">
                <div className="feature"><div className="dot"></div><p>Acesso seguro e rápido</p></div>
                <div className="feature"><div className="dot"></div><p>Múltiplas opções de login</p></div>
                <div className="feature"><div className="dot"></div><p>Seus dados protegidos</p></div>
              </div>
            </div>
          </div>

          <div className="login-main">
            <div className="login-header">
              <div style={{display:'flex',justifyContent:'center',marginBottom:12}}>
                <div style={{background:'linear-gradient(90deg,#2563eb,#1e40af)',padding:8,borderRadius:999}}>
                  <LogIn size={20} className="icon" />
                </div>
              </div>
              <h1>Login</h1>
              <p>Acesse sua conta</p>
            </div>

            <div className="info-block">
              <h2>Fazer Login</h2>
              <p>Use CPF, e-mail ou telefone para acessar</p>
            </div>

            <form onSubmit={handleSubmit} className="form">
              <div>
                <label htmlFor="identifier">CPF, E-mail ou Telefone</label>
                <div className="field">
                  <div className="icon">
                    {identifier.includes('@') ? (
                      <Mail size={18} />
                    ) : identifier.includes('(') ? (
                      <Phone size={18} />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  <input
                    type="text"
                    id="identifier"
                    value={identifier}
                    onChange={handleIdentifierChange}
                    required
                    className="input"
                    placeholder="000.000.000-00 ou seu@email.com ou (00) 00000-0000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="senha">Senha</label>
                <div className="field">
                  <div className="icon"><Lock size={18} /></div>
                  <input
                    type="password"
                    id="senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    className="input"
                    placeholder="Digite sua senha"
                  />
                </div>
              </div>

              <div className="form-footer">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" />
                  <span>Lembrar-me</span>
                </label>
                <a href="#">Esqueceu a senha?</a>
              </div>

              {message.text && (
                <div className={`message ${message.type === 'success' ? 'success' : 'error'}`}>
                  <p>{message.text}</p>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

              <p className="meta">
                Não possui uma conta?{' '}
                <button type="button" onClick={() => navigate('/cadastro')}>
                  Cadastrar
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
