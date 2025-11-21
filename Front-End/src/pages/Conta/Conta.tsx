import React, { useState } from "react";
import PopupForm from "../../components/PopupAdd/PopupAdd";
import "./Conta.css";
import HistoricoTransacoes from "../../components/HistoricoTransacoes/HistoricoTransacoes";

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
  const [contas] = useState<Conta[]>([
    {
      id: 1,
      titular: "João Silva",
      saldo: 6312.48,
      bancos: [
        { nome: "Banco Inter", numero: 12345 }
      ]
    },
    {
      id: 2,
      titular: "Maria Santos",
      saldo: 2500.00,
      bancos: [
        { nome: "C6 Bank", numero: 67890 }
      ]
    }
  ]);
  
  const [showPopup, setShowPopup] = useState(false);

  // Calcula saldo total
  const saldoTotal = contas.reduce((total, conta) => total + conta.saldo, 0);



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
            <h1 className="user-name">João Silva</h1>
          </div>

          <div className="financial-summary">
            <div className="financial-item income">
              <p className="item-label">Receita mensal</p>
              <p className="item-value income-value">R$ 1.100,00</p>
            </div>
            <div className="vertical-divider"></div>
            <div className="financial-item expense">
              <p className="item-label">Despesa mensal</p>
              <p className="item-value expense-value">- R$ 400,00</p>
            </div>
          </div>

          <div className="connections-section">
            <p className="item-label connections-label">Conexões Ativas</p>
            <div className="connection-icons">
              <div className="connection-icon icon-orange"></div>
              <div className="connection-icon icon-black">C6</div>
              <div className="connection-icon icon-add">+</div>
            </div>
          </div>

          <button className="view-more-link">Ver mais</button>
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
