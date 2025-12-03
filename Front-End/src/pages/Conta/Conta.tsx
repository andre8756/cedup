import React, { useState } from "react";
import PopupForm from "../../components/PopupAdd/PopupAdd";
import PopupEdit from "../../components/PopupEdit/PopupEdit";
import "./Conta.css";
import HistoricoTransacoes from "../../components/HistoricoTransacoes/HistoricoTransacoes";
// API_BASE_URL resolved at runtime by src/config/api.ts if needed (not used directly here)
import Cookies from 'js-cookie';
import { apiFetch } from '../../config/apiClient';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../../config/apiClient';
import { API_ENDPOINTS } from '../../config/api';

interface Banco {
  id: number;
  titular: string;
  nomeBanco: string;
  saldo: number;
  chavePix?: string;
  status?: boolean;
  permitirTransacao?: boolean;
  bancoUrl: string;
  dataCadastro?: string;
}

// Função helper para obter logo do banco
const getBankLogo = (nomeBanco: string, bancoUrl?: string): string => {
  // Normaliza o nome do banco para buscar na pasta public
  const normalizedName = nomeBanco.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  // Tenta usar logo local primeiro
  const localLogo = `/logos/${normalizedName}.png`;
  
  // Se não tiver logo local, usa a URL do backend
  return bancoUrl || localLogo;
};

interface Conta {
  id: number;
  titular: string;
  saldo: number;
  bancos: Banco[];
}

interface BancoItem {
  id: number;
  titular: string;
  nomeBanco: string;
  saldo: number;
  chavePix?: string;
  status?: boolean;
  permitirTransacao?: boolean;
  bancoUrl: string;
  dataCadastro?: string;
}

