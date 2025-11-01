import { useState, useEffect } from 'react';
import { UserPlus, Lock, Mail, Phone, User, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Cadastro.css';

function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titular: '',
    cpf: '',
    email: '',
    telefone: '',
    senha: '',
  });

  const formatoCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const formatoTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'cpf') {
      setFormData(prev => ({ ...prev, [name]: formatoCPF(value) }));
    } else if (name === 'telefone') {
      setFormData(prev => ({ ...prev, [name]: formatoTelefone(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
  };

  useEffect(() => {
    console.log('Cadastro component mounted');
  }, []);

  return (
    <div className="cadastro-container">
      <div className="cadastro-content">
        <div className="cadastro-card">
          <div className="cadastro-sidebar">
            <div className="sidebar-pattern"></div>
            <div className="sidebar-content">
              <div>
                <div className="icon-container">
                  <UserPlus size={28} />
                </div>
                <h1 className="sidebar-title">Bem-vindo!</h1>
                <p className="sidebar-text">
                  Crie sua conta e tenha acesso a todos os recursos da plataforma.
                </p>
              </div>
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-dot"></div>
                  <p className="feature-text">Cadastro rápido e seguro</p>
                </div>
                <div className="feature-item">
                  <div className="feature-dot"></div>
                  <p className="feature-text">Proteção de dados garantida</p>
                </div>
                <div className="feature-item">
                  <div className="feature-dot"></div>
                  <p className="feature-text">Suporte disponível 24/7</p>
                </div>
              </div>
            </div>
          </div>

          <div className="form-container">
            <div className="mobile-header">
              <div className="mobile-icon-container">
                  <div className="mobile-icon-bg">
                  <UserPlus size={20} />
                </div>
              </div>
              <h1 className="mobile-title">Cadastro</h1>
              <p className="mobile-subtitle">Preencha seus dados para começar</p>
            </div>

            <div className="desktop-header">
              <h2 className="desktop-title">Criar Conta</h2>
              <p className="desktop-subtitle">Preencha os campos abaixo para se cadastrar</p>
            </div>

            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label htmlFor="titular" className="form-label">
                  Nome Completo
                </label>
                <div className="input-container">
                  <div className="input-icon">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    id="titular"
                    name="titular"
                    value={formData.titular}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Digite seu nome completo"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="cpf" className="form-label">
                  CPF
                </label>
                <div className="input-container">
                  <div className="input-icon">
                    <CreditCard size={18} />
                  </div>
                  <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    required
                    maxLength={14}
                    className="form-input"
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
                <div className="input-container">
                  <div className="input-icon">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="telefone" className="form-label">
                  Telefone
                </label>
                <div className="input-container">
                  <div className="input-icon">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    maxLength={15}
                    className="form-input"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="senha" className="form-label">
                  Senha
                </label>
                <div className="input-container">
                  <div className="input-icon">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    id="senha"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="form-input"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              </div>

              <button type="submit" className="submit-button">
                Cadastrar
              </button>

              <p className="login-text">
                Já possui uma conta?{' '}
                <button type="button" onClick={() => navigate('/login')} className="login-link">
                  Fazer login
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
