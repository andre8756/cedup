import React, { useState } from "react";
import PopupForm from "../../components/PopupAdd/PopupAdd";
import "./Conta.css";
import HistoricoTransacoes from "../../components/HistoricoTransacoes/HistoricoTransacoes";
// API_BASE_URL resolved at runtime by src/config/api.ts if needed (not used directly here)
import Cookies from 'js-cookie';
import { apiFetch } from '../../config/apiClient';
import { useEffect } from "react";

interface Banco {
  nome: string;
  numero: number;
}

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
  const saldoTotal = contas.reduce((total, conta) => total + conta.saldo, 0);

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

        setReceita(receitaValor);
        setDespesa(despesaValor);

      } catch (error) {
        console.error("Erro ao buscar valores:", error);
      }
    };

    fetchValores();
  }, []);



  return (
    <>
      <header className="header-main">
        <div className="logo">
          <h1>My Finances</h1>
          <p>Gestão Financeira Inteligente</p>
        </div>
        <div className="header-buttons">
          <button className="config">Configurações</button>
          <button className="add" onClick={() => setShowPopup(true)}>Adicionar</button>
        </div>
      </header>

<div className="app">
  {/* Container de toda a área principal */}
  <div className="main-content">
    
    {/* Visão Geral */}
    <section className="overview-section">
      <div className="overview-container">
        <div className="overview-card">
          <div className="welcome-section">
            <p className="greeting-text">Bem vindo,</p>
            <h1 className="user-name">
              {contaAtual ? contaAtual.titular : "Carregando..."}
            </h1>
          </div>

          <div className="financial-summary">
            <div className="financial-item income">
              <p className="item-label">Receita mensal</p>
              <p className="item-value income-value">
                {receita !== null
                  ? receita.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                  : "Carregando..."}
              </p>

            </div>
            <div className="vertical-divider"></div>
            <div className="financial-item expense">
              <p className="item-label">Despesa mensal</p>
              <p className="item-value expense-value">
                {despesa !== null
                  ? despesa.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                  : "Carregando..."}
              </p>
            </div>
          </div>

         <div className="connections-section">
          <p className="item-label connections-label">Conexões Ativas</p>
          <div className="connection-icons">

            {contaAtual ? (
              <article className="account-card">
                <div className="account-header">
                  <div className="account-info">
                    <strong>{contaAtual.titular}</strong>
                    {contaAtual.bancos?.map((banco) => (
                      <small key={banco.numero}>
                        {banco.nome} - {banco.numero}
                      </small>
                    ))}
                  </div>
                  <div className="menu-dots">...</div>
                </div>
              </article>
            ) : (
              <p>Carregando conexão...</p>
            )}


          </div>
        </div>

    
          <button className="manage-accounts-link">Gerenciar Contas</button>
        </div>
      </div>
    </section>

    <div className="finance-sections">
      <section className="accounts" aria-label="Suas Contas">
        <div className="accounts-header">
          <div className="left-side">
            <div className="Saldo-geral">
              <p>Saldo geral</p>
              <small>
                {saldoTotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </small>
            </div>
            <p className="section-title">Minhas Contas</p>
          </div>
          <button onClick={() => setShowPopup(true)}>Nova Conta</button>
        </div>

        <div className="account-cards">
          {contas.length === 0 ? (
            <p>Nenhuma conta cadastrada.</p>
          ) : (
            contas.map((conta) => (
              <article key={conta.id} className="account-card" aria-label={conta.titular}>
                <div className="account-header">
                  <div className="account-info">
                    <strong>{conta.titular}</strong>
                    {conta.bancos?.map((banco) => (
                      <small key={banco.numero}>
                        {banco.nome} - {banco.numero}
                      </small>
                    ))}
                  </div>
                  <div className="menu-dots" aria-label="Menu">
                    ...
                  </div>
                </div>
                <div className="available-label">
                  Saldo geral
                  <div className="saldo">
                    {conta.saldo.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
      <div className="history-card">
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
