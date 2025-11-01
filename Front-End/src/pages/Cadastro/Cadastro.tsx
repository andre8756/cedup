// Cadastro.tsx
import { useState } from 'react';
import { UserPlus, User, CreditCard, Mail, Phone, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { queryUser } from '../../lib/auth'; // função de login
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
    if (name === 'cpf') setFormData(prev => ({ ...prev, [name]: formatCPF(value) }));
    else if (name === 'telefone') setFormData(prev => ({ ...prev, [name]: formatTelefone(value) }));
    else setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      ...formData,
      cpf: cleanNumber(formData.cpf),
      telefone: cleanNumber(formData.telefone),
    };

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        alert('Erro: ' + text);
        return;
      }

      const loginResult = await queryUser({
        identifier: formData.email,
        identifierType: 'email',
        senha: formData.senha,
      });

      if (loginResult?.token) {
        Cookies.set('token', loginResult.token, { expires: 7 });
        navigate('/conta');
      } else {
        alert('Cadastro realizado, mas falha ao logar automaticamente.');
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao registrar usuário.');
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-content">
        <div className="cadastro-card">

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
                  <input type="text" name="titular" id="titular" value={formData.titular} onChange={handleChange} required className="form-input"/>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="cpf">CPF</label>
                <div className="input-container">
                  <CreditCard size={18} className="input-icon" />
                  <input type="text" name="cpf" id="cpf" value={formData.cpf} onChange={handleChange} required maxLength={14} className="form-input"/>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <div className="input-container">
                  <Mail size={18} className="input-icon" />
                  <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="form-input"/>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <div className="input-container">
                  <Phone size={18} className="input-icon" />
                  <input type="tel" name="telefone" id="telefone" value={formData.telefone} onChange={handleChange} required maxLength={15} className="form-input"/>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <div className="input-container">
                  <Lock size={18} className="input-icon" />
                  <input type="password" name="senha" id="senha" value={formData.senha} onChange={handleChange} required minLength={6} className="form-input"/>
                </div>
              </div>

              <button type="submit" className="submit-button">Cadastrar</button>

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
