import { useState } from 'react';
import { UserPlus, User, CreditCard, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { queryUser } from '../../lib/auth';
import { API_ENDPOINTS } from '../../config/api';
import './Cadastro.css';

interface FormData {
  titular: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
}

function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    titular: '',
    cpf: '',
    email: '',
    telefone: '',
    senha: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Validação de CPF
  const validateCPF = (cpf: string): boolean => {
    const numbers = cleanNumber(cpf);
    if (numbers.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(numbers)) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(numbers.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(numbers.charAt(10))) return false;
    
    return true;
  };

  // Validação de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') || numbers;
    return value;
  };

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') || numbers;
    return value;
  };

  const cleanNumber = (value: string) => value.replace(/\D/g, '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Limpa erros do campo quando o usuário começa a digitar
    if (errors[name as keyof FormData]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }

    if (name === 'cpf') {
      const formatted = formatCPF(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
      // Valida CPF em tempo real quando completo
      if (cleanNumber(formatted).length === 11) {
        if (!validateCPF(formatted)) {
          setErrors(prev => ({ ...prev, cpf: 'CPF inválido' }));
        }
      }
    } else if (name === 'telefone') {
      setFormData(prev => ({ ...prev, [name]: formatTelefone(value) }));
    } else if (name === 'email') {
      setFormData(prev => ({ ...prev, [name]: value }));
      // Valida email em tempo real
      if (value && !validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: 'Email inválido' }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    setErrors({});

    // Validações
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.titular.trim()) {
      newErrors.titular = 'Nome completo é obrigatório';
    }
    
    const cpfNumbers = cleanNumber(formData.cpf);
    if (cpfNumbers.length !== 11) {
      newErrors.cpf = 'CPF deve ter 11 dígitos';
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    const telefoneNumbers = cleanNumber(formData.telefone);
    if (telefoneNumbers.length < 10 || telefoneNumbers.length > 11) {
      newErrors.telefone = 'Telefone deve ter 10 ou 11 dígitos';
    }
    
    if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage({ type: 'error', text: 'Por favor, corrija os erros no formulário.' });
      setLoading(false);
      return;
    }

    const body = {
      ...formData,
      cpf: cpfNumbers,
      telefone: telefoneNumbers,
    };

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        setMessage({ type: 'error', text: `Erro: ${text}` });
        setLoading(false);
        return;
      }

      const loginResult = await queryUser({
        identificador: formData.email,
        identificadorType: 'email',
        senha: formData.senha,
      });

      if (loginResult?.token) {
        // Use secure cookies only when running on HTTPS (localhost uses HTTP during dev)
        const isSecureOrigin = typeof window !== 'undefined' && window.location.protocol === 'https:';
        Cookies.set('token', loginResult.token, { expires: 7, secure: isSecureOrigin, sameSite: 'strict' });

        // Mark recent login so apiClient can retry immediate requests if needed
        try { (window as any).__RECENT_LOGIN_AT__ = Date.now(); } catch (e) { /* ignore */ }

        setMessage({ type: 'success', text: 'Cadastro realizado! Redirecionando...' });
        setTimeout(() => navigate('/conta'), 1500);
      } else {
        setMessage({ type: 'error', text: 'Cadastro realizado, mas falha ao logar automaticamente.' });
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Erro ao registrar usuário. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-content">
        <div className="cadastro-card">
          <button className="back-home-button" onClick={() => navigate('/Home')}>
            <ArrowLeft size={20} />
            Voltar para Home
          </button>
          {/* Header mobile */}
          <div className="mobile-header">
            <div className="icon-container"><UserPlus size={28} /></div>
            <h1>Cadastro</h1>
            <p>Crie sua conta e aproveite nossa plataforma</p>
          </div>
          {/* Sidebar desktop */}
          <div className="cadastro-sidebar">
            <div className="sidebar-pattern"></div>
            <div className="sidebar-content">
              <div className="icon-container"><UserPlus size={28} /></div>
              <h1 className="sidebar-title">Bem-vindo!</h1>
              <p className="sidebar-text">Crie sua conta e tenha acesso a todos os recursos da plataforma.</p>
            </div>
          </div>

          {/* Form */}
          <div className="form-container">
            <form onSubmit={handleSubmit} className="form">

              <div className="form-group">
                <label htmlFor="titular">Nome Completo</label>
                <div className="input-container">
                  <User size={18} className="input-icon" />
                  <input 
                    type="text" 
                    name="titular" 
                    id="titular" 
                    value={formData.titular} 
                    onChange={handleChange} 
                    required 
                    className={`form-input ${errors.titular ? 'input-error' : ''}`}
                    placeholder='Digite seu nome completo'
                  />
                </div>
                {errors.titular && <span className="error-message">{errors.titular}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="cpf">CPF</label>
                <div className="input-container">
                  <CreditCard size={18} className="input-icon" />
                  <input 
                    type="text" 
                    name="cpf" 
                    id="cpf" 
                    value={formData.cpf} 
                    onChange={handleChange} 
                    required 
                    maxLength={14} 
                    className={`form-input ${errors.cpf ? 'input-error' : ''}`}
                    placeholder='Digite um CPF válido'
                  />
                </div>
                {errors.cpf && <span className="error-message">{errors.cpf}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <div className="input-container">
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                    placeholder='Digite seu melhor email'
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <div className="input-container">
                  <Phone size={18} className="input-icon" />
                  <input 
                    type="tel" 
                    name="telefone" 
                    id="telefone" 
                    value={formData.telefone} 
                    onChange={handleChange} 
                    required 
                    maxLength={15} 
                    className={`form-input ${errors.telefone ? 'input-error' : ''}`}
                    placeholder='Digite seu telefone'
                  />
                </div>
                {errors.telefone && <span className="error-message">{errors.telefone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <div className="input-container password-container">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="senha" 
                    id="senha" 
                    value={formData.senha} 
                    onChange={handleChange} 
                    required 
                    minLength={8} 
                    className={`form-input ${errors.senha ? 'input-error' : ''}`}
                    placeholder='Sua senha(minimo 8 caracteres)'
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="eye-button"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff size={18} className="eye-icon" /> : <Eye size={18} className="eye-icon" />}
                  </button>
                </div>
                {errors.senha && <span className="error-message">{errors.senha}</span>}
              </div>

              {message.text && (
                <p className={`message ${message.type}`}>{message.text}</p>
              )}

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>

              <p className="login-text">
                Já possui conta? <button type="button" onClick={() => navigate('/login')} className="login-link">Fazer login</button>
              </p>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
