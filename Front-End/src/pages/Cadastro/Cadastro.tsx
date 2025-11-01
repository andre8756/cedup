import { useState } from 'react';
import { UserPlus, User, CreditCard, Mail, Phone, Lock } from 'lucide-react';
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
    if (numbers.length <= 11) return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return value;
  };

  const formatoTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    return value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'cpf') setFormData(prev => ({ ...prev, [name]: formatoCPF(value) }));
    else if (name === 'telefone') setFormData(prev => ({ ...prev, [name]: formatoTelefone(value) }));
    else setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        alert('Erro: ' + text);
        return;
      }

      alert('Usuário registrado com sucesso!');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Erro ao registrar usuário.');
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-content">
        <div className="cadastro-card">
          <div className="cadastro-sidebar">
            <div className="sidebar-pattern"></div>
            <div className="sidebar-content">
              <div className="icon-container"><UserPlus size={28} /></div>
              <h1 className="sidebar-title">Bem-vindo!</h1>
              <p className="sidebar-text">
                Crie sua conta e tenha acesso a todos os recursos da plataforma.
              </p>
            </div>
          </div>

          <div className="form-container">
            <h2>Criar Conta</h2>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label htmlFor="titular">Nome Completo</label>
                <input type="text" name="titular" id="titular" value={formData.titular} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="cpf">CPF</label>
                <input type="text" name="cpf" id="cpf" value={formData.cpf} onChange={handleChange} required maxLength={14} />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input type="tel" name="telefone" id="telefone" value={formData.telefone} onChange={handleChange} required maxLength={15} />
              </div>

              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <input type="password" name="senha" id="senha" value={formData.senha} onChange={handleChange} required minLength={6} />
              </div>

              <button type="submit">Cadastrar</button>
              <p>
                Já possui conta? <button type="button" onClick={() => navigate('/login')}>Fazer login</button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
