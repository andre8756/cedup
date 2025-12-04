import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { apiFetch } from '../../config/apiClient';
import api from '../../config/apiClient';
import { API_ENDPOINTS } from '../../config/api';
import './PerfilUsuario.css';
import { Eye, EyeOff } from 'lucide-react';
import { getShowSensitive, setShowSensitive, subscribeSensitive } from '../../lib/sensitive';

interface ContaResponse {
  titular: string;
  cpf: string;
  email: string;
  telefone: string;
  saldoTotal: number;
  status: boolean;
  dataCadastro: string;
  avatarUrl?: string;
  bancos: Array<{
    id: number;
    nome: string;
    agencia: string;
    conta: string;
  }>;
}

interface ContaUpdateRequest {
  titular: string;
  email: string;
  telefone: string;
  senha?: string;
  status?: boolean;
}

function PerfilUsuario() {
  const navigate = useNavigate();
  const [conta, setConta] = useState<ContaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [receita, setReceita] = useState<number | null>(null);
  const [despesa, setDespesa] = useState<number | null>(null);
  const [showSensitive, setShowSensitiveState] = useState<boolean>(getShowSensitive());

  const setShowSensitiveAll = (v: boolean) => {
    try {
      setShowSensitive(v);
    } finally {
      setShowSensitiveState(v);
    }
  };

  // Estados do formulário de edição
  const [formData, setFormData] = useState<ContaUpdateRequest>({
    titular: '',
    email: '',
    telefone: '',
    senha: '',
    status: true,
  });

  // Carregar dados da conta
  useEffect(() => {
    const fetchConta = async () => {
      const token = Cookies.get('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const resp = await apiFetch(API_ENDPOINTS.CONTA.ATUAL);
        if (!resp.ok) {
          if (resp.status === 401 || resp.status === 403) {
            navigate('/login');
            return;
          }
          throw new Error('Erro ao carregar dados da conta');
        }

        const data = await resp.json();
        setConta(data);
        setFormData({
          titular: data.titular || '',
          email: data.email || '',
          telefone: data.telefone || '',
          senha: '',
          status: data.status !== undefined ? data.status : true,
        });
      } catch (error) {
        console.error("Erro ao buscar conta:", error);
        setError('Erro ao carregar dados da conta');
      } finally {
        setLoading(false);
      }
    };

    fetchConta();
  }, [navigate]);

  // Buscar receita e despesa mensal para o resumo financeiro
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) return;

    const fetchValores = async () => {
      try {
        const receitaResp = await apiFetch('/conta/banco/transacao/receita');
        if (!receitaResp.ok) {
          console.warn('[Perfil] receita endpoint returned', receitaResp.status);
        }

        const despesaResp = await apiFetch('/conta/banco/transacao/despesa');
        if (!despesaResp.ok) {
          console.warn('[Perfil] despesa endpoint returned', despesaResp.status);
        }

        const receitaValor = receitaResp.ok ? await receitaResp.json() : 0;
        const despesaValor = despesaResp.ok ? await despesaResp.json() : 0;

        setReceita(typeof receitaValor === 'number' ? receitaValor : 0);
        setDespesa(typeof despesaValor === 'number' ? despesaValor : 0);
      } catch (error) {
        console.error('Erro ao buscar valores de receita/despesa:', error);
      }
    };

    fetchValores();
  }, []);

  // Subscribe to global sensitive flag changes
  useEffect(() => {
    const unsub = subscribeSensitive((v) => setShowSensitiveState(v));
    return unsub;
  }, []);

  // Função para atualizar conta
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validações básicas
    if (!formData.titular || formData.titular.length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres');
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      setError('Email inválido');
      return;
    }

    if (!formData.telefone || formData.telefone.length < 10) {
      setError('Telefone inválido (mínimo 10 dígitos)');
      return;
    }

    if (formData.senha && formData.senha.length > 0 && formData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      // Remove senha vazia do payload
      const updatePayload: ContaUpdateRequest = {
        titular: formData.titular,
        email: formData.email,
        telefone: formData.telefone,
        status: formData.status,
      };

      if (formData.senha && formData.senha.length > 0) {
        updatePayload.senha = formData.senha;
      }

      const response = await api.put(API_ENDPOINTS.CONTA.EDITAR, updatePayload);

      if (response.status === 200) {
        setSuccess('Conta atualizada com sucesso!');
        setEditing(false);
        // Recarrega os dados
        const resp = await apiFetch(API_ENDPOINTS.CONTA.ATUAL);
        if (resp.ok) {
          const data = await resp.json();
          setConta(data);
          setFormData({
            ...formData,
            senha: '', // Limpa a senha após atualização
          });
        }
      }
    } catch (error: any) {
      console.error("Erro ao atualizar conta:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Erro ao atualizar conta. Tente novamente.');
      }
    }
  };

  // Função de logout
  const handleLogout = async () => {
    try {
      // Chama o endpoint de logout
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      // Remove o token e redireciona para login
      Cookies.remove('token');
      navigate('/login');
    }
  };

  // Função para deletar conta
  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita e todos os seus dados serão perdidos.')) {
      return;
    }

    if (!window.confirm('Esta é sua última chance. Confirme novamente para deletar sua conta permanentemente.')) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const response = await api.delete(API_ENDPOINTS.CONTA.DELETAR);
      
      if (response.status === 200 || response.status === 204) {
        // Remove token e redireciona
        Cookies.remove('token');
        navigate('/login');
      }
    } catch (error: any) {
      console.error("Erro ao deletar conta:", error);
      setError('Erro ao deletar conta. Tente novamente.');
      setDeleting(false);
    }
  };

  // Formatar data
  const formatDate = (dateInput?: string | number | null) => {
    if (!dateInput && dateInput !== 0) return '—';

    // Normaliza entrada numérica (timestamp em segundos ou ms)
    let date: Date;
    try {
      if (typeof dateInput === 'number') {
        // Se parece com segundos (10 dígitos), multiplica por 1000
        date = new Date(dateInput > 1e12 ? dateInput : dateInput * 1000);
      } else if (/^\d+$/.test(String(dateInput))) {
        const n = Number(dateInput);
        date = new Date(n > 1e12 ? n : n * 1000);
      } else {
        date = new Date(String(dateInput));
      }
    } catch {
      return String(dateInput);
    }

    if (isNaN(date.getTime())) return String(dateInput);

    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Formatar CPF
  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Formatar telefone
  const formatPhone = (phone: string) => {
    if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (phone.length === 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  if (loading) {
    return (
      <div className="perfil-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (!conta) {
    return (
      <div className="perfil-container">
        <div className="error-message">
          <p>Erro ao carregar dados da conta</p>
          <button onClick={() => navigate('/conta')} className="btn-secondary">
            Voltar
          </button>
        </div>
      </div>
    );
  }

return (
    <div className="perfil-container">
      {/* Header */}
      <header className="header-main">
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/conta')}>
          <img src="/Logo-Completa.png" alt="Solvian" className="logo-image" />
        </div>
        <nav className="header-nav">
          <button className="nav-tab" onClick={() => navigate('/conta')}>
            Visão geral
          </button>
          <button className="nav-tab" onClick={() => navigate('/relatorios')}>Relatórios</button>
          <button className="nav-tab active">Perfil</button>
          <button 
            className="nav-tab"
            onClick={() => {
              navigate('/banco');
            }}
          >
            Bancos
          </button>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label={showSensitive ? 'Ocultar dados sensíveis' : 'Mostrar dados sensíveis'}
            onClick={() => setShowSensitiveAll(!showSensitive)}
          >
            {showSensitive ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
          {/* Configurações removido - botão eliminado */}
          <div className="avatar-circle" title={conta?.titular || 'Usuário'} style={{ marginLeft: 8 }} onClick={() => navigate('/perfil')}>
            <img
              src={conta?.avatarUrl || '/Logo-Completa.png'}
              alt="avatar"
              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>
          <button className="logout-button" onClick={handleLogout} aria-label="Sair">
            Sair
          </button>
        </div>
      </header>

      <div className="perfil-content">
        <div className="perfil-header">
          <div className="avatar-section">
            {conta.avatarUrl ? (
              <img src={conta.avatarUrl} alt="Avatar" className="avatar-image" />
            ) : (
              <div className="avatar-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}
            <div className="status-badge">
              <span className={`status-dot ${conta.status ? 'active' : 'inactive'}`}></span>
              <span>{conta.status ? 'Ativo' : 'Inativo'}</span>
            </div>
          </div>
          <div className="header-info">
            <h1>{conta.titular}</h1>
            <p className="subtitle">Membro desde {formatDate(conta.dataCadastro)}</p>
          </div>
          <div className="perfil-header-actions">
            <button className="btn-primary" type="button" onClick={() => { setError(null); setSuccess(null); setEditing(true); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <span className="btn-label">Editar Perfil</span>
            </button>
            <button 
              className="btn-danger" 
              onClick={handleDelete}
              disabled={deleting}
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              <span className="btn-label">{deleting ? 'Deletando...' : 'Deletar Conta'}</span>
            </button>
          </div>
        </div>

        {/* Mensagens de erro/sucesso */}
        {error && (
          <div className="alert alert-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>{success}</span>
          </div>
        )}

        {!editing ? (
          /* Modo Visualização */
          <div className="perfil-cards">
            <div className="info-card">
              <h2>Informações Pessoais</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Nome Completo</label>
                  <p>{conta.titular}</p>
                </div>
                <div className="info-item">
                  <label>CPF</label>
                  <p>{showSensitive ? formatCPF(conta.cpf) : '•••.•••.•••-••'}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{conta.email}</p>
                </div>
                <div className="info-item">
                  <label>Telefone</label>
                  <p>{showSensitive ? formatPhone(conta.telefone) : '••••••••••'}</p>
                </div>
                <div className="info-item">
                  <label>Status da Conta</label>
                  <p className={conta.status ? 'status-active' : 'status-inactive'}>
                    {conta.status ? 'Ativa' : 'Inativa'}
                  </p>
                </div>
                <div className="info-item">
                  <label>Data de Cadastro</label>
                  <p>{formatDate(conta.dataCadastro)}</p>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h2>Resumo Financeiro</h2>
              <div className="balance-display">
                <label>Saldo Total</label>
                <p className="balance-value">
                  {showSensitive
                    ? conta.saldoTotal.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    : 'R$ ••••••'}
                </p>
              </div>
            </div>
              <div className="info-card">
                <h2>Resumo Mensal</h2>
                <div className="monthly-summary">
                  <div className="monthly-item">
                    <label>Receita Mensal</label>
                    <p className="monthly-value">
                      {receita !== null
                        ? receita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                        : 'R$ 0,00'}
                    </p>
                  </div>
                  <div className="monthly-item">
                    <label>Despesa Mensal</label>
                    <p className="monthly-value">
                      {despesa !== null
                        ? despesa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                        : 'R$ 0,00'}
                    </p>
                  </div>
                </div>
              </div>

            {conta.bancos && conta.bancos.length > 0 && (
              <div className="info-card">
                <h2>Bancos Vinculados</h2>
                <div className="bancos-list bancos-vinculados-compact">
                  {conta.bancos.map((banco: any) => {
                    const nome = banco.nomeBanco || banco.nome || '—';
                    const titularBanco = banco.titular || '—';
                    const saldoVal = Number(banco.saldo ?? 0) || 0;

                    return (
                      <div key={banco.id ?? nome} className="banco-item compact">
                        <div className="banco-compact-row">
                          {banco.bancoUrl && (
                            <img src={banco.bancoUrl} alt={nome} className="banco-logo-compact" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                          )}
                          <div className="banco-compact-info">
                            <h4 className="banco-nome-compact">{nome}</h4>
                            <p className="banco-titular-compact">{titularBanco}</p>
                          </div>
                          <div className="banco-saldo-compact">
                            {showSensitive
                              ? saldoVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                              : 'R$ •••••'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            
          </div>
        ) : (
          /* Modo Edição */
          <div className="perfil-cards">
            <div className="info-card">
              <div className="card-header">
                <h2>Editar Perfil</h2>
                <button className="btn-close" onClick={() => {
                  setEditing(false);
                  setError(null);
                  setSuccess(null);
                  // Restaura dados originais
                  if (conta) {
                    setFormData({
                      titular: conta.titular || '',
                      email: conta.email || '',
                      telefone: conta.telefone || '',
                      senha: '',
                      status: conta.status !== undefined ? conta.status : true,
                    });
                  }
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpdate} className="edit-form">
                <div className="form-group">
                  <label htmlFor="titular">Nome Completo *</label>
                  <input
                    type="text"
                    id="titular"
                    value={formData.titular}
                    onChange={(e) => setFormData({ ...formData, titular: e.target.value })}
                    required
                    minLength={3}
                    maxLength={100}
                    placeholder="Digite seu nome completo"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telefone">Telefone *</label>
                  <input
                    type="tel"
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value.replace(/\D/g, '') })}
                    required
                    minLength={10}
                    maxLength={11}
                    placeholder="47999999999"
                  />
                  <small>Digite apenas números (10 ou 11 dígitos)</small>
                </div>

                <div className="form-group">
                  <label htmlFor="senha">Nova Senha (opcional)</label>
                  <input
                    type="password"
                    id="senha"
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    minLength={6}
                    maxLength={20}
                    placeholder="Deixe em branco para manter a senha atual"
                  />
                  <small>Mínimo 6 caracteres. Deixe em branco para não alterar.</small>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                    />
                    <span>Conta ativa</span>
                  </label>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => {
                    setEditing(false);
                    setError(null);
                    setSuccess(null);
                  }}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
);
}

export default PerfilUsuario;
