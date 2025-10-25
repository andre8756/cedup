import { useEffect, useState } from "react";
import PopupForm from "../../components/PopupAdd/PopupAdd";
import "./Conta.css";

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

function Conta() {
  const [showPopup, setShowPopup] = useState(false);
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dadosExemplo: Conta[] = [
      {
        id: 1,
        titular: "Exemplo",
        saldo: 1000,
        bancos: [{ nome: "Banco Exemplo", numero: 1 }],
      },
    ];
    setContas(dadosExemplo);
    setLoading(false);
  }, []);

  const saldo = contas.reduce((total, conta) => total + conta.saldo, 0);

  const handleAddConta = async (novaConta: { titular: string; nomeBanco: string; saldo: number }) => {
    try {
      const response = await fetch("http://localhost:8080/conta/1/banco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaConta),
      });

      if (!response.ok) throw new Error("Erro ao adicionar conta");

      const contaSalva: Conta = await response.json();
      setContas((prev) => [...prev, contaSalva]);
      setShowPopup(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao adicionar conta!");
    }
  };

  if (loading) return <p className="loading">Carregando contas...</p>;

  return (
    <>
      <header className="header-main">
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

      <div className="app">
        <section>
          <h2 className="vision">Visão Geral</h2>
          <button className="btn-historico">Histórico</button>

          <div className="overview-container">
            <div className="overview-card">
              <div className="welcome-section">
                <p className="greeting-text">Bem vindo,</p>
                <h1 className="user-name">{contas[0]?.titular || "Jorge"}</h1>
              </div>

              <div className="financial-summary">
                <div className="financial-item income">
                  <p className="item-label">Receita mensal</p>
                  <p className="item-value income-value">R$ 1.100,00</p>
                </div>
                <div className="vertical-divider"></div>
                <div className="financial-item expense">
                  <p className="item-label">Despesa mensal</p>
                  <p className="item-value expense-value">- 400,00 R$</p>
                </div>
              </div>

              <div className="connections-section">
                <p className="item-label connections-label">Conexões Ativas</p>
                <div className="connection-icons">
                  <div className="connection-icon icon-orange">
                    <span className="icon-placeholder"></span>
                  </div>
                  <div className="connection-icon icon-black">C6</div>
                  <div className="connection-icon icon-add">+</div>
                </div>
              </div>

              <a href="#" className="view-more-link">Ver mais</a>
              <a href="#" className="manage-accounts-link">Gerenciar contas</a>
            </div>
          </div>
        </section>

        <section className="accounts" aria-label="Suas Contas">
          <div className="accounts-header">
            <h2 className="section-title" style={{ margin: 0 }}>Suas Contas</h2>
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
                    <div className="menu-dots" aria-label="Menu">...</div>
                  </div>
                  <div>
                    <div className="available-label">Saldo disponível</div>
                    <div className="available-balance">
                      {conta.saldo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

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

      {showPopup && <PopupForm onClose={() => setShowPopup(false)} onSubmit={handleAddConta} />}
    </>
  );
}

export default Conta;