const Conta: React.FC = () => {
  const navigate = useNavigate();
  
  // Dados placeholder
const [contaAtual, setContaAtual] = useState<Conta | null>(null);
useEffect(() => {
  const token = Cookies.get('token');
  if (!token) return;

  const fetchContaAtual = async () => {
    try {
      const resp = await apiFetch('/conta/atual');

      if (!resp.ok) {
        console.warn('[Conta] /conta/atual returned', resp.status);
        return;
      }

      const data = await resp.json();
      setContaAtual(data);
    } catch (error) {
      console.error("Erro ao buscar conta atual:", error);
    }
  };

  fetchContaAtual();
}, []);


const [bancos, setBancos] = useState<BancoItem[]>([]);
const [showPopup, setShowPopup] = useState(false);
const [showEditPopup, setShowEditPopup] = useState(false);
const [bancoParaEditar, setBancoParaEditar] = useState<BancoItem | null>(null);

useEffect(() => {
  const token = Cookies.get('token');
  if (!token) return;

  const fetchBancos = async () => {
    try {
      const resp = await apiFetch('/conta/banco');
      if (!resp.ok) {
        console.warn('[Conta] /conta/banco returned', resp.status);
        return;
      }

      const data = await resp.json();
      setBancos(data);
    } catch (error) {
      console.error("Erro ao buscar bancos:", error);
    }
  };

  fetchBancos();
}, [showPopup, showEditPopup]);

  // Calcula saldo total
  const saldoTotal = bancos.reduce((total, banco) => total + (banco.saldo || 0), 0);

  // Dados para pegar a receita e despesa mensal 
  const [receita, setReceita] = useState<number | null>(null);
  const [despesa, setDespesa] = useState<number | null>(null);


  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) return;

    const fetchValores = async () => {
      try {
        const receitaResp = await apiFetch('/conta/banco/transacao/receita');
        if (!receitaResp.ok) {
          console.warn('[Conta] receita endpoint returned', receitaResp.status);
          return;
        }


        const despesaResp = await apiFetch('/conta/banco/transacao/despesa');
        if (!despesaResp.ok) {
          console.warn('[Conta] despesa endpoint returned', despesaResp.status);
          return;
        }


        const receitaValor = await receitaResp.json();
        const despesaValor = await despesaResp.json();

        setReceita(typeof receitaValor === 'number' ? receitaValor : 0);
        setDespesa(typeof despesaValor === 'number' ? despesaValor : 0);

      } catch (error) {
        console.error("Erro ao buscar valores:", error);
      }
    };

    fetchValores();
  }, []);



  // Obter nome do mês atual
  const nomeMes = new Date().toLocaleString('pt-BR', { month: 'long' });
  const mesFormatado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

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

  // Função para editar banco
  const handleEditBanco = (banco: BancoItem) => {
    setBancoParaEditar(banco);
    setShowEditPopup(true);
  };

  // Função para deletar banco
  const handleDeleteBanco = async (bancoId: number) => {
    if (!window.confirm("Tem certeza que deseja deletar este banco? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const deleteUrl = API_ENDPOINTS.BANCO.DELETAR(bancoId);
      console.log('Deletando banco:', bancoId, 'URL:', deleteUrl);
      
      // Faz a requisição DELETE
      const response = await api.delete(deleteUrl);
      console.log('Resposta do delete:', response.status, response.data);
      
      // Verifica se a resposta foi bem-sucedida (200 OK ou 204 NO CONTENT)
      // O backend retorna status 200 com uma string "Banco deletado com sucesso!"
      if (response.status === 200 || response.status === 204) {
        // Remove o banco da lista localmente para feedback imediato
        setBancos(prevBancos => prevBancos.filter(banco => banco.id !== bancoId));
        
        // Recarrega a lista de bancos do servidor para garantir sincronização
        // Usa setTimeout para dar tempo do backend processar a exclusão
        setTimeout(async () => {
          try {
            const resp = await apiFetch('/conta/banco');
            if (resp.ok) {
              const data = await resp.json();
              setBancos(data);
            }
          } catch (fetchError) {
            console.warn("Erro ao recarregar lista de bancos:", fetchError);
            // Não mostra erro ao usuário, pois a exclusão já foi bem-sucedida
          }
        }, 300);
      }
    } catch (error: any) {
      console.error("Erro ao deletar banco:", error);
      
      // Tratamento detalhado de erros
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 401 || status === 403) {
          alert("Erro de autenticação. Token inválido ou expirado. Faça login novamente.");
          Cookies.remove('token');
          navigate('/login');
        } else if (status === 404) {
          alert("Banco não encontrado. O banco pode já ter sido deletado.");
          // Recarrega a lista mesmo assim
          const resp = await apiFetch('/conta/banco');
          if (resp.ok) {
            const data = await resp.json();
            setBancos(data);
          }
        } else if (status === 400 || status === 500) {
          // Tenta extrair a mensagem de erro do backend
          let errorMessage = "Não foi possível deletar o banco.";
          
          if (typeof errorData === 'string') {
            errorMessage = errorData;
          } else if (errorData?.message) {
            errorMessage = errorData.message;
          } else if (errorData?.error) {
            errorMessage = errorData.error;
          }
          
          // Verifica se a mensagem menciona transações
          if (errorMessage.toLowerCase().includes('transação') || 
              errorMessage.toLowerCase().includes('transacao')) {
            alert(`⚠️ ${errorMessage}\n\nPara deletar este banco, você precisa primeiro deletar todas as transações associadas a ele.`);
          } else {
            alert(`Erro: ${errorMessage}`);
          }
        } else if (status >= 500) {
          alert("Erro interno do servidor. Tente novamente mais tarde.");
        } else {
          alert(`Erro ao deletar banco (Status ${status}). Tente novamente.`);
        }
      } else if (error.request) {
        alert("Erro de conexão com o servidor. Verifique sua conexão com a internet.");
      } else {
        alert("Erro ao processar a requisição. Tente novamente.");
      }
    }
  };

  // Função para atualizar banco após edição
  const handleUpdateBanco = () => {
    setShowEditPopup(false);
    setBancoParaEditar(null);
    // Recarrega a lista de bancos
    const fetchBancos = async () => {
      try {
        const resp = await apiFetch('/conta/banco');
        if (resp.ok) {
          const data = await resp.json();
          setBancos(data);
        }
      } catch (error) {
        console.error("Erro ao buscar bancos:", error);
      }
    };
    fetchBancos();
  };

  return (
    <>
      {/* Header azul com navegação */}
      <header className="header-main">
        <div className="logo">
          <img src="/Logo-Completa.png" alt="Solvian" className="logo-image" />
        </div>
        <nav className="header-nav">
          <button className="nav-tab active">Visão geral</button>
          <button className="nav-tab" onClick={() => navigate('/relatorios')}>Relatórios</button>
          <button 
            className="nav-tab" 
            onClick={() => navigate('/perfil')}
          >
            Perfil
          </button>
          <button 
            className="nav-tab"
            onClick={() => {
              // Scroll para a seção de bancos
              const banksSection = document.querySelector('.balance-accounts-card');
              if (banksSection) {
                banksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
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

      {/* Container principal com grid */}
      <div className="app">
        <div className="dashboard-grid">
          
          {/* Card de Perfil do Usuário */}
          <div className="card profile-card">
            <div className="profile-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div className="profile-content">
              <p className="greeting-text">Bem vindo,</p>
              <h2 className="user-name">
                {contaAtual ? contaAtual.titular : "Carregando..."}
              </h2>
              <div className="status-section">
                <span className="status-label">Status</span>
                <div className="status-active">
                  <span className="status-dot"></span>
                  <span>Ativo</span>
                </div>
              </div>
            </div>
          </div>

{/* Card Único de Receita + Despesa Mensal */}
<div className="card financial-summary-card">
  <div className="financial-summary-header">
    <div className="financial-item income">
      <p className="item-label">Receita mensal</p>
      <p className="item-value income-value">
        {receita !== null
          ? receita.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
          : "R$ 0,00"}
      </p>
    </div>

    <div className="divider"></div>

    <div className="financial-item expense">
      <p className="item-label">Despesa mensal</p>
      <p className="item-value expense-value">
        {despesa !== null
          ? despesa.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
          : "R$ 0,00"}
      </p>
    </div>
  </div>

  <button className="view-more-btn" onClick={() => navigate('/relatorios')}>
    Ver mais
  </button>
</div>

          {/* Card de Conexões Ativas */}
          <div className="card connections-card">
            <h3 className="card-title">Conexões Ativas</h3>
            <div className="connection-icons">
              {contaAtual && contaAtual.bancos && contaAtual.bancos.length > 0 ? (
                <>
                  {contaAtual.bancos.map((banco) => (
                    <div key={banco.id} className="connection-icon">
                      <img
                        src={getBankLogo(banco.nomeBanco, banco.bancoUrl)}
                        alt={banco.nomeBanco}
                        className="connection-logo"
                        onError={(e) => {
                          // Fallback se a imagem não carregar
                          const target = e.target as HTMLImageElement;
                          target.src = banco.bancoUrl || '';
                        }}
                      />
                    </div>
                  ))}
                  <button className="connection-icon add-connection" onClick={() => setShowPopup(true)}>
                    <span>+</span>
                  </button>
                </>
              ) : (
                <button className="connection-icon add-connection" onClick={() => setShowPopup(true)}>
                  <span>+</span>
                </button>
              )}
            </div>
            <button className="manage-accounts-btn">Gerenciar bancos</button>
          </div>

          {/* Card de Saldo Geral e Meus Bancos */}
          <div className="card balance-accounts-card">
            <div className="balance-section">
              <div className="card-blue-line"></div>
              <div className="card-content-header">
                <div className="card-content">
                  <p className="card-label">Saldo geral</p>
                  <h3 className="card-value">
                    {saldoTotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </h3>
                </div>
                <button className="add-account-btn" onClick={() => setShowPopup(true)}>
                  Adicionar
                </button>
              </div>
            </div>
            <div className="accounts-section">
              <h3 className="card-title">Meus bancos</h3>
              <div className="accounts-list">
                {bancos.length === 0 ? (
                  <p className="empty-state">Nenhuma conta cadastrada.</p>
                ) : (
                  bancos.map((banco) => (
                    <div key={banco.id} className="account-item">
                      <div className="bank-icon">
                        <img
                          src={getBankLogo(banco.nomeBanco, banco.bancoUrl)}
                          alt={banco.nomeBanco}
                          className="bank-logo-small"
                          onError={(e) => {
                            // Fallback se a imagem não carregar
                            const target = e.target as HTMLImageElement;
                            target.src = banco.bancoUrl || '';
                          }}
                        />
                      </div>
                      <div className="account-details">
                        <span className="bank-name">{banco.nomeBanco}</span>
                        <span className="account-balance">
                          {(banco.saldo || 0).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </div>
                      <div className="account-actions">
                        <button 
                          className="edit-account-btn" 
                          onClick={() => handleEditBanco(banco)}
                          aria-label="Editar conta"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button 
                          className="delete-account-btn" 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteBanco(banco.id);
                          }}
                          aria-label="Deletar conta"
                          type="button"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Card de Extrato e Histórico de Transações */}
          <div className="card statement-transactions-card">
            <div className="statement-section">
              <div className="card-blue-line"></div>
              <div className="card-content">
                <p className="card-label">Extrato de {mesFormatado}</p>
                <h3 className="card-value">
                  {receita !== null
                    ? receita.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    : "R$ 0,00"}
                </h3>
              </div>
            </div>
            <div className="transactions-section">
              <h3 className="card-title">Histórico de Transações</h3>
              <HistoricoTransacoes />
            </div>
          </div>

        </div>
      </div>

      {/* POPUP */}
      {showPopup && (
        <PopupForm 
          onClose={() => {
            setShowPopup(false);
            // Recarrega a lista de bancos
            const fetchBancos = async () => {
              try {
                const resp = await apiFetch('/conta/banco');
                if (resp.ok) {
                  const data = await resp.json();
                  setBancos(data);
                }
              } catch (error) {
                console.error("Erro ao buscar bancos:", error);
              }
            };
            fetchBancos();
          }} 
        />
      )}
      {showEditPopup && bancoParaEditar && (
        <PopupEdit
          banco={bancoParaEditar}
          onClose={() => {
            setShowEditPopup(false);
            setBancoParaEditar(null);
          }}
          onUpdate={handleUpdateBanco}
        />
      )}
    </>
  );
};

export default Conta;