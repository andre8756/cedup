import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from '../../config/apiClient';
import { API_ENDPOINTS } from '../../config/api';
import { apiFetch } from '../../config/apiClient';
import './Relatorios.css';

interface TransacaoResponseDto {
  id: number;
  contaOrigemId: number;
  bancoOrigemChavePix: string;
  bancoOrigemNome: string;
  bancoOrigemTitular: string;
  contaDestinoId: number;
  bancoDestinoChavePix: string;
  bancoDestinoNome: string;
  bancoDestinoTitular: string;
  valor: number;
  descricao: string;
  dataTransacao: string;
}

interface TransacaoFiltro {
  contaId?: number;
  contaOrigemId?: number;
  contaDestinoId?: number;
  bancoOrigemId?: number;
  bancoDestinoId?: number;
  bancosIds?: number[];
  contasIds?: number[];
  dataInicio?: string;
  dataFim?: string;
  valor?: number;
  descricao?: string;
}

function Relatorios() {
  const navigate = useNavigate();
  const [transacoes, setTransacoes] = useState<TransacaoResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados dos filtros
  const [filtros, setFiltros] = useState<TransacaoFiltro>({});
  const [availableBancos, setAvailableBancos] = useState<any[]>([]);
  const [selectedBankIds, setSelectedBankIds] = useState<number[]>([]);

  // Carregar transações iniciais
  useEffect(() => {
    buscarTransacoes();
  }, []);

  // Carregar lista de bancos disponíveis para filtros (checkboxes)
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) return;

    const fetchBancos = async () => {
      try {
        const resp = await apiFetch('/conta/banco');
        if (!resp.ok) {
          console.warn('[Relatorios] /conta/banco returned', resp.status);
          return;
        }
        const data = await resp.json();
        setAvailableBancos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erro ao buscar bancos para filtros:', err);
      }
    };

    fetchBancos();
  }, []);

  // Função para buscar transações com filtros
  const buscarTransacoes = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {};

      // Adiciona filtros ao objeto de parâmetros
      if (filtros.contaId) params.contaId = filtros.contaId;
      if (filtros.contaOrigemId) params.contaOrigemId = filtros.contaOrigemId;
      if (filtros.contaDestinoId) params.contaDestinoId = filtros.contaDestinoId;
      if (filtros.bancoOrigemId) params.bancoOrigemId = filtros.bancoOrigemId;
      if (filtros.bancoDestinoId) params.bancoDestinoId = filtros.bancoDestinoId;
      
      // Para listas, usa arrays diretamente (axios converte automaticamente para múltiplos parâmetros)
      if (filtros.bancosIds && filtros.bancosIds.length > 0) {
        params.bancosIds = filtros.bancosIds;
      }
      if (filtros.contasIds && filtros.contasIds.length > 0) {
        params.contasIds = filtros.contasIds;
      }
      
      if (filtros.dataInicio) params.dataInicio = filtros.dataInicio;
      if (filtros.dataFim) params.dataFim = filtros.dataFim;
      if (filtros.valor) params.valor = filtros.valor;
      if (filtros.descricao) params.descricao = filtros.descricao;

      const response = await api.get(API_ENDPOINTS.BANCO.LISTAR_COM_FILTROS, { params });
      setTransacoes(response.data || []);
    } catch (error: any) {
      console.error("Erro ao buscar transações:", error);
      setError('Erro ao buscar transações. Verifique os filtros e tente novamente.');
      setTransacoes([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para gerar PDF
  const gerarPDF = async () => {
    try {
      const params: any = {};

      if (filtros.contaId) params.contaId = filtros.contaId;
      if (filtros.contaOrigemId) params.contaOrigemId = filtros.contaOrigemId;
      if (filtros.contaDestinoId) params.contaDestinoId = filtros.contaDestinoId;
      if (filtros.bancoOrigemId) params.bancoOrigemId = filtros.bancoOrigemId;
      if (filtros.bancoDestinoId) params.bancoDestinoId = filtros.bancoDestinoId;
      
      // Para listas, usa arrays diretamente
      if (filtros.bancosIds && filtros.bancosIds.length > 0) {
        params.bancosIds = filtros.bancosIds;
      }
      if (filtros.contasIds && filtros.contasIds.length > 0) {
        params.contasIds = filtros.contasIds;
      }
      
      if (filtros.dataInicio) params.dataInicio = filtros.dataInicio;
      if (filtros.dataFim) params.dataFim = filtros.dataFim;
      if (filtros.valor) params.valor = filtros.valor;
      if (filtros.descricao) params.descricao = filtros.descricao;

      const response = await api.get(API_ENDPOINTS.BANCO.DOWNLOAD_PDF, {
        params,
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = `relatorio-transacoes-${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlBlob);
    } catch (error: any) {
      console.error("Erro ao gerar PDF:", error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  // Função para limpar filtros
  const limparFiltros = () => {
    setFiltros({});
    setSelectedBankIds([]);
  };

  // Função para atualizar filtros
  const atualizarFiltro = (key: keyof TransacaoFiltro, value: any) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  // Função para atualizar lista de IDs de bancos
  // Seleção por checkbox para bancos
  const selecionarTodosBancos = () => {
    const ids = availableBancos.map(b => b.id).filter((id: any) => typeof id === 'number');
    setSelectedBankIds(ids);
    atualizarFiltro('bancosIds', ids.length > 0 ? ids : undefined);
  };

  const selecionarNenhumBanco = () => {
    setSelectedBankIds([]);
    atualizarFiltro('bancosIds', undefined);
  };

  const alternarSelecaoBanco = (id: number) => {
    setSelectedBankIds(prev => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(x => x !== id) : [...prev, id];
      atualizarFiltro('bancosIds', next.length > 0 ? next : undefined);
      return next;
    });
  };

  

  // Função de logout
  const handleLogout = async () => {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      Cookies.remove('token');
      navigate('/login');
    }
  };

  // Formatar data
  const formatarData = (dataString: string) => {
    try {
      const date = new Date(dataString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dataString;
    }
  };

  return (
    <div className="relatorios-container">
      {/* Header */}
      <header className="header-main">
        <div className="logo">
          <img src="/Logo-Completa.png" alt="Solvian" className="logo-image" />
        </div>
        <nav className="header-nav">
          <button className="nav-tab" onClick={() => navigate('/conta')}>
            Visão geral
          </button>
          <button className="nav-tab active">Relatórios</button>
          <button className="nav-tab" onClick={() => navigate('/perfil')}>
            Perfil
          </button>
          <button 
            className="nav-tab"
            onClick={() => {
              navigate('/conta');
              setTimeout(() => {
                const banksSection = document.querySelector('.balance-accounts-card');
                if (banksSection) {
                  banksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }, 100);
            }}
          >
            Bancos
          </button>
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Alternar visibilidade">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
          <button className="icon-button" aria-label="Configurações">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
            </svg>
          </button>
          <button className="logout-button" onClick={handleLogout} aria-label="Sair">
            Sair
          </button>
        </div>
      </header>

      <div className="relatorios-content">
        <div className="relatorios-header">
          <h1>Relatórios de Transações</h1>
          <p>Filtre e gere relatórios das suas transações financeiras</p>
        </div>

        {/* Filtros */}
        <div className="filtros-card">
          <div className="filtros-header">
            <h2>Filtros</h2>
            <div className="filtros-actions">
              <button className="btn-secondary" onClick={limparFiltros}>
                Limpar Filtros
              </button>
              <button className="btn-primary" onClick={buscarTransacoes} disabled={loading}>
                {loading ? 'Buscando...' : 'Aplicar Filtros'}
              </button>
            </div>
          </div>

          <div className="filtros-grid">
            {/* Filtros de Conta/Banco por ID removidos — use seleção visual acima (bancos) e outros filtros */}

            <div className="filtro-group full-width boxed">
              <label>Bancos</label>
              <div className="bancos-actions" style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <button type="button" className="btn-secondary" onClick={selecionarTodosBancos}>Selecionar todos</button>
                <button type="button" className="btn-secondary" onClick={selecionarNenhumBanco}>Selecionar nenhum</button>
              </div>
              <div className="bancos-list">
                {availableBancos.length === 0 ? (
                  <small>Nenhum banco encontrado</small>
                ) : (
                  availableBancos.map((banco) => (
                    <label key={banco.id} className="banco-checkbox" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <input
                        type="checkbox"
                        checked={selectedBankIds.includes(banco.id)}
                        onChange={() => alternarSelecaoBanco(banco.id)}
                      />
                      <span style={{ fontWeight: 600 }}>{banco.nomeBanco || banco.nome || '—'}</span>
                      <small style={{ marginLeft: 8, color: '#666' }}>{banco.titular || '—'}</small>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Filtros de Data */}
            <div className="filtro-group">
              <label>Data de Início</label>
              <input
                type="datetime-local"
                value={filtros.dataInicio || ''}
                onChange={(e) => atualizarFiltro('dataInicio', e.target.value || undefined)}
              />
            </div>

            <div className="filtro-group">
              <label>Data de Fim</label>
              <input
                type="datetime-local"
                value={filtros.dataFim || ''}
                onChange={(e) => atualizarFiltro('dataFim', e.target.value || undefined)}
              />
            </div>

            {/* Filtros de Valor e Descrição */}
            <div className="filtro-group">
              <label>Valor Exato</label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 100.50"
                value={filtros.valor || ''}
                onChange={(e) => atualizarFiltro('valor', e.target.value ? parseFloat(e.target.value) : undefined)}
                min="0"
              />
            </div>

            <div className="filtro-group full-width">
              <label>Descrição (busca parcial)</label>
              <input
                type="text"
                placeholder="Ex: Transferência"
                value={filtros.descricao || ''}
                onChange={(e) => atualizarFiltro('descricao', e.target.value || undefined)}
              />
              <small>Busca parcial no texto da descrição</small>
            </div>
          </div>
        </div>

        {/* Botão de Gerar PDF */}
        <div className="pdf-section">
          <button className="btn-pdf" onClick={gerarPDF} disabled={loading}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Gerar PDF
          </button>
        </div>

        {/* Mensagem de erro */}
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

        {/* Resultados */}
        <div className="resultados-card">
          <div className="resultados-header">
            <h2>Resultados</h2>
            <span className="resultados-count">
              {transacoes.length} transação(ões) encontrada(s)
            </span>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Carregando transações...</p>
            </div>
          ) : transacoes.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma transação encontrada com os filtros aplicados.</p>
            </div>
          ) : (
            <div className="transacoes-table">
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Origem</th>
                    <th>Destino</th>
                    <th>Valor</th>
                    <th>Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  {transacoes.map((transacao) => (
                    <tr key={transacao.id}>
                      <td>{formatarData(transacao.dataTransacao)}</td>
                      <td>
                        <div className="banco-info">
                          <strong>{transacao.bancoOrigemNome}</strong>
                          <small>{transacao.bancoOrigemTitular}</small>
                          <small>PIX: {transacao.bancoOrigemChavePix}</small>
                        </div>
                      </td>
                      <td>
                        <div className="banco-info">
                          <strong>{transacao.bancoDestinoNome}</strong>
                          <small>{transacao.bancoDestinoTitular}</small>
                          <small>PIX: {transacao.bancoDestinoChavePix}</small>
                        </div>
                      </td>
                      <td className={transacao.valor > 0 ? 'valor-positivo' : 'valor-negativo'}>
                        {transacao.valor.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td>{transacao.descricao || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Relatorios;

