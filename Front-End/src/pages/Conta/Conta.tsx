import React, { useEffect, useState } from "react";
import PopupForm from "../../components/PopupAdd/PopupAdd";
import "./Conta.css";

interface Conta {
  id: number;
  titular: string;
  instituicao: string;
  saldo: number;
  numero: string;
}

function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/conta")
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao buscar contas");
        return response.json();
      })
      .then((data) => setContas(data))
      .catch((error) => console.error("Erro ao buscar contas:", error))
      .finally(() => setLoading(false));
  }, []);

  const saldoTotal = contas.reduce((total, conta) => total + conta.saldo, 0);

  const handleAddConta = async (novaConta: { titular: string; instituicao: string; saldo: number }) => {
    try {
      const response = await fetch("http://localhost:8080/conta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaConta),
      });

      if (!response.ok) throw new Error("Erro ao adicionar conta");

      const contaSalva: Conta = await response.json(); // retorna id e numero
      setContas(prev => [...prev, contaSalva]);
      setShowPopup(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao adicionar conta!");
    }
  };

  if (loading) return <p className="loading">Carregando contas...</p>;

  return (
    <>
      <div className="app">
        <header>
          <div className="logo">
            <h1>My Finances</h1>
            <p>Gestão Financeira Inteligente</p>
          </div>

          <div className="header-buttons">
            <button className="config">Configurações</button>
            <button className="add" onClick={() => setShowPopup(true)}>
              Adicionar
            </button>
          </div>
        </header>

        <section>
          <h2 className="vision">Visão Geral</h2>
          <button className="btn-historico">Histórico</button>

          <div className="overview-cards">
            <div className="card total">
              <div className="card-text">
                <small>Saldo Total</small>
                <strong>
                  {saldoTotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section className="accounts" aria-label="Suas Contas">
          <div className="accounts-header">
            <h2 className="section-title" style={{ margin: 0 }}>
              Suas Contas
            </h2>
            <button onClick={() => setShowPopup(true)}>Nova Conta</button>
          </div>

          <div className="account-cards">
            {contas.length === 0 ? (
              <p>Nenhuma conta cadastrada.</p>
            ) : (
              contas.map((conta) => (
                <article
                  key={conta.id}
                  className="account-card"
                  aria-label={`${conta.titular}, ${conta.instituicao}`}
                >
                  <div className="account-header">
                    <div className="account-info">
                      <strong>{conta.titular}</strong>
                      <small>{conta.instituicao}</small>
                    </div>
                    <div className="menu-dots" aria-label="Menu">...</div>
                  </div>
                  <div>
                    <div className="available-label">Saldo disponível</div>
                    <div className="available-balance">
                      {conta.saldo.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </div>
                  </div>
                  <div className="account-number">.... {conta.numero}</div>
                </article>
              ))
            )}
          </div>

          {/* Investimentos fixo (exemplo) */}
          <article className="account-card" aria-label="Investimentos, XP Investimentos">
            <div className="account-header">
              <div className="account-info">
                <strong>Investimentos</strong>
                <small>XP Investimentos</small>
              </div>
              <div className="menu-dots" aria-label="Menu">...</div>
            </div>
            <div>
              <div className="available-label">Saldo disponível</div>
              <div className="available-balance">R$ 17.230,73</div>
            </div>
            <span className="tag investment">Investimento</span>
            <div className="account-number">.... 68-7</div>
          </article>
        </section>

        <section className="transactions" aria-label="Transações Recentes">
          <h2>Transações Recentes</h2>
          <div className="transaction-item" role="listitem">
            <div className="transaction-info">
              <strong className="transaction-title">Salário</strong>
              <div className="transaction-tags">
                <small className="receita">Receita</small>
                <small>Salário</small>
                <small>Banco do Brasil</small>
              </div>
            </div>
            <div>
              <div className="transaction-amount">+R$ 381,00</div>
              <div className="transaction-date">7/02/2024</div>
            </div>
          </div>
        </section>
      </div>

      {/* POPUP */}
      {showPopup && (
        <PopupForm
          onClose={() => setShowPopup(false)}
          onSubmit={handleAddConta} 
        />
      )}
    </>
  );
}

export default Home;
