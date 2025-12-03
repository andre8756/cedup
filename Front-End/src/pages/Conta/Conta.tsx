import React, { useState } from "react";
import PopupForm from "../../components/PopupAdd/PopupAdd";
import "./Conta.css";
import HistoricoTransacoes from "../../components/HistoricoTransacoes/HistoricoTransacoes";
// API_BASE_URL resolved at runtime by src/config/api.ts if needed (not used directly here)
import Cookies from 'js-cookie';
import { apiFetch } from '../../config/apiClient';
import { useEffect } from "react";

interface Banco {
  id: number
  numero: number;
  bancoUrl: string
  nomeBanco: string;
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

const Conta: React.FC = () => {
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


const [contas, setContas] = useState<Conta[]>([]);
useEffect(() => {
  const token = Cookies.get('token');
  if (!token) return;

  const fetchContas = async () => {
    try {
      const resp = await apiFetch('/conta/banco');
      if (!resp.ok) {
        console.warn('[Conta] /conta/banco returned', resp.status);
        return;
      }

      const data = await resp.json();
      setContas(data);
    } catch (error) {
      console.error("Erro ao buscar contas:", error);
    }
  };

  fetchContas();
}, []);
  const [showPopup, setShowPopup] = useState(false);

  // Calcula saldo total
  const saldoTotal = contas.reduce((total, conta) => total + (conta.saldo || 0), 0);

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

  return (
    <>
      {/* Header azul com navegação */}
      <header className="header-main">
        <div className="logo">
          <img src="/Logo-Completa.png" alt="Solvian" className="logo-image" />
        </div>
        <nav className="header-nav">
          <button className="nav-tab active">Visão geral</button>
          <button className="nav-tab">Relatórios</button>
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

  <button className="view-more-btn">Ver mais</button>
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
            <button className="manage-accounts-btn">Gerenciar contas</button>
          </div>

          {/* Card de Saldo Geral e Minhas Contas */}
          <div className="card balance-accounts-card">
            <div className="balance-section">
              <div className="card-blue-line"></div>
              <div className="card-content">
                <p className="card-label">Saldo geral</p>
                <h3 className="card-value">
                  {saldoTotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </h3>
              </div>
            </div>
            <div className="accounts-section">
              <h3 className="card-title">Minhas contas</h3>
              <div className="accounts-list">
                {contas.length === 0 ? (
                  <p className="empty-state">Nenhuma conta cadastrada.</p>
                ) : (
                  contas.map((conta) => (
                    <div key={conta.id} className="account-item">
                      {conta.bancos && conta.bancos.length > 0 ? (
                        <>
                          <div className="bank-icon">
                            <img
                              src={getBankLogo(conta.bancos[0].nomeBanco, conta.bancos[0].bancoUrl)}
                              alt={conta.bancos[0].nomeBanco}
                              className="bank-logo-small"
                              onError={(e) => {
                                // Fallback se a imagem não carregar
                                const target = e.target as HTMLImageElement;
                                target.src = conta.bancos[0].bancoUrl || '';
                              }}
                            />
                          </div>
                          <div className="account-details">
                            <span className="bank-name">{conta.bancos[0].nomeBanco}</span>
                            <span className="account-balance">
                              {(conta.saldo || 0).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="account-details">
                          <span className="bank-name">{conta.titular}</span>
                          <span className="account-balance">
                            {(conta.saldo || 0).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                        </div>
                      )}
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
      {showPopup && <PopupForm onClose={() => setShowPopup(false)} />}
    </>
  );
};

export default Conta;